import { fetchNotes } from './api.js';
import { sampleNotes } from './data.js';

// Inpatient Clinical Note — ward dashboard.
//
// On boot we fetch the note list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// note-type, completeness-status, acuity-band, and safety-flag dropdowns).
//
// The dashboard shows BOTH gradings side by side, because they answer different
// questions: completeness is a record-quality property, acuity is a clinical
// one. A note can be Complete and Critical (a well-documented deterioration —
// the desired state during an acute event) or Incomplete and Stable (a thin
// entry on a well patient). Sorting by acuity descending surfaces the sickest
// patients; sorting by completeness ascending surfaces the documentation debt.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').NoteRow[]} */
let notes = [];

const filters = {
  search: '',
  noteType: '', // '' | one of the eight note types
  status: '',   // '' | 'complete' | 'partial' | 'incomplete'
  acuity: '',   // '' | 'stable' | 'watch' | 'escalate' | 'critical'
  flag: ''      // '' | 'yes' | 'no'
};

// Default sort: acuity descending, so the sickest patients are at the top.
const sortState = {
  key: 'acuityBand',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'hospitalMrn',         label: 'Patient ID' },
  { key: 'patientName',         label: 'Patient Name' },
  { key: 'wardName',            label: 'Ward' },
  { key: 'noteType',            label: 'Note Type' },
  { key: 'authorGrade',         label: 'Author' },
  { key: 'status',              label: 'Completeness' },
  { key: 'completenessPercent', label: 'Complete' },
  { key: 'acuityBand',          label: 'Acuity' },
  { key: 'news2Total',          label: 'NEWS2' },
  { key: 'lengthOfStayDays',    label: 'LOS' },
  { key: 'safetyFlag',          label: 'Safety Flag' }
];

// Ranks used when sorting so order is clinical rather than locale-dependent.
const statusRank = { 'complete': 0, 'partial': 1, 'incomplete': 2 };
const acuityRank = { 'stable': 0, 'watch': 1, 'escalate': 2, 'critical': 3 };

const noteTypeLabels = {
  'admission-clerking': 'Clerking',
  'progress': 'Progress',
  'consult': 'Consult',
  'event': 'Event',
  'procedure': 'Procedure',
  'handover': 'Handover',
  'transfer': 'Transfer',
  'discharge-planning': 'Discharge'
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

function statusClass(status) {
  if (status === 'complete') return 'risk-low';
  if (status === 'partial') return 'risk-moderate';
  if (status === 'incomplete') return 'risk-high';
  return '';
}

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'partial') return 'Partial';
  if (status === 'incomplete') return 'Incomplete';
  return 'N/A';
}

function acuityClass(band) {
  if (band === 'stable') return 'risk-low';
  if (band === 'watch') return 'risk-moderate';
  if (band === 'escalate') return 'risk-high';
  if (band === 'critical') return 'risk-critical';
  return '';
}

function acuityLabel(band) {
  if (band === 'stable') return 'Stable';
  if (band === 'watch') return 'Watch';
  if (band === 'escalate') return 'Escalate';
  if (band === 'critical') return 'Critical';
  return 'N/A';
}

function noteTypeLabel(t) {
  return noteTypeLabels[t] || t || 'N/A';
}

function percentLabel(pct) {
  return (pct === null || pct === undefined) ? 'N/A' : `${pct}%`;
}

function news2Label(n) {
  return (n === null || n === undefined) ? '—' : String(n);
}

function losLabel(d) {
  return (d === null || d === undefined) ? '—' : `${d}d`;
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.noteType !== '' ||
    filters.status !== '' ||
    filters.acuity !== '' ||
    filters.flag !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').NoteRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.hospitalMrn || '').toLowerCase().includes(term) ||
      String(row.patientName || '').toLowerCase().includes(term) ||
      String(row.wardName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.noteType && row.noteType !== filters.noteType) return false;
  if (filters.status && row.status !== filters.status) return false;
  if (filters.acuity && row.acuityBand !== filters.acuity) return false;
  if (filters.flag === 'yes' && !row.safetyFlag) return false;
  if (filters.flag === 'no' && row.safetyFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The status and acuity columns
 * use their rank tables; numeric columns sort nulls last; the safety-flag
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'status') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'acuityBand') {
    av = acuityRank[av] ?? -1;
    bv = acuityRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'completenessPercent' || key === 'news2Total' || key === 'lengthOfStayDays') {
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'safetyFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare.
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

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    if (row.acuityBand === 'critical' || row.acuityBand === 'escalate' || row.safetyFlag) {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.hospitalMrn)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.wardName)}</td>
      <td>${esc(noteTypeLabel(row.noteType))}</td>
      <td>${esc(row.authorGrade)}</td>
      <td><span class="risk-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td><span class="class-cell">${esc(percentLabel(row.completenessPercent))}</span></td>
      <td><span class="risk-badge ${acuityClass(row.acuityBand)}">${esc(acuityLabel(row.acuityBand))}</span></td>
      <td><span class="class-cell">${esc(news2Label(row.news2Total))}</span></td>
      <td><span class="class-cell">${esc(losLabel(row.lengthOfStayDays))}</span></td>
      <td>
        <span class="flag-badge ${row.safetyFlag ? 'flag-yes' : 'flag-no'}">
          ${row.safetyFlag ? 'Yes' : 'No'}
        </span>
      </td>
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
    el.textContent = 'No notes to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} notes`;
  } else {
    el.textContent = `Showing ${shown} of ${total} notes`;
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
  const noteType = document.getElementById('filter-note-type');
  const status = document.getElementById('filter-status');
  const acuity = document.getElementById('filter-acuity');
  const flag = document.getElementById('filter-flag');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (noteType) {
    noteType.addEventListener('change', () => {
      filters.noteType = noteType.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (acuity) {
    acuity.addEventListener('change', () => {
      filters.acuity = acuity.value;
      renderAll();
    });
  }
  if (flag) {
    flag.addEventListener('change', () => {
      filters.flag = flag.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.noteType = '';
      filters.status = '';
      filters.acuity = '';
      filters.flag = '';
      if (search) search.value = '';
      if (noteType) noteType.value = '';
      if (status) status.value = '';
      if (acuity) acuity.value = '';
      if (flag) flag.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadNotes() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  notes = sampleNotes;
  renderAll();

  try {
    const items = await fetchNotes();
    if (items && items.length > 0) {
      notes = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no notes.');
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadNotes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
