import { fetchRegistrations } from './api.js';
import { sampleRegistrations } from './data.js';

// United Kingdom death registration - family / registrar dashboard (vanilla
// ES-module app).
//
// On boot we fetch the registration list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + registration-class dropdown + deadline dropdown).
//
// This dashboard is a process-tracking tool. It surfaces the engine's
// registration class and 5-day deadline status; it is not legal advice.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').RegistrationRow[]} */
let registrations = [];

const filters = {
  search: '',
  registrationClass: '', // '' | 'ready-to-register' | 'incomplete' | 'referred-to-coroner-pending' | 'registered'
  deadline: ''           // '' | a deadline status
};

// Default sort: deceased name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'deceasedName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'deceasedName',      label: 'Deceased' },
  { key: 'registrationClass', label: 'Registration' },
  { key: 'deadlineStatus',    label: '5-day deadline' },
  { key: 'daysSinceConfirmation', label: 'Days elapsed' },
  { key: 'informantName',     label: 'Informant' },
  { key: 'informantQualified', label: 'Qualified' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const classRank = { 'ready-to-register': 0, 'registered': 1, 'incomplete': 2, 'referred-to-coroner-pending': 3 };
const deadlineRank = { 'registered': 0, 'on-track': 1, 'not-started': 2, 'paused-coroner': 3, 'registered-late': 4, 'due-soon': 5, 'overdue': 6 };

// ----------------------------------------------------------------------
// Label / class helpers (dashboard-local; no dependency on the form engine)
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

function classBadge(cls) {
  if (cls === 'ready-to-register' || cls === 'registered') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'referred-to-coroner-pending') return 'risk-high';
  return '';
}

const classLabels = {
  'ready-to-register': 'Ready to register',
  'incomplete': 'Incomplete',
  'referred-to-coroner-pending': 'Referred to coroner - pending',
  'registered': 'Registered'
};
const deadlineLabels = {
  'not-started': 'Clock not started',
  'paused-coroner': 'Paused (coroner)',
  'on-track': 'On track',
  'due-soon': 'Due soon',
  'overdue': 'Overdue',
  'registered': 'Registered in time',
  'registered-late': 'Registered late'
};

function deadlineBadge(status) {
  if (status === 'overdue') return 'risk-high';
  if (status === 'due-soon' || status === 'registered-late') return 'risk-moderate';
  if (status === 'on-track' || status === 'registered') return 'risk-low';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.registrationClass !== '' ||
    filters.deadline !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').RegistrationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.deceasedName.toLowerCase().includes(term) ||
      (row.informantName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.registrationClass && row.registrationClass !== filters.registrationClass) return false;
  if (filters.deadline && row.deadlineStatus !== filters.deadline) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Ranked columns use their rank
 * tables; everything else uses a locale-aware string compare with empty values
 * sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'registrationClass') {
    return ((classRank[av] ?? 99) - (classRank[bv] ?? 99)) * dir;
  }
  if (key === 'deadlineStatus') {
    return ((deadlineRank[av] ?? 99) - (deadlineRank[bv] ?? 99)) * dir;
  }
  if (key === 'daysSinceConfirmation') {
    if (av === null && bv !== null) return 1;
    if (bv === null && av !== null) return -1;
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'informantQualified') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (deceasedName, informantName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return registrations.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕';
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    // Highlight rows that need attention: overdue or stuck with the coroner.
    if (row.deadlineStatus === 'overdue' || row.registrationClass === 'incomplete') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.deceasedName)}</td>
      <td><span class="risk-badge ${classBadge(row.registrationClass)}">${esc(classLabels[row.registrationClass] || 'N/A')}</span></td>
      <td><span class="risk-badge ${deadlineBadge(row.deadlineStatus)}">${esc(deadlineLabels[row.deadlineStatus] || 'N/A')}</span></td>
      <td>${row.daysSinceConfirmation === null ? '<span class="muted">-</span>' : esc(String(row.daysSinceConfirmation))}</td>
      <td>${row.informantName ? esc(row.informantName) : '<span class="muted">Not recorded</span>'}</td>
      <td>${row.informantQualified ? '<span class="risk-badge risk-low">Yes</span>' : '<span class="risk-badge risk-high">No</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = registrations.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No registrations to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} registrations`;
  } else {
    el.textContent = `Showing ${shown} of ${total} registrations`;
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
  const validity = document.getElementById('filter-class');
  const referral = document.getElementById('filter-deadline');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.registrationClass = validity.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.deadline = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.registrationClass = '';
      filters.deadline = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRegistrations() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  registrations = sampleRegistrations;
  renderAll();

  try {
    const items = await fetchRegistrations();
    if (items && items.length > 0) {
      registrations = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no registrations.');
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
  loadRegistrations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
