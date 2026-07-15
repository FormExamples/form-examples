import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Sundowner Syndrome Assessment - clinician dashboard (vanilla
// classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity dropdown + dementia-type dropdown + residential-
// setting dropdown).
//
// Default sort surfaces the most clinically urgent patients first: severity
// descending so Critical sits at the top of the list. Within each severity
// rows are tied broken by CMAI score descending.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.SundownerSyndromeAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',
  dementia: '',
  setting: ''
};

// Default sort: severity descending — critical patients surface at the top
// of the list so they are seen first by the clinician on page load.
const sortState = {
  key: 'severity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'age',                label: 'Age' },
  { key: 'cmaiScore',          label: 'CMAI' },
  { key: 'npiScore',           label: 'NPI' },
  { key: 'severity',           label: 'Severity' },
  { key: 'dementiaType',       label: 'Dementia Type' },
  { key: 'residentialSetting', label: 'Setting' },
  { key: 'managementPlan',     label: 'Management Plan' }
];

// Rank used when sorting the severity column so 'Mild' is always less than
// 'Critical' regardless of locale.
const severityRank = {
  'Mild': 0,
  'Moderate': 1,
  'Severe': 2,
  'Critical': 3
};

// Rank used when sorting the dementiaType column. 'None' sits at the
// bottom so dementia diagnoses cluster together.
const dementiaRank = {
  "Alzheimer's": 0,
  'Vascular': 1,
  'Lewy Body': 2,
  'Mixed': 3,
  'Frontotemporal': 4,
  'None': 5
};

// Rank used when sorting the residentialSetting column — ordered roughly
// from least to most clinically supervised.
const settingRank = {
  'Own Home': 0,
  'Family Carer': 1,
  'Residential Care': 2,
  'Nursing Home': 3,
  'Hospital': 4
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
  return 'severity-' + String(label).toLowerCase();
}

function dementiaClass(label) {
  if (label === 'None') return 'dementia-badge dementia-none';
  return 'dementia-badge';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.dementia !== '' ||
    filters.setting !== ''
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.severity && row.severity !== filters.severity) {
    return false;
  }
  if (filters.dementia && row.dementiaType !== filters.dementia) {
    return false;
  }
  if (filters.setting && row.residentialSetting !== filters.setting) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare. When sorting on the severity column ties
 * are broken by CMAI score (higher score = more urgent within band).
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'severity') {
    const ar = severityRank[av] ?? -1;
    const br = severityRank[bv] ?? -1;
    if (ar !== br) return (ar - br) * dir;
    // Tie-breaker: CMAI score in same direction (higher = more urgent).
    return ((a.cmaiScore ?? 0) - (b.cmaiScore ?? 0)) * dir;
  }

  if (key === 'dementiaType') {
    av = dementiaRank[av] ?? 99;
    bv = dementiaRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'residentialSetting') {
    av = settingRank[av] ?? -1;
    bv = settingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'cmaiScore' || key === 'npiScore' || key === 'age') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, managementPlan)
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
    if (row.severity === 'Critical') {
      tr.classList.add('row-critical');
    } else if (row.severity === 'Severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.age)}</td>
      <td><span class="cmai-score">${esc(row.cmaiScore)}/203</span></td>
      <td><span class="npi-score">${esc(row.npiScore)}/144</span></td>
      <td><span class="severity-badge ${severityClass(row.severity)}">${esc(row.severity)}</span></td>
      <td><span class="${dementiaClass(row.dementiaType)}">${esc(row.dementiaType)}</span></td>
      <td><span class="setting-badge">${esc(row.residentialSetting)}</span></td>
      <td class="plan-cell">${esc(row.managementPlan)}</td>
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
    // Numeric and categorical-rank columns default to descending so the
    // most urgent / highest-rank rows surface first; alphabetical columns
    // default to ascending.
    if (
      key === 'cmaiScore' ||
      key === 'npiScore' ||
      key === 'age' ||
      key === 'severity'
    ) {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const dementia = document.getElementById('filter-dementia');
  const setting = document.getElementById('filter-setting');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (dementia) {
    dementia.addEventListener('change', () => {
      filters.dementia = dementia.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.dementia = '';
      filters.setting = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (dementia) dementia.value = '';
      if (setting) setting.value = '';
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
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
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
