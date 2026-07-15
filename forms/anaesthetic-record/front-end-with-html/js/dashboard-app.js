import { fetchRecords } from './api.js';
import { sampleRecords } from './data.js';

// Anaesthetic Record — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the record list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// urgency dropdown + completeness-status dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').RecordRow[]} */
let records = [];

const filters = {
  search: '',
  urgency: '',  // '' | urgency
  status: ''    // '' | 'complete' | 'partial' | 'incomplete'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'theatre',             label: 'Theatre' },
  { key: 'anaesthetistName',    label: 'Anaesthetist' },
  { key: 'urgency',             label: 'Urgency' },
  { key: 'completenessPercent', label: 'Completeness' },
  { key: 'status',              label: 'Status' },
  { key: 'flagCount',           label: 'Flags' }
];

// Rank used when sorting the status column so 'complete' < 'partial' <
// 'incomplete' regardless of locale.
const statusRank = {
  'complete': 0,
  'partial': 1,
  'incomplete': 2
};

const urgencyRank = {
  'elective': 0,
  'urgent': 1,
  'emergency': 2,
  'immediate': 3
};

const urgencyLabels = {
  'elective': 'Elective',
  'urgent': 'Urgent',
  'emergency': 'Emergency',
  'immediate': 'Immediate'
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

function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return 'N/A';
  }
}

function urgencyLabel(u) {
  return urgencyLabels[u] || u || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.urgency !== '' ||
    filters.status !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').RecordRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      row.anaesthetistName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.urgency && row.urgency !== filters.urgency) return false;
  if (filters.status && row.status !== filters.status) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The status and urgency columns
 * use their rank tables; the numeric columns sort numerically; everything else
 * uses a locale-aware string compare.
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

  if (key === 'urgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'completenessPercent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return records.filter(matchesFilters).slice().sort(compareRows);
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

  if (rows.length === 0) {
    if (empty) empty.hidden = false;
  } else {
    if (empty) empty.hidden = true;
  }

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.status === 'incomplete') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.theatre)}</td>
      <td>${esc(row.anaesthetistName)}</td>
      <td>${esc(urgencyLabel(row.urgency))}</td>
      <td><span class="class-cell">${esc(String(row.completenessPercent))}%</span></td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(String(row.flagCount))}</span></td>
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
  const urgency = document.getElementById('filter-urgency');
  const status = document.getElementById('filter-status');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.urgency = '';
      filters.status = '';
      if (search) search.value = '';
      if (urgency) urgency.value = '';
      if (status) status.value = '';
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
  records = sampleRecords;
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
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
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
