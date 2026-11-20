import { fetchRegistrations } from './api.js';
import { sampleRegistrations } from './data.js';

// United Kingdom Birth Registration — registrar / applicant-support
// dashboard (vanilla ES-module app).
//
// On boot we fetch the application list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + readiness-class dropdown + late-registration dropdown).
//
// This dashboard is a review tool. It surfaces the engine's readiness
// classification, the days since birth against the 42-day statutory period, and
// the late-registration indicator; it makes NO statutory decision and does not
// register any birth.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').RegistrationRow[]} */
let registrations = [];

const filters = {
  search: '',
  readiness: '',  // '' | 'ready-to-submit' | 'incomplete' | 'needs-additional-evidence' | 'out-of-scope'
  late: ''        // '' | 'yes' | 'no'
};

// Default sort: child name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'childName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'reference',        label: 'Reference' },
  { key: 'childName',        label: 'Child' },
  { key: 'daysSinceBirth',   label: 'Days Since Birth' },
  { key: 'readinessClass',   label: 'Readiness' },
  { key: 'lateRegistration', label: 'Late' },
  { key: 'informantName',    label: 'Informant' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const readinessRank = { 'ready-to-submit': 0, 'incomplete': 1, 'needs-additional-evidence': 2, 'out-of-scope': 3 };

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
  if (cls === 'ready-to-submit') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'needs-additional-evidence') return 'risk-high';
  if (cls === 'out-of-scope') return 'risk-high';
  return '';
}

function readinessLabel(cls) {
  if (cls === 'ready-to-submit') return 'Ready to submit';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'needs-additional-evidence') return 'Needs additional evidence';
  if (cls === 'out-of-scope') return 'Out of scope';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.readiness !== '' ||
    filters.late !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').RegistrationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.reference.toLowerCase().includes(term) ||
      row.childName.toLowerCase().includes(term) ||
      (row.informantName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.readiness && row.readinessClass !== filters.readiness) return false;
  if (filters.late) {
    const wantLate = filters.late === 'yes';
    if (Boolean(row.lateRegistration) !== wantLate) return false;
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
    return ((readinessRank[av] ?? 99) - (readinessRank[bv] ?? 99)) * dir;
  }
  if (key === 'lateRegistration') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }
  if (key === 'daysSinceBirth') {
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (reference, childName, informantName). Empty
  // values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return registrations.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: an incomplete application or a late
    // registration.
    if (row.readinessClass === 'incomplete' || row.lateRegistration) {
      tr.classList.add('row-critical');
    }

    const lateBadge = row.lateRegistration
      ? `<span class="risk-badge risk-high">Late</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.reference)}</td>
      <td>${esc(row.childName)}</td>
      <td>${row.daysSinceBirth === null || row.daysSinceBirth === undefined ? '<span class="muted">Not known</span>' : esc(row.daysSinceBirth)}</td>
      <td><span class="risk-badge ${readinessClassName(row.readinessClass)}">${esc(readinessLabel(row.readinessClass))}</span></td>
      <td>${lateBadge}</td>
      <td>${row.informantName ? esc(row.informantName) : '<span class="muted">Not recorded</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = registrations.length;
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
  const readiness = document.getElementById('filter-readiness');
  const late = document.getElementById('filter-late');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (readiness) {
    readiness.addEventListener('change', () => {
      filters.readiness = readiness.value;
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
      filters.readiness = '';
      filters.late = '';
      if (search) search.value = '';
      if (readiness) readiness.value = '';
      if (late) late.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRegistrations() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  registrations = sampleRegistrations;
  renderAll();

  try {
    const items = await fetchRegistrations();
    if (items && items.length > 0) {
      registrations = items;
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
  loadRegistrations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
