// Nutrition Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + MUST risk dropdown + overall risk dropdown + nutritional
// support dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.NutritionAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.NutritionAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  mustRisk: '',
  overallRisk: '',
  support: '' // '', 'yes', 'no'
};

// Default sort: MUST total score descending. Highest score = highest risk =
// top of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'mustTotalScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',              label: 'NHS Number' },
  { key: 'patientName',            label: 'Patient Name' },
  { key: 'bmi',                    label: 'BMI' },
  { key: 'mustTotalScore',         label: 'MUST Score' },
  { key: 'mustRiskCategory',       label: 'MUST Risk' },
  { key: 'overallRiskLevel',       label: 'Overall Risk' },
  { key: 'nutritionalSupportFlag', label: 'Nutritional Support' }
];

// Rank used when sorting the mustRiskCategory column so 'low' is always less
// than 'high' regardless of locale.
const mustRiskRank = {
  low: 0,
  medium: 1,
  high: 2
};

// Rank used when sorting the overallRiskLevel column.
const overallRiskRank = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3
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

/** Title-case a single-word risk label like "low" -> "Low". */
function titleCase(s) {
  if (!s) return '';
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function mustRiskClass(label) {
  if (!label) return '';
  return 'must-risk-' + String(label).toLowerCase();
}

function overallRiskClass(label) {
  if (!label) return '';
  return 'overall-risk-' + String(label).toLowerCase();
}

function bmiClass(value) {
  if (value == null || isNaN(value)) return '';
  if (value < 18.5) return 'bmi-low';
  if (value < 25) return 'bmi-normal';
  if (value < 30) return 'bmi-high';
  return 'bmi-very-high';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mustRisk !== '' ||
    filters.overallRisk !== '' ||
    filters.support !== ''
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
  if (filters.mustRisk && row.mustRiskCategory !== filters.mustRisk) {
    return false;
  }
  if (filters.overallRisk && row.overallRiskLevel !== filters.overallRisk) {
    return false;
  }
  if (filters.support === 'yes' && !row.nutritionalSupportFlag) return false;
  if (filters.support === 'no' && row.nutritionalSupportFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'mustRiskCategory') {
    av = mustRiskRank[av] ?? -1;
    bv = mustRiskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'overallRiskLevel') {
    av = overallRiskRank[av] ?? -1;
    bv = overallRiskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'nutritionalSupportFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'mustTotalScore' || key === 'bmi') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
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
    if (row.overallRiskLevel === 'critical') {
      tr.classList.add('row-critical');
    } else if (row.overallRiskLevel === 'high') {
      tr.classList.add('row-high');
    }

    const bmiText = (row.bmi != null && !isNaN(row.bmi))
      ? Number(row.bmi).toFixed(1)
      : '—';

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="bmi ${bmiClass(row.bmi)}">${esc(bmiText)}</span></td>
      <td><span class="must-score">${esc(row.mustTotalScore)}/6</span></td>
      <td><span class="must-risk-badge ${mustRiskClass(row.mustRiskCategory)}">${esc(titleCase(row.mustRiskCategory))}</span></td>
      <td><span class="overall-risk-badge ${overallRiskClass(row.overallRiskLevel)}">${esc(titleCase(row.overallRiskLevel))}</span></td>
      <td>
        <span class="support-badge ${row.nutritionalSupportFlag ? 'support-yes' : 'support-no'}">
          ${row.nutritionalSupportFlag ? 'Yes' : 'No'}
        </span>
      </td>
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
    // Numeric / categorical-severity columns default to descending so the
    // worst patients surface first; identifier columns default to ascending.
    const descByDefault = (
      key === 'mustTotalScore' ||
      key === 'mustRiskCategory' ||
      key === 'overallRiskLevel' ||
      key === 'nutritionalSupportFlag'
    );
    sortState.direction = descByDefault ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const mustRisk = document.getElementById('filter-must-risk');
  const overallRisk = document.getElementById('filter-overall-risk');
  const support = document.getElementById('filter-support');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mustRisk) {
    mustRisk.addEventListener('change', () => {
      filters.mustRisk = mustRisk.value;
      renderAll();
    });
  }
  if (overallRisk) {
    overallRisk.addEventListener('change', () => {
      filters.overallRisk = overallRisk.value;
      renderAll();
    });
  }
  if (support) {
    support.addEventListener('change', () => {
      filters.support = support.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mustRisk = '';
      filters.overallRisk = '';
      filters.support = '';
      if (search) search.value = '';
      if (mustRisk) mustRisk.value = '';
      if (overallRisk) overallRisk.value = '';
      if (support) support.value = '';
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
