import { fetchApplications } from './api.js';
import { sampleApplications } from './data.js';

// United States Property Tax Exemption Application - assessor / applicant
// dashboard (vanilla classic-script app).
//
// On boot we fetch the application list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + eligibility-class dropdown + late-filing dropdown).
//
// This dashboard is a review tool. It surfaces the engine's eligibility
// classification, the exemptions claimed and the late-filing indication; it is
// documentation support, not legal advice, and the county assessor decides.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
let applications = [];

const filters = {
  search: '',
  eligibility: '',   // '' | 'likely-eligible' | 'incomplete' | 'likely-ineligible'
  late: ''    // '' | 'yes' | 'no'
};

// Default sort: applicant name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'applicantName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'parcelNumber',        label: 'Parcel' },
  { key: 'applicantName',             label: 'Applicant' },
  { key: 'exemptionsClaimed',          label: 'Exemptions' },
  { key: 'eligibilityClass',            label: 'Eligibility' },
  { key: 'filedLate', label: 'Filed late' },
  { key: 'countyState',     label: 'County, state' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const eligibilityRank = { 'likely-eligible': 0, 'incomplete': 1, 'likely-ineligible': 2 };

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

function eligibilityClassName(cls) {
  if (cls === 'likely-eligible') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'likely-ineligible') return 'risk-high';
  return '';
}

function eligibilityLabel(cls) {
  if (cls === 'likely-eligible') return 'Likely eligible';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'likely-ineligible') return 'Likely ineligible';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.eligibility !== '' ||
    filters.late !== ''
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
      row.parcelNumber.toLowerCase().includes(term) ||
      row.applicantName.toLowerCase().includes(term) ||
      (row.exemptionsClaimed || '').toLowerCase().includes(term) ||
      (row.countyState || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.eligibility && row.eligibilityClass !== filters.eligibility) return false;
  if (filters.late) {
    const wantReferral = filters.late === 'yes';
    if (Boolean(row.filedLate) !== wantReferral) return false;
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

  if (key === 'eligibilityClass') {
    return ((eligibilityRank[av] ?? 99) - (eligibilityRank[bv] ?? 99)) * dir;
  }
  if (key === 'filedLate') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (parcelNumber, applicantName, exemptionsClaimed,
  // countyState). Empty values sort last.
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
    // late filing.
    if (row.eligibilityClass === 'incomplete' || row.filedLate) {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.filedLate
      ? `<span class="risk-badge risk-high">Late</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.parcelNumber)}</td>
      <td>${esc(row.applicantName)}</td>
      <td>${row.exemptionsClaimed ? esc(row.exemptionsClaimed) : '<span class="muted">None</span>'}</td>
      <td><span class="risk-badge ${eligibilityClassName(row.eligibilityClass)}">${esc(eligibilityLabel(row.eligibilityClass))}</span></td>
      <td>${referralBadge}</td>
      <td>${row.countyState ? esc(row.countyState) : '<span class="muted">Not recorded</span>'}</td>
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
  const eligibility = document.getElementById('filter-eligibility');
  const late = document.getElementById('filter-late');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (eligibility) {
    eligibility.addEventListener('change', () => {
      filters.eligibility = eligibility.value;
      renderAll();
    });
  }
  if (late) {
    late.addEventListener('change', () => {
      filters.late = late.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.eligibility = '';
      filters.late = '';
      if (search) search.value = '';
      if (eligibility) eligibility.value = '';
      if (late) late.value = '';
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
