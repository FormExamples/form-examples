import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Casualty Card Form - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + NEWS2-level dropdown + MTS-category dropdown + allergy
// dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  news2: '',
  mts: '',
  allergy: '' // '', 'yes', 'no'
};

// Default sort: NEWS2 score descending. Highest score = most clinically
// urgent = top of the list, surfacing the patients who most need attention.
const sortState = {
  key: 'news2Score',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',      label: 'NHS Number' },
  { key: 'patientName',    label: 'Patient Name' },
  { key: 'news2Score',     label: 'NEWS2' },
  { key: 'mtsCategory',    label: 'MTS Category' },
  { key: 'chiefComplaint', label: 'Chief Complaint' },
  { key: 'allergyFlag',    label: 'Allergy' }
];

// Rank used when sorting the news2Response label so 'low' is always less
// than 'high' regardless of locale (only used as a tiebreak; primary sort
// is the numeric news2Score).
const news2ResponseRank = {
  'low': 0,
  'low-medium': 1,
  'medium': 2,
  'high': 3
};

// Rank used when sorting the mtsCategory column. Slugs already start with
// the priority digit so a string compare would work, but an explicit map
// keeps intent obvious if labels ever drift.
const mtsRank = {
  '1-immediate': 1,
  '2-very-urgent': 2,
  '3-urgent': 3,
  '4-standard': 4,
  '5-non-urgent': 5
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

/** Title-case a hyphen-separated slug ('low-medium' -> 'Low-Medium'). */
function capitalize(s) {
  if (!s) return '';
  return String(s)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('-');
}

/** Short human-friendly MTS label for the table cell. */
function mtsCategoryShort(cat) {
  switch (cat) {
    case '1-immediate':   return '1 Immediate';
    case '2-very-urgent': return '2 Very Urgent';
    case '3-urgent':      return '3 Urgent';
    case '4-standard':    return '4 Standard';
    case '5-non-urgent':  return '5 Non-Urgent';
    default:              return cat || '';
  }
}

function news2Class(label) {
  if (!label) return '';
  return 'news2-' + String(label);
}

function mtsClass(label) {
  if (!label) return '';
  return 'mts-' + String(label);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.news2 !== '' ||
    filters.mts !== '' ||
    filters.allergy !== ''
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
      (row.chiefComplaint || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.news2 && row.news2Response !== filters.news2) {
    return false;
  }
  if (filters.mts && row.mtsCategory !== filters.mts) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
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

  if (key === 'news2Score') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'mtsCategory') {
    av = mtsRank[av] ?? 99;
    bv = mtsRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'allergyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, chiefComplaint)
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
    if (row.news2Response === 'high') {
      tr.classList.add('row-news2-high');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="news2-badge ${news2Class(row.news2Response)}">${esc(row.news2Score)} (${esc(capitalize(row.news2Response))})</span></td>
      <td><span class="mts-badge ${mtsClass(row.mtsCategory)}">${esc(mtsCategoryShort(row.mtsCategory))}</span></td>
      <td class="complaint-cell">${esc(row.chiefComplaint)}</td>
      <td>
        <span class="allergy-badge ${row.allergyFlag ? 'allergy-yes' : 'allergy-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
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
    // Numeric / categorical urgency columns default descending so the most
    // urgent patients surface first; everything else defaults ascending.
    sortState.direction =
      (key === 'news2Score' || key === 'mtsCategory' || key === 'allergyFlag')
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const news2 = document.getElementById('filter-news2');
  const mts = document.getElementById('filter-mts');
  const allergy = document.getElementById('filter-allergy');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (news2) {
    news2.addEventListener('change', () => {
      filters.news2 = news2.value;
      renderAll();
    });
  }
  if (mts) {
    mts.addEventListener('change', () => {
      filters.mts = mts.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.news2 = '';
      filters.mts = '';
      filters.allergy = '';
      if (search) search.value = '';
      if (news2) news2.value = '';
      if (mts) mts.value = '';
      if (allergy) allergy.value = '';
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

// Expose a minimal namespace marker so consumers can confirm the dashboard
// app loaded successfully (handy in console / smoke tests).

export { true as appLoaded };
