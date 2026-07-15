import { fetchExaminations } from './api.js';
import { sampleExaminations } from './data.js';

// NIPE — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the examination list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + context dropdown + outcome dropdown + referral
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.NewbornAndInfantPhysicalExaminationDashboard`. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ExaminationRow[]} */
let examinations = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting slug
  context: '',   // '' | 'newborn-72h' | 'infant-6-8-week'
  outcome: '',   // '' | 'satisfactory' | 'refer' | 'incomplete'
  referral: ''   // '' | 'yes' | 'no'
};

// Default sort: baby name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'babyName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'babyIdentifier',     label: 'NHS / ID' },
  { key: 'babyName',           label: 'Baby Name' },
  { key: 'careSetting',        label: 'Setting' },
  { key: 'examinationContext', label: 'Context' },
  { key: 'overallOutcome',     label: 'Outcome' },
  { key: 'referralFlag',       label: 'Referral' }
];

// Rank used when sorting the outcome column so satisfactory < incomplete < refer
// regardless of locale.
const outcomeRank = {
  'satisfactory': 0,
  'incomplete': 1,
  'refer': 2
};

const settingLabels = {
  'maternity-ward': 'Maternity ward',
  'neonatal-unit': 'Neonatal unit',
  'community': 'Community',
  'gp-surgery': 'GP surgery',
  'home': 'Home',
  'other': 'Other'
};

const contextLabels = {
  'newborn-72h': 'Newborn (72h)',
  'infant-6-8-week': 'Infant (6-8wk)'
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

function outcomeClass(outcome) {
  switch (outcome) {
    case 'refer': return 'risk-high';
    case 'incomplete': return 'risk-moderate';
    case 'satisfactory': return 'risk-low';
    default: return '';
  }
}

function outcomeLabel(outcome) {
  switch (outcome) {
    case 'refer': return 'Refer';
    case 'incomplete': return 'Incomplete';
    case 'satisfactory': return 'Satisfactory';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function contextLabel(context) {
  return contextLabels[context] || context || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.context !== '' ||
    filters.outcome !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ExaminationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.babyIdentifier.toLowerCase().includes(term) ||
      row.babyName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.context && row.examinationContext !== filters.context) return false;
  if (filters.outcome && row.overallOutcome !== filters.outcome) return false;
  if (filters.referral === 'yes' && !row.referralFlag) return false;
  if (filters.referral === 'no' && row.referralFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The outcome column uses its rank
 * table; the referral boolean sorts false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'overallOutcome') {
    av = outcomeRank[av] ?? -1;
    bv = outcomeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'referralFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return examinations.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.overallOutcome === 'refer') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.babyIdentifier)}</td>
      <td>${esc(row.babyName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(contextLabel(row.examinationContext))}</td>
      <td><span class="risk-badge ${outcomeClass(row.overallOutcome)}">${esc(outcomeLabel(row.overallOutcome))}</span></td>
      <td>
        <span class="flag-badge ${row.referralFlag ? 'flag-yes' : 'flag-no'}">
          ${row.referralFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = examinations.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No examinations to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} examinations`;
  } else {
    el.textContent = `Showing ${shown} of ${total} examinations`;
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
  const setting = document.getElementById('filter-setting');
  const context = document.getElementById('filter-context');
  const outcome = document.getElementById('filter-outcome');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (context) {
    context.addEventListener('change', () => {
      filters.context = context.value;
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
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.context = '';
      filters.outcome = '';
      filters.referral = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (context) context.value = '';
      if (outcome) outcome.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadExaminations() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  examinations = sampleExaminations;
  renderAll();

  try {
    const items = await fetchExaminations();
    if (items && items.length > 0) {
      examinations = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no examinations.'
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
  loadExaminations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
