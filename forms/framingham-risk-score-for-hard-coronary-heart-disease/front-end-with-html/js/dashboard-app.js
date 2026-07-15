import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Framingham Risk Score for Hard CHD - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-category dropdown + sex dropdown + smoker dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  category: '',
  sex: '',
  smoker: '' // '', 'yes', 'no'
};

// Default sort: 10-year risk descending. Highest-risk patients surface at
// the top of the list so they are easiest to triage.
const sortState = {
  key: 'tenYearRiskPercent',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'age',                label: 'Age' },
  { key: 'sex',                label: 'Sex' },
  { key: 'tenYearRiskPercent', label: '10-Year Risk' },
  { key: 'riskCategory',       label: 'Risk Category' },
  { key: 'smokerFlag',         label: 'Smoker' }
];

// Rank used when sorting the riskCategory column so 'Low' is always less
// than 'High' regardless of locale.
const categoryRank = {
  'Low': 0,
  'Intermediate': 1,
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

function categoryClass(label) {
  if (!label) return '';
  return 'category-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/** Render a 10-year risk percentage with one decimal place. */
function formatRiskPercent(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return Number(n).toFixed(1) + '%';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.category !== '' ||
    filters.sex !== '' ||
    filters.smoker !== ''
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
  if (filters.category && row.riskCategory !== filters.category) {
    return false;
  }
  if (filters.sex && row.sex !== filters.sex) {
    return false;
  }
  if (filters.smoker === 'yes' && !row.smokerFlag) return false;
  if (filters.smoker === 'no' && row.smokerFlag) return false;
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

  if (key === 'riskCategory') {
    av = categoryRank[av] ?? -1;
    bv = categoryRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'smokerFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'tenYearRiskPercent' || key === 'age') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, sex)
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
    if (row.riskCategory === 'High') {
      tr.classList.add('row-high');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td"><span class="age-cell">${esc(row.age)}</span></td>
      <td class="data-table-td"><span class="sex-badge">${esc(row.sex)}</span></td>
      <td class="data-table-td"><span class="risk-percent">${esc(formatRiskPercent(row.tenYearRiskPercent))}</span></td>
      <td class="data-table-td"><span class="category-badge ${categoryClass(row.riskCategory)}">${esc(row.riskCategory)}</span></td>
      <td class="data-table-td">
        <span class="smoker-badge ${row.smokerFlag ? 'smoker-yes' : 'smoker-no'}">
          ${row.smokerFlag ? 'Yes' : 'No'}
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
    // Numeric / categorical columns are most useful sorted descending
    // first (worst-on-top); text columns sort ascending first.
    if (
      key === 'tenYearRiskPercent' ||
      key === 'riskCategory' ||
      key === 'smokerFlag' ||
      key === 'age'
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
  const category = document.getElementById('filter-category');
  const sex = document.getElementById('filter-sex');
  const smoker = document.getElementById('filter-smoker');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (category) {
    category.addEventListener('change', () => {
      filters.category = category.value;
      renderAll();
    });
  }
  if (sex) {
    sex.addEventListener('change', () => {
      filters.sex = sex.value;
      renderAll();
    });
  }
  if (smoker) {
    smoker.addEventListener('change', () => {
      filters.smoker = smoker.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.category = '';
      filters.sex = '';
      filters.smoker = '';
      if (search) search.value = '';
      if (category) category.value = '';
      if (sex) sex.value = '';
      if (smoker) smoker.value = '';
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
