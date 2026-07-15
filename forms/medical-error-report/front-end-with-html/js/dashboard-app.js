import { fetchIncidents } from './api.js';
import { sampleIncidents } from './data.js';

// Medical Error Report - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the incident list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + WHO severity dropdown + NCC MERP dropdown + reported
// dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').IncidentRow[]} */
let incidents = [];

const filters = {
  search: '',
  severity: '',
  merp: '',
  reported: '' // '', 'yes', 'no'
};

// Default sort: WHO severity descending so the most-harmful incidents
// surface at the top of the list, then by incident date descending so
// recent events come first within a severity band.
const sortState = {
  key: 'whoSeverity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'incidentId',    label: 'Incident ID' },
  { key: 'incidentDate',  label: 'Date' },
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'whoSeverity',   label: 'WHO Severity' },
  { key: 'merpCategory',  label: 'NCC MERP' },
  { key: 'errorType',     label: 'Error Type' },
  { key: 'reportedFlag',  label: 'Reported' }
];

// Rank used when sorting the whoSeverity column so 'Near Miss' < 'Critical'
// regardless of locale.
const severityRank = {
  'Near Miss': 0,
  'Mild': 1,
  'Moderate': 2,
  'Severe': 3,
  'Critical': 4
};

// Rank used when sorting the merpCategory column. NCC MERP is alphabetic
// A-I, but we keep an explicit table so future re-orderings stay safe.
const merpRank = {
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8
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
  return 'severity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function merpClass(category) {
  if (!category) return '';
  return 'merp-' + String(category).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.merp !== '' ||
    filters.reported !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').IncidentRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.incidentId.toLowerCase().includes(term) ||
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.severity && row.whoSeverity !== filters.severity) {
    return false;
  }
  if (filters.merp && row.merpCategory !== filters.merp) {
    return false;
  }
  if (filters.reported === 'yes' && !row.reportedFlag) return false;
  if (filters.reported === 'no' && row.reportedFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; everything else uses a
 * locale-aware string compare (which also handles ISO dates correctly).
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'whoSeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'merpCategory') {
    av = merpRank[av] ?? -1;
    bv = merpRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reportedFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (incidentId, incidentDate, nhsNumber,
  // patientName, errorType). ISO "YYYY-MM-DD" sorts correctly as a string.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return incidents.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('incidents-table-head');
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
  const body = document.getElementById('incidents-table-body');
  const empty = document.getElementById('incidents-empty-message');
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
    if (row.whoSeverity === 'Critical') {
      tr.classList.add('row-critical');
    } else if (row.whoSeverity === 'Severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td class="data-table-td"><span class="incident-id">${esc(row.incidentId)}</span></td>
      <td class="data-table-td"><span class="incident-date">${esc(row.incidentDate)}</span></td>
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td"><span class="severity-badge ${severityClass(row.whoSeverity)}">${esc(row.whoSeverity)}</span></td>
      <td class="data-table-td"><span class="merp-badge ${merpClass(row.merpCategory)}">${esc(row.merpCategory)}</span></td>
      <td class="data-table-td">${esc(row.errorType)}</td>
      <td class="data-table-td">
        <span class="reported-badge ${row.reportedFlag ? 'reported-yes' : 'reported-no'}">
          ${row.reportedFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = incidents.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No incidents to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} incidents`;
  } else {
    el.textContent = `Showing ${shown} of ${total} incidents`;
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
  const merp = document.getElementById('filter-merp');
  const reported = document.getElementById('filter-reported');
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
  if (merp) {
    merp.addEventListener('change', () => {
      filters.merp = merp.value;
      renderAll();
    });
  }
  if (reported) {
    reported.addEventListener('change', () => {
      filters.reported = reported.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.merp = '';
      filters.reported = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (merp) merp.value = '';
      if (reported) reported.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadIncidents() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  incidents = sampleIncidents;
  renderAll();

  try {
    const items = await fetchIncidents();
    if (items && items.length > 0) {
      incidents = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no incidents.'
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
  loadIncidents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
