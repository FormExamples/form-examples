import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Fall Risk Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity dropdown + ward dropdown + anticoagulant dropdown).
//
// Default sort surfaces Critical patients first (severity rank descending,
// then MFS score descending), matching the clinical priority defined in
// `forms/fall-risk-assessment/AGENTS.md`.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',
  ward: '',
  anticoagulant: '' // '', 'yes', 'no'
};

// Default sort: severity descending so Critical rows appear at the top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'severity',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'mfsScore',      label: 'MFS Score' },
  { key: 'severity',      label: 'Severity' },
  { key: 'ward',          label: 'Ward' },
  { key: 'anticoagulant', label: 'Anticoagulant' },
  { key: 'recentFall',    label: 'Recent Fall' }
];

// Rank used when sorting the severity column so 'Low' is always less than
// 'Critical' regardless of locale. Higher rank = more clinically urgent.
const severityRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2,
  'Critical': 3
};

// Rank used when sorting the ward column so the order is stable and
// independent of locale alphabetisation.
const wardRank = {
  'Geriatric': 0,
  'Orthopaedic': 1,
  'Stroke': 2,
  'Surgical': 3,
  'Neurology': 4,
  'Community': 5
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
  return 'severity-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.ward !== '' ||
    filters.anticoagulant !== ''
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
  if (filters.ward && row.ward !== filters.ward) {
    return false;
  }
  if (filters.anticoagulant === 'yes' && !row.anticoagulant) return false;
  if (filters.anticoagulant === 'no' && row.anticoagulant) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * everything else uses a locale-aware string compare.
 *
 * Severity ties break on MFS score so Critical patients with MFS 95 sort
 * above Critical patients with MFS 45.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'severity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    if (av !== bv) return (av - bv) * dir;
    // Tie-breaker: MFS score in the same direction so worst-of-tier first
    // when sorting descending.
    return ((a.mfsScore ?? 0) - (b.mfsScore ?? 0)) * dir;
  }

  if (key === 'ward') {
    av = wardRank[av] ?? -1;
    bv = wardRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'anticoagulant' || key === 'recentFall') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'mfsScore') {
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
    if (row.severity === 'Critical') {
      tr.classList.add('row-critical');
    } else if (row.severity === 'High') {
      tr.classList.add('row-high');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="mfs-score">${esc(row.mfsScore)}/125</span></td>
      <td><span class="severity-badge ${severityClass(row.severity)}">${esc(row.severity)}</span></td>
      <td><span class="ward-badge">${esc(row.ward)}</span></td>
      <td>
        <span class="anticoagulant-badge ${row.anticoagulant ? 'anticoagulant-yes' : 'anticoagulant-no'}">
          ${row.anticoagulant ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="recent-fall-badge ${row.recentFall ? 'recent-fall-yes' : 'recent-fall-no'}">
          ${row.recentFall ? 'Yes' : 'No'}
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
    // Severity defaults to descending (Critical first); everything else
    // defaults to ascending.
    sortState.direction = (key === 'severity' || key === 'mfsScore')
      ? 'desc'
      : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const ward = document.getElementById('filter-ward');
  const anticoagulant = document.getElementById('filter-anticoagulant');
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
  if (ward) {
    ward.addEventListener('change', () => {
      filters.ward = ward.value;
      renderAll();
    });
  }
  if (anticoagulant) {
    anticoagulant.addEventListener('change', () => {
      filters.anticoagulant = anticoagulant.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.ward = '';
      filters.anticoagulant = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (ward) ward.value = '';
      if (anticoagulant) anticoagulant.value = '';
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
