import { fetchTriageNotes } from './api.js';
import { sampleTriageNotes } from './data.js';

// Emergency Department Triage Note — clinician dashboard (vanilla
// classic-script app).
//
// On boot we fetch the triage-note list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + priority-level dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').TriageRow[]} */
let notes = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting slug
  level: ''      // '' | '1' | '2' | '3' | '4' | '5'
};

// Default sort: priority level ascending (most urgent first), matching the
// SvelteKit dashboard.
const sortState = {
  key: 'priorityLevel',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',   label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'careSetting',         label: 'Setting' },
  { key: 'presentingComplaint', label: 'Presenting Complaint' },
  { key: 'priorityLevel',       label: 'Priority' },
  { key: 'targetMinutes',       label: 'Target (min)' },
  { key: 'news2Total',          label: 'NEWS2' }
];

const settingLabels = {
  'emergency-department': 'Emergency dept',
  'urgent-treatment-centre': 'Urgent treatment centre',
  'minor-injuries-unit': 'Minor injuries unit'
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

/** MTS level → shared risk-palette class (severity order). */
function levelClass(level) {
  switch (level) {
    case 1: return 'risk-critical';
    case 2: return 'risk-high';
    case 3: return 'risk-medium';
    case 4: return 'risk-moderate';
    case 5: return 'risk-low';
    default: return '';
  }
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function targetText(minutes) {
  return minutes === 0 ? 'Immediate' : String(minutes);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.level !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').TriageRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      (row.presentingComplaint || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.level && String(row.priorityLevel) !== filters.level) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Numeric columns sort
 * numerically; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'priorityLevel' || key === 'targetMinutes' || key === 'news2Total') {
    return ((av || 0) - (bv || 0)) * dir;
  }

  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return notes.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕';
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
    if (row.priorityLevel <= 2) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td>${esc(row.presentingComplaint || 'N/A')}</td>
      <td>
        <span class="risk-badge ${levelClass(row.priorityLevel)}">
          ${row.priorityLevel} · ${esc(row.priorityName)}
        </span>
      </td>
      <td><span class="class-cell">${esc(targetText(row.targetMinutes))}</span></td>
      <td><span class="class-cell">${esc(String(row.news2Total))}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = notes.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No triage notes to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} triage notes`;
  } else {
    el.textContent = `Showing ${shown} of ${total} triage notes`;
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
  const level = document.getElementById('filter-level');
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
  if (level) {
    level.addEventListener('change', () => {
      filters.level = level.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.level = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (level) level.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadTriageNotes() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  notes = sampleTriageNotes;
  renderAll();

  try {
    const items = await fetchTriageNotes();
    if (items && items.length > 0) {
      notes = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no triage notes.'
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
  loadTriageNotes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
