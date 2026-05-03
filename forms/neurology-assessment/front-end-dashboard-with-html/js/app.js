// Neurology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + NIHSS severity dropdown + stroke-risk dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.NeurologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.NeurologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  nihss: '',       // '', 'none', 'minor', 'moderate', 'moderate-severe', 'severe'
  strokeRisk: ''   // '', 'Low', 'Medium', 'High'
};

// Default sort matches the SvelteKit dashboard: alphabetical by patient
// name, ascending. Clinicians scanning the list can find a patient quickly
// by surname.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'nihssScore',       label: 'NIHSS Score' },
  { key: 'primaryCondition', label: 'Primary Condition' },
  { key: 'strokeRisk',       label: 'Stroke Risk' }
];

// Rank used when sorting the strokeRisk column so 'Low' is always less
// than 'High' regardless of locale.
const strokeRiskRank = {
  'Low': 0,
  'Medium': 1,
  'High': 2
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

/** Map a NIHSS numeric score to its severity band slug + label. */
function nihssBand(score) {
  if (score === 0)            return { slug: 'none',            label: 'None' };
  if (score <= 4)             return { slug: 'minor',           label: 'Minor' };
  if (score <= 15)            return { slug: 'moderate',        label: 'Moderate' };
  if (score <= 20)            return { slug: 'moderate-severe', label: 'Mod-Severe' };
  return                            { slug: 'severe',          label: 'Severe' };
}

function strokeRiskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.nihss !== '' ||
    filters.strokeRisk !== ''
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
      String(row.primaryCondition || '').toLowerCase().includes(term);
    if (!matches) return false;
  }

  if (filters.nihss) {
    const s = row.nihssScore;
    switch (filters.nihss) {
      case 'none':
        if (s !== 0) return false;
        break;
      case 'minor':
        if (s < 1 || s > 4) return false;
        break;
      case 'moderate':
        if (s < 5 || s > 15) return false;
        break;
      case 'moderate-severe':
        if (s < 16 || s > 20) return false;
        break;
      case 'severe':
        if (s < 21) return false;
        break;
    }
  }

  if (filters.strokeRisk && row.strokeRisk !== filters.strokeRisk) {
    return false;
  }

  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'strokeRisk') {
    av = strokeRiskRank[av] ?? -1;
    bv = strokeRiskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'nihssScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryCondition)
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
    // Row highlight: NIHSS >= 16 (moderate-severe / severe) OR a High
    // stroke-risk classification — these are the rows clinicians most need
    // to triage first.
    if (row.nihssScore >= 16 || row.strokeRisk === 'High') {
      tr.classList.add('row-severe');
    }

    const band = nihssBand(row.nihssScore);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="nihss-badge nihss-${band.slug}">${esc(row.nihssScore)} (${esc(band.label)})</span></td>
      <td><span class="primary-condition">${esc(row.primaryCondition)}</span></td>
      <td><span class="risk-badge ${strokeRiskClass(row.strokeRisk)}">${esc(row.strokeRisk)}</span></td>
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
  const nihss = document.getElementById('filter-nihss');
  const strokeRisk = document.getElementById('filter-stroke-risk');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (nihss) {
    nihss.addEventListener('change', () => {
      filters.nihss = nihss.value;
      renderAll();
    });
  }
  if (strokeRisk) {
    strokeRisk.addEventListener('change', () => {
      filters.strokeRisk = strokeRisk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.nihss = '';
      filters.strokeRisk = '';
      if (search) search.value = '';
      if (nihss) nihss.value = '';
      if (strokeRisk) strokeRisk.value = '';
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
