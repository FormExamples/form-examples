import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Pulmonology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + GOLD-stage dropdown + ABCD-group dropdown + allergy
// dropdown + oxygen-therapy dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PulmonologyAssessmentDashboard`. Pulling
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
  gold: '',     // '', '1', '2', '3', '4'
  abcd: '',     // '', 'A', 'B', 'E'
  allergy: '',  // '', 'yes', 'no'
  oxygen: ''    // '', 'yes', 'no'
};

// Default sort: GOLD stage descending. Most-severe stage = highest number =
// top of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'goldStage',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'goldStage',     label: 'GOLD Stage' },
  { key: 'abcdGroup',     label: 'ABCD Group' },
  { key: 'allergyFlag',   label: 'Allergy' },
  { key: 'oxygenTherapy', label: 'O2 Therapy' }
];

// Roman-numeral display labels for the four GOLD stages.
const goldRomans = ['I', 'II', 'III', 'IV'];

// Rank used when sorting the abcdGroup column so 'A' < 'B' < 'E' regardless
// of locale or future additions.
const abcdRank = {
  'A': 0,
  'B': 1,
  'E': 2
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

function goldClass(stage) {
  if (!stage) return '';
  return 'gold-' + String(stage);
}

function goldLabel(stage) {
  const idx = Number(stage) - 1;
  if (idx < 0 || idx >= goldRomans.length) return '';
  return 'GOLD ' + goldRomans[idx];
}

function abcdClass(group) {
  if (!group) return '';
  return 'abcd-' + String(group).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.gold !== '' ||
    filters.abcd !== '' ||
    filters.allergy !== '' ||
    filters.oxygen !== ''
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.gold && row.goldStage !== Number(filters.gold)) {
    return false;
  }
  if (filters.abcd && row.abcdGroup !== filters.abcd) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
  if (filters.oxygen === 'yes' && !row.oxygenTherapy) return false;
  if (filters.oxygen === 'no' && row.oxygenTherapy) return false;
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

  if (key === 'abcdGroup') {
    av = abcdRank[av] ?? -1;
    bv = abcdRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'goldStage') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'allergyFlag' || key === 'oxygenTherapy') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
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
    if (row.goldStage === 4) {
      tr.classList.add('row-gold-iv');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="gold-badge ${goldClass(row.goldStage)}">${esc(goldLabel(row.goldStage))}</span></td>
      <td><span class="abcd-badge ${abcdClass(row.abcdGroup)}">Group ${esc(row.abcdGroup)}</span></td>
      <td>
        <span class="allergy-badge ${row.allergyFlag ? 'allergy-yes' : 'allergy-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="oxygen-badge ${row.oxygenTherapy ? 'oxygen-yes' : 'oxygen-no'}">
          ${row.oxygenTherapy ? 'Yes' : 'No'}
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
  const gold = document.getElementById('filter-gold');
  const abcd = document.getElementById('filter-abcd');
  const allergy = document.getElementById('filter-allergy');
  const oxygen = document.getElementById('filter-oxygen');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (gold) {
    gold.addEventListener('change', () => {
      filters.gold = gold.value;
      renderAll();
    });
  }
  if (abcd) {
    abcd.addEventListener('change', () => {
      filters.abcd = abcd.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (oxygen) {
    oxygen.addEventListener('change', () => {
      filters.oxygen = oxygen.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.gold = '';
      filters.abcd = '';
      filters.allergy = '';
      filters.oxygen = '';
      if (search) search.value = '';
      if (gold) gold.value = '';
      if (abcd) abcd.value = '';
      if (allergy) allergy.value = '';
      if (oxygen) oxygen.value = '';
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
