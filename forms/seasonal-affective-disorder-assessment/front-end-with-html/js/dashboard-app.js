import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Seasonal Affective Disorder Assessment - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + combined-severity dropdown + seasonal-pattern dropdown +
// treatment-status dropdown + suicidal-risk dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.SeasonalAffectiveDisorderAssessmentDashboard`. Pulling them off
// here keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to the
// global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',
  season: '',
  treatment: '',
  suicidal: '' // '', 'yes', 'no'
};

// Default sort: combined severity descending so 'critical' rows surface at
// the top of the list, with the most clinically urgent patients (severe and
// critical) immediately visible.
const sortState = {
  key: 'combinedSeverity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'gssScore',         label: 'SPAQ GSS' },
  { key: 'phq9Score',        label: 'PHQ-9' },
  { key: 'combinedSeverity', label: 'Combined Severity' },
  { key: 'seasonalPattern',  label: 'Seasonal Pattern' },
  { key: 'treatmentStatus',  label: 'Treatment' },
  { key: 'suicidalRiskFlag', label: 'Suicidal Risk' }
];

// Rank used when sorting the combinedSeverity column so 'no-sad' is always
// less than 'critical' regardless of locale or alphabetic order.
const severityRank = {
  'no-sad':   0,
  'mild':     1,
  'moderate': 2,
  'severe':   3,
  'critical': 4
};

// Rank used when sorting the seasonalPattern column.
const seasonRank = {
  'Non-seasonal': 0,
  'Summer':       1,
  'Winter':       2
};

// Rank used when sorting the treatmentStatus column. None first so untreated
// patients sort distinctly from any active treatment.
const treatmentRank = {
  'None':          0,
  'Light Therapy': 1,
  'SSRI':          2,
  'CBT':           3
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

function severityLabel(label) {
  if (!label) return '';
  if (label === 'no-sad') return 'No SAD';
  // Capitalize first letter of mild/moderate/severe/critical for display
  return String(label).charAt(0).toUpperCase() + String(label).slice(1);
}

function seasonClass(label) {
  if (!label) return '';
  return 'season-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function treatmentClass(label) {
  if (!label) return '';
  return 'treatment-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.season !== '' ||
    filters.treatment !== '' ||
    filters.suicidal !== ''
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
  if (filters.severity && row.combinedSeverity !== filters.severity) {
    return false;
  }
  if (filters.season && row.seasonalPattern !== filters.season) {
    return false;
  }
  if (filters.treatment && row.treatmentStatus !== filters.treatment) {
    return false;
  }
  if (filters.suicidal === 'yes' && !row.suicidalRiskFlag) return false;
  if (filters.suicidal === 'no' && row.suicidalRiskFlag) return false;
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

  if (key === 'combinedSeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'seasonalPattern') {
    av = seasonRank[av] ?? -1;
    bv = seasonRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'treatmentStatus') {
    av = treatmentRank[av] ?? -1;
    bv = treatmentRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'suicidalRiskFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'gssScore' || key === 'phq9Score') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
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
    if (row.combinedSeverity === 'critical') {
      tr.classList.add('row-critical');
    } else if (row.combinedSeverity === 'severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="gss-score">${esc(row.gssScore)}/24</span></td>
      <td><span class="phq-score">${esc(row.phq9Score)}/27</span></td>
      <td><span class="severity-badge ${severityClass(row.combinedSeverity)}">${esc(severityLabel(row.combinedSeverity))}</span></td>
      <td><span class="season-badge ${seasonClass(row.seasonalPattern)}">${esc(row.seasonalPattern)}</span></td>
      <td><span class="treatment-badge ${treatmentClass(row.treatmentStatus)}">${esc(row.treatmentStatus)}</span></td>
      <td>
        <span class="suicidal-badge ${row.suicidalRiskFlag ? 'suicidal-yes' : 'suicidal-no'}">
          ${row.suicidalRiskFlag ? 'Yes' : 'No'}
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
    // Severity defaults to descending (critical first); everything else
    // defaults to ascending so the first click reveals the natural order.
    sortState.direction = key === 'combinedSeverity' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const season = document.getElementById('filter-season');
  const treatment = document.getElementById('filter-treatment');
  const suicidal = document.getElementById('filter-suicidal');
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
  if (season) {
    season.addEventListener('change', () => {
      filters.season = season.value;
      renderAll();
    });
  }
  if (treatment) {
    treatment.addEventListener('change', () => {
      filters.treatment = treatment.value;
      renderAll();
    });
  }
  if (suicidal) {
    suicidal.addEventListener('change', () => {
      filters.suicidal = suicidal.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.season = '';
      filters.treatment = '';
      filters.suicidal = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (season) season.value = '';
      if (treatment) treatment.value = '';
      if (suicidal) suicidal.value = '';
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
