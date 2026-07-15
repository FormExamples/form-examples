import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Psychiatry Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + GAF-band dropdown + risk-level dropdown + legal-status
// dropdown). Rows whose riskLevel is 'imminent' (active suicidal ideation
// with plan/intent) are visually emphasised so a clinician scanning the
// list cannot miss them.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  gaf: '',    // '' or 'NN-MM' band
  risk: '',   // '' | 'none' | 'low' | 'moderate' | 'high' | 'imminent'
  legal: ''   // '' | 'voluntary' | 'involuntary'
};

// Default sort: patient name ascending. Matches the SvelteKit dashboard's
// `init` callback (`sort-rows { key: 'patientName', order: 'asc' }`).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'gafScore',         label: 'GAF Score' },
  { key: 'riskLevel',        label: 'Risk Level' },
  { key: 'legalStatus',      label: 'Legal Status' },
  { key: 'primaryDiagnosis', label: 'Primary Diagnosis' }
];

// Rank used when sorting the riskLevel column so 'none' is always less than
// 'imminent' regardless of locale.
const riskRank = {
  none: 0,
  low: 1,
  moderate: 2,
  high: 3,
  imminent: 4
};

// Rank used when sorting legalStatus.
const legalRank = {
  voluntary: 0,
  involuntary: 1
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

/** Capitalise the first letter of a lowercase enum label for display. */
function titleCase(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function riskClass(value) {
  if (!value) return '';
  return 'risk-' + String(value).toLowerCase();
}

function legalClass(value) {
  if (!value) return '';
  return 'legal-' + String(value).toLowerCase();
}

/**
 * GAF band classifier. Returns a CSS-class suffix matching the colour bands
 * declared in style.css.
 */
function gafClass(score) {
  if (score >= 91) return 'gaf-superior';
  if (score >= 81) return 'gaf-minimal';
  if (score >= 71) return 'gaf-transient';
  if (score >= 61) return 'gaf-mild';
  if (score >= 51) return 'gaf-moderate';
  if (score >= 41) return 'gaf-serious';
  if (score >= 31) return 'gaf-major';
  return 'gaf-severe';
}

/** Test whether a numeric score falls inside an "NN-MM" filter range. */
function gafInRange(score, range) {
  if (!range) return true;
  const parts = range.split('-').map(Number);
  if (parts.length !== 2 || parts.some(isNaN)) return true;
  return score >= parts[0] && score <= parts[1];
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.gaf !== '' ||
    filters.risk !== '' ||
    filters.legal !== ''
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
      row.primaryDiagnosis.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.gaf && !gafInRange(row.gafScore, filters.gaf)) {
    return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.legal && row.legalStatus !== filters.legal) {
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

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'legalStatus') {
    av = legalRank[av] ?? -1;
    bv = legalRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'gafScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryDiagnosis)
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
    // Suicidal-ideation visual emphasis. The GAF risk model treats
    // 'imminent' as active suicidal ideation with plan or intent — the
    // single most clinically urgent row state, so the entire row gets a
    // contrasting background plus a left-edge indicator (see CSS).
    if (row.riskLevel === 'imminent') {
      tr.classList.add('row-suicidal-ideation');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="gaf-score ${gafClass(row.gafScore)}">${esc(row.gafScore)}/100</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(titleCase(row.riskLevel))}</span></td>
      <td><span class="legal-badge ${legalClass(row.legalStatus)}">${esc(titleCase(row.legalStatus))}</span></td>
      <td>${esc(row.primaryDiagnosis)}</td>
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
  const gaf = document.getElementById('filter-gaf');
  const risk = document.getElementById('filter-risk');
  const legal = document.getElementById('filter-legal');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (gaf) {
    gaf.addEventListener('change', () => {
      filters.gaf = gaf.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (legal) {
    legal.addEventListener('change', () => {
      filters.legal = legal.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.gaf = '';
      filters.risk = '';
      filters.legal = '';
      if (search) search.value = '';
      if (gaf) gaf.value = '';
      if (risk) risk.value = '';
      if (legal) legal.value = '';
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
