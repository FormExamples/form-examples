// Cardiology Response — interpretation dashboard (vanilla classic-script app).
//
// On boot we fetch the response list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + classification dropdown + follow-up-urgency dropdown +
// safety-flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.CardiologyResponseDashboard`. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak to the global
// scope.
(function () {
'use strict';
const {
  fetchResponses,
  sampleResponses,
  responseClassificationLabel,
  severityLabel,
  followUpUrgencyLabel,
  consultationTypeLabel,
  responseStatusLabel
} = window.CardiologyResponseDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ResponseRow[]} */
let responses = [];

const filters = {
  search: '',
  classification: '',
  urgency: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent response first.
const sortState = {
  key: 'respondedDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'id',                     label: 'Response' },
  { key: 'patientName',            label: 'Patient' },
  { key: 'consultationType',       label: 'Consultation' },
  { key: 'responseStatus',         label: 'Status' },
  { key: 'respondedDate',          label: 'Responded' },
  { key: 'responseClassification', label: 'Classification' },
  { key: 'severity',               label: 'Severity' },
  { key: 'followUpUrgency',        label: 'Urgency' },
  { key: 'completenessPercent',    label: 'Complete' },
  { key: 'flagCount',              label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const classificationRank = {
  'no-abnormality': 0,
  'inconclusive': 1,
  'cardiac-condition': 2,
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

const statusRank = {
  'preliminary': 0,
  'final': 1,
  'amended': 2,
  'cancelled': 3
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

function classificationClass(value) {
  return value ? 'classification-' + String(value) : '';
}

function severityClass(value) {
  return value ? 'severity-' + String(value) : '';
}

function urgencyClass(value) {
  return value ? 'urgency-' + String(value) : '';
}

function statusClass(value) {
  return value ? 'status-' + String(value) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.classification !== '' ||
    filters.urgency !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ResponseRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.patientName || '').toLowerCase().includes(term) ||
      String(row.consultationType || '').toLowerCase().includes(term) ||
      String(row.responseClassification || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.classification && row.responseClassification !== filters.classification) return false;
  if (filters.urgency && row.followUpUrgency !== filters.urgency) return false;
  const hasFlags = Number(row.flagCount) > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use their
 * rank tables; numbers compare directly; everything else uses a locale-aware
 * string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'responseClassification') {
    return ((classificationRank[av] ?? -1) - (classificationRank[bv] ?? -1)) * dir;
  }
  if (key === 'severity') {
    return ((severityRank[av] ?? -1) - (severityRank[bv] ?? -1)) * dir;
  }
  if (key === 'followUpUrgency') {
    return ((urgencyRank[av] ?? -1) - (urgencyRank[bv] ?? -1)) * dir;
  }
  if (key === 'responseStatus') {
    return ((statusRank[av] ?? -1) - (statusRank[bv] ?? -1)) * dir;
  }
  if (key === 'completenessPercent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  // Default: string compare (id, patientName, consultationType, respondedDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return responses.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('responses-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
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

function renderFlagsCell(flagCount) {
  const n = Number(flagCount) || 0;
  if (n === 0) {
    return '<span class="flag-empty">—</span>';
  }
  return `<span class="flag-chip">${esc(n)} flag${n === 1 ? '' : 's'}</span>`;
}

function renderTableBody() {
  const body = document.getElementById('responses-table-body');
  const empty = document.getElementById('responses-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.followUpUrgency === 'critical-alert' || row.responseClassification === 'critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.id)}</strong></td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(consultationTypeLabel(row.consultationType))}</td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.responseStatus)}">${esc(responseStatusLabel(row.responseStatus))}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.respondedDate)}</span></td>
      <td class="data-table-td"><span class="band-badge ${classificationClass(row.responseClassification)}">${esc(responseClassificationLabel(row.responseClassification))}</span></td>
      <td class="data-table-td"><span class="severity-badge ${severityClass(row.severity)}">${esc(severityLabel(row.severity))}</span></td>
      <td class="data-table-td"><span class="urgency-badge ${urgencyClass(row.followUpUrgency)}">${esc(followUpUrgencyLabel(row.followUpUrgency))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.completenessPercent)}%</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flagCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = responses.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No responses to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} responses`;
  } else {
    el.textContent = `Showing ${shown} of ${total} responses`;
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
    // Responded-date column defaults to descending (most recent first);
    // everything else defaults to ascending.
    sortState.direction = key === 'respondedDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const classification = document.getElementById('filter-classification');
  const urgency = document.getElementById('filter-urgency');
  const flags = document.getElementById('filter-flags');
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
  if (flags) {
    flags.addEventListener('change', () => {
      filters.flags = flags.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.classification = '';
      filters.urgency = '';
      filters.flags = '';
      if (search) search.value = '';
      if (classification) classification.value = '';
      if (urgency) urgency.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadResponses() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  responses = sampleResponses;
  renderAll();

  try {
    const items = await fetchResponses();
    if (items && items.length > 0) {
      responses = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no responses.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadResponses();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
