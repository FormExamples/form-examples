import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Contraception Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + UKMEC category dropdown + review status dropdown +
// preferred method dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.ContraceptionAssessmentDashboard`. Pulling
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
  ukmec: '',  // '', '1', '2', '3', '4'
  review: '',
  method: ''
};

// Default sort: UKMEC category descending. Highest-risk patients
// (UKMEC 4 = unacceptable) bubble to the top of the list.
const sortState = {
  key: 'ukmecCategory',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'ukmecCategory',   label: 'UKMEC' },
  { key: 'preferredMethod', label: 'Preferred Method' },
  { key: 'currentMethod',   label: 'Current Method' },
  { key: 'reviewStatus',    label: 'Review Status' }
];

// Rank used when sorting the reviewStatus column so 'Urgent' sorts above
// 'Requires review' regardless of locale.
const reviewRank = {
  'Completed': 0,
  'Pending': 1,
  'Requires review': 2,
  'Urgent': 3
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

function ukmecClass(category) {
  return 'ukmec-' + String(category);
}

function reviewClass(label) {
  if (!label) return '';
  return 'review-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.ukmec !== '' ||
    filters.review !== '' ||
    filters.method !== ''
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
      row.preferredMethod.toLowerCase().includes(term) ||
      row.currentMethod.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.ukmec && row.ukmecCategory !== parseInt(filters.ukmec, 10)) {
    return false;
  }
  if (filters.review && row.reviewStatus !== filters.review) {
    return false;
  }
  if (filters.method && row.preferredMethod !== filters.method) {
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

  if (key === 'ukmecCategory') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'reviewStatus') {
    av = reviewRank[av] ?? -1;
    bv = reviewRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, preferredMethod,
  // currentMethod)
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
    if (row.ukmecCategory === 4) {
      tr.classList.add('row-ukmec-4');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="ukmec-badge ${ukmecClass(row.ukmecCategory)}">Cat. ${esc(row.ukmecCategory)}</span></td>
      <td class="method-cell">${esc(row.preferredMethod)}</td>
      <td class="method-cell">${esc(row.currentMethod)}</td>
      <td><span class="review-badge ${reviewClass(row.reviewStatus)}">${esc(row.reviewStatus)}</span></td>
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
  const ukmec = document.getElementById('filter-ukmec');
  const review = document.getElementById('filter-review');
  const method = document.getElementById('filter-method');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (ukmec) {
    ukmec.addEventListener('change', () => {
      filters.ukmec = ukmec.value;
      renderAll();
    });
  }
  if (review) {
    review.addEventListener('change', () => {
      filters.review = review.value;
      renderAll();
    });
  }
  if (method) {
    method.addEventListener('change', () => {
      filters.method = method.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.ukmec = '';
      filters.review = '';
      filters.method = '';
      if (search) search.value = '';
      if (ukmec) ukmec.value = '';
      if (review) review.value = '';
      if (method) method.value = '';
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
