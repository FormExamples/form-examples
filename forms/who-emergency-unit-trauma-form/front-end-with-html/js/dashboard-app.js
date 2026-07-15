import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// WHO Emergency Unit Form: Trauma - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + triage category + mechanism + dead-on-arrival + disposition).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  triage: '',      // '' | 'red' | 'yellow' | 'green'
  mechanism: '',   // '' | 'road-traffic' | 'fall' | 'penetrating' | 'blunt' | 'burn' | 'other'
  doa: 'all',      // 'all' | 'yes' | 'no'
  disposition: '' // '' | 'admit' | 'transfer' | 'discharge' | 'died' | 'lwbs'
};

/** Sort state: which column key, ascending or descending. Default per
 * spec: most recent disposition first (nulls always sort last). */
const sortState = {
  key: 'dispositionAt',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below. Order matches the spec.
const columns = [
  { key: 'patientName',     label: 'Patient Name' },
  { key: 'dateOfBirth',     label: 'DOB' },
  { key: 'sex',             label: 'Sex' },
  { key: 'injuryLocation',  label: 'Injury Location' },
  { key: 'triageCategory',  label: 'Triage' },
  { key: 'deadOnArrival',   label: 'DOA' },
  { key: 'mechanism',       label: 'Mechanism' },
  { key: 'gcsTotal',        label: 'GCS' },
  { key: 'fastPositive',    label: 'FAST+' },
  { key: 'disposition',     label: 'Disposition' },
  { key: 'urgentFlagCount', label: 'Urgent Flags' },
  { key: 'providerName',    label: 'Provider' },
  { key: 'dispositionAt',   label: 'Disposition At' }
];

// Rank used when sorting triage (most acute first when ascending).
const triageRank = { 'red': 0, 'yellow': 1, 'green': 2, '': 3 };

// Rank for mechanisms (administrative ordering).
const mechanismRank = {
  'road-traffic': 0,
  'fall': 1,
  'penetrating': 2,
  'blunt': 3,
  'burn': 4,
  'other': 5,
  '': 6
};

// Rank for dispositions (administrative ordering used by the SvelteKit grid).
const dispositionRank = {
  'admit': 0,
  'transfer': 1,
  'discharge': 2,
  'died': 3,
  'lwbs': 4,
  '': 5
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

function formatTriage(value) {
  switch (value) {
    case 'red':    return 'RED \u2014 Immediate';
    case 'yellow': return 'YELLOW \u2014 Urgent';
    case 'green':  return 'GREEN \u2014 Non-urgent';
    default:       return value || '';
  }
}

function formatMechanism(value) {
  switch (value) {
    case 'road-traffic': return 'Road traffic';
    case 'fall':         return 'Fall';
    case 'penetrating':  return 'Penetrating';
    case 'blunt':        return 'Blunt';
    case 'burn':         return 'Burn';
    case 'other':        return 'Other';
    default:             return value || '';
  }
}

function formatDisposition(value) {
  switch (value) {
    case 'admit':     return 'Admit';
    case 'transfer':  return 'Transfer';
    case 'discharge': return 'Discharge';
    case 'died':      return 'Died';
    case 'lwbs':      return 'LWBS';
    default:          return value || '';
  }
}

function triageClass(value) {
  if (!value) return '';
  return 'triage-' + value;
}

function mechanismClass(value) {
  if (!value) return '';
  return 'mechanism-' + value;
}

function dispositionClass(value) {
  if (!value) return '';
  return 'disposition-' + value;
}

function formatGcs(value) {
  if (value === null || value === undefined || value === '') return '\u2014';
  return String(value);
}

function formatDispositionAt(value) {
  if (!value) return '\u2014';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.triage !== '' ||
    filters.mechanism !== '' ||
    filters.doa !== 'all' ||
    filters.disposition !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      row.injuryLocation.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.triage && row.triageCategory !== filters.triage) return false;
  if (filters.mechanism && row.mechanism !== filters.mechanism) return false;
  if (filters.doa === 'yes' && !row.deadOnArrival) return false;
  if (filters.doa === 'no' && row.deadOnArrival) return false;
  if (filters.disposition && row.disposition !== filters.disposition) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Specialised columns (triage,
 * mechanism, disposition, dates, booleans, numbers) get explicit
 * comparators; everything else falls back to a locale-aware string compare.
 *
 * For `dispositionAt` (default sort) and `gcsTotal`, `null` always sorts
 * last regardless of direction, matching the spec.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'dispositionAt') {
    // null always sorts last, regardless of direction.
    const aNull = av === null || av === undefined || av === '';
    const bNull = bv === null || bv === undefined || bv === '';
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  if (key === 'gcsTotal') {
    // null always sorts last, regardless of direction.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (Number(av) - Number(bv)) * dir;
  }

  if (key === 'triageCategory') {
    return ((triageRank[av] ?? 99) - (triageRank[bv] ?? 99)) * dir;
  }

  if (key === 'mechanism') {
    return ((mechanismRank[av] ?? 99) - (mechanismRank[bv] ?? 99)) * dir;
  }

  if (key === 'disposition') {
    return ((dispositionRank[av] ?? 99) - (dispositionRank[bv] ?? 99)) * dir;
  }

  if (key === 'deadOnArrival' || key === 'fastPositive') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  if (key === 'urgentFlagCount') {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  if (key === 'dateOfBirth') {
    const at = new Date(av).getTime();
    const bt = new Date(bv).getTime();
    return (at - bt) * dir;
  }

  // Default: string compare
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    th.className = 'data-table-th';
    th.scope = 'col';
    th.dataset.column = col.key;

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
    tr.className = 'data-table-row';

    // Per-spec emphasis: triage RED gets red row background; dead-on-arrival
    // gets a heavy black border around every cell.
    if (row.triageCategory === 'red') {
      tr.classList.add('row-triage-red');
    }
    if (row.deadOnArrival) {
      tr.classList.add('row-doa');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.dateOfBirth)}</td>
      <td class="data-table-td">${esc(row.sex)}</td>
      <td class="data-table-td cell-injury">${esc(row.injuryLocation)}</td>
      <td class="data-table-td"><span class="badge ${triageClass(row.triageCategory)}">${esc(formatTriage(row.triageCategory))}</span></td>
      <td class="data-table-td">
        <span class="badge ${row.deadOnArrival ? 'doa-yes' : 'doa-no'}">
          ${row.deadOnArrival ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td"><span class="badge ${mechanismClass(row.mechanism)}">${esc(formatMechanism(row.mechanism))}</span></td>
      <td class="data-table-td cell-numeric">${esc(formatGcs(row.gcsTotal))}</td>
      <td class="data-table-td">
        <span class="badge ${row.fastPositive ? 'fast-yes' : 'fast-no'}">
          ${row.fastPositive ? 'Yes' : 'No'}
        </span>
      </td>
      <td class="data-table-td"><span class="badge ${dispositionClass(row.disposition)}">${esc(formatDisposition(row.disposition))}</span></td>
      <td class="data-table-td cell-numeric">${esc(String(row.urgentFlagCount))}</td>
      <td class="data-table-td">${esc(row.providerName)}</td>
      <td class="data-table-td">${esc(formatDispositionAt(row.dispositionAt))}</td>
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
    el.textContent = 'No encounters to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} encounters`;
  } else {
    el.textContent = `Showing ${shown} of ${total} encounters`;
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
  const triage = document.getElementById('filter-triage');
  const mechanism = document.getElementById('filter-mechanism');
  const doa = document.getElementById('filter-doa');
  const disposition = document.getElementById('filter-disposition');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (triage) {
    triage.addEventListener('change', () => {
      filters.triage = triage.value;
      renderAll();
    });
  }
  if (mechanism) {
    mechanism.addEventListener('change', () => {
      filters.mechanism = mechanism.value;
      renderAll();
    });
  }
  if (doa) {
    doa.addEventListener('change', () => {
      filters.doa = doa.value;
      renderAll();
    });
  }
  if (disposition) {
    disposition.addEventListener('change', () => {
      filters.disposition = disposition.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.triage = '';
      filters.mechanism = '';
      filters.doa = 'all';
      filters.disposition = '';
      if (search) search.value = '';
      if (triage) triage.value = '';
      if (mechanism) mechanism.value = '';
      if (doa) doa.value = 'all';
      if (disposition) disposition.value = '';
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
        'Showing sample data \u2014 backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data \u2014 backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
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
