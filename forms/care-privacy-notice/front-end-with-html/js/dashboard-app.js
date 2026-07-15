import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Care Privacy Notice — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure we
// fall back to sample data and show a small banner. The rendered table is
// sortable (click any column header) and filterable (search box + status
// dropdown).
//
// Sibling modules loaded as plain `<script>` tags attach their exports
// to `window.CarePrivacyNoticeDashboard`. The whole file is wrapped in
// an IIFE so its top-level identifiers do not leak.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let patients = [];

const filters = {
  search: '',
  status: ''
};

const sortState = {
  key: 'patientName',
  direction: 'asc'
};

const columns = [
  { key: 'patientName',      label: 'Patient Name' },
  { key: 'nhsNumber',        label: 'NHS Number' },
  { key: 'dateAcknowledged', label: 'Date Acknowledged' },
  { key: 'status',           label: 'Status' },
  { key: 'practiceName',     label: 'Practice Name' }
];

const statusRank = {
  'incomplete': 1,
  'complete':   0
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

function statusClass(status) {
  return 'completion-' + String(status || '').toLowerCase();
}

function statusLabel(status) {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function hasActiveFilters() {
  return filters.search !== '' || filters.status !== '';
}

function rowTintClass(row) {
  if (row.status === 'incomplete') return 'row-incomplete';
  return '';
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const haystack = [
      row.patientName,
      row.nhsNumber,
      row.practiceName
    ].map((v) => String(v || '').toLowerCase()).join(' ');
    if (!haystack.includes(term)) return false;
  }
  if (filters.status && row.status !== filters.status) return false;
  return true;
}

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

  if (key === 'dateAcknowledged') {
    const aEmpty = !av;
    const bEmpty = !bv;
    if (aEmpty && bEmpty) return 0;
    if (aEmpty) return 1;
    if (bEmpty) return -1;
    return String(av).localeCompare(String(bv)) * dir;
  }

  return String(av == null ? '' : av)
    .localeCompare(String(bv == null ? '' : bv)) * dir;
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
    th.scope = 'col';
    th.className = 'data-table-th';
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
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';
  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    const tint = rowTintClass(row);
    if (tint) tr.classList.add(tint);

    const dateClass = row.dateAcknowledged
      ? 'ack-date'
      : 'ack-date ack-date-empty';

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.patientName)}</td>
      <td class="data-table-td">${esc(row.nhsNumber)}</td>
      <td class="data-table-td"><span class="${dateClass}">${esc(row.dateAcknowledged || '—')}</span></td>
      <td class="data-table-td"><span class="completion-badge ${statusClass(row.status)}">${esc(statusLabel(row.status))}</span></td>
      <td class="data-table-td">${esc(row.practiceName)}</td>
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
    el.textContent = 'No patients to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} acknowledgements`;
  } else {
    el.textContent = `Showing ${shown} of ${total} acknowledgements`;
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
  const status = document.getElementById('filter-status');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (status) {
    status.addEventListener('change', () => {
      filters.status = status.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      if (search) search.value = '';
      if (status) status.value = '';
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
  patients = samplePatients.slice();
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
      );
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
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
