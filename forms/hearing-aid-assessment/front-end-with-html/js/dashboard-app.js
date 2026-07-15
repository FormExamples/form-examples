import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Hearing Aid Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity dropdown + age-band dropdown + hearing-aid
// dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',
  ageBand: '',
  hearingAid: '' // '', 'yes', 'no'
};

// Default sort: HHIE-S score descending. Highest score = most significant
// handicap = top of the list, surfacing the patients who most need clinical
// attention.
const sortState = {
  key: 'hhiesScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',                 label: 'NHS Number' },
  { key: 'patientName',               label: 'Patient Name' },
  { key: 'age',                       label: 'Age' },
  { key: 'ageBand',                   label: 'Age Band' },
  { key: 'hhiesScore',                label: 'HHIE-S Score' },
  { key: 'severity',                  label: 'Severity' },
  { key: 'hearingAidUser',            label: 'Hearing Aid' },
  { key: 'occupationalNoiseExposure', label: 'Noise Exposure' }
];

// Rank used when sorting the severity column so 'No handicap' is always less
// than 'Significant handicap' regardless of locale.
const severityRank = {
  'No handicap': 0,
  'Mild to moderate handicap': 1,
  'Significant handicap': 2
};

// Rank used when sorting the age-band column so the bands order
// chronologically rather than alphabetically.
const ageBandRank = {
  'Under 50': 0,
  '50-64': 1,
  '65-74': 2,
  '75-84': 3,
  '85+': 4
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

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.ageBand !== '' ||
    filters.hearingAid !== ''
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
  if (filters.severity && row.severity !== filters.severity) {
    return false;
  }
  if (filters.ageBand && row.ageBand !== filters.ageBand) {
    return false;
  }
  if (filters.hearingAid === 'yes' && !row.hearingAidUser) return false;
  if (filters.hearingAid === 'no' && row.hearingAidUser) return false;
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

  if (key === 'severity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageBand') {
    av = ageBandRank[av] ?? -1;
    bv = ageBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'hearingAidUser' || key === 'occupationalNoiseExposure') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'hhiesScore' || key === 'age') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
  return String(av).localeCompare(String(bv)) * dir;
}

/**
 * Always group "Significant handicap" rows to the top of the list so
 * severe cases surface first, regardless of the active sort. Within each
 * severity group we apply the user-selected sort.
 */
function visibleRows() {
  const filtered = patients.filter(matchesFilters).slice();
  filtered.sort(function (a, b) {
    const sa = severityRank[a.severity] ?? -1;
    const sb = severityRank[b.severity] ?? -1;
    // Severe (rank 2) before moderate (1) before none (0).
    if (sa !== sb) return sb - sa;
    return compareRows(a, b);
  });
  return filtered;
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
    if (row.severity === 'Significant handicap') {
      tr.classList.add('row-significant-handicap');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.age)}</td>
      <td><span class="age-band-badge">${esc(row.ageBand)}</span></td>
      <td><span class="hhies-score">${esc(row.hhiesScore)}/40</span></td>
      <td><span class="severity-badge ${severityClass(row.severity)}">${esc(row.severity)}</span></td>
      <td>
        <span class="hearing-aid-badge ${row.hearingAidUser ? 'hearing-aid-yes' : 'hearing-aid-no'}">
          ${row.hearingAidUser ? 'User' : 'Non-user'}
        </span>
      </td>
      <td>
        <span class="noise-badge ${row.occupationalNoiseExposure ? 'noise-yes' : 'noise-no'}">
          ${row.occupationalNoiseExposure ? 'Yes' : 'No'}
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
    // Numeric columns default to descending (worst first); categorical and
    // string columns default to ascending.
    sortState.direction = (key === 'hhiesScore' || key === 'age')
      ? 'desc'
      : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const ageBand = document.getElementById('filter-age-band');
  const hearingAid = document.getElementById('filter-hearing-aid');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (ageBand) {
    ageBand.addEventListener('change', () => {
      filters.ageBand = ageBand.value;
      renderAll();
    });
  }
  if (hearingAid) {
    hearingAid.addEventListener('change', () => {
      filters.hearingAid = hearingAid.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.ageBand = '';
      filters.hearingAid = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (ageBand) ageBand.value = '';
      if (hearingAid) hearingAid.value = '';
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
