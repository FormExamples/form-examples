import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Renal Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + GFR-category dropdown + albuminuria dropdown +
// composite-risk dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.RenalAssessmentDashboard`. Pulling them
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
  gfr: '',
  albuminuria: '',
  risk: ''
};

// Default sort: eGFR ascending. Worst kidney function = lowest eGFR = top
// of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'egfr',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'egfr',                label: 'eGFR' },
  { key: 'gfrCategory',         label: 'GFR Category' },
  { key: 'albuminuriaCategory', label: 'Albuminuria' },
  { key: 'compositeRisk',       label: 'Composite Risk' }
];

// Rank used when sorting the gfrCategory column so 'G1' < 'G5' regardless
// of locale or string ordering ('G3a' vs 'G3b' would otherwise be brittle).
const gfrRank = {
  'G1': 0,
  'G2': 1,
  'G3a': 2,
  'G3b': 3,
  'G4': 4,
  'G5': 5
};

// Rank used when sorting the albuminuriaCategory column.
const albuminuriaRank = {
  'A1': 0,
  'A2': 1,
  'A3': 2
};

// Rank used when sorting the compositeRisk column.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2,
  'Very High': 3
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

function gfrClass(label) {
  if (!label) return '';
  return 'gfr-' + String(label).toLowerCase();
}

function albuminuriaClass(label) {
  if (!label) return '';
  return 'albuminuria-' + String(label).toLowerCase();
}

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.gfr !== '' ||
    filters.albuminuria !== '' ||
    filters.risk !== ''
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
  if (filters.gfr && row.gfrCategory !== filters.gfr) {
    return false;
  }
  if (filters.albuminuria && row.albuminuriaCategory !== filters.albuminuria) {
    return false;
  }
  if (filters.risk && row.compositeRisk !== filters.risk) {
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

  if (key === 'gfrCategory') {
    av = gfrRank[av] ?? -1;
    bv = gfrRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'albuminuriaCategory') {
    av = albuminuriaRank[av] ?? -1;
    bv = albuminuriaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'compositeRisk') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'egfr') {
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
    if (row.compositeRisk === 'Very High') {
      tr.classList.add('row-very-high-risk');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="egfr-value">${esc(row.egfr)}</span></td>
      <td><span class="gfr-badge ${gfrClass(row.gfrCategory)}">${esc(row.gfrCategory)}</span></td>
      <td><span class="albuminuria-badge ${albuminuriaClass(row.albuminuriaCategory)}">${esc(row.albuminuriaCategory)}</span></td>
      <td><span class="risk-badge ${riskClass(row.compositeRisk)}">${esc(row.compositeRisk)}</span></td>
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
  const gfr = document.getElementById('filter-gfr');
  const albuminuria = document.getElementById('filter-albuminuria');
  const risk = document.getElementById('filter-risk');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (gfr) {
    gfr.addEventListener('change', () => {
      filters.gfr = gfr.value;
      renderAll();
    });
  }
  if (albuminuria) {
    albuminuria.addEventListener('change', () => {
      filters.albuminuria = albuminuria.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.gfr = '';
      filters.albuminuria = '';
      filters.risk = '';
      if (search) search.value = '';
      if (gfr) gfr.value = '';
      if (albuminuria) albuminuria.value = '';
      if (risk) risk.value = '';
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
