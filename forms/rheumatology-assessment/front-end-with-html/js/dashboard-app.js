import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Rheumatology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + disease-activity dropdown + diagnosis dropdown +
// allergy dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.RheumatologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  activity: '',
  diagnosis: '',
  allergy: '' // '', 'yes', 'no'
};

// Default sort: DAS28 score descending. Highest disease activity = top of
// the list, surfacing the patients who most need clinical attention. Null
// scores sort to the bottom.
const sortState = {
  key: 'das28Score',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'das28Score',       label: 'DAS28 Score' },
  { key: 'diseaseActivity',  label: 'Disease Activity' },
  { key: 'primaryDiagnosis', label: 'Primary Diagnosis' },
  { key: 'currentTreatment', label: 'Treatment' },
  { key: 'allergyFlag',      label: 'Allergy' }
];

// Rank used when sorting the diseaseActivity column so 'Remission' is always
// less than 'High' regardless of locale. 'Not calculated' sorts to the end.
const activityRank = {
  'Remission': 0,
  'Low': 1,
  'Moderate': 2,
  'High': 3,
  'Not calculated': 4
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

function activityClass(label) {
  if (!label) return '';
  return 'activity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.activity !== '' ||
    filters.diagnosis !== '' ||
    filters.allergy !== ''
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
      row.primaryDiagnosis.toLowerCase().includes(term) ||
      row.currentTreatment.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.activity && row.diseaseActivity !== filters.activity) {
    return false;
  }
  if (filters.diagnosis && row.primaryDiagnosis !== filters.diagnosis) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly
 * (with nulls sorted last); everything else uses a locale-aware string
 * compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'diseaseActivity') {
    av = activityRank[av] ?? 99;
    bv = activityRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'allergyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'das28Score') {
    // Null scores always sort to the bottom regardless of direction so they
    // never bury the active-disease patients at the top of the list.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryDiagnosis,
  // currentTreatment).
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

function renderDas28Cell(score) {
  if (score === null || score === undefined) {
    return `<span class="das28-score-na">N/A</span>`;
  }
  return `<span class="das28-score">${esc(Number(score).toFixed(2))}</span>`;
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
    if (row.diseaseActivity === 'High') {
      tr.classList.add('row-high-activity');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${renderDas28Cell(row.das28Score)}</td>
      <td><span class="activity-badge ${activityClass(row.diseaseActivity)}">${esc(row.diseaseActivity)}</span></td>
      <td>${esc(row.primaryDiagnosis)}</td>
      <td>${esc(row.currentTreatment)}</td>
      <td>
        <span class="allergy-badge ${row.allergyFlag ? 'allergy-yes' : 'allergy-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
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
  const activity = document.getElementById('filter-activity');
  const diagnosis = document.getElementById('filter-diagnosis');
  const allergy = document.getElementById('filter-allergy');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (activity) {
    activity.addEventListener('change', () => {
      filters.activity = activity.value;
      renderAll();
    });
  }
  if (diagnosis) {
    diagnosis.addEventListener('change', () => {
      filters.diagnosis = diagnosis.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.activity = '';
      filters.diagnosis = '';
      filters.allergy = '';
      if (search) search.value = '';
      if (activity) activity.value = '';
      if (diagnosis) diagnosis.value = '';
      if (allergy) allergy.value = '';
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
