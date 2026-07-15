import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Diabetes Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + control-level dropdown + diabetes-type dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  control: '',
  type: ''
};

// Default sort: HbA1c descending. Worst control = highest HbA1c = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'hba1c',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'diabetesType',  label: 'Diabetes Type' },
  { key: 'hba1c',         label: 'HbA1c (mmol/mol)' },
  { key: 'controlLevel',  label: 'Control Level' },
  { key: 'complications', label: 'Complications' },
  { key: 'lastReview',    label: 'Last Review' }
];

// Rank used when sorting the controlLevel column so 'wellControlled' is
// always less than 'veryPoor' regardless of locale.
const controlRank = {
  wellControlled: 0,
  suboptimal: 1,
  poor: 2,
  veryPoor: 3
};

// Rank used when sorting the diabetesType column so types group sensibly.
const typeRank = {
  type1: 0,
  type2: 1,
  gestational: 2,
  other: 3
};

// Display labels for the controlLevel column.
const controlLabels = {
  wellControlled: 'Well Controlled',
  suboptimal: 'Suboptimal',
  poor: 'Poor',
  veryPoor: 'Very Poor'
};

// Display labels for the diabetesType column.
const typeLabels = {
  type1: 'Type 1',
  type2: 'Type 2',
  gestational: 'Gestational',
  other: 'Other'
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

function controlClass(value) {
  if (!value) return '';
  return 'control-' + String(value).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.control !== '' ||
    filters.type !== ''
  );
}

/** Patients with poor or very-poor glycaemic control are visually flagged. */
function isPoorlyControlled(row) {
  return row.controlLevel === 'poor' || row.controlLevel === 'veryPoor';
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
  if (filters.control && row.controlLevel !== filters.control) {
    return false;
  }
  if (filters.type && row.diabetesType !== filters.type) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; date strings (ISO YYYY-MM-DD)
 * sort lexicographically; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'controlLevel') {
    av = controlRank[av] ?? -1;
    bv = controlRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'diabetesType') {
    av = typeRank[av] ?? -1;
    bv = typeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hba1c' || key === 'complications') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, lastReview ISO date)
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
    if (isPoorlyControlled(row)) {
      tr.classList.add('row-poorly-controlled');
    }

    const typeLabel = typeLabels[row.diabetesType] || row.diabetesType || 'Unknown';
    const controlLabel = controlLabels[row.controlLevel] || row.controlLevel;
    const complicationsClass =
      'complication-count' + (row.complications > 0 ? ' complication-flagged' : '');

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="type-badge">${esc(typeLabel)}</span></td>
      <td><span class="hba1c-value">${esc(row.hba1c)}</span></td>
      <td><span class="control-badge ${controlClass(row.controlLevel)}">${esc(controlLabel)}</span></td>
      <td><span class="${complicationsClass}">${esc(row.complications)}</span></td>
      <td><span class="last-review">${esc(row.lastReview)}</span></td>
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
  const control = document.getElementById('filter-control');
  const type = document.getElementById('filter-type');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (control) {
    control.addEventListener('change', () => {
      filters.control = control.value;
      renderAll();
    });
  }
  if (type) {
    type.addEventListener('change', () => {
      filters.type = type.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.control = '';
      filters.type = '';
      if (search) search.value = '';
      if (control) control.value = '';
      if (type) type.value = '';
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
