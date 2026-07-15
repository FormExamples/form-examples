import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Attention Deficit Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + classification dropdown + subtype dropdown +
// comorbidity-presence dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.AttentionDeficitAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  classification: '',
  subtype: '',
  comorbidity: '' // '', 'yes', 'no'
};

// Default sort: ASRS score descending. Highest score = highly-likely ADHD =
// top of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'asrsScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',     label: 'NHS Number' },
  { key: 'patientName',   label: 'Patient Name' },
  { key: 'asrsScore',     label: 'ASRS Score' },
  { key: 'classification', label: 'Classification' },
  { key: 'subtype',       label: 'Subtype' },
  { key: 'comorbidities', label: 'Comorbidities' }
];

// Rank used when sorting the classification column so 'unlikely' is always
// less than 'highly-likely' regardless of locale.
const classificationRank = {
  'unlikely': 0,
  'possible': 1,
  'likely': 2,
  'highly-likely': 3
};

// Rank used when sorting the subtype column.
const subtypeRank = {
  'unspecified': 0,
  'inattentive': 1,
  'hyperactive-impulsive': 2,
  'combined': 3
};

// Display labels for kebab-case enum values.
const classificationLabel = {
  'unlikely': 'Unlikely',
  'possible': 'Possible',
  'likely': 'Likely',
  'highly-likely': 'Highly Likely'
};

const subtypeLabel = {
  'inattentive': 'Inattentive',
  'hyperactive-impulsive': 'Hyperactive-Impulsive',
  'combined': 'Combined',
  'unspecified': 'Unspecified'
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

function classificationClass(value) {
  if (!value) return '';
  return 'classification-' + String(value).toLowerCase();
}

function subtypeClass(value) {
  if (!value) return '';
  return 'subtype-' + String(value).toLowerCase();
}

function hasComorbidities(row) {
  const c = row.comorbidities;
  return !!c && c.trim() !== '' && c.trim().toLowerCase() !== 'none';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.classification !== '' ||
    filters.subtype !== '' ||
    filters.comorbidity !== ''
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
      String(row.comorbidities || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.classification && row.classification !== filters.classification) {
    return false;
  }
  if (filters.subtype && row.subtype !== filters.subtype) {
    return false;
  }
  if (filters.comorbidity === 'yes' && !hasComorbidities(row)) return false;
  if (filters.comorbidity === 'no' && hasComorbidities(row)) return false;
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

  if (key === 'classification') {
    av = classificationRank[av] ?? -1;
    bv = classificationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'subtype') {
    av = subtypeRank[av] ?? -1;
    bv = subtypeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'asrsScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, comorbidities)
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    if (row.classification === 'highly-likely') {
      tr.classList.add('row-highly-likely');
    }

    const classificationText = classificationLabel[row.classification] || row.classification;
    const subtypeText = subtypeLabel[row.subtype] || row.subtype;
    const comorbiditiesValue = row.comorbidities && row.comorbidities.trim() !== ''
      ? row.comorbidities
      : 'None';
    const comorbiditiesIsNone = !hasComorbidities(row);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="asrs-score">${esc(row.asrsScore)}/72</span></td>
      <td><span class="classification-badge ${classificationClass(row.classification)}">${esc(classificationText)}</span></td>
      <td><span class="subtype-badge ${subtypeClass(row.subtype)}">${esc(subtypeText)}</span></td>
      <td class="comorbidities-cell ${comorbiditiesIsNone ? 'comorbidities-none' : ''}">${esc(comorbiditiesValue)}</td>
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
  const classification = document.getElementById('filter-classification');
  const subtype = document.getElementById('filter-subtype');
  const comorbidity = document.getElementById('filter-comorbidity');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (classification) {
    classification.addEventListener('change', () => {
      filters.classification = classification.value;
      renderAll();
    });
  }
  if (subtype) {
    subtype.addEventListener('change', () => {
      filters.subtype = subtype.value;
      renderAll();
    });
  }
  if (comorbidity) {
    comorbidity.addEventListener('change', () => {
      filters.comorbidity = comorbidity.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.classification = '';
      filters.subtype = '';
      filters.comorbidity = '';
      if (search) search.value = '';
      if (classification) classification.value = '';
      if (subtype) subtype.value = '';
      if (comorbidity) comorbidity.value = '';
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
