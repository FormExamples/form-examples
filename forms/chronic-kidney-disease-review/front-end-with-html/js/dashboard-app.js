// Chronic Kidney Disease Annual Review — clinician dashboard (vanilla
// classic-script app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// G-stage dropdown + KDIGO-zone dropdown + review-status dropdown +
// referral-flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.ChronicKidneyDiseaseReviewDashboard`. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchReviews,
  sampleReviews
} = window.ChronicKidneyDiseaseReviewDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  gfr: '',    // '' | 'G1' | 'G2' | 'G3a' | 'G3b' | 'G4' | 'G5'
  zone: '',   // '' | 'low' | 'moderate' | 'high' | 'very-high'
  review: '', // '' | 'complete' | 'partial' | 'incomplete'
  flag: ''    // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'careSetting',         label: 'Care Setting' },
  { key: 'gfrCategory',         label: 'G-stage' },
  { key: 'albuminuriaCategory', label: 'A-stage' },
  { key: 'kdigoRiskZone',       label: 'KDIGO Zone' },
  { key: 'reviewStatus',        label: 'Review' },
  { key: 'referralFlag',        label: 'Referral Flag' }
];

// Ranks used when sorting the enum columns so order is locale-independent.
const gfrRank = { 'G1': 0, 'G2': 1, 'G3a': 2, 'G3b': 3, 'G4': 4, 'G5': 5 };
const albRank = { 'A1': 0, 'A2': 1, 'A3': 2 };
const zoneRank = { 'low': 0, 'moderate': 1, 'high': 2, 'very-high': 3 };
const reviewRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };

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

function gfrClass(g) {
  switch (g) {
    case 'G1':
    case 'G2': return 'risk-low';
    case 'G3a': return 'risk-moderate';
    case 'G3b': return 'risk-high';
    case 'G4':
    case 'G5': return 'risk-critical';
    default: return '';
  }
}

function albClass(a) {
  switch (a) {
    case 'A1': return 'risk-low';
    case 'A2': return 'risk-moderate';
    case 'A3': return 'risk-high';
    default: return '';
  }
}

function zoneClass(zone) {
  switch (zone) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'very-high': return 'risk-critical';
    default: return '';
  }
}

function zoneLabel(zone) {
  switch (zone) {
    case 'low': return 'Low';
    case 'moderate': return 'Moderate';
    case 'high': return 'High';
    case 'very-high': return 'Very high';
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

function careSettingLabel(setting) {
  switch (setting) {
    case 'general-practice': return 'General practice';
    case 'long-term-conditions-clinic': return 'LTC clinic';
    case 'community-nephrology': return 'Community nephrology';
    case 'other': return 'Other';
    default: return '';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.gfr !== '' ||
    filters.zone !== '' ||
    filters.review !== '' ||
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
      careSettingLabel(row.careSetting).toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.gfr && row.gfrCategory !== filters.gfr) return false;
  if (filters.zone && row.kdigoRiskZone !== filters.zone) return false;
  if (filters.review && row.reviewStatus !== filters.review) return false;
  if (filters.flag === 'yes' && !row.referralFlag) return false;
  if (filters.flag === 'no' && row.referralFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Enum columns use their rank
 * tables; the referral-flag boolean sorts false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'gfrCategory') {
    av = gfrRank[av] ?? -1;
    bv = gfrRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'albuminuriaCategory') {
    av = albRank[av] ?? -1;
    bv = albRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'kdigoRiskZone') {
    av = zoneRank[av] ?? -1;
    bv = zoneRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewStatus') {
    av = reviewRank[av] ?? -1;
    bv = reviewRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'referralFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
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
    if (row.kdigoRiskZone === 'very-high' || row.referralFlag) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(careSettingLabel(row.careSetting))}</td>
      <td><span class="risk-badge ${gfrClass(row.gfrCategory)}">${esc(row.gfrCategory || 'N/A')}</span></td>
      <td><span class="risk-badge ${albClass(row.albuminuriaCategory)}">${esc(row.albuminuriaCategory || 'N/A')}</span></td>
      <td><span class="risk-badge ${zoneClass(row.kdigoRiskZone)}">${esc(zoneLabel(row.kdigoRiskZone))}</span></td>
      <td><span class="risk-badge ${reviewClass(row.reviewStatus)}">${esc(reviewLabel(row.reviewStatus))}</span></td>
      <td>
        <span class="flag-badge ${row.referralFlag ? 'flag-yes' : 'flag-no'}">
          ${row.referralFlag ? 'Yes' : 'No'}
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
  const gfr = document.getElementById('filter-gfr');
  const zone = document.getElementById('filter-zone');
  const reviewSel = document.getElementById('filter-review');
  const flag = document.getElementById('filter-flag');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (gfr) {
    gfr.addEventListener('change', () => {
      filters.gfr = gfr.value;
      renderAll();
    });
  }
  if (zone) {
    zone.addEventListener('change', () => {
      filters.zone = zone.value;
      renderAll();
    });
  }
  if (reviewSel) {
    reviewSel.addEventListener('change', () => {
      filters.review = reviewSel.value;
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
      filters.gfr = '';
      filters.zone = '';
      filters.review = '';
      filters.flag = '';
      if (search) search.value = '';
      if (gfr) gfr.value = '';
      if (zone) zone.value = '';
      if (reviewSel) reviewSel.value = '';
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
