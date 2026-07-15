import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Advance Statement About Care - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + completeness-level dropdown + witnessed dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  completeness: '',
  witnessed: '' // '', 'yes', 'no'
};

// Default sort: patient name ascending. Matches the SvelteKit dashboard's
// initial `sort-rows` call and gives the clinician a predictable first view.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'completenessLevel', label: 'Completeness' },
  { key: 'reviewDate',        label: 'Review Date' },
  { key: 'witnessed',         label: 'Witnessed' },
  { key: 'lastUpdated',       label: 'Last Updated' }
];

// Rank used when sorting the completenessLevel column so 'incomplete' is
// always less than 'verified' regardless of locale.
const completenessRank = {
  incomplete: 0,
  partial: 1,
  complete: 2,
  verified: 3
};

// Human-readable labels for the completeness column. Keep in sync with the
// dropdown <option>s and the SvelteKit `completenessLabel` helper.
const completenessLabels = {
  incomplete: 'Incomplete',
  partial: 'Partial',
  complete: 'Complete',
  verified: 'Verified'
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

function completenessClass(level) {
  if (!level) return '';
  return 'completeness-' + String(level).toLowerCase();
}

function completenessLabel(level) {
  return completenessLabels[level] || String(level || '');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.completeness !== '' ||
    filters.witnessed !== ''
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
  if (filters.completeness && row.completenessLevel !== filters.completeness) {
    return false;
  }
  if (filters.witnessed === 'yes' && !row.witnessed) return false;
  if (filters.witnessed === 'no' && row.witnessed) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; date strings (ISO
 * "YYYY-MM-DD") compare lexicographically with empty strings sinking to
 * the bottom; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'completenessLevel') {
    av = completenessRank[av] ?? -1;
    bv = completenessRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'witnessed') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'reviewDate' || key === 'lastUpdated') {
    // Empty review dates sink to the end regardless of sort direction so
    // they never push real dates out of view.
    const aEmpty = !av;
    const bEmpty = !bv;
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    return String(av).localeCompare(String(bv)) * dir;
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
    if (row.completenessLevel === 'incomplete') {
      tr.classList.add('row-incomplete');
    }

    const reviewCell = row.reviewDate
      ? `<td><span class="date-cell">${esc(row.reviewDate)}</span></td>`
      : `<td><span class="date-cell date-empty">Not set</span></td>`;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="completeness-badge ${completenessClass(row.completenessLevel)}">${esc(completenessLabel(row.completenessLevel))}</span></td>
      ${reviewCell}
      <td>
        <span class="witnessed-badge ${row.witnessed ? 'witnessed-yes' : 'witnessed-no'}">
          ${row.witnessed ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="date-cell">${esc(row.lastUpdated)}</span></td>
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
  const completeness = document.getElementById('filter-completeness');
  const witnessed = document.getElementById('filter-witnessed');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (completeness) {
    completeness.addEventListener('change', () => {
      filters.completeness = completeness.value;
      renderAll();
    });
  }
  if (witnessed) {
    witnessed.addEventListener('change', () => {
      filters.witnessed = witnessed.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.completeness = '';
      filters.witnessed = '';
      if (search) search.value = '';
      if (completeness) completeness.value = '';
      if (witnessed) witnessed.value = '';
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
