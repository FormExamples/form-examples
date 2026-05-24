// Post-Operative Report - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + Clavien-Dindo grade dropdown + disposition dropdown +
// flagged dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PostOperativeReportDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.PostOperativeReportDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  grade: '',
  disposition: '',
  flagged: '' // '', 'yes', 'no'
};

// Default sort: Clavien-Dindo grade descending. Most severe complication
// = highest grade = top of the list, surfacing patients who most need
// clinical attention.
const sortState = {
  key: 'clavienDindoGrade',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',            label: 'NHS Number' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'procedureName',        label: 'Procedure' },
  { key: 'surgeon',              label: 'Surgeon' },
  { key: 'operationDate',        label: 'Operation Date' },
  { key: 'estimatedBloodLossMl', label: 'EBL (mL)' },
  { key: 'clavienDindoGrade',    label: 'Clavien-Dindo' },
  { key: 'disposition',          label: 'Disposition' },
  { key: 'flagged',              label: 'Flagged' }
];

// Rank used when sorting the clavienDindoGrade column so 'Grade 0' is
// always less than 'Grade V' regardless of locale, with the III/IV
// sub-grades ordered correctly.
const gradeRank = {
  'Grade 0': 0,
  'Grade I': 1,
  'Grade II': 2,
  'Grade IIIa': 3,
  'Grade IIIb': 4,
  'Grade IVa': 5,
  'Grade IVb': 6,
  'Grade V': 7
};

// Severe-row threshold — IVa and above get an emphasised row background.
const SEVERE_GRADES = new Set([
  'Grade IVa',
  'Grade IVb',
  'Grade V'
]);

// Rank used when sorting the disposition column from least to most acute.
const dispositionRank = {
  'Discharged': 0,
  'Ward': 1,
  'Recovery': 2,
  'HDU': 3,
  'ICU': 4,
  'Deceased': 5
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

function gradeClass(label) {
  if (!label) return '';
  // 'Grade IIIa' -> 'grade-iiia'
  return 'grade-' + String(label)
    .toLowerCase()
    .replace(/^grade\s+/, '')
    .replace(/\s+/g, '-');
}

function dispositionClass(label) {
  if (!label) return '';
  return 'disposition-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.grade !== '' ||
    filters.disposition !== '' ||
    filters.flagged !== ''
  );
}

function formatEbl(ml) {
  if (ml == null || Number.isNaN(ml)) return '';
  return Number(ml).toLocaleString('en-GB');
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
      row.procedureName.toLowerCase().includes(term) ||
      row.procedureCategory.toLowerCase().includes(term) ||
      row.surgeon.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.grade && row.clavienDindoGrade !== filters.grade) {
    return false;
  }
  if (filters.disposition && row.disposition !== filters.disposition) {
    return false;
  }
  if (filters.flagged === 'yes' && !row.flagged) return false;
  if (filters.flagged === 'no' && row.flagged) return false;
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

  if (key === 'clavienDindoGrade') {
    av = gradeRank[av] ?? -1;
    bv = gradeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'disposition') {
    av = dispositionRank[av] ?? -1;
    bv = dispositionRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'flagged') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'estimatedBloodLossMl') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, procedureName,
  // surgeon, operationDate — ISO YYYY-MM-DD sorts correctly as a string).
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    if (SEVERE_GRADES.has(row.clavienDindoGrade)) {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td procedure-cell">
        <span class="procedure-name">${esc(row.procedureName)}</span>
        <span class="procedure-category">${esc(row.procedureCategory)}</span>
      </td>
      <td class="data-table-td">${esc(row.surgeon)}</td>
      <td class="data-table-td">${esc(row.operationDate)}</td>
      <td class="data-table-td"><span class="ebl-value">${esc(formatEbl(row.estimatedBloodLossMl))}</span></td>
      <td class="data-table-td"><span class="grade-badge ${gradeClass(row.clavienDindoGrade)}">${esc(row.clavienDindoGrade)}</span></td>
      <td class="data-table-td"><span class="disposition-badge ${dispositionClass(row.disposition)}">${esc(row.disposition)}</span></td>
      <td class="data-table-td">
        <span class="flagged-badge ${row.flagged ? 'flagged-yes' : 'flagged-no'}">
          ${row.flagged ? 'Yes' : 'No'}
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
  const grade = document.getElementById('filter-grade');
  const disposition = document.getElementById('filter-disposition');
  const flagged = document.getElementById('filter-flagged');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (grade) {
    grade.addEventListener('change', () => {
      filters.grade = grade.value;
      renderAll();
    });
  }
  if (disposition) {
    disposition.addEventListener('change', () => {
      filters.disposition = disposition.value;
      renderAll();
    });
  }
  if (flagged) {
    flagged.addEventListener('change', () => {
      filters.flagged = flagged.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.grade = '';
      filters.disposition = '';
      filters.flagged = '';
      if (search) search.value = '';
      if (grade) grade.value = '';
      if (disposition) disposition.value = '';
      if (flagged) flagged.value = '';
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
