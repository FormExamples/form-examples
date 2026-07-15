import { fetchReconciliations } from './api.js';
import { sampleReconciliations } from './data.js';

// Medication Reconciliation — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the reconciliation list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + reconciliation-type dropdown + care-setting dropdown + status dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReconciliationRow[]} */
let reconciliations = [];

const filters = {
  search: '',
  type: '',      // '' | reconciliation-type
  setting: '',   // '' | care-setting
  status: ''     // '' | 'complete' | 'discrepancies-outstanding' | 'incomplete'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'reconciliationType',  label: 'Type' },
  { key: 'careSetting',         label: 'Setting' },
  { key: 'sourceCount',         label: 'Sources' },
  { key: 'discrepancyCount',    label: 'Discrepancies' },
  { key: 'unintentionalCount',  label: 'Unintentional' },
  { key: 'status',              label: 'Status' }
];

// Rank used when sorting the status column.
const statusRank = {
  'complete': 0,
  'discrepancies-outstanding': 1,
  'incomplete': 2
};

const typeLabels = {
  'admission': 'Admission',
  'transfer': 'Transfer',
  'discharge': 'Discharge'
};

const settingLabels = {
  'emergency-department': 'Emergency dept',
  'acute-medical-unit': 'Acute medical unit',
  'surgical-admissions': 'Surgical admissions',
  'ward': 'Ward',
  'critical-care': 'Critical care',
  'other': 'Other'
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

function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'discrepancies-outstanding': return 'risk-high';
    case 'incomplete': return 'risk-moderate';
    default: return '';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'discrepancies-outstanding': return 'Discrepancies outstanding';
    case 'incomplete': return 'Incomplete';
    default: return 'N/A';
  }
}

function typeLabel(type) {
  return typeLabels[type] || type || 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.type !== '' ||
    filters.setting !== '' ||
    filters.status !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ReconciliationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.type && row.reconciliationType !== filters.type) return false;
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.status && row.status !== filters.status) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The status column uses its rank
 * table; the numeric columns sort numerically; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'sourceCount' || key === 'discrepancyCount' || key === 'unintentionalCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return reconciliations.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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
    if (row.status === 'discrepancies-outstanding' || row.unintentionalCount > 0) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(typeLabel(row.reconciliationType))}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="class-cell">${esc(String(row.sourceCount))}</span></td>
      <td><span class="class-cell">${esc(String(row.discrepancyCount))}</span></td>
      <td><span class="class-cell">${esc(String(row.unintentionalCount))}</span></td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = reconciliations.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No reconciliations to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} reconciliations`;
  } else {
    el.textContent = `Showing ${shown} of ${total} reconciliations`;
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
  const type = document.getElementById('filter-type');
  const setting = document.getElementById('filter-setting');
  const status = document.getElementById('filter-status');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (type) {
    type.addEventListener('change', () => {
      filters.type = type.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
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
      filters.type = '';
      filters.setting = '';
      filters.status = '';
      if (search) search.value = '';
      if (type) type.value = '';
      if (setting) setting.value = '';
      if (status) status.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReconciliations() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  reconciliations = sampleReconciliations;
  renderAll();

  try {
    const items = await fetchReconciliations();
    if (items && items.length > 0) {
      reconciliations = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no reconciliations.'
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
  loadReconciliations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
