// WHO Acute Referral Form - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + mode dropdown + status dropdown + urgent-flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WhoAcuteReferralDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.WhoAcuteReferralDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  mode: '',     // '', 'road', 'air', 'sea'
  status: '',   // '', 'initiated', 'in-transit', 'arrived', 'feedback-received'
  urgent: 'all' // 'all', 'has', 'none'
};

/** Sort state: which column key, ascending or descending.
 *  Default: most-recent departures first. */
const sortState = {
  key: 'departureTime',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'dateOfBirth',         label: 'DOB' },
  { key: 'sex',                 label: 'Sex' },
  { key: 'initiatingFacility',  label: 'Initiating Facility' },
  { key: 'referralFacility',    label: 'Referral Facility' },
  { key: 'modeOfTransfer',      label: 'Mode' },
  { key: 'primaryDiagnosis',    label: 'Diagnosis' },
  { key: 'transferStatus',      label: 'Status' },
  { key: 'urgentFlagCount',     label: 'Urgent Flags' },
  { key: 'departureTime',       label: 'Departure' },
  { key: 'arrivalTime',         label: 'Arrival' }
];

// Rank used when sorting transfer-status columns; mirrors the lifecycle
// order so 'initiated' is always less than 'feedback-received'.
const statusRank = {
  'initiated': 0,
  'in-transit': 1,
  'arrived': 2,
  'feedback-received': 3
};

const modeLabels = {
  'road': 'Road',
  'air': 'Air',
  'sea': 'Sea'
};

const statusLabels = {
  'initiated': 'Initiated',
  'in-transit': 'In transit',
  'arrived': 'Arrived',
  'feedback-received': 'Feedback received'
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

function statusClass(value) {
  if (!value) return '';
  return 'status-' + String(value).toLowerCase();
}

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function formatDate(value) {
  if (!value) return '';
  // Avoid `new Date('YYYY-MM-DD').toLocaleDateString()` because that parses
  // as UTC midnight and can roll back a day in negative-offset timezones.
  // Display the ISO date as-is.
  return value;
}

function formatMode(value) {
  return modeLabels[value] || '';
}

function formatStatus(value) {
  return statusLabels[value] || value || '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mode !== '' ||
    filters.status !== '' ||
    filters.urgent !== 'all'
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
      row.patientName.toLowerCase().includes(term) ||
      row.initiatingFacility.toLowerCase().includes(term) ||
      row.referralFacility.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.mode && row.modeOfTransfer !== filters.mode) {
    return false;
  }
  if (filters.status && row.transferStatus !== filters.status) {
    return false;
  }
  if (filters.urgent === 'has' && !(row.urgentFlagCount > 0)) return false;
  if (filters.urgent === 'none' && row.urgentFlagCount > 0) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Status uses lifecycle rank;
 * dates use millisecond compare; numbers compare numerically; everything
 * else uses a locale-aware string compare. Null arrival times sort last
 * regardless of direction so pending transfers do not sit in the middle.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'transferStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'departureTime') {
    const at = av ? new Date(av).getTime() : 0;
    const bt = bv ? new Date(bv).getTime() : 0;
    return (at - bt) * dir;
  }

  if (key === 'arrivalTime') {
    // Null arrivals always go to the bottom.
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  if (key === 'dateOfBirth') {
    // ISO date strings sort lexicographically — equivalent to chronological.
    return String(av).localeCompare(String(bv)) * dir;
  }

  if (key === 'urgentFlagCount') {
    return ((av || 0) - (bv || 0)) * dir;
  }

  // Default: string compare
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    if (row.urgentFlagCount > 0) tr.classList.add('row-urgent');

    const modeCell = row.modeOfTransfer
      ? `<span class="mode-badge">${esc(formatMode(row.modeOfTransfer))}</span>`
      : '';

    const statusCell =
      `<span class="status-badge ${statusClass(row.transferStatus)}">` +
      `${esc(formatStatus(row.transferStatus))}</span>`;

    const urgentCell = row.urgentFlagCount > 0
      ? `<span class="urgent-badge urgent-badge-some">${row.urgentFlagCount}</span>`
      : `<span class="urgent-badge urgent-badge-zero">0</span>`;

    const arrivalCell = row.arrivalTime
      ? esc(formatDateTime(row.arrivalTime))
      : `<span class="cell-arrival-pending">Pending</span>`;

    tr.innerHTML = `
      <td>${esc(row.patientName)}</td>
      <td>${esc(formatDate(row.dateOfBirth))}</td>
      <td>${esc(row.sex)}</td>
      <td class="cell-facility">${esc(row.initiatingFacility)}</td>
      <td class="cell-facility">${esc(row.referralFacility)}</td>
      <td>${modeCell}</td>
      <td class="cell-diagnosis">${esc(row.primaryDiagnosis)}</td>
      <td>${statusCell}</td>
      <td>${urgentCell}</td>
      <td>${esc(formatDateTime(row.departureTime))}</td>
      <td>${arrivalCell}</td>
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
    el.textContent = `Showing ${total} of ${total} referrals`;
  } else {
    el.textContent = `Showing ${shown} of ${total} referrals`;
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
  const mode = document.getElementById('filter-mode');
  const status = document.getElementById('filter-status');
  const urgent = document.getElementById('filter-urgent');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mode) {
    mode.addEventListener('change', () => {
      filters.mode = mode.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (urgent) {
    urgent.addEventListener('change', () => {
      filters.urgent = urgent.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mode = '';
      filters.status = '';
      filters.urgent = 'all';
      if (search) search.value = '';
      if (mode) mode.value = '';
      if (status) status.value = '';
      if (urgent) urgent.value = 'all';
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
})();
