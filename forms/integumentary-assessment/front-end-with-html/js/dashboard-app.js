import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Integumentary Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + wound-present dropdown + wound-stage
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.IntegumentaryAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',
  wound: '', // '', 'yes', 'no'
  stage: ''
};

// Default sort: Braden score ascending. Lowest score = highest risk = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'bradenScore',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'bradenScore',       label: 'Braden Score' },
  { key: 'riskLevel',         label: 'Risk Level' },
  { key: 'woundPresent',      label: 'Wound Present' },
  { key: 'highestWoundStage', label: 'Highest Wound Stage' }
];

// Rank used when sorting the riskLevel column so 'No Risk' is always less
// than 'Very High Risk' regardless of locale.
const riskRank = {
  'No Risk': 0,
  'Mild Risk': 1,
  'Moderate Risk': 2,
  'High Risk': 3,
  'Very High Risk': 4
};

// Rank used when sorting the highestWoundStage column. 'Unstageable' sorts
// after numbered stages because it represents an obscured wound bed that
// could be Stage 3 or 4.
const stageRank = {
  'None': 0,
  'Stage 1': 1,
  'Stage 2': 2,
  'Stage 3': 3,
  'Stage 4': 4,
  'Unstageable': 5
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
  return 'risk-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function stageClass(label) {
  if (!label) return '';
  return 'stage-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.wound !== '' ||
    filters.stage !== ''
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
  if (filters.wound === 'yes' && !row.woundPresent) return false;
  if (filters.wound === 'no' && row.woundPresent) return false;
  if (filters.stage && row.highestWoundStage !== filters.stage) {
    return false;
  }
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

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'highestWoundStage') {
    av = stageRank[av] ?? -1;
    bv = stageRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'woundPresent') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'bradenScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName)
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
    if (row.riskLevel === 'Very High Risk') {
      tr.classList.add('row-very-high-risk');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="braden-score">${esc(row.bradenScore)}/23</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td>
        <span class="wound-badge ${row.woundPresent ? 'wound-yes' : 'wound-no'}">
          ${row.woundPresent ? 'Yes' : 'No'}
        </span>
      </td>
      <td><span class="stage-badge ${stageClass(row.highestWoundStage)}">${esc(row.highestWoundStage)}</span></td>
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
  const risk = document.getElementById('filter-risk');
  const wound = document.getElementById('filter-wound');
  const stage = document.getElementById('filter-stage');
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
  if (wound) {
    wound.addEventListener('change', () => {
      filters.wound = wound.value;
      renderAll();
    });
  }
  if (stage) {
    stage.addEventListener('change', () => {
      filters.stage = stage.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.wound = '';
      filters.stage = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (wound) wound.value = '';
      if (stage) stage.value = '';
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
