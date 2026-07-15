import { fetchCharts } from './api.js';
import { sampleCharts } from './data.js';

// Fluid Balance Chart — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the chart list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// ward dropdown + fluid-status dropdown + balance-sign dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.FluidBalanceChartDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ChartRow[]} */
let charts = [];

const filters = {
  search: '',
  ward: '',     // '' | ward name
  status: '',   // '' | 'balanced' | 'positive' | 'negative' | 'oliguria'
  sign: ''      // '' | 'positive' | 'negative' | 'zero'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',              label: 'Patient ID' },
  { key: 'patientName',                    label: 'Patient Name' },
  { key: 'wardOrUnit',                     label: 'Ward / Unit' },
  { key: 'totalIntakeMl',                  label: 'Intake (mL)' },
  { key: 'totalOutputMl',                  label: 'Output (mL)' },
  { key: 'netBalanceMl',                   label: 'Net (mL)' },
  { key: 'urineOutputRateMlPerKgPerHour',  label: 'Urine (mL/kg/h)' },
  { key: 'fluidStatus',                    label: 'Status' }
];

// Rank used when sorting the fluidStatus column: escalate low → high concern.
const statusRank = {
  'balanced': 0,
  'positive': 1,
  'negative': 1,
  'oliguria': 2
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
    case 'oliguria': return 'risk-high';
    case 'positive': return 'risk-moderate';
    case 'negative': return 'risk-moderate';
    case 'balanced': return 'risk-low';
    default: return '';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'oliguria': return 'Oliguria';
    case 'positive': return 'Positive';
    case 'negative': return 'Negative';
    case 'balanced': return 'Balanced';
    default: return 'N/A';
  }
}

function fmtMl(n) {
  if (typeof n !== 'number') return 'N/A';
  return `${n >= 0 ? '+' : ''}${n}`;
}

function fmtRate(n) {
  return typeof n === 'number' ? n.toFixed(2) : '—';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.ward !== '' ||
    filters.status !== '' ||
    filters.sign !== ''
  );
}

/** Distinct ward names present in the current data, sorted. */
function wardOptions() {
  const set = new Set();
  for (const c of charts) {
    if (c.wardOrUnit) set.add(c.wardOrUnit);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ChartRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.ward && row.wardOrUnit !== filters.ward) return false;
  if (filters.status && row.fluidStatus !== filters.status) return false;
  if (filters.sign) {
    const n = row.netBalanceMl;
    if (filters.sign === 'positive' && !(n > 0)) return false;
    if (filters.sign === 'negative' && !(n < 0)) return false;
    if (filters.sign === 'zero' && n !== 0) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. The fluid-status column uses its
 * rank table; the numeric columns sort numerically; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'fluidStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (
    key === 'totalIntakeMl' ||
    key === 'totalOutputMl' ||
    key === 'netBalanceMl' ||
    key === 'urineOutputRateMlPerKgPerHour'
  ) {
    return ((av ?? -Infinity) - (bv ?? -Infinity)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, wardOrUnit)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return charts.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderWardFilterOptions() {
  const sel = document.getElementById('filter-ward');
  if (!sel) return;
  const current = sel.value;
  const opts = ['<option value="">All wards</option>']
    .concat(wardOptions().map((w) => `<option value="${esc(w)}">${esc(w)}</option>`));
  sel.innerHTML = opts.join('');
  sel.value = current;
}

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
    if (row.fluidStatus === 'oliguria') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.wardOrUnit)}</td>
      <td><span class="class-cell">${esc(String(row.totalIntakeMl))}</span></td>
      <td><span class="class-cell">${esc(String(row.totalOutputMl))}</span></td>
      <td><span class="class-cell">${esc(fmtMl(row.netBalanceMl))}</span></td>
      <td><span class="class-cell">${esc(fmtRate(row.urineOutputRateMlPerKgPerHour))}</span></td>
      <td><span class="risk-badge ${statusClass(row.fluidStatus)}">${esc(statusLabel(row.fluidStatus))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = charts.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No charts to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} charts`;
  } else {
    el.textContent = `Showing ${shown} of ${total} charts`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

function renderAll() {
  renderWardFilterOptions();
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
  const ward = document.getElementById('filter-ward');
  const status = document.getElementById('filter-status');
  const sign = document.getElementById('filter-sign');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (ward) {
    ward.addEventListener('change', () => {
      filters.ward = ward.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (sign) {
    sign.addEventListener('change', () => {
      filters.sign = sign.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.ward = '';
      filters.status = '';
      filters.sign = '';
      if (search) search.value = '';
      if (ward) ward.value = '';
      if (status) status.value = '';
      if (sign) sign.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadCharts() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  charts = sampleCharts;
  renderAll();

  try {
    const items = await fetchCharts();
    if (items && items.length > 0) {
      charts = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no charts.'
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
  loadCharts();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
