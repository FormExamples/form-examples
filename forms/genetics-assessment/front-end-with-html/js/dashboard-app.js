import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// Genetics Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the proband list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + risk-level dropdown + presenting-concern dropdown +
// recommended-testing dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  risk: '',
  concern: '',
  testing: ''
};

// Default sort: risk level descending. High-risk probands surface at the
// top of the list, with the critical-row emphasis style highlighting them
// for the clinician.
const sortState = {
  key: 'riskLevel',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',           label: 'NHS Number' },
  { key: 'patientName',         label: 'Proband' },
  { key: 'riskLevel',           label: 'Risk Level' },
  { key: 'presentingConcern',   label: 'Presenting Concern' },
  { key: 'manchesterScore',     label: 'Manchester' },
  { key: 'tyrerCuzickLifetime', label: 'Tyrer-Cuzick %' },
  { key: 'bethesdaResult',      label: 'Bethesda' },
  { key: 'premm5Percent',       label: 'PREMM5 %' },
  { key: 'recommendedTesting',  label: 'Recommended Testing' }
];

// Rank used when sorting the riskLevel column so 'Low' is always less than
// 'High' regardless of locale.
const riskRank = {
  'Low': 0,
  'Moderate': 1,
  'High': 2
};

// Rank used when sorting the recommendedTesting column. Ordered roughly
// from least- to most-intensive intervention.
const testingRank = {
  'No testing indicated': 0,
  'Carrier screening': 1,
  'Predictive testing': 2,
  'Targeted neurogenetic panel': 3,
  'Whole-exome sequencing': 4,
  'Lynch / MMR panel': 5,
  'BRCA1/2 panel': 6,
  'HBOC extended panel': 7
};

// Rank used when sorting the bethesdaResult column. 'Met' is the most
// clinically significant finding so it sorts highest by default.
const bethesdaRank = {
  'N/A': 0,
  'Not Met': 1,
  'Met': 2
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

/** Slugify a label into a CSS-friendly suffix.
 *  e.g. "BRCA / HBOC" -> "brca-hboc", "Whole-exome sequencing" -> "whole-exome-sequencing"
 */
function slug(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function concernClass(label) {
  if (!label) return '';
  return 'concern-' + slug(label);
}

function testingClass(label) {
  if (!label) return '';
  return 'testing-' + slug(label);
}

function bethesdaClass(label) {
  if (label === 'Met') return 'bethesda-met';
  if (label === 'Not Met') return 'bethesda-not-met';
  return 'bethesda-na';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.concern !== '' ||
    filters.testing !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PatientRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.riskLevel !== filters.risk) {
    return false;
  }
  if (filters.concern && row.presentingConcern !== filters.concern) {
    return false;
  }
  if (filters.testing && row.recommendedTesting !== filters.testing) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numeric scores compare directly with `null` values
 * sorting last; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskLevel') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'recommendedTesting') {
    av = testingRank[av] ?? -1;
    bv = testingRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'bethesdaResult') {
    av = bethesdaRank[av] ?? -1;
    bv = bethesdaRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (
    key === 'manchesterScore' ||
    key === 'tyrerCuzickLifetime' ||
    key === 'premm5Percent'
  ) {
    // null (non-applicable) scores always sort last regardless of
    // direction so they don't crowd the high-priority view.
    if (av === null && bv === null) return 0;
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    return (av - bv) * dir;
  }

  // Default: string compare (nhsNumber, patientName, presentingConcern)
  return String(av).localeCompare(String(bv)) * dir;
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

/** Manchester Score cell: emphasise >=20 (strong BRCA-testing justification). */
function renderManchesterCell(row) {
  if (row.manchesterScore === null || row.manchesterScore === undefined) {
    return '<span class="score-na" aria-label="Not applicable">N/A</span>';
  }
  const cls = row.manchesterScore >= 20
    ? 'manchester-score is-high'
    : 'manchester-score';
  return `<span class="${cls}">${esc(row.manchesterScore)}</span>`;
}

/** Tyrer-Cuzick lifetime % cell: >=30 high, 17-29 moderate, otherwise plain. */
function renderTyrerCuzickCell(row) {
  const v = row.tyrerCuzickLifetime;
  if (v === null || v === undefined) {
    return '<span class="score-na" aria-label="Not applicable">N/A</span>';
  }
  let cls = 'tyrer-cuzick-score';
  if (v >= 30) cls += ' is-high';
  else if (v >= 17) cls += ' is-moderate';
  // Display with one decimal place.
  return `<span class="${cls}">${v.toFixed(1)}%</span>`;
}

/** Bethesda criteria cell. */
function renderBethesdaCell(row) {
  const v = row.bethesdaResult;
  return `<span class="bethesda-badge ${bethesdaClass(v)}">${esc(v)}</span>`;
}

/** PREMM5 cell: >=5% indicates genetic-evaluation threshold (per ACG). */
function renderPremm5Cell(row) {
  const v = row.premm5Percent;
  if (v === null || v === undefined) {
    return '<span class="score-na" aria-label="Not applicable">N/A</span>';
  }
  const cls = v >= 5 ? 'premm5-score is-high' : 'premm5-score';
  return `<span class="${cls}">${v.toFixed(1)}%</span>`;
}

function renderTableBody() {
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
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
    if (row.riskLevel === 'High') {
      tr.classList.add('row-high-risk');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td><span class="risk-badge ${riskClass(row.riskLevel)}">${esc(row.riskLevel)}</span></td>
      <td><span class="concern-pill ${concernClass(row.presentingConcern)}">${esc(row.presentingConcern)}</span></td>
      <td>${renderManchesterCell(row)}</td>
      <td>${renderTyrerCuzickCell(row)}</td>
      <td>${renderBethesdaCell(row)}</td>
      <td>${renderPremm5Cell(row)}</td>
      <td><span class="testing-pill ${testingClass(row.recommendedTesting)}">${esc(row.recommendedTesting)}</span></td>
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
    el.textContent = `Showing ${total} of ${total} patients`;
  } else {
    el.textContent = `Showing ${shown} of ${total} patients`;
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
    // Categorical / numeric severity columns default to descending so the
    // most clinically significant rows surface first; identifier and
    // free-text columns default to ascending.
    const descByDefault =
      key === 'riskLevel' ||
      key === 'recommendedTesting' ||
      key === 'bethesdaResult' ||
      key === 'manchesterScore' ||
      key === 'tyrerCuzickLifetime' ||
      key === 'premm5Percent';
    sortState.direction = descByDefault ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const risk = document.getElementById('filter-risk');
  const concern = document.getElementById('filter-concern');
  const testing = document.getElementById('filter-testing');
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
  if (concern) {
    concern.addEventListener('change', () => {
      filters.concern = concern.value;
      renderAll();
    });
  }
  if (testing) {
    testing.addEventListener('change', () => {
      filters.testing = testing.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.concern = '';
      filters.testing = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (concern) concern.value = '';
      if (testing) testing.value = '';
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
  patients = samplePatients;
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
      );
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
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
