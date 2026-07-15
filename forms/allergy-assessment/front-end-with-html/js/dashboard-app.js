import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Allergy Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity dropdown + status dropdown + allergy-type dropdown
// + anaphylaxis dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AllergyAssessmentDashboard`. Pulling them
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
  severity: '',
  status: '',
  allergyType: '',
  anaphylaxis: '' // '', 'yes', 'no'
};

// Default sort: most recently submitted first. This matches the SvelteKit
// dashboard's `init` callback that calls
// api.exec('sort-rows', { key: 'submittedDate', order: 'desc' }).
const sortState = {
  key: 'submittedDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'severityLevel',      label: 'Severity' },
  { key: 'allergenCount',      label: 'Allergens' },
  { key: 'primaryAllergyType', label: 'Primary Type' },
  { key: 'hasAnaphylaxis',     label: 'Anaphylaxis' },
  { key: 'burdenScore',        label: 'Burden' },
  { key: 'flagCount',          label: 'Flags' },
  { key: 'status',             label: 'Status' },
  { key: 'submittedDate',      label: 'Submitted' }
];

// Rank used when sorting the severityLevel column so 'mild' is always less
// than 'severe' regardless of locale-aware string ordering.
const severityRank = {
  mild: 0,
  moderate: 1,
  severe: 2
};

// Rank used when sorting the status column. Lower = earlier in workflow.
const statusRank = {
  pending: 0,
  reviewed: 1,
  urgent: 2
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

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase();
}

function statusClass(label) {
  if (!label) return '';
  return 'status-' + String(label).toLowerCase();
}

function allergyTypeClass(label) {
  if (!label) return '';
  return 'allergy-type-' + String(label).toLowerCase();
}

function flagCountClass(count) {
  if (!count || count === 0) return 'flag-count-zero';
  if (count >= 3) return 'flag-count-high';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.status !== '' ||
    filters.allergyType !== '' ||
    filters.anaphylaxis !== ''
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
  if (filters.severity && row.severityLevel !== filters.severity) {
    return false;
  }
  if (filters.status && row.status !== filters.status) {
    return false;
  }
  if (filters.allergyType && row.primaryAllergyType !== filters.allergyType) {
    return false;
  }
  if (filters.anaphylaxis === 'yes' && !row.hasAnaphylaxis) return false;
  if (filters.anaphylaxis === 'no' && row.hasAnaphylaxis) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare. ISO yyyy-mm-dd date
 * strings sort correctly under string compare so submittedDate uses the
 * default branch.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'severityLevel') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hasAnaphylaxis') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'allergenCount' || key === 'burdenScore' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryAllergyType,
  // submittedDate). ISO dates sort correctly lexicographically.
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
    if (row.hasAnaphylaxis) {
      tr.classList.add('row-anaphylaxis');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="severity-badge ${severityClass(row.severityLevel)}">${esc(row.severityLevel)}</span></td>
      <td><span class="num-cell">${esc(row.allergenCount)}</span></td>
      <td><span class="allergy-type-badge ${allergyTypeClass(row.primaryAllergyType)}">${esc(row.primaryAllergyType)}</span></td>
      <td>
        <span class="anaphylaxis-badge ${row.hasAnaphylaxis ? 'anaphylaxis-yes' : 'anaphylaxis-no'}">
          ${row.hasAnaphylaxis ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="num-cell">${esc(row.burdenScore)}</span></td>
      <td><span class="flag-count ${flagCountClass(row.flagCount)}">${esc(row.flagCount)}</span></td>
      <td><span class="status-badge ${statusClass(row.status)}">${esc(row.status)}</span></td>
      <td>${esc(row.submittedDate)}</td>
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
  const severity = document.getElementById('filter-severity');
  const status = document.getElementById('filter-status');
  const allergyType = document.getElementById('filter-allergy-type');
  const anaphylaxis = document.getElementById('filter-anaphylaxis');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (allergyType) {
    allergyType.addEventListener('change', () => {
      filters.allergyType = allergyType.value;
      renderAll();
    });
  }
  if (anaphylaxis) {
    anaphylaxis.addEventListener('change', () => {
      filters.anaphylaxis = anaphylaxis.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.status = '';
      filters.allergyType = '';
      filters.anaphylaxis = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (status) status.value = '';
      if (allergyType) allergyType.value = '';
      if (anaphylaxis) anaphylaxis.value = '';
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
