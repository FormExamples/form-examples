import { fetchCandidates } from './api.js';
import { sampleCandidates } from './data.js';

// Lifeguard Certification Checklist - training coordinator dashboard
// (vanilla classic-script app).
//
// On boot we fetch the candidate list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + outcome dropdown + venue-type dropdown +
// certification-currency dropdown + examiner dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.LifeguardCertificationChecklistDashboard`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.

// ----------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------

// Number of days from "today" within which an active certificate counts
// as "Expiring Soon". Anything earlier is "Expired"; anything later is
// "Current". Matches the SvelteKit dashboard's threshold.
const EXPIRING_SOON_DAYS = 60;

// One day in milliseconds (used for date arithmetic).
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').CandidateRow[]} */
let candidates = [];

const filters = {
  search: '',
  outcome: '',
  venueType: '',
  currency: '',
  examiner: ''
};

// Default sort: failed first, needs-development next, then by
// certification expiry ascending so the most-overdue / soonest-to-expire
// records bubble to the top of the list. Implemented as a virtual
// `default` sort key (see `compareRows`).
const sortState = {
  key: 'default',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and
// the row-cell renderer below.
const columns = [
  { key: 'candidateId',           label: 'Candidate ID' },
  { key: 'candidateName',         label: 'Candidate Name' },
  { key: 'venueType',             label: 'Venue Type' },
  { key: 'venueName',             label: 'Venue' },
  { key: 'outcome',               label: 'Outcome' },
  { key: 'timedSwimSeconds',      label: '100 m Swim (s)' },
  { key: 'competenciesPassed',    label: 'Competencies' },
  { key: 'certificationExpiry',   label: 'Expiry' },
  { key: 'certificationCurrency', label: 'Certification' },
  { key: 'cprRefresherDue',       label: 'CPR Refresher' },
  { key: 'examinerName',          label: 'Examiner' }
];

// Categorical rank tables — used by `compareRows` so categorical columns
// sort by clinical/operational importance rather than alphabetically.

// Pass < Needs Development < Fail so an ascending sort on the outcome
// column surfaces remediation cases at the bottom; the *default* sort
// inverts this so failures appear first.
const outcomeRank = {
  'Pass': 0,
  'Needs Development': 1,
  'Fail': 2
};

// Current is "best", Expired is "worst" — ascending sort surfaces the
// records that need re-certification first.
const currencyRank = {
  'Current': 0,
  'Expiring Soon': 1,
  'Expired': 2
};

// Stable, explicit venue-type ordering. Defined explicitly so the order
// is predictable regardless of locale.
const venueTypeRank = {
  'Pool': 0,
  'Beach': 1,
  'Leisure Centre': 2,
  'Water Park': 3,
  'Lido': 4,
  'Hotel Pool': 5
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
  return 'outcome-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function currencyClass(label) {
  if (!label) return '';
  return 'currency-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function rowClass(outcome) {
  if (outcome === 'Fail') return 'row-fail';
  if (outcome === 'Needs Development') return 'row-needs-development';
  return '';
}

/**
 * Parse an ISO "YYYY-MM-DD" date string into a Date at UTC midnight.
 * Returns null for empty / invalid input.
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

/** "Today" at UTC midnight, used for currency calculations. */
function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  ));
}

/**
 * Whole-day delta from `todayUtc()` to `expiry`. Negative => already
 * expired; positive => still valid. Returns +Infinity for a missing
 * expiry so rows with no certificate sort to the bottom of an ascending
 * "soonest expiry" sort.
 *
 * @param {string} expiryIso
 * @returns {number}
 */
function daysUntilExpiry(expiryIso) {
  const d = parseIsoDate(expiryIso);
  if (!d) return Number.POSITIVE_INFINITY;
  return Math.round((d.getTime() - todayUtc().getTime()) / MS_PER_DAY);
}

/**
 * Recompute the certification-currency band from the expiry date so the
 * dashboard stays correct even if "today" drifts past the seed values.
 *
 * @param {string} expiryIso
 * @returns {import('./types.js').CertificationCurrency}
 */
