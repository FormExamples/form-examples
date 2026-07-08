// Bone Marrow Donation Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the donor list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + eligibility dropdown + risk-level dropdown + HLA-match
// dropdown + collection-method dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.BoneMarrowDonationAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.BoneMarrowDonationAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  eligibility: '',
  risk: '',
  hla: '',
  method: ''
};

// Default sort: risk level descending. Critical donors surface at the top,
// drawing clinical attention to those with safety concerns.
const sortState = {
  key: 'riskLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Donor Name' },
  { key: 'hlaMatch',         label: 'HLA Match' },
  { key: 'eligibility',      label: 'Eligibility' },
  { key: 'riskLevel',        label: 'Risk Level' },
  { key: 'collectionMethod', label: 'Collection Method' }
];

// Rank used when sorting the eligibility column so 'Suitable' is always
// less than 'Unsuitable' regardless of locale.
const eligibilityRank = {
  'Suitable': 0,
  'Conditionally Suitable': 1,
  'Unsuitable': 2
};

// Rank used when sorting the riskLevel column.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2,
  'Critical': 3
};

// Rank used when sorting the hlaMatch column. Best match (10/10) sorts
// first when ascending; '<7/10' sorts last.
const hlaRank = {
  '10/10': 0,
  '9/10': 1,
  '8/10': 2,
  '7/10': 3,
  '<7/10': 4
};

// Rank used when sorting the collectionMethod column.
const methodRank = {
  'PBSC': 0,
  'Marrow': 1,
  'Either': 2,
  'Neither': 3
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

function eligibilityClass(label) {
  if (!label) return '';
  return 'eligibility-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function methodClass(label) {
  if (!label) return '';
  return 'method-' + String(label).toLowerCase();
}

/** CSS class for an HLA match grade. */
function hlaClass(label) {
  switch (label) {
    case '10/10': return 'hla-10-10';
    case '9/10':  return 'hla-9-10';
    case '8/10':  return 'hla-8-10';
    case '7/10':  return 'hla-7-10';
    case '<7/10': return 'hla-low';
    default:      return '';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.eligibility !== '' ||
    filters.risk !== '' ||
    filters.hla !== '' ||
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.eligibility && row.eligibility !== filters.eligibility) {
    return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.hla && row.hlaMatch !== filters.hla) {
    return false;
  }
  if (filters.method && row.collectionMethod !== filters.method) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'eligibility') {
    av = eligibilityRank[av] ?? -1;
    bv = eligibilityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hlaMatch') {
    av = hlaRank[av] ?? -1;
    bv = hlaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'collectionMethod') {
    av = methodRank[av] ?? -1;
    bv = methodRank[bv] ?? -1;
    return (av - bv) * dir;
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
    if (row.riskLevel === 'Critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="hla-badge ${hlaClass(row.hlaMatch)}">${esc(row.hlaMatch)}</span></td>
      <td><span class="eligibility-badge ${eligibilityClass(row.eligibility)}">${esc(row.eligibility)}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td><span class="method-badge ${methodClass(row.collectionMethod)}">${esc(row.collectionMethod)}</span></td>
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
    el.textContent = 'No donors to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} donors`;
  } else {
    el.textContent = `Showing ${shown} of ${total} donors`;
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
  const eligibility = document.getElementById('filter-eligibility');
  const risk = document.getElementById('filter-risk');
  const hla = document.getElementById('filter-hla');
  const method = document.getElementById('filter-method');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (eligibility) {
    eligibility.addEventListener('change', () => {
      filters.eligibility = eligibility.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (hla) {
    hla.addEventListener('change', () => {
      filters.hla = hla.value;
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
      filters.eligibility = '';
      filters.risk = '';
      filters.hla = '';
      filters.method = '';
      if (search) search.value = '';
      if (eligibility) eligibility.value = '';
      if (risk) risk.value = '';
      if (hla) hla.value = '';
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
        'Showing sample data — backend returned no donors.'
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
