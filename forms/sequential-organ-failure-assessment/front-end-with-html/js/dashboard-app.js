import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// SOFA — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-location dropdown + mortality-band dropdown + Sepsis-3 dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.SequentialOrganFailureAssessmentDashboard`.
// The whole file is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  location: '', // '' | care-location value
  band: '',     // '' | 'low' | 'moderate' | 'high' | 'veryHigh' | 'extreme'
  sepsis: ''    // '' | 'yes' | 'no'
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
  { key: 'careLocation',      label: 'Location' },
  { key: 'totalSofa',         label: 'SOFA' },
  { key: 'deltaSofa',         label: 'Delta' },
  { key: 'mortalityBand',     label: 'Mortality Band' },
  { key: 'sepsis3Flag',       label: 'Sepsis-3' }
];

// Rank used when sorting the mortalityBand column so 'low' is always less than
// 'extreme' regardless of locale.
const bandRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'veryHigh': 3,
  'extreme': 4
};

const bandLabels = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'veryHigh': 'Very high',
  'extreme': 'Extreme'
};

const locationLabels = {
  'icu': 'ICU',
  'hdu': 'HDU',
  'critical-care-outreach': 'Outreach',
  'acute-medical-unit': 'AMU',
  'emergency-department': 'Emergency dept',
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

function bandClass(band) {
  switch (band) {
    case 'low': return 'risk-low';
    case 'moderate': return 'risk-moderate';
    case 'high': return 'risk-high';
    case 'veryHigh': return 'risk-high';
    case 'extreme': return 'risk-critical';
    default: return '';
  }
}

function bandLabel(band) {
  return bandLabels[band] || 'N/A';
}

function locationLabel(loc) {
  return locationLabels[loc] || loc || 'N/A';
}

function scoreLabel(score) {
  return (score === null || score === undefined) ? 'N/A' : String(score);
}

function deltaLabel(delta) {
  if (delta === null || delta === undefined) return 'N/A';
  return delta > 0 ? `+${delta}` : String(delta);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.location !== '' ||
    filters.band !== '' ||
    filters.sepsis !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').AssessmentRow} row
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
  if (filters.location && row.careLocation !== filters.location) return false;
  if (filters.band && row.mortalityBand !== filters.band) return false;
  if (filters.sepsis === 'yes' && !row.sepsis3Flag) return false;
  if (filters.sepsis === 'no' && row.sepsis3Flag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The mortality-band column uses
 * its rank table; nullable numeric columns sort nulls last; the Sepsis-3
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'mortalityBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'totalSofa' || key === 'deltaSofa') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'sepsis3Flag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careLocation)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.mortalityBand === 'extreme' || row.mortalityBand === 'veryHigh') {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.totalSofa === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(locationLabel(row.careLocation))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.totalSofa))}</span></td>
      <td><span class="class-cell">${esc(deltaLabel(row.deltaSofa))}</span></td>
      <td><span class="risk-badge ${bandClass(row.mortalityBand)}">${esc(bandLabel(row.mortalityBand))}</span></td>
      <td>
        <span class="flag-badge ${row.sepsis3Flag ? 'flag-yes' : 'flag-no'}">
          ${row.sepsis3Flag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = assessments.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} assessments`;
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
  const location = document.getElementById('filter-location');
  const band = document.getElementById('filter-band');
  const sepsis = document.getElementById('filter-sepsis');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (location) {
    location.addEventListener('change', () => {
      filters.location = location.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (sepsis) {
    sepsis.addEventListener('change', () => {
      filters.sepsis = sepsis.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.location = '';
      filters.band = '';
      filters.sepsis = '';
      if (search) search.value = '';
      if (location) location.value = '';
      if (band) band.value = '';
      if (sepsis) sepsis.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
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
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
