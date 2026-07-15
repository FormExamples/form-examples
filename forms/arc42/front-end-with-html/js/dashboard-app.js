import { fetchDocuments } from './api.js';
import { sampleDocuments } from './data.js';

// arc42 — architecture dashboard (vanilla classic-script app).
//
// On boot we fetch the document list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + maturity dropdown + recommendation dropdown). Maturity band, completed-
// section count, flag count, and recommendation all come from the shared engine
// output so the dashboard and report stay aligned.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').DashboardRow[]} */
let documents = [];

const filters = {
  search: '',
  maturity: '',
  recommendation: ''
};

// Default sort: architecture name ascending (matches the Svelte dashboard).
const sortState = {
  key: 'name',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'id',               label: 'Document' },
  { key: 'name',             label: 'Architecture' },
  { key: 'owner',            label: 'Owner' },
  { key: 'updatedDate',      label: 'Updated' },
  { key: 'maturity',         label: 'Maturity' },
  { key: 'sectionsComplete', label: 'Complete' },
  { key: 'flagCount',        label: 'Flags' },
  { key: 'recommendation',   label: 'Recommendation' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const maturityRank = {
  '': -1,
  'draft': 0,
  'reviewable': 1,
  'ready': 2,
  'mature': 3
};

const recommendationRank = {
  '': -1,
  'proceed': 0,
  'revise-first': 1,
  'block': 2
};

const MATURITY_LABELS = {
  'draft': 'Draft',
  'reviewable': 'Reviewable',
  'ready': 'Ready',
  'mature': 'Mature'
};

const RECOMMENDATION_LABELS = {
  'proceed': 'Proceed',
  'revise-first': 'Revise first',
  'block': 'Block'
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function maturityLabel(m) { return MATURITY_LABELS[m] || '—'; }
function recommendationLabel(r) { return RECOMMENDATION_LABELS[r] || '—'; }
function maturityClass(m) { return m ? 'maturity-' + String(m) : ''; }
function recommendationClass(r) { return r ? 'rec-' + String(r) : ''; }

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.maturity !== '' ||
    filters.recommendation !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').DashboardRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.name || '').toLowerCase().includes(term) ||
      String(row.owner || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.maturity && row.maturity !== filters.maturity) return false;
  if (filters.recommendation && row.recommendation !== filters.recommendation) return false;
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

  if (key === 'maturity') {
    return ((maturityRank[av] == null ? -1 : maturityRank[av]) - (maturityRank[bv] == null ? -1 : maturityRank[bv])) * dir;
  }
  if (key === 'recommendation') {
    return ((recommendationRank[av] == null ? -1 : recommendationRank[av]) - (recommendationRank[bv] == null ? -1 : recommendationRank[bv])) * dir;
  }
  if (key === 'sectionsComplete' || key === 'flagCount') {
    return ((av == null ? 0 : av) - (bv == null ? 0 : bv)) * dir;
  }
  // Default: string compare (id, name, owner, updatedDate).
  return String(av == null ? '' : av).localeCompare(String(bv == null ? '' : bv)) * dir;
}

function visibleRows() {
  return documents.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('documents-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
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
  const body = document.getElementById('documents-table-body');
  const empty = document.getElementById('documents-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.maturity === 'draft' || row.flagCount >= 6) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td"><span class="doc-id">${esc(row.id)}</span></td>
      <td class="data-table-td"><strong>${esc(row.name)}</strong></td>
      <td class="data-table-td">${esc(row.owner)}</td>
      <td class="data-table-td"><span class="date-cell">${esc(row.updatedDate)}</span></td>
      <td class="data-table-td"><span class="maturity-badge ${maturityClass(row.maturity)}">${esc(maturityLabel(row.maturity))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.sectionsComplete)}/12</span></td>
      <td class="data-table-td"><span class="numeric-cell${row.flagCount > 0 ? ' flag-count' : ''}">${esc(row.flagCount)}</span></td>
      <td class="data-table-td"><span class="rec-badge ${recommendationClass(row.recommendation)}">${esc(recommendationLabel(row.recommendation))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = documents.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No documents to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} documents`;
  } else {
    el.textContent = `Showing ${shown} of ${total} documents`;
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
    // Numeric and date columns default to descending (largest / newest first);
    // everything else defaults to ascending.
    sortState.direction =
      (key === 'updatedDate' || key === 'sectionsComplete' || key === 'flagCount')
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const maturity = document.getElementById('filter-maturity');
  const recSel = document.getElementById('filter-recommendation');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (maturity) {
    maturity.addEventListener('change', () => {
      filters.maturity = maturity.value;
      renderAll();
    });
  }
  if (recSel) {
    recSel.addEventListener('change', () => {
      filters.recommendation = recSel.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.maturity = '';
      filters.recommendation = '';
      if (search) search.value = '';
      if (maturity) maturity.value = '';
      if (recSel) recSel.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadDocuments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  documents = sampleDocuments;
  renderAll();

  try {
    const items = await fetchDocuments();
    if (items && items.length > 0) {
      documents = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no documents.'
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
  loadDocuments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
