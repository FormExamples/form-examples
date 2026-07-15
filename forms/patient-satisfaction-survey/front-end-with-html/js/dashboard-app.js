import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Patient Satisfaction Survey - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner.
// The rendered table is sortable (click any column header) and filterable
// (search box + satisfaction-category dropdown + visit-department dropdown
// + would-recommend dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  category: '',
  department: '',
  recommend: '' // '', 'yes', 'no'
};

// Default sort: satisfaction score ascending. Worst experience = lowest
// score = top of the list, surfacing the patients whose feedback most
// urgently needs clinical / operational follow-up.
const sortState = {
  key: 'satisfactionScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',            label: 'NHS Number' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'visitDepartment',      label: 'Visit Department' },
  { key: 'satisfactionScore',    label: 'Score' },
  { key: 'satisfactionCategory', label: 'Category' },
  { key: 'recommendFlag',        label: 'Would Recommend' }
];

// Rank used when sorting the satisfactionCategory column so 'Excellent' is
// always greater than 'Very Poor' regardless of locale.
const categoryRank = {
  'Very Poor': 0,
  'Poor': 1,
  'Satisfactory': 2,
  'Good': 3,
  'Excellent': 4
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

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.category !== '' ||
    filters.department !== '' ||
    filters.recommend !== ''
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
  if (filters.category && row.satisfactionCategory !== filters.category) {
    return false;
  }
  if (filters.department && row.visitDepartment !== filters.department) {
    return false;
  }
  if (filters.recommend === 'yes' && !row.recommendFlag) return false;
  if (filters.recommend === 'no' && row.recommendFlag) return false;
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

  if (key === 'satisfactionCategory') {
    av = categoryRank[av] ?? -1;
    bv = categoryRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'recommendFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'satisfactionScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, visitDepartment)
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
    if (row.satisfactionCategory === 'Very Poor') {
      tr.classList.add('row-very-poor');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td"><span class="department-badge">${esc(row.visitDepartment)}</span></td>
      <td class="data-table-td"><span class="satisfaction-score">${esc(row.satisfactionScore)}/100</span></td>
      <td class="data-table-td"><span class="category-badge ${categoryClass(row.satisfactionCategory)}">${esc(row.satisfactionCategory)}</span></td>
      <td class="data-table-td">
        <span class="recommend-badge ${row.recommendFlag ? 'recommend-yes' : 'recommend-no'}">
          ${row.recommendFlag ? 'Yes' : 'No'}
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
  const category = document.getElementById('filter-category');
  const department = document.getElementById('filter-department');
  const recommend = document.getElementById('filter-recommend');
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
  if (department) {
    department.addEventListener('change', () => {
      filters.department = department.value;
      renderAll();
    });
  }
  if (recommend) {
    recommend.addEventListener('change', () => {
      filters.recommend = recommend.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.category = '';
      filters.department = '';
      filters.recommend = '';
      if (search) search.value = '';
      if (category) category.value = '';
      if (department) department.value = '';
      if (recommend) recommend.value = '';
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
