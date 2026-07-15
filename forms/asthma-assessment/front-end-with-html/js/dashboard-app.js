import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Asthma Assessment — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + control-level dropdown + exacerbation-risk dropdown +
// allergy dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AsthmaAssessmentDashboard`. Pulling them
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
  control: '',
  risk: '',
  allergy: '' // '', 'yes', 'no'
};

// Default sort: ACT score ascending. Worst control = lowest score = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'actScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'actScore',         label: 'ACT Score' },
  { key: 'controlLevel',     label: 'Control Level' },
  { key: 'exacerbationRisk', label: 'Exacerbation Risk' },
  { key: 'allergyFlag',      label: 'Allergy Flag' }
];

// Rank used when sorting the controlLevel column so 'Well Controlled' is
// always less than 'Very Poorly Controlled' regardless of locale.
const controlRank = {
  'Well Controlled': 0,
  'Could Be Better': 1,
  'Not Well Controlled': 2,
  'Very Poorly Controlled': 3
};

// Rank used when sorting the exacerbationRisk column.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2
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

function controlClass(label) {
  if (!label) return '';
  return 'control-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.control !== '' ||
    filters.risk !== '' ||
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
      String(row.nhsNumber || '').toLowerCase().includes(term) ||
      String(row.patientName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.control && row.controlLevel !== filters.control) {
    return false;
  }
  if (filters.risk && row.exacerbationRisk !== filters.risk) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
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

  if (key === 'controlLevel') {
    av = controlRank[av] ?? -1;
    bv = controlRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'exacerbationRisk') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'allergyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'actScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    if (row.controlLevel === 'Very Poorly Controlled') {
      tr.classList.add('row-very-poorly-controlled');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td"><span class="act-score">${esc(row.actScore)}/25</span></td>
      <td class="data-table-td"><span class="control-badge ${controlClass(row.controlLevel)}">${esc(row.controlLevel)}</span></td>
      <td class="data-table-td"><span class="risk-badge ${riskClass(row.exacerbationRisk)}">${esc(row.exacerbationRisk)}</span></td>
      <td class="data-table-td">
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
  const control = document.getElementById('filter-control');
  const risk = document.getElementById('filter-risk');
  const allergy = document.getElementById('filter-allergy');
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
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
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
      filters.control = '';
      filters.risk = '';
      filters.allergy = '';
      if (search) search.value = '';
      if (control) control.value = '';
      if (risk) risk.value = '';
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
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
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
