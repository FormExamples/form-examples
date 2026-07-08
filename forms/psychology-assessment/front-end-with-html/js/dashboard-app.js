// Psychology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + 4 severity dropdowns + suicidal-ideation dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PsychologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.PsychologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  depression: '',
  anxiety: '',
  stress: '',
  suicidal: '' // '', 'yes', 'no'
};

/** Sort state: which column key, ascending or descending. */
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'depressionSeverity',  label: 'Depression' },
  { key: 'anxietySeverity',     label: 'Anxiety' },
  { key: 'stressSeverity',      label: 'Stress' },
  { key: 'suicidalIdeationFlag', label: 'Suicidal Ideation' },
  { key: 'completedAt',         label: 'Completed' }
];

// Rank used when sorting severity columns; mirrors the SvelteKit dashboard
// so 'Normal' is always less than 'Extremely Severe' regardless of locale.
const severityRank = {
  'Normal': 0,
  'Mild': 1,
  'Moderate': 2,
  'Severe': 3,
  'Extremely Severe': 4
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

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function formatCompleted(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.depression !== '' ||
    filters.anxiety !== '' ||
    filters.stress !== '' ||
    filters.suicidal !== ''
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.depression && row.depressionSeverity !== filters.depression) {
    return false;
  }
  if (filters.anxiety && row.anxietySeverity !== filters.anxiety) {
    return false;
  }
  if (filters.stress && row.stressSeverity !== filters.stress) {
    return false;
  }
  if (filters.suicidal === 'yes' && !row.suicidalIdeationFlag) return false;
  if (filters.suicidal === 'no' && row.suicidalIdeationFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Severity columns use the
 * `severityRank` ordinal; booleans sort false<true; everything else uses
 * a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (
    key === 'depressionSeverity' ||
    key === 'anxietySeverity' ||
    key === 'stressSeverity'
  ) {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'suicidalIdeationFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'completedAt') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  // Default: string compare
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
    if (row.suicidalIdeationFlag) tr.classList.add('row-suicidal');

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="severity-badge ${severityClass(row.depressionSeverity)}">${esc(row.depressionSeverity)}</span></td>
      <td><span class="severity-badge ${severityClass(row.anxietySeverity)}">${esc(row.anxietySeverity)}</span></td>
      <td><span class="severity-badge ${severityClass(row.stressSeverity)}">${esc(row.stressSeverity)}</span></td>
      <td>
        <span class="suicidal-badge ${row.suicidalIdeationFlag ? 'suicidal-yes' : 'suicidal-no'}">
          ${row.suicidalIdeationFlag ? 'Yes' : 'No'}
        </span>
      </td>
      <td>${esc(formatCompleted(row.completedAt))}</td>
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
  const depression = document.getElementById('filter-depression');
  const anxiety = document.getElementById('filter-anxiety');
  const stress = document.getElementById('filter-stress');
  const suicidal = document.getElementById('filter-suicidal');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (depression) {
    depression.addEventListener('change', () => {
      filters.depression = depression.value;
      renderAll();
    });
  }
  if (anxiety) {
    anxiety.addEventListener('change', () => {
      filters.anxiety = anxiety.value;
      renderAll();
    });
  }
  if (stress) {
    stress.addEventListener('change', () => {
      filters.stress = stress.value;
      renderAll();
    });
  }
  if (suicidal) {
    suicidal.addEventListener('change', () => {
      filters.suicidal = suicidal.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.depression = '';
      filters.anxiety = '';
      filters.stress = '';
      filters.suicidal = '';
      if (search) search.value = '';
      if (depression) depression.value = '';
      if (anxiety) anxiety.value = '';
      if (stress) stress.value = '';
      if (suicidal) suicidal.value = '';
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
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
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
})();
