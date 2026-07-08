// Hospital Discharge - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + completeness dropdown + follow-up dropdown +
// destination dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.HospitalDischargeDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.HospitalDischargeDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  completeness: '',
  followup: '',
  destination: ''
};

// Default sort: completeness descending — Incomplete first, so the records
// that block discharge surface at the top of the list for clinical review.
const sortState = {
  key: 'completenessStatus',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',              label: 'NHS Number' },
  { key: 'patientName',            label: 'Patient Name' },
  { key: 'completenessStatus',     label: 'Completeness' },
  { key: 'mandatoryFieldsMissing', label: 'Missing Fields' },
  { key: 'followUpArrangement',    label: 'Follow-up' },
  { key: 'dischargeDestination',   label: 'Destination' }
];

// Rank used when sorting the completenessStatus column so 'Complete' is
// always less than 'Incomplete' regardless of locale.
const completenessRank = {
  'Complete': 0,
  'Partial': 1,
  'Incomplete': 2
};

// Rank for follow-up arrangements: clinical-attention order from "no plan"
// (None, riskiest) through low-touch GP up to community/clinic care.
const followupRank = {
  'None': 0,
  'GP': 1,
  'Outpatient Clinic': 2,
  'Community Nurse': 3
};

// Rank for discharge destinations.
const destinationRank = {
  'Home': 0,
  'Care Home': 1,
  'Rehab': 2,
  'Other Hospital': 3
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

function completenessClass(label) {
  if (!label) return '';
  return 'completeness-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function followupClass(label) {
  if (!label) return '';
  return 'followup-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function missingFieldsClass(n) {
  if (!n || n === 0) return 'zero';
  if (n <= 2) return 'some';
  return 'many';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.completeness !== '' ||
    filters.followup !== '' ||
    filters.destination !== ''
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
  if (filters.completeness && row.completenessStatus !== filters.completeness) {
    return false;
  }
  if (filters.followup && row.followUpArrangement !== filters.followup) {
    return false;
  }
  if (filters.destination && row.dischargeDestination !== filters.destination) {
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

  if (key === 'completenessStatus') {
    av = completenessRank[av] ?? -1;
    bv = completenessRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'followUpArrangement') {
    av = followupRank[av] ?? -1;
    bv = followupRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'dischargeDestination') {
    av = destinationRank[av] ?? -1;
    bv = destinationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'mandatoryFieldsMissing') {
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    if (row.completenessStatus === 'Incomplete') {
      tr.classList.add('row-incomplete');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td"><span class="completeness-badge ${completenessClass(row.completenessStatus)}">${esc(row.completenessStatus)}</span></td>
      <td class="data-table-td"><span class="missing-fields ${missingFieldsClass(row.mandatoryFieldsMissing)}">${esc(row.mandatoryFieldsMissing)}</span></td>
      <td class="data-table-td"><span class="followup-badge ${followupClass(row.followUpArrangement)}">${esc(row.followUpArrangement)}</span></td>
      <td class="data-table-td"><span class="destination-badge">${esc(row.dischargeDestination)}</span></td>
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
  const completeness = document.getElementById('filter-completeness');
  const followup = document.getElementById('filter-followup');
  const destination = document.getElementById('filter-destination');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (completeness) {
    completeness.addEventListener('change', () => {
      filters.completeness = completeness.value;
      renderAll();
    });
  }
  if (followup) {
    followup.addEventListener('change', () => {
      filters.followup = followup.value;
      renderAll();
    });
  }
  if (destination) {
    destination.addEventListener('change', () => {
      filters.destination = destination.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.completeness = '';
      filters.followup = '';
      filters.destination = '';
      if (search) search.value = '';
      if (completeness) completeness.value = '';
      if (followup) followup.value = '';
      if (destination) destination.value = '';
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
