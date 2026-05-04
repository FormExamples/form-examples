// Advance Decision To Refuse Treatment - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + validity-status dropdown + life-sustaining dropdown +
// witnessed dropdown + LPA-status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AdvanceDecisionToRefuseTreatmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.AdvanceDecisionToRefuseTreatmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  validity: '',
  lifeSustaining: '', // '', 'yes', 'no'
  witnessed: '',      // '', 'yes', 'no'
  lpa: ''
};

// Default sort: patient name ascending. This matches the SvelteKit
// dashboard's default (`api.exec('sort-rows', { key: 'patientName',
// order: 'asc' })`) so the two surfaces show rows in the same order.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions - single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',             label: 'NHS Number' },
  { key: 'patientName',           label: 'Patient Name' },
  { key: 'validityStatus',        label: 'Validity Status' },
  { key: 'lifeSustainingRefusal', label: 'Life-Sustaining' },
  { key: 'witnessed',             label: 'Witnessed' },
  { key: 'reviewDate',            label: 'Review Date' },
  { key: 'lpaStatus',             label: 'LPA Status' }
];

// Rank used when sorting the validityStatus column so the categorical
// progression Draft -> Complete -> Valid -> Invalid is preserved no matter
// the user locale.
const validityRank = {
  'Draft': 0,
  'Complete': 1,
  'Valid': 2,
  'Invalid': 3
};

// Rank used when sorting the lpaStatus column.
const lpaRank = {
  'None': 0,
  'Health & Welfare': 1,
  'Property & Financial': 2
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

function validityClass(label) {
  if (!label) return '';
  return 'validity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function lpaClass(label) {
  if (!label) return '';
  // Replace '&' with 'and' and collapse whitespace to '-' so we end up with
  // class names like `lpa-health-and-welfare`.
  return (
    'lpa-' +
    String(label)
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  );
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.lifeSustaining !== '' ||
    filters.witnessed !== '' ||
    filters.lpa !== ''
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
      row.validityStatus.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.validityStatus !== filters.validity) {
    return false;
  }
  if (filters.lifeSustaining === 'yes' && !row.lifeSustainingRefusal) return false;
  if (filters.lifeSustaining === 'no' && row.lifeSustainingRefusal) return false;
  if (filters.witnessed === 'yes' && !row.witnessed) return false;
  if (filters.witnessed === 'no' && row.witnessed) return false;
  if (filters.lpa && row.lpaStatus !== filters.lpa) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; date strings (ISO yyyy-mm-dd)
 * sort lexicographically with empty strings last; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'validityStatus') {
    av = validityRank[av] ?? -1;
    bv = validityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'lpaStatus') {
    av = lpaRank[av] ?? -1;
    bv = lpaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'lifeSustainingRefusal' || key === 'witnessed') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'reviewDate') {
    // Empty review dates sort last regardless of direction.
    if (!av && !bv) return 0;
    if (!av) return 1;
    if (!bv) return -1;
    return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
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
    if (row.validityStatus === 'Invalid') {
      tr.classList.add('row-invalid');
    }

    const lifeSustainingClass =
      row.lifeSustainingRefusal ? 'flag-yes' : 'flag-no';
    // Witnessed=Yes is the legally compliant state; render it in green.
    const witnessedClass =
      row.witnessed ? 'flag-yes-success' : 'flag-no';
    const reviewDateMarkup = row.reviewDate
      ? `<span class="review-date">${esc(row.reviewDate)}</span>`
      : `<span class="review-date review-date-empty">&mdash;</span>`;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="validity-badge ${validityClass(row.validityStatus)}">${esc(row.validityStatus)}</span></td>
      <td><span class="flag-badge ${lifeSustainingClass}">${row.lifeSustainingRefusal ? 'Yes' : 'No'}</span></td>
      <td><span class="flag-badge ${witnessedClass}">${row.witnessed ? 'Yes' : 'No'}</span></td>
      <td>${reviewDateMarkup}</td>
      <td><span class="lpa-badge ${lpaClass(row.lpaStatus)}">${esc(row.lpaStatus)}</span></td>
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
  const validity = document.getElementById('filter-validity');
  const lifeSustaining = document.getElementById('filter-life-sustaining');
  const witnessed = document.getElementById('filter-witnessed');
  const lpa = document.getElementById('filter-lpa');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.validity = validity.value;
      renderAll();
    });
  }
  if (lifeSustaining) {
    lifeSustaining.addEventListener('change', () => {
      filters.lifeSustaining = lifeSustaining.value;
      renderAll();
    });
  }
  if (witnessed) {
    witnessed.addEventListener('change', () => {
      filters.witnessed = witnessed.value;
      renderAll();
    });
  }
  if (lpa) {
    lpa.addEventListener('change', () => {
      filters.lpa = lpa.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.lifeSustaining = '';
      filters.witnessed = '';
      filters.lpa = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (lifeSustaining) lifeSustaining.value = '';
      if (witnessed) witnessed.value = '';
      if (lpa) lpa.value = '';
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
      // Backend reachable but empty - keep sample data and notify.
      showStatusBanner(
        'Showing sample data \u2014 backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data \u2014 backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
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
