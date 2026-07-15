import { fetchScreenings } from './api.js';
import { sampleScreenings } from './data.js';

// Newborn Blood Spot Screening — dashboard (vanilla classic-script app).
//
// On boot we fetch the screening list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + outcome dropdown + referral dropdown + adequacy dropdown + carrier
// dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').ScreeningRow[]} */
let screenings = [];

const filters = {
  search: '',
  outcome: '',   // '' | overall outcome enum
  referral: '',  // '' | 'routine' | 'repeat' | 'urgent'
  adequate: '',  // '' | 'yes' | 'no'
  carrier: ''    // '' | 'yes' | 'no'
};

const sortState = {
  key: 'nhsNumber',
  direction: 'asc' // 'asc' | 'desc'
};

const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'babyName',        label: 'Baby Name' },
  { key: 'overallOutcome',  label: 'Overall Outcome' },
  { key: 'referralStatus',  label: 'Referral' },
  { key: 'ageAtSampleDays', label: 'Age (days)' },
  { key: 'sampleAdequate',  label: 'Adequate' },
  { key: 'suspectedCount',  label: 'Suspected' },
  { key: 'carrierFlag',     label: 'Carrier' }
];

// Sort ranks so categorical columns order sensibly regardless of locale.
const outcomeRank = {
  'referral-required': 0,
  'repeat-required': 1,
  'incomplete': 2,
  'declined-only-outstanding': 3,
  'all-not-suspected': 4
};

const referralRank = {
  'urgent': 0,
  'repeat': 1,
  'routine': 2
};

const outcomeLabels = {
  'all-not-suspected': 'All not suspected',
  'referral-required': 'Referral required',
  'repeat-required': 'Repeat required',
  'incomplete': 'Incomplete',
  'declined-only-outstanding': 'Some declined'
};

const outcomeBadge = {
  'referral-required': 'risk-critical',
  'repeat-required': 'risk-high',
  'incomplete': 'risk-moderate',
  'declined-only-outstanding': 'risk-moderate',
  'all-not-suspected': 'risk-low'
};

const referralLabels = {
  'urgent': 'Urgent',
  'repeat': 'Repeat',
  'routine': 'Routine'
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.outcome !== '' ||
    filters.referral !== '' ||
    filters.adequate !== '' ||
    filters.carrier !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').ScreeningRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.babyName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.outcome && row.overallOutcome !== filters.outcome) return false;
  if (filters.referral && row.referralStatus !== filters.referral) return false;
  if (filters.adequate === 'yes' && !row.sampleAdequate) return false;
  if (filters.adequate === 'no' && row.sampleAdequate) return false;
  if (filters.carrier === 'yes' && !row.carrierFlag) return false;
  if (filters.carrier === 'no' && row.carrierFlag) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'overallOutcome') {
    return ((outcomeRank[av] ?? 99) - (outcomeRank[bv] ?? 99)) * dir;
  }
  if (key === 'referralStatus') {
    return ((referralRank[av] ?? 99) - (referralRank[bv] ?? 99)) * dir;
  }
  if (key === 'ageAtSampleDays') {
    // Sort nulls last in both directions.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }
  if (key === 'suspectedCount') {
    return (av - bv) * dir;
  }
  if (key === 'sampleAdequate' || key === 'carrierFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return screenings.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕';
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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
    if (row.referralStatus === 'urgent') {
      tr.classList.add('row-critical');
    }

    const ageText = row.ageAtSampleDays === null || row.ageAtSampleDays === undefined
      ? 'N/A'
      : `Day ${row.ageAtSampleDays}`;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.babyName)}</td>
      <td><span class="risk-badge ${outcomeBadge[row.overallOutcome] || 'risk-moderate'}">${esc(outcomeLabels[row.overallOutcome] || row.overallOutcome)}</span></td>
      <td><span class="risk-badge ${row.referralStatus === 'urgent' ? 'risk-critical' : (row.referralStatus === 'repeat' ? 'risk-high' : 'risk-low')}">${esc(referralLabels[row.referralStatus] || row.referralStatus)}</span></td>
      <td><span class="class-cell${row.ageAtSampleDays === null ? ' class-cell-na' : ''}">${esc(ageText)}</span></td>
      <td>
        <span class="flag-badge ${row.sampleAdequate ? 'flag-yes' : 'flag-no'}">
          ${row.sampleAdequate ? 'Yes' : 'No'}
        </span>
      </td>
      <td>${esc(String(row.suspectedCount))}</td>
      <td>
        <span class="flag-badge ${row.carrierFlag ? 'flag-yes' : 'flag-no'}">
          ${row.carrierFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = screenings.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No screenings to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} screenings`;
  } else {
    el.textContent = `Showing ${shown} of ${total} screenings`;
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
  const outcome = document.getElementById('filter-outcome');
  const referral = document.getElementById('filter-referral');
  const adequate = document.getElementById('filter-adequate');
  const carrier = document.getElementById('filter-carrier');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = outcome.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (adequate) {
    adequate.addEventListener('change', () => {
      filters.adequate = adequate.value;
      renderAll();
    });
  }
  if (carrier) {
    carrier.addEventListener('change', () => {
      filters.carrier = carrier.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.outcome = '';
      filters.referral = '';
      filters.adequate = '';
      filters.carrier = '';
      if (search) search.value = '';
      if (outcome) outcome.value = '';
      if (referral) referral.value = '';
      if (adequate) adequate.value = '';
      if (carrier) carrier.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadScreenings() {
  screenings = sampleScreenings;
  renderAll();

  try {
    const items = await fetchScreenings();
    if (items && items.length > 0) {
      screenings = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no screenings.'
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
  loadScreenings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
