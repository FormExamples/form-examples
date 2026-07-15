import { fetchOperationNotes } from './api.js';
import { sampleOperationNotes } from './data.js';

// Medical Operation Note - theatre dashboard
// (vanilla classic-script app).
//
// On boot we fetch the operation-note list from the backend; on any failure
// (or empty response) we fall back to sample data and show a small banner.
// The rendered table is sortable (click any column header) and filterable
// (search box + composite-risk dropdown + Clavien-Dindo dropdown +
// urgency dropdown + never-event dropdown + sign-off dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.MedicalOperationNoteDashboard`. Pulling
// them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').OperationNoteRow[]} */
let operationNotes = [];

const filters = {
  search: '',
  risk: '',
  clavien: '',
  urgency: '',
  neverEvent: '', // '', 'yes', 'no'
  signed: ''      // '', 'yes', 'no'
};

// Default sort: most recent date first, so the latest op notes appear at
// the top of the dashboard. Critical cases are also visually highlighted
// via the row-critical row class.
const sortState = {
  key: 'date',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions - single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'date',                label: 'Date' },
  { key: 'hospital',            label: 'Hospital' },
  { key: 'theatre',             label: 'Theatre' },
  { key: 'listType',            label: 'List' },
  { key: 'surgeon',             label: 'Surgeon' },
  { key: 'patient',             label: 'Patient' },
  { key: 'procedure',           label: 'Primary Procedure' },
  { key: 'urgency',             label: 'Urgency' },
  { key: 'compositeRisk',       label: 'Composite Risk' },
  { key: 'clavienDindo',        label: 'Clavien\u2013Dindo' },
  { key: 'estimatedBloodLoss',  label: 'EBL (mL)' },
  { key: 'countsAgreed',        label: 'Counts' },
  { key: 'neverEventFlag',      label: 'Never Event' },
  { key: 'recoveryDestination', label: 'Recovery' },
  { key: 'signed',              label: 'Signed' }
];

// Rank used when sorting the composite-risk column so 'routine' is always
// less than 'critical' regardless of locale.
const riskRank = {
  'routine': 0,
  'complicated': 1,
  'high-risk': 2,
  'critical': 3
};

// Rank used when sorting the urgency column so 'elective' is always less
// than 'immediate'.
const urgencyRank = {
  'elective': 0,
  'scheduled': 1,
  'urgent': 2,
  'immediate': 3
};

// Rank used when sorting the Clavien-Dindo column. The grade is a string
// label so the ordinal rank avoids accidental lexicographic comparison.
const clavienRank = {
  '0': 0,
  'I': 1,
  'II': 2,
  'IIIa': 3,
  'IIIb': 4,
  'IVa': 5,
  'IVb': 6,
  'V': 7
};

