import { fetchRecords } from './api.js';
import { sampleRows } from './data.js';

// Return to Work — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the record list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + fitness-statement dropdown + restriction-priority dropdown +
// phased-return dropdown + flags dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').DashboardRow[]} */
let records = [];

const filters = {
  search: '',
  fitness: '',
  priority: '',
  phased: '', // '', 'yes', 'no'
  flags: ''   // '', 'yes', 'no'
};

// Default sort: patient name ascending (matches the Svelte dashboard).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'id',                  label: 'Record' },
  { key: 'patientName',         label: 'Patient' },
  { key: 'assessedDate',        label: 'Assessed' },
  { key: 'fitnessStatement',    label: 'Fitness' },
  { key: 'restrictionPriority', label: 'Priority' },
  { key: 'phasedReturnFlag',    label: 'Phased' },
  { key: 'daysAbsent',          label: 'Days Absent' },
  { key: 'flagCount',           label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const fitnessRank = {
  'fit': 0,
  'may-be-fit': 1,
  'not-fit': 2
};

const priorityRank = {
  'routine': 0,
  'standard': 1,
  'restricted': 2,
  'high-risk': 3
};

// Human-readable labels for categorical values.
const FITNESS_LABELS = {
  'fit': 'Fit for work',
  'may-be-fit': 'May be fit — with adjustments',
  'not-fit': 'Not fit for work'
};

const PRIORITY_LABELS = {
  'routine': 'Routine',
  'standard': 'Standard',
  'restricted': 'Restricted',
  'high-risk': 'High-risk'
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

function fitnessClass(s) {
  return s ? 'fitness-' + String(s) : '';
}

function priorityClass(p) {
  return p ? 'priority-' + String(p) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.fitness !== '' ||
    filters.priority !== '' ||
    filters.phased !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').DashboardRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.patientName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.fitness && row.fitnessStatement !== filters.fitness) return false;
  if (filters.priority && row.restrictionPriority !== filters.priority) return false;
  if (filters.phased === 'yes' && !row.phasedReturnFlag) return false;
  if (filters.phased === 'no' && row.phasedReturnFlag) return false;
  const hasFlags = (row.flagCount || 0) > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use their
 * rank tables; numbers compare directly; everything else uses a locale-aware
 * string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'fitnessStatement') {
    return ((fitnessRank[av] ?? -1) - (fitnessRank[bv] ?? -1)) * dir;
  }
  if (key === 'restrictionPriority') {
    return ((priorityRank[av] ?? -1) - (priorityRank[bv] ?? -1)) * dir;
  }
  if (key === 'phasedReturnFlag') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }
  if (key === 'daysAbsent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  // Default: string compare (id, patientName, assessedDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return records.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('records-table-head');
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

function renderFlagsCell(count) {
  const n = count || 0;
  if (n === 0) return '<span class="flag-empty">—</span>';
  return `<span class="flag-chip">${esc(n)}</span>`;
}

function renderTableBody() {
  const body = document.getElementById('records-table-body');
  const empty = document.getElementById('records-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.fitnessStatement === 'not-fit' || row.restrictionPriority === 'high-risk') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.id)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.assessedDate)}</span></td>
      <td class="data-table-td"><span class="fitness-badge ${fitnessClass(row.fitnessStatement)}">${esc(FITNESS_LABELS[row.fitnessStatement] || row.fitnessStatement)}</span></td>
      <td class="data-table-td"><span class="priority-badge ${priorityClass(row.restrictionPriority)}">${esc(PRIORITY_LABELS[row.restrictionPriority] || row.restrictionPriority)}</span></td>
      <td class="data-table-td">${row.phasedReturnFlag ? 'Yes' : 'No'}</td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.daysAbsent ?? '—')}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flagCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = records.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No records to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} records`;
  } else {
    el.textContent = `Showing ${shown} of ${total} records`;
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
  const fitness = document.getElementById('filter-fitness');
  const priority = document.getElementById('filter-priority');
  const phased = document.getElementById('filter-phased');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (fitness) {
    fitness.addEventListener('change', () => {
      filters.fitness = fitness.value;
      renderAll();
    });
  }
  if (priority) {
    priority.addEventListener('change', () => {
      filters.priority = priority.value;
      renderAll();
    });
  }
  if (phased) {
    phased.addEventListener('change', () => {
      filters.phased = phased.value;
      renderAll();
    });
  }
  if (flags) {
    flags.addEventListener('change', () => {
      filters.flags = flags.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.fitness = '';
      filters.priority = '';
      filters.phased = '';
      filters.flags = '';
      if (search) search.value = '';
      if (fitness) fitness.value = '';
      if (priority) priority.value = '';
      if (phased) phased.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRecords() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  records = sampleRows;
  renderAll();

  try {
    const items = await fetchRecords();
    if (items && items.length > 0) {
      records = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no records.'
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
  loadRecords();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
