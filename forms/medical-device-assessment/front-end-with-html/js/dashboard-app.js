import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Medical Device Assessment - dashboard (vanilla ES module).
//
// Shows the sample rows built from examples/personas.json immediately, then
// tries the backend and replaces them only when it returns rows of the
// expected shape. Sortable columns, search and four filters.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = { search: '', cls: '', route: '', readiness: '', flags: '' };
const sortState = { key: 'date', direction: 'desc' };

const columns = [
  { key: 'date', label: 'Date' },
  { key: 'device', label: 'Device' },
  { key: 'deviceKind', label: 'Kind' },
  { key: 'computedClass', label: 'Computed' },
  { key: 'finalClass', label: 'Final class' },
  { key: 'conformityRoute', label: 'Conformity route' },
  { key: 'determiningRule', label: 'Determining rule' },
  { key: 'readiness', label: 'Readiness' },
  { key: 'flags', label: 'Flags' }
];

const classRank = { '': 0, I: 1, IIa: 2, IIb: 3, III: 4 };
const classBadge = { I: 'risk-low', IIa: 'risk-moderate', IIb: 'risk-high', III: 'risk-critical' };
const readinessBadge = { ready: 'risk-low', gaps: 'risk-high', blocked: 'risk-critical' };

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function finalLabel(row) {
  return row.finalClass ? `${row.finalClass}${row.classSuffix || ''}` : '—';
}

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const hit = [row.device, row.summary, row.determiningRule, row.deviceKind]
      .some((v) => String(v || '').toLowerCase().includes(term));
    if (!hit) return false;
  }
  if (filters.cls === 'none' && row.finalClass !== '') return false;
  if (filters.cls && filters.cls !== 'none' && row.finalClass !== filters.cls) return false;
  if (filters.route && row.conformityRoute !== filters.route) return false;
  if (filters.readiness && row.readiness !== filters.readiness) return false;
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

function compareRows(a, b) {
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const key = sortState.key;
  if (key === 'computedClass' || key === 'finalClass') {
    return ((classRank[a[key]] ?? 0) - (classRank[b[key]] ?? 0)) * dir;
  }
  if (key === 'flags') {
    return ((a.flags || []).length - (b.flags || []).length) * dir;
  }
  return String(a[key] ?? '').localeCompare(String(b[key] ?? '')) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
}

function renderTableHead() {
  const head = document.getElementById('assessments-table-head');
  head.innerHTML = '';
  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
    th.scope = 'col';
    th.dataset.column = col.key;
    let ariaSort = 'none';
    let indicator = '↕';
    if (sortState.key === col.key) {
      ariaSort = sortState.direction === 'asc' ? 'ascending' : 'descending';
      indicator = sortState.direction === 'asc' ? '↑' : '↓';
    }
    th.setAttribute('aria-sort', ariaSort);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sort-btn';
    btn.innerHTML = `<span>${esc(col.label)}</span><span class="sort-indicator" aria-hidden="true">${indicator}</span>`;
    btn.addEventListener('click', () => onSortClick(col.key));
    th.appendChild(btn);
    head.appendChild(th);
  }
}

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) return '<span class="flag-empty">—</span>';
  return `<div class="flag-list">${flags.map((f) => `<span class="flag-chip">${esc(f)}</span>`).join('')}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('assessments-table-body');
  const empty = document.getElementById('assessments-empty-message');
  const rows = visibleRows();
  body.innerHTML = '';
  if (empty) empty.hidden = rows.length !== 0;
  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.finalClass === 'III') tr.classList.add('row-critical');
    tr.innerHTML = `
      <td class="data-table-td"><span class="date-cell">${esc(row.date)}</span></td>
      <td class="data-table-td"><strong>${esc(row.device)}</strong></td>
      <td class="data-table-td">${esc(row.deviceKind || '—')}</td>
      <td class="data-table-td">${esc(row.computedClass || '—')}</td>
      <td class="data-table-td"><span class="risk-badge ${classBadge[row.finalClass] || ''}">${esc(finalLabel(row))}</span></td>
      <td class="data-table-td">${esc(row.conformityRoute || '—')}</td>
      <td class="data-table-td">${esc(row.determiningRule || '—')}</td>
      <td class="data-table-td"><span class="risk-badge ${readinessBadge[row.readiness] || ''}">${esc(row.readiness)}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>`;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  const total = assessments.length;
  const shown = visibleRows().length;
  el.textContent = total === 0 ? 'No assessments to display.' : `Showing ${shown} of ${total} assessments`;
}

function renderAll() {
  renderTableHead();
  renderTableBody();
  renderFilterCount();
  const clear = document.getElementById('filter-clear-btn');
  clear.hidden = !Object.values(filters).some((v) => v !== '');
}

function showStatusBanner(message) {
  const banner = document.getElementById('status-banner');
  banner.textContent = message;
  banner.hidden = false;
}

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    sortState.direction = key === 'date' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const map = [
    ['filter-search', 'search', 'input'],
    ['filter-class', 'cls', 'change'],
    ['filter-route', 'route', 'change'],
    ['filter-readiness', 'readiness', 'change'],
    ['filter-flags', 'flags', 'change']
  ];
  for (const [id, key, evt] of map) {
    const el = document.getElementById(id);
    el.addEventListener(evt, () => {
      filters[key] = el.value;
      renderAll();
    });
  }
  document.getElementById('filter-clear-btn').addEventListener('click', () => {
    for (const [id, key] of map) {
      filters[key] = '';
      document.getElementById(id).value = '';
    }
    renderAll();
  });
}

async function loadAssessments() {
  assessments = sampleAssessments;
  renderAll();
  try {
    const items = (await fetchAssessments()).filter((r) => r && typeof r === 'object' && 'finalClass' in r && 'device' in r);
    if (items.length > 0) {
      assessments = items;
      document.getElementById('status-banner').hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no assessments.');
    }
  } catch (err) {
    showStatusBanner('Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').');
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
