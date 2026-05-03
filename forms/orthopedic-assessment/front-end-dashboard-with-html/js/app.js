// Orthopedic Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + DASH-score range dropdown + disability-level dropdown +
// surgical-candidate dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.OrthopedicAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.OrthopedicAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  dash: '',       // '', '0-20', '21-40', '41-60', '61-80', '81-100'
  disability: '',
  surgical: ''    // '', 'yes', 'no'
};

// Default sort: patientName ascending. Mirrors the SvelteKit dashboard's
// initial `api.exec('sort-rows', { key: 'patientName', order: 'asc' })`.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'dashScore',          label: 'DASH Score' },
  { key: 'affectedJoint',      label: 'Affected Joint' },
  { key: 'disabilityLevel',    label: 'Disability Level' },
  { key: 'surgicalCandidate',  label: 'Surgical Candidate' }
];

// Rank used when sorting the disabilityLevel column so 'No disability' is
// always less than 'Very severe disability' regardless of locale.
const disabilityRank = {
  'No disability': 0,
  'Mild disability': 1,
  'Moderate disability': 2,
  'Severe disability': 3,
  'Very severe disability': 4
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

function disabilityClass(label) {
  if (!label) return '';
  return 'disability-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.dash !== '' ||
    filters.disability !== '' ||
    filters.surgical !== ''
  );
}

/**
 * Test if a DASH score falls inside the named range (matches the SvelteKit
 * `dashInRange` helper).
 */
function dashInRange(score, range) {
  switch (range) {
    case '0-20':   return score >= 0 && score <= 20;
    case '21-40':  return score >= 21 && score <= 40;
    case '41-60':  return score >= 41 && score <= 60;
    case '61-80':  return score >= 61 && score <= 80;
    case '81-100': return score >= 81 && score <= 100;
    default:       return true;
  }
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
      row.affectedJoint.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.dash && !dashInRange(row.dashScore, filters.dash)) {
    return false;
  }
  if (filters.disability && row.disabilityLevel !== filters.disability) {
    return false;
  }
  if (filters.surgical === 'yes' && !row.surgicalCandidate) return false;
  if (filters.surgical === 'no' && row.surgicalCandidate) return false;
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

  if (key === 'disabilityLevel') {
    av = disabilityRank[av] ?? -1;
    bv = disabilityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'surgicalCandidate') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'dashScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, affectedJoint)
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
    if (row.disabilityLevel === 'Very severe disability') {
      tr.classList.add('row-very-severe-disability');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="dash-score">${esc(row.dashScore)}/100</span></td>
      <td>${esc(row.affectedJoint)}</td>
      <td><span class="disability-badge ${disabilityClass(row.disabilityLevel)}">${esc(row.disabilityLevel)}</span></td>
      <td>
        <span class="surgical-badge ${row.surgicalCandidate ? 'surgical-yes' : 'surgical-no'}">
          ${row.surgicalCandidate ? 'Yes' : 'No'}
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const dash = document.getElementById('filter-dash');
  const disability = document.getElementById('filter-disability');
  const surgical = document.getElementById('filter-surgical');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (dash) {
    dash.addEventListener('change', () => {
      filters.dash = dash.value;
      renderAll();
    });
  }
  if (disability) {
    disability.addEventListener('change', () => {
      filters.disability = disability.value;
      renderAll();
    });
  }
  if (surgical) {
    surgical.addEventListener('change', () => {
      filters.surgical = surgical.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.dash = '';
      filters.disability = '';
      filters.surgical = '';
      if (search) search.value = '';
      if (dash) dash.value = '';
      if (disability) disability.value = '';
      if (surgical) surgical.value = '';
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
