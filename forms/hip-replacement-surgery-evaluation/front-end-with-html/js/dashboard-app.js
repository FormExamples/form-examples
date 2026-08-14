import { fetchEvaluations } from './api.js';
import { sampleEvaluations } from './data.js';

// Hip Replacement Surgery Evaluation — review dashboard (vanilla JS, native
// ES modules).
//
// On boot we fetch the evaluation list from the back-end; on any failure, or
// on an empty response, we fall back to the sample data in data.js and show a
// banner. The table is sortable (click any column header carrying data-sort)
// and filterable (search box plus OHS-category and candidacy dropdowns).
//
// CSV and TSV export come from the shared, form-agnostic js/table-export.js,
// which the page loads separately and which injects its own toolbar above the
// table; only the JSON export below is form-specific.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').EvaluationRow[]} */
let evaluations = [];

const filters = {
  search: '',
  ohsCategory: '',
  candidacy: ''
};

// Default sort: most recent evaluation first.
const sortState = {
  key: 'assessmentDate',
  direction: 'desc'
};

// Ranks so categorical columns sort by clinical severity rather than
// alphabetically.
const RANKS = {
  ohsCategory: { severe: 0, moderate: 1, 'mild-to-moderate': 2, satisfactory: 3 },
  candidacy: {
    'strong-candidate': 0,
    candidate: 1,
    'mdt-review': 2,
    'continue-conservative': 3,
    'not-indicated': 4
  }
};

