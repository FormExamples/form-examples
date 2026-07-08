// Hematology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + abnormality-level dropdown + score-range dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.HematologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.HematologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  level: '',
  score: '' // '', '0', '1-20', '21-50', '51-75', '76-100'
};

// Default sort: specimen date descending. Most recent specimens float to the
// top — matches the SvelteKit dashboard's `sort-rows` init call.
const sortState = {
  key: 'specimenDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'mrn',                label: 'MRN' },
  { key: 'specimenDate',       label: 'Specimen Date' },
  { key: 'referringPhysician', label: 'Physician' },
  { key: 'abnormalityLevel',   label: 'Level' },
  { key: 'abnormalityScore',   label: 'Score' },
  { key: 'diagnosis',          label: 'Diagnosis' },
  { key: 'flagCount',          label: 'Flags' }
];

// Rank used when sorting the abnormalityLevel column so 'normal' is always
// less than 'critical' regardless of locale.
const levelRank = {
  'normal': 0,
  'mildAbnormality': 1,
  'moderateAbnormality': 2,
  'severeAbnormality': 3,
  'critical': 4,
  'draft': -1
};

// Human-readable labels for the abnormalityLevel column.
const levelLabels = {
  'normal': 'Normal',
  'mildAbnormality': 'Mild',
  'moderateAbnormality': 'Moderate',
  'severeAbnormality': 'Severe',
  'critical': 'Critical',
  'draft': 'Draft'
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

function levelLabel(level) {
  return levelLabels[level] || level || 'Unknown';
}

function levelClass(level) {
  if (!level) return '';
  return 'level-' + level;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.level !== '' ||
    filters.score !== ''
  );
}

/**
 * Test a numeric score against a score-range filter value.
 * Mirrors `scoreInRange` in the SvelteKit dashboard.
 */
function scoreInRange(score, range) {
  switch (range) {
    case '0':      return score === 0;
    case '1-20':   return score >= 1  && score <= 20;
    case '21-50':  return score >= 21 && score <= 50;
    case '51-75':  return score >= 51 && score <= 75;
    case '76-100': return score >= 76 && score <= 100;
    default:       return true;
  }
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PatientRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientName.toLowerCase().includes(term) ||
      row.mrn.toLowerCase().includes(term) ||
      row.referringPhysician.toLowerCase().includes(term) ||
      (row.diagnosis || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.level && row.abnormalityLevel !== filters.level) {
    return false;
  }
  if (filters.score && !scoreInRange(row.abnormalityScore, filters.score)) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'abnormalityLevel') {
    av = levelRank[av] ?? -1;
    bv = levelRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'abnormalityScore' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (patientName, mrn, specimenDate ISO,
  // referringPhysician, diagnosis). ISO dates compare correctly as strings.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return patients.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('patients-table-head');
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
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
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
    if (row.abnormalityLevel === 'critical') {
      tr.classList.add('row-critical');
    }

    const flagClass = row.flagCount > 0 ? 'flag-nonzero' : 'flag-zero';

    tr.innerHTML = `
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.mrn)}</td>
      <td>${esc(row.specimenDate)}</td>
      <td>${esc(row.referringPhysician)}</td>
      <td><span class="level-badge ${levelClass(row.abnormalityLevel)}">${esc(levelLabel(row.abnormalityLevel))}</span></td>
      <td><span class="score-value">${esc(row.abnormalityScore)}%</span></td>
      <td class="cell-diagnosis">${esc(row.diagnosis)}</td>
      <td><span class="flag-badge ${flagClass}">${esc(row.flagCount)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = patients.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No patients to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} patients`;
  } else {
    el.textContent = `Showing ${shown} of ${total} patients`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
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
  const level = document.getElementById('filter-level');
  const score = document.getElementById('filter-score');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (level) {
    level.addEventListener('change', () => {
      filters.level = level.value;
      renderAll();
    });
  }
  if (score) {
    score.addEventListener('change', () => {
      filters.score = score.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.level = '';
      filters.score = '';
      if (search) search.value = '';
      if (level) level.value = '';
      if (score) score.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPatients() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  patients = samplePatients;
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
