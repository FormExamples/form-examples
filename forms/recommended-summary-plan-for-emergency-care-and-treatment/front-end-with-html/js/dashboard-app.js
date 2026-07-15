import { fetchPlans } from './api.js';
import { samplePlans } from './data.js';

// ReSPECT — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the plan list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// status dropdown + CPR dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').PlanRow[]} */
let plans = [];

const filters = {
  search: '',
  status: '',   // '' | 'complete' | 'incomplete'
  cpr: ''       // '' | 'attempt' | 'do-not-attempt' | 'none'
};

// Default sort: person name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'personName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',    label: 'Patient ID' },
  { key: 'personName',           label: 'Person Name' },
  { key: 'status',               label: 'Status' },
  { key: 'completenessPercent',  label: 'Completeness' },
  { key: 'cprRecommendation',    label: 'CPR' },
  { key: 'reviewDate',           label: 'Review Date' }
];

// Rank used when sorting the status column so 'complete' is always less than
// 'incomplete' regardless of locale.
const statusRank = {
  'complete': 0,
  'incomplete': 1
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
  if (status === 'complete') return 'risk-low';
  if (status === 'incomplete') return 'risk-high';
  return '';
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'incomplete') return 'Incomplete';
  return 'N/A';
}

function cprLabel(value) {
  if (value === 'attempt') return 'Attempt';
  if (value === 'do-not-attempt') return 'DNACPR';
  return 'Not documented';
}

function cprClass(value) {
  if (value === 'attempt' || value === 'do-not-attempt') return 'flag-yes';
  return 'flag-no';
}

function reviewDatePassed(value) {
  if (!value) return false;
  const d = new Date(value);
  if (isNaN(d.getTime())) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const rd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return rd < today;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.cpr !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').PlanRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.personName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.status !== filters.status) return false;
  if (filters.cpr) {
    if (filters.cpr === 'none') {
      if (row.cprRecommendation !== '' && row.cprRecommendation !== null) return false;
    } else if (row.cprRecommendation !== filters.cpr) {
      return false;
    }
  }
  return true;
}

/**
 * Compare two rows for the active sort column. The status column uses its rank
 * table; completenessPercent sorts numerically; everything else uses a
 * locale-aware string compare with empty values sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'status') {
    av = statusRank[av] ?? 99;
    bv = statusRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'completenessPercent') {
    const an = typeof av === 'number' ? av : -1;
    const bn = typeof bv === 'number' ? bv : -1;
    return (an - bn) * dir;
  }

  if (key === 'reviewDate') {
    // Nulls (no review date) sort last in both directions.
    const aNull = !av;
    const bNull = !bv;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return String(av).localeCompare(String(bv)) * dir;
  }

  // Default: string compare (patientIdentifier, personName, cprRecommendation)
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return plans.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need clinical attention: incomplete plans, an
    // undocumented CPR recommendation, or a review date in the past.
    if (
      row.status === 'incomplete' ||
      !row.cprRecommendation ||
      reviewDatePassed(row.reviewDate)
    ) {
      tr.classList.add('row-critical');
    }

    const reviewText = row.reviewDate
      ? esc(row.reviewDate) + (reviewDatePassed(row.reviewDate) ? ' (passed)' : '')
      : 'Not set';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.personName)}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(String(row.completenessPercent))}%</span></td>
      <td><span class="flag-badge ${cprClass(row.cprRecommendation)}">${esc(cprLabel(row.cprRecommendation))}</span></td>
      <td>${reviewText}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = plans.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No plans to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} plans`;
  } else {
    el.textContent = `Showing ${shown} of ${total} plans`;
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
  const status = document.getElementById('filter-status');
  const cpr = document.getElementById('filter-cpr');
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
  if (cpr) {
    cpr.addEventListener('change', () => {
      filters.cpr = cpr.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.cpr = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (cpr) cpr.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPlans() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  plans = samplePlans;
  renderAll();

  try {
    const items = await fetchPlans();
    if (items && items.length > 0) {
      plans = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no plans.');
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
  loadPlans();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
