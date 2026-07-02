// CAM — clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the assessment list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + variant dropdown + classification dropdown + motoric-subtype dropdown +
// delirium-flag dropdown). CAM is a status / classification form, so the table
// shows a classification badge rather than a numeric score.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.ConfusionAssessmentMethodDashboard`. The whole file
// is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchAssessments,
  sampleAssessments
} = window.ConfusionAssessmentMethodDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  variant: '',        // '' | 'cam' | 'cam-icu'
  classification: '', // '' | 'present' | 'absent' | 'unable-to-assess'
  subtype: '',        // '' | 'hypoactive' | 'hyperactive' | 'mixed' | 'normal'
  delirium: ''        // '' | 'yes' | 'no'
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
  { key: 'wardUnit',          label: 'Ward / Unit' },
  { key: 'camVariant',        label: 'Variant' },
  { key: 'classification',    label: 'Classification' },
  { key: 'motoricSubtype',    label: 'Subtype' },
  { key: 'deliriumFlag',      label: 'Delirium' }
];

// Rank used when sorting the classification column so the clinical severity
// order (present > unable-to-assess > absent) is respected regardless of locale.
const classificationRank = {
  'present': 0,
  'unable-to-assess': 1,
  'absent': 2
};

const variantLabels = {
  'cam': 'CAM',
  'cam-icu': 'CAM-ICU'
};

const subtypeLabels = {
  'hypoactive': 'Hypoactive',
  'hyperactive': 'Hyperactive',
  'mixed': 'Mixed',
  'normal': 'Normal'
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

function classificationClass(classification) {
  switch (classification) {
    case 'present': return 'risk-high';
    case 'absent': return 'risk-low';
    case 'unable-to-assess': return 'risk-medium';
    default: return '';
  }
}

function classificationLabel(classification) {
  switch (classification) {
    case 'present': return 'Present';
    case 'absent': return 'Absent';
    case 'unable-to-assess': return 'Unable to assess';
    default: return 'N/A';
  }
}

function variantLabel(variant) {
  return variantLabels[variant] || variant || 'N/A';
}

function subtypeLabel(subtype) {
  return subtypeLabels[subtype] || (subtype ? subtype : 'N/A');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.variant !== '' ||
    filters.classification !== '' ||
    filters.subtype !== '' ||
    filters.delirium !== ''
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
      row.patientName.toLowerCase().includes(term) ||
      (row.wardUnit || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.variant && row.camVariant !== filters.variant) return false;
  if (filters.classification && row.classification !== filters.classification) return false;
  if (filters.subtype && row.motoricSubtype !== filters.subtype) return false;
  if (filters.delirium === 'yes' && !row.deliriumFlag) return false;
  if (filters.delirium === 'no' && row.deliriumFlag) return false;
  return true;
}

/**
 * Compare two rows for the active sort column. The classification column uses
 * its rank table; the delirium boolean sorts false<true; everything else uses
 * a locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'classification') {
    av = classificationRank[av] ?? 99;
    bv = classificationRank[bv] ?? 99;
    return (av - bv) * dir;
  }

  if (key === 'deliriumFlag') {
    return ((av === bv) ? 0 : (av ? 1 : -1)) * dir;
  }

  // Default: string compare.
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
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
    if (row.classification === 'present') {
      tr.classList.add('row-critical');
    }

    const classCellName = row.classification
      ? 'class-cell'
      : 'class-cell class-cell-na';

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.patientName)}</td>
      <td>${esc(row.wardUnit || 'N/A')}</td>
      <td>${esc(variantLabel(row.camVariant))}</td>
      <td><span class="${classCellName}"><span class="risk-badge ${classificationClass(row.classification)}">${esc(classificationLabel(row.classification))}</span></span></td>
      <td>${esc(subtypeLabel(row.motoricSubtype))}</td>
      <td>
        <span class="flag-badge ${row.deliriumFlag ? 'flag-yes' : 'flag-no'}">
          ${row.deliriumFlag ? 'Yes' : 'No'}
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
  const variant = document.getElementById('filter-variant');
  const classification = document.getElementById('filter-classification');
  const subtype = document.getElementById('filter-subtype');
  const delirium = document.getElementById('filter-delirium');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (variant) {
    variant.addEventListener('change', () => {
      filters.variant = variant.value;
      renderAll();
    });
  }
  if (classification) {
    classification.addEventListener('change', () => {
      filters.classification = classification.value;
      renderAll();
    });
  }
  if (subtype) {
    subtype.addEventListener('change', () => {
      filters.subtype = subtype.value;
      renderAll();
    });
  }
  if (delirium) {
    delirium.addEventListener('change', () => {
      filters.delirium = delirium.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.variant = '';
      filters.classification = '';
      filters.subtype = '';
      filters.delirium = '';
      if (search) search.value = '';
      if (variant) variant.value = '';
      if (classification) classification.value = '';
      if (subtype) subtype.value = '';
      if (delirium) delirium.value = '';
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
