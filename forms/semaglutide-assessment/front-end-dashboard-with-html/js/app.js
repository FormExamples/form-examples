// Semaglutide Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + eligibility dropdown + BMI band dropdown + comorbidity
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.SemaglutideAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchPatients,
  samplePatients
} = window.SemaglutideAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  eligibility: '',
  bmiBand: '',
  comorbidity: '' // '', 'any', 'none', 't2dm', 'hypertension', 'dyslipidaemia', 'osa'
};

// Default sort: eligibility descending so 'Ineligible' lands at the top of
// the list — those are the patients with absolute contraindications who
// most need clinical attention. Secondary tie-breaks come from BMI desc
// (handled implicitly when a user clicks the BMI header).
const sortState = {
  key: 'eligibilityStatus',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'eligibilityStatus', label: 'Eligibility' },
  { key: 'primaryIndication', label: 'Indication' },
  { key: 'bmi',               label: 'BMI' },
  { key: 'bmiBand',           label: 'BMI Band' },
  { key: 'weightLossTargetPercent', label: 'Loss Target' },
  { key: 'comorbidities',     label: 'Comorbidities', sortable: false },
  { key: 'exclusions',        label: 'Exclusions',    sortable: false }
];

// Categorical rank tables — used so column sorts are clinically meaningful
// rather than just locale-alphabetical. Eligibility goes Eligible (best) ->
// Conditional -> Ineligible (worst). With direction 'desc' the worst lands
// at the top.
const eligibilityRank = {
  'Eligible': 0,
  'Conditional': 1,
  'Ineligible': 2
};

// BMI band rank — clinically increasing from underweight up through
// obesity class III. Sorting ascending puts the lowest BMI band first.
const bmiBandRank = {
  'Underweight': 0,
  'Normal':      1,
  'Overweight':  2,
  'Pre-Obesity': 3,
  'Obesity I':   4,
  'Obesity II':  5,
  'Obesity III': 6
};

// Indication rank — alphabetical-ish but stable.
const indicationRank = {
  'Type 2 Diabetes':              0,
  'Weight Management':            1,
  'Cardiovascular Risk Reduction': 2
};

// Per-patient comorbidity flags → human-readable chip labels.
const comorbidityFlags = [
  { key: 'comorbidityT2DM',          label: 'T2DM' },
  { key: 'comorbidityHypertension',  label: 'Hypertension' },
  { key: 'comorbidityDyslipidaemia', label: 'Dyslipidaemia' },
  { key: 'comorbidityOSA',           label: 'OSA' }
];

