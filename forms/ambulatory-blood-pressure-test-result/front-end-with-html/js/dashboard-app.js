import { fetchReports } from './api.js';
import { sampleReports } from './data.js';

// ABPM test result — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the graded-report list from the backend; on any failure
// (or empty response) we fall back to sample data and show a small banner.
// The rendered table is sortable (click any column header) and filterable
// (search box + classification dropdown + follow-up-urgency dropdown),
// mirroring the SvelteKit dashboard's columns and filters.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.AmbulatoryBloodPressureTestResultDashboard`.
// The whole file is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReportRow[]} */
let reports = [];

const filters = {
  search: '',          // matched against report id + patient name
  classification: '',  // '' | 'normal' | 'abnormal' | 'critical' | 'inconclusive'
  urgency: ''          // '' | 'routine' | 'recommended' | 'urgent' | 'critical-alert'
};

// Default sort: most recently reported first.
const sortState = {
  key: 'reportedDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Columns mirror the SvelteKit dashboard route.
const columns = [
  { key: 'id',                        label: 'Report' },
  { key: 'patientName',               label: 'Patient' },
  { key: 'monitoringType',            label: 'Monitoring' },
  { key: 'reportStatus',              label: 'Status' },
  { key: 'reportedDate',              label: 'Reported' },
  { key: 'resultClassification',      label: 'Classification' },
  { key: 'abnormalitySeverity',       label: 'Severity' },
  { key: 'followUpUrgency',           label: 'Urgency' },
  { key: 'reportCompletenessPercent', label: 'Complete' },
  { key: 'flagCount',                 label: 'Flags' }
];

// Ranks used when sorting the graded-axis columns so the clinical escalation
// order is preserved regardless of locale.
const classificationRank = {
  'normal': 0,
  'inconclusive': 1,
  'abnormal': 2,
  'critical': 3
};
const severityRank = {
  'none': 0,
  'minor': 1,
  'moderate': 2,
  'major': 3
};
const urgencyRank = {
  'routine': 0,
  'recommended': 1,
  'urgent': 2,
  'critical-alert': 3
};

// ----------------------------------------------------------------------
// Labels + badge classes (mirror js/types.js for the form page)
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

function classificationLabel(value) {
  switch (value) {
    case 'normal': return 'Normal';
    case 'abnormal': return 'Abnormal';
    case 'critical': return 'Critical';
    case 'inconclusive': return 'Inconclusive';
    default: return 'Not graded';
  }
}

function classificationClass(value) {
  switch (value) {
    case 'normal': return 'risk-low';
    case 'abnormal': return 'risk-medium';
    case 'critical': return 'risk-critical';
    default: return '';
  }
}

function severityLabel(value) {
  switch (value) {
    case 'none': return 'None';
    case 'minor': return 'Minor';
    case 'moderate': return 'Moderate';
    case 'major': return 'Major';
    default: return 'Not graded';
  }
}

function severityClass(value) {
  switch (value) {
    case 'none': return 'risk-low';
    case 'minor': return 'risk-medium';
    case 'moderate': return 'risk-high';
    case 'major': return 'risk-critical';
    default: return '';
  }
}

function urgencyLabel(value) {
  switch (value) {
    case 'routine': return 'Routine';
    case 'recommended': return 'Recommended';
    case 'urgent': return 'Urgent';
    case 'critical-alert': return 'Critical alert';
    default: return 'Not graded';
  }
}

function urgencyClass(value) {
  switch (value) {
    case 'routine': return 'risk-low';
    case 'recommended': return 'risk-medium';
    case 'urgent': return 'risk-high';
    case 'critical-alert': return 'risk-critical';
    default: return '';
  }
}

function monitoringLabel(value) {
  switch (value) {
    case '24-hour-abpm': return '24-hour ABPM';
    case 'home-blood-pressure-monitoring': return 'Home BP monitoring';
    case 'other': return 'Other';
    default: return 'Unspecified';
  }
}

function statusLabel(value) {
  switch (value) {
    case 'preliminary': return 'Preliminary';
    case 'final': return 'Final';
    case 'amended': return 'Amended';
    case 'cancelled': return 'Cancelled';
    default: return 'Unspecified';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.classification !== '' ||
    filters.urgency !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ReportRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.id.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.classification && row.resultClassification !== filters.classification) {
    return false;
  }
  if (filters.urgency && row.followUpUrgency !== filters.urgency) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The graded-axis columns use
 * their clinical rank tables; the numeric columns compare numerically;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'resultClassification') {
    av = classificationRank[av] ?? -1;
    bv = classificationRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'abnormalitySeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'followUpUrgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'reportCompletenessPercent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (id, patientName, monitoringType, reportStatus,
  // reportedDate — ISO dates compare correctly as strings).
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return reports.filter(matchesFilters).slice().sort(compareRows);
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
    if (
      row.resultClassification === 'critical' ||
      row.followUpUrgency === 'critical-alert'
    ) {
      tr.classList.add('row-critical');
    }

    const flagClassName = row.flagCount > 0 ? 'flag-yes' : 'flag-no';

    tr.innerHTML = `
      <td>${esc(row.id)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(monitoringLabel(row.monitoringType))}</td>
      <td>${esc(statusLabel(row.reportStatus))}</td>
      <td>${esc(row.reportedDate)}</td>
      <td><span class="risk-badge ${classificationClass(row.resultClassification)}">${esc(classificationLabel(row.resultClassification))}</span></td>
      <td><span class="risk-badge ${severityClass(row.abnormalitySeverity)}">${esc(severityLabel(row.abnormalitySeverity))}</span></td>
      <td><span class="risk-badge ${urgencyClass(row.followUpUrgency)}">${esc(urgencyLabel(row.followUpUrgency))}</span></td>
      <td><span class="class-cell">${esc(String(row.reportCompletenessPercent))}%</span></td>
      <td><span class="flag-badge ${flagClassName}">${esc(String(row.flagCount))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = reports.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No reports to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} reports`;
  } else {
    el.textContent = `Showing ${shown} of ${total} reports`;
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
  const classification = document.getElementById('filter-classification');
  const urgency = document.getElementById('filter-urgency');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (classification) {
    classification.addEventListener('change', () => {
      filters.classification = classification.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.classification = '';
      filters.urgency = '';
      if (search) search.value = '';
      if (classification) classification.value = '';
      if (urgency) urgency.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReports() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  reports = sampleReports;
  renderAll();

  try {
    const items = await fetchReports();
    if (items && items.length > 0) {
      reports = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no reports.'
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
  loadReports();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
