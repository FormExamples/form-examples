import { fetchTeams } from './api.js';
import { sampleTeams } from './data.js';

// Workplace Stress Assessment - occupational health dashboard
// (vanilla classic-script app).
//
// On boot we fetch the team / department aggregate list from the backend;
// on any failure (or empty response) we fall back to sample data and show
// a small banner. The rendered table is sortable (click any column
// header) and filterable (department search + overall-risk dropdown +
// worst-domain dropdown + tenure-band dropdown).
//
// All rows are anonymous, group-level aggregates — never individual
// employees. The dashboard intentionally exposes no personal identifiers
// in any column, sort key, or filter input.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').TeamRow[]} */
let teams = [];

const filters = {
  search: '',       // department name substring
  overallRisk: '',  // '' | 'Low' | 'Moderate' | 'High' | 'Very High'
  worstDomain: '',  // '' | one of the seven HSE domains
  tenureBand: ''    // '' | one of the tenure bands
};

// Default sort: overall risk descending (Very High first), so the teams
// most in need of management action surface at the top of the list.
const sortState = {
  key: 'overallRisk',
  direction: 'desc' // 'asc' | 'desc'
};

// The seven HSE domains, in the order the engine emits them. Reused for
// per-domain table columns and for resolving `worstDomain` to a
// `domainMeans` field name.
const domains = [
  { key: 'demands',        label: 'Demands' },
  { key: 'control',        label: 'Control' },
  { key: 'managerSupport', label: 'Manager Support' },
  { key: 'peerSupport',    label: 'Peer Support' },
  { key: 'relationships',  label: 'Relationships' },
  { key: 'role',           label: 'Role' },
  { key: 'change',         label: 'Change' }
];

// Map a worst-domain label (HSE display string) to the matching
// `domainMeans` field — used to highlight the worst-mean cell in the row.
const domainLabelToKey = {
  'Demands':         'demands',
  'Control':         'control',
  'Manager Support': 'managerSupport',
  'Peer Support':    'peerSupport',
  'Relationships':   'relationships',
  'Role':            'role',
  'Change':          'change'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Domain mean columns are prefixed `mean.<key>`
// so the sort comparator can route them through the nested object.
const columns = [
  { key: 'department',       label: 'Department / Team',  sortable: true,  align: 'left' },
  { key: 'responsesCount',   label: 'Responses',          sortable: true,  align: 'right' },
  { key: 'tenureBand',       label: 'Tenure',             sortable: true,  align: 'left' },
  { key: 'mean.demands',        label: 'Demands',         sortable: true,  align: 'right' },
  { key: 'mean.control',        label: 'Control',         sortable: true,  align: 'right' },
  { key: 'mean.managerSupport', label: 'Mgr Support',     sortable: true,  align: 'right' },
  { key: 'mean.peerSupport',    label: 'Peer Support',    sortable: true,  align: 'right' },
  { key: 'mean.relationships',  label: 'Relationships',   sortable: true,  align: 'right' },
  { key: 'mean.role',           label: 'Role',            sortable: true,  align: 'right' },
  { key: 'mean.change',         label: 'Change',          sortable: true,  align: 'right' },
  { key: 'worstDomain',      label: 'Worst Domain',       sortable: true,  align: 'left' },
  { key: 'overallRisk',      label: 'Overall Risk',       sortable: true,  align: 'left' }
];

// Categorical rank table for sorting by `overallRisk`. Higher index =
// higher risk, so a descending sort puts 'Very High' at the top.
const overallRiskRank = {
  'Low':       0,
  'Moderate':  1,
  'High':      2,
  'Very High': 3
};

// Categorical rank table for sorting by `worstDomain`. Order follows the
// canonical HSE Management Standards listing.
const worstDomainRank = {
  'Demands':         0,
  'Control':         1,
  'Manager Support': 2,
  'Peer Support':    3,
  'Relationships':   4,
  'Role':            5,
  'Change':          6
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

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.overallRisk !== '' ||
    filters.worstDomain !== '' ||
    filters.tenureBand !== ''
  );
}

/** Format a domain mean as one decimal place (e.g. 3.4). */
function fmtMean(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return '';
  return Number(n).toFixed(1);
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
  if (filters.overallRisk && row.overallRisk !== filters.overallRisk) {
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

  // Domain-mean columns: e.g. 'mean.demands'
  if (key.indexOf('mean.') === 0) {
    const sub = key.slice(5);
    const av = a.domainMeans ? a.domainMeans[sub] : null;
    const bv = b.domainMeans ? b.domainMeans[sub] : null;
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  let av = a[key];
  let bv = b[key];

  if (key === 'overallRisk') {
    av = overallRiskRank[av] ?? -1;
    bv = overallRiskRank[bv] ?? -1;
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

  if (key === 'responsesCount') {
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
    if (row.overallRisk === 'Very High') {
      tr.classList.add('row-very-high');
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
      ${meanCells}
      <td class="data-table-td"><span class="domain-badge">${esc(row.worstDomain)}</span></td>
      <td class="data-table-td"><span class="risk-badge ${riskClass(row.overallRisk)}">${esc(row.overallRisk)}</span></td>
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
    // Numeric and risk-rank columns default to descending (worst-first);
    // text columns default to ascending (A->Z).
    const descByDefault =
      key === 'overallRisk' ||
      key === 'responsesCount' ||
      key.indexOf('mean.') === 0;
    sortState.direction = descByDefault ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const overallRisk = document.getElementById('filter-overall-risk');
  const worstDomain = document.getElementById('filter-worst-domain');
  const tenureBand = document.getElementById('filter-tenure-band');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (overallRisk) {
    overallRisk.addEventListener('change', () => {
      filters.overallRisk = overallRisk.value;
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
      filters.overallRisk = '';
      filters.worstDomain = '';
      filters.tenureBand = '';
      if (search) search.value = '';
      if (overallRisk) overallRisk.value = '';
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
