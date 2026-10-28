import { fetchFitNotes } from './api.js';
import { sampleFitNotes } from './data.js';
import { adviceLabel, approvalLabel } from './types.js';

// Medical Fit Note - clinician dashboard (vanilla ES-module app).
//
// On boot we show the sample rows immediately, then try the backend and
// replace them on success; on failure (or an empty response) we keep the
// sample rows and show a small banner. The table is sortable (click a column
// header) and filterable (search + approval + advice + flags).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').FitNoteRow[]} */
let fitNotes = [];

const filters = { search: '', approval: '', advice: '', flags: '' };

// Default sort: most recent date first.
const sortState = { key: 'date', direction: 'desc' };

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'employee', label: 'Employee' },
  { key: 'employer', label: 'Employer' },
  { key: 'advice', label: 'Advice' },
  { key: 'durationDays', label: 'Days' },
  { key: 'adjustments', label: 'Adjustments' },
  { key: 'approval', label: 'Approval' },
  { key: 'flags', label: 'Flags' },
  { key: 'clinician', label: 'Clinician' }
];

// Worst-last rank so sorting the approval column is never alphabetical.
const approvalRank = { approved: 0, 'needs-completion': 1, blocked: 2 };

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasActiveFilters() {
  return Object.values(filters).some((v) => v !== '');
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/** @param {import('./types.js').FitNoteRow} row */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const hit =
      String(row.employee || '').toLowerCase().includes(term) ||
      String(row.employer || '').toLowerCase().includes(term) ||
      String(row.clinician || '').toLowerCase().includes(term);
    if (!hit) return false;
  }
  if (filters.approval && row.approval !== filters.approval) return false;
  if (filters.advice && row.advice !== filters.advice) return false;
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'approval') {
    return ((approvalRank[av] ?? -1) - (approvalRank[bv] ?? -1)) * dir;
  }
  if (key === 'durationDays') {
    // null durations sort last regardless of direction.
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av - bv) * dir;
  }
  if (key === 'adjustments') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'flags') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return fitNotes.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('fit-notes-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '↕';
    if (sortState.key === col.key) {
      ariaSort = sortState.direction === 'asc' ? 'ascending' : 'descending';
      indicator = sortState.direction === 'asc' ? '↑' : '↓';
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

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">—</span>';
  }
  const chips = flags.map((f) => `<span class="flag-chip">${esc(f)}</span>`).join('');
  return `<div class="flag-list">${chips}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('fit-notes-table-body');
  const empty = document.getElementById('fit-notes-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';
  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.approval === 'blocked') tr.classList.add('row-critical');

    const days =
      row.durationDays === null || row.durationDays === undefined
        ? '<span class="numeric-muted">—</span>'
        : esc(row.durationDays);

    tr.innerHTML = `
      <td class="data-table-td"><span class="date-cell">${esc(row.date) || '<span class="numeric-muted">—</span>'}</span></td>
      <td class="data-table-td"><strong>${esc(row.employee)}</strong></td>
      <td class="data-table-td">${esc(row.employer)}</td>
      <td class="data-table-td">${esc(adviceLabel(row.advice)) || '<span class="numeric-muted">—</span>'}</td>
      <td class="data-table-td"><span class="numeric-cell">${days}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.adjustments)}</span></td>
      <td class="data-table-td"><span class="approval-badge approval-${esc(row.approval)}">${esc(approvalLabel(row.approval))}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>
      <td class="data-table-td">${esc(row.clinician)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = fitNotes.length;
  const shown = visibleRows().length;
  el.textContent = total === 0
    ? 'No fit notes to display.'
    : `Showing ${shown} of ${total} fit notes`;
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (btn) btn.hidden = !hasActiveFilters();
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
    sortState.direction = key === 'date' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const bindings = [
    ['filter-search', 'search', 'input'],
    ['filter-approval', 'approval', 'change'],
    ['filter-advice', 'advice', 'change'],
    ['filter-flags', 'flags', 'change']
  ];
  for (const [id, key, evt] of bindings) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.addEventListener(evt, () => {
      filters[key] = el.value;
      renderAll();
    });
  }
  const clearBtn = document.getElementById('filter-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      for (const [id, key] of bindings) {
        filters[key] = '';
        const el = document.getElementById(id);
        if (el) el.value = '';
      }
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadFitNotes() {
  // Optimistic: show sample data immediately so the page is never blank.
  fitNotes = sampleFitNotes;
  renderAll();

  try {
    const items = await fetchFitNotes();
    if (items && items.length > 0) {
      fitNotes = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no fit notes.');
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
  loadFitNotes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
