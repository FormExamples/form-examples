import { fetchReports } from './api.js';
import { sampleReports } from './data.js';
import { abnormalitySeverityClass, abnormalitySeverityLabel, biopsySiteLabel, followUpUrgencyClass, followUpUrgencyLabel, reportStatusLabel, resultClassificationClass, resultClassificationLabel } from './types.js';

// Biopsy Test Result — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the graded-report list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + classification dropdown + follow-up-urgency dropdown), mirroring the
// SvelteKit dashboard route's columns and filters.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReportRow[]} */
let reports = [];

const filters = {
  search: '',
  classification: '', // '' | 'normal' | 'abnormal' | 'critical' | 'inconclusive'
  urgency: ''         // '' | 'routine' | 'recommended' | 'urgent' | 'critical-alert'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'id',                        label: 'Report' },
  { key: 'patientName',               label: 'Patient' },
  { key: 'biopsySite',                label: 'Site' },
  { key: 'reportStatus',              label: 'Status' },
  { key: 'reportedDate',              label: 'Reported' },
  { key: 'resultClassification',      label: 'Classification' },
  { key: 'abnormalitySeverity',       label: 'Severity' },
  { key: 'followUpUrgency',           label: 'Urgency' },
  { key: 'reportCompletenessPercent', label: 'Complete' },
  { key: 'flagCount',                 label: 'Flags' }
];

// Rank tables used when sorting the ordinal axis columns so the ladder is
// respected regardless of locale.
const classificationRank = {
  'normal': 0, 'inconclusive': 1, 'abnormal': 2, 'critical': 3
};
const severityRank = { 'none': 0, 'minor': 1, 'moderate': 2, 'major': 3 };
const urgencyRank = {
  'routine': 0, 'recommended': 1, 'urgent': 2, 'critical-alert': 3
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
  if (filters.classification && row.resultClassification !== filters.classification) return false;
  if (filters.urgency && row.followUpUrgency !== filters.urgency) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Ordinal axis columns use their
 * rank tables; numeric columns compare numerically; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'resultClassification') {
    return ((classificationRank[av] ?? -1) - (classificationRank[bv] ?? -1)) * dir;
  }
  if (key === 'abnormalitySeverity') {
    return ((severityRank[av] ?? -1) - (severityRank[bv] ?? -1)) * dir;
  }
  if (key === 'followUpUrgency') {
    return ((urgencyRank[av] ?? -1) - (urgencyRank[bv] ?? -1)) * dir;
  }
  if (key === 'reportCompletenessPercent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  // Default: string compare (id, patientName, biopsySite, reportStatus, reportedDate)
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
    if (row.followUpUrgency === 'critical-alert' || row.resultClassification === 'critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.id)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(biopsySiteLabel(row.biopsySite))}</td>
      <td>${esc(reportStatusLabel(row.reportStatus))}</td>
      <td>${esc(row.reportedDate)}</td>
      <td><span class="risk-badge ${resultClassificationClass(row.resultClassification)}">${esc(resultClassificationLabel(row.resultClassification))}</span></td>
      <td><span class="risk-badge ${abnormalitySeverityClass(row.abnormalitySeverity)}">${esc(abnormalitySeverityLabel(row.abnormalitySeverity))}</span></td>
      <td><span class="risk-badge ${followUpUrgencyClass(row.followUpUrgency)}">${esc(followUpUrgencyLabel(row.followUpUrgency))}</span></td>
      <td>${esc(String(row.reportCompletenessPercent))}%</td>
      <td>${esc(String(row.flagCount))}</td>
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
