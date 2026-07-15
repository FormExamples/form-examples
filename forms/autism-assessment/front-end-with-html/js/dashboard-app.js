import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Autism Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + AQ-10 score range dropdown + screening outcome dropdown +
// age group dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  aq10: '',     // '', '0-3', '4-5', '6-8', '9-10'
  outcome: '',
  ageGroup: ''
};

// Default sort: patient name ascending — mirrors the SvelteKit dashboard's
// `sort-rows` init call so both surfaces open with the same row order.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'aq10Score',        label: 'AQ-10 Score' },
  { key: 'screeningOutcome', label: 'Screening Outcome' },
  { key: 'ageGroup',         label: 'Age Group' },
  { key: 'referralStatus',   label: 'Referral Status' }
];

// Rank used when sorting the screeningOutcome column so 'Below threshold'
// is always less than 'At or above threshold' regardless of locale.
const outcomeRank = {
  'Below threshold': 0,
  'At or above threshold': 1
};

// Rank used when sorting the ageGroup column (developmental order).
const ageGroupRank = {
  'Child': 0,
  'Adolescent': 1,
  'Adult': 2
};

// Rank used when sorting the referralStatus column (urgency ascending).
const referralRank = {
  'No referral needed': 0,
  'Monitoring': 1,
  'Referred for assessment': 2,
  'Urgent referral': 3
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

function outcomeClass(label) {
  if (!label) return '';
  return 'outcome-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function referralClass(label) {
  if (!label) return '';
  return 'referral-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function aq10InRange(score, range) {
  switch (range) {
    case '0-3':  return score >= 0 && score <= 3;
    case '4-5':  return score >= 4 && score <= 5;
    case '6-8':  return score >= 6 && score <= 8;
    case '9-10': return score >= 9 && score <= 10;
    default:     return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.aq10 !== '' ||
    filters.outcome !== '' ||
    filters.ageGroup !== ''
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
      row.referralStatus.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.aq10 && !aq10InRange(row.aq10Score, filters.aq10)) {
    return false;
  }
  if (filters.outcome && row.screeningOutcome !== filters.outcome) {
    return false;
  }
  if (filters.ageGroup && row.ageGroup !== filters.ageGroup) {
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

  if (key === 'screeningOutcome') {
    av = outcomeRank[av] ?? -1;
    bv = outcomeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageGroup') {
    av = ageGroupRank[av] ?? -1;
    bv = ageGroupRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'referralStatus') {
    av = referralRank[av] ?? -1;
    bv = referralRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'aq10Score') {
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
    if (row.screeningOutcome === 'At or above threshold') {
      tr.classList.add('row-above-threshold');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="aq10-score">${esc(row.aq10Score)}/10</span></td>
      <td><span class="outcome-badge ${outcomeClass(row.screeningOutcome)}">${esc(row.screeningOutcome)}</span></td>
      <td><span class="age-badge">${esc(row.ageGroup)}</span></td>
      <td><span class="referral-badge ${referralClass(row.referralStatus)}">${esc(row.referralStatus)}</span></td>
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
  const aq10 = document.getElementById('filter-aq10');
  const outcome = document.getElementById('filter-outcome');
  const ageGroup = document.getElementById('filter-age-group');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (aq10) {
    aq10.addEventListener('change', () => {
      filters.aq10 = aq10.value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = outcome.value;
      renderAll();
    });
  }
  if (ageGroup) {
    ageGroup.addEventListener('change', () => {
      filters.ageGroup = ageGroup.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.aq10 = '';
      filters.outcome = '';
      filters.ageGroup = '';
      if (search) search.value = '';
      if (aq10) aq10.value = '';
      if (outcome) outcome.value = '';
      if (ageGroup) ageGroup.value = '';
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
