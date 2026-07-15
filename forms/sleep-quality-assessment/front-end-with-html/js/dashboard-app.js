import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Sleep Quality Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + PSQI-score-range dropdown + sleep-quality-category dropdown
// + snoring dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.SleepQualityAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  psqi: '',     // '', '0-5', '6-10', '11-15', '16-21'
  quality: '',
  snoring: ''   // '', 'yes', 'no'
};

// Default sort: PSQI score descending. Worst sleep = highest score = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'psqiScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',      label: 'NHS Number' },
  { key: 'patientName',    label: 'Patient Name' },
  { key: 'psqiScore',      label: 'PSQI Score' },
  { key: 'sleepQuality',   label: 'Sleep Quality' },
  { key: 'primaryConcern', label: 'Primary Concern' },
  { key: 'snoringFlag',    label: 'Snoring' }
];

// Rank used when sorting the sleepQuality column so 'Good sleep quality' is
// always less than 'Severe sleep disturbance' regardless of locale.
const qualityRank = {
  'Good sleep quality': 0,
  'Poor sleep quality': 1,
  'Sleep disorder likely': 2,
  'Severe sleep disturbance': 3
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

function qualityClass(label) {
  if (!label) return '';
  return 'quality-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.psqi !== '' ||
    filters.quality !== '' ||
    filters.snoring !== ''
  );
}

/**
 * Returns true if the score lies inside the named PSQI band.
 *
 * @param {number} score
 * @param {string} range
 * @returns {boolean}
 */
function psqiInRange(score, range) {
  switch (range) {
    case '0-5':   return score >= 0  && score <= 5;
    case '6-10':  return score >= 6  && score <= 10;
    case '11-15': return score >= 11 && score <= 15;
    case '16-21': return score >= 16 && score <= 21;
    default:      return true;
  }
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
      String(row.primaryConcern || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.psqi && !psqiInRange(row.psqiScore, filters.psqi)) {
    return false;
  }
  if (filters.quality && row.sleepQuality !== filters.quality) {
    return false;
  }
  if (filters.snoring === 'yes' && !row.snoringFlag) return false;
  if (filters.snoring === 'no' && row.snoringFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'sleepQuality') {
    av = qualityRank[av] ?? -1;
    bv = qualityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'snoringFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'psqiScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primaryConcern)
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
    if (row.sleepQuality === 'Severe sleep disturbance') {
      tr.classList.add('row-severe-sleep-disturbance');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="psqi-score">${esc(row.psqiScore)}/21</span></td>
      <td><span class="quality-badge ${qualityClass(row.sleepQuality)}">${esc(row.sleepQuality)}</span></td>
      <td class="cell-concern">${esc(row.primaryConcern)}</td>
      <td>
        <span class="snoring-badge ${row.snoringFlag ? 'snoring-yes' : 'snoring-no'}">
          ${row.snoringFlag ? 'Yes' : 'No'}
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
  const psqi = document.getElementById('filter-psqi');
  const quality = document.getElementById('filter-quality');
  const snoring = document.getElementById('filter-snoring');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (psqi) {
    psqi.addEventListener('change', () => {
      filters.psqi = psqi.value;
      renderAll();
    });
  }
  if (quality) {
    quality.addEventListener('change', () => {
      filters.quality = quality.value;
      renderAll();
    });
  }
  if (snoring) {
    snoring.addEventListener('change', () => {
      filters.snoring = snoring.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.psqi = '';
      filters.quality = '';
      filters.snoring = '';
      if (search) search.value = '';
      if (psqi) psqi.value = '';
      if (quality) quality.value = '';
      if (snoring) snoring.value = '';
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
