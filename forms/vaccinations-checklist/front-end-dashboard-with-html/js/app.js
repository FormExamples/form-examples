// Vaccinations Checklist - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + compliance dropdown + age-band dropdown + schedule-type
// dropdown).
//
// Default sort surfaces the most clinically urgent rows first: descending
// by compliance rank so `non-compliant` rows appear at the top.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.VaccinationsChecklistDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.VaccinationsChecklistDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  compliance: '',
  ageBand: '',
  schedule: ''
};

// Default sort: compliance descending. `non-compliant` ranks highest, so
// the rows that most need clinical attention surface at the top of the
// list on load.
const sortState = {
  key: 'compliance',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'ageYears',            label: 'Age' },
  { key: 'ageBand',             label: 'Age Band' },
  { key: 'scheduleType',        label: 'Schedule' },
  { key: 'compliance',          label: 'Compliance' },
  { key: 'missingVaccinations', label: 'Missing Vaccinations' }
];

// Rank used when sorting the `compliance` column so order is stable
// regardless of locale: compliant < partial < non-compliant. Default sort
// is descending so non-compliant appears first.
const complianceRank = {
  'compliant': 0,
  'partial': 1,
  'non-compliant': 2
};

// Rank used when sorting the `ageBand` column.
const ageBandRank = {
  'Childhood (0-18)': 0,
  'Adult (19-64)': 1,
  'Older Adult (65+)': 2
};

// Rank used when sorting the `scheduleType` column.
const scheduleRank = {
  'Childhood': 0,
  'Adult': 1,
  'Traveller': 2,
  'Occupational': 3
};

// Display labels for the compliance enum values (which are kebab-case in
// the data model so they double as CSS-class suffixes).
const complianceLabels = {
  'compliant': 'Compliant',
  'partial': 'Partial',
  'non-compliant': 'Non-Compliant'
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

function complianceClass(value) {
  if (!value) return '';
  return 'compliance-' + String(value).toLowerCase();
}

function scheduleClass(value) {
  if (!value) return '';
  return 'schedule-' + String(value).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.compliance !== '' ||
    filters.ageBand !== '' ||
    filters.schedule !== ''
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
  if (filters.compliance && row.compliance !== filters.compliance) {
    return false;
  }
  if (filters.ageBand && row.ageBand !== filters.ageBand) {
    return false;
  }
  if (filters.schedule && row.scheduleType !== filters.schedule) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; arrays sort by length; numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'compliance') {
    av = complianceRank[av] ?? -1;
    bv = complianceRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageBand') {
    av = ageBandRank[av] ?? -1;
    bv = ageBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'scheduleType') {
    av = scheduleRank[av] ?? -1;
    bv = scheduleRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageYears') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'missingVaccinations') {
    const al = Array.isArray(av) ? av.length : 0;
    const bl = Array.isArray(bv) ? bv.length : 0;
    return (al - bl) * dir;
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
    if (row.compliance === 'non-compliant') {
      tr.classList.add('row-non-compliant');
    }

    const missing = Array.isArray(row.missingVaccinations)
      ? row.missingVaccinations
      : [];
    const missingHtml = missing.length === 0
      ? '<span class="missing-cell missing-empty">None — fully up to date</span>'
      : `<span class="missing-cell">${esc(missing.join(', '))}</span>`;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="age-band">${esc(row.ageYears)}</span></td>
      <td>${esc(row.ageBand)}</td>
      <td><span class="schedule-badge ${scheduleClass(row.scheduleType)}">${esc(row.scheduleType)}</span></td>
      <td><span class="compliance-badge ${complianceClass(row.compliance)}">${esc(complianceLabels[row.compliance] ?? row.compliance)}</span></td>
      <td>${missingHtml}</td>
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
    // Categorical "severity" columns default to descending so the most
    // urgent value (e.g. non-compliant) leads the list; everything else
    // defaults to ascending.
    sortState.direction = (key === 'compliance') ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const compliance = document.getElementById('filter-compliance');
  const ageBand = document.getElementById('filter-age-band');
  const schedule = document.getElementById('filter-schedule');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (compliance) {
    compliance.addEventListener('change', () => {
      filters.compliance = compliance.value;
      renderAll();
    });
  }
  if (ageBand) {
    ageBand.addEventListener('change', () => {
      filters.ageBand = ageBand.value;
      renderAll();
    });
  }
  if (schedule) {
    schedule.addEventListener('change', () => {
      filters.schedule = schedule.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.compliance = '';
      filters.ageBand = '';
      filters.schedule = '';
      if (search) search.value = '';
      if (compliance) compliance.value = '';
      if (ageBand) ageBand.value = '';
      if (schedule) schedule.value = '';
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