const CANDIDACY_LABELS = {
  'strong-candidate': 'Strong candidate',
  candidate: 'Candidate',
  'continue-conservative': 'Continue conservative',
  'not-indicated': 'Not indicated',
  'mdt-review': 'MDT review'
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

function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasActiveFilters() {
  return Object.values(filters).some((v) => v !== '');
}

// ----------------------------------------------------------------------
// Filter and sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.ohsCategory && row.ohsCategory !== filters.ohsCategory) return false;
  if (filters.candidacy && row.candidacy !== filters.candidacy) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [row.patient, row.nhs, row.clinician, row.id]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

function sortValue(row, key) {
  const rank = RANKS[key];
  if (rank) return rank[row[key]] ?? -1;
  const v = row[key];
  if (v === null || v === undefined) return -Infinity;
  return typeof v === 'number' ? v : String(v).toLowerCase();
}

function visibleRows() {
  const rows = evaluations.filter(matchesFilters);
  const dir = sortState.direction === 'asc' ? 1 : -1;
  return rows.sort((a, b) => {
    const av = sortValue(a, sortState.key);
    const bv = sortValue(b, sortState.key);
    if (av < bv) return -1 * dir;
    if (av > bv) return 1 * dir;
    return 0;
  });
}

// ----------------------------------------------------------------------
// Render
// ----------------------------------------------------------------------

function renderRow(row) {
  const flags = row.flags.length === 0
    ? '<span class="muted">—</span>'
    : row.flags
      .map((f) => `<span class="flag-chip flag-${esc(f)}">${esc(titleCase(f))}</span>`)
      .join(' ');

  const bmi = row.bmi === null ? '<span class="muted">—</span>' : esc(row.bmi);
  const kl = row.kellgrenLawrenceGrade === null ? '<span class="muted">—</span>' : esc(row.kellgrenLawrenceGrade);

  return `
    <tr class="data-table-row">
      <td class="data-table-td">${esc(row.assessmentDate)}</td>
      <td class="data-table-td">${esc(row.patient)}</td>
      <td class="data-table-td">${esc(row.nhs)}</td>
      <td class="data-table-td">${bmi}</td>
      <td class="data-table-td">${esc(row.ohsTotal)}</td>
      <td class="data-table-td"><span class="band-badge ohs-${esc(row.ohsCategory)}">${esc(titleCase(row.ohsCategory))}</span></td>
      <td class="data-table-td">${kl}</td>
      <td class="data-table-td"><span class="band-badge candidacy-${esc(row.candidacy)}">${esc(CANDIDACY_LABELS[row.candidacy] || titleCase(row.candidacy))}</span></td>
      <td class="data-table-td">${flags}</td>
      <td class="data-table-td">${esc(row.clinician)}</td>
    </tr>
  `;
}

function renderSummary(rows) {
  const host = document.getElementById('summary');
  if (!host) return;
  const count = (predicate) => rows.filter(predicate).length;
  const cards = [
    { label: 'Evaluations', value: rows.length },
    { label: 'Severe OHS', value: count((r) => r.ohsCategory === 'severe') },
    { label: 'Strong candidates', value: count((r) => r.candidacy === 'strong-candidate') },
    { label: 'Continue conservative', value: count((r) => r.candidacy === 'continue-conservative') },
    { label: 'MDT review', value: count((r) => r.candidacy === 'mdt-review') },
    { label: 'With safety flags', value: count((r) => r.flags.length > 0) }
  ];
  host.innerHTML = cards.map((c) => `
    <div class="summary-card">
      <span class="summary-value">${c.value}</span>
      <span class="summary-label">${esc(c.label)}</span>
    </div>
  `).join('');
}

function renderSortIndicators() {
  document.querySelectorAll('.data-table-th[data-sort]').forEach((th) => {
    const key = th.getAttribute('data-sort');
    if (key === sortState.key) {
      th.setAttribute('aria-sort', sortState.direction === 'asc' ? 'ascending' : 'descending');
    } else {
      th.removeAttribute('aria-sort');
    }
  });
}

function render() {
  const rows = visibleRows();
  const body = document.getElementById('evaluations-body');
  if (body) body.innerHTML = rows.map(renderRow).join('');

  const empty = document.getElementById('empty-message');
  if (empty) empty.hidden = rows.length > 0;

  const foot = document.getElementById('table-foot');
  if (foot) {
    foot.textContent = hasActiveFilters()
      ? `Showing ${rows.length} of ${evaluations.length} evaluations.`
      : `${evaluations.length} evaluations.`;
  }

  renderSummary(rows);
  renderSortIndicators();
}

// ----------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------

const EXPORT_COLUMNS = [
  'id', 'assessmentDate', 'patient', 'nhs', 'bmi', 'ohsTotal', 'ohsCategory',
  'kellgrenLawrenceGrade', 'candidacy', 'clinician', 'flags'
];

function exportRows() {
  return visibleRows().map((row) => {
    const out = {};
    for (const key of EXPORT_COLUMNS) {
      out[key] = key === 'flags' ? row.flags.join(' ') : row[key];
    }
    return out;
  });
}

function exportJson() {
  const blob = new Blob([JSON.stringify(exportRows(), null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'hip-replacement-surgery-evaluations.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------------------------
// Wiring
// ----------------------------------------------------------------------

function bindFilter(id, key) {
  const el = document.getElementById(id);
  if (!el) return;
  const event = el.tagName === 'SELECT' ? 'change' : 'input';
  el.addEventListener(event, () => {
    filters[key] = el.value;
    render();
  });
}

function bindSorting() {
  document.querySelectorAll('.data-table-th[data-sort]').forEach((th) => {
    th.tabIndex = 0;
    th.setAttribute('role', 'columnheader');
    const activate = () => {
      const key = th.getAttribute('data-sort');
      if (sortState.key === key) {
        sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
      } else {
        sortState.key = key;
        sortState.direction = 'asc';
      }
      render();
    };
    th.addEventListener('click', activate);
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
}

function showNotice(message, type) {
  const el = document.getElementById('source-notice');
  if (!el) return;
  el.hidden = false;
  el.setAttribute('data-type', type);
  el.textContent = message;
}

async function loadData() {
  try {
    const rows = await fetchEvaluations();
    if (rows.length > 0) {
      evaluations = rows;
      return;
    }
    evaluations = sampleEvaluations;
    showNotice(
      'The back-end returned no evaluations, so the dashboard is showing sample data.',
      'info'
    );
  } catch (e) {
    evaluations = sampleEvaluations;
    showNotice(
      'The back-end is unavailable, so the dashboard is showing sample data. Start the Loco API on http://localhost:5150 to see live records.',
      'warning'
    );
  }
}

async function init() {
  bindFilter('filter-search', 'search');
  bindFilter('filter-ohs-category', 'ohsCategory');
  bindFilter('filter-candidacy', 'candidacy');
  bindSorting();

  const clear = document.getElementById('clear-filters');
  if (clear) {
    clear.addEventListener('click', () => {
      for (const key of Object.keys(filters)) filters[key] = '';
      ['filter-search', 'filter-ohs-category', 'filter-candidacy']
        .forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = '';
        });
      render();
    });
  }

  const json = document.getElementById('export-json');
  if (json) json.addEventListener('click', exportJson);

  await loadData();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
