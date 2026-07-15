import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Mental Health Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + PHQ-9-severity dropdown + allergy
// dropdown + previous-adverse-incident dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.MentalHealthAssessmentDashboard`. Pulling
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
  phq9: '',     // '', 'minimal', 'mild', 'moderate', 'moderately-severe', 'severe'
  allergy: '',  // '', 'yes', 'no'
  incident: ''  // '', 'yes', 'no'
};

// Default sort: PHQ-9 score descending. Highest depression score = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'phq9Score',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',               label: 'NHS Number' },
  { key: 'patientName',             label: 'Patient Name' },
  { key: 'phq9Score',               label: 'PHQ-9' },
  { key: 'gad7Score',               label: 'GAD-7' },
  { key: 'riskLevel',               label: 'Risk Level' },
  { key: 'allergyFlag',             label: 'Allergy' },
  { key: 'previousAdverseIncident', label: 'Prev. Adverse' }
];

// Rank used when sorting the riskLevel column so 'low' is always less than
// 'high' regardless of locale.
const riskRank = {
  'low': 0,
  'medium': 1,
  'high': 2
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

/**
 * Map a PHQ-9 raw score to its severity band. Mirrors the SvelteKit
 * dashboard's `phq9Severity()` helper exactly.
 */
function phq9Severity(score) {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  if (score <= 19) return 'moderately-severe';
  return 'severe';
}

/** Human-readable label for a PHQ-9 severity band. */
function phq9SeverityLabel(severity) {
  switch (severity) {
    case 'minimal':           return 'Minimal';
    case 'mild':              return 'Mild';
    case 'moderate':          return 'Moderate';
    case 'moderately-severe': return 'Mod. Severe';
    case 'severe':            return 'Severe';
    default:                  return '';
  }
}

function riskClass(level) {
  if (!level) return '';
  return 'risk-' + String(level).toLowerCase();
}

/**
 * Suicidal-ideation / urgent-attention proxy. The dashboard's PatientRow
 * does not expose PHQ-9 question 9 directly, so we surface high overall
 * risk plus very-elevated PHQ-9 scores (>= 20, the "severe" band) — the
 * clinically equivalent flag for triage on the patient list.
 */
function hasSuicidalIdeationFlag(row) {
  return row.riskLevel === 'high' || row.phq9Score >= 20;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.phq9 !== '' ||
    filters.allergy !== '' ||
    filters.incident !== ''
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
  if (filters.phq9 && phq9Severity(row.phq9Score) !== filters.phq9) {
    return false;
  }
  if (filters.allergy === 'yes' && !row.allergyFlag) return false;
  if (filters.allergy === 'no' && row.allergyFlag) return false;
  if (filters.incident === 'yes' && !row.previousAdverseIncident) return false;
  if (filters.incident === 'no' && row.previousAdverseIncident) return false;
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

  if (key === 'allergyFlag' || key === 'previousAdverseIncident') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'phq9Score' || key === 'gad7Score') {
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
    if (hasSuicidalIdeationFlag(row)) {
      tr.classList.add('row-suicidal-ideation');
      tr.setAttribute(
        'aria-label',
        `${row.patientName} — flagged for elevated suicidal-ideation risk`
      );
    }

    const severity = phq9Severity(row.phq9Score);
    const severityLabel = phq9SeverityLabel(severity);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="score-cell severity-${esc(severity)}">${esc(row.phq9Score)}/27</span>
        <span class="score-severity">${esc(severityLabel)}</span>
      </td>
      <td><span class="score-cell">${esc(row.gad7Score)}/21</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td>
        <span class="flag-badge ${row.allergyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.allergyFlag ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="flag-badge ${row.previousAdverseIncident ? 'flag-yes' : 'flag-no'}">
          ${row.previousAdverseIncident ? 'Yes' : 'No'}
        </span>
      </td>
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
    // Numeric / risk columns default to descending (worst first); textual
    // columns default to ascending (alphabetical).
    if (key === 'phq9Score' || key === 'gad7Score' || key === 'riskLevel' ||
        key === 'allergyFlag' || key === 'previousAdverseIncident') {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const phq9 = document.getElementById('filter-phq9');
  const allergy = document.getElementById('filter-allergy');
  const incident = document.getElementById('filter-incident');
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
  if (phq9) {
    phq9.addEventListener('change', () => {
      filters.phq9 = phq9.value;
      renderAll();
    });
  }
  if (allergy) {
    allergy.addEventListener('change', () => {
      filters.allergy = allergy.value;
      renderAll();
    });
  }
  if (incident) {
    incident.addEventListener('change', () => {
      filters.incident = incident.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.phq9 = '';
      filters.allergy = '';
      filters.incident = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (phq9) phq9.value = '';
      if (allergy) allergy.value = '';
      if (incident) incident.value = '';
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
