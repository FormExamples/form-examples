// Audiology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + hearing-grade dropdown + tinnitus dropdown + aid-status
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AudiologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.AudiologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  grade: '',
  tinnitus: '',  // '', 'yes', 'no'
  aidStatus: ''
};

// Default sort: hearing grade descending. Worst hearing = profound = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'hearingGrade',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'hearingGrade',     label: 'Hearing Grade' },
  { key: 'affectedEar',      label: 'Affected Ear' },
  { key: 'hearingLossType',  label: 'Type' },
  { key: 'tinnitus',         label: 'Tinnitus' },
  { key: 'hearingAidStatus', label: 'Aid Status' }
];

// Rank used when sorting the hearingGrade column so 'normal' is always
// less than 'profound' regardless of locale or alphabetical order.
const gradeRank = {
  'normal': 0,
  'mild': 1,
  'moderate': 2,
  'severe': 3,
  'profound': 4
};

// Rank used when sorting the affectedEar column. Puts 'N/A' last so
// unaffected patients sink to the bottom in ascending order.
const earRank = {
  'Left': 0,
  'Right': 1,
  'Both': 2,
  'N/A': 3
};

// Rank used when sorting the hearingAidStatus column.
const aidStatusRank = {
  'None': 0,
  'Candidate': 1,
  'Fitted': 2,
  'Cochlear implant candidate': 3
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
  return 'grade-' + String(label).toLowerCase();
}

function gradeDisplay(label) {
  if (!label) return '';
  const s = String(label);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function aidStatusClass(label) {
  switch (label) {
    case 'Fitted': return 'aid-status-fitted';
    case 'Candidate': return 'aid-status-candidate';
    case 'Cochlear implant candidate': return 'aid-status-cochlear';
    case 'None': return 'aid-status-none';
    default: return '';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.grade !== '' ||
    filters.tinnitus !== '' ||
    filters.aidStatus !== ''
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
  if (filters.grade && row.hearingGrade !== filters.grade) {
    return false;
  }
  if (filters.tinnitus === 'yes' && !row.tinnitus) return false;
  if (filters.tinnitus === 'no' && row.tinnitus) return false;
  if (filters.aidStatus && row.hearingAidStatus !== filters.aidStatus) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'hearingGrade') {
    av = gradeRank[av] ?? -1;
    bv = gradeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'affectedEar') {
    av = earRank[av] ?? -1;
    bv = earRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hearingAidStatus') {
    av = aidStatusRank[av] ?? -1;
    bv = aidStatusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'tinnitus') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, hearingLossType)
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
    if (row.hearingGrade === 'severe') {
      tr.classList.add('row-severe');
    } else if (row.hearingGrade === 'profound') {
      tr.classList.add('row-profound');
    }

    const lossTypeClass = row.hearingLossType === 'N/A' ? 'loss-type loss-type-na' : 'loss-type';

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="grade-badge ${gradeClass(row.hearingGrade)}">${esc(gradeDisplay(row.hearingGrade))}</span></td>
      <td>${esc(row.affectedEar)}</td>
      <td><span class="${lossTypeClass}">${esc(row.hearingLossType)}</span></td>
      <td>
        <span class="tinnitus-badge ${row.tinnitus ? 'tinnitus-yes' : 'tinnitus-no'}">
          ${row.tinnitus ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="aid-status ${aidStatusClass(row.hearingAidStatus)}">${esc(row.hearingAidStatus)}</span></td>
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
  const tinnitus = document.getElementById('filter-tinnitus');
  const aidStatus = document.getElementById('filter-aid-status');
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
  if (tinnitus) {
    tinnitus.addEventListener('change', () => {
      filters.tinnitus = tinnitus.value;
      renderAll();
    });
  }
  if (aidStatus) {
    aidStatus.addEventListener('change', () => {
      filters.aidStatus = aidStatus.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.grade = '';
      filters.tinnitus = '';
      filters.aidStatus = '';
      if (search) search.value = '';
      if (grade) grade.value = '';
      if (tinnitus) tinnitus.value = '';
      if (aidStatus) aidStatus.value = '';
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
