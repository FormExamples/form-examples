// Employee Offboarding Checklist - HR / management dashboard
// (vanilla classic-script app).
//
// On boot we fetch the employee list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + completion-status dropdown + department dropdown +
// blocker-category dropdown + days-since-leaving range).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.EmployeeOffboardingChecklistDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchEmployees,
  sampleEmployees
} = window.EmployeeOffboardingChecklistDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').EmployeeRow[]} */
let employees = [];

const filters = {
  search: '',
  status: '',
  department: '',
  blocker: '',
  days: ''
};

// Default sort: incomplete-first, then by days-since-leaving descending so
// the longest-outstanding leavers appear at the top. `completionStatus` is
// the active sort column so the indicator arrows reflect live state.
// Tie-breakers (see compareRows) handle the secondary days-since-leaving
// ordering.
const sortState = {
  key: 'completionStatus',
  direction: 'desc' // 'asc' | 'desc' — desc puts Incomplete first via statusRank
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'employeeId',       label: 'Employee ID' },
  { key: 'employeeName',     label: 'Name' },
  { key: 'department',       label: 'Department' },
  { key: 'role',             label: 'Role' },
  { key: 'completionStatus', label: 'Status' },
  { key: 'blockerCategory',  label: 'Blocker' },
  { key: 'leavingDate',      label: 'Leaving Date' },
  { key: 'daysSinceLeaving', label: 'Days Since Leaving' }
];

// Rank used when sorting the completionStatus column. The values are
// arranged so 'desc' direction surfaces 'Incomplete' first — the natural
// HR-triage ordering. 'asc' surfaces 'Complete' first.
const statusRank = {
  'Complete':   0,
  'Partial':    1,
  'Incomplete': 2
};

// Rank used when sorting the blocker column. 'None' is least-urgent;
// 'Access Not Revoked' is most-urgent (data-protection risk).
const blockerRank = {
  'None':                  0,
  'NDA Pending':           1,
  'Equipment Outstanding': 2,
  'Access Not Revoked':    3
};

// Rank used when sorting the department column — alphabetical-friendly
// fallback that still works for grouping.
const departmentRank = {
  'Admin':         0,
  'Allied Health': 1,
  'IT':            2,
  'Medical':       3,
  'Nursing':       4,
  'Pharmacy':      5
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

function blockerClass(label) {
  if (!label) return '';
  return 'blocker-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function rowClass(status) {
  if (status === 'Incomplete') return 'row-incomplete';
  if (status === 'Partial')    return 'row-partial';
  return '';
}

/**
 * Map a numeric daysSinceLeaving value into one of the filter buckets.
 * Negative values are 'upcoming' (employee has not yet left).
 */
function daysBucket(d) {
  if (typeof d !== 'number' || !Number.isFinite(d)) return '';
  if (d < 0)   return 'upcoming';
  if (d <= 7)  return '0-7';
  if (d <= 30) return '8-30';
  if (d <= 90) return '31-90';
  return '90+';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.department !== '' ||
    filters.blocker !== '' ||
    filters.days !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').EmployeeRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.employeeId.toLowerCase().includes(term) ||
      row.employeeName.toLowerCase().includes(term) ||
      row.role.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.completionStatus !== filters.status) {
    return false;
  }
  if (filters.department && row.department !== filters.department) {
    return false;
  }
  if (filters.blocker && row.blockerCategory !== filters.blocker) {
    return false;
  }
  if (filters.days && daysBucket(row.daysSinceLeaving) !== filters.days) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 *
 * Tie-breakers always pull Incomplete rows above Partial above Complete
 * (using statusRank), and within the same status the row with the larger
 * `daysSinceLeaving` (longer overdue) ranks first. This guarantees the
 * critical-attention rows stay near the top regardless of which column
 * the user has clicked.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];
  let primary = 0;

  if (key === 'completionStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    primary = (av - bv) * dir;
  } else if (key === 'blockerCategory') {
    av = blockerRank[av] ?? -1;
    bv = blockerRank[bv] ?? -1;
    primary = (av - bv) * dir;
  } else if (key === 'department') {
    av = departmentRank[av] ?? -1;
    bv = departmentRank[bv] ?? -1;
    primary = (av - bv) * dir;
  } else if (key === 'daysSinceLeaving') {
    primary = ((av ?? 0) - (bv ?? 0)) * dir;
  } else if (key === 'leavingDate') {
    // ISO-8601 strings sort lexicographically as dates.
    primary = String(av).localeCompare(String(bv)) * dir;
  } else {
    // Default: string compare (employeeId, employeeName, role)
    primary = String(av).localeCompare(String(bv)) * dir;
  }

  if (primary !== 0) return primary;

  // Tie-break 1: incomplete above partial above complete.
  const sa = statusRank[a.completionStatus] ?? -1;
  const sb = statusRank[b.completionStatus] ?? -1;
  if (sa !== sb) return sb - sa;

  // Tie-break 2: longer-overdue first (descending days).
  return (b.daysSinceLeaving ?? 0) - (a.daysSinceLeaving ?? 0);
}

