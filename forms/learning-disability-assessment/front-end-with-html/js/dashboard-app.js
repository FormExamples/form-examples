import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Learning Disability Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity dropdown + communication-needs dropdown +
// mental-capacity dropdown + reasonable-adjustments dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.LearningDisabilityAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',
  communication: '',
  capacity: '',
  adjustments: '' // '', 'yes', 'no'
};

// Default sort: severity descending. Highest support need (Profound) first,
// surfacing the patients who most need clinical attention and reasonable
// adjustments.
const sortState = {
  key: 'severity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',                     label: 'NHS Number' },
  { key: 'patientName',                   label: 'Patient Name' },
  { key: 'severity',                      label: 'Severity' },
  { key: 'iqBand',                        label: 'IQ Band' },
  { key: 'communicationNeed',             label: 'Communication' },
  { key: 'capacityStatus',                label: 'Mental Capacity' },
  { key: 'reasonableAdjustmentsRequired', label: 'Reasonable Adjustments' }
];

// Rank used when sorting the severity column so 'Mild' is always less than
// 'Profound' regardless of locale.
const severityRank = {
  'Mild': 0,
  'Moderate': 1,
  'Severe': 2,
  'Profound': 3
};

// Rank used when sorting the IQ band column. DSM-5-TR severity bands map to
// a descending IQ range, so we reuse the severity rank by lookup.
const iqBandRank = {
  '50-69': 0,
  '35-49': 1,
  '20-34': 2,
  '<20':   3
};

// Rank used when sorting the communicationNeed column.
const communicationRank = {
  'Standard':  0,
  'Easy-Read': 1,
  'Makaton':   2,
  'AAC':       3
};

// Rank used when sorting the capacityStatus column.
const capacityRank = {
  'Has Capacity':   0,
  'Lacks Capacity': 1
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
  return 'severity-' + String(label).toLowerCase();
}

function communicationClass(label) {
  if (!label) return '';
  return 'communication-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function capacityClass(label) {
  if (label === 'Has Capacity') return 'capacity-has';
  if (label === 'Lacks Capacity') return 'capacity-lacks';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.communication !== '' ||
    filters.capacity !== '' ||
    filters.adjustments !== ''
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
  if (filters.severity && row.severity !== filters.severity) {
    return false;
  }
  if (filters.communication && row.communicationNeed !== filters.communication) {
    return false;
  }
  if (filters.capacity && row.capacityStatus !== filters.capacity) {
    return false;
  }
  if (filters.adjustments === 'yes' && !row.reasonableAdjustmentsRequired) return false;
  if (filters.adjustments === 'no' && row.reasonableAdjustmentsRequired) return false;
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

  if (key === 'severity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'iqBand') {
    av = iqBandRank[av] ?? -1;
    bv = iqBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'communicationNeed') {
    av = communicationRank[av] ?? -1;
    bv = communicationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'capacityStatus') {
    av = capacityRank[av] ?? -1;
    bv = capacityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reasonableAdjustmentsRequired') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
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
    if (row.severity === 'Profound') {
      tr.classList.add('row-profound');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="severity-badge ${severityClass(row.severity)}">${esc(row.severity)}</span></td>
      <td><span class="iq-band">${esc(row.iqBand)}</span></td>
      <td><span class="communication-badge ${communicationClass(row.communicationNeed)}">${esc(row.communicationNeed)}</span></td>
      <td><span class="capacity-badge ${capacityClass(row.capacityStatus)}">${esc(row.capacityStatus)}</span></td>
      <td>
        <span class="adjustments-badge ${row.reasonableAdjustmentsRequired ? 'adjustments-yes' : 'adjustments-no'}">
          ${row.reasonableAdjustmentsRequired ? 'Required' : 'Not required'}
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
  const severity = document.getElementById('filter-severity');
  const communication = document.getElementById('filter-communication');
  const capacity = document.getElementById('filter-capacity');
  const adjustments = document.getElementById('filter-adjustments');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (communication) {
    communication.addEventListener('change', () => {
      filters.communication = communication.value;
      renderAll();
    });
  }
  if (capacity) {
    capacity.addEventListener('change', () => {
      filters.capacity = capacity.value;
      renderAll();
    });
  }
  if (adjustments) {
    adjustments.addEventListener('change', () => {
      filters.adjustments = adjustments.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.communication = '';
      filters.capacity = '';
      filters.adjustments = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (communication) communication.value = '';
      if (capacity) capacity.value = '';
      if (adjustments) adjustments.value = '';
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
