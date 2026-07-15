import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Pediatric Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + dev-screen-result dropdown + growth dropdown +
// immunization dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  devScreen: '',     // '', 'normal', 'developmental-concern', 'developmental-delay'
  growth: '',        // '', 'normal', 'concern'
  immunization: ''   // '', 'up-to-date', 'missing'
};

// Default sort: patientName ascending — matches the SvelteKit dashboard's
// `init` callback which calls `sort-rows` with key=patientName, order=asc.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Mirrors the SvelteKit dashboard columns.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'devScreenResult',    label: 'Dev Screen Result' },
  { key: 'age',                label: 'Age' },
  { key: 'growthStatus',       label: 'Growth Status' },
  { key: 'immunizationStatus', label: 'Immunization Status' }
];

// Rank used when sorting the devScreenResult column so 'normal' is always
// less than 'developmental-delay' regardless of locale.
const devScreenRank = {
  'normal': 0,
  'developmental-concern': 1,
  'developmental-delay': 2
};

// Short label shown in the dev-screen badge, matching the SvelteKit
// `devScreenLabel` helper.
const devScreenLabels = {
  'normal': 'Normal',
  'developmental-concern': 'Concern',
  'developmental-delay': 'Delay'
};

// Parse a free-text age like "18 months" or "3 weeks" into a number of
// months for sortable comparison. Falls back to 0 for unparseable input.
function ageMonths(s) {
  if (!s) return 0;
  const m = String(s).match(/(\d+(?:\.\d+)?)\s*(year|month|week|day)s?/i);
  if (!m) return 0;
  const n = parseFloat(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'year')  return n * 12;
  if (unit === 'month') return n;
  if (unit === 'week')  return n / 4.345;
  if (unit === 'day')   return n / 30.4375;
  return 0;
}

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

function devScreenClass(result) {
  if (!result) return '';
  return 'dev-' + String(result).toLowerCase();
}

function growthClass(status) {
  return status === 'Normal' ? 'growth-normal' : 'growth-concern';
}

function immunizationClass(status) {
  if (status === 'Up to date') return 'immunization-up-to-date';
  if (typeof status === 'string' && status.toLowerCase().startsWith('missing')) {
    return 'immunization-missing';
  }
  return 'immunization-other';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.devScreen !== '' ||
    filters.growth !== '' ||
    filters.immunization !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PatientRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      String(row.age || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.devScreen && row.devScreenResult !== filters.devScreen) {
    return false;
  }
  // Growth filter: 'normal' = exactly "Normal"; 'concern' = anything else.
  if (filters.growth === 'normal' && row.growthStatus !== 'Normal') return false;
  if (filters.growth === 'concern' && row.growthStatus === 'Normal') return false;
  // Immunization filter: 'up-to-date' = exactly "Up to date"; 'missing' = anything else.
  if (filters.immunization === 'up-to-date' && row.immunizationStatus !== 'Up to date') return false;
  if (filters.immunization === 'missing' && row.immunizationStatus === 'Up to date') return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; ages are parsed to months; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'devScreenResult') {
    av = devScreenRank[av] ?? -1;
    bv = devScreenRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'age') {
    return (ageMonths(av) - ageMonths(bv)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, growthStatus, immunizationStatus)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return patients.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '\u2195'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '\u2191';
      } else {
        ariaSort = 'descending';
        indicator = '\u2193';
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
    if (row.devScreenResult === 'developmental-delay') {
      tr.classList.add('row-developmental-delay');
    }

    const devLabel = devScreenLabels[row.devScreenResult] || row.devScreenResult;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="dev-badge ${devScreenClass(row.devScreenResult)}">${esc(devLabel)}</span></td>
      <td><span class="age-cell">${esc(row.age)}</span></td>
      <td><span class="growth-badge ${growthClass(row.growthStatus)}">${esc(row.growthStatus)}</span></td>
      <td><span class="immunization-badge ${immunizationClass(row.immunizationStatus)}">${esc(row.immunizationStatus)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = patients.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No patients to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} patients`;
  } else {
    el.textContent = `Showing ${shown} of ${total} patients`;
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
  const devScreen = document.getElementById('filter-dev-screen');
  const growth = document.getElementById('filter-growth');
  const immunization = document.getElementById('filter-immunization');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (devScreen) {
    devScreen.addEventListener('change', () => {
      filters.devScreen = devScreen.value;
      renderAll();
    });
  }
  if (growth) {
    growth.addEventListener('change', () => {
      filters.growth = growth.value;
      renderAll();
    });
  }
  if (immunization) {
    immunization.addEventListener('change', () => {
      filters.immunization = immunization.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.devScreen = '';
      filters.growth = '';
      filters.immunization = '';
      if (search) search.value = '';
      if (devScreen) devScreen.value = '';
      if (growth) growth.value = '';
      if (immunization) immunization.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPatients() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  patients = samplePatients;
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
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
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