function visibleRows() {
  return employees.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('employees-table-head');
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

function renderDaysCell(d) {
  if (typeof d !== 'number' || !Number.isFinite(d)) {
    return '<td class="data-table-td days-cell">\u2014</td>';
  }
  if (d < 0) {
    return `<td class="data-table-td days-cell days-upcoming">in ${Math.abs(d)}d</td>`;
  }
  const stale = d > 30 ? ' days-stale' : '';
  return `<td class="data-table-td days-cell${stale}">${d}</td>`;
}

function renderTableBody() {
  const body = document.getElementById('employees-table-body');
  const empty = document.getElementById('employees-empty-message');
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
    const cls = rowClass(row.completionStatus);
    if (cls) tr.classList.add(cls);

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.employeeId)}</td>
      <td class="data-table-td">${esc(row.employeeName)}</td>
      <td class="data-table-td department-cell">${esc(row.department)}</td>
      <td class="data-table-td role-cell">${esc(row.role)}</td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.completionStatus)}">${esc(row.completionStatus)}</span></td>
      <td class="data-table-td"><span class="blocker-badge ${blockerClass(row.blockerCategory)}">${esc(row.blockerCategory)}</span></td>
      <td class="data-table-td">${esc(row.leavingDate)}</td>
      ${renderDaysCell(row.daysSinceLeaving)}
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = employees.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No employees to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} employees`;
  } else {
    el.textContent = `Showing ${shown} of ${total} employees`;
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
    // Sensible defaults per column type: numeric / date / categorical-with
    // -urgent-bottom (status, blocker) descending feels natural ("most
    // critical first"); strings ascending.
    if (
      key === 'completionStatus' ||
      key === 'blockerCategory' ||
      key === 'daysSinceLeaving' ||
      key === 'leavingDate'
    ) {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search     = document.getElementById('filter-search');
  const status     = document.getElementById('filter-status');
  const department = document.getElementById('filter-department');
  const blocker    = document.getElementById('filter-blocker');
  const days       = document.getElementById('filter-days');
  const clearBtn   = document.getElementById('filter-clear-btn');

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
  if (blocker) {
    blocker.addEventListener('change', () => {
      filters.blocker = blocker.value;
      renderAll();
    });
  }
  if (days) {
    days.addEventListener('change', () => {
      filters.days = days.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.department = '';
      filters.blocker = '';
      filters.days = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (department) department.value = '';
      if (blocker) blocker.value = '';
      if (days) days.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadEmployees() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  employees = sampleEmployees;
  renderAll();

  try {
    const items = await fetchEmployees();
    if (items && items.length > 0) {
      employees = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no employees.'
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
  loadEmployees();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
