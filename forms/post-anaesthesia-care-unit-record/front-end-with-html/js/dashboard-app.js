import { fetchRecords } from './api.js';
import { sampleRecords } from './data.js';

// PACU Record — recovery-team dashboard (vanilla classic-script app).
//
// On boot we fetch the recovery-record list from the backend; on any failure
// (or empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + technique dropdown + Aldrete dropdown + readiness-band dropdown +
// not-ready dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').RecordRow[]} */
let records = [];

const filters = {
  search: '',
  technique: '', // '' | 'general' | 'regional' | 'sedation' | 'combined'
  band: '',      // '' | 'not-ready' | 'discharge-ready'
  ready: ''      // '' | 'ready' | 'not-ready'
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
  { key: 'anaestheticTechnique', label: 'Technique' },
  { key: 'aldreteTotal',        label: 'Aldrete' },
  { key: 'readinessBand',       label: 'Readiness' },
  { key: 'notReadyFlag',        label: 'Not Ready' }
];

// Rank used when sorting the readinessBand column so 'not-ready' is always less
// than 'discharge-ready' regardless of locale.
const bandRank = {
  'not-ready': 0,
  'discharge-ready': 1
};

const techniqueLabels = {
  'general': 'General',
  'regional': 'Regional',
  'sedation': 'Sedation',
  'combined': 'Combined'
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
  if (!band) return '';
  return band === 'not-ready' ? 'risk-high' : 'risk-low';
}

function bandLabel(band) {
  if (band === 'discharge-ready') return 'Discharge-ready';
  if (band === 'not-ready') return 'Not ready';
  return 'N/A';
}

function techniqueLabel(technique) {
  return techniqueLabels[technique] || technique || 'N/A';
}

function totalLabel(total) {
  return (total === null || total === undefined) ? 'N/A' : `${total} / 10`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.technique !== '' ||
    filters.band !== '' ||
    filters.ready !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').RecordRow} row
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
  if (filters.technique && row.anaestheticTechnique !== filters.technique) return false;
  if (filters.band && row.readinessBand !== filters.band) return false;
  if (filters.ready === 'not-ready' && !row.notReadyFlag) return false;
  if (filters.ready === 'ready' && row.notReadyFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The readiness-band column uses
 * its rank table; the nullable Aldrete total sorts nulls last; the not-ready
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'readinessBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'aldreteTotal') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'notReadyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, anaestheticTechnique)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return records.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.readinessBand === 'not-ready') {
      tr.classList.add('row-critical');
    }

    const totalClassName = row.aldreteTotal === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(techniqueLabel(row.anaestheticTechnique))}</td>
      <td><span class="${totalClassName}">${esc(totalLabel(row.aldreteTotal))}</span></td>
      <td><span class="risk-badge ${bandClass(row.readinessBand)}">${esc(bandLabel(row.readinessBand))}</span></td>
      <td>
        <span class="flag-badge ${row.notReadyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.notReadyFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = records.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No records to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} records`;
  } else {
    el.textContent = `Showing ${shown} of ${total} records`;
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
  const technique = document.getElementById('filter-technique');
  const band = document.getElementById('filter-band');
  const ready = document.getElementById('filter-ready');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (technique) {
    technique.addEventListener('change', () => {
      filters.technique = technique.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (ready) {
    ready.addEventListener('change', () => {
      filters.ready = ready.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.technique = '';
      filters.band = '';
      filters.ready = '';
      if (search) search.value = '';
      if (technique) technique.value = '';
      if (band) band.value = '';
      if (ready) ready.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRecords() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  records = sampleRecords;
  renderAll();

  try {
    const items = await fetchRecords();
    if (items && items.length > 0) {
      records = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no records.'
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
  loadRecords();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
