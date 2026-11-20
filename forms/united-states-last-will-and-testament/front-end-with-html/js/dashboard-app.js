import { fetchWills } from './api.js';
import { sampleWills } from './data.js';

// United States Last Will and Testament — drafter dashboard (vanilla classic-script app).
//
// On boot we fetch the will list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + validity-class dropdown + needs-attention dropdown).
//
// This dashboard is a review tool. It surfaces the engine's validity
// classification and whether any high-priority flag was raised; it gives no legal
// advice.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').WillRow[]} */
let wills = [];

const filters = {
  search: '',
  validity: '',   // '' | 'valid-ready-to-execute' | 'incomplete' | 'formality-risk'
  attention: ''   // '' | 'yes' | 'no'
};

// Default sort: testator name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'testatorName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'testatorName',                label: 'Testator' },
  { key: 'state',                       label: 'State' },
  { key: 'executionForm',               label: 'Execution' },
  { key: 'validityClass',               label: 'Validity' },
  { key: 'highFlagCount',               label: 'High Flags' },
  { key: 'personalRepresentativeName',  label: 'Personal Representative' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'valid-ready-to-execute': 0, 'incomplete': 1, 'formality-risk': 2 };

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

function validityClassName(cls) {
  if (cls === 'valid-ready-to-execute') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'formality-risk') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'valid-ready-to-execute') return 'Valid, ready';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'formality-risk') return 'Formality risk';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.attention !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').WillRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.testatorName.toLowerCase().includes(term) ||
      row.state.toLowerCase().includes(term) ||
      (row.executionForm || '').toLowerCase().includes(term) ||
      (row.personalRepresentativeName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.validityClass !== filters.validity) return false;
  if (filters.attention) {
    const wantAttention = filters.attention === 'yes';
    if ((row.highFlagCount > 0) !== wantAttention) return false;
  }
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

  if (key === 'validityClass') {
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'highFlagCount') {
    return ((av || 0) - (bv || 0)) * dir;
  }

  // Default: string compare (testatorName, state, executionForm,
  // personalRepresentativeName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return wills.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: an incomplete plan or a formality risk.
    if (row.validityClass === 'incomplete' || row.highFlagCount > 0) {
      tr.classList.add('row-critical');
    }

    const flagBadge = row.highFlagCount > 0
      ? `<span class="risk-badge risk-high">${esc(row.highFlagCount)}</span>`
      : `<span class="risk-badge risk-low">0</span>`;

    tr.innerHTML = `
      <td>${esc(row.testatorName)}</td>
      <td>${esc(row.state)}</td>
      <td>${row.executionForm ? esc(row.executionForm) : '<span class="muted">Not set</span>'}</td>
      <td><span class="risk-badge ${validityClassName(row.validityClass)}">${esc(validityLabel(row.validityClass))}</span></td>
      <td>${flagBadge}</td>
      <td>${row.personalRepresentativeName ? esc(row.personalRepresentativeName) : '<span class="muted">Not named</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = wills.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No wills to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} wills`;
  } else {
    el.textContent = `Showing ${shown} of ${total} wills`;
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
  const validity = document.getElementById('filter-validity');
  const attention = document.getElementById('filter-attention');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.validity = validity.value;
      renderAll();
    });
  }
  if (attention) {
    attention.addEventListener('change', () => {
      filters.attention = attention.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.attention = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (attention) attention.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadWills() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  wills = sampleWills;
  renderAll();

  try {
    const items = await fetchWills();
    if (items && items.length > 0) {
      wills = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no wills.');
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
  loadWills();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
