import { fetchClaims } from './api.js';
import { sampleClaims } from './data.js';

// Expense Reimbursement — claims dashboard (vanilla classic-script app).
//
// On boot we fetch the claim list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// approval-tier dropdown + compliance-band dropdown + recommendation dropdown +
// flags dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ClaimRow[]} */
let claims = [];

const filters = {
  search: '',
  approval: '',
  compliance: '',
  recommendation: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent claim first.
const sortState = {
  key: 'claimDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'worker',              label: 'Worker' },
  { key: 'department',          label: 'Department' },
  { key: 'claimTitle',          label: 'Claim' },
  { key: 'total',               label: 'Total' },
  { key: 'complianceBand',      label: 'Compliance' },
  { key: 'approvalTier',        label: 'Approval' },
  { key: 'completenessPercent', label: 'Complete' },
  { key: 'recommendation',      label: 'Recommendation' },
  { key: 'manager',             label: 'Approver' },
  { key: 'claimDate',           label: 'Claim Date' },
  { key: 'flags',               label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const complianceRank = {
  'compliant': 0,
  'needs-review': 1,
  'likely-ineligible': 2
};

const approvalRank = {
  'line-manager': 0,
  'budget-holder': 1,
  'finance-review': 2
};

const recommendationRank = {
  'approve': 0,
  'escalate': 1,
  'request-more-information': 2,
  'reject': 3
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

function complianceClass(band) {
  return band ? 'comp-' + String(band) : '';
}

function approvalClass(tier) {
  return tier ? 'appr-' + String(tier) : '';
}

function recommendationClass(rec) {
  return rec ? 'rec-' + String(rec) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.approval !== '' ||
    filters.compliance !== '' ||
    filters.recommendation !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ClaimRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.worker || '').toLowerCase().includes(term) ||
      String(row.jobTitle || '').toLowerCase().includes(term) ||
      String(row.department || '').toLowerCase().includes(term) ||
      String(row.claimTitle || '').toLowerCase().includes(term) ||
      String(row.manager || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.approval && row.approvalTier !== filters.approval) return false;
  if (filters.compliance && row.complianceBand !== filters.compliance) return false;
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

  if (key === 'complianceBand') {
    return ((complianceRank[av] ?? -1) - (complianceRank[bv] ?? -1)) * dir;
  }
  if (key === 'approvalTier') {
    return ((approvalRank[av] ?? -1) - (approvalRank[bv] ?? -1)) * dir;
  }
  if (key === 'recommendation') {
    return ((recommendationRank[av] ?? -1) - (recommendationRank[bv] ?? -1)) * dir;
  }
  if (key === 'completenessPercent' || key === 'total') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'flags') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }
  // Default: string compare (worker, department, claimTitle, manager,
  // claimDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return claims.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('claims-table-head');
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
  const body = document.getElementById('claims-table-body');
  const empty = document.getElementById('claims-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.complianceBand === 'likely-ineligible') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.worker)}</strong><br><span class="muted">${esc(row.jobTitle)}</span></td>
      <td class="data-table-td">${esc(row.department)}</td>
      <td class="data-table-td">${esc(row.claimTitle)}</td>
      <td class="data-table-td"><span class="numeric-cell">${esc(Number(row.total).toFixed(2))}</span></td>
      <td class="data-table-td"><span class="band-badge ${complianceClass(row.complianceBand)}">${esc(titleCase(row.complianceBand))}</span></td>
      <td class="data-table-td"><span class="tier-badge ${approvalClass(row.approvalTier)}">${esc(titleCase(row.approvalTier))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.completenessPercent)}%</span></td>
      <td class="data-table-td"><span class="band-badge ${recommendationClass(row.recommendation)}">${esc(titleCase(row.recommendation))}</span></td>
      <td class="data-table-td">${esc(row.manager)}</td>
      <td class="data-table-td"><span class="date-cell">${esc(row.claimDate)}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = claims.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No claims to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} claims`;
  } else {
    el.textContent = `Showing ${shown} of ${total} claims`;
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
 * Roll up the rows currently in view: claim count, total value, the share
 * needing review or ineligible, and average completeness. Reflects the active
 * filters.
 */
function renderAnalytics() {
  const el = document.getElementById('analytics');
  if (!el) return;
  const rows = visibleRows();
  const total = rows.length;
  const count = (pred) => rows.filter(pred).length;
  const compliant = count((r) => r.complianceBand === 'compliant');
  const ineligible = count((r) => r.complianceBand === 'likely-ineligible');
  const finance = count((r) => r.approvalTier === 'finance-review');
  const value = rows.reduce((a, r) => a + (Number(r.total) || 0), 0);
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
    stat('Claims in view', String(total), '') +
    stat('Total value', value.toFixed(2), '') +
    stat('Policy compliant', analyticsPct(compliant, total) + '%', 'good') +
    stat('Likely ineligible', analyticsPct(ineligible, total) + '%', ineligible ? 'bad' : '') +
    stat('Needs finance', analyticsPct(finance, total) + '%', finance ? 'warn' : '') +
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
    // Claim-date column defaults to descending (most recent first);
    // everything else defaults to ascending.
    sortState.direction = key === 'claimDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const approval = document.getElementById('filter-approval');
  const compliance = document.getElementById('filter-compliance');
  const recSel = document.getElementById('filter-recommendation');
  const flags = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (approval) {
    approval.addEventListener('change', () => {
      filters.approval = approval.value;
      renderAll();
    });
  }
  if (compliance) {
    compliance.addEventListener('change', () => {
      filters.compliance = compliance.value;
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
      filters.approval = '';
      filters.compliance = '';
      filters.recommendation = '';
      filters.flags = '';
      if (search) search.value = '';
      if (approval) approval.value = '';
      if (compliance) compliance.value = '';
      if (recSel) recSel.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadClaims() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  claims = sampleClaims;
  renderAll();

  try {
    const items = await fetchClaims();
    if (items && items.length > 0) {
      claims = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no claims.'
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
  loadClaims();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
