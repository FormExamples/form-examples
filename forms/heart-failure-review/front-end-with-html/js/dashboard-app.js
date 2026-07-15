import { fetchReviews } from './api.js';
import { sampleReviews } from './data.js';

// Heart Failure Annual Review — clinician dashboard (vanilla classic-script
// app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// heart-failure-type dropdown + functional-status dropdown + optimisation-status
// dropdown + urgent-review dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.HeartFailureReviewDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  type: '',         // '' | reduced | mildly-reduced | preserved | unknown
  functional: '',   // '' | stable | symptomatic | advanced | unknown
  optimisation: '', // '' | optimised | partial | suboptimal | not-applicable
  urgent: ''        // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = { key: 'patientName', direction: 'asc' };

const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'heartFailureType',  label: 'HF Type' },
  { key: 'functionalStatus',  label: 'NYHA Status' },
  { key: 'optimisationStatus',label: 'Optimisation' },
  { key: 'reviewStatus',      label: 'Review' },
  { key: 'urgentFlag',        label: 'Urgent' }
];

// Ranks used when sorting the enum columns so order is locale-independent.
const typeRank = { 'reduced': 0, 'mildly-reduced': 1, 'preserved': 2, 'unknown': 3 };
const functionalRank = { 'stable': 0, 'symptomatic': 1, 'advanced': 2, 'unknown': 3 };
const optimisationRank = { 'optimised': 0, 'partial': 1, 'suboptimal': 2, 'not-applicable': 3 };
const reviewRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };

const typeLabels = {
  'reduced': 'HFrEF',
  'mildly-reduced': 'HFmrEF',
  'preserved': 'HFpEF',
  'unknown': 'Unknown'
};
const functionalLabels = {
  'stable': 'Stable', 'symptomatic': 'Symptomatic', 'advanced': 'Advanced', 'unknown': 'Not assessed'
};
const optimisationLabels = {
  'optimised': 'Optimised', 'partial': 'Partial', 'suboptimal': 'Suboptimal', 'not-applicable': 'N/A'
};
const reviewLabels = {
  'complete': 'Complete', 'partial': 'Partial', 'incomplete': 'Incomplete'
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function functionalClass(v) {
  switch (v) {
    case 'stable': return 'risk-low';
    case 'symptomatic': return 'risk-moderate';
    case 'advanced': return 'risk-high';
    default: return '';
  }
}
function optimisationClass(v) {
  switch (v) {
    case 'optimised': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'suboptimal': return 'risk-high';
    default: return '';
  }
}
function reviewClass(v) {
  switch (v) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

function typeLabel(v) { return typeLabels[v] || v || 'N/A'; }
function functionalLabel(v) { return functionalLabels[v] || v || 'N/A'; }
function optimisationLabel(v) { return optimisationLabels[v] || v || 'N/A'; }
function reviewLabel(v) { return reviewLabels[v] || v || 'N/A'; }

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.type !== '' ||
    filters.functional !== '' ||
    filters.optimisation !== '' ||
    filters.urgent !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.type && row.heartFailureType !== filters.type) return false;
  if (filters.functional && row.functionalStatus !== filters.functional) return false;
  if (filters.optimisation && row.optimisationStatus !== filters.optimisation) return false;
  if (filters.urgent === 'yes' && !row.urgentFlag) return false;
  if (filters.urgent === 'no' && row.urgentFlag) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'heartFailureType') { av = typeRank[av] ?? -1; bv = typeRank[bv] ?? -1; return (av - bv) * dir; }
  if (key === 'functionalStatus') { av = functionalRank[av] ?? -1; bv = functionalRank[bv] ?? -1; return (av - bv) * dir; }
  if (key === 'optimisationStatus') { av = optimisationRank[av] ?? -1; bv = optimisationRank[bv] ?? -1; return (av - bv) * dir; }
  if (key === 'reviewStatus') { av = reviewRank[av] ?? -1; bv = reviewRank[bv] ?? -1; return (av - bv) * dir; }
  if (key === 'urgentFlag') { return ((av === bv) ? 0 : (av ? 1 : -1)) * dir; }

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
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.urgentFlag || row.functionalStatus === 'advanced') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="class-cell">${esc(typeLabel(row.heartFailureType))}</span></td>
      <td><span class="risk-badge ${functionalClass(row.functionalStatus)}">${esc(functionalLabel(row.functionalStatus))}</span></td>
      <td><span class="risk-badge ${optimisationClass(row.optimisationStatus)}">${esc(optimisationLabel(row.optimisationStatus))}</span></td>
      <td><span class="risk-badge ${reviewClass(row.reviewStatus)}">${esc(reviewLabel(row.reviewStatus))}</span></td>
      <td>
        <span class="flag-badge ${row.urgentFlag ? 'flag-yes' : 'flag-no'}">
          ${row.urgentFlag ? 'Yes' : 'No'}
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
  const type = document.getElementById('filter-type');
  const functional = document.getElementById('filter-functional');
  const optimisation = document.getElementById('filter-optimisation');
  const urgent = document.getElementById('filter-urgent');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) search.addEventListener('input', () => { filters.search = search.value; renderAll(); });
  if (type) type.addEventListener('change', () => { filters.type = type.value; renderAll(); });
  if (functional) functional.addEventListener('change', () => { filters.functional = functional.value; renderAll(); });
  if (optimisation) optimisation.addEventListener('change', () => { filters.optimisation = optimisation.value; renderAll(); });
  if (urgent) urgent.addEventListener('change', () => { filters.urgent = urgent.value; renderAll(); });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.type = '';
      filters.functional = '';
      filters.optimisation = '';
      filters.urgent = '';
      if (search) search.value = '';
      if (type) type.value = '';
      if (functional) functional.value = '';
      if (optimisation) optimisation.value = '';
      if (urgent) urgent.value = '';
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
      showStatusBanner('Showing sample data — backend returned no reviews.');
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
