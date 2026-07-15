import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Ophthalmology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + VA-grade dropdown + affected-eye dropdown + IOP-status
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.OphthalmologyAssessmentDashboard`. Pulling
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
  vaGrade: '',
  affectedEye: '',
  iop: ''
};

// Default sort: patient name ascending — matches the SvelteKit dashboard's
// initial sort (`api.exec('sort-rows', { key: 'patientName', order: 'asc' })`).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'vaGrade',          label: 'VA Grade' },
  { key: 'affectedEye',      label: 'Affected Eye' },
  { key: 'primaryCondition', label: 'Primary Condition' },
  { key: 'iopStatus',        label: 'IOP Status' }
];

// Rank used when sorting the vaGrade column so 'normal' is always less than
// 'blindness' regardless of locale.
const vaGradeRank = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  blindness: 4
};

// Display label for each VA grade — matches `vaGradeDisplayMap` in the
// SvelteKit dashboard's `+page.svelte`.
const vaGradeLabel = {
  normal: 'Normal',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  blindness: 'Blindness'
};

// Rank used when sorting the iopStatus column.
const iopRank = {
  'Normal': 0,
  'Raised': 1,
  'Significantly raised': 2
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

function vaGradeClass(grade) {
  if (!grade) return '';
  return 'va-grade-' + String(grade).toLowerCase();
}

function eyeClass(eye) {
  if (!eye) return '';
  return 'eye-' + String(eye).toLowerCase();
}

function iopClass(status) {
  if (!status) return '';
  return 'iop-' + String(status).toLowerCase().replace(/\s+/g, '-');
}

function titleCase(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.vaGrade !== '' ||
    filters.affectedEye !== '' ||
    filters.iop !== ''
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
      row.primaryCondition.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.vaGrade && row.vaGrade !== filters.vaGrade) {
    return false;
  }
  if (filters.affectedEye && row.affectedEye !== filters.affectedEye) {
    return false;
  }
  if (filters.iop && row.iopStatus !== filters.iop) {
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

  if (key === 'vaGrade') {
    av = vaGradeRank[av] ?? -1;
    bv = vaGradeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'iopStatus') {
    av = iopRank[av] ?? -1;
    bv = iopRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, affectedEye,
  // primaryCondition).
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
    if (row.vaGrade === 'severe') {
      tr.classList.add('row-severe');
    } else if (row.vaGrade === 'blindness') {
      tr.classList.add('row-blindness');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="va-grade-badge ${vaGradeClass(row.vaGrade)}">${esc(vaGradeLabel[row.vaGrade] || row.vaGrade)}</span></td>
      <td><span class="eye-badge ${eyeClass(row.affectedEye)}">${esc(titleCase(row.affectedEye))}</span></td>
      <td>${esc(row.primaryCondition)}</td>
      <td><span class="iop-badge ${iopClass(row.iopStatus)}">${esc(row.iopStatus)}</span></td>
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
  const vaGrade = document.getElementById('filter-va-grade');
  const eye = document.getElementById('filter-affected-eye');
  const iop = document.getElementById('filter-iop');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (vaGrade) {
    vaGrade.addEventListener('change', () => {
      filters.vaGrade = vaGrade.value;
      renderAll();
    });
  }
  if (eye) {
    eye.addEventListener('change', () => {
      filters.affectedEye = eye.value;
      renderAll();
    });
  }
  if (iop) {
    iop.addEventListener('change', () => {
      filters.iop = iop.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.vaGrade = '';
      filters.affectedEye = '';
      filters.iop = '';
      if (search) search.value = '';
      if (vaGrade) vaGrade.value = '';
      if (eye) eye.value = '';
      if (iop) iop.value = '';
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
