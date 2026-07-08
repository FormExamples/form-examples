(function () {
  'use strict';
  const NS = window.AgilePrinciplesDashboard;
  const MATURITIES = ['optimising', 'mature', 'developing', 'initial', 'ad-hoc', 'insufficient-data'];
  const ROLES = [
    'individual-contributor',
    'team-lead',
    'scrum-master',
    'product-owner',
    'engineering-manager',
    'agile-coach',
    'executive-sponsor',
    'other',
  ];

  const state = {
    rows: [],
    filterMaturity: '',
    filterRole: '',
    sortKey: 'date',
    sortDir: 'desc',
    view: 'individuals',
  };

  function deriveMaturity(meanScore) {
    if (meanScore === null) return 'insufficient-data';
    if (meanScore >= 4.5) return 'optimising';
    if (meanScore >= 3.75) return 'mature';
    if (meanScore >= 3.0) return 'developing';
    if (meanScore >= 2.0) return 'initial';
    return 'ad-hoc';
  }

  function aggregateByTeam(rows) {
    const groups = new Map();
    rows.forEach(function (r) {
      const key = r.team + '\x00' + r.organisation;
      const list = groups.get(key);
      if (list) list.push(r);
      else groups.set(key, [r]);
    });
    const out = [];
    groups.forEach(function (list) {
      const scored = list.filter(function (r) { return r.meanScore !== null && r.meanScore !== undefined; });
      const meanOfMeans = scored.length
        ? Math.round((scored.reduce(function (s, r) { return s + r.meanScore; }, 0) / scored.length) * 100) / 100
        : null;
      const flagCounts = new Map();
      list.forEach(function (r) { r.flags.forEach(function (f) { flagCounts.set(f, (flagCounts.get(f) || 0) + 1); }); });
      const topFlags = Array.from(flagCounts.entries())
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 3)
        .map(function (entry) { return entry[0]; });
      const trend = scored
        .slice()
        .sort(function (a, b) { return a.date.localeCompare(b.date); })
        .map(function (r) { return { date: r.date, meanScore: r.meanScore }; });
      out.push({
        team: list[0].team,
        organisation: list[0].organisation,
        count: list.length,
        meanOfMeans: meanOfMeans,
        maturity: deriveMaturity(meanOfMeans),
        topFlags: topFlags,
        trend: trend,
      });
    });
    out.sort(function (a, b) { return a.team.localeCompare(b.team); });
    return out;
  }

  const SPARK_STROKE = {
    'optimising': '#15803d',
    'mature': '#16a34a',
    'developing': '#ca8a04',
    'initial': '#ea580c',
    'ad-hoc': '#dc2626',
    'insufficient-data': '#94a3b8',
  };

  function sparklineSvg(trend, maturity) {
    if (!trend.length) {
      const span = document.createElement('span');
      span.className = 'spark-empty';
      span.textContent = '—';
      return span;
    }
    const width = 100;
    const height = 28;
    const padding = 2;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;
    const xStep = trend.length === 1 ? 0 : innerW / (trend.length - 1);
    const points = trend.map(function (p, i) {
      const x = padding + (trend.length === 1 ? innerW / 2 : i * xStep);
      const y = padding + innerH - ((p.meanScore - 1) / 4) * innerH;
      return { x: x, y: y };
    });
    const pathD = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y; }).join(' ');
    const last = points[points.length - 1];
    const stroke = SPARK_STROKE[maturity] || '#94a3b8';

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Trend of mean score over time');
    const title = document.createElementNS(NS, 'title');
    title.textContent = trend.map(function (p) { return p.date + ': ' + p.meanScore.toFixed(2); }).join('\n');
    svg.appendChild(title);
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', '1.5');
    svg.appendChild(path);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('cx', String(last.x));
    dot.setAttribute('cy', String(last.y));
    dot.setAttribute('r', '2');
    dot.setAttribute('fill', stroke);
    svg.appendChild(dot);
    return svg;
  }

  function rowsToCsv(rows) {
    const headers = ['id', 'date', 'respondent', 'role', 'team', 'organisation',
      'answered', 'meanScore', 'maturity', 'weakPrinciples', 'flags'];
    function esc(v) { return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    const lines = [headers.join(',')];
    rows.forEach(function (r) {
      lines.push([
        r.id, r.date,
        r.isAnonymous ? 'Anonymous' : r.respondent,
        r.isAnonymous ? '' : r.role,
        r.team, r.organisation,
        String(r.answered),
        r.meanScore !== null && r.meanScore !== undefined ? r.meanScore.toFixed(2) : '',
        r.maturity,
        r.weakPrinciples.join('; '),
        r.flags.join('; '),
      ].map(esc).join(','));
    });
    return lines.join('\n') + '\n';
  }

  function downloadCsv(filename, csv) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  function applySortAndFilter(rows) {
    const filtered = rows
      .filter(function (r) { return !state.filterMaturity || r.maturity === state.filterMaturity; })
      .filter(function (r) { return !state.filterRole || r.role === state.filterRole; });
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
    MATURITIES.forEach(function (m) {
      const n = state.rows.filter(function (r) { return r.maturity === m; }).length;
      tileRow.appendChild(el('div', { class: 'tile' }, [
        el('p', { class: 'label' }, [m]),
        el('p', { class: 'value' }, [String(n)]),
      ]));
    });
  }

  function renderFilters() {
    const matSel = document.getElementById('filter-maturity');
    matSel.innerHTML = '';
    matSel.appendChild(el('option', { value: '' }, ['All']));
    MATURITIES.forEach(function (m) {
      const opt = el('option', { value: m }, [m]);
      if (state.filterMaturity === m) opt.setAttribute('selected', 'selected');
      matSel.appendChild(opt);
    });

    const roleSel = document.getElementById('filter-role');
    roleSel.innerHTML = '';
    roleSel.appendChild(el('option', { value: '' }, ['All']));
    ROLES.forEach(function (r) {
      const opt = el('option', { value: r }, [r]);
      if (state.filterRole === r) opt.setAttribute('selected', 'selected');
      roleSel.appendChild(opt);
    });
  }

  function renderTable() {
    const filtered = applySortAndFilter(state.rows);
    document.getElementById('results-count').textContent = filtered.length + ' results';

    const tbody = document.getElementById('rows');
    tbody.innerHTML = '';
    filtered.forEach(function (r) {
      const respondentText = r.isAnonymous ? 'Anonymous \uD83D\uDD12' : r.respondent;
      const roleText = r.isAnonymous ? '—' : r.role;
      tbody.appendChild(el('tr', { class: 'maturity-' + r.maturity }, [
        el('td', null, [r.date]),
        el('td', null, [respondentText]),
        el('td', null, [roleText]),
        el('td', null, [r.team]),
        el('td', null, [r.organisation]),
        el('td', null, [r.answered + '/12']),
        el('td', null, [r.meanScore !== null && r.meanScore !== undefined ? r.meanScore.toFixed(2) : '—']),
        el('td', { class: 'maturity' }, [r.maturity]),
        el('td', null, [r.weakPrinciples.join(', ') || '—']),
        el('td', null, [r.flags.join(', ') || '—']),
      ]));
    });

    const teamTbody = document.getElementById('team-rows');
    teamTbody.innerHTML = '';
    aggregateByTeam(filtered).forEach(function (t) {
      const trendCell = el('td', null, []);
      trendCell.appendChild(sparklineSvg(t.trend, t.maturity));
      teamTbody.appendChild(el('tr', { class: 'maturity-' + t.maturity }, [
        el('td', null, [t.team]),
        el('td', null, [t.organisation]),
        el('td', null, [String(t.count)]),
        el('td', null, [t.meanOfMeans !== null ? t.meanOfMeans.toFixed(2) : '—']),
        el('td', { class: 'maturity' }, [t.maturity]),
        trendCell,
        el('td', null, [t.topFlags.join(', ') || '—']),
      ]));
    });
  }

  function setView(v) {
    state.view = v;
    document.getElementById('individuals-table').hidden = v !== 'individuals';
    document.getElementById('teams-table').hidden = v !== 'teams';
    document.getElementById('tab-individuals').classList.toggle('active', v === 'individuals');
    document.getElementById('tab-teams').classList.toggle('active', v === 'teams');
    document.getElementById('tab-individuals').setAttribute('aria-selected', String(v === 'individuals'));
    document.getElementById('tab-teams').setAttribute('aria-selected', String(v === 'teams'));
  }

  function exportCsv() {
    downloadCsv('agile-principles-assessments.csv', rowsToCsv(applySortAndFilter(state.rows)));
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

  document.addEventListener('DOMContentLoaded', function () {
    NS.fetchAssessments().then(function (rows) {
      state.rows = rows;
      renderTiles();
      renderFilters();
      renderTable();
    });

    document.getElementById('filter-maturity').addEventListener('change', function (ev) {
      state.filterMaturity = ev.target.value;
      renderTable();
    });
    document.getElementById('filter-role').addEventListener('change', function (ev) {
      state.filterRole = ev.target.value;
      renderTable();
    });

    bindHeaderSorts();

    document.getElementById('tab-individuals').addEventListener('click', function () { setView('individuals'); });
    document.getElementById('tab-teams').addEventListener('click', function () { setView('teams'); });
    document.getElementById('export-csv').addEventListener('click', exportCsv);
  });
})();
