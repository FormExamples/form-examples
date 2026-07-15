import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// PERC — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + setting dropdown + classification dropdown + pre-test dropdown + workup
// dropdown). PERC is a status / classification form, so the table shows a
// classification badge rather than a numeric score.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',        // '' | 'emergency-department' | 'acute-ambulatory' | 'other'
  classification: '', // '' | 'perc-negative' | 'perc-positive'
  pretest: '',        // '' | 'low' | 'not-low'
  workup: ''          // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'careSetting',       label: 'Setting' },
  { key: 'pretestProbability', label: 'Pre-test' },
  { key: 'classification',    label: 'Classification' },
  { key: 'applicable',        label: 'Applicable' },
  { key: 'workupFlag',        label: 'Workup' }
];

// Rank used when sorting the classification column so the clinical action order
// (perc-positive > perc-negative) is respected regardless of locale.
const classificationRank = {
  'perc-positive': 0,
  'perc-negative': 1
};

const settingLabels = {
  'emergency-department': 'Emergency dept',
  'acute-ambulatory': 'Acute ambulatory',
  'other': 'Other'
};

const pretestLabels = {
  'low': 'Low',
  'not-low': 'Not low'
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

function classificationClass(classification) {
  switch (classification) {
    case 'perc-negative': return 'risk-low';
    case 'perc-positive': return 'risk-high';
    default: return '';
  }
}

function classificationLabel(classification) {
  switch (classification) {
    case 'perc-negative': return 'PERC-negative';
    case 'perc-positive': return 'PERC-positive';
    default: return 'N/A';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || (setting ? setting : 'N/A');
}

function pretestLabel(pretest) {
  return pretestLabels[pretest] || (pretest ? pretest : 'N/A');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.classification !== '' ||
    filters.pretest !== '' ||
    filters.workup !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').AssessmentRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      (settingLabel(row.careSetting) || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.classification && row.classification !== filters.classification) return false;
  if (filters.pretest && row.pretestProbability !== filters.pretest) return false;
  if (filters.workup === 'yes' && !row.workupFlag) return false;
  if (filters.workup === 'no' && row.workupFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The classification column uses
 * its rank table; boolean columns sort false<true; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'classification') {
    av = classificationRank[av] ?? 99;
    bv = classificationRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'workupFlag' || key === 'applicable') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare.
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕'; // up-down arrow
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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
    if (row.classification === 'perc-positive') {
      tr.classList.add('row-critical');
    }

    const classCellName = row.classification
      ? 'class-cell'
      : 'class-cell class-cell-na';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(pretestLabel(row.pretestProbability))}</td>
      <td><span class="${classCellName}"><span class="risk-badge ${classificationClass(row.classification)}">${esc(classificationLabel(row.classification))}</span></span></td>
      <td>
        <span class="flag-badge ${row.applicable ? 'flag-yes' : 'flag-no'}">
          ${row.applicable ? 'Yes' : 'No'}
        </span>
      </td>
      <td>
        <span class="flag-badge ${row.workupFlag ? 'flag-yes' : 'flag-no'}">
          ${row.workupFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = assessments.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} assessments`;
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
  const setting = document.getElementById('filter-setting');
  const classification = document.getElementById('filter-classification');
  const pretest = document.getElementById('filter-pretest');
  const workup = document.getElementById('filter-workup');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (classification) {
    classification.addEventListener('change', () => {
      filters.classification = classification.value;
      renderAll();
    });
  }
  if (pretest) {
    pretest.addEventListener('change', () => {
      filters.pretest = pretest.value;
      renderAll();
    });
  }
  if (workup) {
    workup.addEventListener('change', () => {
      filters.workup = workup.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.classification = '';
      filters.pretest = '';
      filters.workup = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (classification) classification.value = '';
      if (pretest) pretest.value = '';
      if (workup) workup.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
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
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
