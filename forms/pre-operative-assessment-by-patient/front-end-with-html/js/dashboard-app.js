import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Pre-operative Assessment by Patient - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + ASA-grade dropdown + allergy dropdown + adverse-incident
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PreOperativeAssessmentByPatientDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  asa: '',
  allergy: '', // '', 'yes', 'no'
  adverse: ''  // '', 'yes', 'no'
};

// Default sort: ASA grade descending. Worst (highest grade) at the top so
// the patients who most need clinical attention surface first.
const sortState = {
  key: 'asaGrade',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'procedure',           label: 'Procedure' },
  { key: 'asaGrade',            label: 'ASA Grade' },
  { key: 'flagCount',           label: 'Safety Flags' },
  { key: 'allergyFlag',         label: 'Allergy' },
  { key: 'adverseIncidentFlag', label: 'Adverse Incident' }
];

// Rank used when sorting the asaGrade column so 'I' is always less than
// 'VI' regardless of locale (Roman-numeral string compare would not work).
const asaRank = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6
};

// ASA grades that are clinically severe enough to warrant a row-level
// emphasis (ASA IV+ = severe, life-threatening or worse).
const highGradeAsa = new Set(['IV', 'V', 'VI']);

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

function asaClass(grade) {
  if (!grade) return '';
  return 'asa-' + String(grade).toLowerCase();
}

function flagCountClass(n) {
  if (!n) return 'flag-count-zero';
  if (n >= 5) return 'flag-count-high';
  if (n >= 2) return 'flag-count-warn';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.asa !== '' ||
    filters.allergy !== '' ||
    filters.adverse !== ''
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
      String(row.procedure || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.asa && row.asaGrade !== filters.asa) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
  if (filters.adverse === 'yes' && !row.adverseIncidentFlag) return false;
  if (filters.adverse === 'no' && row.adverseIncidentFlag) return false;
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

  if (key === 'asaGrade') {
    av = asaRank[av] ?? -1;
    bv = asaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'allergyFlag' || key === 'adverseIncidentFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, procedure)
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
    if (highGradeAsa.has(row.asaGrade)) {
      tr.classList.add('row-high-grade');
    }

    const fcClass = flagCountClass(row.flagCount);

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.procedure)}</td>
      <td class="data-table-td"><span class="asa-badge ${asaClass(row.asaGrade)}">ASA ${esc(row.asaGrade)}</span></td>
      <td class="data-table-td"><span class="flag-count ${fcClass}">${esc(row.flagCount)}</span></td>
      <td class="data-table-td">
        <span class="flag-badge ${row.allergyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td">
        <span class="flag-badge ${row.adverseIncidentFlag ? 'flag-yes' : 'flag-no'}">
          ${row.adverseIncidentFlag ? 'Yes' : 'No'}
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
  const asa = document.getElementById('filter-asa');
  const allergy = document.getElementById('filter-allergy');
  const adverse = document.getElementById('filter-adverse');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (asa) {
    asa.addEventListener('change', () => {
      filters.asa = asa.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (adverse) {
    adverse.addEventListener('change', () => {
      filters.adverse = adverse.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.asa = '';
      filters.allergy = '';
      filters.adverse = '';
      if (search) search.value = '';
      if (asa) asa.value = '';
      if (allergy) allergy.value = '';
      if (adverse) adverse.value = '';
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
