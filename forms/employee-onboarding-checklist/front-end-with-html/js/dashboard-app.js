import { fetchEmployees } from './api.js';
import { sampleEmployees } from './data.js';

// Employee Onboarding Checklist - HR / management dashboard
// (vanilla classic-script app).
//
// On boot we fetch the employee list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + completion-status dropdown + department dropdown +
// milestone dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').EmployeeRow[]} */
let employees = [];

const filters = {
  search: '',
  status: '',
  department: '',
  milestone: ''
};

// Default sort: overdue first, then by completion percentage ascending.
// `overdue` itself is the active sort column so the indicator arrows
// reflect the live state. Direction 'desc' on a boolean puts `true`
// (overdue) on top.
const sortState = {
  key: 'overdue',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'employeeId',         label: 'Employee ID' },
  { key: 'employeeName',       label: 'Name' },
  { key: 'department',         label: 'Department' },
  { key: 'role',               label: 'Role' },
  { key: 'completionPercent',  label: 'Completion' },
  { key: 'completionStatus',   label: 'Status' },
  { key: 'milestoneReached',   label: 'Milestone' },
  { key: 'startDate',          label: 'Start Date' },
  { key: 'overdue',            label: 'Overdue' }
];

// Rank used when sorting the completionStatus column so 'Not Started'
// is always less than 'Overdue' regardless of locale.
const statusRank = {
  'Not Started': 0,
  'In Progress': 1,
  'Complete':    2,
  'Overdue':     3
};

// Rank used when sorting the milestoneReached column — orders along the
// onboarding timeline.
const milestoneRank = {
  'Pre-arrival': 0,
  'Day 1':       1,
  'Week 1':      2,
  '30 Day':      3,
  '60 Day':      4,
  '90 Day':      5
};

// Rank used when sorting the department column — alphabetical-friendly
// fallback that still works for grouping.
const departmentRank = {
  'Admin':         0,
  'Allied Health': 1,
  'IT':            2,
  'Medical':       3,
  'Nursing':       4
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

function milestoneClass(label) {
  if (!label) return '';
  return 'milestone-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function fillClass(status) {
  if (!status) return '';
  return 'fill-' + String(status).toLowerCase().replace(/\s+/g, '-');
}

function clampPercent(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return 0;
  if (v < 0) return 0;
  if (v > 100) return 100;
  return Math.round(v);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.department !== '' ||
    filters.milestone !== ''
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
  if (filters.milestone && row.milestoneReached !== filters.milestone) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare.
 *
 * Tie-breakers always pull overdue rows above non-overdue rows so the
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
  } else if (key === 'milestoneReached') {
    av = milestoneRank[av] ?? -1;
    bv = milestoneRank[bv] ?? -1;
    primary = (av - bv) * dir;
  } else if (key === 'department') {
    av = departmentRank[av] ?? -1;
    bv = departmentRank[bv] ?? -1;
    primary = (av - bv) * dir;
  } else if (key === 'overdue') {
    primary = ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  } else if (key === 'completionPercent') {
    primary = ((av ?? 0) - (bv ?? 0)) * dir;
  } else if (key === 'startDate') {
    // ISO-8601 strings sort lexicographically as dates.
    primary = String(av).localeCompare(String(bv)) * dir;
  } else {
    // Default: string compare (employeeId, employeeName, role)
    primary = String(av).localeCompare(String(bv)) * dir;
  }

  if (primary !== 0) return primary;

  // Tie-break: always surface overdue rows above non-overdue.
  if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;

  // Final tie-break: ascending completion percent so least-finished are
  // surfaced first.
  return (a.completionPercent ?? 0) - (b.completionPercent ?? 0);
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
    if (row.overdue || row.completionStatus === 'Overdue') {
      tr.classList.add('row-overdue');
    }

    const pct = clampPercent(row.completionPercent);
    const fill = fillClass(row.completionStatus);

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.employeeId)}</td>
      <td class="data-table-td">${esc(row.employeeName)}</td>
      <td class="data-table-td department-cell">${esc(row.department)}</td>
      <td class="data-table-td role-cell">${esc(row.role)}</td>
      <td class="data-table-td">
        <span class="completion-cell">
          <span class="completion-percent">${pct}%</span>
          <span class="completion-bar" role="progressbar"
                aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
            <span class="completion-bar-fill ${fill}" style="width: ${pct}%"></span>
          </span>
        </span>
      </td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.completionStatus)}">${esc(row.completionStatus)}</span></td>
      <td class="data-table-td"><span class="milestone-badge ${milestoneClass(row.milestoneReached)}">${esc(row.milestoneReached)}</span></td>
      <td class="data-table-td">${esc(row.startDate)}</td>
      <td class="data-table-td">
        <span class="status-badge ${row.overdue ? 'status-overdue' : 'status-not-started'}">
          ${row.overdue ? 'Yes' : 'No'}
        </span>
      </td>
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
    // Sensible defaults per column type: numeric / boolean / date
    // descending feels natural ("biggest first"); strings ascending.
    if (
      key === 'overdue' ||
      key === 'completionPercent' ||
      key === 'startDate'
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
  const status = document.getElementById('filter-status');
  const department = document.getElementById('filter-department');
  const milestone = document.getElementById('filter-milestone');
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
  if (milestone) {
    milestone.addEventListener('change', () => {
      filters.milestone = milestone.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.department = '';
      filters.milestone = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (department) department.value = '';
      if (milestone) milestone.value = '';
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
