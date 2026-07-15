import { fetchReviews } from './api.js';
import { sampleReviews } from './data.js';

// SMR — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// care-setting dropdown + burden-band dropdown + review-status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.StructuredMedicationReviewDashboard`. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting
  band: '',      // '' | 'low' | 'moderate' | 'high'
  status: ''     // '' | 'complete' | 'incomplete'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',          label: 'Patient ID' },
  { key: 'patientName',                label: 'Patient Name' },
  { key: 'careSetting',                label: 'Setting' },
  { key: 'medicineCount',              label: 'Medicines' },
  { key: 'anticholinergicBurdenScore', label: 'ACB' },
  { key: 'burdenBand',                 label: 'Burden Band' },
  { key: 'reviewStatus',               label: 'Status' }
];

// Rank used when sorting the burdenBand column so 'low' < 'moderate' < 'high'
// regardless of locale.
const bandRank = {
  'low': 0,
  'moderate': 1,
  'high': 2
};

const statusRank = {
  'complete': 0,
  'incomplete': 1
};

const settingLabels = {
  'gp-practice': 'GP practice',
  'pcn': 'PCN',
  'care-home': 'Care home',
  'community-pharmacy': 'Community pharmacy',
  'patient-home': "Patient's home"
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

function bandClass(band) {
  switch (band) {
    case 'high': return 'risk-high';
    case 'moderate': return 'risk-moderate';
    case 'low': return 'risk-low';
    default: return '';
  }
}

function bandLabel(band) {
  switch (band) {
    case 'high': return 'High';
    case 'moderate': return 'Moderate';
    case 'low': return 'Low';
    default: return 'N/A';
  }
}

function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'incomplete': return 'risk-moderate';
    default: return '';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'incomplete': return 'Incomplete';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.band !== '' ||
    filters.status !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ReviewRow} row
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
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.band && row.burdenBand !== filters.band) return false;
  if (filters.status && row.reviewStatus !== filters.status) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The burden-band and status
 * columns use their rank tables; the numeric columns sort numerically;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'burdenBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'medicineCount' || key === 'anticholinergicBurdenScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return reviews.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.burdenBand === 'high') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="class-cell">${esc(String(row.medicineCount))}</span></td>
      <td><span class="class-cell">${esc(String(row.anticholinergicBurdenScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.burdenBand)}">${esc(bandLabel(row.burdenBand))}</span></td>
      <td><span class="risk-badge ${statusClass(row.reviewStatus)}">${esc(statusLabel(row.reviewStatus))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = reviews.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No reviews to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} reviews`;
  } else {
    el.textContent = `Showing ${shown} of ${total} reviews`;
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
  const setting = document.getElementById('filter-setting');
  const band = document.getElementById('filter-band');
  const status = document.getElementById('filter-status');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
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
      filters.setting = '';
      filters.band = '';
      filters.status = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (band) band.value = '';
      if (status) status.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReviews() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  reviews = sampleReviews;
  renderAll();

  try {
    const items = await fetchReviews();
    if (items && items.length > 0) {
      reviews = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no reviews.'
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
  loadReviews();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
