import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Genetic Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the proband list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + presenting-concern dropdown +
// recommendation dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.GeneticAssessmentDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',
  concern: '',
  recommendation: ''
};

// Default sort: risk level descending. High-risk probands surface at the
// top of the list, with the critical-row emphasis style highlighting them
// for the clinician.
const sortState = {
  key: 'riskLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'riskLevel',           label: 'Risk Level' },
  { key: 'riskScore',           label: 'Risk Score' },
  { key: 'presentingConcern',   label: 'Presenting Concern' },
  { key: 'familyAffectedCount', label: 'Family Affected' },
  { key: 'manchesterScore',     label: 'Manchester' },
  { key: 'recommendation',      label: 'Recommendation' }
];

// Rank used when sorting the riskLevel column so 'Low' is always less than
// 'High' regardless of locale.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2
};

// Rank used when sorting the recommendation column. Ordered roughly from
// least- to most-intensive intervention.
const recommendationRank = {
  'Routine follow-up': 0,
  'Genetic counselling': 1,
  'Panel testing': 2,
  'Predictive testing': 3,
  'Urgent counselling': 4
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

function recommendationClass(label) {
  if (!label) return '';
  return 'rec-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.concern !== '' ||
    filters.recommendation !== ''
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
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.concern && row.presentingConcern !== filters.concern) {
    return false;
  }
  if (filters.recommendation && row.recommendation !== filters.recommendation) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly (with `null` Manchester
 * scores sorting last); everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'recommendation') {
    av = recommendationRank[av] ?? -1;
    bv = recommendationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'riskScore' || key === 'familyAffectedCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'manchesterScore') {
    // null Manchester scores (non-BRCA referrals) always sort last,
    // regardless of direction, so they don't crowd the high-priority view.
    if (av === null && bv === null) return 0;
    if (av === null) return 1;
    if (bv === null) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, presentingConcern)
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

/** Render the Manchester Score cell. `null` means non-BRCA referral. */
function renderManchesterCell(row) {
  if (row.manchesterScore === null || row.manchesterScore === undefined) {
    return '<span class="manchester-na" aria-label="Not applicable">N/A</span>';
  }
  // Clinical convention: a Manchester Score >= 15 indicates BRCA testing
  // is justified; emphasise scores at or above that threshold.
  const cls = row.manchesterScore >= 20 ? 'manchester-score is-high' : 'manchester-score';
  return `<span class="${cls}">${esc(row.manchesterScore)}</span>`;
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
    if (row.riskLevel === 'High') {
      tr.classList.add('row-high-risk');
    }

    const familyCountCls =
      'family-count' + (row.familyAffectedCount >= 2 ? ' is-elevated' : '');

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td><span class="risk-score">${esc(row.riskScore)}</span></td>
      <td><span class="concern-pill">${esc(row.presentingConcern)}</span></td>
      <td><span class="${familyCountCls}">${esc(row.familyAffectedCount)}</span></td>
      <td>${renderManchesterCell(row)}</td>
      <td><span class="rec-pill ${recommendationClass(row.recommendation)}">${esc(row.recommendation)}</span></td>
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
    // Categorical risk-level and recommendation columns default to
    // descending (most-severe first); everything else defaults to ascending.
    sortState.direction =
      (key === 'riskLevel' || key === 'recommendation' || key === 'riskScore')
        ? 'desc'
        : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const concern = document.getElementById('filter-concern');
  const recommendation = document.getElementById('filter-recommendation');
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
  if (concern) {
    concern.addEventListener('change', () => {
      filters.concern = concern.value;
      renderAll();
    });
  }
  if (recommendation) {
    recommendation.addEventListener('change', () => {
      filters.recommendation = recommendation.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.concern = '';
      filters.recommendation = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (concern) concern.value = '';
      if (recommendation) recommendation.value = '';
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
