import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// CAGE Alcohol Questionnaire — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + score dropdown + result-band dropdown +
// positive-screen dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.CageAlcoholQuestionnaireDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | 'primary-care' | 'ward' | 'emergency-department' | 'antenatal' | 'other'
  score: '',     // '' | '0' | '1' | '2' | '3' | '4'
  band: '',      // '' | 'negative' | 'low' | 'positive'
  positive: ''   // '' | 'yes' | 'no'
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
  { key: 'cageScore',         label: 'CAGE' },
  { key: 'resultBand',        label: 'Result Band' },
  { key: 'positiveScreen',    label: 'Positive' }
];

// Rank used when sorting the resultBand column so 'negative' < 'low' <
// 'positive' regardless of locale.
const bandRank = {
  'negative': 0,
  'low': 1,
  'positive': 2
};

const settingLabels = {
  'primary-care': 'Primary care',
  'ward': 'Ward',
  'emergency-department': 'Emergency dept',
  'antenatal': 'Antenatal',
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
  if (band === 'positive') return 'risk-high';
  if (band === 'low') return 'risk-moderate';
  return 'risk-low';
}

function bandLabel(band) {
  if (band === 'positive') return 'Positive';
  if (band === 'low') return 'Sub-threshold';
  if (band === 'negative') return 'Negative';
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
    filters.score !== '' ||
    filters.band !== '' ||
    filters.positive !== ''
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
  if (filters.score) {
    if (row.cageScore === null || row.cageScore !== Number(filters.score)) {
      return false;
    }
  }
  if (filters.band && row.resultBand !== filters.band) return false;
  if (filters.positive === 'yes' && !row.positiveScreen) return false;
  if (filters.positive === 'no' && row.positiveScreen) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The result-band column uses its
 * rank table; the nullable CAGE score sorts nulls last; the positive-screen
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'resultBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'cageScore') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'positiveScreen') {
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
    if (row.resultBand === 'positive') {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.cageScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.cageScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.resultBand)}">${esc(bandLabel(row.resultBand))}</span></td>
      <td>
        <span class="flag-badge ${row.positiveScreen ? 'flag-yes' : 'flag-no'}">
          ${row.positiveScreen ? 'Yes' : 'No'}
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
  const score = document.getElementById('filter-score');
  const band = document.getElementById('filter-band');
  const positive = document.getElementById('filter-positive');
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
  if (score) {
    score.addEventListener('change', () => {
      filters.score = score.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (positive) {
    positive.addEventListener('change', () => {
      filters.positive = positive.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.score = '';
      filters.band = '';
      filters.positive = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (score) score.value = '';
      if (band) band.value = '';
      if (positive) positive.value = '';
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
