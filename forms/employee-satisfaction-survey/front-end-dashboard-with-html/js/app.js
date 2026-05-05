// Employee Satisfaction Survey - HR / management dashboard
// (vanilla classic-script app).
//
// On boot we fetch the team / department aggregate list from the backend;
// on any failure (or empty response) we fall back to sample data and show
// a small banner. The rendered table is sortable (click any column
// header) and filterable (department search + category dropdown +
// worst-domain dropdown + tenure-band dropdown).
//
// All rows are anonymous, group-level aggregates — never individual
// employees. The dashboard intentionally exposes no personal identifiers
// in any column, sort key, or filter input — only the department name is
// shown, by design.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.EmployeeSatisfactionSurveyDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchTeams,
  sampleTeams
} = window.EmployeeSatisfactionSurveyDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').TeamRow[]} */
let teams = [];

const filters = {
  search: '',       // department name substring
  category: '',     // '' | 'Excellent' | 'Good' | 'Satisfactory' | 'Poor' | 'Very Poor'
  worstDomain: '',  // '' | one of the eight survey domains
  tenureBand: ''    // '' | one of the tenure bands
};

// Default sort: category descending (Very Poor first), so the teams most
// in need of HR action surface at the top of the list.
const sortState = {
  key: 'category',
  direction: 'desc' // 'asc' | 'desc'
};

// The eight survey domains, in the order the engine emits them. Reused
// for per-domain table columns and for resolving `worstDomain` to a
// `domainMeans` field name.
const domains = [
  { key: 'workload',          label: 'Workload' },
  { key: 'management',        label: 'Management' },
  { key: 'growth',            label: 'Growth' },
  { key: 'compensation',      label: 'Compensation' },
  { key: 'culture',           label: 'Culture' },
  { key: 'environment',       label: 'Environment' },
  { key: 'recognition',       label: 'Recognition' },
  { key: 'overallExperience', label: 'Overall Exp.' }
];

// Map a worst-domain label (display string) to the matching
// `domainMeans` field — used to highlight the worst-mean cell in the row.
const domainLabelToKey = {
  'Workload':           'workload',
  'Management':         'management',
  'Growth':             'growth',
  'Compensation':       'compensation',
  'Culture':            'culture',
  'Environment':        'environment',
  'Recognition':        'recognition',
  'Overall Experience': 'overallExperience'
};

// Column definitions — single source of truth for header rendering and
// the row-cell renderer below. Domain mean columns are prefixed
// `mean.<key>` so the sort comparator can route them through the nested
// object.
const columns = [
  { key: 'department',     label: 'Department / Team', sortable: true, align: 'left'  },
  { key: 'responsesCount', label: 'Responses',         sortable: true, align: 'right' },
  { key: 'tenureBand',     label: 'Tenure',            sortable: true, align: 'left'  },
  { key: 'composite',      label: 'Composite',         sortable: true, align: 'right' },
  { key: 'category',       label: 'Category',          sortable: true, align: 'left'  },
  { key: 'mean.workload',          label: 'Workload',     sortable: true, align: 'right' },
  { key: 'mean.management',        label: 'Mgmt',         sortable: true, align: 'right' },
  { key: 'mean.growth',            label: 'Growth',       sortable: true, align: 'right' },
  { key: 'mean.compensation',      label: 'Comp',         sortable: true, align: 'right' },
  { key: 'mean.culture',           label: 'Culture',      sortable: true, align: 'right' },
  { key: 'mean.environment',       label: 'Env',          sortable: true, align: 'right' },
  { key: 'mean.recognition',       label: 'Recog',        sortable: true, align: 'right' },
  { key: 'mean.overallExperience', label: 'Overall Exp.', sortable: true, align: 'right' },
  { key: 'worstDomain',    label: 'Worst Domain',      sortable: true, align: 'left'  },
  { key: 'enps',           label: 'eNPS',              sortable: true, align: 'right' }
];

// Categorical rank table for sorting by `category`. Higher index = worse
// category, so a descending sort puts 'Very Poor' at the top — matches
// the default sort direction below.
const categoryRank = {
  'Excellent':    0,
  'Good':         1,
  'Satisfactory': 2,
  'Poor':         3,
  'Very Poor':    4
};

// Categorical rank table for sorting by `worstDomain`. Order follows the
// canonical survey-step listing in the form spec.
const worstDomainRank = {
  'Workload':           0,
  'Management':         1,
  'Growth':             2,
  'Compensation':       3,
  'Culture':            4,
  'Environment':        5,
  'Recognition':        6,
  'Overall Experience': 7
};

// Categorical rank table for sorting by `tenureBand`. Bands are ordered
// by length of service, with "Mixed" placed last.
const tenureBandRank = {
  '<1 year':    0,
  '1-3 years':  1,
  '3-5 years':  2,
  '5-10 years': 3,
  '10+ years':  4,
  'Mixed':      5
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

function categoryClass(label) {
  if (!label) return '';
  return 'category-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.category !== '' ||
    filters.worstDomain !== '' ||
    filters.tenureBand !== ''
  );
}

