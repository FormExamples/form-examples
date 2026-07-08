// Blood Donation Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the donor list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + eligibility dropdown + vital-signs dropdown + risk-flag
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.BloodDonationAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchDonors,
  sampleDonors
} = window.BloodDonationAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').DonorRow[]} */
let donors = [];

const filters = {
  search: '',
  eligibility: '',
  vitals: '',
  risk: '' // '', 'yes', 'no'
};

// Default sort: eligibility descending so deferred donors (the ones a
// clinician most needs to review) sort to the top of the list.
const sortState = {
  key: 'eligibility',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'donorName',     label: 'Donor Name' },
  { key: 'eligibility',   label: 'Eligibility' },
  { key: 'hemoglobinGdl', label: 'Hemoglobin (g/dL)' },
  { key: 'vitalsStatus',  label: 'Vital Signs' },
  { key: 'riskFlag',      label: 'Risk Flag' }
];

// Rank used when sorting the eligibility column so 'Eligible' is always
// less than 'Permanently Deferred' regardless of locale.
const eligibilityRank = {
  'Eligible': 0,
  'Temporarily Deferred': 1,
  'Permanently Deferred': 2
};

// Rank used when sorting the vitalsStatus column.
const vitalsRank = {
  'Normal': 0,
  'Borderline': 1,
  'Out of Range': 2
};

// JPAC capillary-Hb thresholds: <12.5 g/dL flagged as low. We do not have
// donor sex on the row so we use the female threshold as the more
// conservative cell-emphasis trigger.
const HB_LOW_THRESHOLD = 12.5;

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

function eligibilityClass(label) {
  if (!label) return '';
  return 'eligibility-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function vitalsClass(label) {
  if (!label) return '';
  return 'vitals-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function formatHb(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '';
  return Number(v).toFixed(1);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.eligibility !== '' ||
    filters.vitals !== '' ||
    filters.risk !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').DonorRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.donorName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.eligibility && row.eligibility !== filters.eligibility) {
    return false;
  }
  if (filters.vitals && row.vitalsStatus !== filters.vitals) {
    return false;
  }
  if (filters.risk === 'yes' && !row.riskFlag) return false;
  if (filters.risk === 'no' && row.riskFlag) return false;
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

  if (key === 'eligibility') {
    av = eligibilityRank[av] ?? -1;
    bv = eligibilityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'vitalsStatus') {
    av = vitalsRank[av] ?? -1;
    bv = vitalsRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'riskFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'hemoglobinGdl') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, donorName)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return donors.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('donors-table-head');
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
  const body = document.getElementById('donors-table-body');
  const empty = document.getElementById('donors-empty-message');
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
    if (row.eligibility === 'Permanently Deferred') {
      tr.classList.add('row-permanently-deferred');
    }

    const hbLow = typeof row.hemoglobinGdl === 'number'
      && row.hemoglobinGdl < HB_LOW_THRESHOLD;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.donorName)}</td>
      <td><span class="eligibility-badge ${eligibilityClass(row.eligibility)}">${esc(row.eligibility)}</span></td>
      <td><span class="hb-value ${hbLow ? 'hb-low' : ''}">${esc(formatHb(row.hemoglobinGdl))}</span></td>
      <td><span class="vitals-badge ${vitalsClass(row.vitalsStatus)}">${esc(row.vitalsStatus)}</span></td>
      <td>
        <span class="risk-badge ${row.riskFlag ? 'risk-yes' : 'risk-no'}">
          ${row.riskFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = donors.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No donors to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} donors`;
  } else {
    el.textContent = `Showing ${shown} of ${total} donors`;
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
  const eligibility = document.getElementById('filter-eligibility');
  const vitals = document.getElementById('filter-vitals');
  const risk = document.getElementById('filter-risk');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (eligibility) {
    eligibility.addEventListener('change', () => {
      filters.eligibility = eligibility.value;
      renderAll();
    });
  }
  if (vitals) {
    vitals.addEventListener('change', () => {
      filters.vitals = vitals.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.eligibility = '';
      filters.vitals = '';
      filters.risk = '';
      if (search) search.value = '';
      if (eligibility) eligibility.value = '';
      if (vitals) vitals.value = '';
      if (risk) risk.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadDonors() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  donors = sampleDonors;
  renderAll();

  try {
    const items = await fetchDonors();
    if (items && items.length > 0) {
      donors = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no donors.'
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
  loadDonors();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
