import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// MCAS Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + symptom-score-range dropdown + systems-affected dropdown +
// anaphylaxis-risk dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.MastCellActivationSyndromeAssessmentDashboard`. Pulling them off
// here keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to the
// global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  score: '',       // '', '0-10', '11-20', '21-30', '31-40'
  systems: '',     // '', '0', '1', '2', '3', '4', '5'
  anaphylaxis: ''  // '', 'yes', 'no'
};

// Default sort: symptom score descending. Worst symptoms first, surfacing
// the patients who most need clinical attention.
const sortState = {
  key: 'symptomScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',            label: 'NHS Number' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'symptomScore',         label: 'Symptom Score' },
  { key: 'organSystemsAffected', label: 'Systems Affected' },
  { key: 'tryptaseLevel',        label: 'Tryptase (ng/mL)' },
  { key: 'anaphylaxisRisk',      label: 'Anaphylaxis Risk' }
];

// Upper limit of the normal serum-tryptase reference range, in ng/mL.
// Values above this threshold are highlighted in the table.
const TRYPTASE_NORMAL_MAX = 11.4;

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
 * Map a numeric symptom score to the band CSS class used on the badge.
 * Bands match the dropdown filter choices: 0-10, 11-20, 21-30, 31-40.
 */
function scoreBandClass(score) {
  const s = Number(score);
  if (!Number.isFinite(s)) return '';
  if (s <= 10) return 'score-minimal';
  if (s <= 20) return 'score-mild';
  if (s <= 30) return 'score-moderate';
  return 'score-severe';
}

function scoreInRange(score, range) {
  const s = Number(score);
  switch (range) {
    case '0-10':  return s >= 0  && s <= 10;
    case '11-20': return s >= 11 && s <= 20;
    case '21-30': return s >= 21 && s <= 30;
    case '31-40': return s >= 31 && s <= 40;
    default:      return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.score !== '' ||
    filters.systems !== '' ||
    filters.anaphylaxis !== ''
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
  if (filters.score && !scoreInRange(row.symptomScore, filters.score)) {
    return false;
  }
  if (filters.systems !== '' &&
      row.organSystemsAffected !== Number(filters.systems)) {
    return false;
  }
  if (filters.anaphylaxis === 'yes' && !row.anaphylaxisRisk) return false;
  if (filters.anaphylaxis === 'no'  &&  row.anaphylaxisRisk) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Booleans sort false<true,
 * tryptase sorts numerically (the underlying value is a string for display
 * fidelity), numeric columns compare directly, and everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'anaphylaxisRisk') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'symptomScore' || key === 'organSystemsAffected') {
    return (((av ?? 0) - (bv ?? 0))) * dir;
  }

  if (key === 'tryptaseLevel') {
    const an = parseFloat(av);
    const bn = parseFloat(bv);
    const aok = Number.isFinite(an);
    const bok = Number.isFinite(bn);
    if (aok && bok) return (an - bn) * dir;
    // Fall back to string compare if either value is not numeric.
    return String(av).localeCompare(String(bv)) * dir;
  }

  // Default: string compare (nhsNumber, patientName).
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
    if (Number(row.symptomScore) >= 31) {
      tr.classList.add('row-severe');
    }

    const tryptaseNum = parseFloat(row.tryptaseLevel);
    const tryptaseElevated =
      Number.isFinite(tryptaseNum) && tryptaseNum > TRYPTASE_NORMAL_MAX;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="score-badge ${scoreBandClass(row.symptomScore)}">
          ${esc(row.symptomScore)}/40
        </span>
      </td>
      <td><span class="systems-cell">${esc(row.organSystemsAffected)}/5</span></td>
      <td>
        <span class="tryptase-cell ${tryptaseElevated ? 'tryptase-elevated' : ''}">
          ${esc(row.tryptaseLevel)}
        </span>
      </td>
      <td>
        <span class="anaphylaxis-badge ${row.anaphylaxisRisk ? 'anaphylaxis-yes' : 'anaphylaxis-no'}">
          ${row.anaphylaxisRisk ? 'Yes' : 'No'}
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const score = document.getElementById('filter-score');
  const systems = document.getElementById('filter-systems');
  const anaphylaxis = document.getElementById('filter-anaphylaxis');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (score) {
    score.addEventListener('change', () => {
      filters.score = score.value;
      renderAll();
    });
  }
  if (systems) {
    systems.addEventListener('change', () => {
      filters.systems = systems.value;
      renderAll();
    });
  }
  if (anaphylaxis) {
    anaphylaxis.addEventListener('change', () => {
      filters.anaphylaxis = anaphylaxis.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.score = '';
      filters.systems = '';
      filters.anaphylaxis = '';
      if (search) search.value = '';
      if (score) score.value = '';
      if (systems) systems.value = '';
      if (anaphylaxis) anaphylaxis.value = '';
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
