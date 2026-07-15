import { fetchResponses } from './api.js';
import { followUpUrgencyLabel, legalRiskBandLabel, outcomeClassificationLabel, responseStatusLabel } from './dashboard-types.js';
import { sampleResponses } from './data.js';

// Neurodiversity Adjustment Response — dashboard (vanilla classic-script app).
//
// On boot we fetch the response list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// outcome dropdown + legal-risk dropdown + follow-up-urgency dropdown +
// flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.NeurodiversityAdjustmentResponseDashboard`. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ResponseRow[]} */
let responses = [];

const filters = {
  search: '',
  outcome: '',
  legalRisk: '',
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
  { key: 'workerName',             label: 'Worker' },
  { key: 'department',             label: 'Department' },
  { key: 'responseStatus',         label: 'Status' },
  { key: 'respondedDate',          label: 'Responded' },
  { key: 'outcomeClassification',  label: 'Outcome' },
  { key: 'legalRiskBand',          label: 'Legal risk' },
  { key: 'followUpUrgency',        label: 'Urgency' },
  { key: 'completenessPercent',    label: 'Complete' },
  { key: 'flagCount',              label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const outcomeRank = {
  'fully-agreed': 0,
  'alternative-offered': 1,
  'partially-agreed': 2,
  'deferred': 3,
  'declined': 4
};

const legalRiskRank = {
  'ok': 0,
  'caution': 1,
  'high-risk': 2
};

const urgencyRank = {
  'none': 0,
  'review-scheduled': 1,
  'urgent-review': 2,
  'escalation-needed': 3
};

const statusRank = {
  'draft': 0,
  'agreed': 1,
  'partially-agreed': 2,
  'trial': 3,
  'declined': 4,
  'deferred': 5,
  'cancelled': 6
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

function outcomeClass(value) {
  return value ? 'outcome-' + String(value) : '';
}

function legalRiskClass(value) {
  return value ? 'legal-' + String(value) : '';
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
    filters.outcome !== '' ||
    filters.legalRisk !== '' ||
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
      String(row.workerName || '').toLowerCase().includes(term) ||
      String(row.department || '').toLowerCase().includes(term) ||
      String(row.outcomeClassification || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.outcomeClassification !== filters.outcome) return false;
  if (filters.legalRisk && row.legalRiskBand !== filters.legalRisk) return false;
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

  if (key === 'outcomeClassification') {
    return ((outcomeRank[av] ?? -1) - (outcomeRank[bv] ?? -1)) * dir;
  }
  if (key === 'legalRiskBand') {
    return ((legalRiskRank[av] ?? -1) - (legalRiskRank[bv] ?? -1)) * dir;
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
  // Default: string compare (id, workerName, department, respondedDate).
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
    if (row.legalRiskBand === 'high-risk' || row.followUpUrgency === 'escalation-needed') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.id)}</strong></td>
      <td class="data-table-td">${esc(row.workerName)}</td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.responseStatus)}">${esc(responseStatusLabel(row.responseStatus))}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.respondedDate)}</span></td>
      <td class="data-table-td"><span class="band-badge ${outcomeClass(row.outcomeClassification)}">${esc(outcomeClassificationLabel(row.outcomeClassification))}</span></td>
      <td class="data-table-td"><span class="legal-badge ${legalRiskClass(row.legalRiskBand)}">${esc(legalRiskBandLabel(row.legalRiskBand))}</span></td>
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

/** Percentage helper (integer, guards divide-by-zero). */
function analyticsPct(n, d) {
  return d === 0 ? 0 : Math.round((n / d) * 100);
}

/**
 * Roll up the rows currently in view into a compliance overview: outcome mix,
 * discrimination-risk rate (legal-risk high-risk), escalation rate, and average
 * completeness. Reflects the active filters, so slicing by department or outcome
 * re-scopes the metrics.
 */
function renderAnalytics() {
  const el = document.getElementById('analytics');
  if (!el) return;
  const rows = visibleRows();
  const total = rows.length;
  const count = (pred) => rows.filter(pred).length;
  const agreed = count((r) =>
    ['fully-agreed', 'partially-agreed', 'alternative-offered'].indexOf(
      row_outcome(r)
    ) >= 0
  );
  const declined = count((r) => row_outcome(r) === 'declined');
  const highRisk = count((r) => r.legalRiskBand === 'high-risk');
  const escalation = count((r) => r.followUpUrgency === 'escalation-needed');
  const avgComplete =
    total === 0
      ? 0
      : Math.round(
          rows.reduce((a, r) => a + (Number(r.completenessPercent) || 0), 0) / total
        );

  const stat = (labelText, value, tone) =>
    '<div class="stat-card' +
    (tone ? ' stat-' + tone : '') +
    '"><span class="stat-value">' +
    value +
    '</span><span class="stat-label">' +
    labelText +
    '</span></div>';

  el.innerHTML =
    stat('Responses in view', String(total), '') +
    stat('Agreed (full / part)', analyticsPct(agreed, total) + '%', 'good') +
    stat('Declined', analyticsPct(declined, total) + '%', declined ? 'warn' : '') +
    stat(
      'Discrimination-risk',
      analyticsPct(highRisk, total) + '%',
      highRisk ? 'bad' : 'good'
    ) +
    stat('Escalation', analyticsPct(escalation, total) + '%', escalation ? 'bad' : '') +
    stat('Avg completeness', avgComplete + '%', '');
}

/** Read the outcome classification from a row, tolerating field naming. */
function row_outcome(r) {
  return r.outcomeClassification || '';
}

function renderAll() {
  renderAnalytics();
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
  const outcome = document.getElementById('filter-outcome');
  const legalRisk = document.getElementById('filter-legal-risk');
  const urgency = document.getElementById('filter-urgency');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = outcome.value;
      renderAll();
    });
  }
  if (legalRisk) {
    legalRisk.addEventListener('change', () => {
      filters.legalRisk = legalRisk.value;
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
      filters.outcome = '';
      filters.legalRisk = '';
      filters.urgency = '';
      filters.flags = '';
      if (search) search.value = '';
      if (outcome) outcome.value = '';
      if (legalRisk) legalRisk.value = '';
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
