import { fetchPrescriptions } from './api.js';
import { samplePrescriptions } from './data.js';

// Prescription Request - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the prescription-request list from the backend; on any
// failure (or empty response) we fall back to sample data and show a small
// banner. The rendered table is sortable (click any column header) and
// filterable (search box + priority dropdown + request-type dropdown +
// status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PrescriptionRequestDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PrescriptionRow[]} */
let prescriptions = [];

const filters = {
  search: '',
  priority: '',
  type: '',
  status: ''
};

// Default sort: requestDate descending. Most recent requests bubble to the
// top of the list — matches the Svelte dashboard's initial ordering.
const sortState = {
  key: 'requestDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',      label: 'NHS Number' },
  { key: 'patientName',    label: 'Patient' },
  { key: 'clinicianName',  label: 'Clinician' },
  { key: 'medicationName', label: 'Medication' },
  { key: 'dosage',         label: 'Dosage' },
  { key: 'requestType',    label: 'Type' },
  { key: 'priorityLevel',  label: 'Priority' },
  { key: 'requestDate',    label: 'Date' },
  { key: 'status',         label: 'Status' }
];

// Rank used when sorting the priorityLevel column so 'routine' is always
// less than 'emergency' regardless of locale.
const priorityRank = {
  'routine': 0,
  'urgent': 1,
  'emergency': 2
};

// Rank used when sorting the status column to follow the workflow order.
const statusRank = {
  'submitted': 0,
  'reviewed': 1,
  'approved': 2
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

/** Capitalise the first character; used to display priority/status labels. */
function capitalise(s) {
  if (!s) return '';
  return String(s).charAt(0).toUpperCase() + String(s).slice(1);
}

function priorityClass(label) {
  if (!label) return '';
  return 'priority-' + String(label).toLowerCase();
}

function typeClass(label) {
  if (!label) return '';
  return 'type-' + String(label).toLowerCase();
}

function statusClass(label) {
  if (!label) return '';
  return 'status-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.priority !== '' ||
    filters.type !== '' ||
    filters.status !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PrescriptionRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientName.toLowerCase().includes(term) ||
      row.medicationName.toLowerCase().includes(term) ||
      row.nhsNumber.toLowerCase().includes(term) ||
      row.clinicianName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.priority && row.priorityLevel !== filters.priority) {
    return false;
  }
  if (filters.type && row.requestType !== filters.type) {
    return false;
  }
  if (filters.status && row.status !== filters.status) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; ISO dates compare lexicographically (which matches
 * chronological order); everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'priorityLevel') {
    av = priorityRank[av] ?? -1;
    bv = priorityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, clinicianName,
  // medicationName, dosage, requestType, requestDate). ISO YYYY-MM-DD
  // dates sort correctly under a string comparator.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return prescriptions.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('prescriptions-table-head');
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
  const body = document.getElementById('prescriptions-table-body');
  const empty = document.getElementById('prescriptions-empty-message');
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
    if (row.priorityLevel === 'emergency') {
      tr.classList.add('row-emergency');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td">${esc(row.clinicianName)}</td>
      <td class="data-table-td">${esc(row.medicationName)}</td>
      <td class="data-table-td"><span class="dosage">${esc(row.dosage)}</span></td>
      <td class="data-table-td"><span class="type-badge ${typeClass(row.requestType)}">${esc(row.requestType)}</span></td>
      <td class="data-table-td"><span class="priority-badge ${priorityClass(row.priorityLevel)}">${esc(capitalise(row.priorityLevel))}</span></td>
      <td class="data-table-td"><span class="request-date">${esc(row.requestDate)}</span></td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.status)}">${esc(capitalise(row.status))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = prescriptions.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No prescription requests to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} prescription requests`;
  } else {
    el.textContent = `Showing ${shown} of ${total} prescription requests`;
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
  const priority = document.getElementById('filter-priority');
  const type = document.getElementById('filter-type');
  const status = document.getElementById('filter-status');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (priority) {
    priority.addEventListener('change', () => {
      filters.priority = priority.value;
      renderAll();
    });
  }
  if (type) {
    type.addEventListener('change', () => {
      filters.type = type.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.priority = '';
      filters.type = '';
      filters.status = '';
      if (search) search.value = '';
      if (priority) priority.value = '';
      if (type) type.value = '';
      if (status) status.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPrescriptions() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  prescriptions = samplePrescriptions;
  renderAll();

  try {
    const items = await fetchPrescriptions();
    if (items && items.length > 0) {
      prescriptions = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no prescription requests.'
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
  loadPrescriptions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
