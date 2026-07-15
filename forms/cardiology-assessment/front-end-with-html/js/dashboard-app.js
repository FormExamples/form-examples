import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Cardiology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + CCS-class dropdown + NYHA-class dropdown + risk-level
// dropdown + allergy dropdown + anticoagulant dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.CardiologyAssessmentDashboard`. Pulling
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
  ccs: '',     // '' | '1' | '2' | '3' | '4'
  nyha: '',    // '' | '1' | '2' | '3' | '4'
  risk: '',    // '' | 'low' | 'moderate' | 'high' | 'critical'
  allergy: '', // '' | 'yes' | 'no'
  anticoag: '' // '' | 'yes' | 'no'
};

// Default sort: patient name ascending. Matches the SvelteKit dashboard's
// `init` callback, which calls `sort-rows` with `{ key: 'patientName',
// order: 'asc' }` so both implementations show rows in the same order.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'ccsClass',          label: 'CCS Class' },
  { key: 'nyhaClass',         label: 'NYHA Class' },
  { key: 'riskLevel',         label: 'Risk Level' },
  { key: 'allergyFlag',       label: 'Allergy' },
  { key: 'anticoagulantFlag', label: 'Anticoag.' }
];

// Roman numerals for CCS / NYHA class display (1-indexed shifted to 0).
const romanNumerals = ['I', 'II', 'III', 'IV'];

// Rank used when sorting the riskLevel column so 'low' is always less than
// 'critical' regardless of locale.
const riskRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'critical': 3
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

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

/** Title-case the first letter of a risk-level string for display. */
function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Render a 1-4 class as "CCS I"/"NYHA III" or "N/A" when null. */
function classLabel(prefix, value) {
  if (value === null || value === undefined) return 'N/A';
  const rn = romanNumerals[value - 1];
  return rn ? `${prefix} ${rn}` : 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.ccs !== '' ||
    filters.nyha !== '' ||
    filters.risk !== '' ||
    filters.allergy !== '' ||
    filters.anticoag !== ''
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
  if (filters.ccs) {
    if (row.ccsClass === null || row.ccsClass !== Number(filters.ccs)) {
      return false;
    }
  }
  if (filters.nyha) {
    if (row.nyhaClass === null || row.nyhaClass !== Number(filters.nyha)) {
      return false;
    }
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
  if (filters.anticoag === 'yes' && !row.anticoagulantFlag) return false;
  if (filters.anticoag === 'no' && row.anticoagulantFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; nullable numeric class columns sort nulls last;
 * booleans sort false<true; everything else uses a locale-aware string
 * compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ccsClass' || key === 'nyhaClass') {
    // Sort nulls last in both ascending and descending order so the
    // "interesting" graded patients always cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'allergyFlag' || key === 'anticoagulantFlag') {
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
    if (row.riskLevel === 'critical') {
      tr.classList.add('row-critical');
    }

    const ccsText = classLabel('CCS', row.ccsClass);
    const nyhaText = classLabel('NYHA', row.nyhaClass);
    const ccsClassName = row.ccsClass === null
      ? 'class-cell class-cell-na'
      : 'class-cell';
    const nyhaClassName = row.nyhaClass === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="${ccsClassName}">${esc(ccsText)}</span></td>
      <td><span class="${nyhaClassName}">${esc(nyhaText)}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(capitalize(row.riskLevel))}</span></td>
      <td>
        <span class="flag-badge ${row.allergyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="flag-badge ${row.anticoagulantFlag ? 'flag-yes' : 'flag-no'}">
          ${row.anticoagulantFlag ? 'Yes' : 'No'}
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
  const ccs = document.getElementById('filter-ccs');
  const nyha = document.getElementById('filter-nyha');
  const risk = document.getElementById('filter-risk');
  const allergy = document.getElementById('filter-allergy');
  const anticoag = document.getElementById('filter-anticoag');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (ccs) {
    ccs.addEventListener('change', () => {
      filters.ccs = ccs.value;
      renderAll();
    });
  }
  if (nyha) {
    nyha.addEventListener('change', () => {
      filters.nyha = nyha.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (anticoag) {
    anticoag.addEventListener('change', () => {
      filters.anticoag = anticoag.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.ccs = '';
      filters.nyha = '';
      filters.risk = '';
      filters.allergy = '';
      filters.anticoag = '';
      if (search) search.value = '';
      if (ccs) ccs.value = '';
      if (nyha) nyha.value = '';
      if (risk) risk.value = '';
      if (allergy) allergy.value = '';
      if (anticoag) anticoag.value = '';
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
