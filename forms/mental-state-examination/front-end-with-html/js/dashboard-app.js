import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Mental State Examination — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the examination list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + status dropdown + risk-level dropdown + safety-
// flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.MentalStateExaminationDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | 'outpatient' | 'inpatient' | 'liaison' | 'crisis' | 'primary-care' | 'other'
  status: '',    // '' | 'complete' | 'partial'
  risk: '',      // '' | 'none' | 'low' | 'moderate' | 'high'
  flag: ''       // '' | 'yes' | 'no'
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
  { key: 'careSetting',         label: 'Setting' },
  { key: 'status',              label: 'Status' },
  { key: 'completenessPercent', label: 'Complete' },
  { key: 'riskLevel',           label: 'Risk' },
  { key: 'safetyFlag',          label: 'Safety Flag' }
];

// Ranks used when sorting the enum columns so order is locale-independent.
const riskRank = { 'none': 0, 'low': 1, 'moderate': 2, 'high': 3 };
const statusRank = { 'complete': 0, 'partial': 1 };

const settingLabels = {
  'outpatient': 'Outpatient',
  'inpatient': 'Inpatient',
  'liaison': 'Liaison',
  'crisis': 'Crisis',
  'primary-care': 'Primary care',
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

function riskClass(level) {
  switch (level) {
    case 'high': return 'risk-high';
    case 'moderate': return 'risk-moderate';
    case 'low': return 'risk-low';
    case 'none': return 'risk-none';
    default: return '';
  }
}

function riskLabel(level) {
  switch (level) {
    case 'high': return 'High';
    case 'moderate': return 'Moderate';
    case 'low': return 'Low';
    case 'none': return 'None';
    default: return 'N/A';
  }
}

function statusClass(status) {
  if (status === 'complete') return 'risk-low';
  if (status === 'partial') return 'risk-moderate';
  return '';
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'partial') return 'Partial';
  return 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function percentLabel(pct) {
  return (pct === null || pct === undefined) ? 'N/A' : `${pct}%`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.status !== '' ||
    filters.risk !== '' ||
    filters.flag !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').AssessmentRow} row
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
  if (filters.status && row.status !== filters.status) return false;
  if (filters.risk && row.riskLevel !== filters.risk) return false;
  if (filters.flag === 'yes' && !row.safetyFlag) return false;
  if (filters.flag === 'no' && row.safetyFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Enum columns use their rank
 * tables; the numeric completeness sorts nulls last; the safety-flag boolean
 * sorts false<true; everything else uses a locale-aware string compare.
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

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'completenessPercent') {
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'safetyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕';
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

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.riskLevel === 'high') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(percentLabel(row.completenessPercent))}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(riskLabel(row.riskLevel))}</span></td>
      <td>
        <span class="flag-badge ${row.safetyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.safetyFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = assessments.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} assessments`;
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
  const status = document.getElementById('filter-status');
  const risk = document.getElementById('filter-risk');
  const flag = document.getElementById('filter-flag');
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
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (flag) {
    flag.addEventListener('change', () => {
      filters.flag = flag.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.status = '';
      filters.risk = '';
      filters.flag = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (status) status.value = '';
      if (risk) risk.value = '';
      if (flag) flag.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
