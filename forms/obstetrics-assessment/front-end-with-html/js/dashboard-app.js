import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Obstetrics Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + care-pathway dropdown +
// trimester dropdown + mental-health-flag dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',
  pathway: '',
  trimester: '', // '', '1', '2', '3'
  mental: ''     // '', 'yes', 'no'
};

// Default sort: risk level descending so 'High Risk' is at the top of the
// list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'riskLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',             label: 'NHS Number' },
  { key: 'patientName',           label: 'Patient Name' },
  { key: 'gestationalAgeWeeks',   label: 'Gestational Age' },
  { key: 'estimatedDeliveryDate', label: 'EDD' },
  { key: 'riskLevel',             label: 'Risk Level' },
  { key: 'carePathway',           label: 'Care Pathway' },
  { key: 'mentalHealthFlag',      label: 'Mental Health Flag' }
];

// Rank used when sorting the riskLevel column so 'Low Risk' is always less
// than 'High Risk' regardless of locale.
const riskRank = {
  'Low Risk': 0,
  'Moderate Risk': 1,
  'High Risk': 2
};

// Rank used when sorting the carePathway column (low-acuity to high-acuity).
const pathwayRank = {
  'Midwifery-led': 0,
  'Obstetrician-led': 1,
  'Multidisciplinary': 2
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

function pathwayClass(label) {
  if (!label) return '';
  return 'pathway-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/** Trimester from gestational age (weeks): 1 = 0-13, 2 = 14-27, 3 = 28+. */
function trimesterOf(weeks) {
  const w = Number(weeks);
  if (!Number.isFinite(w)) return '';
  if (w <= 13) return '1';
  if (w <= 27) return '2';
  return '3';
}

function trimesterLabel(t) {
  if (t === '1') return '1st trimester';
  if (t === '2') return '2nd trimester';
  if (t === '3') return '3rd trimester';
  return '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.pathway !== '' ||
    filters.trimester !== '' ||
    filters.mental !== ''
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
  if (filters.pathway && row.carePathway !== filters.pathway) {
    return false;
  }
  if (filters.trimester && trimesterOf(row.gestationalAgeWeeks) !== filters.trimester) {
    return false;
  }
  if (filters.mental === 'yes' && !row.mentalHealthFlag) return false;
  if (filters.mental === 'no' && row.mentalHealthFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; booleans sort false<true; numbers compare directly;
 * dates sort lexicographically (ISO 8601); everything else uses a
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

  if (key === 'carePathway') {
    av = pathwayRank[av] ?? -1;
    bv = pathwayRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'mentalHealthFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'gestationalAgeWeeks') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, estimatedDeliveryDate)
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
    if (row.riskLevel === 'High Risk') {
      tr.classList.add('row-high-risk');
    }

    const t = trimesterOf(row.gestationalAgeWeeks);
    const tLabel = trimesterLabel(t);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="gestational-age">${esc(row.gestationalAgeWeeks)} wks</span>
        ${tLabel ? `<span class="trimester-tag">(${esc(tLabel)})</span>` : ''}
      </td>
      <td><span class="edd">${esc(row.estimatedDeliveryDate)}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td><span class="pathway-badge ${pathwayClass(row.carePathway)}">${esc(row.carePathway)}</span></td>
      <td>
        <span class="mental-badge ${row.mentalHealthFlag ? 'mental-yes' : 'mental-no'}">
          ${row.mentalHealthFlag ? 'Yes' : 'No'}
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
  const risk = document.getElementById('filter-risk');
  const pathway = document.getElementById('filter-pathway');
  const trimester = document.getElementById('filter-trimester');
  const mental = document.getElementById('filter-mental');
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
  if (pathway) {
    pathway.addEventListener('change', () => {
      filters.pathway = pathway.value;
      renderAll();
    });
  }
  if (trimester) {
    trimester.addEventListener('change', () => {
      filters.trimester = trimester.value;
      renderAll();
    });
  }
  if (mental) {
    mental.addEventListener('change', () => {
      filters.mental = mental.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.pathway = '';
      filters.trimester = '';
      filters.mental = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (pathway) pathway.value = '';
      if (trimester) trimester.value = '';
      if (mental) mental.value = '';
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
