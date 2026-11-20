import { fetchApplications } from './api.js';
import { sampleApplications } from './data.js';

// United States vehicle title and registration application — clerk dashboard
// (vanilla ES-module app).
//
// On boot we fetch the application list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + class dropdown + brand-or-lien dropdown).
//
// This dashboard is a review tool. It surfaces the engine's application class,
// the VIN check, and the outstanding-item count; it is documentation support,
// not legal advice, and does not decide whether a title is issued.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
let applications = [];

const filters = {
  search: '',
  applicationClass: '', // '' | 'ready-to-submit' | 'incomplete' | 'title-brand-or-lien-issue'
  issue: ''             // '' | 'yes' | 'no'
};

// Default sort: owner name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'ownerName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'ownerName',            label: 'Owner' },
  { key: 'vin',                  label: 'VIN' },
  { key: 'state',                label: 'State' },
  { key: 'applicationClass',     label: 'Class' },
  { key: 'brandOrLienIssue',     label: 'Brand or Lien' },
  { key: 'outstandingItemCount', label: 'Outstanding Items' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const classRank = { 'ready-to-submit': 0, 'incomplete': 1, 'title-brand-or-lien-issue': 2 };

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

function classBadgeName(cls) {
  if (cls === 'ready-to-submit') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'title-brand-or-lien-issue') return 'risk-high';
  return '';
}

function classLabel(cls) {
  if (cls === 'ready-to-submit') return 'Ready to submit';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'title-brand-or-lien-issue') return 'Title brand or lien issue';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.applicationClass !== '' ||
    filters.issue !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ApplicationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.ownerName.toLowerCase().includes(term) ||
      row.vin.toLowerCase().includes(term) ||
      (row.state || '').toLowerCase().includes(term) ||
      (row.vehicle || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.applicationClass && row.applicationClass !== filters.applicationClass) return false;
  if (filters.issue) {
    const wantIssue = filters.issue === 'yes';
    if (Boolean(row.brandOrLienIssue) !== wantIssue) return false;
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

  if (key === 'applicationClass') {
    return ((classRank[av] ?? 99) - (classRank[bv] ?? 99)) * dir;
  }
  if (key === 'brandOrLienIssue') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }
  if (key === 'outstandingItemCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (ownerName, vin, state). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return applications.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: an incomplete application or a
    // title brand or lien issue.
    if (row.applicationClass === 'incomplete' || row.brandOrLienIssue) {
      tr.classList.add('row-critical');
    }

    const issueBadge = row.brandOrLienIssue
      ? `<span class="risk-badge risk-high">Issue</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.ownerName)}</td>
      <td>${esc(row.vin)}</td>
      <td>${row.state ? esc(row.state) : '<span class="muted">Not set</span>'}</td>
      <td><span class="risk-badge ${classBadgeName(row.applicationClass)}">${esc(classLabel(row.applicationClass))}</span></td>
      <td>${issueBadge}</td>
      <td>${esc(row.outstandingItemCount)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = applications.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No applications to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} applications`;
  } else {
    el.textContent = `Showing ${shown} of ${total} applications`;
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
  const classSelect = document.getElementById('filter-validity');
  const issue = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (classSelect) {
    classSelect.addEventListener('change', () => {
      filters.applicationClass = classSelect.value;
      renderAll();
    });
  }
  if (issue) {
    issue.addEventListener('change', () => {
      filters.issue = issue.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.applicationClass = '';
      filters.issue = '';
      if (search) search.value = '';
      if (classSelect) classSelect.value = '';
      if (issue) issue.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadApplications() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  applications = sampleApplications;
  renderAll();

  try {
    const items = await fetchApplications();
    if (items && items.length > 0) {
      applications = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no applications.');
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
  loadApplications();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
