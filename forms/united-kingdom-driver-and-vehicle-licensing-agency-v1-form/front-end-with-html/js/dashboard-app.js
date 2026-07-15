import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// UK DVLA V1 Form - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the applicant list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + 3 yes/no dropdowns + completeness dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  monocular: '',     // '', 'yes', 'no'
  glaucoma: '',      // '', 'yes', 'no'
  diplopia: '',      // '', 'yes', 'no'
  completeness: ''   // '', 'complete', 'partial'
};

/** Sort state: which column key, ascending or descending. */
const sortState = {
  key: 'applicantName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'drivingLicenceNumber',   label: 'Licence Number' },
  { key: 'applicantName',          label: 'Applicant Name' },
  { key: 'dateOfBirth',            label: 'Date of Birth' },
  { key: 'monocularVision',        label: 'Monocular' },
  { key: 'glaucomaDeclared',       label: 'Glaucoma' },
  { key: 'diplopiaDeclared',       label: 'Diplopia' },
  { key: 'highPriorityFlagCount',  label: 'High-priority Flags' },
  { key: 'validationCompleteness', label: 'Completeness (%)' },
  { key: 'submittedAt',            label: 'Submitted' }
];

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

function formatSubmitted(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function formatDateOfBirth(value) {
  if (!value) return '';
  // Treat as plain date (no timezone shift)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (m) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    return Number.isNaN(d.getTime())
      ? value
      : d.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          timeZone: 'UTC'
        });
  }
  return value;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.monocular !== '' ||
    filters.glaucoma !== '' ||
    filters.diplopia !== '' ||
    filters.completeness !== ''
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
    if (!row.applicantName.toLowerCase().includes(term)) return false;
  }
  if (filters.monocular === 'yes' && !row.monocularVision) return false;
  if (filters.monocular === 'no' && row.monocularVision) return false;

  if (filters.glaucoma === 'yes' && !row.glaucomaDeclared) return false;
  if (filters.glaucoma === 'no' && row.glaucomaDeclared) return false;

  if (filters.diplopia === 'yes' && !row.diplopiaDeclared) return false;
  if (filters.diplopia === 'no' && row.diplopiaDeclared) return false;

  if (filters.completeness === 'complete' && row.validationCompleteness < 100) {
    return false;
  }
  if (filters.completeness === 'partial' && row.validationCompleteness >= 100) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Booleans sort false<true;
 * numbers compare numerically; date columns parse to timestamps; everything
 * else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (
    key === 'monocularVision' ||
    key === 'glaucomaDeclared' ||
    key === 'diplopiaDeclared'
  ) {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (
    key === 'highPriorityFlagCount' ||
    key === 'validationCompleteness'
  ) {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  if (key === 'submittedAt' || key === 'dateOfBirth') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  // Default: string compare
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

function yesNoBadge(flag) {
  const cls = flag ? 'yesno-yes' : 'yesno-no';
  const label = flag ? 'Yes' : 'No';
  return `<span class="yesno-badge ${cls}">${label}</span>`;
}

function flagsBadge(count) {
  const n = Number(count) || 0;
  let cls = 'flags-zero';
  if (n >= 3) cls = 'flags-high';
  else if (n >= 1) cls = 'flags-mid';
  return `<span class="flags-badge ${cls}">${n}</span>`;
}

function completenessBar(pct) {
  const n = Math.max(0, Math.min(100, Number(pct) || 0));
  const cls = n >= 100 ? 'completeness-full' : 'completeness-partial';
  return (
    `<div class="completeness ${cls}" role="img" aria-label="${n} percent complete">` +
      `<div class="completeness-bar"><div class="completeness-fill" style="width:${n}%"></div></div>` +
      `<span class="completeness-text">${n}%</span>` +
    `</div>`
  );
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
    if (row.highPriorityFlagCount >= 3) tr.classList.add('row-high-priority');

    tr.innerHTML = `
      <td class="cell-licence">${esc(row.drivingLicenceNumber)}</td>
      <td>${esc(row.applicantName)}</td>
      <td>${esc(formatDateOfBirth(row.dateOfBirth))}</td>
      <td>${yesNoBadge(row.monocularVision)}</td>
      <td>${yesNoBadge(row.glaucomaDeclared)}</td>
      <td>${yesNoBadge(row.diplopiaDeclared)}</td>
      <td>${flagsBadge(row.highPriorityFlagCount)}</td>
      <td class="cell-completeness">${completenessBar(row.validationCompleteness)}</td>
      <td>${esc(formatSubmitted(row.submittedAt))}</td>
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
    el.textContent = 'No applicants to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} applicants`;
  } else {
    el.textContent = `Showing ${shown} of ${total} applicants`;
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
  const monocular = document.getElementById('filter-monocular');
  const glaucoma = document.getElementById('filter-glaucoma');
  const diplopia = document.getElementById('filter-diplopia');
  const completeness = document.getElementById('filter-completeness');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (monocular) {
    monocular.addEventListener('change', () => {
      filters.monocular = monocular.value;
      renderAll();
    });
  }
  if (glaucoma) {
    glaucoma.addEventListener('change', () => {
      filters.glaucoma = glaucoma.value;
      renderAll();
    });
  }
  if (diplopia) {
    diplopia.addEventListener('change', () => {
      filters.diplopia = diplopia.value;
      renderAll();
    });
  }
  if (completeness) {
    completeness.addEventListener('change', () => {
      filters.completeness = completeness.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.monocular = '';
      filters.glaucoma = '';
      filters.diplopia = '';
      filters.completeness = '';
      if (search) search.value = '';
      if (monocular) monocular.value = '';
      if (glaucoma) glaucoma.value = '';
      if (diplopia) diplopia.value = '';
      if (completeness) completeness.value = '';
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
        'Showing sample data — backend returned no applicants.'
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
