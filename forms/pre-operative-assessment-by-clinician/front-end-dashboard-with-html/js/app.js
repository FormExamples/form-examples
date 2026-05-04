// Pre-operative Assessment by Clinician - clinician dashboard
// (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + composite-risk dropdown + ASA-grade dropdown +
// urgency dropdown + safety-flags dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.PreOperativeAssessmentByClinicianDashboard`.
// Pulling them off here keeps the rest of this file referring to short local
// names. The whole file is wrapped in an IIFE so its top-level identifiers
// do not leak to the global scope.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.PreOperativeAssessmentByClinicianDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  risk: '',
  asa: '',
  urgency: '',
  flags: '' // '', 'yes', 'no'
};

// Default sort: most recent date first, so the latest assessments appear at
// the top of the dashboard. Critical cases are also visually highlighted via
// the row-critical row class.
const sortState = {
  key: 'date',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'date',      label: 'Date' },
  { key: 'patient',   label: 'Patient' },
  { key: 'nhs',       label: 'NHS Number' },
  { key: 'procedure', label: 'Procedure' },
  { key: 'urgency',   label: 'Urgency' },
  { key: 'asa',       label: 'ASA' },
  { key: 'rcri',      label: 'RCRI' },
  { key: 'stopbang',  label: 'STOP-BANG' },
  { key: 'cfs',       label: 'CFS' },
  { key: 'composite', label: 'Risk' },
  { key: 'flags',     label: 'Flags' },
  { key: 'clinician', label: 'Clinician' }
];

// Rank used when sorting the composite column so 'low' is always less than
// 'critical' regardless of locale.
const riskRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'critical': 3
};

// Rank used when sorting the urgency column so 'elective' is always less
// than 'immediate'.
const urgencyRank = {
  'elective': 0,
  'urgent': 1,
  'emergency': 2,
  'immediate': 3
};

// Rank used when sorting the asa column. ASA is a Roman-numeral string so
// the ordinal rank avoids accidental lexicographic comparison.
const asaRank = {
  'I': 1,
  'II': 2,
  'III': 3,
  'IV': 4,
  'V': 5,
  'VI': 6
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

function asaClass(grade) {
  if (!grade) return '';
  return 'asa-' + String(grade).toLowerCase();
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.asa !== '' ||
    filters.urgency !== '' ||
    filters.flags !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').AssessmentRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.nhs || '').toLowerCase().includes(term) ||
      String(row.patient || '').toLowerCase().includes(term) ||
      String(row.procedure || '').toLowerCase().includes(term) ||
      String(row.clinician || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.composite !== filters.risk) {
    return false;
  }
  if (filters.asa && row.asa !== filters.asa) {
    return false;
  }
  if (filters.urgency && row.urgency !== filters.urgency) {
    return false;
  }
  const hasFlags = Array.isArray(row.flags) && row.flags.length > 0;
  if (filters.flags === 'yes' && !hasFlags) return false;
  if (filters.flags === 'no' && hasFlags) return false;
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

  if (key === 'composite') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'urgency') {
    av = urgencyRank[av] ?? -1;
    bv = urgencyRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'asa') {
    av = asaRank[av] ?? -1;
    bv = asaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'rcri' || key === 'stopbang') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'cfs') {
    // null CFS values sort last regardless of direction so unscored rows
    // never crowd the top of either ascending or descending sorts.
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av - bv) * dir;
  }

  if (key === 'flags') {
    const an = Array.isArray(av) ? av.length : 0;
    const bn = Array.isArray(bv) ? bv.length : 0;
    return (an - bn) * dir;
  }

  // Default: string compare (date, patient, nhs, procedure, clinician).
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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

function renderFlagsCell(flags) {
  if (!Array.isArray(flags) || flags.length === 0) {
    return '<span class="flag-empty">\u2014</span>';
  }
  const chips = flags
    .map((f) => `<span class="flag-chip">${esc(f)}</span>`)
    .join('');
  return `<div class="flag-list">${chips}</div>`;
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
    if (row.composite === 'critical') {
      tr.classList.add('row-critical');
    }

    const cfsDisplay =
      row.cfs === null || row.cfs === undefined
        ? '<span class="numeric-muted">\u2014</span>'
        : esc(row.cfs);

    tr.innerHTML = `
      <td><span class="date-cell">${esc(row.date)}</span></td>
      <td><strong>${esc(row.patient)}</strong></td>
      <td>${esc(row.nhs)}</td>
      <td>${esc(row.procedure)}</td>
      <td><span class="urgency-badge ${urgencyClass(row.urgency)}">${esc(row.urgency)}</span></td>
      <td><span class="asa-badge ${asaClass(row.asa)}">${esc(row.asa)}</span></td>
      <td><span class="numeric-cell">${esc(row.rcri)}</span></td>
      <td><span class="numeric-cell">${esc(row.stopbang)}</span></td>
      <td><span class="numeric-cell">${cfsDisplay}</span></td>
      <td><span class="risk-badge ${riskClass(row.composite)}">${esc(row.composite)}</span></td>
      <td>${renderFlagsCell(row.flags)}</td>
      <td>${esc(row.clinician)}</td>
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
    el.textContent = 'No assessments to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} assessments`;
  } else {
    el.textContent = `Showing ${shown} of ${total} assessments`;
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
  const asa = document.getElementById('filter-asa');
  const urgency = document.getElementById('filter-urgency');
  const flags = document.getElementById('filter-flags');
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
  if (asa) {
    asa.addEventListener('change', () => {
      filters.asa = asa.value;
      renderAll();
    });
  }
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
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
      filters.risk = '';
      filters.asa = '';
      filters.urgency = '';
      filters.flags = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (asa) asa.value = '';
      if (urgency) urgency.value = '';
      if (flags) flags.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
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
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
