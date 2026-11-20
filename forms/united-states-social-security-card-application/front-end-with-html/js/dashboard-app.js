import { fetchApplications } from './api.js';
import { sampleApplications } from './data.js';

// Social Security card application (Form SS-5) - preparer dashboard (vanilla
// classic-script app).
//
// On boot we fetch the application list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + class dropdown + replacement-limit dropdown).
//
// This dashboard is a review tool. It surfaces the engine's classification,
// evidence-gap count, and replacement-limit status; it is not legal advice and
// is not an SSA decision.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').ApplicationRow[]} */
let applications = [];

const filters = {
  search: '',
  validity: '',   // '' | 'ready-to-submit' | 'incomplete' | 'evidence-missing' | 'not-eligible'
  referral: ''    // '' | 'yes' | 'no' (replacement limit reached)
};

// Default sort: applicant name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'applicantName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'applicantName',           label: 'Applicant' },
  { key: 'requestType',             label: 'Request' },
  { key: 'applicationClass',        label: 'Class' },
  { key: 'missingEvidenceCount',    label: 'Evidence Gaps' },
  { key: 'replacementLimitReached', label: 'Replacement Limit' },
  { key: 'preparerName',            label: 'Preparer' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'ready-to-submit': 0, 'evidence-missing': 1, 'incomplete': 2, 'not-eligible': 3 };

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

function validityClassName(cls) {
  if (cls === 'ready-to-submit') return 'risk-low';
  if (cls === 'incomplete' || cls === 'evidence-missing') return 'risk-moderate';
  if (cls === 'not-eligible') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'ready-to-submit') return 'Ready to submit';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'evidence-missing') return 'Evidence missing';
  if (cls === 'not-eligible') return 'Not eligible';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').ApplicationRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.applicantName.toLowerCase().includes(term) ||
      (row.requestType || '').toLowerCase().includes(term) ||
      (row.preparerName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.applicationClass !== filters.validity) return false;
  if (filters.referral) {
    const wantReferral = filters.referral === 'yes';
    if (Boolean(row.replacementLimitReached) !== wantReferral) return false;
  }
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

  if (key === 'applicationClass') {
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'replacementLimitReached' || key === 'missingEvidenceCount') {
    return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
  }

  // Default: string compare (applicantName, requestType, preparerName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return applications.filter(matchesFilters).slice().sort(compareRows);
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
    // Highlight rows that need attention: a not-eligible or incomplete application.
    if (row.applicationClass === 'not-eligible' || row.applicationClass === 'incomplete') {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.replacementLimitReached
      ? `<span class="risk-badge risk-high">Reached</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.applicantName)}</td>
      <td>${esc(row.requestType)}</td>
      <td><span class="risk-badge ${validityClassName(row.applicationClass)}">${esc(validityLabel(row.applicationClass))}</span></td>
      <td>${esc(row.missingEvidenceCount)}</td>
      <td>${referralBadge}</td>
      <td>${row.preparerName ? esc(row.preparerName) : '<span class="muted">Not recorded</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = applications.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No applications to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} applications`;
  } else {
    el.textContent = `Showing ${shown} of ${total} applications`;
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
  const validity = document.getElementById('filter-validity');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.validity = validity.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.referral = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadApplications() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  applications = sampleApplications;
  renderAll();

  try {
    const items = await fetchApplications();
    if (items && items.length > 0) {
      applications = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data - backend returned no applications.');
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
  loadApplications();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
