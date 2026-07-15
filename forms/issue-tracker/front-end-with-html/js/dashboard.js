// Dashboard logic: render the table from SAMPLE_ISSUES, sort by
// header click, filter by the dropdowns, and search across CC + system + assignee.

import { SAMPLE_ISSUES } from './sample-data.js';

const tableBody = document.getElementById('issues-body');
const rowCount = document.getElementById('row-count');
const searchInput = document.getElementById('search');
const filterSelects = document.querySelectorAll('#filters select');
const headers = document.querySelectorAll('thead th[data-sort]');

let sortKey = 'compositePriority';
let sortDir = 'desc'; // critical first

const COMPOSITE_RANK = { critical: 4, high: 3, moderate: 2, low: 1 };
const FAILURE_RANK = { A: 5, B: 4, C: 3, D: 2, E: 1, '': 0 };

function escape(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sortValue(row, key) {
  const v = row[key];
  if (key === 'compositePriority') return COMPOSITE_RANK[v] || 0;
  if (key === 'scoreByFailureCondition') return FAILURE_RANK[v] || 0;
  if (typeof v === 'number') return v;
  if (v === null || v === undefined) return '';
  return String(v).toLowerCase();
}

function compare(a, b, key, dir) {
  const av = sortValue(a, key);
  const bv = sortValue(b, key);
  if (av < bv) return dir === 'asc' ? -1 : 1;
  if (av > bv) return dir === 'asc' ? 1 : -1;
  return 0;
}

function applyFilters(rows) {
  const search = (searchInput.value || '').trim().toLowerCase();
  const fields = ['ccSummary', 'systemName', 'ptAssignees'];

  return rows.filter((r) => {
    for (const sel of filterSelects) {
      const field = sel.dataset.field;
      const want = sel.value;
      if (!want) continue;
      if (String(r[field]) !== want) return false;
    }
    if (search) {
      const hay = fields.map((f) => String(r[f] ?? '').toLowerCase()).join(' ');
      if (!hay.includes(search)) return false;
    }
    return true;
  });
}

function render() {
  const all = SAMPLE_ISSUES || [];
  const filtered = applyFilters(all);
  const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey, sortDir));

  rowCount.textContent =
    `Showing ${sorted.length} of ${all.length} issues, sorted by ${sortKey} ${sortDir === 'asc' ? '▲' : '▼'}.`;

  if (sorted.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="13" class="no-results">No matching issues.</td></tr>`;
    return;
  }

  tableBody.innerHTML = sorted.map((r) => `
    <tr data-id="${escape(r.id)}">
      <td>${escape(r.id)}</td>
      <td>${escape(r.status)}</td>
      <td><span class="badge ${escape(r.compositePriority)}">${escape(r.compositePriority)}</span></td>
      <td>${escape(r.scoreBySeverityOfImpact ?? '—')}</td>
      <td>${escape(r.scoreByHarmGrade ?? '—')}</td>
      <td>${escape(r.scoreByFailureCondition ?? '—')}</td>
      <td>${escape(r.scoreByPriorityRank ?? '—')}</td>
      <td>${escape(r.scoreByFrequencyPercent ?? '—')}</td>
      <td><span class="cc-summary" title="${escape(r.ccSummary)}">${escape(r.ccSummary)}</span></td>
      <td>${escape(r.systemName)}</td>
      <td>${escape(r.environment)}</td>
      <td>${escape(r.ptAssignees)}</td>
      <td>${escape((r.reportedAt || '').slice(0, 10))}</td>
    </tr>
  `).join('');
}

function updateSortIndicators() {
  headers.forEach((h) => {
    const k = h.dataset.sort;
    if (k === sortKey) {
      h.setAttribute('aria-sort', sortDir === 'asc' ? 'ascending' : 'descending');
    } else {
      h.removeAttribute('aria-sort');
    }
  });
}

headers.forEach((h) => {
  h.addEventListener('click', () => {
    const k = h.dataset.sort;
    if (k === sortKey) {
      sortDir = sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      sortKey = k;
      sortDir = 'asc';
    }
    updateSortIndicators();
    render();
  });
});

searchInput.addEventListener('input', render);
filterSelects.forEach((sel) => sel.addEventListener('change', render));

updateSortIndicators();
render();
