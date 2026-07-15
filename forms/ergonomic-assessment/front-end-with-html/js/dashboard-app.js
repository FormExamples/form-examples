import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Ergonomic Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + occupation dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.ErgonomicAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',
  occupation: ''
};

// Default sort: REBA score descending. Highest risk = highest score = top
// of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'rebaScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',    label: 'NHS Number' },
  { key: 'patientName',  label: 'Patient Name' },
  { key: 'rebaScore',    label: 'REBA Score' },
  { key: 'riskLevel',    label: 'Risk Level' },
  { key: 'occupation',   label: 'Occupation' },
  { key: 'painSeverity', label: 'Pain' },
  { key: 'keyFinding',   label: 'Key Finding' }
];

// Rank used when sorting the riskLevel column so 'Negligible' is always
// less than 'Very high' regardless of locale.
const riskRank = {
  'Negligible risk': 0,
  'Low risk': 1,
  'Medium risk': 2,
  'High risk': 3,
  'Very high risk': 4
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

function painFillClass(value) {
  const n = Number(value) || 0;
  if (n >= 7) return 'pain-high';
  if (n >= 4) return 'pain-mid';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.occupation !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      String(row.occupation || '').toLowerCase().includes(term) ||
      String(row.keyFinding || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.occupation && row.occupation !== filters.occupation) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank table; numbers compare directly; everything else uses a
 * locale-aware string compare.
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

  if (key === 'rebaScore' || key === 'painSeverity') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, occupation, keyFinding)
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
    if (row.riskLevel === 'Very high risk') {
      tr.classList.add('row-very-high-risk');
    }

    const painPct = Math.max(0, Math.min(10, Number(row.painSeverity) || 0)) * 10;

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="reba-score">REBA ${esc(row.rebaScore)}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td>${esc(row.occupation)}</td>
      <td>
        <span class="pain-cell">
          <span>${esc(row.painSeverity)}/10</span>
          <span class="pain-bar" aria-hidden="true">
            <span class="pain-bar-fill ${painFillClass(row.painSeverity)}" style="width: ${painPct}%;"></span>
          </span>
        </span>
      </td>
      <td class="cell-finding">${esc(row.keyFinding)}</td>
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

/**
 * Populate the occupation <select> from the unique occupations present in
 * the current patient list. Preserves the user's current selection if it
 * still exists; otherwise resets to "All occupations".
 */
function renderOccupationOptions() {
  const select = document.getElementById('filter-occupation');
  if (!select) return;
  const previous = filters.occupation;

  const occupations = Array.from(
    new Set(patients.map((p) => p.occupation).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  // Keep the leading "All occupations" placeholder, replace the rest.
  select.innerHTML = '<option value="">All occupations</option>';
  for (const occ of occupations) {
    const opt = document.createElement('option');
    opt.value = occ;
    opt.textContent = occ;
    select.appendChild(opt);
  }

  if (previous && occupations.includes(previous)) {
    select.value = previous;
  } else {
    select.value = '';
    filters.occupation = '';
  }
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
    // Sensible default direction: numbers descending (worst first), text ascending.
    sortState.direction =
      key === 'rebaScore' || key === 'painSeverity' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const occupation = document.getElementById('filter-occupation');
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
  if (occupation) {
    occupation.addEventListener('change', () => {
      filters.occupation = occupation.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.occupation = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (occupation) occupation.value = '';
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
  renderOccupationOptions();
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

  renderOccupationOptions();
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
