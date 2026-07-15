import { fetchScreenings } from './api.js';
import { sampleScreenings } from './data.js';

// AAA Screening — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the screening list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + category dropdown + referral dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.AbdominalAorticAneurysmScreeningDashboard`. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
let screenings = [];

const filters = {
  search: '',
  category: '',  // '' | 'normal' | 'small' | 'medium' | 'large' | 'non-visualised'
  referral: ''   // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'clinicSite',          label: 'Clinic / Site' },
  { key: 'maxAorticDiameterCm', label: 'Diameter (cm)' },
  { key: 'category',            label: 'Category' },
  { key: 'referralFlag',        label: 'Refer' }
];

// Rank used when sorting the category column so mild categories sort below
// severe ones regardless of locale.
const categoryRank = {
  'normal': 0,
  'small': 1,
  'medium': 2,
  'large': 3,
  'non-visualised': 4
};

const categoryLabels = {
  'normal': 'Normal',
  'small': 'Small',
  'medium': 'Medium',
  'large': 'Large',
  'non-visualised': 'Non-visualised'
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

function categoryClass(category) {
  switch (category) {
    case 'normal': return 'risk-low';
    case 'small': return 'risk-moderate';
    case 'medium': return 'risk-high';
    case 'large': return 'risk-critical';
    case 'non-visualised': return 'risk-medium';
    default: return '';
  }
}

function categoryLabel(category) {
  return categoryLabels[category] || category || 'N/A';
}

function diameterLabel(cm) {
  return (cm === null || cm === undefined) ? 'N/A' : String(cm);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.category !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ScreeningRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      (row.clinicSite || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.category && row.category !== filters.category) return false;
  if (filters.referral === 'yes' && !row.referralFlag) return false;
  if (filters.referral === 'no' && row.referralFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The category column uses its
 * rank table; the nullable diameter sorts nulls last; the referral boolean
 * sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'category') {
    av = categoryRank[av] ?? -1;
    bv = categoryRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'maxAorticDiameterCm') {
    // Sort nulls last in both directions so measured rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'referralFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, clinicSite)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return screenings.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.category === 'large' || row.referralFlag) {
      tr.classList.add('row-critical');
    }

    const diameterClassName = row.maxAorticDiameterCm === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.clinicSite || 'N/A')}</td>
      <td><span class="${diameterClassName}">${esc(diameterLabel(row.maxAorticDiameterCm))}</span></td>
      <td><span class="risk-badge ${categoryClass(row.category)}">${esc(categoryLabel(row.category))}</span></td>
      <td>
        <span class="flag-badge ${row.referralFlag ? 'flag-yes' : 'flag-no'}">
          ${row.referralFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = screenings.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No screenings to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} screenings`;
  } else {
    el.textContent = `Showing ${shown} of ${total} screenings`;
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
  const category = document.getElementById('filter-category');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (category) {
    category.addEventListener('change', () => {
      filters.category = category.value;
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
      filters.category = '';
      filters.referral = '';
      if (search) search.value = '';
      if (category) category.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadScreenings() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  screenings = sampleScreenings;
  renderAll();

  try {
    const items = await fetchScreenings();
    if (items && items.length > 0) {
      screenings = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no screenings.'
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
  loadScreenings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
