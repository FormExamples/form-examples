import { fetchObservations } from './api.js';
import { sampleObservations } from './data.js';

// MEWS — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the observation list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + risk-band dropdown + single-parameter-trigger
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.ModifiedEarlyWarningScoreDashboard`. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ObservationRow[]} */
let observations = [];

const filters = {
  search: '',
  setting: '',   // '' | 'acute-ward' | 'admissions-unit' | 'assessment-unit' | 'other'
  band: '',      // '' | 'low' | 'medium' | 'high'
  trigger: ''    // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',       label: 'Patient ID' },
  { key: 'patientName',             label: 'Patient Name' },
  { key: 'careSetting',             label: 'Setting' },
  { key: 'mewsScore',               label: 'MEWS' },
  { key: 'riskBand',                label: 'Risk Band' },
  { key: 'singleParameterTrigger',  label: 'Trigger' }
];

// Rank used when sorting the riskBand column so 'low' < 'medium' < 'high'
// regardless of locale.
const bandRank = {
  'low': 0,
  'medium': 1,
  'high': 2
};

const settingLabels = {
  'acute-ward': 'Acute ward',
  'admissions-unit': 'Admissions unit',
  'assessment-unit': 'Assessment unit',
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
  if (!band) return '';
  if (band === 'high') return 'risk-high';
  if (band === 'medium') return 'risk-medium';
  return 'risk-low';
}

function bandLabel(band) {
  if (band === 'high') return 'High';
  if (band === 'medium') return 'Medium';
  if (band === 'low') return 'Low';
  return 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function scoreLabel(score) {
  return (score === null || score === undefined) ? 'N/A' : String(score);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.band !== '' ||
    filters.trigger !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ObservationRow} row
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
  if (filters.band && row.riskBand !== filters.band) return false;
  if (filters.trigger === 'yes' && !row.singleParameterTrigger) return false;
  if (filters.trigger === 'no' && row.singleParameterTrigger) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The risk-band column uses its
 * rank table; the nullable MEWS score sorts nulls last; the trigger boolean
 * sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'mewsScore') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'singleParameterTrigger') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return observations.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.riskBand === 'high' || row.singleParameterTrigger) {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.mewsScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.mewsScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.riskBand)}">${esc(bandLabel(row.riskBand))}</span></td>
      <td>
        <span class="flag-badge ${row.singleParameterTrigger ? 'flag-yes' : 'flag-no'}">
          ${row.singleParameterTrigger ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = observations.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No observations to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} observations`;
  } else {
    el.textContent = `Showing ${shown} of ${total} observations`;
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
  const trigger = document.getElementById('filter-trigger');
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
  if (trigger) {
    trigger.addEventListener('change', () => {
      filters.trigger = trigger.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.band = '';
      filters.trigger = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (band) band.value = '';
      if (trigger) trigger.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadObservations() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  observations = sampleObservations;
  renderAll();

  try {
    const items = await fetchObservations();
    if (items && items.length > 0) {
      observations = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no observations.'
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
  loadObservations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
