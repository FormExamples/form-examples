import { fetchCarePlans } from './api.js';
import { samplePlans } from './data.js';

// Nursing Care Plan — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the care-plan list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + status dropdown + care-setting dropdown + flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.NursingCarePlanDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak to the global
// scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').PlanRow[]} */
let plans = [];

const filters = {
  search: '',
  status: '',   // '' | 'complete' | 'partial' | 'incomplete'
  setting: '',  // '' | 'ward' | 'community' | 'care-home' | 'hospice' | 'other'
  flags: ''     // '' | 'yes' | 'no'
};

// Default sort: patient name ascending.
const sortState = { key: 'patientName', direction: 'asc' };

const columns = [
  { key: 'patientIdentifier',   label: 'Identifier' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'wardLocation',        label: 'Ward / Location' },
  { key: 'careSetting',         label: 'Setting' },
  { key: 'status',              label: 'Status' },
  { key: 'completenessPercent', label: 'Completeness' },
  { key: 'problemCount',        label: 'Problems' },
  { key: 'flagCount',           label: 'Flags' }
];

// Rank used when sorting the status column so 'incomplete' clusters distinctly
// from 'complete' regardless of locale.
const statusRank = { complete: 0, partial: 1, incomplete: 2 };

const settingLabels = {
  'ward': 'Ward',
  'community': 'Community',
  'care-home': 'Care home',
  'hospice': 'Hospice',
  'other': 'Other'
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

/** CSS badge class for a completeness status (reuses the shared risk palette). */
function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-critical';
    default: return '';
  }
}

function statusLabel(status) {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.setting !== '' ||
    filters.flags !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      row.wardLocation.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.status !== filters.status) return false;
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.flags === 'yes' && !(row.flagCount > 0)) return false;
  if (filters.flags === 'no' && row.flagCount > 0) return false;
  return true;
}

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

  if (key === 'completenessPercent' || key === 'problemCount' || key === 'flagCount') {
    return (av - bv) * dir;
  }

  // Default: string compare (identifier, name, ward, setting).
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return plans.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('plans-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '↕';
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') { ariaSort = 'ascending'; indicator = '↑'; }
      else { ariaSort = 'descending'; indicator = '↓'; }
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
  const body = document.getElementById('plans-table-body');
  const empty = document.getElementById('plans-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.status === 'incomplete') tr.classList.add('row-critical');

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.wardLocation)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td class="num">${row.completenessPercent}%</td>
      <td class="num">${row.problemCount}</td>
      <td class="num">
        <span class="flag-badge ${row.flagCount > 0 ? 'flag-yes' : 'flag-no'}">${row.flagCount}</span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = plans.length;
  const shown = visibleRows().length;
  if (total === 0) el.textContent = 'No care plans to display.';
  else el.textContent = `Showing ${shown} of ${total} care plans`;
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const status = document.getElementById('filter-status');
  const setting = document.getElementById('filter-setting');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) search.addEventListener('input', () => { filters.search = search.value; renderAll(); });
  if (status) status.addEventListener('change', () => { filters.status = status.value; renderAll(); });
  if (setting) setting.addEventListener('change', () => { filters.setting = setting.value; renderAll(); });
  if (flags) flags.addEventListener('change', () => { filters.flags = flags.value; renderAll(); });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.setting = '';
      filters.flags = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (setting) setting.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPlans() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  plans = samplePlans;
  renderAll();

  try {
    const items = await fetchCarePlans();
    if (items && items.length > 0) {
      plans = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no care plans.');
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
