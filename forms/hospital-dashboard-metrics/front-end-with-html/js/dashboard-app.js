import { fetchDashboardMetrics } from './api.js';

const TOTAL_METRICS = 67;

const COMPLETENESS = ['complete', 'partial'];
const COMPLETENESS_LABEL = {
  complete: 'All recorded (67/67)',
  partial: 'Partial',
};

const state = {
  rows: [],
  search: '',
  filterCompleteness: '',
  filterHospital: '',
  sortKey: 'period',
  sortDir: 'desc',
};

function completeness(recordedCount) {
  return recordedCount >= TOTAL_METRICS ? 'complete' : 'partial';
}

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

function uniqueHospitals(rows) {
  const set = new Set();
  rows.forEach(function (r) { set.add(r.hospitalName); });
  return Array.from(set).sort();
}

function matchesSearch(row, term) {
  if (!term) return true;
  const haystack = (row.hospitalName + ' ' + row.preparedByName).toLowerCase();
  return haystack.indexOf(term.toLowerCase()) !== -1;
}

function applySortAndFilter(rows) {
  const filtered = rows
    .filter(function (r) { return !state.filterCompleteness || completeness(r.recordedCount) === state.filterCompleteness; })
    .filter(function (r) { return !state.filterHospital || r.hospitalName === state.filterHospital; })
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
  tileRow.innerHTML = '';
  const total = state.rows.length;
  const complete = state.rows.filter(function (r) { return completeness(r.recordedCount) === 'complete'; }).length;
  const partial = total - complete;
  const avgRecorded = total
    ? Math.round(state.rows.reduce(function (s, r) { return s + r.recordedCount; }, 0) / total)
    : 0;

  [
    { label: 'Reporting periods', value: String(total) },
    { label: 'Fully recorded', value: String(complete) },
    { label: 'Partial', value: String(partial) },
    { label: 'Avg. metrics recorded', value: String(avgRecorded) + ' / ' + TOTAL_METRICS },
  ].forEach(function (t) {
    tileRow.appendChild(el('div', { class: 'tile' }, [
      el('p', { class: 'label' }, [t.label]),
      el('p', { class: 'value' }, [t.value]),
    ]));
  });
}

function renderFilters() {
  const completenessSel = document.getElementById('filter-completeness');
  completenessSel.innerHTML = '';
  completenessSel.appendChild(el('option', { value: '' }, ['All']));
  COMPLETENESS.forEach(function (c) {
    const opt = el('option', { value: c }, [COMPLETENESS_LABEL[c]]);
    if (state.filterCompleteness === c) opt.setAttribute('selected', 'selected');
    completenessSel.appendChild(opt);
  });

  const hospSel = document.getElementById('filter-hospital');
  hospSel.innerHTML = '';
  hospSel.appendChild(el('option', { value: '' }, ['All']));
  uniqueHospitals(state.rows).forEach(function (h) {
    const opt = el('option', { value: h }, [h]);
    if (state.filterHospital === h) opt.setAttribute('selected', 'selected');
    hospSel.appendChild(opt);
  });
}

function renderTable() {
  const filtered = applySortAndFilter(state.rows);
  document.getElementById('results-count').textContent = filtered.length + ' results';

  const tbody = document.getElementById('rows');
  tbody.innerHTML = '';
  filtered.forEach(function (r) {
    const band = completeness(r.recordedCount);
    const detailLink = el('a', {
      href: '#submission-' + r.id,
      class: 'detail-link',
      'data-detail-id': r.id,
    }, ['Detail →']);
    detailLink.addEventListener('click', function (ev) {
      ev.preventDefault();
      renderDetail(r.id);
    });
    tbody.appendChild(el('tr', { class: 'data-table-row band-' + (band === 'complete' ? 'clear' : 'medium') }, [
      el('td', { class: 'data-table-td' }, [r.period]),
      el('td', { class: 'data-table-td' }, [r.hospitalName]),
      el('td', { class: 'data-table-td' }, [r.preparedByName]),
      el('td', { class: 'data-table-td' }, [r.recordedCount + ' / ' + TOTAL_METRICS]),
      el('td', { class: 'data-table-td band' }, [COMPLETENESS_LABEL[band]]),
      el('td', { class: 'data-table-td' }, [detailLink]),
    ]));
  });
}

function renderDetail(id) {
  const detail = document.getElementById('detail-panel');
  if (!detail) return;
  const row = state.rows.find(function (r) { return r.id === id; });
  detail.innerHTML = '';
  if (!row) {
    detail.appendChild(el('p', { class: 'detail-empty' }, [
      'No submission found with id ', el('code', null, [id]), '.',
    ]));
    return;
  }
  const band = completeness(row.recordedCount);

  function metaRow(label, value) {
    return el('div', { class: 'detail-meta-row' }, [
      el('dt', null, [label]),
      el('dd', null, [value]),
    ]);
  }

  const close = el('button', { type: 'button', class: 'detail-close', 'aria-label': 'Close detail panel' }, ['Close ✕']);
  close.addEventListener('click', function () { detail.innerHTML = ''; });

  detail.appendChild(el('div', { class: 'detail-header' }, [
    el('h2', null, [row.hospitalName]),
    close,
  ]));
  detail.appendChild(el('p', { class: 'detail-sub' }, [
    'Submission ', el('code', null, [row.id]), ' · ' + row.period,
  ]));
  detail.appendChild(el('div', { class: 'detail-banner band-' + (band === 'complete' ? 'clear' : 'medium') }, [
    el('p', { class: 'band' }, [
      el('strong', null, ['Completeness: ']),
      COMPLETENESS_LABEL[band],
    ]),
    el('p', null, [
      el('strong', null, ['Metrics recorded: ']),
      row.recordedCount + ' / ' + TOTAL_METRICS,
    ]),
  ]));

  detail.appendChild(el('h3', null, ['Reporting period']));
  detail.appendChild(el('dl', { class: 'detail-meta' }, [
    metaRow('Hospital / site', row.hospitalName),
    metaRow('Period', row.period),
    metaRow('Prepared by', row.preparedByName),
  ]));

  detail.appendChild(el('h3', null, ['Categories with unrecorded metrics']));
  if (row.categoryGaps.length === 0) {
    detail.appendChild(el('p', { class: 'detail-empty' }, ['None — every metric was recorded for this reporting period.']));
  } else {
    detail.appendChild(el('ul', { class: 'detail-list' },
      row.categoryGaps.map(function (c) { return el('li', null, [c]); }),
    ));
  }

  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setStatus(msg, kind) {
  const el2 = document.getElementById('import-status');
  if (!el2) return;
  el2.textContent = msg || '';
  el2.className = 'import-status' + (kind ? ' import-status-' + kind : '');
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
      ? when.toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
        })
      : '';
    setStatus('Offline — showing cached data from ' + stamp + '.', 'warn');
  } else if (result.source === 'sample') {
    setStatus('Showing bundled sample data (no backend reachable).', 'warn');
  } else {
    setStatus('', '');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  fetchDashboardMetrics().then(applyFetchResult);

  document.getElementById('filter-search').addEventListener('input', function (ev) {
    state.search = ev.target.value;
    renderTable();
  });
  document.getElementById('filter-completeness').addEventListener('change', function (ev) {
    state.filterCompleteness = ev.target.value;
    renderTable();
  });
  document.getElementById('filter-hospital').addEventListener('change', function (ev) {
    state.filterHospital = ev.target.value;
    renderTable();
  });

  bindHeaderSorts();
});
