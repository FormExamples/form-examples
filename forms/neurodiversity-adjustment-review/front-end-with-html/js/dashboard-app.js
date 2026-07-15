import { fetchReviews } from './api.js';
import { effectivenessBandLabel, nextStepUrgencyLabel, reviewStatusLabel, wellbeingRiskBandLabel } from './dashboard-types.js';
import { sampleReviews } from './data.js';

// Neurodiversity Adjustment Review — dashboard (vanilla classic-script app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// effectiveness dropdown + wellbeing-risk dropdown + next-step-urgency dropdown +
// flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.NeurodiversityAdjustmentReviewDashboard`. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  effectiveness: '',
  wellbeing: '',
  urgency: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent review first.
const sortState = {
  key: 'reviewDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'id',                     label: 'Review' },
  { key: 'workerName',             label: 'Worker' },
  { key: 'department',             label: 'Department' },
  { key: 'reviewStatus',           label: 'Status' },
  { key: 'reviewDate',             label: 'Reviewed' },
  { key: 'effectivenessBand',      label: 'Effectiveness' },
  { key: 'wellbeingRiskBand',      label: 'Wellbeing risk' },
  { key: 'nextStepUrgency',        label: 'Next step' },
  { key: 'completenessPercent',    label: 'Complete' },
  { key: 'flagCount',              label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const effectivenessRank = {
  'effective': 0,
  'partially-effective': 1,
  'not-yet-assessed': 2,
  'ineffective': 3
};

const wellbeingRank = {
  'ok': 0,
  'caution': 1,
  'high-risk': 2
};

const urgencyRank = {
  'none': 0,
  'review-scheduled': 1,
  'adjust-now': 2,
  'escalate': 3
};

const statusRank = {
  'draft': 0,
  'completed': 1,
  'changes-agreed': 2,
  'escalated': 3,
  'cancelled': 4
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

function effectivenessClass(value) {
  return value ? 'effect-' + String(value) : '';
}

function wellbeingClass(value) {
  return value ? 'well-' + String(value) : '';
}

function urgencyClass(value) {
  return value ? 'next-' + String(value) : '';
}

function statusClass(value) {
  return value ? 'status-' + String(value) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.effectiveness !== '' ||
    filters.wellbeing !== '' ||
    filters.urgency !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ReviewRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.workerName || '').toLowerCase().includes(term) ||
      String(row.department || '').toLowerCase().includes(term) ||
      String(row.effectivenessBand || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.effectiveness && row.effectivenessBand !== filters.effectiveness) return false;
  if (filters.wellbeing && row.wellbeingRiskBand !== filters.wellbeing) return false;
  if (filters.urgency && row.nextStepUrgency !== filters.urgency) return false;
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

  if (key === 'effectivenessBand') {
    return ((effectivenessRank[av] ?? -1) - (effectivenessRank[bv] ?? -1)) * dir;
  }
  if (key === 'wellbeingRiskBand') {
    return ((wellbeingRank[av] ?? -1) - (wellbeingRank[bv] ?? -1)) * dir;
  }
  if (key === 'nextStepUrgency') {
    return ((urgencyRank[av] ?? -1) - (urgencyRank[bv] ?? -1)) * dir;
  }
  if (key === 'reviewStatus') {
    return ((statusRank[av] ?? -1) - (statusRank[bv] ?? -1)) * dir;
  }
  if (key === 'completenessPercent' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  // Default: string compare (id, workerName, department, reviewDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return reviews.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('reviews-table-head');
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
  const body = document.getElementById('reviews-table-body');
  const empty = document.getElementById('reviews-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.wellbeingRiskBand === 'high-risk' || row.nextStepUrgency === 'escalate') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.id)}</strong></td>
      <td class="data-table-td">${esc(row.workerName)}</td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td"><span class="status-badge ${statusClass(row.reviewStatus)}">${esc(reviewStatusLabel(row.reviewStatus))}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.reviewDate)}</span></td>
      <td class="data-table-td"><span class="band-badge ${effectivenessClass(row.effectivenessBand)}">${esc(effectivenessBandLabel(row.effectivenessBand))}</span></td>
      <td class="data-table-td"><span class="well-badge ${wellbeingClass(row.wellbeingRiskBand)}">${esc(wellbeingRiskBandLabel(row.wellbeingRiskBand))}</span></td>
      <td class="data-table-td"><span class="next-badge ${urgencyClass(row.nextStepUrgency)}">${esc(nextStepUrgencyLabel(row.nextStepUrgency))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.completenessPercent)}%</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flagCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = reviews.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No reviews to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} reviews`;
  } else {
    el.textContent = `Showing ${shown} of ${total} reviews`;
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
 * Roll up the rows currently in view into a review overview: effective rate,
 * ineffective (not-working) rate, high-wellbeing-risk rate, the rate needing
 * action, and average completeness. Reflects the active filters, so slicing by
 * department or effectiveness re-scopes the metrics.
 */
function renderAnalytics() {
  const el = document.getElementById('analytics');
  if (!el) return;
  const rows = visibleRows();
  const total = rows.length;
  const count = (pred) => rows.filter(pred).length;
  const effective = count((r) => r.effectivenessBand === 'effective');
  const ineffective = count((r) => r.effectivenessBand === 'ineffective');
  const highRisk = count((r) => r.wellbeingRiskBand === 'high-risk');
  const needsAction = count(
    (r) => r.nextStepUrgency === 'adjust-now' || r.nextStepUrgency === 'escalate'
  );
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
    stat('Reviews in view', String(total), '') +
    stat('Effective', analyticsPct(effective, total) + '%', 'good') +
    stat('Ineffective', analyticsPct(ineffective, total) + '%', ineffective ? 'warn' : '') +
    stat(
      'High wellbeing risk',
      analyticsPct(highRisk, total) + '%',
      highRisk ? 'bad' : 'good'
    ) +
    stat('Needs action', analyticsPct(needsAction, total) + '%', needsAction ? 'bad' : '') +
    stat('Avg completeness', avgComplete + '%', '');
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
    // Review-date column defaults to descending (most recent first);
    // everything else defaults to ascending.
    sortState.direction = key === 'reviewDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const effectiveness = document.getElementById('filter-effectiveness');
  const wellbeing = document.getElementById('filter-wellbeing');
  const urgency = document.getElementById('filter-urgency');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (effectiveness) {
    effectiveness.addEventListener('change', () => {
      filters.effectiveness = effectiveness.value;
      renderAll();
    });
  }
  if (wellbeing) {
    wellbeing.addEventListener('change', () => {
      filters.wellbeing = wellbeing.value;
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
      filters.effectiveness = '';
      filters.wellbeing = '';
      filters.urgency = '';
      filters.flags = '';
      if (search) search.value = '';
      if (effectiveness) effectiveness.value = '';
      if (wellbeing) wellbeing.value = '';
      if (urgency) urgency.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReviews() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  reviews = sampleReviews;
  renderAll();

  try {
    const items = await fetchReviews();
    if (items && items.length > 0) {
      reviews = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no reviews.'
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
  loadReviews();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
