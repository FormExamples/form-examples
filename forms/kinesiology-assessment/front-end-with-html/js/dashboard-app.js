import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Kinesiology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-band dropdown + painful-tests dropdown + asymmetric-
// tests dropdown).
//
// Default sort is FMS total ascending, so the most at-risk patients
// surface at the top of the list — that's the clinical priority for an
// FMS dashboard.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  riskBand: '',  // '', 'low-risk', 'at-risk'
  pain: '',      // '', 'yes', 'no'
  asymmetry: ''  // '', 'yes', 'no'
};

// Default sort: FMS score ascending. Lowest score = highest injury risk =
// top of the list, surfacing the patients who most need clinical
// attention.
const sortState = {
  key: 'fmsScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'occupation',      label: 'Occupation' },
  { key: 'fmsScore',        label: 'FMS Score' },
  { key: 'riskBand',        label: 'Risk Band' },
  { key: 'painfulTests',    label: 'Painful Tests' },
  { key: 'asymmetricTests', label: 'Asymmetric Tests' }
];

// Rank used when sorting the riskBand column so 'low-risk' is always less
// than 'at-risk' regardless of locale or string ordering.
const riskBandRank = {
  'low-risk': 0,
  'at-risk':  1
};

// Pretty labels for the risk-band badges.
const riskBandLabel = {
  'low-risk': 'Low risk',
  'at-risk':  'At risk'
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

function riskBandClass(band) {
  if (!band) return '';
  return 'risk-band-' + String(band).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.riskBand !== '' ||
    filters.pain !== '' ||
    filters.asymmetry !== ''
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
      String(row.occupation || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.riskBand && row.riskBand !== filters.riskBand) {
    return false;
  }
  if (filters.pain === 'yes' && !(row.painfulTests > 0)) return false;
  if (filters.pain === 'no'  &&  (row.painfulTests > 0)) return false;
  if (filters.asymmetry === 'yes' && !(row.asymmetricTests > 0)) return false;
  if (filters.asymmetry === 'no'  &&  (row.asymmetricTests > 0)) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskBand') {
    av = riskBandRank[av] ?? -1;
    bv = riskBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'fmsScore' || key === 'painfulTests' || key === 'asymmetricTests') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, occupation)
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
    // Painful-test row emphasis: any reported pain is a clinical priority,
    // matching how the FMS scoring engine zeroes any pattern with pain.
    if (row.painfulTests > 0) {
      tr.classList.add('row-painful');
    }

    const bandLabel = riskBandLabel[row.riskBand] || row.riskBand;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="occupation-cell">${esc(row.occupation)}</span></td>
      <td><span class="fms-score">${esc(row.fmsScore)}/21</span></td>
      <td><span class="risk-band-badge ${riskBandClass(row.riskBand)}">${esc(bandLabel)}</span></td>
      <td>
        <span class="flag-badge ${row.painfulTests > 0 ? 'flag-yes' : 'flag-no'}">
          ${esc(row.painfulTests)}
        </span>
      </td>
      <td>
        <span class="flag-badge ${row.asymmetricTests > 0 ? 'flag-yes' : 'flag-no'}">
          ${esc(row.asymmetricTests)}
        </span>
      </td>
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
  const riskBand = document.getElementById('filter-risk-band');
  const pain = document.getElementById('filter-pain');
  const asymmetry = document.getElementById('filter-asymmetry');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (riskBand) {
    riskBand.addEventListener('change', () => {
      filters.riskBand = riskBand.value;
      renderAll();
    });
  }
  if (pain) {
    pain.addEventListener('change', () => {
      filters.pain = pain.value;
      renderAll();
    });
  }
  if (asymmetry) {
    asymmetry.addEventListener('change', () => {
      filters.asymmetry = asymmetry.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.riskBand = '';
      filters.pain = '';
      filters.asymmetry = '';
      if (search) search.value = '';
      if (riskBand) riskBand.value = '';
      if (pain) pain.value = '';
      if (asymmetry) asymmetry.value = '';
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
