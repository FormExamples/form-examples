import { fetchLpas } from './api.js';
import { sampleLpas } from './data.js';

// LP1H case-manager dashboard — vanilla classic-script app.
//
// On boot we fetch LPAs from the backend; on any failure (or empty response)
// we fall back to sample data and show a small banner. The table is sortable
// (click any column header) and filterable (search box + validity, stage,
// jurisdiction, and decision-rule dropdowns).

/** @type {import('./types.js').LpaRow[]} */
let lpas = [];

const filters = {
  search: '',
  status: '',
  stage: '',
  jurisdiction: '',
  decision: '',
};

const sortState = { key: 'updatedAt', direction: 'desc' };

const columns = [
  { key: 'id', label: 'Reference' },
  { key: 'donorMaskedName', label: 'Donor' },
  { key: 'donorBirthYear', label: 'DOB year' },
  { key: 'jurisdiction', label: 'Jurisdiction' },
  { key: 'attorneyCount', label: 'Attorneys' },
  { key: 'decisionRule', label: 'Decision' },
  { key: 'lstChoice', label: 'LST' },
  { key: 'validityStatus', label: 'Validity' },
  { key: 'completenessScore', label: 'Complete' },
  { key: 'registrationStage', label: 'Stage' },
  { key: 'updatedAt', label: 'Updated' },
];

const statusRank = { 'ready-to-register': 0, 'needs-correction': 1, 'invalid': 2 };
const stageRank = {
  draft: 0,
  'awaiting-signatures': 1,
  'submitted-to-opg': 2,
  registered: 3,
  rejected: 4,
  revoked: 5,
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.stage !== '' ||
    filters.jurisdiction !== '' ||
    filters.decision !== ''
  );
}

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.donorMaskedName || '').toLowerCase().includes(term) ||
      (row.firedRules || []).some((r) => r.ruleId.toLowerCase().includes(term));
    if (!matches) return false;
  }
  if (filters.status && row.validityStatus !== filters.status) return false;
  if (filters.stage && row.registrationStage !== filters.stage) return false;
  if (filters.jurisdiction && row.jurisdiction !== filters.jurisdiction) return false;
  if (filters.decision && row.decisionRule !== filters.decision) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'validityStatus') {
    av = statusRank[av] ?? -1;
    bv = statusRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'registrationStage') {
    av = stageRank[av] ?? -1;
    bv = stageRank[bv] ?? -1;
    return (av - bv) * dir;
  }
  if (key === 'attorneyCount' || key === 'donorBirthYear' || key === 'completenessScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return lpas.filter(matchesFilters).slice().sort(compareRows);
}

function renderTableHead() {
  const head = document.getElementById('lpas-table-head');
  if (!head) return;
  head.innerHTML = '';
  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;
    let ariaSort = 'none';
    let indicator = '\u2195';
    if (sortState.key === col.key) {
      ariaSort = sortState.direction === 'asc' ? 'ascending' : 'descending';
      indicator = sortState.direction === 'asc' ? '\u2191' : '\u2193';
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

function renderRow(row) {
  const tr = document.createElement('tr');
  if (row.validityStatus === 'invalid') tr.classList.add('row-invalid');

  const attorneyDisplay =
    row.replacementAttorneyCount > 0
      ? `${row.attorneyCount} + ${row.replacementAttorneyCount}r`
      : `${row.attorneyCount}`;

  const firedSummary =
    row.firedRules.length === 0
      ? ''
      : `<span class="fired-rules-summary">${row.firedRules
          .slice(0, 2)
          .map((r) => `<span class="${esc(r.severity)}">${esc(r.ruleId)}</span>`)
          .join(' ')}${row.firedRules.length > 2 ? ` +${row.firedRules.length - 2}` : ''}</span>`;

  tr.innerHTML = `
    <td class="ref-cell">${esc(row.id)}</td>
    <td><strong>${esc(row.donorMaskedName)}</strong></td>
    <td class="numeric-cell">${esc(row.donorBirthYear)}</td>
    <td>${esc(row.jurisdiction)}</td>
    <td class="numeric-cell">${esc(attorneyDisplay)}</td>
    <td>${esc(row.decisionRule)}</td>
    <td>${row.lstChoice ? esc(row.lstChoice) : '—'}</td>
    <td>
      <span class="status-badge status-${esc(row.validityStatus)}">${esc(row.validityStatus)}</span>
      ${firedSummary}
    </td>
    <td class="numeric-cell">${esc(row.completenessScore)}%</td>
    <td><span class="stage-badge">${esc(row.registrationStage)}</span></td>
    <td class="numeric-cell">${esc(row.updatedAt.slice(0, 10))}</td>
  `;
  return tr;
}

function renderTableBody() {
  const body = document.getElementById('lpas-table-body');
  const empty = document.getElementById('lpas-empty-message');
  if (!body) return;
  const rows = visibleRows();
  body.innerHTML = '';
  if (empty) empty.hidden = rows.length > 0;
  for (const row of rows) body.appendChild(renderRow(row));
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = lpas.length;
  const shown = visibleRows().length;
  if (total === 0) el.textContent = 'No LPAs to display.';
  else if (shown === total) el.textContent = `Showing ${total} of ${total} LPAs`;
  else el.textContent = `Showing ${shown} of ${total} LPAs (filtered)`;
  const clearBtn = document.getElementById('filter-clear-btn');
  if (clearBtn) clearBtn.hidden = !hasActiveFilters();
}

function rerender() {
  renderTableHead();
  renderTableBody();
  renderFilterCount();
}

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    sortState.direction = 'asc';
  }
  rerender();
}

function bindFilterControls() {
  const search = document.getElementById('filter-search');
  const status = document.getElementById('filter-status');
  const stage = document.getElementById('filter-stage');
  const juris = document.getElementById('filter-jurisdiction');
  const decision = document.getElementById('filter-decision');
  const clear = document.getElementById('filter-clear-btn');

  if (search) search.addEventListener('input', (e) => { filters.search = e.target.value; rerender(); });
  if (status) status.addEventListener('change', (e) => { filters.status = e.target.value; rerender(); });
  if (stage) stage.addEventListener('change', (e) => { filters.stage = e.target.value; rerender(); });
  if (juris) juris.addEventListener('change', (e) => { filters.jurisdiction = e.target.value; rerender(); });
  if (decision) decision.addEventListener('change', (e) => { filters.decision = e.target.value; rerender(); });
  if (clear) {
    clear.addEventListener('click', () => {
      filters.search = filters.status = filters.stage = filters.jurisdiction = filters.decision = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (stage) stage.value = '';
      if (juris) juris.value = '';
      if (decision) decision.value = '';
      rerender();
    });
  }
}

function showFallbackBanner(message) {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.hidden = false;
}

async function boot() {
  bindFilterControls();
  try {
    lpas = await fetchLpas();
    if (!lpas.length) {
      lpas = sampleLpas;
      showFallbackBanner('Backend returned no LPAs; showing sample data.');
    }
  } catch (err) {
    lpas = sampleLpas;
    showFallbackBanner('Backend unreachable; showing sample data.');
  }
  rerender();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
