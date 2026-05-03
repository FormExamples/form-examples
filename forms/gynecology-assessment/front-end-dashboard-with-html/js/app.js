// Gynecology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + symptom-score range dropdown + menopausal-status dropdown +
// screening-status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.GynecologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.GynecologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  score: '',      // '', '0-5', '6-10', '11-20', '21-30'
  menopausal: '', // '', 'Pre-menopausal', 'Peri-menopausal', 'Post-menopausal'
  screening: ''   // '', 'Up to date', 'Overdue', 'Abnormal result'
};

// Default sort: patient name ascending. Matches the SvelteKit dashboard's
// `init` callback which sorts by patientName on load.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'symptomScore',     label: 'Symptom Score' },
  { key: 'primaryConcern',   label: 'Primary Concern' },
  { key: 'menopausalStatus', label: 'Menopausal Status' },
  { key: 'screeningStatus',  label: 'Screening' }
];

// Rank used when sorting the menopausalStatus column so Pre < Peri < Post
// regardless of locale.
const menopausalRank = {
  'Pre-menopausal': 0,
  'Peri-menopausal': 1,
  'Post-menopausal': 2
};

// Rank used when sorting the screeningStatus column from best to worst.
const screeningRank = {
  'Up to date': 0,
  'Overdue': 1,
  'Abnormal result': 2
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

/** Map a raw symptom score to a severity band / CSS class suffix. */
function severityForScore(score) {
  const n = Number(score) || 0;
  if (n <= 5) return 'minimal';
  if (n <= 10) return 'mild';
  if (n <= 20) return 'moderate';
  return 'severe';
}

function menopausalClass(label) {
  if (!label) return '';
  return 'menopausal-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function screeningClass(label) {
  if (!label) return '';
  return 'screening-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/** Returns true iff `score` falls inside the given range filter id. */
function scoreInRange(score, range) {
  switch (range) {
    case '0-5':   return score >= 0  && score <= 5;
    case '6-10':  return score >= 6  && score <= 10;
    case '11-20': return score >= 11 && score <= 20;
    case '21-30': return score >= 21 && score <= 30;
    default:      return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.score !== '' ||
    filters.menopausal !== '' ||
    filters.screening !== ''
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
      row.primaryConcern.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.score && !scoreInRange(row.symptomScore, filters.score)) {
    return false;
  }
  if (filters.menopausal && row.menopausalStatus !== filters.menopausal) {
    return false;
  }
  if (filters.screening && row.screeningStatus !== filters.screening) {
    return false;
  }
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

  if (key === 'menopausalStatus') {
    av = menopausalRank[av] ?? -1;
    bv = menopausalRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'screeningStatus') {
    av = screeningRank[av] ?? -1;
    bv = screeningRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'symptomScore') {
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
    const sev = severityForScore(row.symptomScore);
    if (sev === 'severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="symptom-score">${esc(row.symptomScore)}/30</span>
        <span class="severity-badge severity-${sev}">${sev.charAt(0).toUpperCase() + sev.slice(1)}</span>
      </td>
      <td class="cell-wrap">${esc(row.primaryConcern)}</td>
      <td><span class="menopausal-badge ${menopausalClass(row.menopausalStatus)}">${esc(row.menopausalStatus)}</span></td>
      <td><span class="screening-badge ${screeningClass(row.screeningStatus)}">${esc(row.screeningStatus)}</span></td>
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
  const score = document.getElementById('filter-score');
  const menopausal = document.getElementById('filter-menopausal');
  const screening = document.getElementById('filter-screening');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (score) {
    score.addEventListener('change', () => {
      filters.score = score.value;
      renderAll();
    });
  }
  if (menopausal) {
    menopausal.addEventListener('change', () => {
      filters.menopausal = menopausal.value;
      renderAll();
    });
  }
  if (screening) {
    screening.addEventListener('change', () => {
      filters.screening = screening.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.score = '';
      filters.menopausal = '';
      filters.screening = '';
      if (search) search.value = '';
      if (score) score.value = '';
      if (menopausal) menopausal.value = '';
      if (screening) screening.value = '';
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
