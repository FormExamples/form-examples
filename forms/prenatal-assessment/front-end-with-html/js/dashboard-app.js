import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Prenatal Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + trimester dropdown + referral
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PrenatalAssessmentDashboard`. Pulling them
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
  trimester: '',  // '', '1', '2', '3'
  referral: ''    // '', 'None', 'referred'
};

// Default sort: patient name ascending — matches the SvelteKit dashboard
// (`api.exec('sort-rows', { key: 'patientName', order: 'asc' })`).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'riskLevel',        label: 'Risk Level' },
  { key: 'gestationalWeeks', label: 'Gestational Age' },
  { key: 'primaryConcern',   label: 'Primary Concern' },
  { key: 'referralStatus',   label: 'Referral Status' }
];

// Rank used when sorting the riskLevel column so 'low' is always less than
// 'very-high' regardless of locale.
const riskRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'very-high': 3
};

const riskLabel = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'very-high': 'Very High'
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

function riskClass(level) {
  if (!level) return '';
  return 'risk-' + String(level).toLowerCase();
}

/** Map gestational age in weeks to trimester slug ('1' | '2' | '3'). */
function trimesterForWeeks(weeks) {
  const w = Number(weeks);
  if (!Number.isFinite(w)) return '';
  if (w < 14) return '1';
  if (w < 28) return '2';
  return '3';
}

function trimesterLabel(weeks) {
  const t = trimesterForWeeks(weeks);
  if (t === '1') return '1st';
  if (t === '2') return '2nd';
  if (t === '3') return '3rd';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.trimester !== '' ||
    filters.referral !== ''
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
      String(row.primaryConcern || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.trimester &&
      trimesterForWeeks(row.gestationalWeeks) !== filters.trimester) {
    return false;
  }
  // Referral filter: 'None' = no referral; 'referred' = anything but 'None'.
  if (filters.referral === 'None' && row.referralStatus !== 'None') {
    return false;
  }
  if (filters.referral === 'referred' && row.referralStatus === 'None') {
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

  if (key === 'gestationalWeeks') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryConcern,
  // referralStatus).
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
    if (row.riskLevel === 'very-high') {
      tr.classList.add('row-very-high');
    }

    const referredClass =
      row.referralStatus === 'None' ? 'referral-none' : 'referral-yes';

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(riskLabel[row.riskLevel] || row.riskLevel)}</span></td>
      <td>
        <span class="gestational-weeks">${esc(row.gestationalWeeks)} weeks</span>
        <span class="trimester-label">(${esc(trimesterLabel(row.gestationalWeeks))})</span>
      </td>
      <td>${esc(row.primaryConcern)}</td>
      <td>
        <span class="referral-badge ${referredClass}">
          ${esc(row.referralStatus)}
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
  const risk = document.getElementById('filter-risk');
  const trimester = document.getElementById('filter-trimester');
  const referral = document.getElementById('filter-referral');
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
  if (trimester) {
    trimester.addEventListener('change', () => {
      filters.trimester = trimester.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.trimester = '';
      filters.referral = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (trimester) trimester.value = '';
      if (referral) referral.value = '';
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
