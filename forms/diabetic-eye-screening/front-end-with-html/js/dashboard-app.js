import { fetchScreenings } from './api.js';
import { sampleScreenings } from './data.js';

// Diabetic Eye Screening — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the screening list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + retinopathy dropdown + maculopathy dropdown + outcome dropdown +
// urgent dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.DiabeticEyeScreeningDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
let screenings = [];

const filters = {
  search: '',
  retinopathy: '', // '' | R grade value
  maculopathy: '', // '' | M grade value
  outcome: '',     // '' | outcome value
  urgent: ''       // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'worstRetinopathy',  label: 'Worst R' },
  { key: 'worstMaculopathy',  label: 'Worst M' },
  { key: 'outcome',           label: 'Outcome' },
  { key: 'referral',          label: 'Referral' },
  { key: 'urgentFlag',        label: 'Urgent' }
];

// Rank used when sorting the retinopathy column, ordered low-to-high clinical
// severity so the most urgent results cluster together regardless of locale.
const retinopathyRank = {
  'R0': 0,
  'R1': 1,
  'R2': 2,
  'R3S': 3,
  'R3A': 4
};

// Rank used when sorting the outcome column, ordered routine (low) to urgent
// (high) so the most urgent outcomes cluster together.
const outcomeRank = {
  'routine-24-month': 0,
  'routine-12-month': 1,
  'surveillance-6-month': 2,
  'refer-slit-lamp': 3,
  'refer-hes': 4,
  'refer-hes-urgent': 5
};

const outcomeLabels = {
  'refer-hes-urgent': 'Urgent HES referral',
  'refer-hes': 'HES referral',
  'refer-slit-lamp': 'Slit-lamp / re-screen',
  'surveillance-6-month': '6-month surveillance',
  'routine-12-month': 'Routine 12-month',
  'routine-24-month': 'Routine 24-month'
};

const referralLabels = {
  'none': 'None',
  'hes-routine': 'HES (routine)',
  'hes-urgent': 'Ophthalmology (urgent)',
  'slit-lamp': 'Slit-lamp'
};

// Outcome → shared risk palette class for the badge.
const outcomeClassMap = {
  'routine-24-month': 'risk-low',
  'routine-12-month': 'risk-low',
  'surveillance-6-month': 'risk-moderate',
  'refer-slit-lamp': 'risk-moderate',
  'refer-hes': 'risk-high',
  'refer-hes-urgent': 'risk-critical'
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

function outcomeLabel(outcome) {
  return outcomeLabels[outcome] || outcome || 'N/A';
}

function outcomeClass(outcome) {
  return outcomeClassMap[outcome] || '';
}

function referralLabel(referral) {
  return referralLabels[referral] || referral || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.retinopathy !== '' ||
    filters.maculopathy !== '' ||
    filters.outcome !== '' ||
    filters.urgent !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ScreeningRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.retinopathy && row.worstRetinopathy !== filters.retinopathy) return false;
  if (filters.maculopathy && row.worstMaculopathy !== filters.maculopathy) return false;
  if (filters.outcome && row.outcome !== filters.outcome) return false;
  if (filters.urgent === 'yes' && !row.urgentFlag) return false;
  if (filters.urgent === 'no' && row.urgentFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The retinopathy and outcome
 * columns use their rank tables; the urgent boolean sorts false<true;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'worstRetinopathy') {
    av = retinopathyRank[av] ?? -1;
    bv = retinopathyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'outcome') {
    av = outcomeRank[av] ?? -1;
    bv = outcomeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'urgentFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, worstMaculopathy,
  // referral).
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
    let indicator = '↕'; // up-down arrow
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
    if (row.urgentFlag || row.outcome === 'refer-hes-urgent') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.worstRetinopathy)}</td>
      <td>${esc(row.worstMaculopathy)}</td>
      <td><span class="risk-badge ${outcomeClass(row.outcome)}">${esc(outcomeLabel(row.outcome))}</span></td>
      <td>${esc(referralLabel(row.referral))}</td>
      <td>
        <span class="flag-badge ${row.urgentFlag ? 'flag-yes' : 'flag-no'}">
          ${row.urgentFlag ? 'Yes' : 'No'}
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
  const retinopathy = document.getElementById('filter-retinopathy');
  const maculopathy = document.getElementById('filter-maculopathy');
  const outcome = document.getElementById('filter-outcome');
  const urgent = document.getElementById('filter-urgent');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (retinopathy) {
    retinopathy.addEventListener('change', () => {
      filters.retinopathy = retinopathy.value;
      renderAll();
    });
  }
  if (maculopathy) {
    maculopathy.addEventListener('change', () => {
      filters.maculopathy = maculopathy.value;
      renderAll();
    });
  }
  if (outcome) {
    outcome.addEventListener('change', () => {
      filters.outcome = outcome.value;
      renderAll();
    });
  }
  if (urgent) {
    urgent.addEventListener('change', () => {
      filters.urgent = urgent.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.retinopathy = '';
      filters.maculopathy = '';
      filters.outcome = '';
      filters.urgent = '';
      if (search) search.value = '';
      if (retinopathy) retinopathy.value = '';
      if (maculopathy) maculopathy.value = '';
      if (outcome) outcome.value = '';
      if (urgent) urgent.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadScreenings() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
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
