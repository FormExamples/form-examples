// Gerontology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + CFS score dropdown + falls risk dropdown + cognitive
// status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.GerontologyAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.GerontologyAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  cfs: '',       // '' or '1'..'9'
  falls: '',     // '' | 'Low' | 'Medium' | 'High'
  cognitive: ''  // '' | 'Normal' | 'Mild Impairment' | 'Moderate Impairment' | 'Severe Impairment'
};

// Default sort: patient name ascending. Matches the SvelteKit dashboard's
// initial sort applied via api.exec('sort-rows', { key: 'patientName', order: 'asc' }).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'cfsScore',        label: 'CFS Score' },
  { key: 'fallsRisk',       label: 'Falls Risk' },
  { key: 'cognitiveStatus', label: 'Cognitive Status' }
];

// Rank used when sorting the fallsRisk column so 'Low' is always less than
// 'High' regardless of locale.
const fallsRank = {
  'Low': 0,
  'Medium': 1,
  'High': 2
};

// Rank used when sorting the cognitiveStatus column.
const cognitiveRank = {
  'Normal': 0,
  'Mild Impairment': 1,
  'Moderate Impairment': 2,
  'Severe Impairment': 3
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

function fallsClass(label) {
  if (!label) return '';
  return 'falls-' + String(label).toLowerCase();
}

function cognitiveClass(label) {
  if (!label) return '';
  return 'cognitive-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.cfs !== '' ||
    filters.falls !== '' ||
    filters.cognitive !== ''
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
  if (filters.cfs && row.cfsScore !== Number(filters.cfs)) {
    return false;
  }
  if (filters.falls && row.fallsRisk !== filters.falls) {
    return false;
  }
  if (filters.cognitive && row.cognitiveStatus !== filters.cognitive) {
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

  if (key === 'fallsRisk') {
    av = fallsRank[av] ?? -1;
    bv = fallsRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'cognitiveStatus') {
    av = cognitiveRank[av] ?? -1;
    bv = cognitiveRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'cfsScore') {
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
    // Highlight rows where the patient is severely frail or worse
    // (CFS 7-9): these patients most need clinical attention.
    if (row.cfsScore >= 7) {
      tr.classList.add('row-severely-frail');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="cfs-score">CFS ${esc(row.cfsScore)}</span></td>
      <td><span class="falls-badge ${fallsClass(row.fallsRisk)}">${esc(row.fallsRisk)}</span></td>
      <td><span class="cognitive-badge ${cognitiveClass(row.cognitiveStatus)}">${esc(row.cognitiveStatus)}</span></td>
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
  const cfs = document.getElementById('filter-cfs');
  const falls = document.getElementById('filter-falls');
  const cognitive = document.getElementById('filter-cognitive');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (cfs) {
    cfs.addEventListener('change', () => {
      filters.cfs = cfs.value;
      renderAll();
    });
  }
  if (falls) {
    falls.addEventListener('change', () => {
      filters.falls = falls.value;
      renderAll();
    });
  }
  if (cognitive) {
    cognitive.addEventListener('change', () => {
      filters.cognitive = cognitive.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.cfs = '';
      filters.falls = '';
      filters.cognitive = '';
      if (search) search.value = '';
      if (cfs) cfs.value = '';
      if (falls) falls.value = '';
      if (cognitive) cognitive.value = '';
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
