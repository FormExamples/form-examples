// Birth Control Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + MEC-category dropdown + DVT-risk dropdown + CVD-risk
// dropdown + migraine-with-aura dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.BirthControlAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.BirthControlAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  mec: '',
  dvt: '',
  cvd: '',
  migraine: '' // '', 'yes', 'no'
};

// Default sort: MEC category descending. Highest-risk patients (UK MEC 4)
// surface to the top of the list so they get clinical attention first.
const sortState = {
  key: 'mecCategory',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',            label: 'NHS Number' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'mecCategory',          label: 'MEC Category' },
  { key: 'methodRecommended',    label: 'Method Recommended' },
  { key: 'dvtRisk',              label: 'DVT Risk' },
  { key: 'cvdRisk',              label: 'CVD Risk' },
  { key: 'migraineWithAuraFlag', label: 'Migraine w/ Aura' }
];

// Rank used when sorting the mecCategory column so 'UK MEC 1' is always
// less than 'UK MEC 4' regardless of locale.
const mecRank = {
  'UK MEC 1': 1,
  'UK MEC 2': 2,
  'UK MEC 3': 3,
  'UK MEC 4': 4
};

// Rank used when sorting the DVT and CVD risk columns.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2
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

function mecClass(label) {
  if (!label) return '';
  return 'mec-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mec !== '' ||
    filters.dvt !== '' ||
    filters.cvd !== '' ||
    filters.migraine !== ''
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
  if (filters.mec && row.mecCategory !== filters.mec) {
    return false;
  }
  if (filters.dvt && row.dvtRisk !== filters.dvt) {
    return false;
  }
  if (filters.cvd && row.cvdRisk !== filters.cvd) {
    return false;
  }
  if (filters.migraine === 'yes' && !row.migraineWithAuraFlag) return false;
  if (filters.migraine === 'no' && row.migraineWithAuraFlag) return false;
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

  if (key === 'mecCategory') {
    av = mecRank[av] ?? -1;
    bv = mecRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'dvtRisk' || key === 'cvdRisk') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'migraineWithAuraFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, methodRecommended)
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
    if (row.mecCategory === 'UK MEC 4') {
      tr.classList.add('row-mec-4');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="mec-badge ${mecClass(row.mecCategory)}">${esc(row.mecCategory)}</span></td>
      <td><span class="method-recommended">${esc(row.methodRecommended)}</span></td>
      <td><span class="risk-badge ${riskClass(row.dvtRisk)}">${esc(row.dvtRisk)}</span></td>
      <td><span class="risk-badge ${riskClass(row.cvdRisk)}">${esc(row.cvdRisk)}</span></td>
      <td>
        <span class="migraine-badge ${row.migraineWithAuraFlag ? 'migraine-yes' : 'migraine-no'}">
          ${row.migraineWithAuraFlag ? 'Yes' : 'No'}
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
  const mec = document.getElementById('filter-mec');
  const dvt = document.getElementById('filter-dvt');
  const cvd = document.getElementById('filter-cvd');
  const migraine = document.getElementById('filter-migraine');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mec) {
    mec.addEventListener('change', () => {
      filters.mec = mec.value;
      renderAll();
    });
  }
  if (dvt) {
    dvt.addEventListener('change', () => {
      filters.dvt = dvt.value;
      renderAll();
    });
  }
  if (cvd) {
    cvd.addEventListener('change', () => {
      filters.cvd = cvd.value;
      renderAll();
    });
  }
  if (migraine) {
    migraine.addEventListener('change', () => {
      filters.migraine = migraine.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mec = '';
      filters.dvt = '';
      filters.cvd = '';
      filters.migraine = '';
      if (search) search.value = '';
      if (mec) mec.value = '';
      if (dvt) dvt.value = '';
      if (cvd) cvd.value = '';
      if (migraine) migraine.value = '';
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
