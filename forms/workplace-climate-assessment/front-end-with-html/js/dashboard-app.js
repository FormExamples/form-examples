import { fetchTeams } from './api.js';
import { sampleTeams } from './data.js';

// Workplace Climate Assessment - leadership dashboard
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
// attach their exports to `window.WorkplaceClimateAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').TeamRow[]} */
let teams = [];

const filters = {
  search: '',       // department name substring
  category: '',     // '' | 'Thriving' | 'Healthy' | 'Developing' | 'Strained' | 'Critical'
  worstDomain: '',  // '' | one of the nine climate domains
  tenureBand: ''    // '' | one of the tenure bands
};

// Default sort: category descending (Critical first), so the teams most
// in need of leadership action surface at the top of the list.
const sortState = {
  key: 'category',
  direction: 'desc' // 'asc' | 'desc'
};

// The nine climate domains, in the canonical order the engine emits them
// (mirrors the form-spec step order, excluding the Demographics step).
// Reused for per-domain table columns and for resolving `worstDomain` to
// a `domainMeans` field name.
const domains = [
  { key: 'leadership',          label: 'Leadership'  },
  { key: 'psychologicalSafety', label: 'Psych. Safety' },
  { key: 'inclusion',           label: 'Inclusion'   },
  { key: 'communication',       label: 'Comms'       },
  { key: 'collaboration',       label: 'Collab.'     },
  { key: 'recognition',         label: 'Recognition' },
  { key: 'wellbeing',           label: 'Wellbeing'   },
  { key: 'careerDevelopment',   label: 'Career Dev.' },
  { key: 'overallClimate',      label: 'Overall'     }
];

// Map a worst-domain label (display string) to the matching
// `domainMeans` field — used to highlight the worst-mean cell in the row.
const domainLabelToKey = {
  'Leadership':           'leadership',
  'Psychological Safety': 'psychologicalSafety',
  'Inclusion':            'inclusion',
  'Communication':        'communication',
  'Collaboration':        'collaboration',
  'Recognition':          'recognition',
  'Wellbeing':            'wellbeing',
  'Career Development':   'careerDevelopment',
  'Overall Climate':      'overallClimate'
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
  { key: 'mean.leadership',          label: 'Leadership',    sortable: true, align: 'right' },
  { key: 'mean.psychologicalSafety', label: 'Psych. Safety', sortable: true, align: 'right' },
  { key: 'mean.inclusion',           label: 'Inclusion',     sortable: true, align: 'right' },
  { key: 'mean.communication',       label: 'Comms',         sortable: true, align: 'right' },
  { key: 'mean.collaboration',       label: 'Collab.',       sortable: true, align: 'right' },
  { key: 'mean.recognition',         label: 'Recognition',   sortable: true, align: 'right' },
  { key: 'mean.wellbeing',           label: 'Wellbeing',     sortable: true, align: 'right' },
  { key: 'mean.careerDevelopment',   label: 'Career Dev.',   sortable: true, align: 'right' },
  { key: 'mean.overallClimate',      label: 'Overall',       sortable: true, align: 'right' },
  { key: 'worstDomain',    label: 'Worst Domain',      sortable: true, align: 'left'  }
];

// Categorical rank table for sorting by `category`. Higher index = worse
// category, so a descending sort puts 'Critical' at the top — matches
// the default sort direction below.
const categoryRank = {
  'Thriving':   0,
  'Healthy':    1,
  'Developing': 2,
  'Strained':   3,
  'Critical':   4
};

// Categorical rank table for sorting by `worstDomain`. Order follows the
// canonical climate-domain listing in the form spec.
const worstDomainRank = {
  'Leadership':           0,
  'Psychological Safety': 1,
  'Inclusion':            2,
  'Communication':        3,
  'Collaboration':        4,
  'Recognition':          5,
  'Wellbeing':            6,
  'Career Development':   7,
  'Overall Climate':      8
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

  // Domain-mean columns: e.g. 'mean.leadership'
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

  if (key === 'responsesCount' || key === 'composite') {
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    if (row.category === 'Critical') {
      tr.classList.add('row-critical');
    } else if (row.category === 'Strained') {
      tr.classList.add('row-strained');
    }

    const worstKey = domainLabelToKey[row.worstDomain] || '';

    // Build per-domain mean cells, tinting the worst-domain cell.
    const meanCells = domains.map(function (d) {
      const v = row.domainMeans ? row.domainMeans[d.key] : null;
      const isWorst = d.key === worstKey;
      const cls = 'data-table-td num-cell mean' + (isWorst ? ' mean-worst' : '');
      return `<td class="${cls}">${esc(fmtMean(v))}</td>`;
    }).join('');

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td num-cell">${esc(row.responsesCount)}</td>
      <td class="data-table-td"><span class="tenure-badge">${esc(row.tenureBand)}</span></td>
      <td class="data-table-td composite-cell">${esc(fmtComposite(row.composite))}</td>
      <td class="data-table-td"><span class="category-badge ${categoryClass(row.category)}">${esc(row.category)}</span></td>
      ${meanCells}
      <td class="data-table-td"><span class="domain-badge">${esc(row.worstDomain)}</span></td>
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
    // descending; text columns default to ascending (A->Z). Worst-domain
    // and tenure-band default to ascending so the canonical step / band
    // order is preserved.
    const descByDefault =
      key === 'category' ||
      key === 'composite' ||
      key === 'responsesCount' ||
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
