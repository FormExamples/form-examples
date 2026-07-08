// MEDIF medical-desk dashboard - vanilla classic-script app.
//
// Renders a sortable, filterable table of MEDIF submissions from a
// baked-in sample dataset (no backend). Each row carries the headline
// fields surfaced to an airline medical-desk reviewer: passenger,
// airline, flight, departure date, primary diagnosis, computed
// fitness-to-fly band, safety-flag count, and lifecycle status.
//
// Wrapped in an IIFE so its top-level identifiers do not leak to
// window.
(function () {
'use strict';

// ----------------------------------------------------------------------
// Sample data
// ----------------------------------------------------------------------
//
// Eight illustrative MEDIF rows spanning every fitness band and a range
// of clinical reasons. All names, NHS numbers, and booking references
// are fabricated — this is reference data, not real patient data.

const sampleAssessments = [
  {
    id: 'medif-0001',
    passenger: 'Aoife O\'Sullivan',
    airline: 'EK Emirates',
    flight: 'EK202',
    departure: '2026-06-04',
    diagnosis: 'Stable Type 2 diabetes; routine business travel',
    band: 'fit',
    flagCount: 0,
    bookingRef: 'AB12CD',
    status: 'cleared'
  },
  {
    id: 'medif-0002',
    passenger: 'Liam Walsh',
    airline: 'BA British Airways',
    flight: 'BA286',
    departure: '2026-06-09',
    diagnosis: 'Mild controlled asthma; carries reliever',
    band: 'fit',
    flagCount: 1,
    bookingRef: 'XK77QE',
    status: 'submitted'
  },
  {
    id: 'medif-0003',
    passenger: 'Priya Raman',
    airline: 'QR Qatar Airways',
    flight: 'QR007',
    departure: '2026-06-12',
    diagnosis: 'Stable COPD; supplemental oxygen 2 L/min on exertion',
    band: 'fit-with-conditions',
    flagCount: 2,
    bookingRef: 'TX9JJZ',
    status: 'reviewed'
  },
  {
    id: 'medif-0004',
    passenger: 'Marcus Chen',
    airline: 'LH Lufthansa',
    flight: 'LH401',
    departure: '2026-06-15',
    diagnosis: 'Singleton pregnancy 32 weeks; uncomplicated',
    band: 'requires-review',
    flagCount: 1,
    bookingRef: 'LJ22XX',
    status: 'submitted'
  },
  {
    id: 'medif-0005',
    passenger: 'Sofia Martins',
    airline: 'KL KLM',
    flight: 'KL643',
    departure: '2026-06-18',
    diagnosis: 'Post-laparotomy day 9; surgical recovery on track',
    band: 'requires-review',
    flagCount: 2,
    bookingRef: 'KQ8810',
    status: 'urgent'
  },
  {
    id: 'medif-0006',
    passenger: 'Ahmed Al-Farsi',
    airline: 'EK Emirates',
    flight: 'EK211',
    departure: '2026-06-21',
    diagnosis: 'Recent MI day 5; cardiac rehab in progress',
    band: 'unfit-to-fly',
    flagCount: 3,
    bookingRef: 'RR4P21',
    status: 'declined'
  },
  {
    id: 'medif-0007',
    passenger: 'Helena Nilsson',
    airline: 'SK SAS',
    flight: 'SK901',
    departure: '2026-06-24',
    diagnosis: 'Severe COPD; resting SpO2 84% room air',
    band: 'unfit-to-fly',
    flagCount: 4,
    bookingRef: 'SS1234',
    status: 'declined'
  },
  {
    id: 'medif-0008',
    passenger: 'Kofi Mensah',
    airline: 'BA British Airways',
    flight: 'BA079',
    departure: '2026-07-02',
    diagnosis: 'Sickle-cell trait; mild stable; travelling with carer',
    band: 'fit-with-conditions',
    flagCount: 1,
    bookingRef: 'BA7Z9P',
    status: 'cleared'
  }
];

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let assessments = sampleAssessments.slice();

const filters = {
  search: '',
  band: '',
  status: '',
  flags: ''
};

// Default sort: most recent departure first.
const sortState = {
  key: 'departure',
  direction: 'desc'
};

const columns = [
  { key: 'passenger',  label: 'Passenger' },
  { key: 'airline',    label: 'Airline' },
  { key: 'flight',     label: 'Flight' },
  { key: 'departure',  label: 'Departure' },
  { key: 'diagnosis',  label: 'Primary diagnosis' },
  { key: 'band',       label: 'Fitness band' },
  { key: 'flagCount',  label: 'Flags' },
  { key: 'status',     label: 'Status' }
];

const bandRank = {
  'fit': 0,
  'fit-with-conditions': 1,
  'requires-review': 2,
  'unfit-to-fly': 3
};

const statusRank = {
  'draft': 0,
  'submitted': 1,
  'reviewed': 2,
  'cleared': 3,
  'declined': 4,
  'urgent': 5
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bandClass(band) {
  if (!band) return '';
  return 'band-' + String(band);
}

function statusClass(status) {
  if (!status) return '';
  return 'status-' + String(status);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.band !== '' ||
    filters.status !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.passenger || '').toLowerCase().includes(term) ||
      String(row.airline || '').toLowerCase().includes(term) ||
      String(row.flight || '').toLowerCase().includes(term) ||
      String(row.diagnosis || '').toLowerCase().includes(term) ||
      String(row.bookingRef || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.band && row.band !== filters.band) return false;
  if (filters.status && row.status !== filters.status) return false;
  if (filters.flags === 'yes' && !(row.flagCount > 0)) return false;
  if (filters.flags === 'no' && row.flagCount > 0) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'band') {
    av = bandRank[av] != null ? bandRank[av] : -1;
    bv = bandRank[bv] != null ? bandRank[bv] : -1;
    return (av - bv) * dir;
  }
  if (key === 'status') {
    av = statusRank[av] != null ? statusRank[av] : -1;
    bv = statusRank[bv] != null ? statusRank[bv] : -1;
    return (av - bv) * dir;
  }
  if (key === 'flagCount') {
    return ((av || 0) - (bv || 0)) * dir;
  }
  return String(av == null ? '' : av)
    .localeCompare(String(bv == null ? '' : bv)) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('assessments-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '\u2195';
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
  const body = document.getElementById('assessments-table-body');
  const empty = document.getElementById('assessments-empty-message');
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
    if (row.band === 'unfit-to-fly') {
      tr.classList.add('row-unfit');
    }

    const flagCellClass = row.flagCount > 0
      ? 'flag-count flag-count-positive'
      : 'flag-count numeric-muted';

    tr.innerHTML = `
      <td><strong>${esc(row.passenger)}</strong></td>
      <td>${esc(row.airline)}</td>
      <td>${esc(row.flight)}</td>
      <td><span class="date-cell">${esc(row.departure)}</span></td>
      <td>${esc(row.diagnosis)}</td>
      <td><span class="band-badge ${esc(bandClass(row.band))}">${esc(row.band)}</span></td>
      <td><span class="${flagCellClass}">${esc(row.flagCount)}</span></td>
      <td><span class="status-badge ${esc(statusClass(row.status))}">${esc(row.status)}</span></td>
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
    el.textContent = 'No MEDIF assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} MEDIF assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} MEDIF assessments`;
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

// ----------------------------------------------------------------------
// Event handlers
// ----------------------------------------------------------------------

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    sortState.direction = key === 'departure' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const band = document.getElementById('filter-band');
  const status = document.getElementById('filter-status');
  const flagsSel = document.getElementById('filter-flags');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (flagsSel) {
    flagsSel.addEventListener('change', () => {
      filters.flags = flagsSel.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.band = '';
      filters.status = '';
      filters.flags = '';
      if (search) search.value = '';
      if (band) band.value = '';
      if (status) status.value = '';
      if (flagsSel) flagsSel.value = '';
      renderAll();
    });
  }
}

function init() {
  bindFilterInputs();
  renderAll();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
