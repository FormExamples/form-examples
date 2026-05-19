// UK Statement of Fitness for Work dashboard (vanilla classic-script app).
//
// Renders a sortable, filterable table of recent fit notes plus summary
// counters across the page header. Sibling modules loaded as plain `<script>`
// tags (in dependency order) attach their exports to
// `window.UkFitNoteDashboard`. Pulling them off here keeps the rest of this
// file referring to short local names. The whole file is wrapped in an IIFE
// so its top-level identifiers do not leak to the global scope.

(function () {
'use strict';
const { sampleFitNotes } = window.UkFitNoteDashboard;

/**
 * @typedef {Object} FitNoteRow
 * @property {string} id
 * @property {string} patientName
 * @property {string} nhsNumber
 * @property {string} issuerProfession
 * @property {string} issuerName
 * @property {string} assessmentDate                ISO date YYYY-MM-DD
 * @property {string} diagnosis
 * @property {'not_fit'|'may_be_fit'|''} fitnessCategory
 * @property {'none'|'light'|'moderate'|'substantial'|'comprehensive'|''} adaptationIntensity
 * @property {number} adaptationCount               0..4
 * @property {number|null} periodDays
 * @property {'self_cert_range'|'compliant'|'long_term'|'very_long_term'|'exceeds_initial_max'|''} periodCompliance
 * @property {'standard'|'refer_occupational_health'|'refer_access_to_work'|'refer_employment_advisor'|'review_for_validity'|''} recommendation
 * @property {number} safetyFlagCount
 */

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {FitNoteRow[]} */
let fitNotes = [];

const filters = {
  search: '',
  recommendation: '',
  fitness: '',
  profession: '',
};

// Default sort: most recent date first.
const sortState = {
  key: 'assessmentDate',
  direction: 'desc', // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',         label: 'Patient' },
  { key: 'nhsNumber',           label: 'NHS number' },
  { key: 'issuerProfession',    label: 'Profession' },
  { key: 'assessmentDate',      label: 'Date' },
  { key: 'fitnessCategory',     label: 'Fitness' },
  { key: 'adaptationIntensity', label: 'Adaptations' },
  { key: 'periodDays',          label: 'Days' },
  { key: 'periodCompliance',    label: 'Period' },
  { key: 'recommendation',      label: 'Recommendation' },
  { key: 'safetyFlagCount',     label: 'Flags' },
];

// Ordinal ranks for categorical sorts.
const fitnessRank      = { 'not_fit': 0, 'may_be_fit': 1, '': -1 };
const intensityRank    = { '': -1, 'none': 0, 'light': 1, 'moderate': 2, 'substantial': 3, 'comprehensive': 4 };
const complianceRank   = { '': -1, 'self_cert_range': 0, 'compliant': 1, 'long_term': 2, 'very_long_term': 3, 'exceeds_initial_max': 4 };
const recommendationRank = {
  '': -1,
  'standard': 0,
  'refer_employment_advisor': 1,
  'refer_access_to_work': 2,
  'refer_occupational_health': 3,
  'review_for_validity': 4,
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe HTML rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Convert a snake_case enum to a human-readable label. */
function humanise(value) {
  if (!value) return '\u2014';
  return String(value)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.recommendation !== '' ||
    filters.fitness !== '' ||
    filters.profession !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {FitNoteRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.patientName || '').toLowerCase().includes(term) ||
      String(row.nhsNumber || '').toLowerCase().includes(term) ||
      String(row.issuerProfession || '').toLowerCase().includes(term) ||
      String(row.issuerName || '').toLowerCase().includes(term) ||
      String(row.diagnosis || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.recommendation && row.recommendation !== filters.recommendation) {
    return false;
  }
  if (filters.fitness && row.fitnessCategory !== filters.fitness) {
    return false;
  }
  if (filters.profession && row.issuerProfession !== filters.profession) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use their
 * rank tables; null values sort last; numbers compare directly; everything
 * else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'fitnessCategory') {
    av = fitnessRank[av] ?? -1;
    bv = fitnessRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'adaptationIntensity') {
    av = intensityRank[av] ?? -1;
    bv = intensityRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'periodCompliance') {
    av = complianceRank[av] ?? -1;
    bv = complianceRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'recommendation') {
    av = recommendationRank[av] ?? -1;
    bv = recommendationRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'periodDays' || key === 'safetyFlagCount') {
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (patientName, nhsNumber, issuerProfession,
  // assessmentDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return fitNotes.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Summary statistics
// ----------------------------------------------------------------------

function renderSummary() {
  const total = fitNotes.length;
  let mayBeFit = 0;
  let notFit = 0;
  const recCounts = {
    standard: 0,
    refer_occupational_health: 0,
    refer_access_to_work: 0,
    refer_employment_advisor: 0,
    review_for_validity: 0,
  };

  for (const r of fitNotes) {
    if (r.fitnessCategory === 'may_be_fit') mayBeFit += 1;
    if (r.fitnessCategory === 'not_fit') notFit += 1;
    if (r.recommendation in recCounts) recCounts[r.recommendation] += 1;
  }

  setText('summary-total', total);
  setText('summary-may-be-fit', mayBeFit);
  setText('summary-not-fit', notFit);
  setText('summary-rec-standard', recCounts.standard);
  setText('summary-rec-oh', recCounts.refer_occupational_health);
  setText('summary-rec-atw', recCounts.refer_access_to_work);
  setText('summary-rec-ea', recCounts.refer_employment_advisor);
  setText('summary-rec-review', recCounts.review_for_validity);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = String(value);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('fit-notes-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '\u2195'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '\u2191';
      } else {
        ariaSort = 'descending';
        indicator = '\u2193';
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

function renderFlagCount(n) {
  let cls = '';
  if (n >= 3) cls = 'flag-count-many';
  else if (n >= 1) cls = 'flag-count-some';
  return `<span class="flag-count ${cls}">${esc(n)}</span>`;
}

function renderTableBody() {
  const body = document.getElementById('fit-notes-table-body');
  const empty = document.getElementById('fit-notes-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.recommendation === 'review_for_validity') {
      tr.classList.add('row-review');
    }

    const intensityCell =
      row.fitnessCategory === 'may_be_fit'
        ? `<span class="intensity-badge intensity-${esc(row.adaptationIntensity || 'none')}">${esc(humanise(row.adaptationIntensity || 'none'))}</span>`
        : '<span class="numeric-muted">\u2014</span>';

    const daysCell =
      row.periodDays === null || row.periodDays === undefined
        ? '<span class="numeric-muted">\u2014</span>'
        : esc(row.periodDays);

    tr.innerHTML = `
      <td><strong>${esc(row.patientName)}</strong></td>
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(humanise(row.issuerProfession))}</td>
      <td><span class="date-cell">${esc(row.assessmentDate)}</span></td>
      <td><span class="fitness-badge fitness-${esc(row.fitnessCategory)}">${esc(humanise(row.fitnessCategory))}</span></td>
      <td>${intensityCell}</td>
      <td><span class="numeric-cell">${daysCell}</span></td>
      <td><span class="compliance-badge compliance-${esc(row.periodCompliance)}">${esc(humanise(row.periodCompliance))}</span></td>
      <td><span class="rec-badge rec-${esc(row.recommendation)}">${esc(humanise(row.recommendation))}</span></td>
      <td>${renderFlagCount(row.safetyFlagCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = fitNotes.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No fit notes to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} fit notes`;
  } else {
    el.textContent = `Showing ${shown} of ${total} fit notes`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

function renderAll() {
  renderSummary();
  renderTableHead();
  renderTableBody();
  renderFilterCount();
  renderClearButton();
}

// ----------------------------------------------------------------------
// Event handlers
// ----------------------------------------------------------------------

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    // Date defaults to desc; numeric counts default to desc; everything else
    // ascending.
    sortState.direction =
      key === 'assessmentDate' ||
      key === 'periodDays' ||
      key === 'safetyFlagCount'
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const rec = document.getElementById('filter-recommendation');
  const fitness = document.getElementById('filter-fitness');
  const profession = document.getElementById('filter-profession');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (rec) {
    rec.addEventListener('change', () => {
      filters.recommendation = rec.value;
      renderAll();
    });
  }
  if (fitness) {
    fitness.addEventListener('change', () => {
      filters.fitness = fitness.value;
      renderAll();
    });
  }
  if (profession) {
    profession.addEventListener('change', () => {
      filters.profession = profession.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.recommendation = '';
      filters.fitness = '';
      filters.profession = '';
      if (search) search.value = '';
      if (rec) rec.value = '';
      if (fitness) fitness.value = '';
      if (profession) profession.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function init() {
  fitNotes = sampleFitNotes;
  bindFilterInputs();
  renderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
