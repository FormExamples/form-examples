import { fetchCandidates } from './api.js';
import { sampleCandidates } from './data.js';

// Emergency Medical Technician Psychomotor Examination - training
// coordinator dashboard (vanilla classic-script app).
//
// On boot we fetch the candidate list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + outcome dropdown + examiner dropdown + program/station
// dropdown + critical-failure dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').CandidateRow[]} */
let candidates = [];

const filters = {
  search: '',
  outcome: '',
  examiner: '',
  program: '',
  critical: '' // '' | 'yes' | 'no'
};

// Default sort: failed first, then ascending by exam date so the most
// recent failures bubble to the top of the action list. Implemented as a
// virtual `default` sort key (see `compareRows`).
const sortState = {
  key: 'default',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions - single source of truth for header rendering and
// the row-cell renderer below.
const columns = [
  { key: 'candidateId',     label: 'Candidate ID' },
  { key: 'candidateName',   label: 'Candidate Name' },
  { key: 'outcome',         label: 'Outcome' },
  { key: 'criticalReason',  label: 'Critical Reason' },
  { key: 'pointsEarned',    label: 'Points' },
  { key: 'examDate',        label: 'Exam Date' },
  { key: 'examinerName',    label: 'Examiner' },
  { key: 'program',         label: 'Program' },
  { key: 'stationType',     label: 'Station' }
];

// Categorical rank tables - used by `compareRows` so categorical columns
// sort by clinical/operational importance rather than alphabetically.

// Pass < Fail so an ascending sort surfaces remediation cases at the top
// when the user opts into a column-level sort. The "default" sort uses
// the inverse so failures bubble up by default (see `compareRows`).
const outcomeRank = {
  'Pass': 0,
  'Fail': 1
};

// Critical-criteria buckets ordered roughly by NREMT-checklist sequence
// (PPE first, transport-call last). An empty reason ranks before any
// triggered criterion so non-critical rows sort below critical ones in a
// descending sort, and above them in an ascending sort.
const criticalReasonRank = {
  '': 0,
  'PPE': 1,
  'Scene Safety': 2,
  'Oxygen': 3,
  'Airway / Breathing': 4,
  'Transport Decision': 5,
  'Dangerous Intervention': 6,
  'Spinal Protection': 7,
  'Transport Call': 8
};

// Station-type ordering so Medical groups before Trauma in alphabetical
// runs. Defined explicitly for predictability across locales.
const stationTypeRank = {
  'Patient Assessment - Medical': 0,
  'Patient Assessment - Trauma': 1
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function outcomeClass(label) {
  if (!label) return '';
  return 'outcome-' + String(label).toLowerCase();
}

/**
 * Parse an ISO "YYYY-MM-DD" date string into a Date at UTC midnight.
 * Returns null for empty / invalid input. Used for date-column sorting.
 *
 * @param {string} iso
 * @returns {Date | null}
 */
function parseIsoDate(iso) {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Numeric timestamp for an ISO date, with empty/invalid dates pushed to
 * the end of an ascending sort.
 *
 * @param {string} iso
 * @returns {number}
 */
function isoTimestamp(iso) {
  const d = parseIsoDate(iso);
  return d ? d.getTime() : Number.POSITIVE_INFINITY;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.outcome !== '' ||
    filters.examiner !== '' ||
    filters.program !== '' ||
    filters.critical !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').CandidateRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.candidateId.toLowerCase().includes(term) ||
      row.candidateName.toLowerCase().includes(term) ||
      row.program.toLowerCase().includes(term) ||
      row.stationType.toLowerCase().includes(term) ||
      row.examinerName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.outcome !== filters.outcome) {
    return false;
  }
  if (filters.examiner && row.examinerName !== filters.examiner) {
    return false;
  }
  if (filters.program && row.program !== filters.program) {
    return false;
  }
  if (filters.critical === 'yes' && !row.criticalFailure) {
    return false;
  }
  if (filters.critical === 'no' && row.criticalFailure) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; date strings are sorted by
 * parsed timestamp; everything else uses a locale-aware string compare.
 *
 * The virtual `default` key implements the dashboard's "failed first,
 * then most-recent-exam" ordering.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;

  // Default sort: Fail outcomes first, then descending by exam date so the
  // most recent failures bubble to the top of the coordinator's worklist.
  if (key === 'default') {
    const ao = outcomeRank[a.outcome] ?? 0;
    const bo = outcomeRank[b.outcome] ?? 0;
    if (ao !== bo) {
      // Reverse: Fail (rank 1) should come before Pass (rank 0).
      return (bo - ao) * dir;
    }
    const at = isoTimestamp(a.examDate);
    const bt = isoTimestamp(b.examDate);
    if (at !== bt) {
      // Most-recent first within each outcome group.
      return (bt - at) * dir;
    }
    // Tie-break for stability.
    return a.candidateName.localeCompare(b.candidateName) * dir;
  }

  let av = a[key];
  let bv = b[key];

  if (key === 'outcome') {
    av = outcomeRank[av] ?? -1;
    bv = outcomeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'criticalReason') {
    av = criticalReasonRank[av] ?? 99;
    bv = criticalReasonRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'stationType') {
    av = stationTypeRank[av] ?? 99;
    bv = stationTypeRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'pointsEarned') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'examDate') {
    return (isoTimestamp(a.examDate) - isoTimestamp(b.examDate)) * dir;
  }

  // Default: locale-aware string compare (candidateId, candidateName,
  // examinerName, program).
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return candidates.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('candidates-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '\u2195'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '\u2191';
      } else {
        ariaSort = 'descending';
        indicator = '\u2193';
      }
    }
    th.setAttribute('aria-sort', ariaSort);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sort-btn';
    btn.innerHTML =
      `<span>${esc(col.label)}</span>` +
      `<span class="sort-indicator" aria-hidden="true">${indicator}</span>`;
    btn.addEventListener('click', () => onSortClick(col.key));
    th.appendChild(btn);

    head.appendChild(th);
  }
}

