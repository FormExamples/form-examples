import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Bhutani Bilirubin Nomogram — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + risk-zone dropdown + above-exchange dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | 'postnatal-ward' | 'neonatal-unit' | ...
  zone: '',      // '' | 'low' | 'low-intermediate' | 'high-intermediate' | 'high'
  exchange: ''   // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Infant ID' },
  { key: 'patientName',       label: 'Infant Name' },
  { key: 'careSetting',       label: 'Setting' },
  { key: 'ageHours',          label: 'Age (h)' },
  { key: 'riskZone',          label: 'Risk Zone' },
  { key: 'aboveExchange',     label: 'Above Exchange' }
];

// Rank used when sorting the risk-zone column so zones order from low to high
// regardless of locale; nulls sort last.
const zoneRank = {
  'low': 0,
  'low-intermediate': 1,
  'high-intermediate': 2,
  'high': 3
};

const settingLabels = {
  'postnatal-ward': 'Postnatal ward',
  'neonatal-unit': 'Neonatal unit',
  'midwife-led-unit': 'Midwife-led unit',
  'community': 'Community',
  'other': 'Other'
};

const zoneLabels = {
  'low': 'Low',
  'low-intermediate': 'Low-intermediate',
  'high-intermediate': 'High-intermediate',
  'high': 'High'
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

function zoneClass(zone) {
  switch (zone) {
    case 'low': return 'risk-low';
    case 'low-intermediate': return 'risk-low';
    case 'high-intermediate': return 'risk-medium';
    case 'high': return 'risk-high';
    default: return '';
  }
}

function zoneLabel(zone) {
  return zoneLabels[zone] || 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function ageLabel(value) {
  return (value === null || value === undefined) ? 'N/A' : String(value);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.zone !== '' ||
    filters.exchange !== ''
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
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.zone && row.riskZone !== filters.zone) return false;
  if (filters.exchange === 'yes' && !row.aboveExchange) return false;
  if (filters.exchange === 'no' && row.aboveExchange) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The risk-zone column uses its
 * rank table; the nullable age sorts nulls last; the above-exchange boolean
 * sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskZone') {
    av = zoneRank[av] ?? 99;
    bv = zoneRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'ageHours') {
    // Sort nulls last in both directions so recorded rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'aboveExchange') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting)
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
    if (row.aboveExchange || row.riskZone === 'high') {
      tr.classList.add('row-critical');
    }

    const ageClassName = (row.ageHours === null || row.ageHours === undefined)
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${ageClassName}">${esc(ageLabel(row.ageHours))}</span></td>
      <td><span class="risk-badge ${zoneClass(row.riskZone)}">${esc(zoneLabel(row.riskZone))}</span></td>
      <td>
        <span class="flag-badge ${row.aboveExchange ? 'flag-yes' : 'flag-no'}">
          ${row.aboveExchange ? 'Yes' : 'No'}
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
  const setting = document.getElementById('filter-setting');
  const zone = document.getElementById('filter-zone');
  const exchange = document.getElementById('filter-exchange');
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
  if (zone) {
    zone.addEventListener('change', () => {
      filters.zone = zone.value;
      renderAll();
    });
  }
  if (exchange) {
    exchange.addEventListener('change', () => {
      filters.exchange = exchange.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.zone = '';
      filters.exchange = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (zone) zone.value = '';
      if (exchange) exchange.value = '';
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
