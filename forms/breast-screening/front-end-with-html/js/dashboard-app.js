// Breast Screening — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the screening list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + reading-outcome dropdown + outcome-band dropdown + urgent dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.BreastScreeningDashboard`. The whole file is wrapped
// in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchScreenings,
  sampleScreenings
} = window.BreastScreeningDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ScreeningRow[]} */
let screenings = [];

const filters = {
  search: '',
  reading: '',   // '' | reading-outcome value
  band: '',      // '' | outcome-band value
  urgent: ''     // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',     label: 'Patient ID' },
  { key: 'patientName',           label: 'Patient Name' },
  { key: 'screeningUnit',         label: 'Unit' },
  { key: 'readingOutcome',        label: 'Reading Outcome' },
  { key: 'imagingClassification', label: 'Class' },
  { key: 'outcomeBand',           label: 'Outcome' },
  { key: 'urgentFlag',            label: 'Urgent' }
];

// Rank used when sorting the outcomeBand column, in escalating severity.
const bandRank = {
  'routine': 0,
  'repeat': 1,
  'assessment': 2,
  'referral': 3,
  'urgent': 4,
  'incomplete': 5
};

const readingLabels = {
  'normal-routine-recall': 'Normal — routine recall',
  'technical-repeat': 'Technical repeat',
  'recall-for-assessment': 'Recall for assessment'
};

const bandLabels = {
  'routine': 'Routine recall',
  'repeat': 'Technical repeat',
  'assessment': 'Assessment',
  'urgent': 'Urgent',
  'referral': 'Referral',
  'incomplete': 'Incomplete'
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
    case 'routine': return 'risk-low';
    case 'repeat': return 'risk-moderate';
    case 'assessment': return 'risk-medium';
    case 'urgent': return 'risk-critical';
    case 'referral': return 'risk-high';
    default: return '';
  }
}

function bandLabel(band) {
  return bandLabels[band] || 'N/A';
}

function readingLabel(outcome) {
  return readingLabels[outcome] || 'Not recorded';
}

function classLabel(cls) {
  return (cls === null || cls === undefined) ? 'N/A' : String(cls);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.reading !== '' ||
    filters.band !== '' ||
    filters.urgent !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ScreeningRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      row.screeningUnit.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.reading && row.readingOutcome !== filters.reading) return false;
  if (filters.band && row.outcomeBand !== filters.band) return false;
  if (filters.urgent === 'yes' && !row.urgentFlag) return false;
  if (filters.urgent === 'no' && row.urgentFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The outcome-band column uses its
 * rank table; the nullable imaging classification sorts nulls last; the urgent
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'outcomeBand') {
    av = bandRank[av] ?? -1;
    bv = bandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'imagingClassification') {
    // Sort nulls last in both directions so assessed rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'urgentFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return screenings.filter(matchesFilters).slice().sort(compareRows);
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
    if (row.urgentFlag) {
      tr.classList.add('row-critical');
    }

    const classClassName = row.imagingClassification === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.screeningUnit)}</td>
      <td>${esc(readingLabel(row.readingOutcome))}</td>
      <td><span class="${classClassName}">${esc(classLabel(row.imagingClassification))}</span></td>
      <td><span class="risk-badge ${bandClass(row.outcomeBand)}">${esc(bandLabel(row.outcomeBand))}</span></td>
      <td>
        <span class="flag-badge ${row.urgentFlag ? 'flag-yes' : 'flag-no'}">
          ${row.urgentFlag ? 'Yes' : 'No'}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = screenings.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No screening records to display.';
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
  const reading = document.getElementById('filter-reading');
  const band = document.getElementById('filter-band');
  const urgent = document.getElementById('filter-urgent');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (reading) {
    reading.addEventListener('change', () => {
      filters.reading = reading.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (urgent) {
    urgent.addEventListener('change', () => {
      filters.urgent = urgent.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.reading = '';
      filters.band = '';
      filters.urgent = '';
      if (search) search.value = '';
      if (reading) reading.value = '';
      if (band) band.value = '';
      if (urgent) urgent.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadScreenings() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  screenings = sampleScreenings;
  renderAll();

  try {
    const items = await fetchScreenings();
    if (items && items.length > 0) {
      screenings = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no screening records.'
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
  loadScreenings();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
