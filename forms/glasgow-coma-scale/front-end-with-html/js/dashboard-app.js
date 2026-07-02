// Glasgow Coma Scale — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + setting dropdown + severity-band dropdown + airway-flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.GlasgowComaScaleDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.GlasgowComaScaleDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',  // '' | 'ed' | 'neuro' | 'critical-care' | 'pre-hospital' | 'other'
  band: '',     // '' | 'mild' | 'moderate' | 'severe'
  airway: ''    // '' | 'yes' | 'no'
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
  { key: 'setting',           label: 'Setting' },
  { key: 'totalDisplay',      label: 'GCS' },
  { key: 'severityBand',      label: 'Severity' },
  { key: 'gcsP',              label: 'GCS-P' },
  { key: 'airwayFlag',        label: 'Airway' }
];

// Rank used when sorting the severityBand column so mild < moderate < severe
// regardless of locale; '' (unscored) sorts first.
const bandRank = {
  '': -1,
  'mild': 0,
  'moderate': 1,
  'severe': 2
};

const settingLabels = {
  'ed': 'Emergency dept',
  'neuro': 'Neuro',
  'critical-care': 'Critical care',
  'pre-hospital': 'Pre-hospital',
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
    case 'severe': return 'risk-high';
    case 'moderate': return 'risk-medium';
    case 'mild': return 'risk-low';
    default: return '';
  }
}

function bandLabel(band) {
  switch (band) {
    case 'severe': return 'Severe';
    case 'moderate': return 'Moderate';
    case 'mild': return 'Mild';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function totalLabel(row) {
  if (row.totalDisplay) return row.totalDisplay;
  return row.totalScore === null || row.totalScore === undefined
    ? 'NT'
    : String(row.totalScore);
}

function gcsPLabel(gcsP) {
  return (gcsP === null || gcsP === undefined) ? 'N/A' : String(gcsP);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.band !== '' ||
    filters.airway !== ''
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
  if (filters.setting && row.setting !== filters.setting) return false;
  if (filters.band && row.severityBand !== filters.band) return false;
  if (filters.airway === 'yes' && !row.airwayFlag) return false;
  if (filters.airway === 'no' && row.airwayFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The severity-band column uses
 * its rank table; the nullable GCS-P sorts nulls last; the airway boolean sorts
 * false<true; the GCS total sorts numerically (NT/undefined last); everything
 * else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'severityBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'gcsP') {
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'totalDisplay') {
    // Sort by the numeric total; NT/undefined totals sort last.
    const an = a.totalScore;
    const bn = b.totalScore;
    const aNull = an === null || an === undefined;
    const bNull = bn === null || bn === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (an - bn) * dir;
  }

  if (key === 'airwayFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, setting)
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
    if (row.airwayFlag || row.severityBand === 'severe') {
      tr.classList.add('row-critical');
    }

    const totalClassName = (row.totalScore === null || row.totalScore === undefined)
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.setting))}</td>
      <td><span class="${totalClassName}">${esc(totalLabel(row))}</span></td>
      <td><span class="risk-badge ${bandClass(row.severityBand)}">${esc(bandLabel(row.severityBand))}</span></td>
      <td><span class="class-cell">${esc(gcsPLabel(row.gcsP))}</span></td>
      <td>
        <span class="flag-badge ${row.airwayFlag ? 'flag-yes' : 'flag-no'}">
          ${row.airwayFlag ? 'Yes' : 'No'}
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
  const band = document.getElementById('filter-band');
  const airway = document.getElementById('filter-airway');
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
  if (airway) {
    airway.addEventListener('change', () => {
      filters.airway = airway.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.band = '';
      filters.airway = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (band) band.value = '';
      if (airway) airway.value = '';
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
})();
