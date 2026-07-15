import { fetchChecks } from './api.js';
import { sampleChecks } from './data.js';

// Learning Disability Annual Health Check — clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the check list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// status dropdown + Health-Action-Plan dropdown + STOMP dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.LearningDisabilityAnnualHealthCheckDashboard`.
// The whole file is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').CheckRow[]} */
let checks = [];

const filters = {
  search: '',
  status: '',   // '' | 'complete' | 'incomplete'
  hap: '',      // '' | 'yes' | 'no'
  stomp: ''     // '' | 'yes' | 'no'
};

// Default sort: person name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'personName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'personIdentifier',    label: 'Person ID' },
  { key: 'personName',          label: 'Name' },
  { key: 'practiceName',        label: 'Practice' },
  { key: 'status',              label: 'Status' },
  { key: 'completenessPercent', label: 'Completeness' },
  { key: 'healthActionPlan',    label: 'HAP' },
  { key: 'stompFlag',           label: 'STOMP' }
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
  if (status === 'incomplete') return 'risk-moderate';
  return '';
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'incomplete') return 'Incomplete';
  return 'N/A';
}

function percentLabel(percent) {
  return (percent === null || percent === undefined) ? 'N/A' : `${percent}%`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.hap !== '' ||
    filters.stomp !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').CheckRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.personIdentifier.toLowerCase().includes(term) ||
      row.personName.toLowerCase().includes(term) ||
      (row.practiceName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.status !== filters.status) return false;
  if (filters.hap === 'yes' && !row.healthActionPlan) return false;
  if (filters.hap === 'no' && row.healthActionPlan) return false;
  if (filters.stomp === 'yes' && !row.stompFlag) return false;
  if (filters.stomp === 'no' && row.stompFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The status column uses its rank
 * table; the completeness percentage sorts numerically; the boolean HAP / STOMP
 * columns sort false<true; everything else uses a locale-aware string compare.
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

  if (key === 'completenessPercent') {
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'healthActionPlan' || key === 'stompFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (personIdentifier, personName, practiceName)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return checks.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕'; // up-down arrow
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
    if (row.stompFlag || row.status === 'incomplete') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.personIdentifier)}</td>
      <td>${esc(row.personName)}</td>
      <td>${esc(row.practiceName)}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(percentLabel(row.completenessPercent))}</span></td>
      <td>
        <span class="flag-badge ${row.healthActionPlan ? 'flag-yes' : 'flag-no'}">
          ${row.healthActionPlan ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="flag-badge ${row.stompFlag ? 'flag-yes' : 'flag-no'}">
          ${row.stompFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = checks.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No checks to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} checks`;
  } else {
    el.textContent = `Showing ${shown} of ${total} checks`;
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
  const hap = document.getElementById('filter-hap');
  const stomp = document.getElementById('filter-stomp');
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
  if (hap) {
    hap.addEventListener('change', () => {
      filters.hap = hap.value;
      renderAll();
    });
  }
  if (stomp) {
    stomp.addEventListener('change', () => {
      filters.stomp = stomp.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.hap = '';
      filters.stomp = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (hap) hap.value = '';
      if (stomp) stomp.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadChecks() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  checks = sampleChecks;
  renderAll();

  try {
    const items = await fetchChecks();
    if (items && items.length > 0) {
      checks = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no checks.');
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
  loadChecks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
