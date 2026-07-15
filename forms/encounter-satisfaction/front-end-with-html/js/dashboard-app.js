import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Encounter Satisfaction - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + category dropdown + department dropdown + flags dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  category: '',
  department: '',
  flags: '' // '', 'any', 'none'
};

// Default sort: composite score ascending. Worst experience = lowest score
// = top of the list, surfacing the encounters that most need follow-up.
const sortState = {
  key: 'compositeScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',    label: 'Patient Name' },
  { key: 'department',     label: 'Department' },
  { key: 'providerName',   label: 'Provider' },
  { key: 'visitType',      label: 'Visit Type' },
  { key: 'compositeScore', label: 'Composite Score' },
  { key: 'category',       label: 'Category' },
  { key: 'visitDate',      label: 'Visit Date' },
  { key: 'flagCount',      label: 'Flags' }
];

// Rank used when sorting the category column so 'Excellent' is always
// greater than 'Very Poor' regardless of locale.
const categoryRank = {
  'Very Poor': 0,
  'Poor':      1,
  'Fair':      2,
  'Good':      3,
  'Excellent': 4
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
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

function flagClass(count) {
  if (!count || count === 0) return 'flag-zero';
  if (count <= 2) return 'flag-some';
  return 'flag-many';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.category !== '' ||
    filters.department !== '' ||
    filters.flags !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      row.providerName.toLowerCase().includes(term) ||
      row.department.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.category && row.category !== filters.category) {
    return false;
  }
  if (filters.department && row.department !== filters.department) {
    return false;
  }
  if (filters.flags === 'any' && !(row.flagCount > 0)) return false;
  if (filters.flags === 'none' && row.flagCount > 0) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The category column uses its
 * rank table; numbers compare directly; everything else uses a locale-aware
 * string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'category') {
    av = categoryRank[av] != null ? categoryRank[av] : -1;
    bv = categoryRank[bv] != null ? categoryRank[bv] : -1;
    return (av - bv) * dir;
  }

  if (key === 'compositeScore' || key === 'flagCount') {
    return ((av == null ? 0 : av) - (bv == null ? 0 : bv)) * dir;
  }

  // Default: string compare (patientName, department, providerName,
  // visitType, visitDate). visitDate uses ISO 8601 so a string compare
  // sorts chronologically.
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
    if (row.category === 'Very Poor') {
      tr.classList.add('row-very-poor');
    }

    const flagLabel = row.flagCount === 1 ? '1 flag' : (row.flagCount + ' flags');

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td">${esc(row.providerName)}</td>
      <td class="data-table-td">${esc(row.visitType)}</td>
      <td class="data-table-td"><span class="composite-score">${Number(row.compositeScore).toFixed(1)}</span></td>
      <td class="data-table-td"><span class="category-badge ${categoryClass(row.category)}">${esc(row.category)}</span></td>
      <td class="data-table-td"><span class="visit-date">${esc(row.visitDate)}</span></td>
      <td class="data-table-td"><span class="flag-badge ${flagClass(row.flagCount)}">${esc(flagLabel)}</span></td>
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
  const flagsSel = document.getElementById('filter-flags');
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
  if (flagsSel) {
    flagsSel.addEventListener('change', () => {
      filters.flags = flagsSel.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.category = '';
      filters.department = '';
      filters.flags = '';
      if (search) search.value = '';
      if (category) category.value = '';
      if (department) department.value = '';
      if (flagsSel) flagsSel.value = '';
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
