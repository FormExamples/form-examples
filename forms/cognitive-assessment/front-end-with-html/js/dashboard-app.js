import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Cognitive Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + MMSE-range dropdown + cognitive-level dropdown + age-group
// dropdown + referral-source dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.CognitiveAssessmentDashboard`. Pulling
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
  mmse: '',      // '', '24-30', '18-23', '10-17', '0-9'
  cognitive: '', // '', or one of the four cognitive-level labels
  age: '',       // '', '55-64', '65-74', '75-84', '85+'
  referral: ''   // '', 'GP', 'Neurologist', 'Psychiatrist', ...
};

// Default sort: MMSE score ascending. Lowest score = most impaired = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'mmseScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',      label: 'NHS Number' },
  { key: 'patientName',    label: 'Patient Name' },
  { key: 'mmseScore',      label: 'MMSE Score' },
  { key: 'cognitiveLevel', label: 'Cognitive Level' },
  { key: 'ageGroup',       label: 'Age Group' },
  { key: 'referralSource', label: 'Referral Source' }
];

// Rank used when sorting the cognitiveLevel column so 'Normal cognition' is
// always less than 'Severe cognitive impairment' regardless of locale.
const cognitiveRank = {
  'Normal cognition': 0,
  'Mild cognitive impairment': 1,
  'Moderate cognitive impairment': 2,
  'Severe cognitive impairment': 3
};

// Rank used when sorting the ageGroup column.
const ageRank = {
  '55-64': 0,
  '65-74': 1,
  '75-84': 2,
  '85+': 3
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

function cognitiveClass(label) {
  if (!label) return '';
  return 'cognitive-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/**
 * Test whether a numeric MMSE score falls inside one of the named ranges
 * exposed in the MMSE-Score filter dropdown.
 */
function mmseInRange(score, range) {
  switch (range) {
    case '24-30': return score >= 24 && score <= 30;
    case '18-23': return score >= 18 && score <= 23;
    case '10-17': return score >= 10 && score <= 17;
    case '0-9':   return score >= 0  && score <= 9;
    default:      return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mmse !== '' ||
    filters.cognitive !== '' ||
    filters.age !== '' ||
    filters.referral !== ''
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
      row.cognitiveLevel.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.mmse && !mmseInRange(row.mmseScore, filters.mmse)) {
    return false;
  }
  if (filters.cognitive && row.cognitiveLevel !== filters.cognitive) {
    return false;
  }
  if (filters.age && row.ageGroup !== filters.age) {
    return false;
  }
  if (filters.referral && row.referralSource !== filters.referral) {
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

  if (key === 'cognitiveLevel') {
    av = cognitiveRank[av] ?? -1;
    bv = cognitiveRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageGroup') {
    av = ageRank[av] ?? -1;
    bv = ageRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'mmseScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, referralSource)
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
    if (row.cognitiveLevel === 'Severe cognitive impairment') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="mmse-score">${esc(row.mmseScore)}/30</span></td>
      <td><span class="cognitive-badge ${cognitiveClass(row.cognitiveLevel)}">${esc(row.cognitiveLevel)}</span></td>
      <td><span class="pill">${esc(row.ageGroup)}</span></td>
      <td><span class="pill">${esc(row.referralSource)}</span></td>
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
  const mmse = document.getElementById('filter-mmse');
  const cognitive = document.getElementById('filter-cognitive');
  const age = document.getElementById('filter-age');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mmse) {
    mmse.addEventListener('change', () => {
      filters.mmse = mmse.value;
      renderAll();
    });
  }
  if (cognitive) {
    cognitive.addEventListener('change', () => {
      filters.cognitive = cognitive.value;
      renderAll();
    });
  }
  if (age) {
    age.addEventListener('change', () => {
      filters.age = age.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mmse = '';
      filters.cognitive = '';
      filters.age = '';
      filters.referral = '';
      if (search) search.value = '';
      if (mmse) mmse.value = '';
      if (cognitive) cognitive.value = '';
      if (age) age.value = '';
      if (referral) referral.value = '';
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
