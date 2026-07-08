// UK LP1F case dashboard (vanilla classic-script app).
//
// On boot we fetch the LPA list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// composite-risk dropdown + decision-mode dropdown + validity-band dropdown +
// blocker dropdown). Validity band and composite risk are produced by the
// shared validation engine, so the dashboard and the wizard's report stay
// aligned.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.UkLpaFinancialDecisionsDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak to the global
// scope.
(function () {
'use strict';
const { fetchLpas, sampleRows } = window.UkLpaFinancialDecisionsDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').DashboardRow[]} */
let rows = [];

const filters = {
  search: '',
  risk: '',
  mode: '',
  band: '',
  blockers: '' // '', 'yes', 'no'
};

const sortState = { key: 'donorName', direction: 'asc' };

const columns = [
  { key: 'donorName',        label: 'Donor' },
  { key: 'attorneyCount',    label: 'Attorneys' },
  { key: 'decisionMode',     label: 'Decision Mode' },
  { key: 'whenAttorneysCanAct', label: 'When Can Act' },
  { key: 'replacementAttorneyCount', label: 'Replacements' },
  { key: 'peopleToNotifyCount', label: 'Notify' },
  { key: 'validityBand',     label: 'Validity' },
  { key: 'compositeRisk',    label: 'Risk' },
  { key: 'opgStatus',        label: 'OPG Status' },
  { key: 'createdAt',        label: 'Created' },
  { key: 'firedRuleIds',     label: 'Blockers' }
];

const riskRank = { low: 0, moderate: 1, high: 2, critical: 3 };
const bandRank = {
  draft: 0,
  ready_for_signing: 1,
  partially_signed: 2,
  fully_signed: 3,
  ready_for_registration: 4,
  submitted: 5,
  registered: 6,
  rejected: 7
};

// ----------------------------------------------------------------------
// Label helpers (self-contained; dashboard does not load types.js)
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function bandLabel(band) {
  if (!band) return '—';
  return String(band).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function decisionModeLabel(mode) {
  switch (mode) {
    case 'single_attorney':       return 'Single attorney';
    case 'jointly_and_severally': return 'Jointly and severally';
    case 'jointly':               return 'Jointly';
    case 'mixed':                 return 'Mixed';
    default:                      return '—';
  }
}

function whenLabel(when) {
  switch (when) {
    case 'as_soon_as_registered': return 'As soon as registered';
    case 'only_when_no_capacity': return 'Only when no capacity';
    default:                      return '—';
  }
}

function riskLabel(risk) {
  return risk ? risk.charAt(0).toUpperCase() + risk.slice(1) : '—';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.mode !== '' ||
    filters.band !== '' ||
    filters.blockers !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.donorName || '').toLowerCase().includes(term) ||
      String(row.opgReferenceNumber || '').toLowerCase().includes(term) ||
      String(row.opgStatus || '').toLowerCase().includes(term) ||
      (row.firedRuleIds || []).join(' ').toLowerCase().includes(term) ||
      (row.flagIds || []).join(' ').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.compositeRisk !== filters.risk) return false;
  if (filters.mode && row.decisionMode !== filters.mode) return false;
  if (filters.band && row.validityBand !== filters.band) return false;
  const hasBlockers = Array.isArray(row.firedRuleIds) && row.firedRuleIds.length > 0;
  if (filters.blockers === 'yes' && !hasBlockers) return false;
  if (filters.blockers === 'no' && hasBlockers) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (key === 'compositeRisk') {
    return ((riskRank[av] ?? -1) - (riskRank[bv] ?? -1)) * dir;
  }
  if (key === 'validityBand' || key === 'opgStatus') {
    return ((bandRank[av] ?? -1) - (bandRank[bv] ?? -1)) * dir;
  }
  if (key === 'attorneyCount' || key === 'replacementAttorneyCount' || key === 'peopleToNotifyCount') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'firedRuleIds') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return rows.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('lpa-table-head');
  if (!head) return;
  head.innerHTML = '';
  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '↕';
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') { ariaSort = 'ascending'; indicator = '↑'; }
      else { ariaSort = 'descending'; indicator = '↓'; }
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

function renderBlockersCell(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return '<span class="flag-empty">—</span>';
  }
  return `<div class="flag-list">${ids
    .map((id) => `<span class="flag-chip">${esc(id)}</span>`)
    .join('')}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('lpa-table-body');
  const empty = document.getElementById('lpa-empty-message');
  if (!body) return;

  const list = visibleRows();
  body.innerHTML = '';
  if (empty) empty.hidden = list.length !== 0;

  for (const row of list) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.compositeRisk === 'critical') tr.classList.add('row-critical');

    tr.innerHTML = `
      <td class="data-table-td"><strong>${esc(row.donorName)}</strong></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.attorneyCount)}</span></td>
      <td class="data-table-td">${esc(decisionModeLabel(row.decisionMode))}</td>
      <td class="data-table-td">${esc(whenLabel(row.whenAttorneysCanAct))}</td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.replacementAttorneyCount)}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.peopleToNotifyCount)}</span></td>
      <td class="data-table-td"><span class="band-badge band-${esc(row.validityBand)}">${esc(bandLabel(row.validityBand))}</span></td>
      <td class="data-table-td"><span class="risk-badge risk-${esc(row.compositeRisk)}">${esc(riskLabel(row.compositeRisk))}</span></td>
      <td class="data-table-td"><span class="band-badge band-${esc(row.opgStatus)}">${esc(bandLabel(row.opgStatus))}</span></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.createdAt)}</span></td>
      <td class="data-table-td">${renderBlockersCell(row.firedRuleIds)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = rows.length;
  const shown = visibleRows().length;
  if (total === 0) el.textContent = 'No LPAs to display.';
  else if (shown === total) el.textContent = `Showing ${total} of ${total} LPAs`;
  else el.textContent = `Showing ${shown} of ${total} LPAs`;
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
    sortState.direction = key === 'createdAt' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const mode = document.getElementById('filter-mode');
  const band = document.getElementById('filter-band');
  const blockers = document.getElementById('filter-blockers');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) search.addEventListener('input', () => { filters.search = search.value; renderAll(); });
  if (risk) risk.addEventListener('change', () => { filters.risk = risk.value; renderAll(); });
  if (mode) mode.addEventListener('change', () => { filters.mode = mode.value; renderAll(); });
  if (band) band.addEventListener('change', () => { filters.band = band.value; renderAll(); });
  if (blockers) blockers.addEventListener('change', () => { filters.blockers = blockers.value; renderAll(); });
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = ''; filters.risk = ''; filters.mode = ''; filters.band = ''; filters.blockers = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (mode) mode.value = '';
      if (band) band.value = '';
      if (blockers) blockers.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRows() {
  rows = sampleRows;
  renderAll();
  try {
    const items = await fetchLpas();
    if (items && items.length > 0) {
      rows = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no LPAs.');
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
  loadRows();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
