import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// WHO Emergency First Aid Form - clinician dashboard (vanilla classic-script
// app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + problem type + major bleeding + airway intervention + GCS
// level dropdowns).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WhoEmergencyFirstAidDashboard`. Pulling
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
  problemType: '',     // '', 'medical', 'trauma'
  majorBleeding: '',   // '', 'yes', 'no'
  airway: '',          // '', 'yes', 'no'
  gcs: ''              // '', 'alert', 'confused', 'unconscious'
};

/** Sort state: which column key, ascending or descending. */
const sortState = {
  key: 'recordedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'age',                 label: 'Age' },
  { key: 'sex',                 label: 'Sex' },
  { key: 'problemType',         label: 'Problem Type' },
  { key: 'majorBleeding',       label: 'Major Bleeding' },
  { key: 'tourniquetApplied',   label: 'Tourniquet' },
  { key: 'airwayIntervention',  label: 'Airway' },
  { key: 'gcsLevel',            label: 'GCS' },
  { key: 'urgentFlagCount',     label: 'Urgent Flags' },
  { key: 'recordedBy',          label: 'Responder' },
  { key: 'recordedAt',          label: 'Recorded' }
];

// Rank used when sorting GCS level so 'alert' < 'confused' < 'unconscious'
// regardless of locale.
const gcsRank = {
  'alert': 0,
  'confused': 1,
  'unconscious': 2,
  '': -1
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function capitalize(s) {
  if (!s) return '';
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function formatRecordedAt(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.problemType !== '' ||
    filters.majorBleeding !== '' ||
    filters.airway !== '' ||
    filters.gcs !== ''
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
      String(row.patientName || '').toLowerCase().includes(term) ||
      String(row.recordedBy || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.problemType && row.problemType !== filters.problemType) {
    return false;
  }
  if (filters.majorBleeding === 'yes' && !row.majorBleeding) return false;
  if (filters.majorBleeding === 'no' && row.majorBleeding) return false;
  if (filters.airway === 'yes' && !row.airwayIntervention) return false;
  if (filters.airway === 'no' && row.airwayIntervention) return false;
  if (filters.gcs && row.gcsLevel !== filters.gcs) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Booleans sort false<true;
 * GCS uses an ordinal rank; numbers compare numerically; timestamps parse
 * to milliseconds; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'gcsLevel') {
    av = gcsRank[av] != null ? gcsRank[av] : -1;
    bv = gcsRank[bv] != null ? gcsRank[bv] : -1;
    return (av - bv) * dir;
  }

  if (
    key === 'majorBleeding' ||
    key === 'tourniquetApplied' ||
    key === 'airwayIntervention'
  ) {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'age' || key === 'urgentFlagCount') {
    const an = av == null ? -Infinity : Number(av);
    const bn = bv == null ? -Infinity : Number(bv);
    return (an - bn) * dir;
  }

  if (key === 'recordedAt') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  // Default: string compare
  return String(av == null ? '' : av)
    .localeCompare(String(bv == null ? '' : bv)) * dir;
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
  head.classList.add('data-table-row');

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

function problemTypeCell(value) {
  if (!value) return '';
  const cls = value === 'trauma' ? 'badge-trauma' : 'badge-medical';
  return `<span class="badge ${cls}">${esc(capitalize(value))}</span>`;
}

function gcsCell(value) {
  if (!value) return '';
  const cls = 'badge-gcs-' + value;
  return `<span class="badge ${cls}">${esc(capitalize(value))}</span>`;
}

function boolCell(value) {
  const cls = value ? 'bool-yes' : 'bool-no';
  return `<span class="bool-badge ${cls}">${value ? 'Yes' : 'No'}</span>`;
}

function flagCountCell(value) {
  const n = Number(value) || 0;
  const cls = n > 0 ? 'flag-count flag-count-active' : 'flag-count';
  return `<span class="${cls}">${esc(String(n))}</span>`;
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
    if ((Number(row.urgentFlagCount) || 0) > 0) tr.classList.add('row-urgent');

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${row.age == null ? '' : esc(String(row.age))}</td>
      <td class="data-table-td">${esc(row.sex)}</td>
      <td class="data-table-td">${problemTypeCell(row.problemType)}</td>
      <td class="data-table-td">${boolCell(row.majorBleeding)}</td>
      <td class="data-table-td">${boolCell(row.tourniquetApplied)}</td>
      <td class="data-table-td">${boolCell(row.airwayIntervention)}</td>
      <td class="data-table-td">${gcsCell(row.gcsLevel)}</td>
      <td class="data-table-td">${flagCountCell(row.urgentFlagCount)}</td>
      <td class="data-table-td">${esc(row.recordedBy)}</td>
      <td class="data-table-td">${esc(formatRecordedAt(row.recordedAt))}</td>
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
    // Default to descending for numeric / date columns where "biggest first"
    // is more useful at first click; ascending otherwise.
    if (
      key === 'recordedAt' ||
      key === 'urgentFlagCount' ||
      key === 'age'
    ) {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const problemType = document.getElementById('filter-problem-type');
  const majorBleeding = document.getElementById('filter-major-bleeding');
  const airway = document.getElementById('filter-airway');
  const gcs = document.getElementById('filter-gcs');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (problemType) {
    problemType.addEventListener('change', () => {
      filters.problemType = problemType.value;
      renderAll();
    });
  }
  if (majorBleeding) {
    majorBleeding.addEventListener('change', () => {
      filters.majorBleeding = majorBleeding.value;
      renderAll();
    });
  }
  if (airway) {
    airway.addEventListener('change', () => {
      filters.airway = airway.value;
      renderAll();
    });
  }
  if (gcs) {
    gcs.addEventListener('change', () => {
      filters.gcs = gcs.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.problemType = '';
      filters.majorBleeding = '';
      filters.airway = '';
      filters.gcs = '';
      if (search) search.value = '';
      if (problemType) problemType.value = '';
      if (majorBleeding) majorBleeding.value = '';
      if (airway) airway.value = '';
      if (gcs) gcs.value = '';
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
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
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
