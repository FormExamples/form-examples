import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// MAT B1 - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the certificate list from the backend; on any failure
// (or empty response) we fall back to sample data and show a small banner.
// The rendered table is sortable (click any column header) and filterable
// (search box + certificate-type + issuer-type + duplicate dropdowns).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  certificateType: '', // '', 'pre', 'post'
  issuerType: '',      // '', 'doctor', 'midwife'
  duplicate: ''        // '', 'yes', 'no'
};

/** Sort state: which column key, ascending or descending. Default = newest first. */
const sortState = {
  key: 'issuedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'certificateNumber',         label: 'Certificate Number' },
  { key: 'patientName',               label: 'Patient Name' },
  { key: 'dateOfBirth',               label: 'DOB' },
  { key: 'certificateType',           label: 'Type' },
  { key: 'expectedDateOfConfinement', label: 'EWC' },
  { key: 'actualDateOfBirth',         label: 'Actual DOB' },
  { key: 'issuerType',                label: 'Issuer Type' },
  { key: 'issuerName',                label: 'Issuer Name' },
  { key: 'issuerNmcPin',              label: 'NMC PIN' },
  { key: 'isDuplicate',               label: 'Duplicate' },
  { key: 'highPriorityFlagCount',     label: 'Flags' },
  { key: 'issuedAt',                  label: 'Issued' }
];

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

function formatCertificateType(value) {
  if (value === 'pre') return 'Part A';
  if (value === 'post') return 'Part B';
  return '';
}

function formatIssuerType(value) {
  if (!value) return '';
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function formatIssuedAt(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function formatDate(value) {
  // ISO date strings (YYYY-MM-DD) display fine without conversion.
  return value || '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.certificateType !== '' ||
    filters.issuerType !== '' ||
    filters.duplicate !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      row.certificateNumber.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.certificateType && row.certificateType !== filters.certificateType) {
    return false;
  }
  if (filters.issuerType && row.issuerType !== filters.issuerType) {
    return false;
  }
  if (filters.duplicate === 'yes' && !row.isDuplicate) return false;
  if (filters.duplicate === 'no' && row.isDuplicate) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Booleans sort false<true,
 * numbers numerically, dates by epoch, everything else by locale-aware
 * string compare. Empty/null dates sort to the end on ascending.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'isDuplicate') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'highPriorityFlagCount') {
    return ((av || 0) - (bv || 0)) * dir;
  }

  if (
    key === 'issuedAt' ||
    key === 'dateOfBirth' ||
    key === 'expectedDateOfConfinement' ||
    key === 'actualDateOfBirth'
  ) {
    const at = av ? new Date(av).getTime() : 0;
    const bt = bv ? new Date(bv).getTime() : 0;
    if (!at && !bt) return 0;
    if (!at) return 1;
    if (!bt) return -1;
    return (at - bt) * dir;
  }

  // Default: string compare
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    if (row.isDuplicate) tr.classList.add('row-duplicate');
    if (row.highPriorityFlagCount > 0) tr.classList.add('row-flagged');

    const typeBadgeCls =
      row.certificateType === 'pre' ? 'type-pre' :
      row.certificateType === 'post' ? 'type-post' : '';

    const issuerBadgeCls =
      row.issuerType === 'doctor' ? 'issuer-doctor' :
      row.issuerType === 'midwife' ? 'issuer-midwife' : '';

    tr.innerHTML = `
      <td class="cell-mono">${esc(row.certificateNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(formatDate(row.dateOfBirth))}</td>
      <td><span class="type-badge ${typeBadgeCls}">${esc(formatCertificateType(row.certificateType))}</span></td>
      <td>${esc(formatDate(row.expectedDateOfConfinement))}</td>
      <td>${esc(formatDate(row.actualDateOfBirth || ''))}</td>
      <td><span class="issuer-badge ${issuerBadgeCls}">${esc(formatIssuerType(row.issuerType))}</span></td>
      <td>${esc(row.issuerName)}</td>
      <td class="cell-mono">${esc(row.issuerNmcPin)}</td>
      <td>${row.isDuplicate ? '<span class="duplicate-badge">DUPLICATE</span>' : ''}</td>
      <td class="cell-num">${row.highPriorityFlagCount > 0
        ? `<span class="flag-badge">${esc(String(row.highPriorityFlagCount))}</span>`
        : '<span class="flag-zero">0</span>'}</td>
      <td>${esc(formatIssuedAt(row.issuedAt))}</td>
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
    el.textContent = 'No certificates to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} certificates`;
  } else {
    el.textContent = `Showing ${shown} of ${total} certificates`;
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
  const certificateType = document.getElementById('filter-certificate-type');
  const issuerType = document.getElementById('filter-issuer-type');
  const duplicate = document.getElementById('filter-duplicate');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (certificateType) {
    certificateType.addEventListener('change', () => {
      filters.certificateType = certificateType.value;
      renderAll();
    });
  }
  if (issuerType) {
    issuerType.addEventListener('change', () => {
      filters.issuerType = issuerType.value;
      renderAll();
    });
  }
  if (duplicate) {
    duplicate.addEventListener('change', () => {
      filters.duplicate = duplicate.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.certificateType = '';
      filters.issuerType = '';
      filters.duplicate = '';
      if (search) search.value = '';
      if (certificateType) certificateType.value = '';
      if (issuerType) issuerType.value = '';
      if (duplicate) duplicate.value = '';
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
        'Showing sample data — backend returned no certificates.'
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
