// WHO Prehospital Form - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + triage + scene type + reassessment count + handover).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WhoPrehospitalDashboard`. Pulling them off
// here keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to the
// global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.WhoPrehospitalDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  triage: '',           // '' | 'red' | 'yellow' | 'green'
  scene: '',            // '' | 'home' | 'roadside' | 'workplace' | 'public' | 'medical-facility' | 'other'
  reassessments: 'all', // 'all' | '0' | '1' | '2' | '3'
  handover: 'all'       // 'all' | 'yes' | 'no'
};

/** Sort state: which column key, ascending or descending. Default: most
 * recent dispatch first. */
const sortState = {
  key: 'dispatchedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'age',               label: 'Age' },
  { key: 'sex',               label: 'Sex' },
  { key: 'sceneType',         label: 'Scene Type' },
  { key: 'chiefComplaint',    label: 'Chief Complaint' },
  { key: 'triageCategory',    label: 'Triage' },
  { key: 'gcsTotal',          label: 'GCS' },
  { key: 'reassessmentCount', label: 'Reassessments' },
  { key: 'urgentFlagCount',   label: 'Urgent Flags' },
  { key: 'providerName',      label: 'Provider' },
  { key: 'dispatchedAt',      label: 'Dispatched' },
  { key: 'handoverAt',        label: 'Handover' }
];

// Rank used when sorting triage (most -> least acute clinically).
const triageRank = { 'red': 0, 'yellow': 1, 'green': 2, '': -1 };

// Rank for scene types (administrative ordering used by the SvelteKit grid).
const sceneRank = {
  'home': 0,
  'roadside': 1,
  'workplace': 2,
  'public': 3,
  'medical-facility': 4,
  'other': 5,
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

function formatSceneType(value) {
  switch (value) {
    case 'home':             return 'Home';
    case 'roadside':         return 'Roadside';
    case 'workplace':        return 'Workplace';
    case 'public':           return 'Public';
    case 'medical-facility': return 'Medical facility';
    case 'other':            return 'Other';
    default:                 return value || '';
  }
}

function formatTriage(value) {
  switch (value) {
    case 'red':    return 'Red';
    case 'yellow': return 'Yellow';
    case 'green':  return 'Green';
    default:       return value || '';
  }
}

function triageClass(value) {
  if (!value) return '';
  return 'triage-' + value;
}

function sceneClass(value) {
  if (!value) return '';
  return 'scene-' + value;
}

function formatTimestamp(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.triage !== '' ||
    filters.scene !== '' ||
    filters.reassessments !== 'all' ||
    filters.handover !== 'all'
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
  if (filters.triage && row.triageCategory !== filters.triage) return false;
  if (filters.scene && row.sceneType !== filters.scene) return false;
  if (filters.reassessments !== 'all') {
    if (Number(row.reassessmentCount) !== Number(filters.reassessments)) {
      return false;
    }
  }
  const hasHandover = row.handoverAt !== null && row.handoverAt !== undefined && row.handoverAt !== '';
  if (filters.handover === 'yes' && !hasHandover) return false;
  if (filters.handover === 'no' && hasHandover) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Specialised columns (triage,
 * scene type, dates, numbers) get explicit comparators; everything else falls
 * back to a locale-aware string compare.
 *
 * For `handoverAt` `null` always sorts last regardless of direction so
 * in-progress encounters appear together at the bottom of the list.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'dispatchedAt') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  if (key === 'handoverAt') {
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

  if (key === 'triageCategory') {
    return ((triageRank[av] ?? -1) - (triageRank[bv] ?? -1)) * dir;
  }

  if (key === 'sceneType') {
    return ((sceneRank[av] ?? -1) - (sceneRank[bv] ?? -1)) * dir;
  }

  if (
    key === 'age' ||
    key === 'reassessmentCount' ||
    key === 'urgentFlagCount'
  ) {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  if (key === 'gcsTotal') {
    // null sorts last regardless of direction.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (Number(av) - Number(bv)) * dir;
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
    th.className = 'data-table-th';
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

    // Red-highlight rows with RED triage category.
    if (row.triageCategory === 'red') {
      tr.classList.add('row-critical');
    }

    const handoverHtml = (row.handoverAt === null || row.handoverAt === undefined || row.handoverAt === '')
      ? '<span class="cell-in-progress">In progress</span>'
      : esc(formatTimestamp(row.handoverAt));

    const gcsHtml = (row.gcsTotal === null || row.gcsTotal === undefined)
      ? '\u2014'
      : esc(String(row.gcsTotal));

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td cell-numeric">${esc(String(row.age))}</td>
      <td class="data-table-td">${esc(row.sex)}</td>
      <td class="data-table-td"><span class="badge ${sceneClass(row.sceneType)}">${esc(formatSceneType(row.sceneType))}</span></td>
      <td class="data-table-td cell-complaint">${esc(row.chiefComplaint)}</td>
      <td class="data-table-td"><span class="badge ${triageClass(row.triageCategory)}">${esc(formatTriage(row.triageCategory))}</span></td>
      <td class="data-table-td cell-numeric">${gcsHtml}</td>
      <td class="data-table-td cell-numeric">${esc(String(row.reassessmentCount))}</td>
      <td class="data-table-td cell-numeric">${esc(String(row.urgentFlagCount))}</td>
      <td class="data-table-td">${esc(row.providerName)}</td>
      <td class="data-table-td">${esc(formatTimestamp(row.dispatchedAt))}</td>
      <td class="data-table-td">${handoverHtml}</td>
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
    el.textContent = 'No EMS calls to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} EMS calls`;
  } else {
    el.textContent = `Showing ${shown} of ${total} EMS calls`;
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
  const triage = document.getElementById('filter-triage');
  const scene = document.getElementById('filter-scene');
  const reassessments = document.getElementById('filter-reassessments');
  const handover = document.getElementById('filter-handover');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (triage) {
    triage.addEventListener('change', () => {
      filters.triage = triage.value;
      renderAll();
    });
  }
  if (scene) {
    scene.addEventListener('change', () => {
      filters.scene = scene.value;
      renderAll();
    });
  }
  if (reassessments) {
    reassessments.addEventListener('change', () => {
      filters.reassessments = reassessments.value;
      renderAll();
    });
  }
  if (handover) {
    handover.addEventListener('change', () => {
      filters.handover = handover.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.triage = '';
      filters.scene = '';
      filters.reassessments = 'all';
      filters.handover = 'all';
      if (search) search.value = '';
      if (triage) triage.value = '';
      if (scene) scene.value = '';
      if (reassessments) reassessments.value = 'all';
      if (handover) handover.value = 'all';
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