// Rank used when sorting the recovery-destination column from least to
// most intensive level of post-op care.
const recoveryRank = {
  'day-case-discharge': 0,
  'ward': 1,
  'PACU': 2,
  'enhanced-care': 3,
  'HDU': 4,
  'ICU': 5
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

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

function urgencyClass(label) {
  if (!label) return '';
  return 'urgency-' + String(label).toLowerCase();
}

function clavienClass(grade) {
  if (!grade && grade !== '0') return '';
  return 'clavien-' + String(grade).toLowerCase();
}

function yesNoClass(prefix, val) {
  return prefix + '-' + (val ? 'yes' : 'no');
}

function eblClass(ml) {
  if (ml == null) return '';
  if (ml > 3000) return 'numeric-danger';
  if (ml > 1500) return 'numeric-warn';
  return 'numeric-cell';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.clavien !== '' ||
    filters.urgency !== '' ||
    filters.neverEvent !== '' ||
    filters.signed !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').OperationNoteRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.patient || '').toLowerCase().includes(term) ||
      String(row.nhs || '').toLowerCase().includes(term) ||
      String(row.hospital || '').toLowerCase().includes(term) ||
      String(row.surgeon || '').toLowerCase().includes(term) ||
      String(row.procedure || '').toLowerCase().includes(term) ||
      String(row.opcs || '').toLowerCase().includes(term) ||
      String(row.theatre || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.compositeRisk !== filters.risk) {
    return false;
  }
  if (filters.clavien && row.clavienDindo !== filters.clavien) {
    return false;
  }
  if (filters.urgency && row.urgency !== filters.urgency) {
    return false;
  }
  if (filters.neverEvent === 'yes' && !row.neverEventFlag) return false;
  if (filters.neverEvent === 'no' && row.neverEventFlag) return false;
  if (filters.signed === 'yes' && !row.signed) return false;
  if (filters.signed === 'no' && row.signed) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; null values sort last; numbers compare directly;
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'compositeRisk') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'urgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'clavienDindo') {
    av = clavienRank[av] ?? -1;
    bv = clavienRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'recoveryDestination') {
    av = recoveryRank[av] ?? -1;
    bv = recoveryRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'estimatedBloodLoss') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'countsAgreed' || key === 'neverEventFlag' || key === 'signed') {
    // Booleans: false (0) < true (1).
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (date, hospital, theatre, listType, surgeon,
  // patient, procedure).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return operationNotes.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('operation-notes-table-head');
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
  const body = document.getElementById('operation-notes-table-body');
  const empty = document.getElementById('operation-notes-empty-message');
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
    if (row.compositeRisk === 'critical') {
      tr.classList.add('row-critical');
    }
    if (row.neverEventFlag) {
      tr.classList.add('row-never-event');
    }

    const eblText = row.estimatedBloodLoss == null
      ? '\u2014'
      : esc(row.estimatedBloodLoss);
    const countsLabel = row.countsAgreed ? 'Agreed' : 'Discrepancy';
    const neverEventLabel = row.neverEventFlag ? 'Flagged' : 'No';
    const signedLabel = row.signed ? 'Signed' : 'Unsigned';

    tr.innerHTML = `
      <td class="data-table-td"><span class="date-cell">${esc(row.date)}</span></td>
      <td class="data-table-td">${esc(row.hospital)}</td>
      <td class="data-table-td">${esc(row.theatre)}</td>
      <td class="data-table-td">${esc(row.listType)}</td>
      <td class="data-table-td">${esc(row.surgeon)}</td>
      <td class="data-table-td"><strong>${esc(row.patient)}</strong></td>
      <td class="data-table-td">${esc(row.procedure)}<span class="opcs-code">${esc(row.opcs)}</span></td>
      <td class="data-table-td"><span class="urgency-badge ${urgencyClass(row.urgency)}">${esc(row.urgency)}</span></td>
      <td class="data-table-td"><span class="risk-badge ${riskClass(row.compositeRisk)}">${esc(row.compositeRisk)}</span></td>
      <td class="data-table-td"><span class="clavien-badge ${clavienClass(row.clavienDindo)}">${esc(row.clavienDindo)}</span></td>
      <td class="data-table-td"><span class="${eblClass(row.estimatedBloodLoss)}">${eblText}</span></td>
      <td class="data-table-td"><span class="counts-badge ${yesNoClass('counts', row.countsAgreed)}">${esc(countsLabel)}</span></td>
      <td class="data-table-td"><span class="never-event-badge ${yesNoClass('never-event', row.neverEventFlag)}">${esc(neverEventLabel)}</span></td>
      <td class="data-table-td">${esc(row.recoveryDestination)}</td>
      <td class="data-table-td"><span class="signed-badge ${yesNoClass('signed', row.signed)}">${esc(signedLabel)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = operationNotes.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No operation notes to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} operation notes`;
  } else {
    el.textContent = `Showing ${shown} of ${total} operation notes`;
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
    // Date column defaults to descending (most recent first); everything
    // else defaults to ascending.
    sortState.direction = key === 'date' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const clavien = document.getElementById('filter-clavien');
  const urgency = document.getElementById('filter-urgency');
  const neverEvent = document.getElementById('filter-never-event');
  const signed = document.getElementById('filter-signed');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (clavien) {
    clavien.addEventListener('change', () => {
      filters.clavien = clavien.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (neverEvent) {
    neverEvent.addEventListener('change', () => {
      filters.neverEvent = neverEvent.value;
      renderAll();
    });
  }
  if (signed) {
    signed.addEventListener('change', () => {
      filters.signed = signed.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.clavien = '';
      filters.urgency = '';
      filters.neverEvent = '';
      filters.signed = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (clavien) clavien.value = '';
      if (urgency) urgency.value = '';
      if (neverEvent) neverEvent.value = '';
      if (signed) signed.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadOperationNotes() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  operationNotes = sampleOperationNotes;
  renderAll();

  try {
    const items = await fetchOperationNotes();
    if (items && items.length > 0) {
      operationNotes = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty - keep sample data and notify.
      showStatusBanner(
        'Showing sample data \u2014 backend returned no operation notes.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data \u2014 backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadOperationNotes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
