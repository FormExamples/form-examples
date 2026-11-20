import { fetchApplications } from './api.js';
import { sampleApplications } from './data.js';

// United States Marriage License Application — clerk / applicant review
// dashboard (vanilla classic-script app).
//
// On boot we fetch the application list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + class dropdown + state-rule dropdown).
//
// This dashboard is a governance / review tool. It surfaces the engine's
// eligibility class, the earliest permitted ceremony date, and whether the state
// rule needs verifying; it is documentation support, not legal advice.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
let applications = [];

const filters = {
  search: '',
  applicationClass: '',   // '' | 'ready-to-apply' | 'incomplete' | 'not-eligible'
  stateRule: ''    // '' | 'yes' | 'no'
};

// Default sort: applicants ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'applicants',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'reference',        label: 'Reference' },
  { key: 'applicants',             label: 'Applicants' },
  { key: 'earliestCeremony',          label: 'Earliest Ceremony' },
  { key: 'applicationClass',            label: 'Class' },
  { key: 'verifyStateRule', label: 'State Rule' },
  { key: 'jurisdiction',     label: 'Jurisdiction' }
];

// Rank tables so sorting is locale-independent and ordered by severity.
const validityRank = { 'ready-to-apply': 0, 'incomplete': 1, 'not-eligible': 2 };

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

function applicationClassName(cls) {
  if (cls === 'ready-to-apply') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'not-eligible') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'ready-to-apply') return 'Ready to apply';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'not-eligible') return 'Not eligible';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.applicationClass !== '' ||
    filters.stateRule !== ''
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
      row.reference.toLowerCase().includes(term) ||
      row.applicants.toLowerCase().includes(term) ||
      (row.earliestCeremony || '').toLowerCase().includes(term) ||
      (row.jurisdiction || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.applicationClass && row.applicationClass !== filters.applicationClass) return false;
  if (filters.stateRule) {
    const wantReferral = filters.stateRule === 'yes';
    if (Boolean(row.verifyStateRule) !== wantReferral) return false;
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
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'verifyStateRule') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (reference, applicants, earliestCeremony,
  // jurisdiction). Empty values sort last.
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
    // Highlight rows that need attention: incomplete documentation or a
    // coroner-referral case.
    if (row.applicationClass === 'incomplete' || row.verifyStateRule) {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.verifyStateRule
      ? `<span class="risk-badge risk-moderate">Verify</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.reference)}</td>
      <td>${esc(row.applicants)}</td>
      <td>${row.earliestCeremony ? esc(row.earliestCeremony) : '<span class="muted">Not determinable</span>'}</td>
      <td><span class="risk-badge ${applicationClassName(row.applicationClass)}">${esc(validityLabel(row.applicationClass))}</span></td>
      <td>${referralBadge}</td>
      <td>${row.jurisdiction ? esc(row.jurisdiction) : '<span class="muted">Not recorded</span>'}</td>
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
  const classSel = document.getElementById('filter-class');
  const referral = document.getElementById('filter-state-rule');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (classSel) {
    classSel.addEventListener('change', () => {
      filters.applicationClass = classSel.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.stateRule = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.applicationClass = '';
      filters.stateRule = '';
      if (search) search.value = '';
      if (classSel) classSel.value = '';
      if (referral) referral.value = '';
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