function computeCurrency(expiryIso) {
  const days = daysUntilExpiry(expiryIso);
  if (!isFinite(days)) return 'Expired';
  if (days < 0) return 'Expired';
  if (days <= EXPIRING_SOON_DAYS) return 'Expiring Soon';
  return 'Current';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.outcome !== '' ||
    filters.venueType !== '' ||
    filters.currency !== '' ||
    filters.examiner !== ''
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
      row.venueName.toLowerCase().includes(term) ||
      row.examinerName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.outcome !== filters.outcome) {
    return false;
  }
  if (filters.venueType && row.venueType !== filters.venueType) {
    return false;
  }
  if (filters.currency && row.certificationCurrency !== filters.currency) {
    return false;
  }
  if (filters.examiner && row.examinerName !== filters.examiner) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; date strings are sorted
 * by parsed timestamp; everything else uses a locale-aware string
 * compare.
 *
 * The virtual `default` key implements the dashboard's "failed first,
 * needs-development next, then expired-soonest" ordering.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;

  // Default sort: highest-severity outcome first (Fail > Needs
  // Development > Pass), then ascending by days-until-expiry so the
  // soonest-to-expire / already-expired records bubble up.
  if (key === 'default') {
    const ao = outcomeRank[a.outcome] ?? 0;
    const bo = outcomeRank[b.outcome] ?? 0;
    if (ao !== bo) {
      // Reverse: higher rank (Fail = 2) should come before lower rank.
      return (bo - ao) * dir;
    }
    const ad = daysUntilExpiry(a.certificationExpiry);
    const bd = daysUntilExpiry(b.certificationExpiry);
    if (ad !== bd) return (ad - bd) * dir;
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

  if (key === 'certificationCurrency') {
    av = currencyRank[av] ?? -1;
    bv = currencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'venueType') {
    av = venueTypeRank[av] ?? 99;
    bv = venueTypeRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'timedSwimSeconds' || key === 'competenciesPassed') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'certificationExpiry' || key === 'cprRefresherDue') {
    // Use days-until-date so empty/missing dates sort to the bottom of
    // an ascending sort (consistent with the default-sort behaviour).
    const ad = daysUntilExpiry(a[key]);
    const bd = daysUntilExpiry(b[key]);
    return (ad - bd) * dir;
  }

  // Default: string compare (candidateId, candidateName, venueName,
  // examinerName).
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    const rc = rowClass(row.outcome);
    if (rc) tr.classList.add(rc);

    const expiryDays = daysUntilExpiry(row.certificationExpiry);
    const expired = isFinite(expiryDays) && expiryDays < 0;
    const expiryDisplay = row.certificationExpiry || '\u2014';
    const issuedDisplay = row.certificationIssued || '\u2014';

    const cprDays = daysUntilExpiry(row.cprRefresherDue);
    const cprDue = isFinite(cprDays) && cprDays < 0;
    const cprDisplay = row.cprRefresherDue || '\u2014';

    const competenciesDisplay =
      `${esc(row.competenciesPassed)} / ${esc(row.competenciesTotal)}`;

    const criticalFlag = row.criticalCompetencyFailure
      ? '<span class="critical-flag" title="Critical-competency failure (timed swim, unconscious-casualty rescue, spinal handling, CPR depth/rate, AED delivery, or scanning effectiveness)">Critical</span>'
      : '';

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.candidateId)}</td>
      <td class="data-table-td">${esc(row.candidateName)}</td>
      <td class="data-table-td"><span class="venue-badge">${esc(row.venueType)}</span></td>
      <td class="data-table-td">${esc(row.venueName)}</td>
      <td class="data-table-td">
        <span class="outcome-badge ${outcomeClass(row.outcome)}">${esc(row.outcome)}</span>
        ${criticalFlag}
      </td>
      <td class="data-table-td"><span class="num-cell">${esc(row.timedSwimSeconds)}</span></td>
      <td class="data-table-td"><span class="num-cell">${competenciesDisplay}</span></td>
      <td class="data-table-td">
        <span class="date-cell ${expired ? 'date-expired' : ''}" title="Issued ${esc(issuedDisplay)}">
          ${esc(expiryDisplay)}
        </span>
      </td>
      <td class="data-table-td"><span class="currency-badge ${currencyClass(row.certificationCurrency)}">${esc(row.certificationCurrency)}</span></td>
      <td class="data-table-td">
        <span class="date-cell ${cprDue ? 'date-expired' : ''}" title="Annual CPR refresher due">
          ${esc(cprDisplay)}
        </span>
      </td>
      <td class="data-table-td">${esc(row.examinerName)}</td>
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
 * Populate the examiner <select> with the unique set of examiners present
 * in the loaded data. Preserves the user's current selection if the
 * examiner still exists; otherwise resets to "All examiners".
 */
function renderExaminerOptions() {
  const sel = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('filter-examiner')
  );
  if (!sel) return;

  const previous = filters.examiner;
  const names = Array.from(new Set(candidates.map((c) => c.examinerName)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  sel.innerHTML = '<option value="">All examiners</option>';
  for (const name of names) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  }

  if (previous && names.indexOf(previous) !== -1) {
    sel.value = previous;
  } else {
    sel.value = '';
    filters.examiner = '';
  }
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
  const venueType = document.getElementById('filter-venue-type');
  const currency = document.getElementById('filter-currency');
  const examiner = document.getElementById('filter-examiner');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = outcome.value;
      renderAll();
    });
  }
  if (venueType) {
    venueType.addEventListener('change', () => {
      filters.venueType = venueType.value;
      renderAll();
    });
  }
  if (currency) {
    currency.addEventListener('change', () => {
      filters.currency = currency.value;
      renderAll();
    });
  }
  if (examiner) {
    examiner.addEventListener('change', () => {
      filters.examiner = examiner.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.outcome = '';
      filters.venueType = '';
      filters.currency = '';
      filters.examiner = '';
      if (search) search.value = '';
      if (outcome) outcome.value = '';
      if (venueType) venueType.value = '';
      if (currency) currency.value = '';
      if (examiner) examiner.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

/**
 * Refresh `certificationCurrency` from `certificationExpiry` for every
 * row so the band stays correct relative to the actual current date.
 *
 * @param {import('./types.js').CandidateRow[]} rows
 * @returns {import('./types.js').CandidateRow[]}
 */
function withRecomputedCurrency(rows) {
  return rows.map((r) => ({
    ...r,
    certificationCurrency: computeCurrency(r.certificationExpiry)
  }));
}

async function loadCandidates() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  candidates = withRecomputedCurrency(sampleCandidates);
  renderExaminerOptions();
  renderAll();

  try {
    const items = await fetchCandidates();
    if (items && items.length > 0) {
      candidates = withRecomputedCurrency(items);
      renderExaminerOptions();
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
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
