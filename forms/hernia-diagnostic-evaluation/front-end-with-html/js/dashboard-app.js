import { fetchEvaluations } from './api.js';
import { sampleEvaluations } from './data.js';

// Hernia Diagnostic Evaluation — review dashboard (vanilla JS, native ES
// modules).
//
// On boot we fetch the evaluation list from the back-end; on any failure, or
// on an empty response, we fall back to the sample data in data.js and show a
// banner. The table is sortable (click any column header carrying data-sort)
// and filterable (search box plus urgency, hernia-type, and reducibility
// dropdowns).
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
  urgency: '',
  herniaType: '',
  reducibility: ''
};

// Default sort: most recent evaluation first.
const sortState = {
  key: 'assessmentDate',
  direction: 'desc'
};

// Ranks so categorical columns sort by clinical severity rather than
// alphabetically.
const RANKS = {
  reducibilityStatus: { reducible: 0, irreducible: 1, incarcerated: 2 },
  computedUrgency: { routine: 0, soon: 1, urgent: 2, emergency: 3 },
  finalUrgency: { routine: 0, soon: 1, urgent: 2, emergency: 3 },
  recommendation: {
    'watchful-waiting': 0,
    'conservative': 1,
    'elective-repair-referral': 2,
    'urgent-referral': 3,
    'emergency-referral': 4
  }
};

const URGENCY_LABELS = {
  routine: 'Routine',
  soon: 'Soon',
  urgent: 'Urgent',
  emergency: 'Emergency'
};

const RECOMMENDATION_LABELS = {
  'watchful-waiting': 'Watchful waiting',
  'elective-repair-referral': 'Elective repair referral',
  'urgent-referral': 'Urgent referral',
  'emergency-referral': 'Emergency referral',
  conservative: 'Conservative management'
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
  if (filters.urgency && row.finalUrgency !== filters.urgency) return false;
  if (filters.herniaType && row.herniaType !== filters.herniaType) return false;
  if (filters.reducibility && row.reducibilityStatus !== filters.reducibility) return false;
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

  const overridden = row.finalUrgency !== row.computedUrgency;

  return `
    <tr class="data-table-row">
      <td class="data-table-td">${esc(row.assessmentDate)}</td>
      <td class="data-table-td">${esc(row.patient)}</td>
      <td class="data-table-td">${esc(row.nhs)}</td>
      <td class="data-table-td">${esc(titleCase(row.herniaType) || '—')}</td>
      <td class="data-table-td">${esc(titleCase(row.reducibilityStatus) || '—')}</td>
      <td class="data-table-td"><span class="band-badge band-${esc(row.computedUrgency)}">${esc(URGENCY_LABELS[row.computedUrgency] || titleCase(row.computedUrgency))}</span></td>
      <td class="data-table-td">
        <span class="band-badge band-${esc(row.finalUrgency)}">${esc(URGENCY_LABELS[row.finalUrgency] || titleCase(row.finalUrgency))}</span>
        ${overridden ? '<abbr title="Clinician-overridden urgency band">override</abbr>' : ''}
      </td>
      <td class="data-table-td"><span class="band-badge rec-${esc(row.recommendation)}">${esc(RECOMMENDATION_LABELS[row.recommendation] || titleCase(row.recommendation))}</span></td>
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
    { label: 'Emergency urgency', value: count((r) => r.finalUrgency === 'emergency') },
    { label: 'Urgent urgency', value: count((r) => r.finalUrgency === 'urgent') },
    { label: 'Irreducible or incarcerated', value: count((r) => r.reducibilityStatus === 'irreducible' || r.reducibilityStatus === 'incarcerated') },
    { label: 'Clinician-overridden', value: count((r) => r.finalUrgency !== r.computedUrgency) },
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
  'id', 'assessmentDate', 'patient', 'nhs', 'herniaType', 'reducibilityStatus',
  'computedUrgency', 'finalUrgency', 'recommendation', 'clinician', 'flags'
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
  a.download = 'hernia-diagnostic-evaluations.json';
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
  bindFilter('filter-urgency', 'urgency');
  bindFilter('filter-hernia-type', 'herniaType');
  bindFilter('filter-reducibility', 'reducibility');
  bindSorting();

  const clear = document.getElementById('clear-filters');
  if (clear) {
    clear.addEventListener('click', () => {
      for (const key of Object.keys(filters)) filters[key] = '';
      ['filter-search', 'filter-urgency', 'filter-hernia-type', 'filter-reducibility']
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
