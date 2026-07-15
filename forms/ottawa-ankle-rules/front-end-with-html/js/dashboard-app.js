import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Ottawa Ankle Rules — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + ankle-decision dropdown + foot-decision
// dropdown). Each row shows the two independent boolean imaging decisions
// (there is no score column — this instrument is a decision rule, not a score).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.OttawaAnkleRulesDashboard`. The whole file is wrapped
// in an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting slug
  ankle: '',     // '' | 'yes' | 'no'
  foot: ''       // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'careSetting',         label: 'Setting' },
  { key: 'injuredSide',         label: 'Side' },
  { key: 'ankleXrayIndicated',  label: 'Ankle X-ray' },
  { key: 'footXrayIndicated',   label: 'Foot X-ray' }
];

const settingLabels = {
  'emergency-department': 'Emergency dept',
  'minor-injury-unit': 'Minor-injury unit',
  'urgent-care': 'Urgent care',
  'other': 'Other'
};

const sideLabels = {
  'left': 'Left',
  'right': 'Right'
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

function decisionClass(indicated) {
  return indicated ? 'risk-high' : 'risk-low';
}

function decisionLabel(indicated) {
  return indicated ? 'Indicated' : 'Not indicated';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function sideLabel(side) {
  return sideLabels[side] || side || 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.ankle !== '' ||
    filters.foot !== ''
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.ankle && row.ankleXrayIndicated !== (filters.ankle === 'yes')) {
    return false;
  }
  if (filters.foot && row.footXrayIndicated !== (filters.foot === 'yes')) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. The two decision columns sort
 * booleans (indicated last when ascending so flagged rows cluster together);
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'ankleXrayIndicated' || key === 'footXrayIndicated') {
    av = av ? 1 : 0;
    bv = bv ? 1 : 0;
    return (av - bv) * dir;
  }

  // Default: string compare
  // (patientIdentifier, patientName, careSetting, injuredSide)
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
    if (row.ankleXrayIndicated || row.footXrayIndicated) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(sideLabel(row.injuredSide))}</td>
      <td><span class="risk-badge ${decisionClass(row.ankleXrayIndicated)}">${esc(decisionLabel(row.ankleXrayIndicated))}</span></td>
      <td><span class="risk-badge ${decisionClass(row.footXrayIndicated)}">${esc(decisionLabel(row.footXrayIndicated))}</span></td>
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
  const ankle = document.getElementById('filter-ankle');
  const foot = document.getElementById('filter-foot');
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
  if (ankle) {
    ankle.addEventListener('change', () => {
      filters.ankle = ankle.value;
      renderAll();
    });
  }
  if (foot) {
    foot.addEventListener('change', () => {
      filters.foot = foot.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.ankle = '';
      filters.foot = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (ankle) ankle.value = '';
      if (foot) foot.value = '';
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
