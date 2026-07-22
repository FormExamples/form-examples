import { fetchPatientReportedOutcomeMeasures } from './api.js';

const NDI_BAND_LABEL = {
  'no-disability': 'No disability',
  mild: 'Mild disability',
  moderate: 'Moderate disability',
  severe: 'Severe disability',
  complete: 'Complete disability'
};

const MJOA_BAND_LABEL = {
  mild: 'Mild myelopathy',
  moderate: 'Moderate myelopathy',
  severe: 'Severe myelopathy'
};

const state = {
  rows: [],
  search: '',
  filterNdiBand: '',
  sortKey: 'assessmentDate',
  sortDir: 'desc'
};

function el(tag, attrs, children) {
  const e = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'on') {
        Object.keys(attrs[k]).forEach(function (ev) { e.addEventListener(ev, attrs[k][ev]); });
      } else e.setAttribute(k, attrs[k]);
    });
  }
  (children || []).forEach(function (c) {
    if (c === null || c === undefined) return;
    if (typeof c === 'string') e.appendChild(document.createTextNode(c));
    else e.appendChild(c);
  });
  return e;
}

function uniqueNdiBands(rows) {
  const set = new Set();
  rows.forEach(function (r) { set.add(r.ndiBand); });
  return Array.from(set).sort();
}

function matchesSearch(row, term) {
  if (!term) return true;
  const haystack = (row.subjectId + ' ' + row.visit).toLowerCase();
  return haystack.indexOf(term.toLowerCase()) !== -1;
}

function applySortAndFilter(rows) {
  const filtered = rows
    .filter(function (r) { return !state.filterNdiBand || r.ndiBand === state.filterNdiBand; })
    .filter(function (r) { return matchesSearch(r, state.search); });
  return filtered.sort(function (a, b) {
    const av = a[state.sortKey];
    const bv = b[state.sortKey];
    if (av === null || av === undefined) return 1;
    if (bv === null || bv === undefined) return -1;
    if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
    if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function renderTiles() {
  const tileRow = document.getElementById('tile-row');
  if (!tileRow) return;
  tileRow.innerHTML = '';
  const total = state.rows.length;
  const subjects = new Set(state.rows.map(function (r) { return r.subjectId; })).size;
  const avgVas = total
    ? Math.round(state.rows.reduce(function (s, r) { return s + (r.eq5dVas || 0); }, 0) / total)
    : 0;
  const avgIndex = total
    ? (state.rows.reduce(function (s, r) { return s + (r.eq5dIndex || 0); }, 0) / total).toFixed(2)
    : '0.00';

  [
    { label: 'Assessments', value: String(total) },
    { label: 'Subjects', value: String(subjects) },
    { label: 'Avg. EQ VAS', value: String(avgVas) + ' / 100' },
    { label: 'Avg. EQ-5D index', value: avgIndex }
  ].forEach(function (t) {
    tileRow.appendChild(el('div', { class: 'tile' }, [
      el('p', { class: 'label' }, [t.label]),
      el('p', { class: 'value' }, [t.value])
    ]));
  });
}

function renderFilters() {
  const bandSel = document.getElementById('filter-ndi-band');
  if (!bandSel) return;
  bandSel.innerHTML = '';
  bandSel.appendChild(el('option', { value: '' }, ['All']));
  uniqueNdiBands(state.rows).forEach(function (b) {
    const opt = el('option', { value: b }, [NDI_BAND_LABEL[b] || b]);
    if (state.filterNdiBand === b) opt.setAttribute('selected', 'selected');
    bandSel.appendChild(opt);
  });
}

function renderTable() {
  const filtered = applySortAndFilter(state.rows);
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) resultsCount.textContent = filtered.length + ' results';

  const tbody = document.getElementById('rows');
  if (!tbody) return;
  tbody.innerHTML = '';
  filtered.forEach(function (r) {
    tbody.appendChild(el('tr', { class: 'data-table-row' }, [
      el('td', { class: 'data-table-td' }, [r.subjectId]),
      el('td', { class: 'data-table-td' }, [r.visit]),
      el('td', { class: 'data-table-td' }, [r.assessmentDate]),
      el('td', { class: 'data-table-td' }, [NDI_BAND_LABEL[r.ndiBand] || r.ndiBand || '—']),
      el('td', { class: 'data-table-td' }, [MJOA_BAND_LABEL[r.mjoaBand] || r.mjoaBand || '—']),
      el('td', { class: 'data-table-td num' }, [r.eq5dIndex === null || r.eq5dIndex === undefined ? '—' : r.eq5dIndex.toFixed(3)])
    ]));
  });
  if (filtered.length === 0) {
    tbody.appendChild(el('tr', { class: 'data-table-row' }, [
      el('td', { class: 'data-table-td', colspan: '6' }, ['No results match the current search / filter.'])
    ]));
  }
}

function setStatus(msg, kind) {
  const s = document.getElementById('import-status');
  if (!s) return;
  s.textContent = msg || '';
  s.className = 'import-status' + (kind ? ' import-status-' + kind : '');
}

function setSort(k) {
  if (state.sortKey === k) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
  else { state.sortKey = k; state.sortDir = 'asc'; }
  renderTable();
}

function bindHeaderSorts() {
  document.querySelectorAll('th[data-sort]').forEach(function (th) {
    th.addEventListener('click', function () { setSort(th.getAttribute('data-sort')); });
  });
}

function applyFetchResult(result) {
  if (!result || !Array.isArray(result.rows)) return;
  state.rows = result.rows;
  renderTiles();
  renderFilters();
  renderTable();
  if (result.source === 'cache') {
    const when = result.fetchedAt ? new Date(result.fetchedAt) : null;
    const stamp = when
      ? when.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
      : '';
    setStatus('Offline — showing cached data from ' + stamp + '.', 'warn');
  } else if (result.source === 'sample') {
    setStatus('Showing bundled sample data (no backend reachable).', 'warn');
  } else {
    setStatus('', '');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetchPatientReportedOutcomeMeasures().then(applyFetchResult);

  const search = document.getElementById('filter-search');
  if (search) search.addEventListener('input', function (ev) {
    state.search = ev.target.value;
    renderTable();
  });
  const bandSel = document.getElementById('filter-ndi-band');
  if (bandSel) bandSel.addEventListener('change', function (ev) {
    state.filterNdiBand = ev.target.value;
    renderTable();
  });

  bindHeaderSorts();
});
