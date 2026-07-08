// Audio-Vestibular Assessment - clinician dashboard (vanilla classic-script
// app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + hearing-loss-grade dropdown + DHI-handicap-level dropdown +
// vestibular-flag dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AudioVestibularAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.AudioVestibularAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  hearing: '',
  handicap: '',
  vestibular: '' // '', 'yes', 'no'
};

// Default sort: DHI score descending. Highest handicap = top of the list,
// surfacing the patients who most need clinical attention.
const sortState = {
  key: 'dhiScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'hearingLossGrade', label: 'Hearing Loss' },
  { key: 'dhiScore',         label: 'DHI Score' },
  { key: 'dhiHandicapLevel', label: 'DHI Handicap' },
  { key: 'vestibularFlag',   label: 'Vestibular Flag' }
];

// Rank used when sorting the hearingLossGrade column so 'Normal' is always
// less than 'Profound' regardless of locale.
const hearingRank = {
  'Normal': 0,
  'Mild': 1,
  'Moderate': 2,
  'Moderately Severe': 3,
  'Severe': 4,
  'Profound': 5
};

// Rank used when sorting the dhiHandicapLevel column.
const handicapRank = {
  'No Handicap': 0,
  'Mild': 1,
  'Moderate': 2,
  'Severe': 3
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

function hearingClass(label) {
  if (!label) return '';
  return 'hearing-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function handicapClass(label) {
  if (!label) return '';
  return 'handicap-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.hearing !== '' ||
    filters.handicap !== '' ||
    filters.vestibular !== ''
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
  if (filters.hearing && row.hearingLossGrade !== filters.hearing) {
    return false;
  }
  if (filters.handicap && row.dhiHandicapLevel !== filters.handicap) {
    return false;
  }
  if (filters.vestibular === 'yes' && !row.vestibularFlag) return false;
  if (filters.vestibular === 'no' && row.vestibularFlag) return false;
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

  if (key === 'hearingLossGrade') {
    av = hearingRank[av] ?? -1;
    bv = hearingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'dhiHandicapLevel') {
    av = handicapRank[av] ?? -1;
    bv = handicapRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'vestibularFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'dhiScore') {
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
    if (row.hearingLossGrade === 'Profound') {
      tr.classList.add('row-profound');
    } else if (row.dhiHandicapLevel === 'Severe') {
      tr.classList.add('row-severe-handicap');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="hearing-badge ${hearingClass(row.hearingLossGrade)}">${esc(row.hearingLossGrade)}</span></td>
      <td><span class="dhi-score">${esc(row.dhiScore)}/100</span></td>
      <td><span class="handicap-badge ${handicapClass(row.dhiHandicapLevel)}">${esc(row.dhiHandicapLevel)}</span></td>
      <td>
        <span class="vestibular-badge ${row.vestibularFlag ? 'vestibular-yes' : 'vestibular-no'}">
          ${row.vestibularFlag ? 'Yes' : 'No'}
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
  const hearing = document.getElementById('filter-hearing');
  const handicap = document.getElementById('filter-handicap');
  const vestibular = document.getElementById('filter-vestibular');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (hearing) {
    hearing.addEventListener('change', () => {
      filters.hearing = hearing.value;
      renderAll();
    });
  }
  if (handicap) {
    handicap.addEventListener('change', () => {
      filters.handicap = handicap.value;
      renderAll();
    });
  }
  if (vestibular) {
    vestibular.addEventListener('change', () => {
      filters.vestibular = vestibular.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.hearing = '';
      filters.handicap = '';
      filters.vestibular = '';
      if (search) search.value = '';
      if (hearing) hearing.value = '';
      if (handicap) handicap.value = '';
      if (vestibular) vestibular.value = '';
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
