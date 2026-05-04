// Plastic Surgery Assessment - clinician dashboard (vanilla classic-script
// app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + ASA-class dropdown + wound-class dropdown + risk-level
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PlasticSurgeryAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.PlasticSurgeryAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  asa: '',
  wound: '',
  risk: ''
};

// Default sort: risk level descending. Critical = top of the list,
// surfacing the patients who most need clinical attention.
const sortState = {
  key: 'riskLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',   label: 'NHS Number' },
  { key: 'patientName', label: 'Patient Name' },
  { key: 'asaClass',    label: 'ASA Class' },
  { key: 'woundClass',  label: 'Wound Class' },
  { key: 'complexity',  label: 'Complexity' },
  { key: 'riskLevel',   label: 'Risk Level' }
];

// Rank used when sorting the asaClass column so 'I' < 'II' < ... < 'V'
// regardless of locale (Roman-numeral string compare is unreliable).
const asaRank = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5
};

// Rank used when sorting the woundClass column.
const woundRank = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4
};

// Rank used when sorting the riskLevel column.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2,
  'Critical': 3
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

function asaClassName(label) {
  if (!label) return '';
  return 'asa-' + String(label).toLowerCase();
}

function woundClassName(label) {
  if (!label) return '';
  return 'wound-' + String(label).toLowerCase();
}

function riskClassName(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.asa !== '' ||
    filters.wound !== '' ||
    filters.risk !== ''
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
  if (filters.asa && row.asaClass !== filters.asa) {
    return false;
  }
  if (filters.wound && row.woundClass !== filters.wound) {
    return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
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

  if (key === 'asaClass') {
    av = asaRank[av] ?? -1;
    bv = asaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'woundClass') {
    av = woundRank[av] ?? -1;
    bv = woundRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'complexity') {
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
    if (row.riskLevel === 'Critical') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="asa-badge ${asaClassName(row.asaClass)}">ASA ${esc(row.asaClass)}</span></td>
      <td><span class="wound-badge ${woundClassName(row.woundClass)}">Class ${esc(row.woundClass)}</span></td>
      <td><span class="complexity-cell">${esc(row.complexity)}/4</span></td>
      <td><span class="risk-badge ${riskClassName(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
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
  const asa = document.getElementById('filter-asa');
  const wound = document.getElementById('filter-wound');
  const risk = document.getElementById('filter-risk');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (asa) {
    asa.addEventListener('change', () => {
      filters.asa = asa.value;
      renderAll();
    });
  }
  if (wound) {
    wound.addEventListener('change', () => {
      filters.wound = wound.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.asa = '';
      filters.wound = '';
      filters.risk = '';
      if (search) search.value = '';
      if (asa) asa.value = '';
      if (wound) wound.value = '';
      if (risk) risk.value = '';
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
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
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
