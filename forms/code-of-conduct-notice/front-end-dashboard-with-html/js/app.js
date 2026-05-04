// Code of Conduct Notice - compliance dashboard (vanilla classic-script app).
//
// On boot we fetch the staff list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + acknowledgement-status dropdown + department dropdown +
// training-currency dropdown).
//
// Default sort surfaces overdue and declined acknowledgements first so the
// compliance officer sees the highest-priority gaps without scrolling.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.CodeOfConductNoticeDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchStaff,
  sampleStaff
} = window.CodeOfConductNoticeDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').StaffRow[]} */
let staff = [];

const filters = {
  search: '',
  status: '',
  department: '',
  currency: ''
};

// Default sort: acknowledgement status, descending. Combined with the rank
// table below this puts Declined first, then Overdue, then Pending, then
// Acknowledged — i.e. the highest-priority compliance gaps surface at the
// top of the list without the user having to click anything.
const sortState = {
  key: 'acknowledgementStatus',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'employeeId',             label: 'Employee ID' },
  { key: 'staffName',              label: 'Staff Name' },
  { key: 'department',             label: 'Department' },
  { key: 'role',                   label: 'Role' },
  { key: 'acknowledgementStatus',  label: 'Acknowledgement' },
  { key: 'lastSignOffDate',        label: 'Last Sign-Off' },
  { key: 'conflictOfInterestDeclared', label: 'COI Declared' },
  { key: 'trainingCurrency',       label: 'Training Currency' }
];

// Rank used when sorting the acknowledgementStatus column. Higher numbers
// mean higher compliance risk, so a 'desc' default surfaces Declined first.
const statusRank = {
  'Acknowledged': 0,
  'Pending': 1,
  'Overdue': 2,
  'Declined': 3
};

// Rank used when sorting the trainingCurrency column. Higher = more urgent.
const currencyRank = {
  'Current': 0,
  'Due Soon': 1,
  'Expired': 2
};

// Rank used when sorting the department column — alphabetical, stable.
const departmentRank = {
  'Admin': 0,
  'Allied Health': 1,
  'IT': 2,
  'Medical': 3,
  'Nursing': 4,
  'Pharmacy': 5
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
  return 'status-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function currencyClass(label) {
  if (!label) return '';
  return 'currency-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.department !== '' ||
    filters.currency !== ''
  );
}

/**
 * Format an ISO yyyy-mm-dd date for display, or return '—' if empty.
 * Returns the ISO string verbatim — no locale conversion — so column sort
 * and display both rely on the same lexical ordering.
 */
function formatSignOffDate(iso) {
  if (!iso) return '—';
  return iso;
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').StaffRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.employeeId.toLowerCase().includes(term) ||
      row.staffName.toLowerCase().includes(term) ||
      row.role.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.acknowledgementStatus !== filters.status) {
    return false;
  }
  if (filters.department && row.department !== filters.department) {
    return false;
  }
  if (filters.currency && row.trainingCurrency !== filters.currency) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; everything else uses a
 * locale-aware string compare. Empty `lastSignOffDate` strings sort last
 * regardless of direction so "never signed" rows stay visually grouped.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'acknowledgementStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'trainingCurrency') {
    av = currencyRank[av] ?? -1;
    bv = currencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'department') {
    av = departmentRank[av] ?? -1;
    bv = departmentRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'conflictOfInterestDeclared') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'lastSignOffDate') {
    // Empty strings (never signed) bucket last regardless of direction so
    // they read as "no data" rather than "earliest possible date".
    const aEmpty = !av;
    const bEmpty = !bv;
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    return String(av).localeCompare(String(bv)) * dir;
  }

  // Default: string compare (employeeId, staffName, role)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return staff.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('staff-table-head');
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
  const body = document.getElementById('staff-table-body');
  const empty = document.getElementById('staff-empty-message');
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
    if (row.acknowledgementStatus === 'Overdue') {
      tr.classList.add('row-overdue');
    } else if (row.acknowledgementStatus === 'Declined') {
      tr.classList.add('row-declined');
    }

    const dateClass = row.lastSignOffDate
      ? 'signoff-date'
      : 'signoff-date signoff-date-empty';

    tr.innerHTML = `
      <td>${esc(row.employeeId)}</td>
      <td>${esc(row.staffName)}</td>
      <td><span class="dept-badge">${esc(row.department)}</span></td>
      <td>${esc(row.role)}</td>
      <td><span class="status-badge ${statusClass(row.acknowledgementStatus)}">${esc(row.acknowledgementStatus)}</span></td>
      <td><span class="${dateClass}">${esc(formatSignOffDate(row.lastSignOffDate))}</span></td>
      <td>
        <span class="coi-badge ${row.conflictOfInterestDeclared ? 'coi-yes' : 'coi-no'}">
          ${row.conflictOfInterestDeclared ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="currency-badge ${currencyClass(row.trainingCurrency)}">${esc(row.trainingCurrency)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = staff.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No staff to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} staff`;
  } else {
    el.textContent = `Showing ${shown} of ${total} staff`;
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
  const currency = document.getElementById('filter-currency');
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
  if (currency) {
    currency.addEventListener('change', () => {
      filters.currency = currency.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.department = '';
      filters.currency = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (department) department.value = '';
      if (currency) currency.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadStaff() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  staff = sampleStaff;
  renderAll();

  try {
    const items = await fetchStaff();
    if (items && items.length > 0) {
      staff = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no staff.'
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
  loadStaff();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
