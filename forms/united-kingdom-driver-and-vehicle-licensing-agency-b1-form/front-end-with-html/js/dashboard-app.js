// DVLA B1 Form - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the applicant list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + epilepsy / completeness / high-priority dropdowns).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.DvlaB1Dashboard`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.DvlaB1Dashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  epilepsy: '',      // '', 'yes', 'no'
  completeness: '',  // '', 'complete', 'partial'
  highPriority: ''   // '', 'present', 'none'
};

/** Sort state: which column key, ascending or descending.
 * Default is most-recent submissions first, matching the SvelteKit grid's
 * implicit "newest at the top" expectation for clinician triage. */
const sortState = {
  key: 'submittedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Order matches the spec: Licence Number first,
// then Applicant Name, DOB, Conditions, Epilepsy, Completeness, Flags,
// Submitted.
const columns = [
  { key: 'drivingLicenceNumber',   label: 'Licence Number',     numeric: false },
  { key: 'applicantName',          label: 'Applicant Name',     numeric: false },
  { key: 'dateOfBirth',            label: 'Date of Birth',      numeric: false },
  { key: 'conditionsDeclared',     label: 'Conditions Declared', numeric: true  },
  { key: 'epilepsyDeclared',       label: 'Epilepsy',           numeric: false },
  { key: 'validationCompleteness', label: 'Completeness',       numeric: true  },
  { key: 'highPriorityFlagCount',  label: 'High-Priority Flags', numeric: true  },
  { key: 'submittedAt',            label: 'Submitted',          numeric: false }
];

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

/** Format a YYYY-MM-DD as locale date; pass through if invalid. */
function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB');
}

/** Format an ISO timestamp as locale date+time; pass through if invalid. */
function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-GB');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.epilepsy !== '' ||
    filters.completeness !== '' ||
    filters.highPriority !== ''
  );
}

/** Choose a CSS class for the high-priority flag count badge. */
function flagClass(n) {
  if (!n || n <= 0) return 'flag-zero';
  if (n >= 3) return 'flag-many';
  return 'flag-some';
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
    if (!row.applicantName.toLowerCase().includes(term)) {
      return false;
    }
  }

  if (filters.epilepsy === 'yes' && !row.epilepsyDeclared) return false;
  if (filters.epilepsy === 'no' && row.epilepsyDeclared) return false;

  if (filters.completeness === 'complete' && row.validationCompleteness < 100) {
    return false;
  }
  if (filters.completeness === 'partial' && row.validationCompleteness >= 100) {
    return false;
  }

  if (filters.highPriority === 'present' && row.highPriorityFlagCount === 0) {
    return false;
  }
  if (filters.highPriority === 'none' && row.highPriorityFlagCount > 0) {
    return false;
  }

  return true;
}

/**
 * Compare two rows for the active sort column. Numeric and boolean columns
 * use numeric / 0-1 ordering; date columns use timestamp ordering;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (
    key === 'conditionsDeclared' ||
    key === 'validationCompleteness' ||
    key === 'highPriorityFlagCount'
  ) {
    return ((av || 0) - (bv || 0)) * dir;
  }

  if (key === 'epilepsyDeclared') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'submittedAt' || key === 'dateOfBirth') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  // Default: string compare
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
    if (col.numeric) th.classList.add('num');

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
    if (row.highPriorityFlagCount > 0 || row.epilepsyDeclared) {
      tr.classList.add('row-attention');
    }

    const completeness = Math.max(
      0,
      Math.min(100, Number(row.validationCompleteness) || 0)
    );
    const isPartial = completeness < 100;

    tr.innerHTML = `
      <td>${esc(row.drivingLicenceNumber)}</td>
      <td>${esc(row.applicantName)}</td>
      <td>${esc(formatDate(row.dateOfBirth))}</td>
      <td class="num">${esc(row.conditionsDeclared)}</td>
      <td>
        <span class="yesno-badge ${row.epilepsyDeclared ? 'yesno-yes' : 'yesno-no'}">
          ${row.epilepsyDeclared ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="num">
        <span class="completeness">
          <span class="completeness-bar">
            <span
              class="completeness-fill${isPartial ? ' is-partial' : ''}"
              style="width: ${completeness}%"
            ></span>
          </span>
          <span class="completeness-value">${completeness}%</span>
        </span>
      </td>
      <td class="num">
        <span class="flag-badge ${flagClass(row.highPriorityFlagCount)}">
          ${esc(row.highPriorityFlagCount)}
        </span>
      </td>
      <td>${esc(formatDateTime(row.submittedAt))}</td>
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
    el.textContent = 'No applicants to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} applicants`;
  } else {
    el.textContent = `Showing ${shown} of ${total} applicants`;
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
    // Numeric and date columns default to descending (most-recent / highest
    // first); text columns default to ascending (A-Z).
    const col = columns.find((c) => c.key === key);
    sortState.direction =
      (col && (col.numeric || key === 'submittedAt' || key === 'dateOfBirth'))
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const epilepsy = document.getElementById('filter-epilepsy');
  const completeness = document.getElementById('filter-completeness');
  const highPriority = document.getElementById('filter-high-priority');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (epilepsy) {
    epilepsy.addEventListener('change', () => {
      filters.epilepsy = epilepsy.value;
      renderAll();
    });
  }
  if (completeness) {
    completeness.addEventListener('change', () => {
      filters.completeness = completeness.value;
      renderAll();
    });
  }
  if (highPriority) {
    highPriority.addEventListener('change', () => {
      filters.highPriority = highPriority.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.epilepsy = '';
      filters.completeness = '';
      filters.highPriority = '';
      if (search) search.value = '';
      if (epilepsy) epilepsy.value = '';
      if (completeness) completeness.value = '';
      if (highPriority) highPriority.value = '';
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
        'Showing sample data — backend returned no applicants.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
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
