import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Consent to Treatment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + status dropdown + department dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  status: '',
  department: ''
};

// Default sort: scheduled date ascending. The next-up cases bubble to the
// top of the list, surfacing the patients whose consent status most needs
// clinical attention first.
const sortState = {
  key: 'scheduledDate',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'procedureName', label: 'Procedure' },
  { key: 'department',    label: 'Department' },
  { key: 'status',        label: 'Status' },
  { key: 'scheduledDate', label: 'Scheduled Date' }
];

// Rank used when sorting the status column so 'pending' < 'signed' <
// 'expired' regardless of locale (an alphabetic sort would order them
// 'expired' < 'pending' < 'signed', which is not the clinical priority).
const statusRank = {
  pending: 0,
  signed:  1,
  expired: 2
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

function statusClass(label) {
  if (!label) return '';
  return 'status-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.department !== ''
  );
}

/** Distinct department list for populating the department dropdown. */
function distinctDepartments() {
  const seen = new Set();
  for (const p of patients) {
    if (p.department) seen.add(p.department);
  }
  return Array.from(seen).sort();
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
      row.procedureName.toLowerCase().includes(term) ||
      row.department.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.status !== filters.status) {
    return false;
  }
  if (filters.department && row.department !== filters.department) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. The status column uses its
 * rank table; dates and other strings use a locale-aware string compare
 * (ISO 8601 dates sort correctly under lexicographic comparison).
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  // Default: locale-aware string compare. Works for nhsNumber, patientName,
  // procedureName, department, and ISO 8601 scheduledDate.
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
    if (row.status === 'expired') {
      tr.classList.add('row-expired');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td">${esc(row.procedureName)}</td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.status)}">${esc(row.status)}</span></td>
      <td class="data-table-td"><span class="scheduled-date">${esc(row.scheduledDate)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderDepartmentOptions() {
  const select = document.getElementById('filter-department');
  if (!select) return;
  // Preserve any active selection across re-renders.
  const current = filters.department;
  // Drop everything except the leading "All departments" option.
  while (select.options.length > 1) {
    select.remove(1);
  }
  for (const dept of distinctDepartments()) {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.textContent = dept;
    select.appendChild(opt);
  }
  if (current) select.value = current;
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
  const status = document.getElementById('filter-status');
  const department = document.getElementById('filter-department');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (department) {
    department.addEventListener('change', () => {
      filters.department = department.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.department = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (department) department.value = '';
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
  renderDepartmentOptions();
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      renderDepartmentOptions();
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
