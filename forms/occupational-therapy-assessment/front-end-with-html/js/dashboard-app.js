import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Occupational Therapy Assessment - clinician dashboard (vanilla
// classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + performance-score band dropdown + satisfaction-score band
// dropdown + priority-area dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.OccupationalTherapyAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  performance: '', // '', 'significant', 'moderate', 'good'
  satisfaction: '', // '', 'significant', 'moderate', 'good'
  priority: ''     // '' or substring keyword from the dropdown
};

// Default sort: patient name ascending — matches the SvelteKit dashboard's
// `init()` callback which calls `sort-rows` with key 'patientName'.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'performanceScore',  label: 'Performance' },
  { key: 'satisfactionScore', label: 'Satisfaction' },
  { key: 'primaryDiagnosis',  label: 'Primary Diagnosis' },
  { key: 'priorityArea',      label: 'Priority Area' }
];

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

/**
 * Map a numeric COPM score (1-10) to its band class suffix.
 * @param {number} score
 * @returns {'significant' | 'moderate' | 'good'}
 */
function scoreBand(score) {
  if (score < 5) return 'significant';
  if (score <= 7) return 'moderate';
  return 'good';
}

/**
 * Test whether a numeric score falls in the named filter band. The band
 * names mirror the SvelteKit dashboard's `scoreInRange()` helper.
 *
 * @param {number} score
 * @param {string} band
 * @returns {boolean}
 */
function scoreInRange(score, band) {
  switch (band) {
    case 'significant': return score < 5;
    case 'moderate':    return score >= 5 && score <= 7;
    case 'good':        return score > 7;
    default:            return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.performance !== '' ||
    filters.satisfaction !== '' ||
    filters.priority !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PatientRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      row.primaryDiagnosis.toLowerCase().includes(term) ||
      row.priorityArea.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.performance &&
      !scoreInRange(row.performanceScore, filters.performance)) {
    return false;
  }
  if (filters.satisfaction &&
      !scoreInRange(row.satisfactionScore, filters.satisfaction)) {
    return false;
  }
  if (filters.priority) {
    const needle = filters.priority.toLowerCase();
    if (!row.priorityArea.toLowerCase().includes(needle)) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'performanceScore' || key === 'satisfactionScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: locale-aware string compare for all string columns.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return patients.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that have a significant performance issue (score <5).
    if (row.performanceScore < 5) {
      tr.classList.add('row-significant');
    }

    const perfBand = scoreBand(row.performanceScore);
    const satBand = scoreBand(row.satisfactionScore);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="score-badge score-${perfBand}">
          ${esc(row.performanceScore)}/10
        </span>
      </td>
      <td>
        <span class="score-badge score-${satBand}">
          ${esc(row.satisfactionScore)}/10
        </span>
      </td>
      <td class="diagnosis-cell">${esc(row.primaryDiagnosis)}</td>
      <td class="priority-cell">${esc(row.priorityArea)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = patients.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No patients to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} patients`;
  } else {
    el.textContent = `Showing ${shown} of ${total} patients`;
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
  const performance = document.getElementById('filter-performance');
  const satisfaction = document.getElementById('filter-satisfaction');
  const priority = document.getElementById('filter-priority');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (performance) {
    performance.addEventListener('change', () => {
      filters.performance = performance.value;
      renderAll();
    });
  }
  if (satisfaction) {
    satisfaction.addEventListener('change', () => {
      filters.satisfaction = satisfaction.value;
      renderAll();
    });
  }
  if (priority) {
    priority.addEventListener('change', () => {
      filters.priority = priority.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.performance = '';
      filters.satisfaction = '';
      filters.priority = '';
      if (search) search.value = '';
      if (performance) performance.value = '';
      if (satisfaction) satisfaction.value = '';
      if (priority) priority.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPatients() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  patients = samplePatients;
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
