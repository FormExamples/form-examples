// Substance Abuse Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + AUDIT-category dropdown + DAST-10-category dropdown +
// combined-severity dropdown + withdrawal-risk dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.SubstanceAbuseAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.SubstanceAbuseAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  audit: '',
  dast: '',
  severity: '',
  withdrawal: '' // '', 'yes', 'no'
};

// Default sort: combined severity descending. Highest severity = top of the
// list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'combinedSeverity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'auditScore',       label: 'AUDIT Score' },
  { key: 'auditCategory',    label: 'AUDIT Category' },
  { key: 'dastScore',        label: 'DAST-10 Score' },
  { key: 'dastCategory',     label: 'DAST-10 Category' },
  { key: 'combinedSeverity', label: 'Combined Severity' },
  { key: 'withdrawalRisk',   label: 'Withdrawal Risk' }
];

// Rank used when sorting the auditCategory column so 'Low Risk' is always
// less than 'Dependence Likely' regardless of locale.
const auditRank = {
  'Low Risk': 0,
  'Hazardous': 1,
  'Harmful': 2,
  'Dependence Likely': 3
};

// Rank used when sorting the dastCategory column.
const dastRank = {
  'No Problems': 0,
  'Low Level': 1,
  'Moderate Level': 2,
  'Substantial Level': 3,
  'Severe Level': 4
};

// Rank used when sorting the combinedSeverity column.
const severityRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2,
  'Critical': 3
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

function auditClass(label) {
  if (!label) return '';
  return 'audit-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function dastClass(label) {
  if (!label) return '';
  return 'dast-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.audit !== '' ||
    filters.dast !== '' ||
    filters.severity !== '' ||
    filters.withdrawal !== ''
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
  if (filters.audit && row.auditCategory !== filters.audit) {
    return false;
  }
  if (filters.dast && row.dastCategory !== filters.dast) {
    return false;
  }
  if (filters.severity && row.combinedSeverity !== filters.severity) {
    return false;
  }
  if (filters.withdrawal === 'yes' && !row.withdrawalRisk) return false;
  if (filters.withdrawal === 'no' && row.withdrawalRisk) return false;
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

  if (key === 'auditCategory') {
    av = auditRank[av] ?? -1;
    bv = auditRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'dastCategory') {
    av = dastRank[av] ?? -1;
    bv = dastRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'combinedSeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'withdrawalRisk') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'auditScore' || key === 'dastScore') {
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
    if (row.combinedSeverity === 'Critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="audit-score">${esc(row.auditScore)}/40</span></td>
      <td><span class="audit-badge ${auditClass(row.auditCategory)}">${esc(row.auditCategory)}</span></td>
      <td><span class="dast-score">${esc(row.dastScore)}/10</span></td>
      <td><span class="dast-badge ${dastClass(row.dastCategory)}">${esc(row.dastCategory)}</span></td>
      <td><span class="severity-badge ${severityClass(row.combinedSeverity)}">${esc(row.combinedSeverity)}</span></td>
      <td>
        <span class="withdrawal-badge ${row.withdrawalRisk ? 'withdrawal-yes' : 'withdrawal-no'}">
          ${row.withdrawalRisk ? 'Yes' : 'No'}
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
  const audit = document.getElementById('filter-audit');
  const dast = document.getElementById('filter-dast');
  const severity = document.getElementById('filter-severity');
  const withdrawal = document.getElementById('filter-withdrawal');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (audit) {
    audit.addEventListener('change', () => {
      filters.audit = audit.value;
      renderAll();
    });
  }
  if (dast) {
    dast.addEventListener('change', () => {
      filters.dast = dast.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (withdrawal) {
    withdrawal.addEventListener('change', () => {
      filters.withdrawal = withdrawal.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.audit = '';
      filters.dast = '';
      filters.severity = '';
      filters.withdrawal = '';
      if (search) search.value = '';
      if (audit) audit.value = '';
      if (dast) dast.value = '';
      if (severity) severity.value = '';
      if (withdrawal) withdrawal.value = '';
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
})();
