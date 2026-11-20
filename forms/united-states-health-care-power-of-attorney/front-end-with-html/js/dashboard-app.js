import { fetchDirectives } from './api.js';
import { sampleDirectives } from './data.js';

// United States Health Care Power of Attorney — reviewer dashboard (vanilla
// ES-module app).
//
// On boot we fetch the directive list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + readiness-class dropdown + execution-risk dropdown).
//
// This dashboard is a governance / review tool. It surfaces the engine's
// readiness classification, the state rule applied, and the execution-risk
// indication; it gives NO legal advice and does not decide whether a directive
// is valid.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').DirectiveRow[]} */
let directives = [];

const filters = {
  search: '',
  validity: '',   // '' | 'ready-to-execute' | 'incomplete' | 'execution-risk'
  referral: ''    // '' | 'yes' | 'no'
};

// Default sort: principal name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'principalName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'state',          label: 'State' },
  { key: 'principalName',  label: 'Principal' },
  { key: 'agentName',      label: 'Agent' },
  { key: 'readinessClass', label: 'Readiness' },
  { key: 'executionRisk',  label: 'Execution Risk' },
  { key: 'reviewerName',   label: 'Reviewer' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'ready-to-execute': 0, 'incomplete': 1, 'execution-risk': 2 };

// ----------------------------------------------------------------------
// Label / class helpers (dashboard-local; no dependency on the form engine)
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

function readinessClassName(cls) {
  if (cls === 'ready-to-execute') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'execution-risk') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'ready-to-execute') return 'Ready to execute';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'execution-risk') return 'Execution risk';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').DirectiveRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.state.toLowerCase().includes(term) ||
      row.principalName.toLowerCase().includes(term) ||
      (row.agentName || '').toLowerCase().includes(term) ||
      (row.reviewerName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.readinessClass !== filters.validity) return false;
  if (filters.referral) {
    const wantReferral = filters.referral === 'yes';
    if (Boolean(row.executionRisk) !== wantReferral) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Ranked columns use their rank
 * tables; everything else uses a locale-aware string compare with empty values
 * sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'readinessClass') {
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'executionRisk') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (state, principalName, agentName,
  // reviewerName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return directives.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('patients-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '↕';
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

function renderTableBody() {
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    // Highlight rows that need attention: an incomplete or at-risk directive.
    if (row.readinessClass === 'incomplete' || row.executionRisk) {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.executionRisk
      ? `<span class="risk-badge risk-high">At risk</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.state)}</td>
      <td>${esc(row.principalName)}</td>
      <td>${row.agentName ? esc(row.agentName) : '<span class="muted">Not named</span>'}</td>
      <td><span class="risk-badge ${readinessClassName(row.readinessClass)}">${esc(validityLabel(row.readinessClass))}</span></td>
      <td>${referralBadge}</td>
      <td>${row.reviewerName ? esc(row.reviewerName) : '<span class="muted">Not recorded</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = directives.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No directives to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} directives`;
  } else {
    el.textContent = `Showing ${shown} of ${total} directives`;
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const validity = document.getElementById('filter-validity');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.validity = validity.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.referral = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadDirectives() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  directives = sampleDirectives;
  renderAll();

  try {
    const items = await fetchDirectives();
    if (items && items.length > 0) {
      directives = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no directives.');
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
  loadDirectives();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
