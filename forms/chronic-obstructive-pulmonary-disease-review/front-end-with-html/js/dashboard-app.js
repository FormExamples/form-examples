import { fetchReviews } from './api.js';
import { sampleReviews } from './data.js';

// COPD annual review — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the review list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// review-type dropdown + GOLD dropdown + ABE dropdown + completeness dropdown +
// escalation dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReviewRow[]} */
let reviews = [];

const filters = {
  search: '',
  reviewType: '', // '' | 'routine-annual' | 'post-exacerbation' | 'opportunistic'
  gold: '',       // '' | '1' | '2' | '3' | '4'
  abe: '',        // '' | 'A' | 'B' | 'E'
  status: '',     // '' | 'complete' | 'partial' | 'incomplete'
  escalate: ''    // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'reviewType',        label: 'Review Type' },
  { key: 'goldGrade',         label: 'GOLD' },
  { key: 'abeGroup',          label: 'ABE' },
  { key: 'reviewStatus',      label: 'Completeness' },
  { key: 'escalationFlag',    label: 'Escalate' }
];

// Ranks used when sorting so classifications sort by severity, not locale.
const abeRank = { 'A': 0, 'B': 1, 'E': 2 };
const statusRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };

const reviewTypeLabels = {
  'routine-annual': 'Routine annual',
  'post-exacerbation': 'Post-exacerbation',
  'opportunistic': 'Opportunistic'
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

function goldClass(grade) {
  switch (grade) {
    case 1: return 'risk-low';
    case 2: return 'risk-moderate';
    case 3: return 'risk-high';
    case 4: return 'risk-high';
    default: return '';
  }
}

function goldLabel(grade) {
  return (grade === null || grade === undefined) ? 'N/A' : `GOLD ${grade}`;
}

function abeClass(group) {
  switch (group) {
    case 'A': return 'risk-low';
    case 'B': return 'risk-moderate';
    case 'E': return 'risk-high';
    default: return '';
  }
}

function abeLabel(group) {
  return group ? `Group ${group}` : 'N/A';
}

function statusClass(status) {
  switch (status) {
    case 'complete': return 'risk-low';
    case 'partial': return 'risk-moderate';
    case 'incomplete': return 'risk-high';
    default: return '';
  }
}

function statusLabel(status) {
  switch (status) {
    case 'complete': return 'Complete';
    case 'partial': return 'Partial';
    case 'incomplete': return 'Incomplete';
    default: return 'N/A';
  }
}

function reviewTypeLabel(type) {
  return reviewTypeLabels[type] || type || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.reviewType !== '' ||
    filters.gold !== '' ||
    filters.abe !== '' ||
    filters.status !== '' ||
    filters.escalate !== ''
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
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.reviewType && row.reviewType !== filters.reviewType) return false;
  if (filters.gold) {
    if (row.goldGrade === null || row.goldGrade !== Number(filters.gold)) {
      return false;
    }
  }
  if (filters.abe && row.abeGroup !== filters.abe) return false;
  if (filters.status && row.reviewStatus !== filters.status) return false;
  if (filters.escalate === 'yes' && !row.escalationFlag) return false;
  if (filters.escalate === 'no' && row.escalationFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. GOLD sorts nulls last; ABE and
 * completeness use their rank tables; the escalation boolean sorts false<true;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'goldGrade') {
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'abeGroup') {
    av = abeRank[av] ?? -1;
    bv = abeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'escalationFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, reviewType)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return reviews.filter(matchesFilters).slice().sort(compareRows);
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

function renderTableBody() {
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
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
    if (row.escalationFlag) {
      tr.classList.add('row-critical');
    }

    const goldCellClass = row.goldGrade === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(reviewTypeLabel(row.reviewType))}</td>
      <td><span class="${goldCellClass} risk-badge ${goldClass(row.goldGrade)}">${esc(goldLabel(row.goldGrade))}</span></td>
      <td><span class="risk-badge ${abeClass(row.abeGroup)}">${esc(abeLabel(row.abeGroup))}</span></td>
      <td><span class="risk-badge ${statusClass(row.reviewStatus)}">${esc(statusLabel(row.reviewStatus))}</span></td>
      <td>
        <span class="flag-badge ${row.escalationFlag ? 'flag-yes' : 'flag-no'}">
          ${row.escalationFlag ? 'Yes' : 'No'}
        </span>
      </td>
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
  const reviewType = document.getElementById('filter-review-type');
  const gold = document.getElementById('filter-gold');
  const abe = document.getElementById('filter-abe');
  const status = document.getElementById('filter-status');
  const escalate = document.getElementById('filter-escalate');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (reviewType) {
    reviewType.addEventListener('change', () => {
      filters.reviewType = reviewType.value;
      renderAll();
    });
  }
  if (gold) {
    gold.addEventListener('change', () => {
      filters.gold = gold.value;
      renderAll();
    });
  }
  if (abe) {
    abe.addEventListener('change', () => {
      filters.abe = abe.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (escalate) {
    escalate.addEventListener('change', () => {
      filters.escalate = escalate.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.reviewType = '';
      filters.gold = '';
      filters.abe = '';
      filters.status = '';
      filters.escalate = '';
      if (search) search.value = '';
      if (reviewType) reviewType.value = '';
      if (gold) gold.value = '';
      if (abe) abe.value = '';
      if (status) status.value = '';
      if (escalate) escalate.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReviews() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
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
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
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
