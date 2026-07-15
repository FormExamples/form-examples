import { fetchSites } from './api.js';
import { sampleSites } from './data.js';

// Workplace Safety Assessment - safety officer dashboard
// (vanilla classic-script app).
//
// On boot we fetch the site list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + outcome dropdown + site-type dropdown + audit-recency
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WorkplaceSafetyAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').SiteRow[]} */
let sites = [];

const filters = {
  search: '',
  outcome: '',
  siteType: '',
  recency: '' // '', '30', '90', '180', '365', 'overdue'
};

// Default sort: outcome severity descending. Critical Findings sit at the
// top of the list, surfacing the sites that most need management attention.
const sortState = {
  key: 'outcome',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'siteName',      label: 'Site Name' },
  { key: 'location',      label: 'Location' },
  { key: 'siteType',      label: 'Site Type' },
  { key: 'outcome',       label: 'Outcome' },
  { key: 'lastAuditDate', label: 'Last Audit' },
  { key: 'openActions',   label: 'Open Actions' },
  { key: 'auditor',       label: 'Auditor' }
];

// Rank used when sorting the outcome column so 'Compliant' is always less
// than 'Critical Findings' regardless of locale. With descending sort this
// puts critical sites at the top of the list.
const outcomeRank = {
  'Compliant': 0,
  'Minor Findings': 1,
  'Major Findings': 2,
  'Critical Findings': 3
};

// Rank used when sorting the siteType column so the order is stable and
// reflects the dropdown order.
const siteTypeRank = {
  'NHS Hospital': 0,
  'GP Practice': 1,
  'Mental Health Unit': 2,
  'Dental Practice': 3,
  'Community Pharmacy': 4,
  'Ambulance Station': 5,
  'Care Home': 6,
  'Hospice': 7
};

// "Today" reference for the audit-recency filter. Captured once at module
// load so filtering is stable across renders within a single page session.
const NOW = new Date();

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

function outcomeClass(label) {
  if (!label) return '';
  return 'outcome-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/**
 * Days between an ISO date string and `NOW`. Positive = past, negative =
 * future. Returns `null` for unparseable input so callers can decide how
 * to render unknown dates.
 *
 * @param {string} isoDate
 * @returns {number | null}
 */
function daysSince(isoDate) {
  if (!isoDate) return null;
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return null;
  const ms = NOW.getTime() - t;
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/**
 * Format an ISO date as `DD MMM YYYY` for display.
 *
 * @param {string} isoDate
 */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const t = Date.parse(isoDate);
  if (Number.isNaN(t)) return isoDate;
  const d = new Date(t);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function openActionsClass(n) {
  if (!n || n === 0) return 'open-actions-zero';
  if (n <= 3) return 'open-actions-low';
  return 'open-actions-high';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.outcome !== '' ||
    filters.siteType !== '' ||
    filters.recency !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').SiteRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.siteName || '').toLowerCase().includes(term) ||
      String(row.location || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.outcome !== filters.outcome) {
    return false;
  }
  if (filters.siteType && row.siteType !== filters.siteType) {
    return false;
  }
  if (filters.recency) {
    const days = daysSince(row.lastAuditDate);
    if (days === null) return false;
    if (filters.recency === 'overdue') {
      if (days <= 365) return false;
    } else {
      const limit = parseInt(filters.recency, 10);
      if (Number.isNaN(limit) || days < 0 || days > limit) return false;
    }
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; dates compare as
 * milliseconds-since-epoch; everything else uses a locale-aware string
 * compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'outcome') {
    av = outcomeRank[av] ?? -1;
    bv = outcomeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'siteType') {
    av = siteTypeRank[av] ?? -1;
    bv = siteTypeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'openActions') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'lastAuditDate') {
    const at = av ? Date.parse(av) : 0;
    const bt = bv ? Date.parse(bv) : 0;
    return ((Number.isNaN(at) ? 0 : at) - (Number.isNaN(bt) ? 0 : bt)) * dir;
  }

  // Default: string compare (siteName, location, auditor)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return sites.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('sites-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.className = 'data-table-th';
    th.dataset.column = col.key;

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
  const body = document.getElementById('sites-table-body');
  const empty = document.getElementById('sites-empty-message');
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
    if (row.outcome === 'Critical Findings') {
      tr.classList.add('row-critical-findings');
    }

    const days = daysSince(row.lastAuditDate);
    const overdue = days !== null && days > 365;
    const dateClass = overdue ? 'audit-date audit-date-overdue' : 'audit-date';
    const dateLabel = overdue
      ? `${esc(formatDate(row.lastAuditDate))} (overdue)`
      : esc(formatDate(row.lastAuditDate));

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.siteName)}</td>
      <td class="data-table-td">${esc(row.location)}</td>
      <td class="data-table-td"><span class="site-type-badge">${esc(row.siteType)}</span></td>
      <td class="data-table-td"><span class="outcome-badge ${outcomeClass(row.outcome)}">${esc(row.outcome)}</span></td>
      <td class="data-table-td"><span class="${dateClass}">${dateLabel}</span></td>
      <td class="data-table-td">
        <span class="open-actions ${openActionsClass(row.openActions)}">
          ${esc(row.openActions ?? 0)}
        </span>
      </td>
      <td class="data-table-td">${esc(row.auditor)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = sites.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No sites to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} sites`;
  } else {
    el.textContent = `Showing ${shown} of ${total} sites`;
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
    // Categorical severity columns default to descending so the worst
    // outcomes / largest action counts surface first; the last-audit
    // column also defaults to descending so the most recent audits lead;
    // everything else ascends by default.
    if (key === 'outcome' || key === 'openActions' || key === 'lastAuditDate') {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const outcome = document.getElementById('filter-outcome');
  const siteType = document.getElementById('filter-site-type');
  const recency = document.getElementById('filter-recency');
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
  if (siteType) {
    siteType.addEventListener('change', () => {
      filters.siteType = siteType.value;
      renderAll();
    });
  }
  if (recency) {
    recency.addEventListener('change', () => {
      filters.recency = recency.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.outcome = '';
      filters.siteType = '';
      filters.recency = '';
      if (search) search.value = '';
      if (outcome) outcome.value = '';
      if (siteType) siteType.value = '';
      if (recency) recency.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadSites() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  sites = sampleSites;
  renderAll();

  try {
    const items = await fetchSites();
    if (items && items.length > 0) {
      sites = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no sites.'
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
  loadSites();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
