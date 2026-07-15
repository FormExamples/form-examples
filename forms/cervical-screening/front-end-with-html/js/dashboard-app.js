import { fetchScreenings } from './api.js';
import { sampleScreenings } from './data.js';

// Cervical Screening — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the screening list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + result-class dropdown + management dropdown +
// urgent dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.CervicalScreeningDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
let screenings = [];

const filters = {
  search: '',
  setting: '',   // '' | 'general-practice' | 'sexual-health' | 'other'
  result: '',    // '' | resultClass value
  management: '',// '' | managementAction value
  urgent: ''     // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'careSetting',       label: 'Setting' },
  { key: 'resultClass',       label: 'Result' },
  { key: 'managementAction',  label: 'Management' },
  { key: 'urgentFlag',        label: 'Urgent' }
];

// Rank used when sorting the result column, ordered low-to-high clinical
// severity so the most urgent results cluster together regardless of locale.
const resultRank = {
  'hpv-negative': 0,
  'cease-not-eligible': 1,
  'pending': 2,
  'inadequate': 3,
  'hpv-positive-cytology-pending': 4,
  'hpv-positive-cytology-normal': 5,
  'hpv-positive-cytology-abnormal-low': 6,
  'hpv-positive-cytology-abnormal-high': 7
};

const settingLabels = {
  'general-practice': 'General practice',
  'sexual-health': 'Sexual health',
  'other': 'Other'
};

const resultLabels = {
  'inadequate': 'Inadequate',
  'hpv-negative': 'HPV negative',
  'hpv-positive-cytology-normal': 'HPV+ cytology normal',
  'hpv-positive-cytology-abnormal-low': 'HPV+ abnormal (low)',
  'hpv-positive-cytology-abnormal-high': 'HPV+ abnormal (high)',
  'hpv-positive-cytology-pending': 'HPV+ cytology pending',
  'cease-not-eligible': 'Cease / not eligible',
  'pending': 'Pending'
};

const managementLabels = {
  'routine-recall': 'Routine recall',
  'early-repeat-12-months': 'Early repeat 12m',
  'colposcopy-referral': 'Colposcopy referral',
  'urgent-colposcopy-referral': 'Urgent colposcopy',
  'repeat-sample-3-months': 'Repeat sample 3m',
  'cease-screening': 'Cease screening',
  'awaiting-cytology': 'Awaiting cytology',
  'awaiting-result': 'Awaiting result'
};

// Result-class → shared risk palette class for the badge.
const resultClassClassMap = {
  'hpv-negative': 'risk-low',
  'cease-not-eligible': 'risk-moderate',
  'inadequate': 'risk-moderate',
  'hpv-positive-cytology-normal': 'risk-moderate',
  'hpv-positive-cytology-pending': 'risk-moderate',
  'pending': 'risk-moderate',
  'hpv-positive-cytology-abnormal-low': 'risk-high',
  'hpv-positive-cytology-abnormal-high': 'risk-critical'
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

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function resultLabel(result) {
  return resultLabels[result] || result || 'N/A';
}

function resultClass(result) {
  return resultClassClassMap[result] || '';
}

function managementLabel(action) {
  return managementLabels[action] || action || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.result !== '' ||
    filters.management !== '' ||
    filters.urgent !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ScreeningRow} row
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
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.result && row.resultClass !== filters.result) return false;
  if (filters.management && row.managementAction !== filters.management) return false;
  if (filters.urgent === 'yes' && !row.urgentFlag) return false;
  if (filters.urgent === 'no' && row.urgentFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The result column uses its rank
 * table; the urgent boolean sorts false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'resultClass') {
    av = resultRank[av] ?? -1;
    bv = resultRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'urgentFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting,
  // managementAction).
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return screenings.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.urgentFlag || row.resultClass === 'hpv-positive-cytology-abnormal-high') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="risk-badge ${resultClass(row.resultClass)}">${esc(resultLabel(row.resultClass))}</span></td>
      <td>${esc(managementLabel(row.managementAction))}</td>
      <td>
        <span class="flag-badge ${row.urgentFlag ? 'flag-yes' : 'flag-no'}">
          ${row.urgentFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = screenings.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No screenings to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} screenings`;
  } else {
    el.textContent = `Showing ${shown} of ${total} screenings`;
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
  const setting = document.getElementById('filter-setting');
  const result = document.getElementById('filter-result');
  const management = document.getElementById('filter-management');
  const urgent = document.getElementById('filter-urgent');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (result) {
    result.addEventListener('change', () => {
      filters.result = result.value;
      renderAll();
    });
  }
  if (management) {
    management.addEventListener('change', () => {
      filters.management = management.value;
      renderAll();
    });
  }
  if (urgent) {
    urgent.addEventListener('change', () => {
      filters.urgent = urgent.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.result = '';
      filters.management = '';
      filters.urgent = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (result) result.value = '';
      if (management) management.value = '';
      if (urgent) urgent.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadScreenings() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  screenings = sampleScreenings;
  renderAll();

  try {
    const items = await fetchScreenings();
    if (items && items.length > 0) {
      screenings = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no screenings.'
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
  loadScreenings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
