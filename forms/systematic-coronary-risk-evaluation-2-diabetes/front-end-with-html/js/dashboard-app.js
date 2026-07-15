import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// SCORE2-Diabetes - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-category dropdown + status dropdown + CVD-history
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.SystematicCoronaryRiskEvaluation2DiabetesDashboard`. Pulling them
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
  risk: '',
  status: '',
  cvd: '' // '', 'true', 'false'
};

// Default sort: most-recent submission first. Mirrors the SvelteKit
// dashboard's initial sort (`submittedDate desc`) so newly submitted
// assessments surface at the top of the list.
const sortState = {
  key: 'submittedDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'riskCategory',      label: 'Risk Category' },
  { key: 'hba1cMmolMol',      label: 'HbA1c (mmol/mol)' },
  { key: 'systolicBp',        label: 'Systolic BP' },
  { key: 'hasEstablishedCvd', label: 'Has CVD' },
  { key: 'flagCount',         label: 'Flags' },
  { key: 'status',            label: 'Status' },
  { key: 'submittedDate',     label: 'Submitted' }
];

// Rank used when sorting the riskCategory column so 'low' is always less
// than 'veryHigh' regardless of locale.
const riskRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'veryHigh': 3
};

// Rank used when sorting the status column.
const statusRank = {
  'reviewed': 0,
  'pending': 1,
  'urgent': 2
};

// Display labels for risk categories (riskRank keys are short identifiers).
const riskLabel = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'veryHigh': 'Very High'
};

// Display labels for statuses.
const statusLabel = {
  'pending': 'Pending',
  'reviewed': 'Reviewed',
  'urgent': 'Urgent'
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

function riskClass(value) {
  if (!value) return '';
  // 'veryHigh' -> 'risk-very-high'; 'low' -> 'risk-low'
  const dashed = String(value).replace(/([A-Z])/g, '-$1').toLowerCase();
  return 'risk-' + dashed;
}

function statusClass(value) {
  if (!value) return '';
  return 'status-' + String(value).toLowerCase();
}

/** Highlight HbA1c above NICE control target (>=58 mmol/mol). */
function hba1cClass(v) {
  if (v == null) return '';
  if (v >= 75) return 'numeric-high';
  if (v >= 58) return 'numeric-elevated';
  return '';
}

/** Highlight elevated systolic BP. */
function bpClass(v) {
  if (v == null) return '';
  if (v >= 160) return 'numeric-high';
  if (v >= 140) return 'numeric-elevated';
  return '';
}

function flagCountClass(n) {
  if (!n || n === 0) return 'flag-count-zero';
  if (n >= 4) return 'flag-count-high';
  return 'flag-count-low';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.status !== '' ||
    filters.cvd !== ''
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
  if (filters.risk && row.riskCategory !== filters.risk) {
    return false;
  }
  if (filters.status && row.status !== filters.status) {
    return false;
  }
  if (filters.cvd === 'true' && !row.hasEstablishedCvd) return false;
  if (filters.cvd === 'false' && row.hasEstablishedCvd) return false;
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

  if (key === 'riskCategory') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hasEstablishedCvd') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'hba1cMmolMol' || key === 'systolicBp' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, submittedDate).
  // ISO-8601 dates sort lexicographically so this also gives correct
  // chronological ordering for `submittedDate`.
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
    if (row.status === 'urgent') {
      tr.classList.add('row-urgent');
    } else if (row.riskCategory === 'veryHigh') {
      tr.classList.add('row-very-high');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td"><span class="risk-badge ${riskClass(row.riskCategory)}">${esc(riskLabel[row.riskCategory] || row.riskCategory)}</span></td>
      <td class="data-table-td"><span class="numeric-cell ${hba1cClass(row.hba1cMmolMol)}">${esc(row.hba1cMmolMol)}</span></td>
      <td class="data-table-td"><span class="numeric-cell ${bpClass(row.systolicBp)}">${esc(row.systolicBp)}</span></td>
      <td class="data-table-td">
        <span class="cvd-badge ${row.hasEstablishedCvd ? 'cvd-yes' : 'cvd-no'}">
          ${row.hasEstablishedCvd ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td"><span class="flag-count ${flagCountClass(row.flagCount)}">${esc(row.flagCount)}</span></td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.status)}">${esc(statusLabel[row.status] || row.status)}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.submittedDate)}</span></td>
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
  const risk = document.getElementById('filter-risk');
  const status = document.getElementById('filter-status');
  const cvd = document.getElementById('filter-cvd');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (cvd) {
    cvd.addEventListener('change', () => {
      filters.cvd = cvd.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.status = '';
      filters.cvd = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (status) status.value = '';
      if (cvd) cvd.value = '';
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
