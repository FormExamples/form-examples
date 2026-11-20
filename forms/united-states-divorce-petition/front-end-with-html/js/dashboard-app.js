import { fetchPetitions } from './api.js';
import { samplePetitions } from './data.js';

// United States Divorce Petition: petitions dashboard (vanilla script app).
//
// On boot we fetch the petition list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// readiness-class dropdown + case-type dropdown).
//
// This dashboard is a review tool. It surfaces the engine's readiness
// classification, the earliest permitted decree date and the case type; it gives
// no legal advice and the court decides.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').PetitionRow[]} */
let petitions = [];

const filters = {
  search: '',
  validity: '',   // '' | 'ready-to-file' | 'incomplete' | 'not-yet-eligible'
  referral: ''    // '' | 'uncontested' | 'contested' (case type)
};

// Default sort: petitioner name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'petitionerName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'petitionerName',     label: 'Petitioner' },
  { key: 'respondentName',     label: 'Respondent' },
  { key: 'state',              label: 'State' },
  { key: 'caseType',           label: 'Case Type' },
  { key: 'readinessClass',     label: 'Readiness' },
  { key: 'earliestDecreeDate', label: 'Earliest Decree' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'ready-to-file': 0, 'incomplete': 1, 'not-yet-eligible': 2 };

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

function validityClassName(cls) {
  if (cls === 'ready-to-file') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'not-yet-eligible') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'ready-to-file') return 'Ready to file';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'not-yet-eligible') return 'Not yet eligible';
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
 * @param {import('./dashboard-types.js').PetitionRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      (row.petitionerName || '').toLowerCase().includes(term) ||
      (row.respondentName || '').toLowerCase().includes(term) ||
      (row.state || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.readinessClass !== filters.validity) return false;
  if (filters.referral && row.caseType !== filters.referral) return false;
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

  // Default: string compare (petitionerName, respondentName, state,
  // caseType, earliestDecreeDate). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return petitions.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: incomplete or not-yet-eligible.
    if (row.readinessClass === 'incomplete' || row.readinessClass === 'not-yet-eligible') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.petitionerName)}</td>
      <td>${esc(row.respondentName)}</td>
      <td>${esc(row.state)}</td>
      <td>${esc(row.caseType)}</td>
      <td><span class="risk-badge ${validityClassName(row.readinessClass)}">${esc(validityLabel(row.readinessClass))}</span></td>
      <td>${row.earliestDecreeDate ? esc(row.earliestDecreeDate) : '<span class="muted">Not determinable</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = petitions.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No petitions to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} petitions`;
  } else {
    el.textContent = `Showing ${shown} of ${total} petitions`;
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

async function loadPetitions() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  petitions = samplePetitions;
  renderAll();

  try {
    const items = await fetchPetitions();
    if (items && items.length > 0) {
      petitions = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no petitions.');
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
  loadPetitions();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
