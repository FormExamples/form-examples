// Heart Health Check - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + sex dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.HeartHealthCheckDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.HeartHealthCheckDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',  // '', 'low', 'moderate', 'high'
  sex: ''    // '', 'female', 'male'
};

// Default sort: 10-year CVD risk descending. Highest-risk patients surface
// at the top of the list, prompting clinical attention first. This matches
// the clinical priority of a screening dashboard (worst first).
const sortState = {
  key: 'tenYearRisk',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'age',           label: 'Age' },
  { key: 'sex',           label: 'Sex' },
  { key: 'riskCategory',  label: 'Risk' },
  { key: 'tenYearRisk',   label: '10-Year CVD %' },
  { key: 'heartAge',      label: 'Heart Age' },
  { key: 'flagCount',     label: 'Flags' },
  { key: 'submittedDate', label: 'Submitted' }
];

// Rank used when sorting the riskCategory column so 'low' < 'moderate' <
// 'high' regardless of locale. 'draft' sinks below the rest because draft
// records normally won't appear in a dashboard view.
const riskRank = {
  'draft': -1,
  'low': 0,
  'moderate': 1,
  'high': 2
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

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

/**
 * Bucket a flag count into one of three CSS classes:
 *  - flag-zero  (0)        — subtle / muted
 *  - flag-low   (1-2)      — amber
 *  - flag-high  (3+)       — red
 */
function flagClass(n) {
  if (!n || n === 0) return 'flag-zero';
  if (n <= 2) return 'flag-low';
  return 'flag-high';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.sex !== ''
  );
}

/** Render the heart-age cell: heart age plus a coloured gap indicator. */
function renderHeartAgeCell(row) {
  if (row.heartAge == null) {
    return '<span class="num-cell">&mdash;</span>';
  }
  const gap = row.heartAge - row.age;
  let gapClass = '';
  let gapLabel = '';
  if (gap > 0) {
    gapClass = 'gap-positive';
    gapLabel = '(+' + gap + ')';
  } else if (gap < 0) {
    gapClass = 'gap-negative';
    gapLabel = '(' + gap + ')';
  } else {
    gapLabel = '(0)';
  }
  return (
    '<span class="num-cell">' + esc(row.heartAge) + '</span>' +
    '<span class="heart-age-gap ' + gapClass + '">' + esc(gapLabel) + '</span>'
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
  if (filters.risk && row.riskCategory !== filters.risk) {
    return false;
  }
  if (filters.sex && row.sex !== filters.sex) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; nullable numbers sort nulls
 * last; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskCategory') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'age' || key === 'tenYearRisk' || key === 'flagCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'heartAge') {
    // Nulls sink to the bottom regardless of direction.
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, sex, submittedDate)
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
    th.className = 'data-table-th';
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
    tr.className = 'data-table-row';
    if (row.riskCategory === 'high') {
      tr.classList.add('row-high-risk');
    }

    const tenYearLabel = (row.tenYearRisk == null)
      ? '&mdash;'
      : esc(Number(row.tenYearRisk).toFixed(1)) + '%';

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td"><span class="num-cell">${esc(row.age)}</span></td>
      <td class="data-table-td"><span class="sex-cell">${esc(row.sex)}</span></td>
      <td class="data-table-td"><span class="risk-badge ${riskClass(row.riskCategory)}">${esc(row.riskCategory)}</span></td>
      <td class="data-table-td"><span class="num-cell">${tenYearLabel}</span></td>
      <td class="data-table-td">${renderHeartAgeCell(row)}</td>
      <td class="data-table-td"><span class="flag-badge ${flagClass(row.flagCount)}">${esc(row.flagCount)}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.submittedDate)}</span></td>
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
    // Numeric / risk columns default to descending (worst first); textual
    // columns default to ascending (A-Z).
    if (
      key === 'tenYearRisk' ||
      key === 'flagCount' ||
      key === 'riskCategory' ||
      key === 'heartAge' ||
      key === 'age' ||
      key === 'submittedDate'
    ) {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const sex = document.getElementById('filter-sex');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (sex) {
    sex.addEventListener('change', () => {
      filters.sex = sex.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.sex = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (sex) sex.value = '';
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
