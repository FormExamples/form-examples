import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';

// Dietetic Assessment — review dashboard (vanilla JS, native ES modules).
//
// On boot we fetch the assessment list from the back-end; on any failure, or
// on an empty response, we fall back to the sample data in data.js and show a
// banner. The table is sortable (click any column header carrying data-sort)
// and filterable (search box plus composite-risk, MUST-risk, GLIM, and
// refeeding-risk dropdowns).
//
// CSV and TSV export come from the shared, form-agnostic js/table-export.js,
// which the page loads separately and which injects its own toolbar above the
// table; only the JSON export below is form-specific.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = {
  search: '',
  risk: '',
  must: '',
  glim: '',
  refeeding: ''
};

// Default sort: most recent assessment first.
const sortState = {
  key: 'assessmentDate',
  direction: 'desc'
};

// Ranks so categorical columns sort by clinical severity rather than
// alphabetically.
const RANKS = {
  mustRisk: { low: 0, medium: 1, high: 2 },
  glimDiagnosis: { none: 0, moderate: 1, severe: 2 },
  refeedingRisk: { none: 0, high: 1, highest: 2 },
  compositeRisk: { low: 0, moderate: 1, high: 2, critical: 3 },
  recommendation: {
    'discharge': 0,
    'routine-care': 1,
    'observe-and-rescreen': 2,
    'dietetic-treatment-plan': 3,
    'urgent-referral': 4
  }
};

const RECOMMENDATION_LABELS = {
  'routine-care': 'Routine care',
  'observe-and-rescreen': 'Observe and rescreen',
  'dietetic-treatment-plan': 'Dietetic care plan',
  'urgent-referral': 'Urgent referral',
  'discharge': 'Discharge'
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
  if (filters.risk && row.compositeRisk !== filters.risk) return false;
  if (filters.must && row.mustRisk !== filters.must) return false;
  if (filters.glim && row.glimDiagnosis !== filters.glim) return false;
  if (filters.refeeding && row.refeedingRisk !== filters.refeeding) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [row.patient, row.nhs, row.dietitian, row.id]
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
  const rows = assessments.filter(matchesFilters);
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

  const bmi = row.bmi === null
    ? `<span class="muted" title="Estimated from mid-upper-arm circumference">est.</span>`
    : esc(row.bmi);

  const weightLoss = row.weightLossPercent === null
    ? '<span class="muted">—</span>'
    : `${esc(row.weightLossPercent)}%`;

  const mustCell = row.mustIsEstimated
    ? `${esc(row.mustScore)} <abbr title="This MUST score relies on an estimate">est.</abbr>`
    : esc(row.mustScore);

  return `
    <tr class="data-table-row">
      <td class="data-table-td">${esc(row.assessmentDate)}</td>
      <td class="data-table-td">${esc(row.patient)}</td>
      <td class="data-table-td">${esc(row.nhs)}</td>
      <td class="data-table-td">${bmi}</td>
      <td class="data-table-td">${weightLoss}</td>
      <td class="data-table-td">${mustCell}</td>
      <td class="data-table-td"><span class="band-badge must-${esc(row.mustRisk)}">${esc(titleCase(row.mustRisk))}</span></td>
      <td class="data-table-td"><span class="band-badge glim-${esc(row.glimDiagnosis)}">${esc(titleCase(row.glimDiagnosis))}</span></td>
      <td class="data-table-td"><span class="band-badge refeed-${esc(row.refeedingRisk)}">${esc(titleCase(row.refeedingRisk))}</span></td>
      <td class="data-table-td"><span class="band-badge band-${esc(row.compositeRisk)}">${esc(titleCase(row.compositeRisk))}</span></td>
      <td class="data-table-td"><span class="band-badge rec-${esc(row.recommendation)}">${esc(RECOMMENDATION_LABELS[row.recommendation] || titleCase(row.recommendation))}</span></td>
      <td class="data-table-td">${flags}</td>
      <td class="data-table-td">${esc(row.dietitian)}</td>
      <td class="data-table-td">${esc(row.reviewDate)}</td>
    </tr>
  `;
}

function renderSummary(rows) {
  const host = document.getElementById('summary');
  if (!host) return;
  const count = (predicate) => rows.filter(predicate).length;
  const cards = [
    { label: 'Assessments', value: rows.length },
    { label: 'MUST high risk', value: count((r) => r.mustRisk === 'high') },
    { label: 'GLIM malnutrition', value: count((r) => r.glimDiagnosis !== 'none') },
    { label: 'Refeeding risk', value: count((r) => r.refeedingRisk !== 'none') },
    { label: 'Critical composite risk', value: count((r) => r.compositeRisk === 'critical') },
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
  const body = document.getElementById('assessments-body');
  if (body) body.innerHTML = rows.map(renderRow).join('');

  const empty = document.getElementById('empty-message');
  if (empty) empty.hidden = rows.length > 0;

  const foot = document.getElementById('table-foot');
  if (foot) {
    foot.textContent = hasActiveFilters()
      ? `Showing ${rows.length} of ${assessments.length} assessments.`
      : `${assessments.length} assessments.`;
  }

  renderSummary(rows);
  renderSortIndicators();
}

// ----------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------

const EXPORT_COLUMNS = [
  'id', 'assessmentDate', 'patient', 'nhs', 'bmi', 'weightLossPercent',
  'mustScore', 'mustRisk', 'mustIsEstimated', 'glimDiagnosis', 'refeedingRisk',
  'compositeRisk', 'recommendation', 'dietitian', 'reviewDate', 'flags'
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
  a.download = 'dietic-assessments.json';
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
    const rows = await fetchAssessments();
    if (rows.length > 0) {
      assessments = rows;
      return;
    }
    assessments = sampleAssessments;
    showNotice(
      'The back-end returned no assessments, so the dashboard is showing sample data.',
      'info'
    );
  } catch (e) {
    assessments = sampleAssessments;
    showNotice(
      'The back-end is unavailable, so the dashboard is showing sample data. Start the Loco API on http://localhost:5150 to see live records.',
      'warning'
    );
  }
}

async function init() {
  bindFilter('filter-search', 'search');
  bindFilter('filter-risk', 'risk');
  bindFilter('filter-must', 'must');
  bindFilter('filter-glim', 'glim');
  bindFilter('filter-refeeding', 'refeeding');
  bindSorting();

  const clear = document.getElementById('clear-filters');
  if (clear) {
    clear.addEventListener('click', () => {
      for (const key of Object.keys(filters)) filters[key] = '';
      ['filter-search', 'filter-risk', 'filter-must', 'filter-glim', 'filter-refeeding']
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
