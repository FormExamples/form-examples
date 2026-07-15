import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Provider Transfer Request - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the transfer-request list from the backend; on any
// failure (or empty response) we fall back to sample data and show a small
// banner. The rendered table is sortable (click any column header) and
// filterable (search box + completeness dropdown + urgency dropdown +
// acknowledged dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  completeness: '',
  urgency: '',
  acknowledged: '' // '', 'yes', 'no'
};

// Default sort: urgency descending so Emergency requests bubble to the top
// of the list, surfacing the transfers that most need clinical attention.
const sortState = {
  key: 'urgency',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'requestingProvider', label: 'Requesting Provider' },
  { key: 'receivingProvider',  label: 'Receiving Provider' },
  { key: 'urgency',            label: 'Urgency' },
  { key: 'completeness',       label: 'Completeness' },
  { key: 'acknowledged',       label: 'Acknowledged' }
];

// Rank used when sorting the completeness column so 'Complete' is always
// less than 'Incomplete' regardless of locale.
const completenessRank = {
  'Complete': 0,
  'Partial': 1,
  'Incomplete': 2
};

// Rank used when sorting the urgency column.
const urgencyRank = {
  'Routine': 0,
  'Urgent': 1,
  'Emergency': 2
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

function completenessClass(label) {
  if (!label) return '';
  return 'completeness-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function urgencyClass(label) {
  if (!label) return '';
  return 'urgency-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.completeness !== '' ||
    filters.urgency !== '' ||
    filters.acknowledged !== ''
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
      row.requestingProvider.toLowerCase().includes(term) ||
      row.receivingProvider.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.completeness && row.completeness !== filters.completeness) {
    return false;
  }
  if (filters.urgency && row.urgency !== filters.urgency) {
    return false;
  }
  if (filters.acknowledged === 'yes' && !row.acknowledged) return false;
  if (filters.acknowledged === 'no' && row.acknowledged) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'completeness') {
    av = completenessRank[av] ?? -1;
    bv = completenessRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'urgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'acknowledged') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, providers)
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
  head.classList.add('data-table-row');

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
    if (row.completeness === 'Incomplete') {
      tr.classList.add('row-incomplete');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.requestingProvider)}</td>
      <td class="data-table-td">${esc(row.receivingProvider)}</td>
      <td class="data-table-td"><span class="urgency-badge ${urgencyClass(row.urgency)}">${esc(row.urgency)}</span></td>
      <td class="data-table-td"><span class="completeness-badge ${completenessClass(row.completeness)}">${esc(row.completeness)}</span></td>
      <td class="data-table-td">
        <span class="acknowledged-badge ${row.acknowledged ? 'acknowledged-yes' : 'acknowledged-no'}">
          ${row.acknowledged ? 'Yes' : 'No'}
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
    el.textContent = 'No transfers to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} transfers`;
  } else {
    el.textContent = `Showing ${shown} of ${total} transfers`;
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
  const urgency = document.getElementById('filter-urgency');
  const acknowledged = document.getElementById('filter-acknowledged');
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
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (acknowledged) {
    acknowledged.addEventListener('change', () => {
      filters.acknowledged = acknowledged.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.completeness = '';
      filters.urgency = '';
      filters.acknowledged = '';
      if (search) search.value = '';
      if (completeness) completeness.value = '';
      if (urgency) urgency.value = '';
      if (acknowledged) acknowledged.value = '';
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
        'Showing sample data — backend returned no transfers.'
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
