import { fetchQuestionnaires } from './api.js';
import { sampleQuestionnaires } from './data.js';

// Health Screening Questionnaire — review dashboard (vanilla JS, native ES
// modules).
//
// On boot we fetch the questionnaire list from the back-end; on any failure,
// or on an empty response, we fall back to the sample data in data.js and
// show a banner. The table is sortable (click any column header carrying
// data-sort) and filterable (search box plus risk-band, PAR-Q+, and AUDIT-C
// dropdowns).
//
// CSV and TSV export come from the shared, form-agnostic js/table-export.js,
// which the page loads separately and which injects its own toolbar above the
// table; only the JSON export below is form-specific.

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').QuestionnaireRow[]} */
let questionnaires = [];

const filters = {
  search: '',
  risk: '',
  parq: '',
  auditc: ''
};

// Default sort: most recent screen first.
const sortState = {
  key: 'assessmentDate',
  direction: 'desc'
};

// Ranks so categorical columns sort by clinical severity rather than
// alphabetically.
const RANKS = {
  riskBand: { low: 0, moderate: 1, high: 2, 'refer-urgently': 3 },
  auditCBand: { low: 0, 'increasing-risk': 1, 'higher-risk': 2 },
  recommendation: {
    'clear-to-proceed': 0,
    'routine-review': 1,
    'paediatric-pathway': 2,
    'gp-review-required': 3,
    'refer-urgently': 4
  }
};

const RECOMMENDATION_LABELS = {
  'clear-to-proceed': 'Clear to proceed',
  'routine-review': 'Routine review',
  'gp-review-required': 'GP review required',
  'refer-urgently': 'Refer urgently',
  'paediatric-pathway': 'Paediatric pathway'
};

const PARQ_CLEARANCE_LABELS = {
  'cleared': 'Cleared',
  'further-assessment-required': 'Further assessment required'
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
  if (filters.risk && row.riskBand !== filters.risk) return false;
  if (filters.parq && row.parqPlusClearance !== filters.parq) return false;
  if (filters.auditc && row.auditCBand !== filters.auditc) return false;
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [row.patient, row.identifier, row.assessor, row.id].join(' ').toLowerCase();
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
  const rows = questionnaires.filter(matchesFilters);
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
    : row.flags.map((f) => `<span class="flag-chip flag-${esc(f)}">${esc(titleCase(f))}</span>`).join(' ');

  return `
    <tr class="data-table-row">
      <td class="data-table-td">${esc(row.assessmentDate)}</td>
      <td class="data-table-td">${esc(row.patient)}</td>
      <td class="data-table-td">${esc(row.identifier)}</td>
      <td class="data-table-td">${esc(titleCase(row.screeningPurpose))}</td>
      <td class="data-table-td"><span class="band-badge parq-${esc(row.parqPlusClearance)}">${esc(row.parqPlusClearance ? PARQ_CLEARANCE_LABELS[row.parqPlusClearance] : '—')}</span></td>
      <td class="data-table-td">${row.auditCScore === null ? '<span class="muted">—</span>' : `${esc(row.auditCScore)} / 12`}</td>
      <td class="data-table-td">${row.auditCBand ? esc(titleCase(row.auditCBand)) : '<span class="muted">—</span>'}</td>
      <td class="data-table-td"><span class="band-badge band-${esc(row.riskBand)}">${esc(row.riskBand ? titleCase(row.riskBand) : 'Paediatric')}</span></td>
      <td class="data-table-td"><span class="band-badge rec-${esc(row.recommendation)}">${esc(RECOMMENDATION_LABELS[row.recommendation] || titleCase(row.recommendation))}</span></td>
      <td class="data-table-td">${flags}</td>
      <td class="data-table-td">${esc(row.assessor)}</td>
    </tr>
  `;
}

function renderSummary(rows) {
  const host = document.getElementById('summary');
  if (!host) return;
  const count = (predicate) => rows.filter(predicate).length;
  const cards = [
    { label: 'Questionnaires', value: rows.length },
    { label: 'PAR-Q+ further assessment', value: count((r) => r.parqPlusClearance === 'further-assessment-required') },
    { label: 'AUDIT-C higher risk', value: count((r) => r.auditCBand === 'higher-risk') },
    { label: 'Refer urgently', value: count((r) => r.riskBand === 'refer-urgently') },
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
  const body = document.getElementById('questionnaires-body');
  if (body) body.innerHTML = rows.map(renderRow).join('');

  const empty = document.getElementById('empty-message');
  if (empty) empty.hidden = rows.length > 0;

  const foot = document.getElementById('table-foot');
  if (foot) {
    foot.textContent = hasActiveFilters()
      ? `Showing ${rows.length} of ${questionnaires.length} questionnaires.`
      : `${questionnaires.length} questionnaires.`;
  }

  renderSummary(rows);
  renderSortIndicators();
}

// ----------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------

const EXPORT_COLUMNS = [
  'id', 'assessmentDate', 'patient', 'identifier', 'screeningPurpose',
  'parqPlusClearance', 'auditCScore', 'auditCBand', 'riskBand', 'recommendation',
  'assessor', 'flags'
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
  const blob = new Blob([JSON.stringify(exportRows(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'health-screening-questionnaires.json';
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
    const rows = await fetchQuestionnaires();
    if (rows.length > 0) {
      questionnaires = rows;
      return;
    }
    questionnaires = sampleQuestionnaires;
    showNotice('The back-end returned no questionnaires, so the dashboard is showing sample data.', 'info');
  } catch (e) {
    questionnaires = sampleQuestionnaires;
    showNotice(
      'The back-end is unavailable, so the dashboard is showing sample data. Start the Loco API on http://localhost:5150 to see live records.',
      'warning'
    );
  }
}

async function init() {
  bindFilter('filter-search', 'search');
  bindFilter('filter-risk', 'risk');
  bindFilter('filter-parq', 'parq');
  bindFilter('filter-auditc', 'auditc');
  bindSorting();

  const clear = document.getElementById('clear-filters');
  if (clear) {
    clear.addEventListener('click', () => {
      for (const key of Object.keys(filters)) filters[key] = '';
      ['filter-search', 'filter-risk', 'filter-parq', 'filter-auditc'].forEach((id) => {
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
