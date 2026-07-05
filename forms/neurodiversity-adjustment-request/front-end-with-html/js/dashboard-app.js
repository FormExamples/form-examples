// Neurodiversity Adjustment Request — adjustments dashboard (vanilla classic-script app).
//
// On boot we fetch the request list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// priority-tier dropdown + eligibility-band dropdown + impact-band dropdown +
// recommendation dropdown + flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.NeurodiversityAdjustmentRequestDashboard`. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to the
// global scope.
(function () {
'use strict';
const {
  fetchRequests,
  sampleRequests
} = window.NeurodiversityAdjustmentRequestDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').RequestRow[]} */
let requests = [];

const filters = {
  search: '',
  priority: '',
  eligibility: '',
  impact: '',
  recommendation: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent request first.
const sortState = {
  key: 'requestDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'worker',              label: 'Worker' },
  { key: 'jobTitle',            label: 'Job Title' },
  { key: 'department',          label: 'Department' },
  { key: 'eligibilityBand',     label: 'Eligibility' },
  { key: 'impactBand',          label: 'Impact' },
  { key: 'priorityTier',        label: 'Priority' },
  { key: 'completenessPercent', label: 'Complete' },
  { key: 'recommendation',      label: 'Recommendation' },
  { key: 'manager',             label: 'Manager' },
  { key: 'requestDate',         label: 'Request Date' },
  { key: 'flags',               label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const eligibilityRank = {
  'likely-covered': 0,
  'possibly-covered': 1,
  'unclear': 2
};

const impactRank = {
  'ok': 0,
  'caution': 1,
  'high-risk': 2
};

const priorityRank = {
  'routine': 0,
  'soon': 1,
  'urgent': 2
};

const recommendationRank = {
  'progress-to-meeting': 0,
  'seek-occupational-health': 1,
  'signpost-access-to-work': 2,
  'request-more-detail': 3
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

/** Title-case a kebab-case value for display. */
function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function eligibilityClass(band) {
  return band ? 'elig-' + String(band) : '';
}

function impactClass(band) {
  return band ? 'impact-' + String(band) : '';
}

function priorityCls(tier) {
  return tier ? 'tier-' + String(tier) : '';
}

function recommendationClass(rec) {
  return rec ? 'rec-' + String(rec) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.priority !== '' ||
    filters.eligibility !== '' ||
    filters.impact !== '' ||
    filters.recommendation !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').RequestRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.worker || '').toLowerCase().includes(term) ||
      String(row.jobTitle || '').toLowerCase().includes(term) ||
      String(row.department || '').toLowerCase().includes(term) ||
      String(row.manager || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.priority && row.priorityTier !== filters.priority) return false;
  if (filters.eligibility && row.eligibilityBand !== filters.eligibility) return false;
  if (filters.impact && row.impactBand !== filters.impact) return false;
  if (filters.recommendation && row.recommendation !== filters.recommendation) return false;
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
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
  let av = a[key];
  let bv = b[key];

  if (key === 'eligibilityBand') {
    return ((eligibilityRank[av] ?? -1) - (eligibilityRank[bv] ?? -1)) * dir;
  }
  if (key === 'impactBand') {
    return ((impactRank[av] ?? -1) - (impactRank[bv] ?? -1)) * dir;
  }
  if (key === 'priorityTier') {
    return ((priorityRank[av] ?? -1) - (priorityRank[bv] ?? -1)) * dir;
  }
  if (key === 'recommendation') {
    return ((recommendationRank[av] ?? -1) - (recommendationRank[bv] ?? -1)) * dir;
  }
  if (key === 'completenessPercent') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'flags') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }
  // Default: string compare (worker, jobTitle, department, manager,
  // requestDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return requests.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('requests-table-head');
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

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">—</span>';
  }
  const chips = flags
    .map((f) => `<span class="flag-chip">${esc(titleCase(f))}</span>`)
    .join('');
  return `<div class="flag-list">${chips}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('requests-table-body');
  const empty = document.getElementById('requests-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.priorityTier === 'urgent' || row.impactBand === 'high-risk') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.worker)}</strong></td>
      <td class="data-table-td">${esc(row.jobTitle)}</td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td"><span class="band-badge ${eligibilityClass(row.eligibilityBand)}">${esc(titleCase(row.eligibilityBand))}</span></td>
      <td class="data-table-td"><span class="impact-badge ${impactClass(row.impactBand)}">${esc(titleCase(row.impactBand))}</span></td>
      <td class="data-table-td"><span class="tier-badge ${priorityCls(row.priorityTier)}">${esc(titleCase(row.priorityTier))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.completenessPercent)}%</span></td>
      <td class="data-table-td"><span class="band-badge ${recommendationClass(row.recommendation)}">${esc(titleCase(row.recommendation))}</span></td>
      <td class="data-table-td">${esc(row.manager)}</td>
      <td class="data-table-td"><span class="date-cell">${esc(row.requestDate)}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = requests.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No requests to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} requests`;
  } else {
    el.textContent = `Showing ${shown} of ${total} requests`;
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
 * Roll up the rows currently in view into a request overview: how many requests
 * likely engage the Equality Act duty, the high-wellbeing-risk rate, the urgent
 * rate, and average completeness. Reflects the active filters.
 */
function renderAnalytics() {
  const el = document.getElementById('analytics');
  if (!el) return;
  const rows = visibleRows();
  const total = rows.length;
  const count = (pred) => rows.filter(pred).length;
  const covered = count((r) => r.eligibilityBand === 'likely-covered');
  const highRisk = count((r) => r.impactBand === 'high-risk');
  const urgent = count((r) => r.priorityTier === 'urgent');
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
    stat('Requests in view', String(total), '') +
    stat('Duty likely engaged', analyticsPct(covered, total) + '%', 'good') +
    stat('High wellbeing risk', analyticsPct(highRisk, total) + '%', highRisk ? 'bad' : '') +
    stat('Urgent', analyticsPct(urgent, total) + '%', urgent ? 'warn' : '') +
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
    // Request-date column defaults to descending (most recent first);
    // everything else defaults to ascending.
    sortState.direction = key === 'requestDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const priority = document.getElementById('filter-priority');
  const eligibility = document.getElementById('filter-eligibility');
  const impactSel = document.getElementById('filter-impact');
  const recSel = document.getElementById('filter-recommendation');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (priority) {
    priority.addEventListener('change', () => {
      filters.priority = priority.value;
      renderAll();
    });
  }
  if (eligibility) {
    eligibility.addEventListener('change', () => {
      filters.eligibility = eligibility.value;
      renderAll();
    });
  }
  if (impactSel) {
    impactSel.addEventListener('change', () => {
      filters.impact = impactSel.value;
      renderAll();
    });
  }
  if (recSel) {
    recSel.addEventListener('change', () => {
      filters.recommendation = recSel.value;
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
      filters.priority = '';
      filters.eligibility = '';
      filters.impact = '';
      filters.recommendation = '';
      filters.flags = '';
      if (search) search.value = '';
      if (priority) priority.value = '';
      if (eligibility) eligibility.value = '';
      if (impactSel) impactSel.value = '';
      if (recSel) recSel.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRequests() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  requests = sampleRequests;
  renderAll();

  try {
    const items = await fetchRequests();
    if (items && items.length > 0) {
      requests = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no requests.'
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
  loadRequests();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
