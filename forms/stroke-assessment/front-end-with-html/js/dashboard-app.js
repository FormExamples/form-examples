import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Stroke Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + NIHSS range dropdown + severity dropdown + tPA-eligible
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.StrokeAssessmentDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  nihss: '',         // '', '0', '1-4', '5-15', '16-20', '21-42'
  severity: '',
  thrombolysis: ''   // '', 'yes', 'no'
};

// Default sort: NIHSS score descending. Highest score = worst stroke = top
// of the list, surfacing the patients who most need clinical attention.
// Mirrors the SvelteKit dashboard's init('sort-rows', { key: 'nihssScore',
// order: 'desc' }).
const sortState = {
  key: 'nihssScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',            label: 'NHS Number' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'nihssScore',           label: 'NIHSS Score' },
  { key: 'strokeSeverity',       label: 'Stroke Severity' },
  { key: 'onsetTime',            label: 'Onset Time' },
  { key: 'thrombolysisEligible', label: 'tPA Eligible' }
];

// Rank used when sorting the strokeSeverity column so 'No stroke symptoms'
// is always less than 'Severe stroke' regardless of locale.
const severityRank = {
  'No stroke symptoms': 0,
  'Minor stroke': 1,
  'Moderate stroke': 2,
  'Moderate to severe stroke': 3,
  'Severe stroke': 4
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

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/**
 * @param {number} score
 * @param {string} range
 * @returns {boolean}
 */
function nihssInRange(score, range) {
  switch (range) {
    case '0':     return score === 0;
    case '1-4':   return score >= 1 && score <= 4;
    case '5-15':  return score >= 5 && score <= 15;
    case '16-20': return score >= 16 && score <= 20;
    case '21-42': return score >= 21 && score <= 42;
    default:      return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.nihss !== '' ||
    filters.severity !== '' ||
    filters.thrombolysis !== ''
  );
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
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      row.strokeSeverity.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.nihss && !nihssInRange(row.nihssScore, filters.nihss)) {
    return false;
  }
  if (filters.severity && row.strokeSeverity !== filters.severity) {
    return false;
  }
  if (filters.thrombolysis === 'yes' && !row.thrombolysisEligible) return false;
  if (filters.thrombolysis === 'no' && row.thrombolysisEligible) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'strokeSeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'thrombolysisEligible') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'nihssScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, onsetTime).
  // ISO "YYYY-MM-DDTHH:MM" sorts correctly lexicographically.
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
    if (row.strokeSeverity === 'Severe stroke') {
      tr.classList.add('row-severe-stroke');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="nihss-score">${esc(row.nihssScore)}/42</span></td>
      <td><span class="severity-badge ${severityClass(row.strokeSeverity)}">${esc(row.strokeSeverity)}</span></td>
      <td><span class="onset-time">${esc(row.onsetTime)}</span></td>
      <td>
        <span class="thrombolysis-badge ${row.thrombolysisEligible ? 'thrombolysis-yes' : 'thrombolysis-no'}">
          ${row.thrombolysisEligible ? 'Yes' : 'No'}
        </span>
      </td>
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
  const nihss = document.getElementById('filter-nihss');
  const severity = document.getElementById('filter-severity');
  const thrombolysis = document.getElementById('filter-thrombolysis');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (nihss) {
    nihss.addEventListener('change', () => {
      filters.nihss = nihss.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (thrombolysis) {
    thrombolysis.addEventListener('change', () => {
      filters.thrombolysis = thrombolysis.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.nihss = '';
      filters.severity = '';
      filters.thrombolysis = '';
      if (search) search.value = '';
      if (nihss) nihss.value = '';
      if (severity) severity.value = '';
      if (thrombolysis) thrombolysis.value = '';
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
