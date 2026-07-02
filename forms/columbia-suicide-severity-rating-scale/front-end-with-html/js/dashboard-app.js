// C-SSRS — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + care-setting dropdown + ideation-level dropdown + risk-tier dropdown +
// escalation dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.ColumbiaSuicideSeverityRatingScaleDashboard`. The
// whole file is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.ColumbiaSuicideSeverityRatingScaleDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  setting: '',   // '' | care-setting slug
  level: '',     // '' | '0' | '1' | '2' | '3' | '4' | '5'
  tier: '',      // '' | 'low' | 'moderate' | 'high'
  escalate: ''   // '' | 'yes' | 'no'
};

// Default sort: patient name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'patientName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier', label: 'Patient ID' },
  { key: 'patientName',       label: 'Patient Name' },
  { key: 'careSetting',       label: 'Setting' },
  { key: 'ideationLevel',     label: 'Ideation' },
  { key: 'riskTier',          label: 'Risk Tier' },
  { key: 'escalationFlag',    label: 'Escalate' }
];

// Rank used when sorting the riskTier column so 'low' < 'moderate' < 'high'
// regardless of locale.
const tierRank = {
  'low': 0,
  'moderate': 1,
  'high': 2
};

const settingLabels = {
  'mental-health': 'Mental-health',
  'emergency-department': 'Emergency dept',
  'primary-care': 'Primary care',
  'crisis-service': 'Crisis service',
  'inpatient': 'Inpatient',
  'other': 'Other'
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

function tierClass(tier) {
  if (tier === 'high') return 'risk-high';
  if (tier === 'moderate') return 'risk-moderate';
  if (tier === 'low') return 'risk-low';
  return '';
}

function tierLabel(tier) {
  if (tier === 'high') return 'High';
  if (tier === 'moderate') return 'Moderate';
  if (tier === 'low') return 'Low';
  return 'N/A';
}

function settingLabel(setting) {
  return settingLabels[setting] || setting || 'N/A';
}

function levelLabel(level) {
  return (level === null || level === undefined) ? 'N/A' : String(level);
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.setting !== '' ||
    filters.level !== '' ||
    filters.tier !== '' ||
    filters.escalate !== ''
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
  if (filters.setting && row.careSetting !== filters.setting) return false;
  if (filters.level) {
    if (row.ideationLevel === null || row.ideationLevel !== Number(filters.level)) {
      return false;
    }
  }
  if (filters.tier && row.riskTier !== filters.tier) return false;
  if (filters.escalate === 'yes' && !row.escalationFlag) return false;
  if (filters.escalate === 'no' && row.escalationFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The risk-tier column uses its
 * rank table; the nullable ideation level sorts nulls last; the escalation
 * boolean sorts false<true; everything else uses a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'riskTier') {
    av = tierRank[av] ?? -1;
    bv = tierRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ideationLevel') {
    // Sort nulls last in both directions so scored rows cluster at the top.
    const aNull = av === null || av === undefined;
    const bNull = bv === null || bv === undefined;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return (av - bv) * dir;
  }

  if (key === 'escalationFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare (patientIdentifier, patientName, careSetting)
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
    if (row.riskTier === 'high') {
      tr.classList.add('row-critical');
    }

    const levelClassName = row.ideationLevel === null
      ? 'class-cell class-cell-na'
      : 'class-cell';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(settingLabel(row.careSetting))}</td>
      <td><span class="${levelClassName}">${esc(levelLabel(row.ideationLevel))}</span></td>
      <td><span class="risk-badge ${tierClass(row.riskTier)}">${esc(tierLabel(row.riskTier))}</span></td>
      <td>
        <span class="flag-badge ${row.escalationFlag ? 'flag-yes' : 'flag-no'}">
          ${row.escalationFlag ? 'Yes' : 'No'}
        </span>
      </td>
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
  const setting = document.getElementById('filter-setting');
  const level = document.getElementById('filter-level');
  const tier = document.getElementById('filter-tier');
  const escalate = document.getElementById('filter-escalate');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (setting) {
    setting.addEventListener('change', () => {
      filters.setting = setting.value;
      renderAll();
    });
  }
  if (level) {
    level.addEventListener('change', () => {
      filters.level = level.value;
      renderAll();
    });
  }
  if (tier) {
    tier.addEventListener('change', () => {
      filters.tier = tier.value;
      renderAll();
    });
  }
  if (escalate) {
    escalate.addEventListener('change', () => {
      filters.escalate = escalate.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.setting = '';
      filters.level = '';
      filters.tier = '';
      filters.escalate = '';
      if (search) search.value = '';
      if (setting) setting.value = '';
      if (level) level.value = '';
      if (tier) tier.value = '';
      if (escalate) escalate.value = '';
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
})();
