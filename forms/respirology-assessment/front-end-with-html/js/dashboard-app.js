import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Respirology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + MRC-grade dropdown + oxygen-status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.RespirologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  mrc: '',     // '', '1'..'5'
  oxygen: ''   // '', 'room-air', 'oxygen'
};

// Default sort: MRC grade descending. Highest grade = most breathless =
// top of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'mrcGrade',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'mrcGrade',         label: 'MRC Grade' },
  { key: 'primaryCondition', label: 'Primary Condition' },
  { key: 'oxygenStatus',     label: 'Oxygen Status' }
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

function mrcClass(grade) {
  const n = Number(grade);
  if (n >= 1 && n <= 5) return 'mrc-' + n;
  return '';
}

/**
 * The dashboard groups oxygen statuses into two coarse buckets to match the
 * filter-bar dropdown: "Room air" vs anything else (LTOT, ambulatory O2,
 * CPAP, BiPAP, etc.). Returns a CSS-class suffix for the badge.
 */
function isRoomAir(label) {
  return String(label || '').toLowerCase() === 'room air';
}

function oxygenClass(label) {
  return isRoomAir(label) ? 'oxygen-room-air' : 'oxygen-on-oxygen';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mrc !== '' ||
    filters.oxygen !== ''
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
  if (filters.mrc && Number(row.mrcGrade) !== Number(filters.mrc)) {
    return false;
  }
  if (filters.oxygen === 'room-air' && !isRoomAir(row.oxygenStatus)) return false;
  if (filters.oxygen === 'oxygen' && isRoomAir(row.oxygenStatus)) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Numeric columns compare
 * directly; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'mrcGrade') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryCondition,
  // oxygenStatus). The lexicographic ordering of oxygenStatus is good enough
  // for this dashboard — clinicians filter rather than sort that column in
  // practice.
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
    if (Number(row.mrcGrade) >= 4) {
      tr.classList.add('row-mrc-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="mrc-badge ${mrcClass(row.mrcGrade)}">MRC ${esc(row.mrcGrade)}</span></td>
      <td class="primary-condition">${esc(row.primaryCondition)}</td>
      <td><span class="oxygen-badge ${oxygenClass(row.oxygenStatus)}">${esc(row.oxygenStatus)}</span></td>
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
  const mrc = document.getElementById('filter-mrc');
  const oxygen = document.getElementById('filter-oxygen');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mrc) {
    mrc.addEventListener('change', () => {
      filters.mrc = mrc.value;
      renderAll();
    });
  }
  if (oxygen) {
    oxygen.addEventListener('change', () => {
      filters.oxygen = oxygen.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mrc = '';
      filters.oxygen = '';
      if (search) search.value = '';
      if (mrc) mrc.value = '';
      if (oxygen) oxygen.value = '';
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
