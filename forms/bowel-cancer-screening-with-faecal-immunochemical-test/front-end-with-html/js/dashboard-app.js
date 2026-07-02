// Bowel Cancer Screening (FIT) — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + hub dropdown + result-class dropdown + symptomatic dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.BowelCancerScreeningFitDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.BowelCancerScreeningFitDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  hub: '',            // '' | hub name
  resultClass: '',    // '' | 'negative' | 'positive' | 'spoilt' | 'unclassified'
  symptomatic: ''     // '' | 'yes' | 'no'
};

// Default sort: participant name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'participantName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'participantIdentifier', label: 'Participant ID' },
  { key: 'participantName',       label: 'Participant Name' },
  { key: 'screeningHub',          label: 'Hub' },
  { key: 'faecalHaemoglobinUgG',  label: 'Faecal Hb (µg/g)' },
  { key: 'resultClass',           label: 'Result' },
  { key: 'managementAction',      label: 'Management' },
  { key: 'symptomaticPathway',    label: 'Symptomatic' }
];

// Rank used when sorting the result column so the classes order from negative
// through positive to spoilt, with unclassified last, regardless of locale.
const resultClassRank = {
  'negative': 0,
  'positive': 1,
  'spoilt': 2,
  '': 3
};

const resultClassLabels = {
  'negative': 'Negative',
  'positive': 'Positive',
  'spoilt': 'Spoilt',
  '': 'Unclassified'
};

const managementActionLabels = {
  'routine-recall': 'Routine recall',
  'refer-colonoscopy': 'Refer colonoscopy',
  'repeat-kit': 'Repeat kit',
  '': 'Not determined'
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

function resultClassClass(resultClass) {
  switch (resultClass) {
    case 'negative': return 'risk-low';
    case 'spoilt': return 'risk-medium';
    case 'positive': return 'risk-high';
    default: return '';
  }
}

function resultClassLabel(resultClass) {
  return resultClassLabels[resultClass] || 'Unclassified';
}

function managementActionLabel(action) {
  return managementActionLabels[action] || managementActionLabels[''];
}

function hbLabel(value) {
  return (value === null || value === undefined) ? 'N/A' : String(value);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.hub !== '' ||
    filters.resultClass !== '' ||
    filters.symptomatic !== ''
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
      row.participantIdentifier.toLowerCase().includes(term) ||
      row.participantName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.hub && row.screeningHub !== filters.hub) return false;
  if (filters.resultClass) {
    const target = filters.resultClass === 'unclassified' ? '' : filters.resultClass;
    if (row.resultClass !== target) return false;
  }
  if (filters.symptomatic === 'yes' && !row.symptomaticPathway) return false;
  if (filters.symptomatic === 'no' && row.symptomaticPathway) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The result column uses its rank
 * table; the nullable faecal Hb sorts nulls last; the symptomatic boolean sorts
 * false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'resultClass') {
    av = resultClassRank[av] ?? 99;
    bv = resultClassRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'faecalHaemoglobinUgG') {
    // Sort nulls last in both directions so numeric results cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'symptomaticPathway') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (participantIdentifier, participantName,
  // screeningHub, managementAction)
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
    if (row.resultClass === 'positive' || row.symptomaticPathway) {
      tr.classList.add('row-critical');
    }

    const hbClassName = (row.faecalHaemoglobinUgG === null || row.faecalHaemoglobinUgG === undefined)
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.participantIdentifier)}</td>
      <td>${esc(row.participantName)}</td>
      <td>${esc(row.screeningHub)}</td>
      <td><span class="${hbClassName}">${esc(hbLabel(row.faecalHaemoglobinUgG))}</span></td>
      <td><span class="risk-badge ${resultClassClass(row.resultClass)}">${esc(resultClassLabel(row.resultClass))}</span></td>
      <td>${esc(managementActionLabel(row.managementAction))}</td>
      <td>
        <span class="flag-badge ${row.symptomaticPathway ? 'flag-yes' : 'flag-no'}">
          ${row.symptomaticPathway ? 'Yes' : 'No'}
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
  const hub = document.getElementById('filter-hub');
  const resultClass = document.getElementById('filter-result');
  const symptomatic = document.getElementById('filter-symptomatic');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (hub) {
    hub.addEventListener('change', () => {
      filters.hub = hub.value;
      renderAll();
    });
  }
  if (resultClass) {
    resultClass.addEventListener('change', () => {
      filters.resultClass = resultClass.value;
      renderAll();
    });
  }
  if (symptomatic) {
    symptomatic.addEventListener('change', () => {
      filters.symptomatic = symptomatic.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.hub = '';
      filters.resultClass = '';
      filters.symptomatic = '';
      if (search) search.value = '';
      if (hub) hub.value = '';
      if (resultClass) resultClass.value = '';
      if (symptomatic) symptomatic.value = '';
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
