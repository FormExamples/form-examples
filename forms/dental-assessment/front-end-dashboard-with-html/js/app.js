// Dental Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + DMFT-category dropdown + periodontal-status dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.DentalAssessmentDashboard`. Pulling them
// off here keeps the rest of this file referring to short local names. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak
// to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.DentalAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  dmft: '',         // '', 'caries-free', 'very-low', 'low', 'moderate', 'high', 'very-high'
  periodontal: ''   // '', 'healthy', 'gingivitis', 'periodontitis'
};

// Default sort: patient name ascending (matches the SvelteKit dashboard
// which calls `api.exec('sort-rows', { key: 'patientName', order: 'asc' })`
// in its grid `init` hook).
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'dmftScore',         label: 'DMFT Score' },
  { key: 'chiefComplaint',    label: 'Chief Complaint' },
  { key: 'periodontalStatus', label: 'Periodontal Status' }
];

// ----------------------------------------------------------------------
// DMFT category helpers (mirror the SvelteKit dashboard exactly)
// ----------------------------------------------------------------------

/** @param {number} score */
function dmftCategory(score) {
  if (score === 0) return 'caries-free';
  if (score <= 5) return 'very-low';
  if (score <= 10) return 'low';
  if (score <= 15) return 'moderate';
  if (score <= 20) return 'high';
  return 'very-high';
}

/** @param {number} score */
function dmftLabel(score) {
  if (score === 0) return 'Caries-Free';
  if (score <= 5) return 'Very Low';
  if (score <= 10) return 'Low';
  if (score <= 15) return 'Moderate';
  if (score <= 20) return 'High';
  return 'Very High';
}

// Map a periodontalStatus string to the dropdown filter category. The
// SvelteKit dashboard uses substring matching ("healthy", "gingivitis",
// "periodontitis") so we replicate that here.
function periodontalCategory(status) {
  const s = String(status || '').toLowerCase();
  if (s.indexOf('periodontitis') !== -1) return 'periodontitis';
  if (s.indexOf('gingivitis') !== -1) return 'gingivitis';
  if (s.indexOf('healthy') !== -1) return 'healthy';
  return 'other';
}

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

function dmftClass(score) {
  return 'dmft-' + dmftCategory(score);
}

function perioClass(status) {
  return 'perio-' + periodontalCategory(status);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.dmft !== '' ||
    filters.periodontal !== ''
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
      String(row.chiefComplaint || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.dmft && dmftCategory(row.dmftScore) !== filters.dmft) {
    return false;
  }
  if (filters.periodontal) {
    const status = String(row.periodontalStatus || '').toLowerCase();
    if (filters.periodontal === 'healthy' && status.indexOf('healthy') === -1) return false;
    if (filters.periodontal === 'gingivitis' && status.indexOf('gingivitis') === -1) return false;
    if (filters.periodontal === 'periodontitis' && status.indexOf('periodontitis') === -1) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Numeric columns compare
 * directly; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'dmftScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, chiefComplaint,
  // periodontalStatus).
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
    if (dmftCategory(row.dmftScore) === 'very-high') {
      tr.classList.add('row-very-high');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="dmft-score">${esc(row.dmftScore)}</span>
        <span class="dmft-badge ${dmftClass(row.dmftScore)}">${esc(dmftLabel(row.dmftScore))}</span>
      </td>
      <td class="complaint-cell">${esc(row.chiefComplaint)}</td>
      <td><span class="perio-badge ${perioClass(row.periodontalStatus)}">${esc(row.periodontalStatus)}</span></td>
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
  const dmft = document.getElementById('filter-dmft');
  const periodontal = document.getElementById('filter-periodontal');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (dmft) {
    dmft.addEventListener('change', () => {
      filters.dmft = dmft.value;
      renderAll();
    });
  }
  if (periodontal) {
    periodontal.addEventListener('change', () => {
      filters.periodontal = periodontal.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.dmft = '';
      filters.periodontal = '';
      if (search) search.value = '';
      if (dmft) dmft.value = '';
      if (periodontal) periodontal.value = '';
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
})();
