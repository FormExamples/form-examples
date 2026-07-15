import { fetchPartograms } from './api.js';
import { samplePartograms } from './data.js';

// Partogram — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the partogram list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + progress-classification dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.PartogramDashboard`. The whole file is wrapped in an
// IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').PartogramRow[]} */
let partograms = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting value
  progress: ''   // '' | 'normal' | 'alertLineCrossed' | 'actionLineCrossed'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',       label: 'Patient ID' },
  { key: 'patientName',             label: 'Patient Name' },
  { key: 'careSetting',             label: 'Care Setting' },
  { key: 'parity',                  label: 'Parity' },
  { key: 'latestDilatationCm',      label: 'Dilatation (cm)' },
  { key: 'elapsedHours',            label: 'Elapsed (h)' },
  { key: 'progressClassification',  label: 'Progress' }
];

// Rank used when sorting the progress column: escalate low → high concern.
const progressRank = {
  'normal': 0,
  'alertLineCrossed': 1,
  'actionLineCrossed': 2
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

function progressClass(p) {
  switch (p) {
    case 'actionLineCrossed': return 'risk-high';
    case 'alertLineCrossed': return 'risk-moderate';
    case 'normal': return 'risk-low';
    default: return '';
  }
}

function progressLabel(p) {
  switch (p) {
    case 'actionLineCrossed': return 'Action line crossed';
    case 'alertLineCrossed': return 'Alert line crossed';
    case 'normal': return 'Normal';
    default: return 'N/A';
  }
}

function settingLabel(s) {
  switch (s) {
    case 'labour-ward': return 'Labour ward';
    case 'birth-centre': return 'Birth centre';
    case 'triage': return 'Triage';
    case 'other': return 'Other';
    default: return 'N/A';
  }
}

function parityLabel(p) {
  switch (p) {
    case 'nulliparous': return 'Nulliparous';
    case 'multiparous': return 'Multiparous';
    default: return '—';
  }
}

function fmtDilatation(n) {
  return typeof n === 'number' ? `${n}` : '—';
}

function fmtHours(n) {
  return typeof n === 'number' ? n.toFixed(1) : '—';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.progress !== ''
  );
}

/** Distinct care settings present in the current data, sorted. */
function settingOptions() {
  const set = new Set();
  for (const p of partograms) {
    if (p.careSetting) set.add(p.careSetting);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').PartogramRow} row
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
  if (filters.progress && row.progressClassification !== filters.progress) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The progress column uses its
 * rank table; the numeric columns sort numerically; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'progressClassification') {
    av = progressRank[av] ?? -1;
    bv = progressRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'latestDilatationCm' || key === 'elapsedHours') {
    return ((av ?? -Infinity) - (bv ?? -Infinity)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting, parity)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return partograms.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderSettingFilterOptions() {
  const sel = document.getElementById('filter-setting');
  if (!sel) return;
  const current = sel.value;
  const opts = ['<option value="">All settings</option>']
    .concat(settingOptions().map((s) => `<option value="${esc(s)}">${esc(settingLabel(s))}</option>`));
  sel.innerHTML = opts.join('');
  sel.value = current;
}

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
    if (row.progressClassification === 'actionLineCrossed') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(parityLabel(row.parity))}</td>
      <td><span class="class-cell">${esc(fmtDilatation(row.latestDilatationCm))}</span></td>
      <td><span class="class-cell">${esc(fmtHours(row.elapsedHours))}</span></td>
      <td><span class="risk-badge ${progressClass(row.progressClassification)}">${esc(progressLabel(row.progressClassification))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = partograms.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No partograms to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} partograms`;
  } else {
    el.textContent = `Showing ${shown} of ${total} partograms`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

function renderAll() {
  renderSettingFilterOptions();
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
  const progress = document.getElementById('filter-progress');
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
  if (progress) {
    progress.addEventListener('change', () => {
      filters.progress = progress.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.progress = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (progress) progress.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPartograms() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  partograms = samplePartograms;
  renderAll();

  try {
    const items = await fetchPartograms();
    if (items && items.length > 0) {
      partograms = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no partograms.'
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
  loadPartograms();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
