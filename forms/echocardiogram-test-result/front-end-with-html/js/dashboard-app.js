// Echocardiogram Test Result — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the graded-report list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + echo-type dropdown + classification dropdown + follow-up-urgency
// dropdown). Columns mirror the SvelteKit dashboard's `ReportRow`
// (`front-end-with-svelte/src/lib/engine/types.ts`).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.EchocardiogramTestResultDashboard`; display labels
// come from the form namespace `window.EchocardiogramTestResult` (js/types.js).
// The whole file is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchReports,
  sampleReports
} = window.EchocardiogramTestResultDashboard;
const {
  echoTypeLabel,
  reportStatusLabel,
  resultClassificationLabel,
  abnormalitySeverityLabel,
  followUpUrgencyLabel,
  resultClassificationClass,
  abnormalitySeverityClass,
  followUpUrgencyClass
} = window.EchocardiogramTestResult;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReportRow[]} */
let reports = [];

const filters = {
  search: '',          // matches report id or patient name
  echoType: '',        // '' | EchoType
  classification: '',  // '' | ResultClassification
  urgency: ''          // '' | FollowUpUrgency
};

// Default sort: most recently reported first.
const sortState = {
  key: 'reportedDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Mirrors the SvelteKit `ReportRow` shape.
const columns = [
  { key: 'id',                        label: 'Report' },
  { key: 'patientName',               label: 'Patient' },
  { key: 'echoType',                  label: 'Echo type' },
  { key: 'reportStatus',              label: 'Status' },
  { key: 'reportedDate',              label: 'Reported' },
  { key: 'resultClassification',      label: 'Classification' },
  { key: 'abnormalitySeverity',       label: 'Severity' },
  { key: 'followUpUrgency',           label: 'Urgency' },
  { key: 'reportCompletenessPercent', label: 'Complete' },
  { key: 'flagCount',                 label: 'Flags' }
];

// Ranks used when sorting the graded-axis columns so the clinical ladders
// order correctly regardless of locale.
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
    filters.echoType !== '' ||
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
  if (filters.echoType && row.echoType !== filters.echoType) return false;
  if (filters.classification && row.resultClassification !== filters.classification) {
    return false;
  }
  if (filters.urgency && row.followUpUrgency !== filters.urgency) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The graded-axis columns use
 * their rank tables; the numeric columns compare numerically; everything else
 * uses a locale-aware string compare.
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
    return (Number(av) - Number(bv)) * dir;
  }

  // Default: string compare (id, patientName, echoType, reportStatus,
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
  const head = document.getElementById('reports-table-head');
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

function badgeCell(cls, label) {
  return `<span class="risk-badge ${cls}">${esc(label)}</span>`;
}

function renderTableBody() {
  const body = document.getElementById('reports-table-body');
  const empty = document.getElementById('reports-empty-message');
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
    if (row.resultClassification === 'critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.id)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(echoTypeLabel(row.echoType))}</td>
      <td>${esc(reportStatusLabel(row.reportStatus))}</td>
      <td>${esc(row.reportedDate)}</td>
      <td>${badgeCell(resultClassificationClass(row.resultClassification), resultClassificationLabel(row.resultClassification))}</td>
      <td>${badgeCell(abnormalitySeverityClass(row.abnormalitySeverity), abnormalitySeverityLabel(row.abnormalitySeverity))}</td>
      <td>${badgeCell(followUpUrgencyClass(row.followUpUrgency), followUpUrgencyLabel(row.followUpUrgency))}</td>
      <td><span class="class-cell">${esc(String(row.reportCompletenessPercent))}%</span></td>
      <td>
        <span class="flag-badge ${row.flagCount > 0 ? 'flag-yes' : 'flag-no'}">
          ${esc(String(row.flagCount))}
        </span>
      </td>
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
  const echoType = document.getElementById('filter-echo-type');
  const classification = document.getElementById('filter-classification');
  const urgency = document.getElementById('filter-urgency');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (echoType) {
    echoType.addEventListener('change', () => {
      filters.echoType = echoType.value;
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
      filters.echoType = '';
      filters.classification = '';
      filters.urgency = '';
      if (search) search.value = '';
      if (echoType) echoType.value = '';
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
})();
