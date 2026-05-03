// Fertility Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + concern-level dropdown + cycle-regularity dropdown +
// ovarian-reserve dropdown + semen-analysis dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.FertilityAssessmentDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.FertilityAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  concern: '',
  cycle: '',
  reserve: '',
  semen: '' // '', 'abnormal', 'normal'
};

// Default sort: concern level descending. Highest concern surfaces at the
// top of the list so the patients who most need clinical attention appear
// first.
const sortState = {
  key: 'concernLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',             label: 'NHS Number' },
  { key: 'patientName',           label: 'Patient Name' },
  { key: 'age',                   label: 'Age' },
  { key: 'durationTryingMonths',  label: 'Trying (months)' },
  { key: 'cycleRegularity',       label: 'Cycle Regularity' },
  { key: 'ovarianReserve',        label: 'Ovarian Reserve' },
  { key: 'semenAnalysisAbnormal', label: 'Semen Analysis' },
  { key: 'concernLevel',          label: 'Concern Level' }
];

// Rank used when sorting the concernLevel column so 'Low' is always less
// than 'High' regardless of locale.
const concernRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2
};

// Rank used when sorting the cycleRegularity column.
const cycleRank = {
  'Regular': 0,
  'Irregular': 1,
  'Absent': 2
};

// Rank used when sorting the ovarianReserve column.
const reserveRank = {
  'Normal': 0,
  'Reduced': 1,
  'Low': 2
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

function concernClass(label) {
  if (!label) return '';
  return 'concern-' + String(label).toLowerCase();
}

function cycleClass(label) {
  if (!label) return '';
  return 'cycle-' + String(label).toLowerCase();
}

function reserveClass(label) {
  if (!label) return '';
  return 'reserve-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.concern !== '' ||
    filters.cycle !== '' ||
    filters.reserve !== '' ||
    filters.semen !== ''
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
  if (filters.concern && row.concernLevel !== filters.concern) {
    return false;
  }
  if (filters.cycle && row.cycleRegularity !== filters.cycle) {
    return false;
  }
  if (filters.reserve && row.ovarianReserve !== filters.reserve) {
    return false;
  }
  if (filters.semen === 'abnormal' && !row.semenAnalysisAbnormal) return false;
  if (filters.semen === 'normal' && row.semenAnalysisAbnormal) return false;
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

  if (key === 'concernLevel') {
    av = concernRank[av] ?? -1;
    bv = concernRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'cycleRegularity') {
    av = cycleRank[av] ?? -1;
    bv = cycleRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ovarianReserve') {
    av = reserveRank[av] ?? -1;
    bv = reserveRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'semenAnalysisAbnormal') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'age' || key === 'durationTryingMonths') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
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
    if (row.concernLevel === 'High') {
      tr.classList.add('row-high-concern');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="age-cell">${esc(row.age)}</span></td>
      <td><span class="duration-cell">${esc(row.durationTryingMonths)}</span></td>
      <td><span class="cycle-badge ${cycleClass(row.cycleRegularity)}">${esc(row.cycleRegularity)}</span></td>
      <td><span class="reserve-badge ${reserveClass(row.ovarianReserve)}">${esc(row.ovarianReserve)}</span></td>
      <td>
        <span class="semen-badge ${row.semenAnalysisAbnormal ? 'semen-abnormal' : 'semen-normal'}">
          ${row.semenAnalysisAbnormal ? 'Abnormal' : 'Normal'}
        </span>
      </td>
      <td><span class="concern-badge ${concernClass(row.concernLevel)}">${esc(row.concernLevel)}</span></td>
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
  const concern = document.getElementById('filter-concern');
  const cycle = document.getElementById('filter-cycle');
  const reserve = document.getElementById('filter-reserve');
  const semen = document.getElementById('filter-semen');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (concern) {
    concern.addEventListener('change', () => {
      filters.concern = concern.value;
      renderAll();
    });
  }
  if (cycle) {
    cycle.addEventListener('change', () => {
      filters.cycle = cycle.value;
      renderAll();
    });
  }
  if (reserve) {
    reserve.addEventListener('change', () => {
      filters.reserve = reserve.value;
      renderAll();
    });
  }
  if (semen) {
    semen.addEventListener('change', () => {
      filters.semen = semen.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.concern = '';
      filters.cycle = '';
      filters.reserve = '';
      filters.semen = '';
      if (search) search.value = '';
      if (concern) concern.value = '';
      if (cycle) cycle.value = '';
      if (reserve) reserve.value = '';
      if (semen) semen.value = '';
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
})();
