// First Responder Assessment - management dashboard (vanilla classic-script app).
//
// On boot we fetch the responder list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + readiness-level dropdown + competency-level dropdown +
// role dropdown + training-status dropdown).
//
// Default sort puts non-ready / critical responders at the top of the
// list, surfacing the records that most need management attention.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.FirstResponderAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchResponders,
  sampleResponders
} = window.FirstResponderAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').ResponderRow[]} */
let responders = [];

const filters = {
  search: '',
  readiness: '',
  competency: '',
  role: '',
  training: ''
};

// Default sort: readiness level descending so "Permanently Unfit" rows
// surface first. With the row-emphasis CSS, the most critical responders
// are immediately visible at the top of the table.
const sortState = {
  key: 'readinessLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and
// the row-cell renderer below.
const columns = [
  { key: 'registrationNumber', label: 'Registration #' },
  { key: 'responderName',      label: 'Responder Name' },
  { key: 'roleType',           label: 'Role' },
  { key: 'competencyLevel',    label: 'Competency Level' },
  { key: 'readinessLevel',     label: 'Readiness Level' },
  { key: 'trainingStatus',     label: 'Training Status' },
  { key: 'lastCallOutDate',    label: 'Last Call-Out' },
  { key: 'yearsOfService',     label: 'Years of Service' }
];

// Categorical rank tables. Each rank orders the values from "best" (0) to
// "worst" so an ascending sort surfaces the strongest records first and a
// descending sort surfaces the most critical records first.
const readinessRank = {
  'Fit for Duty': 0,
  'Fit with Restrictions': 1,
  'Temporarily Unfit': 2,
  'Permanently Unfit': 3
};

const competencyRank = {
  'Expert': 0,
  'Competent': 1,
  'Developing': 2,
  'Not Competent': 3
};

const trainingRank = {
  'Current': 0,
  'Due Soon': 1,
  'Overdue': 2
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

function readinessClass(label) {
  if (!label) return '';
  return 'readiness-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function competencyClass(label) {
  if (!label) return '';
  return 'competency-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function trainingClass(label) {
  if (!label) return '';
  return 'training-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function rowReadinessClass(label) {
  if (!label) return '';
  return 'row-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.readiness !== '' ||
    filters.competency !== '' ||
    filters.role !== '' ||
    filters.training !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').ResponderRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.registrationNumber.toLowerCase().includes(term) ||
      row.responderName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.readiness && row.readinessLevel !== filters.readiness) {
    return false;
  }
  if (filters.competency && row.competencyLevel !== filters.competency) {
    return false;
  }
  if (filters.role && row.roleType !== filters.role) {
    return false;
  }
  if (filters.training && row.trainingStatus !== filters.training) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; dates compare as ISO
 * strings (which sorts chronologically); everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'readinessLevel') {
    av = readinessRank[av] ?? -1;
    bv = readinessRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'competencyLevel') {
    av = competencyRank[av] ?? -1;
    bv = competencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'trainingStatus') {
    av = trainingRank[av] ?? -1;
    bv = trainingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'yearsOfService') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare. ISO dates sort chronologically as strings, so
  // `lastCallOutDate` falls through to here intentionally.
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return responders.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('responders-table-head');
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
  const body = document.getElementById('responders-table-body');
  const empty = document.getElementById('responders-empty-message');
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
    const rowCls = rowReadinessClass(row.readinessLevel);
    if (rowCls) tr.classList.add(rowCls);

    tr.innerHTML = `
      <td>${esc(row.registrationNumber)}</td>
      <td>${esc(row.responderName)}</td>
      <td>${esc(row.roleType)}</td>
      <td><span class="competency-badge ${competencyClass(row.competencyLevel)}">${esc(row.competencyLevel)}</span></td>
      <td><span class="readiness-badge ${readinessClass(row.readinessLevel)}">${esc(row.readinessLevel)}</span></td>
      <td><span class="training-badge ${trainingClass(row.trainingStatus)}">${esc(row.trainingStatus)}</span></td>
      <td class="date-cell">${esc(row.lastCallOutDate)}</td>
      <td class="numeric-cell">${esc(row.yearsOfService)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = responders.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No responders to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} responders`;
  } else {
    el.textContent = `Showing ${shown} of ${total} responders`;
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
  const readiness = document.getElementById('filter-readiness');
  const competency = document.getElementById('filter-competency');
  const role = document.getElementById('filter-role');
  const training = document.getElementById('filter-training');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (readiness) {
    readiness.addEventListener('change', () => {
      filters.readiness = readiness.value;
      renderAll();
    });
  }
  if (competency) {
    competency.addEventListener('change', () => {
      filters.competency = competency.value;
      renderAll();
    });
  }
  if (role) {
    role.addEventListener('change', () => {
      filters.role = role.value;
      renderAll();
    });
  }
  if (training) {
    training.addEventListener('change', () => {
      filters.training = training.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.readiness = '';
      filters.competency = '';
      filters.role = '';
      filters.training = '';
      if (search) search.value = '';
      if (readiness) readiness.value = '';
      if (competency) competency.value = '';
      if (role) role.value = '';
      if (training) training.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadResponders() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  responders = sampleResponders;
  renderAll();

  try {
    const items = await fetchResponders();
    if (items && items.length > 0) {
      responders = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty - keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no responders.'
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
  loadResponders();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
