import { fetchAssessments } from './api.js';
import { sampleAssessments } from './data.js';
import { DOMAIN_LABELS } from './domain-rules.js';
import { GATE_DECISION_LABELS, READINESS_LABELS, labelFor } from './types.js';

// Perioperative Optimization — review dashboard (vanilla JS, ES modules).
//
// The columns that matter here are weeks-to-surgery and the domains short on
// time: together they say which lists are about to proceed without the
// optimisation they were promised. Default sort is by surgery date ascending,
// so the most imminent lists are at the top.
//
// CSV and TSV export come from the shared js/table-export.js, which the page
// loads separately; only the JSON export below is form-specific.

/** @type {import('./dashboard-types.js').AssessmentRow[]} */
let assessments = [];

const filters = { search: '', readiness: '', domain: '', weeks: '', decision: '' };

const sortState = { key: 'surgeryDate', direction: 'asc' };

const RANKS = {
  readiness: {
    'ready': 0,
    'optimisation-in-progress': 1,
    'optimisation-required': 2,
    'defer-surgery': 3
  },
  severity: { 'minor': 0, 'intermediate': 1, 'major': 2, 'major-plus': 3 },
  gateDecision: {
    '': 0,
    'proceed': 1,
    'proceed-with-prehabilitation': 2,
    'defer-and-optimise': 3,
    'mdt-review': 4,
    'accept-unoptimised-risk': 5,
    'cancel': 6
  }
};

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function titleCase(s) {
  return String(s || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function hasActiveFilters() {
  return Object.values(filters).some((v) => v !== '');
}

// ----------------------------------------------------------------------
// Filter and sort
// ----------------------------------------------------------------------

function matchesFilters(row) {
  if (filters.readiness && row.readiness !== filters.readiness) return false;
  if (filters.decision && row.gateDecision !== filters.decision) return false;
  if (filters.domain && !row.domainsShortOnTime.includes(filters.domain)) return false;
  if (filters.weeks) {
    // Rows with no surgery date have no weeks value, so they cannot satisfy a
    // weeks filter and are excluded rather than silently included.
    if (row.weeksToSurgery === null) return false;
    const limit = { lt4: 4, lt8: 8, lt12: 12 }[filters.weeks];
    if (row.weeksToSurgery >= limit) return false;
  }
  if (filters.search) {
    const needle = filters.search.toLowerCase();
    const haystack = [row.patient, row.nhs, row.procedure, row.surgeon, row.id]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }
  return true;
}

function sortValue(row, key) {
  const rank = RANKS[key];
  if (rank) return rank[String(row[key])] ?? -1;
  if (key === 'flagCount' || key === 'actionRequired') return row[key];
  if (key === 'weeksToSurgery') {
    // Unlisted patients sort last in either direction rather than pretending
    // to be imminent.
    return row.weeksToSurgery === null ? Number.MAX_SAFE_INTEGER : row.weeksToSurgery;
  }
  const v = row[key];
  if (v === null || v === undefined || v === '') return '￿';
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

function weeksCell(row) {
  if (row.weeksToSurgery === null) {
    return '<span class="muted" title="No surgery date recorded; gating not applied">—</span>';
  }
  const urgency = row.weeksToSurgery < 4 ? 'weeks-urgent'
    : row.weeksToSurgery < 8 ? 'weeks-soon' : 'weeks-ample';
  return `<span class="${urgency}">${esc(row.weeksToSurgery)}</span>`;
}

function renderRow(row) {
  const short = row.domainsShortOnTime.length === 0
    ? '<span class="muted">—</span>'
    : row.domainsShortOnTime
      .map((d) => `<span class="flag-chip domain-${esc(d)}">${esc(DOMAIN_LABELS[d] || titleCase(d))}</span>`)
      .join(' ');

  return `
    <tr class="data-table-row readiness-row-${esc(row.readiness)}">
      <td class="data-table-td">${esc(row.surgeryDate || '—')}</td>
      <td class="data-table-td">${weeksCell(row)}</td>
      <td class="data-table-td">${esc(row.patient)}</td>
      <td class="data-table-td">${esc(row.nhs)}</td>
      <td class="data-table-td">${esc(row.procedure)}</td>
      <td class="data-table-td">${esc(titleCase(row.severity))}</td>
      <td class="data-table-td"><span class="band-badge readiness-${esc(row.readiness)}">${esc(labelFor(READINESS_LABELS, row.readiness))}</span></td>
      <td class="data-table-td">${short}</td>
      <td class="data-table-td">${esc(row.actionRequired)}</td>
      <td class="data-table-td">${row.gateDecision ? esc(labelFor(GATE_DECISION_LABELS, row.gateDecision)) : '<span class="muted">not recorded</span>'}</td>
      <td class="data-table-td">${esc(row.surgeon)}</td>
      <td class="data-table-td">${esc(row.flagCount)}</td>
    </tr>
  `;
}

function renderSummary(rows) {
  const host = document.getElementById('summary');
  if (!host) return;
  const count = (p) => rows.filter(p).length;
  const cards = [
    { label: 'Assessments', value: rows.length },
    { label: 'Defer surgery', value: count((r) => r.readiness === 'defer-surgery') },
    { label: 'Short on time', value: count((r) => r.domainsShortOnTime.length > 0) },
    { label: 'Under 4 weeks', value: count((r) => r.weeksToSurgery !== null && r.weeksToSurgery < 4) },
    { label: 'Risk accepted', value: count((r) => r.gateDecision === 'accept-unoptimised-risk') },
    { label: 'Decision not recorded', value: count((r) => !r.gateDecision) }
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
  'id', 'assessmentDate', 'surgeryDate', 'weeksToSurgery', 'patient', 'nhs',
  'procedure', 'severity', 'readiness', 'domainsShortOnTime', 'actionRequired',
  'gateDecision', 'surgeon', 'flagCount'
];

function exportRows() {
  return visibleRows().map((row) => {
    const out = {};
    for (const key of EXPORT_COLUMNS) {
      out[key] = key === 'domainsShortOnTime' ? row.domainsShortOnTime.join(' ') : row[key];
    }
    return out;
  });
}

function exportJson() {
  const blob = new Blob([JSON.stringify(exportRows(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'perioperative-optimizations.json';
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
  el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
    filters[key] = el.value;
    render();
  });
}

function bindSorting() {
  document.querySelectorAll('.data-table-th[data-sort]').forEach((th) => {
    th.tabIndex = 0;
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
    showNotice('The back-end returned no assessments, so the dashboard is showing sample data.', 'info');
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
  bindFilter('filter-readiness', 'readiness');
  bindFilter('filter-domain', 'domain');
  bindFilter('filter-weeks', 'weeks');
  bindFilter('filter-decision', 'decision');
  bindSorting();

  const clear = document.getElementById('clear-filters');
  if (clear) {
    clear.addEventListener('click', () => {
      for (const key of Object.keys(filters)) filters[key] = '';
      ['filter-search', 'filter-readiness', 'filter-domain', 'filter-weeks', 'filter-decision']
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
