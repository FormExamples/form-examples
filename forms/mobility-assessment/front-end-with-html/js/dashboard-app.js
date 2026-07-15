import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Mobility Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + Tinetti-band dropdown + fall-risk dropdown + device dropdown).
//
// Default sort surfaces the most at-risk patients first: fall-risk band
// descending (High fall risk on top), with ties broken by Timed Up and Go
// time descending so the slowest — and therefore most impaired — patient of a
// tier appears first. This matches the clinical priority defined in
// `forms/mobility-assessment/AGENTS.md` (Tinetti < 19 = High fall risk).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.MobilityAssessmentDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  tinetti: '',  // '', '25-28', '19-24', '0-18'
  fallRisk: '', // '', 'Low fall risk', 'Moderate fall risk', 'High fall risk'
  device: ''    // '', 'None', 'Cane', 'Quad cane', 'Walker', 'Rollator', 'Wheelchair'
};

// Default sort: fall-risk descending so High fall risk rows appear at the top
// of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'fallRisk',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'tinettiScore',    label: 'Tinetti Score' },
  { key: 'tugTime',         label: 'TUG Time' },
  { key: 'fallRisk',        label: 'Fall Risk' },
  { key: 'assistiveDevice', label: 'Device' }
];

// Rank used when sorting the fall-risk column so 'Low fall risk' is always
// less than 'High fall risk' regardless of locale. Higher rank = more
// clinically urgent.
const fallRiskRank = {
  'Low fall risk': 0,
  'Moderate fall risk': 1,
  'High fall risk': 2
};

// Tinetti-band dropdown values map to inclusive score ranges [min, max].
const tinettiRanges = {
  '25-28': [25, 28],
  '19-24': [19, 24],
  '0-18': [0, 18]
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

function fallRiskClass(label) {
  switch (label) {
    case 'Low fall risk':      return 'risk-low';
    case 'Moderate fall risk': return 'risk-moderate';
    case 'High fall risk':     return 'risk-high';
    default:                   return '';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.tinetti !== '' ||
    filters.fallRisk !== '' ||
    filters.device !== ''
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
      String(row.nhsNumber).toLowerCase().includes(term) ||
      String(row.patientName).toLowerCase().includes(term) ||
      String(row.assistiveDevice).toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.tinetti) {
    const range = tinettiRanges[filters.tinetti];
    if (range) {
      const s = row.tinettiScore;
      if (s == null || s < range[0] || s > range[1]) return false;
    }
  }
  if (filters.fallRisk && row.fallRisk !== filters.fallRisk) {
    return false;
  }
  if (filters.device && row.assistiveDevice !== filters.device) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. The fall-risk column uses its
 * rank table; numbers compare directly; everything else uses a locale-aware
 * string compare.
 *
 * Fall-risk ties break on TUG time in the same direction so, when sorting
 * descending, the slowest (most impaired) patient of a tier appears first.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'fallRisk') {
    av = fallRiskRank[av] ?? -1;
    bv = fallRiskRank[bv] ?? -1;
    if (av !== bv) return (av - bv) * dir;
    // Tie-breaker: TUG time in the same direction so the slowest patient of a
    // tier appears first when sorting descending.
    return ((a.tugTime ?? 0) - (b.tugTime ?? 0)) * dir;
  }

  if (key === 'tinettiScore' || key === 'tugTime') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, assistiveDevice)
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
    let indicator = '↕'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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
    if (row.fallRisk === 'High fall risk') {
      tr.classList.add('row-high');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="tinetti-score">${esc(row.tinettiScore)}/28</span></td>
      <td><span class="tug-time">${esc(row.tugTime)}s</span></td>
      <td><span class="risk-badge ${fallRiskClass(row.fallRisk)}">${esc(row.fallRisk)}</span></td>
      <td><span class="device-badge">${esc(row.assistiveDevice)}</span></td>
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
    // Fall-risk and TUG time default to descending (most at-risk first);
    // Tinetti score defaults to ascending (lowest score = worst first);
    // everything else defaults to ascending.
    sortState.direction = (key === 'fallRisk' || key === 'tugTime')
      ? 'desc'
      : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const tinetti = document.getElementById('filter-tinetti');
  const fallRisk = document.getElementById('filter-fallrisk');
  const device = document.getElementById('filter-device');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (tinetti) {
    tinetti.addEventListener('change', () => {
      filters.tinetti = tinetti.value;
      renderAll();
    });
  }
  if (fallRisk) {
    fallRisk.addEventListener('change', () => {
      filters.fallRisk = fallRisk.value;
      renderAll();
    });
  }
  if (device) {
    device.addEventListener('change', () => {
      filters.device = device.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.tinetti = '';
      filters.fallRisk = '';
      filters.device = '';
      if (search) search.value = '';
      if (tinetti) tinetti.value = '';
      if (fallRisk) fallRisk.value = '';
      if (device) device.value = '';
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