function renderTableBody() {
  const body = document.getElementById('candidates-table-body');
  const empty = document.getElementById('candidates-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (rows.length === 0) {
    if (empty) empty.hidden = false;
  } else {
    if (empty) empty.hidden = true;
  }

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.outcome === 'Fail') {
      tr.classList.add('row-fail');
    }

    const examDateDisplay = row.examDate || '\u2014';

    const criticalFlag = row.criticalFailure
      ? '<span class="critical-flag" title="Critical-criteria failure (NREMT auto-fail)">Critical</span>'
      : '';

    const criticalReasonCell = row.criticalReason
      ? `<span class="critical-reason">${esc(row.criticalReason)}</span>`
      : '<span class="critical-reason critical-reason-empty">\u2014</span>';

    const pointsCell =
      `<span class="points-cell">` +
        `${esc(row.pointsEarned)}` +
        `<span class="points-total">/${esc(row.pointsPossible)}</span>` +
      `</span>`;

    tr.innerHTML = `
      <td>${esc(row.candidateId)}</td>
      <td>${esc(row.candidateName)}</td>
      <td>
        <span class="outcome-badge ${outcomeClass(row.outcome)}">${esc(row.outcome)}</span>
        ${criticalFlag}
      </td>
      <td>${criticalReasonCell}</td>
      <td>${pointsCell}</td>
      <td><span class="date-cell" title="Minimum passing: ${esc(row.minimumPassingPoints)} points">${esc(examDateDisplay)}</span></td>
      <td>${esc(row.examinerName)}</td>
      <td>${esc(row.program)}</td>
      <td><span class="program-badge">${esc(row.stationType)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = candidates.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No candidates to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} candidates`;
  } else {
    el.textContent = `Showing ${shown} of ${total} candidates`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

/**
 * Populate a select with the unique set of values for `field` present in
 * the loaded data. Preserves the user's current selection if the value
 * still exists; otherwise resets to the all-pass sentinel option.
 *
 * @param {HTMLSelectElement | null} sel
 * @param {keyof import('./types.js').CandidateRow} field
 * @param {keyof typeof filters} filterKey
 * @param {string} allLabel
 */
function populateDynamicOptions(sel, field, filterKey, allLabel) {
  if (!sel) return;
  const previous = filters[filterKey];
  const values = Array.from(
    new Set(candidates.map((c) => /** @type {string} */ (c[field])))
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  sel.innerHTML = `<option value="">${esc(allLabel)}</option>`;
  for (const v of values) {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    sel.appendChild(opt);
  }

  if (previous && values.indexOf(previous) !== -1) {
    sel.value = previous;
  } else {
    sel.value = '';
    filters[filterKey] = '';
  }
}

function renderExaminerOptions() {
  const sel = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('filter-examiner')
  );
  populateDynamicOptions(sel, 'examinerName', 'examiner', 'All examiners');
}

function renderProgramOptions() {
  const sel = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('filter-program')
  );
  populateDynamicOptions(
    sel,
    'program',
    'program',
    'All programs / stations'
  );
}

function renderAll() {
  renderTableHead();
  renderTableBody();
  renderFilterCount();
  renderClearButton();
}

function showStatusBanner(message) {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.hidden = false;
}

// ----------------------------------------------------------------------
// Event handlers
// ----------------------------------------------------------------------

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const outcome = document.getElementById('filter-outcome');
  const examiner = document.getElementById('filter-examiner');
  const program = document.getElementById('filter-program');
  const critical = document.getElementById('filter-critical');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = /** @type {HTMLInputElement} */ (search).value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = /** @type {HTMLSelectElement} */ (outcome).value;
      renderAll();
    });
  }
  if (examiner) {
    examiner.addEventListener('change', () => {
      filters.examiner = /** @type {HTMLSelectElement} */ (examiner).value;
      renderAll();
    });
  }
  if (program) {
    program.addEventListener('change', () => {
      filters.program = /** @type {HTMLSelectElement} */ (program).value;
      renderAll();
    });
  }
  if (critical) {
    critical.addEventListener('change', () => {
      filters.critical = /** @type {HTMLSelectElement} */ (critical).value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.outcome = '';
      filters.examiner = '';
      filters.program = '';
      filters.critical = '';
      if (search) /** @type {HTMLInputElement} */ (search).value = '';
      if (outcome) /** @type {HTMLSelectElement} */ (outcome).value = '';
      if (examiner) /** @type {HTMLSelectElement} */ (examiner).value = '';
      if (program) /** @type {HTMLSelectElement} */ (program).value = '';
      if (critical) /** @type {HTMLSelectElement} */ (critical).value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadCandidates() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  candidates = sampleCandidates.slice();
  renderExaminerOptions();
  renderProgramOptions();
  renderAll();

  try {
    const items = await fetchCandidates();
    if (items && items.length > 0) {
      candidates = items;
      renderExaminerOptions();
      renderProgramOptions();
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty - keep sample data and notify.
      showStatusBanner(
        'Showing sample data \u2014 backend returned no candidates.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data \u2014 backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadCandidates();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
