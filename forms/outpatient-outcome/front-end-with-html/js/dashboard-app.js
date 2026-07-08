// Outpatient Outcome — dashboard (vanilla classic-script app).
//
// On boot we fetch the outcome list from the backend; on any failure (or empty
// response) we fall back to sample data and show a small banner. The rendered
// table is sortable (click any column header) and filterable (search box +
// overall-grade dropdown + specialty dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.OutpatientOutcomeDashboard`. The whole file is
// wrapped in an IIFE so its top-level identifiers do not leak to the global
// scope.
(function () {
'use strict';
const {
  fetchOutcomes,
  sampleOutcomes
} = window.OutpatientOutcomeDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').OutcomeRow[]} */
let outcomes = [];

const filters = {
  search: '',
  grade: '',
  specialty: ''
};

// Default sort: most recent clinic date first.
const sortState = {
  key: 'assessedDate',
  direction: 'desc' // 'asc' | 'desc'
};

const columns = [
  { key: 'id',              label: 'Report' },
  { key: 'patientName',     label: 'Patient' },
  { key: 'assessedDate',    label: 'Clinic Date' },
  { key: 'specialty',       label: 'Specialty' },
  { key: 'modality',        label: 'Modality' },
  { key: 'overallGrade',    label: 'Overall' },
  { key: 'clinicalGrade',   label: 'Clinical' },
  { key: 'promGrade',       label: 'PROM' },
  { key: 'premGrade',       label: 'PREM' },
  { key: 'operationalGrade', label: 'Operational' },
  { key: 'waitTimeDays',    label: 'Wait (d)' },
  { key: 'flagCount',       label: 'Flags' }
];

// A (best) = 0 … E (worst) = 4; '' (insufficient) sorts last.
const gradeRank = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, '': 5 };

const GRADE_KEYS = [
  'overallGrade', 'clinicalGrade', 'promGrade', 'premGrade', 'operationalGrade'
];

const MODALITY_LABELS = {
  'in_person': 'In Person',
  'telephone': 'Telephone',
  'video': 'Video'
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function gradeClass(grade) {
  return grade ? 'grade-' + String(grade).toLowerCase() : 'grade-none';
}

function modalityLabel(m) {
  return MODALITY_LABELS[m] || m || '—';
}

function hasActiveFilters() {
  return filters.search !== '' || filters.grade !== '' || filters.specialty !== '';
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      String(row.id || '').toLowerCase().includes(term) ||
      String(row.patientName || '').toLowerCase().includes(term) ||
      String(row.specialty || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.grade && row.overallGrade !== filters.grade) return false;
  if (filters.specialty && row.specialty !== filters.specialty) return false;
  return true;
}

function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  const av = a[key];
  const bv = b[key];

  if (GRADE_KEYS.includes(key)) {
    return ((gradeRank[av] ?? 6) - (gradeRank[bv] ?? 6)) * dir;
  }
  if (key === 'waitTimeDays' || key === 'flagCount') {
    return ((av ?? -1) - (bv ?? -1)) * dir;
  }
  return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
}

function visibleRows() {
  return outcomes.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('outcomes-table-head');
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

function gradeCell(grade) {
  return `<span class="grade-badge ${gradeClass(grade)}">${esc(grade || '—')}</span>`;
}

function renderTableBody() {
  const body = document.getElementById('outcomes-table-body');
  const empty = document.getElementById('outcomes-empty-message');
  if (!body) return;

  const rows = visibleRows();
  body.innerHTML = '';

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    if (row.overallGrade === 'E' || row.overallGrade === 'D') {
      tr.classList.add('row-critical');
    }

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.id)}</td>
      <td class="data-table-td"><strong>${esc(row.patientName)}</strong></td>
      <td class="data-table-td"><span class="date-cell">${esc(row.assessedDate)}</span></td>
      <td class="data-table-td">${esc(row.specialty)}</td>
      <td class="data-table-td">${esc(modalityLabel(row.modality))}</td>
      <td class="data-table-td">${gradeCell(row.overallGrade)}</td>
      <td class="data-table-td">${gradeCell(row.clinicalGrade)}</td>
      <td class="data-table-td">${gradeCell(row.promGrade)}</td>
      <td class="data-table-td">${gradeCell(row.premGrade)}</td>
      <td class="data-table-td">${gradeCell(row.operationalGrade)}</td>
      <td class="data-table-td"><span class="numeric-cell">${row.waitTimeDays == null ? '—' : esc(row.waitTimeDays)}</span></td>
      <td class="data-table-td"><span class="numeric-cell">${esc(row.flagCount)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = outcomes.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No outcome reports to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} reports · overall grade is the worst of the four domains`;
  } else {
    el.textContent = `Showing ${shown} of ${total} reports`;
  }
}

function renderSpecialtyOptions() {
  const sel = document.getElementById('filter-specialty');
  if (!sel) return;
  const current = sel.value;
  const specialties = [...new Set(outcomes.map((r) => r.specialty))].filter(Boolean).sort();
  sel.innerHTML =
    '<option value="">All specialties</option>' +
    specialties.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
  sel.value = current;
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
    sortState.direction = key === 'assessedDate' ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const grade = document.getElementById('filter-grade');
  const specialty = document.getElementById('filter-specialty');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => { filters.search = search.value; renderAll(); });
  }
  if (grade) {
    grade.addEventListener('change', () => { filters.grade = grade.value; renderAll(); });
  }
  if (specialty) {
    specialty.addEventListener('change', () => { filters.specialty = specialty.value; renderAll(); });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.grade = '';
      filters.specialty = '';
      if (search) search.value = '';
      if (grade) grade.value = '';
      if (specialty) specialty.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadOutcomes() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  outcomes = sampleOutcomes;
  renderSpecialtyOptions();
  renderAll();

  try {
    const items = await fetchOutcomes();
    if (items && items.length > 0) {
      outcomes = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no outcome reports.');
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderSpecialtyOptions();
  renderAll();
}

function init() {
  bindFilterInputs();
  loadOutcomes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
