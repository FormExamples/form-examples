import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Palliative Assessment - clinician MDT dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + severity-band dropdown + diagnosis-category dropdown +
// performance-status-band dropdown + setting dropdown).
//
// Default sort is by ESAS-r severity descending so the most-symptomatic
// patients surface first — that is the primary clinical question this
// dashboard exists to answer.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PalliativeAssessmentDashboard`. Pulling
// them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  severity: '',  // SeverityBand or ''
  diagnosis: '', // DiagnosisCategory or ''
  pps: '',       // PpsBand or ''
  setting: ''    // Setting or ''
};

// Default sort: severity band descending (Severe first), so the patients
// who most need MDT attention appear at the top of the list.
const sortState = {
  key: 'severityBand',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. The "Symptom Flags" column is non-sortable:
// it shows a chip list of every individual ESAS-r symptom score >= 7.
const columns = [
  { key: 'nhsNumber',         label: 'NHS Number' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'esasTotal',         label: 'ESAS-r Total' },
  { key: 'severityBand',      label: 'Severity' },
  { key: 'diagnosisCategory', label: 'Primary Diagnosis' },
  { key: 'pps',               label: 'PPS' },
  { key: 'setting',           label: 'Setting' },
  { key: 'symptomFlags',      label: 'Symptom Flags (\u2265 7)', sortable: false }
];

// Rank used when sorting the severityBand column so 'None' < 'Mild' <
// 'Moderate' < 'Severe' regardless of locale collation.
const severityRank = {
  'None': 0,
  'Mild': 1,
  'Moderate': 2,
  'Severe': 3
};

// Diagnosis-category rank — alphabetical canonical order so sorts are
// stable regardless of the platform's locale.
const diagnosisRank = {
  'Cancer': 0,
  'COPD': 1,
  'Dementia': 2,
  'Heart Failure': 3,
  'Neurological': 4
};

// Setting rank — orders by typical care intensity.
const settingRank = {
  'Home': 0,
  'Care Home': 1,
  'Hospice': 2,
  'Hospital': 3
};

// Display labels and ordering for the ten ESAS-r symptoms when rendered as
// chips. Order matches the ESAS-r questionnaire so reviewers see the same
// sequence on the dashboard as on the patient form.
const symptomLabels = [
  { key: 'pain',              label: 'Pain' },
  { key: 'tiredness',         label: 'Tiredness' },
  { key: 'drowsiness',        label: 'Drowsiness' },
  { key: 'nausea',            label: 'Nausea' },
  { key: 'appetite',          label: 'Appetite' },
  { key: 'shortnessOfBreath', label: 'Breathlessness' },
  { key: 'depression',        label: 'Depression' },
  { key: 'anxiety',           label: 'Anxiety' },
  { key: 'wellbeing',         label: 'Wellbeing' },
  { key: 'other',             label: 'Other' }
];

// Threshold for the "individual flag" chip — matches the engine.
const SYMPTOM_FLAG_THRESHOLD = 7;

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

function diagnosisClass(label) {
  if (!label) return '';
  return 'diagnosis-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function ppsBandClass(label) {
  if (!label) return '';
  return 'pps-' + String(label).toLowerCase();
}

function settingClass(label) {
  if (!label) return '';
  return 'setting-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.severity !== '' ||
    filters.diagnosis !== '' ||
    filters.pps !== '' ||
    filters.setting !== ''
  );
}

/** Return the list of flagged symptoms (score >= 7) for a row. */
function flaggedSymptoms(row) {
  const out = [];
  const s = row.symptoms || {};
  for (const def of symptomLabels) {
    const v = s[def.key];
    if (typeof v === 'number' && v >= SYMPTOM_FLAG_THRESHOLD) {
      out.push({ label: def.label, score: v });
    }
  }
  return out;
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
    const hay =
      (row.nhsNumber || '').toLowerCase() + ' ' +
      (row.patientName || '').toLowerCase() + ' ' +
      (row.primaryDiagnosis || '').toLowerCase() + ' ' +
      (row.diagnosisCategory || '').toLowerCase();
    if (!hay.includes(term)) return false;
  }
  if (filters.severity && row.severityBand !== filters.severity) {
    return false;
  }
  if (filters.diagnosis && row.diagnosisCategory !== filters.diagnosis) {
    return false;
  }
  if (filters.pps && row.ppsBand !== filters.pps) {
    return false;
  }
  if (filters.setting && row.setting !== filters.setting) {
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

  if (key === 'severityBand') {
    av = severityRank[av] ?? -1;
    bv = severityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'diagnosisCategory') {
    av = diagnosisRank[av] ?? -1;
    bv = diagnosisRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'setting') {
    av = settingRank[av] ?? -1;
    bv = settingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'pps') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'esasTotal') {
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

    if (col.sortable === false) {
      // Non-sortable header (chip-list column) — render plain text.
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

function renderSymptomFlags(row) {
  const flags = flaggedSymptoms(row);
  if (flags.length === 0) {
    return '<span class="symptom-none">None</span>';
  }
  const chips = flags.map(function (f) {
    return (
      '<span class="symptom-chip">' +
        esc(f.label) +
        ' <span class="symptom-chip-score">' + esc(f.score) + '</span>' +
      '</span>'
    );
  });
  return '<span class="symptom-list">' + chips.join('') + '</span>';
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
    if (row.severityBand === 'Severe') {
      tr.classList.add('row-severe');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="esas-total">${esc(row.esasTotal)}/100</span></td>
      <td><span class="severity-badge ${severityClass(row.severityBand)}">${esc(row.severityBand)}</span></td>
      <td>
        <span class="diagnosis-badge ${diagnosisClass(row.diagnosisCategory)}">${esc(row.diagnosisCategory)}</span>
        <span class="diagnosis-detail" title="${esc(row.primaryDiagnosis)}">${esc(row.primaryDiagnosis)}</span>
      </td>
      <td>
        <span class="pps-value">${esc(row.pps)}</span>
        <span class="pps-band ${ppsBandClass(row.ppsBand)}">${esc(row.ppsBand)}</span>
      </td>
      <td><span class="setting-badge ${settingClass(row.setting)}">${esc(row.setting)}</span></td>
      <td>${renderSymptomFlags(row)}</td>
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
    // Severity and ESAS total default to descending so the first click
    // surfaces the highest-priority rows. PPS defaults to ascending
    // because lower PPS = sicker. Other columns default to ascending
    // (alphabetical / numerical small-first).
    if (key === 'severityBand' || key === 'esasTotal') {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const severity = document.getElementById('filter-severity');
  const diagnosis = document.getElementById('filter-diagnosis');
  const pps = document.getElementById('filter-pps');
  const setting = document.getElementById('filter-setting');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (severity) {
    severity.addEventListener('change', () => {
      filters.severity = severity.value;
      renderAll();
    });
  }
  if (diagnosis) {
    diagnosis.addEventListener('change', () => {
      filters.diagnosis = diagnosis.value;
      renderAll();
    });
  }
  if (pps) {
    pps.addEventListener('change', () => {
      filters.pps = pps.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.severity = '';
      filters.diagnosis = '';
      filters.pps = '';
      filters.setting = '';
      if (search) search.value = '';
      if (severity) severity.value = '';
      if (diagnosis) diagnosis.value = '';
      if (pps) pps.value = '';
      if (setting) setting.value = '';
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
