// UK DVLA M1 - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the applicant list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + primary-condition dropdown + suicidal-variant dropdown +
// recent-contact dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.DvlaM1Dashboard`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.DvlaM1Dashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  condition: '',
  suicidal: '',     // '', 'yes', 'no'
  recentContact: '' // '', 'yes', 'no'
};

/** Sort state: which column key, ascending or descending. Default: most
 * recent submissions first. */
const sortState = {
  key: 'submittedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'drivingLicenceNumber',   label: 'Licence Number' },
  { key: 'applicantName',          label: 'Applicant Name' },
  { key: 'dateOfBirth',            label: 'Date of Birth' },
  { key: 'mentalHealthConditions', label: 'Conditions',         sortable: false },
  { key: 'suicidalThoughtsVariant', label: 'Suicidal Variant' },
  { key: 'recentContact',          label: 'Recent Contact' },
  { key: 'highPriorityFlagCount',  label: 'High-priority Flags' },
  { key: 'submittedAt',            label: 'Submitted' }
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

function formatDateOfBirth(value) {
  if (!value) return '';
  // Avoid Date() timezone-shift by parsing the YYYY-MM-DD parts directly.
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (!m) return value;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

function formatSubmitted(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-GB');
}

function formatConditions(arr) {
  if (!arr || arr.length === 0) return '\u2014'; // em dash
  return arr.join('; ');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.condition !== '' ||
    filters.suicidal !== '' ||
    filters.recentContact !== ''
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
    if (!row.applicantName.toLowerCase().includes(term)) return false;
  }
  if (filters.condition) {
    if (!row.mentalHealthConditions || !row.mentalHealthConditions.includes(filters.condition)) {
      return false;
    }
  }
  if (filters.suicidal === 'yes' && !row.suicidalThoughtsVariant) return false;
  if (filters.suicidal === 'no' && row.suicidalThoughtsVariant) return false;
  if (filters.recentContact === 'yes' && !row.recentContact) return false;
  if (filters.recentContact === 'no' && row.recentContact) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Booleans sort false<true;
 * numbers sort numerically; dates parsed via `Date`; everything else uses
 * a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'suicidalThoughtsVariant' || key === 'recentContact') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'highPriorityFlagCount') {
    return ((av || 0) - (bv || 0)) * dir;
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

    if (col.sortable === false) {
      th.setAttribute('aria-sort', 'none');
      const span = document.createElement('span');
      span.className = 'th-label';
      span.textContent = col.label;
      th.appendChild(span);
      head.appendChild(th);
      continue;
    }

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
    if (row.suicidalThoughtsVariant) tr.classList.add('row-suicidal');

    const flagCount = row.highPriorityFlagCount || 0;
    const flagClass = flagCount === 0
      ? 'flag-count flag-count-zero'
      : (flagCount >= 2 ? 'flag-count flag-count-high' : 'flag-count flag-count-some');

    tr.innerHTML = `
      <td><code class="licence-number">${esc(row.drivingLicenceNumber)}</code></td>
      <td>${esc(row.applicantName)}</td>
      <td>${esc(formatDateOfBirth(row.dateOfBirth))}</td>
      <td class="conditions-cell">${esc(formatConditions(row.mentalHealthConditions))}</td>
      <td>
        <span class="yn-badge ${row.suicidalThoughtsVariant ? 'yn-yes-danger' : 'yn-no'}">
          ${row.suicidalThoughtsVariant ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="yn-badge ${row.recentContact ? 'yn-yes' : 'yn-no'}">
          ${row.recentContact ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="${flagClass}">${flagCount}</span></td>
      <td>${esc(formatSubmitted(row.submittedAt))}</td>
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
    // Sensible default direction per type: dates and counts descend first,
    // strings ascend first.
    sortState.direction =
      (key === 'submittedAt' || key === 'dateOfBirth' || key === 'highPriorityFlagCount')
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const condition = document.getElementById('filter-condition');
  const suicidal = document.getElementById('filter-suicidal');
  const recentContact = document.getElementById('filter-recent-contact');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (condition) {
    condition.addEventListener('change', () => {
      filters.condition = condition.value;
      renderAll();
    });
  }
  if (suicidal) {
    suicidal.addEventListener('change', () => {
      filters.suicidal = suicidal.value;
      renderAll();
    });
  }
  if (recentContact) {
    recentContact.addEventListener('change', () => {
      filters.recentContact = recentContact.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.condition = '';
      filters.suicidal = '';
      filters.recentContact = '';
      if (search) search.value = '';
      if (condition) condition.value = '';
      if (suicidal) suicidal.value = '';
      if (recentContact) recentContact.value = '';
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
