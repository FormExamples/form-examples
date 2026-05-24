// WHO Emergency Unit Form: General - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + arrival mode + AVPU + high-risk signs + disposition).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WhoEmergencyUnitGeneralDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.WhoEmergencyUnitGeneralDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  arrival: '',     // '' | 'walking' | 'wheelchair' | 'stretcher' | 'ambulance'
  avpu: '',        // '' | 'A' | 'V' | 'P' | 'U'
  highRisk: 'all', // 'all' | 'yes' | 'no'
  disposition: '' // '' | 'admit' | 'transfer' | 'discharge' | 'died' | 'lwbs'
};

/** Sort state: which column key, ascending or descending. Default: most
 * recent disposition first (nulls last). */
const sortState = {
  key: 'dispositionAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'dateOfBirth',          label: 'DOB' },
  { key: 'sex',                  label: 'Sex' },
  { key: 'arrivalMode',          label: 'Arrival Mode' },
  { key: 'chiefComplaint',       label: 'Chief Complaint' },
  { key: 'avpu',                 label: 'AVPU' },
  { key: 'highRiskSignsPresent', label: 'High Risk Signs' },
  { key: 'disposition',          label: 'Disposition' },
  { key: 'urgentFlagCount',      label: 'Urgent Flags' },
  { key: 'providerName',         label: 'Provider' },
  { key: 'dispositionAt',        label: 'Disposition At' }
];

// Rank used when sorting AVPU (Alert -> Unresponsive); mirrors clinical
// severity so 'A' is least severe and 'U' is most.
const avpuRank = { 'A': 0, 'V': 1, 'P': 2, 'U': 3, '': -1 };

// Rank for arrival modes (least → most acute).
const arrivalRank = {
  'walking': 0,
  'wheelchair': 1,
  'stretcher': 2,
  'ambulance': 3,
  '': -1
};

// Rank for dispositions (administrative ordering used by the SvelteKit grid).
const dispositionRank = {
  'admit': 0,
  'transfer': 1,
  'discharge': 2,
  'died': 3,
  'lwbs': 4,
  '': -1
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

function formatArrivalMode(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatAvpu(value) {
  switch (value) {
    case 'A': return 'A \u2014 Alert';
    case 'V': return 'V \u2014 Verbal';
    case 'P': return 'P \u2014 Pain';
    case 'U': return 'U \u2014 Unresponsive';
    default:  return value || '';
  }
}

function formatDisposition(value) {
  switch (value) {
    case 'admit':     return 'Admit';
    case 'transfer':  return 'Transfer';
    case 'discharge': return 'Discharge';
    case 'died':      return 'Died';
    case 'lwbs':      return 'LWBS';
    default:          return value || '';
  }
}

function dispositionClass(value) {
  if (!value) return '';
  return 'disposition-' + value;
}

function arrivalClass(value) {
  if (!value) return '';
  return 'arrival-' + value;
}

function avpuClass(value) {
  if (!value) return '';
  return 'avpu-' + value.toLowerCase();
}

function formatDispositionAt(value) {
  if (!value) return '\u2014';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.arrival !== '' ||
    filters.avpu !== '' ||
    filters.highRisk !== 'all' ||
    filters.disposition !== ''
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
      row.chiefComplaint.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.arrival && row.arrivalMode !== filters.arrival) return false;
  if (filters.avpu && row.avpu !== filters.avpu) return false;
  if (filters.highRisk === 'yes' && !row.highRiskSignsPresent) return false;
  if (filters.highRisk === 'no' && row.highRiskSignsPresent) return false;
  if (filters.disposition && row.disposition !== filters.disposition) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Specialised columns (AVPU,
 * arrival mode, disposition, dates, booleans, numbers) get explicit
 * comparators; everything else falls back to a locale-aware string compare.
 *
 * For `dispositionAt` (default sort) `null` always sorts last regardless of
 * direction, matching the spec.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'dispositionAt') {
    // null always sorts last, regardless of direction.
    const aNull = av === null || av === undefined || av === '';
    const bNull = bv === null || bv === undefined || bv === '';
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  if (key === 'avpu') {
    return ((avpuRank[av] ?? -1) - (avpuRank[bv] ?? -1)) * dir;
  }

  if (key === 'arrivalMode') {
    return ((arrivalRank[av] ?? -1) - (arrivalRank[bv] ?? -1)) * dir;
  }

  if (key === 'disposition') {
    return ((dispositionRank[av] ?? -1) - (dispositionRank[bv] ?? -1)) * dir;
  }

  if (key === 'highRiskSignsPresent') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'urgentFlagCount') {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  if (key === 'dateOfBirth') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
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

    // Red-highlight rows with critical AVPU (P or U) or disposition died.
    const isCriticalAvpu = row.avpu === 'P' || row.avpu === 'U';
    const isDied = row.disposition === 'died';
    if (isCriticalAvpu || isDied) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.dateOfBirth)}</td>
      <td class="data-table-td">${esc(row.sex)}</td>
      <td class="data-table-td"><span class="badge ${arrivalClass(row.arrivalMode)}">${esc(formatArrivalMode(row.arrivalMode))}</span></td>
      <td class="data-table-td cell-complaint">${esc(row.chiefComplaint)}</td>
      <td class="data-table-td"><span class="badge ${avpuClass(row.avpu)}">${esc(formatAvpu(row.avpu))}</span></td>
      <td class="data-table-td">
        <span class="badge ${row.highRiskSignsPresent ? 'high-risk-yes' : 'high-risk-no'}">
          ${row.highRiskSignsPresent ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td"><span class="badge ${dispositionClass(row.disposition)}">${esc(formatDisposition(row.disposition))}</span></td>
      <td class="data-table-td cell-numeric">${esc(String(row.urgentFlagCount))}</td>
      <td class="data-table-td">${esc(row.providerName)}</td>
      <td class="data-table-td">${esc(formatDispositionAt(row.dispositionAt))}</td>
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
    el.textContent = 'No encounters to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} encounters`;
  } else {
    el.textContent = `Showing ${shown} of ${total} encounters`;
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
  const arrival = document.getElementById('filter-arrival');
  const avpu = document.getElementById('filter-avpu');
  const highRisk = document.getElementById('filter-high-risk');
  const disposition = document.getElementById('filter-disposition');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (arrival) {
    arrival.addEventListener('change', () => {
      filters.arrival = arrival.value;
      renderAll();
    });
  }
  if (avpu) {
    avpu.addEventListener('change', () => {
      filters.avpu = avpu.value;
      renderAll();
    });
  }
  if (highRisk) {
    highRisk.addEventListener('change', () => {
      filters.highRisk = highRisk.value;
      renderAll();
    });
  }
  if (disposition) {
    disposition.addEventListener('change', () => {
      filters.disposition = disposition.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.arrival = '';
      filters.avpu = '';
      filters.highRisk = 'all';
      filters.disposition = '';
      if (search) search.value = '';
      if (arrival) arrival.value = '';
      if (avpu) avpu.value = '';
      if (highRisk) highRisk.value = 'all';
      if (disposition) disposition.value = '';
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
        'Showing sample data \u2014 backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data \u2014 backend offline (' +
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
