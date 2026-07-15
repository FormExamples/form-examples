import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Oncology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + ECOG dropdown + cancer-type dropdown + treatment-status
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.OncologyAssessmentDashboard`. Pulling them
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
  ecog: '',          // '' | '0'..'5'
  cancerType: '',
  treatment: ''
};

// Default sort: patientName ascending — matches the SvelteKit dashboard,
// which calls `api.exec('sort-rows', { key: 'patientName', order: 'asc' })`
// on init.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Mirrors the SVAR `columns` array in the SvelteKit
// dashboard so the two surfaces stay aligned.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'ecogStatus',      label: 'ECOG Status' },
  { key: 'cancerType',      label: 'Cancer Type' },
  { key: 'stage',           label: 'Stage' },
  { key: 'treatmentStatus', label: 'Treatment Status' }
];

// Rank table for the categorical `stage` column so ordering is clinical
// (I < II < III < IV) rather than lexicographic.
const stageRank = {
  'Stage I':   1,
  'Stage II':  2,
  'Stage III': 3,
  'Stage IV':  4
};

// Rank table for the categorical `treatmentStatus` column. Ordered roughly
// from best outcome (Complete Response) to worst (Palliative Care) so an
// ascending sort surfaces patients who are doing well first.
const treatmentRank = {
  'Complete Response':   0,
  'Partial Response':    1,
  'Stable Disease':      2,
  'On Treatment':        3,
  'Progressive Disease': 4,
  'Palliative Care':     5
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

function ecogClass(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 'ecog-0';
  return 'ecog-' + Math.max(0, Math.min(5, n));
}

function stageClass(label) {
  if (!label) return 'stage-unknown';
  const slug = String(label)
    .toLowerCase()
    .replace(/^stage\s+/, '')
    .replace(/\s+/g, '-');
  return 'stage-' + (slug || 'unknown');
}

function treatmentClass(label) {
  if (!label) return '';
  return 'treatment-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.ecog !== '' ||
    filters.cancerType !== '' ||
    filters.treatment !== ''
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
      String(row.cancerType || '').toLowerCase().includes(term) ||
      String(row.treatmentStatus || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.ecog !== '' && row.ecogStatus !== Number(filters.ecog)) {
    return false;
  }
  if (filters.cancerType && row.cancerType !== filters.cancerType) {
    return false;
  }
  if (filters.treatment && row.treatmentStatus !== filters.treatment) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'ecogStatus') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'stage') {
    av = stageRank[av] ?? -1;
    bv = stageRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'treatmentStatus') {
    av = treatmentRank[av] ?? -1;
    bv = treatmentRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, cancerType)
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
    // Highlight clinically severe ECOG grades (3, 4, 5) so they are
    // visually distinct in the table — matches the SvelteKit dashboard's
    // emphasis pattern for high-acuity rows.
    if (Number(row.ecogStatus) >= 3) {
      tr.classList.add('row-high-acuity');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="ecog-badge ${ecogClass(row.ecogStatus)}">ECOG ${esc(row.ecogStatus)}</span></td>
      <td><span class="cancer-type">${esc(row.cancerType)}</span></td>
      <td><span class="stage-badge ${stageClass(row.stage)}">${esc(row.stage)}</span></td>
      <td><span class="treatment-badge ${treatmentClass(row.treatmentStatus)}">${esc(row.treatmentStatus)}</span></td>
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
  const ecog = document.getElementById('filter-ecog');
  const cancerType = document.getElementById('filter-cancer-type');
  const treatment = document.getElementById('filter-treatment');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (ecog) {
    ecog.addEventListener('change', () => {
      filters.ecog = ecog.value;
      renderAll();
    });
  }
  if (cancerType) {
    cancerType.addEventListener('change', () => {
      filters.cancerType = cancerType.value;
      renderAll();
    });
  }
  if (treatment) {
    treatment.addEventListener('change', () => {
      filters.treatment = treatment.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.ecog = '';
      filters.cancerType = '';
      filters.treatment = '';
      if (search) search.value = '';
      if (ecog) ecog.value = '';
      if (cancerType) cancerType.value = '';
      if (treatment) treatment.value = '';
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
