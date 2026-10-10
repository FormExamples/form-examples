import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// UK NHS DTAC assessor dashboard (vanilla ES-module app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// table is sortable (click a column header) and filterable (search, outcome,
// flags).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  outcome: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent date first, so the latest assessments appear at
// the top of the dashboard. Critical cases are also visually highlighted via
// the row-critical row class.
const sortState = {
  key: 'date',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'date',        label: 'Date' },
  { key: 'assessment',  label: 'Assessment' },
  { key: 'supplier',    label: 'Supplier' },
  { key: 'product',     label: 'Product' },
  { key: 'outcome',     label: 'Outcome' },
  { key: 'mandatory',   label: 'Mandatory met' },
  { key: 'advisory',    label: 'Advisory met' },
  { key: 'flags',       label: 'Flags' },
  { key: 'assessor',    label: 'Assessor' }
];

// Rank used when sorting the outcome column (worst first when ascending).
const outcomeRank = {
  'does-not-meet': 0,
  'incomplete': 1,
  'conditional': 2,
  'meets': 3
};

const outcomeLabels = {
  'meets': 'Meets',
  'conditional': 'Meets with conditions',
  'does-not-meet': 'Does not meet',
  'incomplete': 'Incomplete'
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

// Outcomes reuse the shared dashboard badge palette (css/dashboard.css).
const outcomeBadge = {
  'meets': 'risk-low',
  'conditional': 'risk-moderate',
  'incomplete': 'risk-high',
  'does-not-meet': 'risk-critical'
};

function outcomeClass(outcome) {
  return outcomeBadge[outcome] || '';
}

function hasActiveFilters() {
  return filters.search !== '' || filters.outcome !== '' || filters.flags !== '';
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').AssessmentRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.assessment || '').toLowerCase().includes(term) ||
      String(row.supplier || '').toLowerCase().includes(term) ||
      String(row.product || '').toLowerCase().includes(term) ||
      String(row.assessor || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.outcome !== filters.outcome) return false;
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

/** Compare two rows for the active sort column. */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;

  if (key === 'outcome') {
    return ((outcomeRank[a.outcome] ?? -1) - (outcomeRank[b.outcome] ?? -1)) * dir;
  }
  if (key === 'mandatory') return ((a.mandatoryMet ?? 0) - (b.mandatoryMet ?? 0)) * dir;
  if (key === 'advisory') return ((a.advisoryMet ?? 0) - (b.advisoryMet ?? 0)) * dir;
  if (key === 'flags') {
    const an = Array.isArray(a.flags) ? a.flags.length : 0;
    const bn = Array.isArray(b.flags) ? b.flags.length : 0;
    return (an - bn) * dir;
  }
  return String(a[key] ?? '').localeCompare(String(b[key] ?? '')) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('assessments-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
    th.scope = 'col';
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

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">\u2014</span>';
  }
  const chips = flags
    .map((f) => `<span class="flag-chip">${esc(f)}</span>`)
    .join('');
  return `<div class="flag-list">${chips}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('assessments-table-body');
  const empty = document.getElementById('assessments-empty-message');
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
    if (row.outcome === 'does-not-meet') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><span class="date-cell">${esc(row.date)}</span></td>
      <td class="data-table-td"><strong>${esc(row.assessment)}</strong></td>
      <td class="data-table-td">${esc(row.supplier)}</td>
      <td class="data-table-td">${esc(row.product)}</td>
      <td class="data-table-td"><span class="risk-badge ${outcomeClass(row.outcome)}">${esc(outcomeLabels[row.outcome] || row.outcome)}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.mandatoryMet)} / ${esc(row.mandatoryTotal)}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.advisoryMet)} / ${esc(row.advisoryTotal)}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>
      <td class="data-table-td">${esc(row.assessor)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = assessments.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} assessments`;
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
    // Date column defaults to descending (most recent first); everything
    // else defaults to ascending.
    sortState.direction = key === 'date' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const outcome = document.getElementById('filter-outcome');
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
      filters.flags = '';
      if (search) search.value = '';
      if (outcome) outcome.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
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
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
