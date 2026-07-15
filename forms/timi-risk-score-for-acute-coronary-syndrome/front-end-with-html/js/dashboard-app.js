import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// TIMI UA/NSTEMI — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + score dropdown + risk-band dropdown +
// high-risk dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting value
  score: '',     // '' | '0'..'7'
  band: '',      // '' | 'low' | 'intermediate' | 'high'
  highRisk: ''   // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',      label: 'Patient ID' },
  { key: 'patientName',            label: 'Patient Name' },
  { key: 'careSetting',            label: 'Setting' },
  { key: 'timiScore',              label: 'TIMI' },
  { key: 'riskBand',               label: 'Risk Band' },
  { key: 'fourteenDayRiskPercent', label: '14-day Risk' },
  { key: 'highRiskFlag',           label: 'High Risk' }
];

// Rank used when sorting the riskBand column so 'low' < 'intermediate' < 'high'
// regardless of locale.
const bandRank = {
  'low': 0,
  'intermediate': 1,
  'high': 2
};

const settingLabels = {
  'emergency-department': 'Emergency dept',
  'chest-pain-unit': 'Chest-pain unit',
  'ward': 'Ward',
  'coronary-care': 'Coronary care',
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
  if (band === 'high') return 'risk-high';
  if (band === 'intermediate') return 'risk-moderate';
  if (band === 'low') return 'risk-low';
  return '';
}

function bandLabel(band) {
  if (band === 'high') return 'High';
  if (band === 'intermediate') return 'Intermediate';
  if (band === 'low') return 'Low';
  return 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function scoreLabel(score) {
  return (score === null || score === undefined) ? 'N/A' : String(score);
}

function riskPercentLabel(pct) {
  return (pct === null || pct === undefined) ? 'N/A' : `~${pct}%`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.score !== '' ||
    filters.band !== '' ||
    filters.highRisk !== ''
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
    if (row.timiScore === null || row.timiScore !== Number(filters.score)) {
      return false;
    }
  }
  if (filters.band && row.riskBand !== filters.band) return false;
  if (filters.highRisk === 'yes' && !row.highRiskFlag) return false;
  if (filters.highRisk === 'no' && row.highRiskFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The risk-band column uses its
 * rank table; the nullable TIMI score sorts nulls last; the high-risk boolean
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

  if (key === 'timiScore' || key === 'fourteenDayRiskPercent') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'highRiskFlag') {
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
    if (row.riskBand === 'high') {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.timiScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.timiScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.riskBand)}">${esc(bandLabel(row.riskBand))}</span></td>
      <td>${esc(riskPercentLabel(row.fourteenDayRiskPercent))}</td>
      <td>
        <span class="flag-badge ${row.highRiskFlag ? 'flag-yes' : 'flag-no'}">
          ${row.highRiskFlag ? 'Yes' : 'No'}
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
  const highRisk = document.getElementById('filter-high-risk');
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
  if (highRisk) {
    highRisk.addEventListener('change', () => {
      filters.highRisk = highRisk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.score = '';
      filters.band = '';
      filters.highRisk = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (score) score.value = '';
      if (band) band.value = '';
      if (highRisk) highRisk.value = '';
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
