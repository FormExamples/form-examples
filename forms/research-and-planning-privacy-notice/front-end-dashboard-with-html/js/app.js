// Research and Planning Privacy Notice - compliance dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + opt-in-status dropdown + lawful-basis dropdown +
// completion-status dropdown).
//
// Default sort surfaces the strongest dissents first — Both Opt-Outs, then
// National Opt-Out, then Type 1 Opt-Out, then Not Recorded, then Opted In —
// so the IG officer sees the highest-priority compliance signals without
// scrolling.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.ResearchAndPlanningPrivacyNoticeDashboard`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak to the
// global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.ResearchAndPlanningPrivacyNoticeDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  optin: '',
  basis: '',
  completion: ''
};

// Default sort: opt-in status, descending. Combined with the rank table
// below this puts Both Opt-Outs first, then National Opt-Out, Type 1
// Opt-Out, Not Recorded, and finally Opted In — i.e. the highest-priority
// IG signals surface at the top of the list without the user having to
// click anything.
const sortState = {
  key: 'optInStatus',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'organisationName',    label: 'Organisation' },
  { key: 'optInStatus',         label: 'Opt-In Status' },
  { key: 'type1OptOut',         label: 'Type 1 Opt-Out' },
  { key: 'nationalDataOptOut',  label: 'National Opt-Out' },
  { key: 'lawfulBasis',         label: 'Lawful Basis' },
  { key: 'completionStatus',    label: 'Completion' },
  { key: 'acknowledgementDate', label: 'Acknowledged' }
];

// Rank used when sorting the optInStatus column. Higher numbers mean
// stronger dissent / higher IG priority, so a 'desc' default surfaces
// Both Opt-Outs first.
const optInRank = {
  'Opted In': 0,
  'Not Recorded': 1,
  'Type 1 Opt-Out': 2,
  'National Opt-Out': 3,
  'Both Opt-Outs': 4
};

// Rank used when sorting the lawfulBasis column. Public Task is the
// statutory NHS default; Consent and Vital Interests are the explicit
// alternatives. Ordering reflects review precedence rather than priority.
const basisRank = {
  'Public Task': 0,
  'Consent': 1,
  'Vital Interests': 2
};

// Rank used when sorting the completionStatus column. Incomplete is the
// higher-priority bucket so a 'desc' sort places it on top.
const completionRank = {
  'Complete': 0,
  'Incomplete': 1
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

function optInClass(label) {
  if (!label) return '';
  return 'optin-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function completionClass(label) {
  if (!label) return '';
  return 'completion-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.optin !== '' ||
    filters.basis !== '' ||
    filters.completion !== ''
  );
}

/**
 * Format an ISO yyyy-mm-dd date for display, or return an em-dash if empty.
 * Returns the ISO string verbatim — no locale conversion — so column sort
 * and display both rely on the same lexical ordering.
 */
function formatAckDate(iso) {
  if (!iso) return '—';
  return iso;
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
      row.organisationName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.optin && row.optInStatus !== filters.optin) {
    return false;
  }
  if (filters.basis && row.lawfulBasis !== filters.basis) {
    return false;
  }
  if (filters.completion && row.completionStatus !== filters.completion) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; everything else uses a
 * locale-aware string compare. Empty `acknowledgementDate` strings sort
 * last regardless of direction so "never acknowledged" rows stay visually
 * grouped.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'optInStatus') {
    av = optInRank[av] ?? -1;
    bv = optInRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'lawfulBasis') {
    av = basisRank[av] ?? -1;
    bv = basisRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'completionStatus') {
    av = completionRank[av] ?? -1;
    bv = completionRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'type1OptOut' || key === 'nationalDataOptOut') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'acknowledgementDate') {
    // Empty strings (never acknowledged) bucket last regardless of
    // direction so they read as "no data" rather than "earliest possible
    // date".
    const aEmpty = !av;
    const bEmpty = !bv;
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    return String(av).localeCompare(String(bv)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, organisationName)
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
    th.className = 'data-table-th';
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

/**
 * Pick the row-tint class for a patient based on opt-out posture.
 * Strongest dissent (Both Opt-Outs) gets the most prominent tint; rows
 * without a recorded preference get a soft amber so they read as
 * "needs follow-up" rather than "compliant".
 */
function rowTintClass(row) {
  switch (row.optInStatus) {
    case 'Both Opt-Outs':    return 'row-both-optouts';
    case 'National Opt-Out': return 'row-national-optout';
    case 'Type 1 Opt-Out':   return 'row-type1-optout';
    case 'Not Recorded':     return 'row-not-recorded';
    default:                 return '';
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
    const tint = rowTintClass(row);
    if (tint) tr.classList.add(tint);

    const dateClass = row.acknowledgementDate
      ? 'ack-date'
      : 'ack-date ack-date-empty';

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.organisationName)}</td>
      <td class="data-table-td"><span class="optin-badge ${optInClass(row.optInStatus)}">${esc(row.optInStatus)}</span></td>
      <td class="data-table-td">
        <span class="flag-pill ${row.type1OptOut ? 'flag-pill-on' : 'flag-pill-off'}">
          ${row.type1OptOut ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td">
        <span class="flag-pill ${row.nationalDataOptOut ? 'flag-pill-on' : 'flag-pill-off'}">
          ${row.nationalDataOptOut ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td"><span class="basis-badge">${esc(row.lawfulBasis)}</span></td>
      <td class="data-table-td"><span class="completion-badge ${completionClass(row.completionStatus)}">${esc(row.completionStatus)}</span></td>
      <td class="data-table-td"><span class="${dateClass}">${esc(formatAckDate(row.acknowledgementDate))}</span></td>
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
  const optin = document.getElementById('filter-optin');
  const basis = document.getElementById('filter-basis');
  const completion = document.getElementById('filter-completion');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (optin) {
    optin.addEventListener('change', () => {
      filters.optin = optin.value;
      renderAll();
    });
  }
  if (basis) {
    basis.addEventListener('change', () => {
      filters.basis = basis.value;
      renderAll();
    });
  }
  if (completion) {
    completion.addEventListener('change', () => {
      filters.completion = completion.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.optin = '';
      filters.basis = '';
      filters.completion = '';
      if (search) search.value = '';
      if (optin) optin.value = '';
      if (basis) basis.value = '';
      if (completion) completion.value = '';
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
