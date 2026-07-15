import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// ZBI — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + instrument-form dropdown + band dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | 'memory-service' | 'community' | 'general-practice' | 'social-care' | 'other'
  form: '',      // '' | 'zbi22' | 'zbi12'
  band: ''       // '' | any burden band
};

// Default sort: carer name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'carerName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'carerIdentifier',    label: 'Carer ID' },
  { key: 'carerName',          label: 'Carer Name' },
  { key: 'careSetting',        label: 'Setting' },
  { key: 'instrumentForm',     label: 'Form' },
  { key: 'recipientCondition', label: 'Condition' },
  { key: 'totalScore',         label: 'ZBI' },
  { key: 'burdenBand',         label: 'Band' }
];

// Rank used when sorting the band column so bands order from least to most
// burden regardless of locale (ZBI-22 and ZBI-12 bands interleaved by severity).
const bandRank = {
  'little-or-none': 0,
  'lower': 1,
  'mild-to-moderate': 2,
  'high': 3,
  'moderate-to-severe': 4,
  'severe': 5
};

const settingLabels = {
  'memory-service': 'Memory service',
  'community': 'Community',
  'general-practice': 'General practice',
  'social-care': 'Social care',
  'other': 'Other'
};

const formLabels = {
  'zbi22': 'ZBI-22',
  'zbi12': 'ZBI-12'
};

const conditionLabels = {
  'dementia': 'Dementia',
  'chronic-illness': 'Chronic illness',
  'disability': 'Disability',
  'other': 'Other'
};

const bandLabels = {
  'little-or-none': 'Little / none',
  'mild-to-moderate': 'Mild-moderate',
  'moderate-to-severe': 'Moderate-severe',
  'severe': 'Severe',
  'lower': 'Lower',
  'high': 'High'
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

function bandClass(band) {
  switch (band) {
    case 'little-or-none': return 'risk-low';
    case 'lower': return 'risk-low';
    case 'mild-to-moderate': return 'risk-moderate';
    case 'moderate-to-severe': return 'risk-high';
    case 'severe': return 'risk-critical';
    case 'high': return 'risk-critical';
    default: return '';
  }
}

function bandLabel(band) {
  return bandLabels[band] || band || 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function formLabel(form) {
  return formLabels[form] || form || 'N/A';
}

function conditionLabel(cond) {
  return conditionLabels[cond] || cond || 'N/A';
}

function scoreLabel(row) {
  if (row.totalScore === null || row.totalScore === undefined) return 'N/A';
  const max = row.maxScore || (row.instrumentForm === 'zbi12' ? 48 : 88);
  return `${row.totalScore} / ${max}`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.form !== '' ||
    filters.band !== ''
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
      row.carerIdentifier.toLowerCase().includes(term) ||
      row.carerName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.form && row.instrumentForm !== filters.form) return false;
  if (filters.band && row.burdenBand !== filters.band) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The band column uses its rank
 * table; the nullable total sorts nulls last; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'burdenBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'totalScore') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (carerIdentifier, carerName, careSetting,
  // instrumentForm, recipientCondition)
  return String(av).localeCompare(String(bv)) * dir;
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
    // Surface the highest-burden rows as safety-critical.
    if (row.burdenBand === 'severe' || row.burdenBand === 'high') {
      tr.classList.add('row-critical');
    }

    const scoreClassName = row.totalScore === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.carerIdentifier)}</td>
      <td>${esc(row.carerName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(formLabel(row.instrumentForm))}</td>
      <td>${esc(conditionLabel(row.recipientCondition))}</td>
      <td><span class="${scoreClassName}">${esc(scoreLabel(row))}</span></td>
      <td><span class="risk-badge ${bandClass(row.burdenBand)}">${esc(bandLabel(row.burdenBand))}</span></td>
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
  const form = document.getElementById('filter-form');
  const band = document.getElementById('filter-band');
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
  if (form) {
    form.addEventListener('change', () => {
      filters.form = form.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.form = '';
      filters.band = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (form) form.value = '';
      if (band) band.value = '';
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
