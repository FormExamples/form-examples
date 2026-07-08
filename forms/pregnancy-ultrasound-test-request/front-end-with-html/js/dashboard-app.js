// Pregnancy Ultrasound Test Request — vetting dashboard
// (vanilla classic-script app).
//
// On boot we fetch the request list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + triage-tier dropdown + appropriateness-band dropdown +
// window-fit dropdown + safety-flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PregnancyUltrasoundTestRequestDashboard`.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchRequests,
  sampleRequests
} = window.PregnancyUltrasoundTestRequestDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').RequestRow[]} */
let requests = [];

const filters = {
  search: '',
  triage: '',
  band: '',
  window: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent referral first.
const sortState = {
  key: 'referralDate',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhs',                 label: 'NHS Number' },
  { key: 'patient',            label: 'Patient' },
  { key: 'scanType',           label: 'Scan Type' },
  { key: 'indication',         label: 'Indication' },
  { key: 'gestationalAge',     label: 'GA' },
  { key: 'appropriatenessBand', label: 'Appropriateness' },
  { key: 'windowFit',          label: 'Window' },
  { key: 'triageTier',         label: 'Triage' },
  { key: 'completenessPercent', label: 'Complete' },
  { key: 'clinician',          label: 'Clinician' },
  { key: 'referralDate',       label: 'Referral Date' },
  { key: 'flags',              label: 'Flags' }
];

// Ranks so categorical columns sort meaningfully regardless of locale.
const bandRank = {
  'usually-appropriate': 0,
  'may-be-appropriate': 1,
  'usually-not-appropriate': 2
};

const windowRank = {
  'appropriate': 0,
  'borderline': 1,
  'outside-window': 2
};

const triageRank = {
  'routine': 0,
  'soon': 1,
  'urgent': 2,
  'emergency': 3
};

// Gestational-age sort: convert "W+D" into total days.
function gaToDays(ga) {
  if (!ga) return -1;
  const m = String(ga).match(/^(\d+)(?:\+(\d+))?$/);
  if (!m) return -1;
  return Number(m[1]) * 7 + (m[2] ? Number(m[2]) : 0);
}

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

/** Title-case a kebab-case value for display. */
function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function bandClass(band) {
  return band ? 'band-' + String(band) : '';
}

function windowClass(fit) {
  return fit ? 'window-' + String(fit) : '';
}

function triageClass(tier) {
  return tier ? 'tier-' + String(tier) : '';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.triage !== '' ||
    filters.band !== '' ||
    filters.window !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').RequestRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.nhs || '').toLowerCase().includes(term) ||
      String(row.patient || '').toLowerCase().includes(term) ||
      String(row.indication || '').toLowerCase().includes(term) ||
      String(row.scanType || '').toLowerCase().includes(term) ||
      String(row.clinician || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.triage && row.triageTier !== filters.triage) return false;
  if (filters.band && row.appropriatenessBand !== filters.band) return false;
  if (filters.window && row.windowFit !== filters.window) return false;
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use their
 * rank tables; numbers compare directly; everything else uses a locale-aware
 * string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'appropriatenessBand') {
    return ((bandRank[av] ?? -1) - (bandRank[bv] ?? -1)) * dir;
  }
  if (key === 'windowFit') {
    return ((windowRank[av] ?? -1) - (windowRank[bv] ?? -1)) * dir;
  }
  if (key === 'triageTier') {
    return ((triageRank[av] ?? -1) - (triageRank[bv] ?? -1)) * dir;
  }
  if (key === 'completenessPercent') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }
  if (key === 'gestationalAge') {
    return (gaToDays(av) - gaToDays(bv)) * dir;
  }
  if (key === 'flags') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }
  // Default: string compare (nhs, patient, scanType, indication, clinician,
  // referralDate).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return requests.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('requests-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
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

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">—</span>';
  }
  const chips = flags
    .map((f) => `<span class="flag-chip">${esc(titleCase(f))}</span>`)
    .join('');
  return `<div class="flag-list">${chips}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('requests-table-body');
  const empty = document.getElementById('requests-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.triageTier === 'emergency') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.nhs)}</td>
      <td class="data-table-td"><strong>${esc(row.patient)}</strong></td>
      <td class="data-table-td">${esc(titleCase(row.scanType))}</td>
      <td class="data-table-td">${esc(titleCase(row.indication))}</td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.gestationalAge || '—')}</span></td>
      <td class="data-table-td"><span class="band-badge ${bandClass(row.appropriatenessBand)}">${esc(titleCase(row.appropriatenessBand))}</span></td>
      <td class="data-table-td"><span class="window-badge ${windowClass(row.windowFit)}">${esc(titleCase(row.windowFit))}</span></td>
      <td class="data-table-td"><span class="tier-badge ${triageClass(row.triageTier)}">${esc(titleCase(row.triageTier))}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.completenessPercent)}%</span></td>
      <td class="data-table-td">${esc(row.clinician)}</td>
      <td class="data-table-td"><span class="date-cell">${esc(row.referralDate)}</span></td>
      <td class="data-table-td">${renderFlagsCell(row.flags)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = requests.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No requests to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} requests`;
  } else {
    el.textContent = `Showing ${shown} of ${total} requests`;
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
    // Referral-date column defaults to descending (most recent first);
    // everything else defaults to ascending.
    sortState.direction = key === 'referralDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const triage = document.getElementById('filter-triage');
  const band = document.getElementById('filter-band');
  const windowSel = document.getElementById('filter-window');
  const flags = document.getElementById('filter-flags');
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
  if (band) {
    band.addEventListener('change', () => {
      filters.band = band.value;
      renderAll();
    });
  }
  if (windowSel) {
    windowSel.addEventListener('change', () => {
      filters.window = windowSel.value;
      renderAll();
    });
  }
  if (flags) {
    flags.addEventListener('change', () => {
      filters.flags = flags.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.triage = '';
      filters.band = '';
      filters.window = '';
      filters.flags = '';
      if (search) search.value = '';
      if (triage) triage.value = '';
      if (band) band.value = '';
      if (windowSel) windowSel.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadRequests() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  requests = sampleRequests;
  renderAll();

  try {
    const items = await fetchRequests();
    if (items && items.length > 0) {
      requests = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no requests.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadRequests();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