/** Format a domain mean as one decimal place (e.g. 3.4). */
function fmtMean(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return Number(n).toFixed(1);
}

/** Format a 0-100 composite score as an integer. */
function fmtComposite(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return String(Math.round(Number(n)));
}

/** Format an eNPS value as a signed integer (e.g. "+12", "-34", "0"). */
function fmtEnps(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  const v = Math.round(Number(n));
  if (v > 0) return '+' + v;
  return String(v);
}

/** CSS class for an eNPS value; standard NPS bands (>0 promoter-leaning, <0 detractor-leaning). */
function enpsClass(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return 'enps-neutral';
  const v = Number(n);
  if (v > 0)  return 'enps-positive';
  if (v < 0)  return 'enps-negative';
  return 'enps-neutral';
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').TeamRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    if (!row.department.toLowerCase().includes(term)) return false;
  }
  if (filters.category && row.category !== filters.category) {
    return false;
  }
  if (filters.worstDomain && row.worstDomain !== filters.worstDomain) {
    return false;
  }
  if (filters.tenureBand && row.tenureBand !== filters.tenureBand) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numeric columns compare directly; everything else
 * uses a locale-aware string compare. Domain-mean keys are prefixed
 * `mean.` and routed through `row.domainMeans`.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;

  // Domain-mean columns: e.g. 'mean.workload'
  if (key.indexOf('mean.') === 0) {
    const sub = key.slice(5);
    const av = a.domainMeans ? a.domainMeans[sub] : null;
    const bv = b.domainMeans ? b.domainMeans[sub] : null;
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  let av = a[key];
  let bv = b[key];

  if (key === 'category') {
    av = categoryRank[av] ?? -1;
    bv = categoryRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'worstDomain') {
    av = worstDomainRank[av] ?? -1;
    bv = worstDomainRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'tenureBand') {
    av = tenureBandRank[av] ?? -1;
    bv = tenureBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'responsesCount' || key === 'composite' || key === 'enps') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (department)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return teams.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('teams-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;
    if (col.align === 'right') {
      th.style.textAlign = 'right';
    }

    let ariaSort = 'none';
    let indicator = '\u2195'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '\u2191';
      } else {
        ariaSort = 'descending';
        indicator = '\u2193';
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
  const body = document.getElementById('teams-table-body');
  const empty = document.getElementById('teams-empty-message');
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
    if (row.category === 'Very Poor') {
      tr.classList.add('row-very-poor');
    }

    const worstKey = domainLabelToKey[row.worstDomain] || '';

    // Build per-domain mean cells, tinting the worst-domain cell.
    const meanCells = domains.map(function (d) {
      const v = row.domainMeans ? row.domainMeans[d.key] : null;
      const isWorst = d.key === worstKey;
      const cls = 'num-cell mean' + (isWorst ? ' mean-worst' : '');
      return `<td class="${cls}">${esc(fmtMean(v))}</td>`;
    }).join('');

    tr.innerHTML = `
      <td>${esc(row.department)}</td>
      <td class="num-cell">${esc(row.responsesCount)}</td>
      <td><span class="tenure-badge">${esc(row.tenureBand)}</span></td>
      <td class="composite-cell">${esc(fmtComposite(row.composite))}</td>
      <td><span class="category-badge ${categoryClass(row.category)}">${esc(row.category)}</span></td>
      ${meanCells}
      <td><span class="domain-badge">${esc(row.worstDomain)}</span></td>
      <td class="num-cell ${enpsClass(row.enps)}">${esc(fmtEnps(row.enps))}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = teams.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No teams to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} teams`;
  } else {
    el.textContent = `Showing ${shown} of ${total} teams`;
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
    // Numeric columns and the worst-first category column default to
    // descending; text columns default to ascending (A->Z). Note: eNPS
    // descending puts the most positive promoters at the top, which is
    // counterintuitive for an action-list — but matches user expectation
    // when explicitly sorting by eNPS.
    const descByDefault =
      key === 'category' ||
      key === 'composite' ||
      key === 'responsesCount' ||
      key === 'enps' ||
      key.indexOf('mean.') === 0;
    sortState.direction = descByDefault ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const category = document.getElementById('filter-category');
  const worstDomain = document.getElementById('filter-worst-domain');
  const tenureBand = document.getElementById('filter-tenure-band');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (category) {
    category.addEventListener('change', () => {
      filters.category = category.value;
      renderAll();
    });
  }
  if (worstDomain) {
    worstDomain.addEventListener('change', () => {
      filters.worstDomain = worstDomain.value;
      renderAll();
    });
  }
  if (tenureBand) {
    tenureBand.addEventListener('change', () => {
      filters.tenureBand = tenureBand.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.category = '';
      filters.worstDomain = '';
      filters.tenureBand = '';
      if (search) search.value = '';
      if (category) category.value = '';
      if (worstDomain) worstDomain.value = '';
      if (tenureBand) tenureBand.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadTeams() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  teams = sampleTeams;
  renderAll();

  try {
    const items = await fetchTeams();
    if (items && items.length > 0) {
      teams = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no team aggregates.'
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
  loadTeams();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
