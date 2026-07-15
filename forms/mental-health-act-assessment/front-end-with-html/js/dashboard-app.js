import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Mental Health Act Assessment — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + completeness-status dropdown + urgency dropdown).
//
// This dashboard is a governance / review tool. It surfaces the engine's
// legal-completeness status, recommended-section classification, and urgency; it
// makes NO automated detention decision.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  status: '',   // '' | 'valid' | 'incomplete'
  urgency: ''   // '' | 'routine' | 'urgent' | 'emergency'
};

// Default sort: person name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'personName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',        label: 'Patient ID' },
  { key: 'personName',               label: 'Person Name' },
  { key: 'recommendedSectionClass',  label: 'Recommended Section' },
  { key: 'completenessStatus',       label: 'Completeness' },
  { key: 'urgency',                  label: 'Urgency' },
  { key: 'amhpName',                 label: 'AMHP' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const statusRank = { 'valid': 0, 'incomplete': 1 };
const urgencyRank = { 'routine': 0, 'urgent': 1, 'emergency': 2 };
const sectionRank = {
  'section-2': 0, 'section-3': 1, 'section-4': 2,
  'section-5-2': 3, 'section-5-4': 4, 'section-136': 5, 'none': 6
};

// ----------------------------------------------------------------------
// Label / class helpers (dashboard-local; no dependency on the form engine)
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
  if (status === 'valid') return 'risk-low';
  if (status === 'incomplete') return 'risk-high';
  return '';
}

function statusLabel(status) {
  if (status === 'valid') return 'Valid';
  if (status === 'incomplete') return 'Incomplete';
  return 'N/A';
}

function urgencyClassName(value) {
  if (value === 'routine') return 'risk-low';
  if (value === 'urgent') return 'risk-moderate';
  if (value === 'emergency') return 'risk-high';
  return '';
}

function urgencyLabel(value) {
  if (value === 'routine') return 'Routine';
  if (value === 'urgent') return 'Urgent';
  if (value === 'emergency') return 'Emergency';
  return 'N/A';
}

function sectionLabel(cls) {
  switch (cls) {
    case 'section-2': return 'Section 2';
    case 'section-3': return 'Section 3';
    case 'section-4': return 'Section 4';
    case 'section-5-2': return 'Section 5(2)';
    case 'section-5-4': return 'Section 5(4)';
    case 'section-136': return 'Section 136';
    case 'none': return 'None';
    default: return 'N/A';
  }
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.status !== '' ||
    filters.urgency !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').AssessmentRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.personName.toLowerCase().includes(term) ||
      (row.amhpName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.status && row.completenessStatus !== filters.status) return false;
  if (filters.urgency && row.urgency !== filters.urgency) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. Ranked columns use their rank
 * tables; everything else uses a locale-aware string compare with empty values
 * sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'completenessStatus') {
    return ((statusRank[av] ?? 99) - (statusRank[bv] ?? 99)) * dir;
  }
  if (key === 'urgency') {
    return ((urgencyRank[av] ?? 99) - (urgencyRank[bv] ?? 99)) * dir;
  }
  if (key === 'recommendedSectionClass') {
    return ((sectionRank[av] ?? 99) - (sectionRank[bv] ?? 99)) * dir;
  }

  // Default: string compare (patientIdentifier, personName, amhpName). Empty
  // values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return assessments.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: incomplete documentation or an
    // emergency-urgency assessment.
    if (row.completenessStatus === 'incomplete' || row.urgency === 'emergency') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.personName)}</td>
      <td><span class="class-cell">${esc(sectionLabel(row.recommendedSectionClass))}</span></td>
      <td><span class="risk-badge ${statusClass(row.completenessStatus)}">${esc(statusLabel(row.completenessStatus))}</span></td>
      <td><span class="risk-badge ${urgencyClassName(row.urgency)}">${esc(urgencyLabel(row.urgency))}</span></td>
      <td>${row.amhpName ? esc(row.amhpName) : '<span class="muted">Not recorded</span>'}</td>
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const status = document.getElementById('filter-status');
  const urgency = document.getElementById('filter-urgency');
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
  if (urgency) {
    urgency.addEventListener('change', () => {
      filters.urgency = urgency.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.status = '';
      filters.urgency = '';
      if (search) search.value = '';
      if (status) status.value = '';
      if (urgency) urgency.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAssessments() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  assessments = sampleAssessments;
  renderAll();

  try {
    const items = await fetchAssessments();
    if (items && items.length > 0) {
      assessments = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no assessments.');
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
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
