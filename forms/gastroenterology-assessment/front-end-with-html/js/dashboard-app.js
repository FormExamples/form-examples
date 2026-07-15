import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Gastroenterology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity-band dropdown + red-flag dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '', // '', 'minimal', 'mild', 'moderate', 'severe', 'very-severe'
  redFlag: ''   // '', 'yes', 'no'
};

// Default sort: severity score descending. Highest severity = top of the
// list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'severityScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',      label: 'NHS Number' },
  { key: 'patientName',    label: 'Patient Name' },
  { key: 'severityScore',  label: 'Severity Score' },
  { key: 'primarySymptom', label: 'Primary Symptom' },
  { key: 'redFlagCount',   label: 'Red Flags' }
];

// Severity band thresholds — kept in one place so the filter dropdown,
// badge text, and CSS class all stay in sync.
const severityRank = {
  'minimal':     0,
  'mild':        1,
  'moderate':    2,
  'severe':      3,
  'very-severe': 4
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

/** Map a numeric severity score to its band slug. */
function severityLevel(score) {
  if (score <= 10) return 'minimal';
  if (score <= 20) return 'mild';
  if (score <= 30) return 'moderate';
  if (score <= 40) return 'severe';
  return 'very-severe';
}

/** Map a numeric severity score to its display label. */
function severityLabel(score) {
  if (score <= 10) return 'Minimal';
  if (score <= 20) return 'Mild';
  if (score <= 30) return 'Moderate';
  if (score <= 40) return 'Severe';
  return 'Very Severe';
}

function severityClass(score) {
  return 'severity-' + severityLevel(score);
}

function redFlagClass(count) {
  if (count === 0) return 'redflag-none';
  if (count <= 2) return 'redflag-low';
  return 'redflag-high';
}

function redFlagLabel(count) {
  if (count === 0) return 'None';
  return count + ' flag' + (count > 1 ? 's' : '');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.redFlag !== ''
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
      row.primarySymptom.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.severity && severityLevel(row.severityScore) !== filters.severity) {
    return false;
  }
  if (filters.redFlag === 'yes' && row.redFlagCount === 0) return false;
  if (filters.redFlag === 'no'  && row.redFlagCount  >  0) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Numeric columns compare
 * directly; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'severityScore' || key === 'redFlagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, primarySymptom)
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
    const level = severityLevel(row.severityScore);
    if (level === 'severe' || level === 'very-severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="severity-score">${esc(row.severityScore)}</span>
        <span class="severity-badge ${severityClass(row.severityScore)}">${esc(severityLabel(row.severityScore))}</span>
      </td>
      <td class="symptom-cell">${esc(row.primarySymptom)}</td>
      <td>
        <span class="redflag-badge ${redFlagClass(row.redFlagCount)}">${esc(redFlagLabel(row.redFlagCount))}</span>
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
    // Numeric columns default to descending (worst first); string columns
    // default to ascending (alphabetical).
    sortState.direction =
      (key === 'severityScore' || key === 'redFlagCount') ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const redFlag = document.getElementById('filter-redflag');
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
  if (redFlag) {
    redFlag.addEventListener('change', () => {
      filters.redFlag = redFlag.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.redFlag = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (redFlag) redFlag.value = '';
      renderAll();
    });
  }
}

// Suppress unused-variable warnings for the JSDoc rank table — we keep it
// for future locale-stable sorting of the severity column if it ever
// becomes string-typed at the source.
void severityRank;

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
