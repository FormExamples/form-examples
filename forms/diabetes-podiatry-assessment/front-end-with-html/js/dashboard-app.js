import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Diabetes Podiatry Assessment — clinician dashboard (vanilla ES module app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + overall-risk dropdown + review-pathway dropdown + referral
// dropdown + urgent dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  risk: '',     // '' | overall risk category value
  pathway: '',  // '' | review pathway value
  referral: '', // '' | referral value
  urgent: ''    // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',    label: 'Patient ID' },
  { key: 'patientName',          label: 'Patient Name' },
  { key: 'assessedAt',           label: 'Assessed' },
  { key: 'overallRisk',          label: 'Overall Risk' },
  { key: 'reviewPathway',        label: 'Review Pathway' },
  { key: 'referral',             label: 'Referral' },
  { key: 'reviewIntervalMonths', label: 'Review Interval' }
];

// Rank used when sorting the overall-risk column, ordered low-to-high
// clinical severity so the most urgent results cluster together.
const riskRank = {
  'low': 0,
  'moderate': 1,
  'high': 2,
  'active-urgent': 3
};

// Rank used when sorting the review-pathway column, ordered routine (low) to
// urgent (high) so the most urgent pathways cluster together.
const pathwayRank = {
  'annual-review': 0,
  'moderate-risk-review': 1,
  'high-risk-review': 2,
  'urgent-mdt-referral': 3
};

const riskLabels = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High',
  'active-urgent': 'Active / urgent'
};

const pathwayLabels = {
  'urgent-mdt-referral': 'Urgent MDT referral',
  'high-risk-review': 'High-risk review',
  'moderate-risk-review': 'Moderate-risk review',
  'annual-review': 'Annual review'
};

const referralLabels = {
  'none': 'None',
  'foot-protection-service': 'Foot protection service',
  'multidisciplinary-foot-team': 'Multidisciplinary foot team',
  'urgent-mdt': 'Urgent MDT'
};

// Overall risk → shared risk palette class for the badge.
const riskClassMap = {
  'low': 'risk-low',
  'moderate': 'risk-moderate',
  'high': 'risk-high',
  'active-urgent': 'risk-critical'
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

function riskLabel(risk) {
  return riskLabels[risk] || risk || 'N/A';
}

function riskClass(risk) {
  return riskClassMap[risk] || '';
}

function pathwayLabel(pathway) {
  return pathwayLabels[pathway] || pathway || 'N/A';
}

function referralLabel(referral) {
  return referralLabels[referral] || referral || 'N/A';
}

function intervalLabel(months) {
  if (months === 1) return '1 month';
  if (months === 3) return '3 months';
  if (months === 6) return '6 months';
  if (months === 12) return '12 months';
  return 'Urgent (no interval)';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.risk !== '' ||
    filters.pathway !== '' ||
    filters.referral !== '' ||
    filters.urgent !== ''
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
      row.patientName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.risk && row.overallRisk !== filters.risk) return false;
  if (filters.pathway && row.reviewPathway !== filters.pathway) return false;
  if (filters.referral && row.referral !== filters.referral) return false;
  if (filters.urgent === 'yes' && !row.urgentFlag) return false;
  if (filters.urgent === 'no' && row.urgentFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The overall-risk and
 * review-pathway columns use their rank tables; the urgent boolean sorts
 * false<true; the review-interval column sorts numerically (null last);
 * everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'overallRisk') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewPathway') {
    av = pathwayRank[av] ?? -1;
    bv = pathwayRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'reviewIntervalMonths') {
    av = av === null || av === undefined ? Infinity : av;
    bv = bv === null || bv === undefined ? Infinity : bv;
    return (av - bv) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, assessedAt,
  // referral).
  return String(av).localeCompare(String(bv)) * dir;
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
    if (row.urgentFlag || row.overallRisk === 'active-urgent') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.assessedAt)}</td>
      <td><span class="risk-badge ${riskClass(row.overallRisk)}">${esc(riskLabel(row.overallRisk))}</span></td>
      <td>${esc(pathwayLabel(row.reviewPathway))}</td>
      <td>${esc(referralLabel(row.referral))}</td>
      <td>${esc(intervalLabel(row.reviewIntervalMonths))}</td>
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
  const risk = document.getElementById('filter-risk');
  const pathway = document.getElementById('filter-pathway');
  const referral = document.getElementById('filter-referral');
  const urgent = document.getElementById('filter-urgent');
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
  if (pathway) {
    pathway.addEventListener('change', () => {
      filters.pathway = pathway.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (urgent) {
    urgent.addEventListener('change', () => {
      filters.urgent = urgent.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.risk = '';
      filters.pathway = '';
      filters.referral = '';
      filters.urgent = '';
      if (search) search.value = '';
      if (risk) risk.value = '';
      if (pathway) pathway.value = '';
      if (referral) referral.value = '';
      if (urgent) urgent.value = '';
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
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner(
        'Showing sample data — backend returned no assessments.'
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
  loadAssessments();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
