import { fetchWills } from './api.js';
import { sampleWills } from './data.js';

// United Kingdom Last Will and Testament — wills dashboard (vanilla
// ES-module app).
//
// On boot we fetch the will list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + validity-class dropdown + formality-risk dropdown).
//
// This dashboard is a review tool. It surfaces the engine's validity
// classification, the total of the beneficiary shares, and the witness count;
// it is documentation support, not legal advice.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').WillRow[]} */
let wills = [];

const filters = {
  search: '',
  validity: '',   // '' | 'valid' | 'incomplete' | 'formality-risk'
  risk: ''        // '' | 'yes' | 'no'
};

// Default sort: testator name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'testatorName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'testatorName',       label: 'Testator' },
  { key: 'executionStatus',    label: 'Status' },
  { key: 'validityClass',      label: 'Validity' },
  { key: 'sharesTotalPercent', label: 'Shares Total' },
  { key: 'witnessCount',       label: 'Witnesses' },
  { key: 'formalityRisk',      label: 'Formality Risk' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'valid': 0, 'incomplete': 1, 'formality-risk': 2 };

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
  if (cls === 'valid') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'formality-risk') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'valid') return 'Valid';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'formality-risk') return 'Formality risk';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.risk !== ''
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
      (row.executionStatus || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.validityClass !== filters.validity) return false;
  if (filters.risk) {
    const wantRisk = filters.risk === 'yes';
    if (Boolean(row.formalityRisk) !== wantRisk) return false;
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
  if (key === 'formalityRisk') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }
  if (key === 'sharesTotalPercent' || key === 'witnessCount') {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  // Default: string compare (testatorName, executionStatus). Empty values sort last.
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
    // Highlight rows that need attention: an incomplete will or a formality
    // risk.
    if (row.validityClass === 'incomplete' || row.formalityRisk) {
      tr.classList.add('row-critical');
    }

    const riskBadge = row.formalityRisk
      ? `<span class="risk-badge risk-high">Risk</span>`
      : `<span class="risk-badge risk-low">No</span>`;
    const statusText = row.executionStatus === 'signed' ? 'Signed and witnessed' : 'Draft';

    tr.innerHTML = `
      <td>${esc(row.testatorName)}</td>
      <td>${esc(statusText)}</td>
      <td><span class="risk-badge ${validityClassName(row.validityClass)}">${esc(validityLabel(row.validityClass))}</span></td>
      <td>${esc(row.sharesTotalPercent)}%</td>
      <td>${esc(row.witnessCount)}</td>
      <td>${riskBadge}</td>
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
  const risk = document.getElementById('filter-risk');
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
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.risk = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (risk) risk.value = '';
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
