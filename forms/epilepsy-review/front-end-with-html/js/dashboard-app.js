// Epilepsy Annual Review — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// seizure-control dropdown + review-status dropdown + care-setting dropdown +
// safety-flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.EpilepsyReviewDashboard`. The whole file is wrapped
// in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchReviews,
  sampleReviews
} = window.EpilepsyReviewDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  control: '',  // '' | 'seizure-free' | 'controlled' | 'uncontrolled'
  review: '',   // '' | 'complete' | 'partial' | 'incomplete'
  setting: '',  // '' | 'general-practice' | 'epilepsy-clinic' | 'community' | 'other'
  flag: ''      // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'careSetting',       label: 'Setting' },
  { key: 'seizureControl',    label: 'Seizure Control' },
  { key: 'reviewStatus',      label: 'Review' },
  { key: 'safetyFlag',        label: 'Safety Flag' }
];

// Ranks used when sorting the enum columns so order is locale-independent.
const controlRank = { 'seizure-free': 0, 'controlled': 1, 'uncontrolled': 2 };
const reviewRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };
const settingRank = { 'general-practice': 0, 'epilepsy-clinic': 1, 'community': 2, 'other': 3 };

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

function controlClass(status) {
  switch (status) {
    case 'seizure-free': return 'risk-low';
    case 'controlled': return 'risk-moderate';
    case 'uncontrolled': return 'risk-high';
    default: return '';
  }
}

function controlLabel(status) {
  switch (status) {
    case 'seizure-free': return 'Seizure-free';
    case 'controlled': return 'Controlled';
    case 'uncontrolled': return 'Uncontrolled';
    default: return 'N/A';
  }
}

function reviewClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

function reviewLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'epilepsy-clinic': return 'Epilepsy clinic';
    case 'community': return 'Community';
    case 'other': return 'Other';
    default: return 'N/A';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.control !== '' ||
    filters.review !== '' ||
    filters.setting !== '' ||
    filters.flag !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      settingLabel(row.careSetting).toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.control && row.seizureControl !== filters.control) return false;
  if (filters.review && row.reviewStatus !== filters.review) return false;
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.flag === 'yes' && !row.safetyFlag) return false;
  if (filters.flag === 'no' && row.safetyFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Enum columns use their rank
 * tables; the safety-flag boolean sorts false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'seizureControl') {
    av = controlRank[av] ?? -1;
    bv = controlRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewStatus') {
    av = reviewRank[av] ?? -1;
    bv = reviewRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'careSetting') {
    av = settingRank[av] ?? -1;
    bv = settingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'safetyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName)
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
    if (row.seizureControl === 'uncontrolled' || row.safetyFlag) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="risk-badge ${controlClass(row.seizureControl)}">${esc(controlLabel(row.seizureControl))}</span></td>
      <td><span class="risk-badge ${reviewClass(row.reviewStatus)}">${esc(reviewLabel(row.reviewStatus))}</span></td>
      <td>
        <span class="flag-badge ${row.safetyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.safetyFlag ? 'Yes' : 'No'}
        </span>
      </td>
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
  const control = document.getElementById('filter-control');
  const reviewSel = document.getElementById('filter-review');
  const setting = document.getElementById('filter-setting');
  const flag = document.getElementById('filter-flag');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (control) {
    control.addEventListener('change', () => {
      filters.control = control.value;
      renderAll();
    });
  }
  if (reviewSel) {
    reviewSel.addEventListener('change', () => {
      filters.review = reviewSel.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (flag) {
    flag.addEventListener('change', () => {
      filters.flag = flag.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.control = '';
      filters.review = '';
      filters.setting = '';
      filters.flag = '';
      if (search) search.value = '';
      if (control) control.value = '';
      if (reviewSel) reviewSel.value = '';
      if (setting) setting.value = '';
      if (flag) flag.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReviews() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
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
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
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
})();
