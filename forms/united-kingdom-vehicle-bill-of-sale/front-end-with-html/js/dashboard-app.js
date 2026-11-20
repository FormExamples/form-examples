import { fetchBillsOfSale } from './api.js';
import { sampleBillsOfSale } from './data.js';

// United Kingdom Vehicle Bill of Sale — sales dashboard (vanilla
// classic-script app).
//
// On boot we fetch the bill-of-sale list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + classification dropdown + risk dropdown).
//
// This dashboard is a review tool. It surfaces the engine's classification
// (complete / incomplete / risk-flagged) and the missing-item and risk counts;
// it is documentation support, not legal advice.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').BillOfSaleRow[]} */
let rows = [];

const filters = {
  search: '',
  validity: '',   // '' | 'complete' | 'incomplete' | 'risk-flagged'
  referral: ''    // '' | 'yes' | 'no' (a risk condition holds)
};

// Default sort: registration ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'registration',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'registration',     label: 'Registration' },
  { key: 'vehicle',          label: 'Vehicle' },
  { key: 'sellerName',       label: 'Seller' },
  { key: 'buyerName',        label: 'Buyer' },
  { key: 'classification',   label: 'Classification' },
  { key: 'riskFlagCount',    label: 'Risk' },
  { key: 'missingItemCount', label: 'Missing items' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'complete': 0, 'incomplete': 1, 'risk-flagged': 2 };

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
  if (cls === 'complete') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'risk-flagged') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'complete') return 'Complete';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'risk-flagged') return 'Risk flagged';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').BillOfSaleRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.registration.toLowerCase().includes(term) ||
      (row.vehicle || '').toLowerCase().includes(term) ||
      (row.sellerName || '').toLowerCase().includes(term) ||
      (row.buyerName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.classification !== filters.validity) return false;
  if (filters.referral) {
    const wantReferral = filters.referral === 'yes';
    if ((row.riskFlagCount > 0) !== wantReferral) return false;
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

  if (key === 'classification') {
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'riskFlagCount' || key === 'missingItemCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (registration, vehicle, sellerName, buyerName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return rows.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: incomplete or risk-flagged.
    if (row.classification === 'incomplete' || row.riskFlagCount > 0) {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.riskFlagCount > 0
      ? `<span class="risk-badge risk-high">${esc(row.riskFlagCount)}</span>`
      : `<span class="risk-badge risk-low">None</span>`;

    tr.innerHTML = `
      <td>${esc(row.registration)}</td>
      <td>${row.vehicle ? esc(row.vehicle) : '<span class="muted">Not recorded</span>'}</td>
      <td>${row.sellerName ? esc(row.sellerName) : '<span class="muted">Not recorded</span>'}</td>
      <td>${row.buyerName ? esc(row.buyerName) : '<span class="muted">Not recorded</span>'}</td>
      <td><span class="risk-badge ${validityClassName(row.classification)}">${esc(validityLabel(row.classification))}</span></td>
      <td>${referralBadge}</td>
      <td>${esc(row.missingItemCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = rows.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No bills of sale to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} bills of sale`;
  } else {
    el.textContent = `Showing ${shown} of ${total} bills of sale`;
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
  const referral = document.getElementById('filter-referral');
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
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.referral = '';
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

async function loadBillsOfSale() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  rows = sampleBillsOfSale;
  renderAll();

  try {
    const items = await fetchBillsOfSale();
    if (items && items.length > 0) {
      rows = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no bills of sale.');
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
  loadBillsOfSale();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
