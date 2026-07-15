import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Urology Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + IPSS-score-band dropdown + symptom-severity dropdown +
// referral-urgency dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.UrologyAssessmentDashboard`. Pulling them
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
  ipss: '',     // '', '0-7', '8-19', '20-35'
  severity: '', // '', 'Mild', 'Moderate', 'Severe'
  urgency: ''   // '', 'Routine', 'Soon', 'Urgent'
};

// Default sort: IPSS score descending. Highest score = most severe symptoms
// = top of the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'ipssScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',       label: 'NHS Number' },
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'ipssScore',       label: 'IPSS Score' },
  { key: 'symptomSeverity', label: 'Severity' },
  { key: 'psaLevel',        label: 'PSA (ng/mL)' },
  { key: 'referralUrgency', label: 'Urgency' }
];

// Rank used when sorting the symptomSeverity column so 'Mild' is always
// less than 'Severe' regardless of locale.
const severityRank = {
  'Mild': 0,
  'Moderate': 1,
  'Severe': 2
};

// Rank used when sorting the referralUrgency column.
const urgencyRank = {
  'Routine': 0,
  'Soon': 1,
  'Urgent': 2
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

function severityClass(label) {
  if (!label) return '';
  return 'severity-' + String(label).toLowerCase();
}

function urgencyClass(label) {
  if (!label) return '';
  return 'urgency-' + String(label).toLowerCase();
}

function ipssInRange(score, range) {
  switch (range) {
    case '0-7':   return score >= 0 && score <= 7;
    case '8-19':  return score >= 8 && score <= 19;
    case '20-35': return score >= 20 && score <= 35;
    default:      return true;
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.ipss !== '' ||
    filters.severity !== '' ||
    filters.urgency !== ''
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
  if (filters.ipss && !ipssInRange(row.ipssScore, filters.ipss)) {
    return false;
  }
  if (filters.severity && row.symptomSeverity !== filters.severity) {
    return false;
  }
  if (filters.urgency && row.referralUrgency !== filters.urgency) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; PSA is parsed as a float;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'symptomSeverity') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'referralUrgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ipssScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'psaLevel') {
    const an = parseFloat(av);
    const bn = parseFloat(bv);
    const ax = isNaN(an) ? -1 : an;
    const bx = isNaN(bn) ? -1 : bn;
    return (ax - bx) * dir;
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
    if (row.symptomSeverity === 'Severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="ipss-score">${esc(row.ipssScore)}/35</span></td>
      <td><span class="severity-badge ${severityClass(row.symptomSeverity)}">${esc(row.symptomSeverity)}</span></td>
      <td><span class="psa-level">${esc(row.psaLevel)}</span></td>
      <td><span class="urgency-badge ${urgencyClass(row.referralUrgency)}">${esc(row.referralUrgency)}</span></td>
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
  const ipss = document.getElementById('filter-ipss');
  const severity = document.getElementById('filter-severity');
  const urgency = document.getElementById('filter-urgency');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (ipss) {
    ipss.addEventListener('change', () => {
      filters.ipss = ipss.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.ipss = '';
      filters.severity = '';
      filters.urgency = '';
      if (search) search.value = '';
      if (ipss) ipss.value = '';
      if (severity) severity.value = '';
      if (urgency) urgency.value = '';
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
