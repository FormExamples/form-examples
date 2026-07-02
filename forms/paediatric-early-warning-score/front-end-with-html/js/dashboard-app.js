// PEWS — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + age-band dropdown + care-setting dropdown + escalation-band dropdown +
// trigger dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.PaediatricEarlyWarningScoreDashboard`. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.PaediatricEarlyWarningScoreDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  ageBand: '', // '' | 'neonate' | 'infant' | 'young-child' | 'child' | 'adolescent'
  setting: '', // '' | 'ward' | 'childrens-assessment-unit' | 'emergency-department' | 'other'
  band: '',    // '' | 'routine' | 'low' | 'medium' | 'high'
  trigger: ''  // '' | 'single-parameter' | 'concern' | 'none'
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
  { key: 'ageBand',             label: 'Age Band' },
  { key: 'careSetting',         label: 'Setting' },
  { key: 'aggregateScore',      label: 'PEWS' },
  { key: 'escalationBand',      label: 'Escalation' },
  { key: 'triggers',            label: 'Triggers' },
  { key: 'monitoringFrequency', label: 'Monitoring' }
];

// Rank used when sorting the escalationBand column so severity orders correctly
// regardless of locale.
const bandRank = {
  'routine': 0,
  'low': 1,
  'medium': 2,
  'high': 3
};

const ageBandLabels = {
  'neonate': 'Neonate (0–<1 mo)',
  'infant': 'Infant (1–11 mo)',
  'young-child': 'Young child (1–4 y)',
  'child': 'Child (5–11 y)',
  'adolescent': 'Adolescent (≥ 12 y)'
};

const settingLabels = {
  'ward': 'Ward',
  'childrens-assessment-unit': "Children's assessment unit",
  'emergency-department': 'Emergency dept',
  'other': 'Other'
};

const bandLabels = {
  'routine': 'Routine',
  'low': 'Low',
  'medium': 'Medium',
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

function bandClass(band) {
  switch (band) {
    case 'high': return 'risk-high';
    case 'medium': return 'risk-medium';
    case 'low': return 'risk-moderate';
    case 'routine': return 'risk-low';
    default: return '';
  }
}

function bandLabel(band) {
  return bandLabels[band] || 'N/A';
}

function ageBandLabel(band) {
  return ageBandLabels[band] || band || 'N/A';
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
    filters.ageBand !== '' ||
    filters.setting !== '' ||
    filters.band !== '' ||
    filters.trigger !== ''
  );
}

/** Combined trigger flag for a row. */
function hasAnyTrigger(row) {
  return Boolean(row.singleParameterTrigger || row.concernTrigger);
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
  if (filters.ageBand && row.ageBand !== filters.ageBand) return false;
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.band && row.escalationBand !== filters.band) return false;
  if (filters.trigger === 'single-parameter' && !row.singleParameterTrigger) return false;
  if (filters.trigger === 'concern' && !row.concernTrigger) return false;
  if (filters.trigger === 'none' && hasAnyTrigger(row)) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The escalation-band column uses
 * its rank table; the nullable aggregate score sorts nulls last; the triggers
 * column sorts none<any; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'escalationBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'aggregateScore') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'triggers') {
    av = hasAnyTrigger(a) ? 1 : 0;
    bv = hasAnyTrigger(b) ? 1 : 0;
    return (av - bv) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, ageBand,
  // careSetting, monitoringFrequency).
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

/** Build the triggers-cell markup for a row. */
function triggersCell(row) {
  const badges = [];
  if (row.singleParameterTrigger) {
    badges.push('<span class="flag-badge flag-yes">Single-3</span>');
  }
  if (row.concernTrigger) {
    badges.push('<span class="flag-badge flag-yes">Concern</span>');
  }
  if (badges.length === 0) {
    return '<span class="flag-badge flag-no">None</span>';
  }
  return badges.join(' ');
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
    if (row.escalationBand === 'high' || row.singleParameterTrigger) {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.aggregateScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(ageBandLabel(row.ageBand))}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row.aggregateScore))}</span></td>
      <td><span class="risk-badge ${bandClass(row.escalationBand)}">${esc(bandLabel(row.escalationBand))}</span></td>
      <td>${triggersCell(row)}</td>
      <td>${esc(row.monitoringFrequency || 'N/A')}</td>
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
  const ageBand = document.getElementById('filter-age-band');
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
  if (ageBand) {
    ageBand.addEventListener('change', () => {
      filters.ageBand = ageBand.value;
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
      filters.ageBand = '';
      filters.setting = '';
      filters.band = '';
      filters.trigger = '';
      if (search) search.value = '';
      if (ageBand) ageBand.value = '';
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
