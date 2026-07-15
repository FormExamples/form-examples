import { fetchReferrals } from './api.js';
import { sampleReferrals } from './data.js';

// Child Safeguarding Referral — duty-team dashboard (vanilla classic-script
// app).
//
// On boot we fetch the referral list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// status dropdown + urgency dropdown + category dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ReferralRow[]} */
let referrals = [];

const filters = {
  search: '',
  status: '',    // '' | 'complete' | 'partial' | 'incomplete'
  urgency: '',   // '' | 'emergency' | 'urgent' | 'standard'
  category: ''   // '' | 'physical' | 'emotional' | 'sexual' | 'neglect'
};

// Default sort: urgency descending (most urgent first), then child name.
const sortState = {
  key: 'urgency',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'childReference',      label: 'Child Ref' },
  { key: 'childName',           label: 'Child Name' },
  { key: 'status',              label: 'Status' },
  { key: 'completenessPercent', label: 'Completeness' },
  { key: 'urgency',             label: 'Urgency' },
  { key: 'primaryCategory',     label: 'Category' },
  { key: 'referredAt',          label: 'Referred' }
];

// Ranks used when sorting so the categorical columns order semantically rather
// than alphabetically.
const statusRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };
const urgencyRank = { 'emergency': 0, 'urgent': 1, 'standard': 2 };

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

function statusClass(status) {
  if (status === 'complete') return 'risk-low';
  if (status === 'partial') return 'risk-moderate';
  if (status === 'incomplete') return 'risk-high';
  return '';
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'partial') return 'Partial';
  if (status === 'incomplete') return 'Incomplete';
  return 'N/A';
}

function urgencyClass(urgency) {
  if (urgency === 'emergency') return 'risk-critical';
  if (urgency === 'urgent') return 'risk-high';
  if (urgency === 'standard') return 'risk-low';
  return '';
}

function urgencyLabel(urgency) {
  if (urgency === 'emergency') return 'Emergency';
  if (urgency === 'urgent') return 'Urgent (s47)';
  if (urgency === 'standard') return 'Standard (s17)';
  return 'N/A';
}

function categoryLabel(value) {
  switch (value) {
    case 'physical': return 'Physical';
    case 'emotional': return 'Emotional';
    case 'sexual': return 'Sexual';
    case 'neglect': return 'Neglect';
    default: return 'Not recorded';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.urgency !== '' ||
    filters.category !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ReferralRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.childReference.toLowerCase().includes(term) ||
      row.childName.toLowerCase().includes(term) ||
      (row.referrerName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.status !== filters.status) return false;
  if (filters.urgency && row.urgency !== filters.urgency) return false;
  if (filters.category && row.primaryCategory !== filters.category) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The status and urgency columns
 * use their rank tables; completenessPercent sorts numerically; everything else
 * uses a locale-aware string compare with empty values sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'status') {
    av = statusRank[av] ?? 99;
    bv = statusRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'urgency') {
    av = urgencyRank[av] ?? 99;
    bv = urgencyRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'completenessPercent') {
    const an = typeof av === 'number' ? av : -1;
    const bn = typeof bv === 'number' ? bv : -1;
    return (an - bn) * dir;
  }

  // Default: string compare (childReference, childName, primaryCategory, referredAt)
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return referrals.filter(matchesFilters).slice().sort(compareRows);
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

  if (rows.length === 0) {
    if (empty) empty.hidden = false;
  } else {
    if (empty) empty.hidden = true;
  }

  for (const row of rows) {
    const tr = document.createElement('tr');
    // Highlight rows that need the duty team's attention first: an emergency,
    // a child in immediate danger, or an incomplete referral.
    if (
      row.urgency === 'emergency' ||
      row.immediateDanger ||
      row.status === 'incomplete'
    ) {
      tr.classList.add('row-critical');
    }

    const dangerBadge = row.immediateDanger
      ? ' <span class="flag-badge flag-yes">Immediate danger</span>'
      : '';

    tr.innerHTML = `
      <td>${esc(row.childReference)}</td>
      <td>${esc(row.childName)}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(String(row.completenessPercent))}%</span></td>
      <td><span class="risk-badge ${urgencyClass(row.urgency)}">${esc(urgencyLabel(row.urgency))}</span>${dangerBadge}</td>
      <td>${esc(categoryLabel(row.primaryCategory))}</td>
      <td>${esc(row.referredAt || 'Not set')}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = referrals.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No referrals to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} referrals`;
  } else {
    el.textContent = `Showing ${shown} of ${total} referrals`;
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
  const status = document.getElementById('filter-status');
  const urgency = document.getElementById('filter-urgency');
  const category = document.getElementById('filter-category');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (category) {
    category.addEventListener('change', () => {
      filters.category = category.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.urgency = '';
      filters.category = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (urgency) urgency.value = '';
      if (category) category.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadReferrals() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  referrals = sampleReferrals;
  renderAll();

  try {
    const items = await fetchReferrals();
    if (items && items.length > 0) {
      referrals = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no referrals.');
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
  loadReferrals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
