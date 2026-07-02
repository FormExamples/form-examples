// EPDS — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + band dropdown + self-harm dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.EdinburghPostnatalDepressionScaleDashboard`. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.EdinburghPostnatalDepressionScaleDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | 'maternity' | 'community' | 'general-practice' | 'perinatal-mh' | 'other'
  band: '',      // '' | 'lower' | 'possible' | 'likely'
  selfHarm: ''   // '' | 'yes' | 'no'
};

// Default sort: respondent name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'respondentName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'respondentIdentifier', label: 'Respondent ID' },
  { key: 'respondentName',       label: 'Respondent Name' },
  { key: 'careSetting',          label: 'Setting' },
  { key: 'perinatalStage',       label: 'Stage' },
  { key: 'totalScore',           label: 'EPDS' },
  { key: 'band',                 label: 'Band' },
  { key: 'selfHarmFlag',         label: 'Self-harm' }
];

// Rank used when sorting the band column so 'lower' < 'possible' < 'likely'
// regardless of locale.
const bandRank = {
  'lower': 0,
  'possible': 1,
  'likely': 2
};

const settingLabels = {
  'maternity': 'Maternity',
  'community': 'Community',
  'general-practice': 'General practice',
  'perinatal-mh': 'Perinatal MH',
  'other': 'Other'
};

const stageLabels = {
  'antenatal': 'Antenatal',
  'postnatal': 'Postnatal'
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
    case 'lower': return 'risk-low';
    case 'possible': return 'risk-moderate';
    case 'likely': return 'risk-high';
    default: return '';
  }
}

function bandLabel(band) {
  switch (band) {
    case 'lower': return 'Lower';
    case 'possible': return 'Possible';
    case 'likely': return 'Likely';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function stageLabel(stage) {
  return stageLabels[stage] || stage || 'N/A';
}

function scoreLabel(score) {
  return (score === null || score === undefined) ? 'N/A' : String(score);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.band !== '' ||
    filters.selfHarm !== ''
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
      row.respondentIdentifier.toLowerCase().includes(term) ||
      row.respondentName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.band && row.band !== filters.band) return false;
  if (filters.selfHarm === 'yes' && !row.selfHarmFlag) return false;
  if (filters.selfHarm === 'no' && row.selfHarmFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The band column uses its rank
 * table; the nullable total sorts nulls last; the self-harm boolean sorts
 * false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'band') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'totalScore') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'selfHarmFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (respondentIdentifier, respondentName,
  // careSetting, perinatalStage)
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
    // Self-harm is the safety-critical signal — surface it even when the total
    // is low, mirroring the item-10 override.
    if (row.selfHarmFlag) {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.totalScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.respondentIdentifier)}</td>
      <td>${esc(row.respondentName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(stageLabel(row.perinatalStage))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.totalScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.band)}">${esc(bandLabel(row.band))}</span></td>
      <td>
        <span class="flag-badge ${row.selfHarmFlag ? 'flag-yes' : 'flag-no'}">
          ${row.selfHarmFlag ? 'Yes' : 'No'}
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
  const selfHarm = document.getElementById('filter-selfharm');
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
  if (selfHarm) {
    selfHarm.addEventListener('change', () => {
      filters.selfHarm = selfHarm.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.band = '';
      filters.selfHarm = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (band) band.value = '';
      if (selfHarm) selfHarm.value = '';
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
