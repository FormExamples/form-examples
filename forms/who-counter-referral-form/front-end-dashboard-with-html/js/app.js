// WHO Counter-Referral Form - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + follow-up timeframe + status-flag presence + patient/family
// informed dropdowns).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.WhoCounterReferralDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.WhoCounterReferralDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  timeframe: '',     // '', 'urgent', '2-6-days', '1-2-weeks', 'over-2-weeks'
  flag: 'all',       // 'all' or one of the status-flag slugs
  informed: 'all'    // 'all', 'yes', 'no'
};

/** Sort state: which column key, ascending or descending. */
const sortState = {
  key: 'dischargedAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientName',           label: 'Patient Name',         sortable: true },
  { key: 'dateOfBirth',           label: 'DOB',                  sortable: true },
  { key: 'sex',                   label: 'Sex',                  sortable: true },
  { key: 'referralFacility',      label: 'Referral Facility',    sortable: true },
  { key: 'primaryCareFacility',   label: 'Primary Care Facility',sortable: true },
  { key: 'finalDiagnosis',        label: 'Diagnosis',            sortable: true },
  { key: 'followUpTimeframe',     label: 'Follow-up',            sortable: true },
  { key: 'statusFlags',           label: 'Status Flags',         sortable: false },
  { key: 'patientFamilyInformed', label: 'Family Informed',      sortable: true },
  { key: 'highPriorityFlagCount', label: 'High-priority Flags',  sortable: true },
  { key: 'dischargedAt',          label: 'Discharged',           sortable: true }
];

// Rank used when sorting the follow-up timeframe column so 'urgent' is
// always less than 'over-2-weeks' regardless of locale.
const timeframeRank = {
  'urgent': 0,
  '2-6-days': 1,
  '1-2-weeks': 2,
  'over-2-weeks': 3
};

const timeframeLabels = {
  'urgent': 'Urgent (< 24h)',
  '2-6-days': '2-6 days',
  '1-2-weeks': '1-2 weeks',
  'over-2-weeks': '> 2 weeks'
};

const flagLabels = {
  'cognitive-impairment': 'Cognitive impairment',
  'carer-dependent': 'Carer-dependent',
  'spinal': 'Spinal precautions',
  'weight-bearing': 'Weight-bearing',
  'palliative-care': 'Palliative care'
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

function timeframeClass(value) {
  if (!value) return '';
  return 'timeframe-' + String(value).toLowerCase();
}

function formatTimeframe(value) {
  return timeframeLabels[value] || value || '';
}

function formatFlag(value) {
  return flagLabels[value] || value;
}

function formatDate(value) {
  if (!value) return '';
  // Accept either YYYY-MM-DD or full ISO timestamps; render as locale date.
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
}

function formatDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.timeframe !== '' ||
    filters.flag !== 'all' ||
    filters.informed !== 'all'
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
      row.patientName.toLowerCase().includes(term) ||
      row.referralFacility.toLowerCase().includes(term) ||
      row.primaryCareFacility.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.timeframe && row.followUpTimeframe !== filters.timeframe) {
    return false;
  }
  if (filters.flag !== 'all') {
    if (!Array.isArray(row.statusFlags) || !row.statusFlags.includes(filters.flag)) {
      return false;
    }
  }
  if (filters.informed === 'yes' && !row.patientFamilyInformed) return false;
  if (filters.informed === 'no' && row.patientFamilyInformed) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Timeframe column uses the
 * `timeframeRank` ordinal; booleans sort false<true; numbers compare
 * numerically; date / datetime columns compare via Date; everything else
 * uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'followUpTimeframe') {
    av = timeframeRank[av] ?? -1;
    bv = timeframeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'patientFamilyInformed') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'highPriorityFlagCount') {
    return ((av || 0) - (bv || 0)) * dir;
  }

  if (key === 'dischargedAt' || key === 'dateOfBirth') {
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

    if (!col.sortable) {
      // Static (non-sortable) column header.
      th.setAttribute('aria-sort', 'none');
      th.textContent = col.label;
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

function renderStatusFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">—</span>';
  }
  const badges = flags.map(
    (f) => `<span class="flag-badge">${esc(formatFlag(f))}</span>`
  );
  return `<span class="status-flags">${badges.join('')}</span>`;
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
    if (row.followUpTimeframe === 'urgent') tr.classList.add('row-urgent');

    const priorityClass =
      (row.highPriorityFlagCount || 0) > 0
        ? 'priority-count priority-count-positive'
        : 'priority-count priority-count-zero';

    tr.innerHTML = `
      <td>${esc(row.patientName)}</td>
      <td>${esc(formatDate(row.dateOfBirth))}</td>
      <td>${esc(row.sex)}</td>
      <td>${esc(row.referralFacility)}</td>
      <td>${esc(row.primaryCareFacility)}</td>
      <td>${esc(row.finalDiagnosis)}</td>
      <td><span class="timeframe-badge ${timeframeClass(row.followUpTimeframe)}">${esc(formatTimeframe(row.followUpTimeframe))}</span></td>
      <td>${renderStatusFlagsCell(row.statusFlags)}</td>
      <td>
        <span class="informed-badge ${row.patientFamilyInformed ? 'informed-yes' : 'informed-no'}">
          ${row.patientFamilyInformed ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="${priorityClass}">${esc(String(row.highPriorityFlagCount ?? 0))}</span></td>
      <td>${esc(formatDateTime(row.dischargedAt))}</td>
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
    el.textContent = `Showing ${total} of ${total} counter-referrals`;
  } else {
    el.textContent = `Showing ${shown} of ${total} counter-referrals`;
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
  const timeframe = document.getElementById('filter-timeframe');
  const flag = document.getElementById('filter-flag');
  const informed = document.getElementById('filter-informed');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (timeframe) {
    timeframe.addEventListener('change', () => {
      filters.timeframe = timeframe.value;
      renderAll();
    });
  }
  if (flag) {
    flag.addEventListener('change', () => {
      filters.flag = flag.value;
      renderAll();
    });
  }
  if (informed) {
    informed.addEventListener('change', () => {
      filters.informed = informed.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.timeframe = '';
      filters.flag = 'all';
      filters.informed = 'all';
      if (search) search.value = '';
      if (timeframe) timeframe.value = '';
      if (flag) flag.value = 'all';
      if (informed) informed.value = 'all';
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
