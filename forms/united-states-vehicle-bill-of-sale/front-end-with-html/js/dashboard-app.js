import { fetchBillsOfSale } from './api.js';
import { sampleBillsOfSale } from './data.js';

// United States Vehicle Bill of Sale: review dashboard (vanilla ES-module app).
//
// On boot we fetch the bill-of-sale list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + completeness-class dropdown + odometer-exemption dropdown).
//
// This dashboard is a review tool. It surfaces the engine's completeness
// classification, the lead issue, and whether the federal odometer disclosure
// is exempt; it gives NO legal advice and the state agency decides.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').BillOfSaleRow[]} */
let billsOfSale = [];

const filters = {
  search: '',
  validity: '',   // '' | 'complete' | 'incomplete' | 'risk-flagged'
  referral: ''    // '' | 'yes' | 'no'
};

// Default sort: vehicle ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'vehicle',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'vin',               label: 'VIN' },
  { key: 'vehicle',           label: 'Vehicle' },
  { key: 'leadIssue',         label: 'Lead Issue' },
  { key: 'completenessClass', label: 'Class' },
  { key: 'odometerExempt',    label: 'Odometer Exempt' },
  { key: 'sellerName',        label: 'Seller' }
];

// Rank tables so sorting is locale-independent and ordered by severity.
const classRank = { 'complete': 0, 'incomplete': 1, 'risk-flagged': 2 };

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

function completenessClassName(cls) {
  if (cls === 'complete') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'risk-flagged') return 'risk-high';
  return '';
}

function classLabel(cls) {
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
      row.vin.toLowerCase().includes(term) ||
      row.vehicle.toLowerCase().includes(term) ||
      (row.leadIssue || '').toLowerCase().includes(term) ||
      (row.sellerName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.completenessClass !== filters.validity) return false;
  if (filters.referral) {
    const wantReferral = filters.referral === 'yes';
    if (Boolean(row.odometerExempt) !== wantReferral) return false;
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

  if (key === 'completenessClass') {
    return ((classRank[av] ?? 99) - (classRank[bv] ?? 99)) * dir;
  }
  if (key === 'odometerExempt') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (vin, vehicle, leadIssue,
  // sellerName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return billsOfSale.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('bills-table-head');
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
  const body = document.getElementById('bills-table-body');
  const empty = document.getElementById('bills-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    // Highlight rows that need attention: incomplete or risk-flagged.
    if (row.completenessClass === 'incomplete' || row.completenessClass === 'risk-flagged') {
      tr.classList.add('row-critical');
    }

    const exemptBadge = row.odometerExempt
      ? `<span class="risk-badge risk-low">Exempt</span>`
      : `<span class="risk-badge risk-moderate">Required</span>`;

    tr.innerHTML = `
      <td>${esc(row.vin)}</td>
      <td>${esc(row.vehicle)}</td>
      <td>${row.leadIssue ? esc(row.leadIssue) : '<span class="muted">None</span>'}</td>
      <td><span class="risk-badge ${completenessClassName(row.completenessClass)}">${esc(classLabel(row.completenessClass))}</span></td>
      <td>${exemptBadge}</td>
      <td>${row.sellerName ? esc(row.sellerName) : '<span class="muted">Not recorded</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = billsOfSale.length;
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
  billsOfSale = sampleBillsOfSale;
  renderAll();

  try {
    const items = await fetchBillsOfSale();
    if (items && items.length > 0) {
      billsOfSale = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no billsOfSale.');
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