// Per-patient exclusion flags → human-readable chip labels.
const exclusionFlags = [
  { key: 'exclusionPregnancy',        label: 'Pregnancy' },
  { key: 'exclusionMTC',              label: 'MTC/MEN2' },
  { key: 'exclusionSevereGI',         label: 'Severe GI' },
  { key: 'exclusionHypersensitivity', label: 'Hypersensitivity' }
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

function eligibilityClass(label) {
  if (!label) return '';
  return 'eligibility-' + String(label).toLowerCase();
}

function bmiBandClass(label) {
  if (!label) return '';
  // 'Obesity II' -> 'bmi-band-obesity-ii'
  return 'bmi-band-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/** True iff the row has any of the four tracked comorbidities. */
function hasAnyComorbidity(row) {
  return comorbidityFlags.some(function (f) { return row[f.key]; });
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.eligibility !== '' ||
    filters.bmiBand !== '' ||
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.eligibility && row.eligibilityStatus !== filters.eligibility) {
    return false;
  }
  if (filters.bmiBand && row.bmiBand !== filters.bmiBand) {
    return false;
  }
  if (filters.comorbidity) {
    if (filters.comorbidity === 'any' && !hasAnyComorbidity(row)) return false;
    if (filters.comorbidity === 'none' && hasAnyComorbidity(row)) return false;
    if (filters.comorbidity === 't2dm' && !row.comorbidityT2DM) return false;
    if (filters.comorbidity === 'hypertension' && !row.comorbidityHypertension) return false;
    if (filters.comorbidity === 'dyslipidaemia' && !row.comorbidityDyslipidaemia) return false;
    if (filters.comorbidity === 'osa' && !row.comorbidityOSA) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; strings use locale-aware
 * compare; nulls sort last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'eligibilityStatus') {
    av = eligibilityRank[av] ?? -1;
    bv = eligibilityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'bmiBand') {
    av = bmiBandRank[av] ?? -1;
    bv = bmiBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'primaryIndication') {
    av = indicationRank[av] ?? -1;
    bv = indicationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'bmi') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'weightLossTargetPercent') {
    // Treat null as -Infinity so ascending sort puts it first; descending
    // sort puts numeric targets first, null last. Concretely we map null
    // to a sentinel and apply direction-aware comparison.
    const an = av == null ? Number.NEGATIVE_INFINITY : av;
    const bn = bv == null ? Number.NEGATIVE_INFINITY : bv;
    return (an - bn) * dir;
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

    if (col.sortable === false) {
      // Non-sortable header (chip-list columns) — render plain text.
      th.setAttribute('aria-sort', 'none');
      th.textContent = col.label;
      head.appendChild(th);
      continue;
    }

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

function renderComorbidities(row) {
  const chips = [];
  for (const f of comorbidityFlags) {
    if (row[f.key]) {
      chips.push(`<span class="comorbidity-chip">${esc(f.label)}</span>`);
    }
  }
  if (chips.length === 0) {
    return '<span class="comorbidity-none">None</span>';
  }
  return `<span class="comorbidity-list">${chips.join('')}</span>`;
}

function renderExclusions(row) {
  const chips = [];
  for (const f of exclusionFlags) {
    if (row[f.key]) {
      chips.push(`<span class="exclusion-chip">${esc(f.label)}</span>`);
    }
  }
  if (chips.length === 0) {
    return '<span class="exclusion-none">None</span>';
  }
  return `<span class="exclusion-list">${chips.join('')}</span>`;
}

function renderBmi(row) {
  if (row.bmi == null || Number.isNaN(row.bmi)) return '<span class="bmi-value">—</span>';
  return `<span class="bmi-value">${row.bmi.toFixed(1)}</span>`;
}

function renderWeightLossTarget(row) {
  if (row.weightLossTargetPercent == null) {
    return '<span class="weight-loss-target">—</span>';
  }
  return `<span class="weight-loss-target">${esc(row.weightLossTargetPercent)}%</span>`;
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
    if (row.eligibilityStatus === 'Ineligible') {
      tr.classList.add('row-ineligible');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="eligibility-badge ${eligibilityClass(row.eligibilityStatus)}">${esc(row.eligibilityStatus)}</span></td>
      <td>${esc(row.primaryIndication)}</td>
      <td>${renderBmi(row)}</td>
      <td><span class="bmi-band-badge ${bmiBandClass(row.bmiBand)}">${esc(row.bmiBand)}</span></td>
      <td>${renderWeightLossTarget(row)}</td>
      <td>${renderComorbidities(row)}</td>
      <td>${renderExclusions(row)}</td>
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
  const eligibility = document.getElementById('filter-eligibility');
  const bmiBand = document.getElementById('filter-bmi-band');
  const comorbidity = document.getElementById('filter-comorbidity');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (eligibility) {
    eligibility.addEventListener('change', () => {
      filters.eligibility = eligibility.value;
      renderAll();
    });
  }
  if (bmiBand) {
    bmiBand.addEventListener('change', () => {
      filters.bmiBand = bmiBand.value;
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
      filters.eligibility = '';
      filters.bmiBand = '';
      filters.comorbidity = '';
      if (search) search.value = '';
      if (eligibility) eligibility.value = '';
      if (bmiBand) bmiBand.value = '';
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
})();
