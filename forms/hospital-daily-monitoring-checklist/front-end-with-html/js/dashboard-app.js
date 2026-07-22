import { fetchChecklists } from './api.js';

const BANDS = ['clear', 'low', 'medium', 'high'];
const BAND_LABEL = {
  clear: 'Clear (0)',
  low: 'Low (1–3)',
  medium: 'Medium (4–10)',
  high: 'High (11+)',
};

const state = {
  rows: [],
  filterBand: '',
  filterHospital: '',
  sortKey: 'date',
  sortDir: 'desc',
};

function attentionBand(count) {
  if (!count) return 'clear';
  if (count <= 3) return 'low';
  if (count <= 10) return 'medium';
  return 'high';
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

function applySortAndFilter(rows) {
  const filtered = rows
    .filter(function (r) { return !state.filterBand || attentionBand(r.needsAttentionCount) === state.filterBand; })
    .filter(function (r) { return !state.filterHospital || r.hospitalName === state.filterHospital; });
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
  const clear = state.rows.filter(function (r) { return attentionBand(r.needsAttentionCount) === 'clear'; }).length;
  const flagged = total - clear;
  const avgAnswered = total
    ? Math.round(state.rows.reduce(function (s, r) { return s + r.answeredCount; }, 0) / total)
    : 0;
  const avgNeedsAttention = total
    ? Math.round((state.rows.reduce(function (s, r) { return s + r.needsAttentionCount; }, 0) / total) * 10) / 10
    : 0;

  [
    { label: 'Submissions', value: String(total) },
    { label: 'Clear rounds', value: String(clear) },
    { label: 'Rounds flagged', value: String(flagged) },
    { label: 'Avg. checkpoints answered', value: String(avgAnswered) + ' / 97' },
    { label: 'Avg. needs attention', value: String(avgNeedsAttention) },
  ].forEach(function (t) {
    tileRow.appendChild(el('div', { class: 'tile' }, [
      el('p', { class: 'label' }, [t.label]),
      el('p', { class: 'value' }, [t.value]),
    ]));
  });
}

function renderFilters() {
  const bandSel = document.getElementById('filter-band');
  bandSel.innerHTML = '';
  bandSel.appendChild(el('option', { value: '' }, ['All']));
  BANDS.forEach(function (b) {
    const opt = el('option', { value: b }, [BAND_LABEL[b]]);
    if (state.filterBand === b) opt.setAttribute('selected', 'selected');
    bandSel.appendChild(opt);
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
    const band = attentionBand(r.needsAttentionCount);
    const detailLink = el('a', {
      href: '#submission-' + r.id,
      class: 'detail-link',
      'data-detail-id': r.id,
    }, ['Detail →']);
    detailLink.addEventListener('click', function (ev) {
      ev.preventDefault();
      renderDetail(r.id);
    });
    tbody.appendChild(el('tr', { class: 'data-table-row band-' + band }, [
      el('td', { class: 'data-table-td' }, [r.date]),
      el('td', { class: 'data-table-td' }, [r.hospitalName]),
      el('td', { class: 'data-table-td' }, [r.departmentOrSite]),
      el('td', { class: 'data-table-td' }, [r.inspectingOfficerName]),
      el('td', { class: 'data-table-td' }, [r.answeredCount + '/97']),
      el('td', { class: 'data-table-td' }, [String(r.needsAttentionCount)]),
      el('td', { class: 'data-table-td' }, [String(r.sectionsFlaggedCount)]),
      el('td', { class: 'data-table-td band' }, [BAND_LABEL[band]]),
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
  const band = attentionBand(row.needsAttentionCount);

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
    'Submission ', el('code', null, [row.id]), ' · ' + row.date,
  ]));
  detail.appendChild(el('div', { class: 'detail-banner band-' + band }, [
    el('p', { class: 'band' }, [
      el('strong', null, ['Attention band: ']),
      BAND_LABEL[band],
    ]),
    el('p', null, [
      el('strong', null, ['Checkpoints answered: ']),
      row.answeredCount + ' / 97',
      ' · ',
      el('strong', null, ['Needs attention: ']),
      String(row.needsAttentionCount),
      ' · ',
      el('strong', null, ['Areas flagged: ']),
      String(row.sectionsFlaggedCount),
    ]),
  ]));

  detail.appendChild(el('h3', null, ['Round']));
  detail.appendChild(el('dl', { class: 'detail-meta' }, [
    metaRow('Hospital / site', row.hospitalName),
    metaRow('Department / site', row.departmentOrSite),
    metaRow('Inspecting officer', row.inspectingOfficerName),
    metaRow('Designation', row.inspectingOfficerDesignation),
  ]));

  detail.appendChild(el('h3', null, ['Areas flagged "needs attention"']));
  if (row.topFlaggedAreas.length === 0) {
    detail.appendChild(el('p', { class: 'detail-empty' }, ['No areas flagged — every answered checkpoint was satisfactory or not applicable.']));
  } else {
    detail.appendChild(el('ul', { class: 'detail-list' },
      row.topFlaggedAreas.map(function (a) { return el('li', null, [a]); }),
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
  fetchChecklists().then(applyFetchResult);

  document.getElementById('filter-band').addEventListener('change', function (ev) {
    state.filterBand = ev.target.value;
    renderTable();
  });
  document.getElementById('filter-hospital').addEventListener('change', function (ev) {
    state.filterHospital = ev.target.value;
    renderTable();
  });

  bindHeaderSorts();
});
