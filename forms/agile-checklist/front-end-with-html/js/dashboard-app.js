import { fetchChecklists } from './api.js';
import { SAMPLE_CHECKLISTS } from './data.js';

  
  const MATURITIES = ['optimising', 'mature', 'developing', 'initial', 'ad-hoc', 'insufficient-data'];
  const ROLES = [
    'team-member',
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

  function deriveMaturity(overallPercent) {
    if (overallPercent === null || overallPercent === undefined) return 'insufficient-data';
    if (overallPercent >= 90) return 'optimising';
    if (overallPercent >= 75) return 'mature';
    if (overallPercent >= 50) return 'developing';
    if (overallPercent >= 25) return 'initial';
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
      const scored = list.filter(function (r) { return r.overallPercent !== null && r.overallPercent !== undefined; });
      const meanOfMeans = scored.length
        ? Math.round((scored.reduce(function (s, r) { return s + r.overallPercent; }, 0) / scored.length) * 100) / 100
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
        .map(function (r) { return { date: r.date, overallPercent: r.overallPercent }; });
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
      const y = padding + innerH - (p.overallPercent / 100) * innerH;
      return { x: x, y: y };
    });
    const pathD = points.map(function (p, i) { return (i === 0 ? 'M' : 'L') + p.x + ',' + p.y; }).join(' ');
    const last = points[points.length - 1];
    const stroke = SPARK_STROKE[maturity] || '#94a3b8';

    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Trend of overall percent over time');
    const title = document.createElementNS(SVG_NS, 'title');
    title.textContent = trend.map(function (p) { return p.date + ': ' + p.overallPercent.toFixed(0) + '%'; }).join('\n');
    svg.appendChild(title);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', '1.5');
    svg.appendChild(path);
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('cx', String(last.x));
    dot.setAttribute('cy', String(last.y));
    dot.setAttribute('r', '2');
    dot.setAttribute('fill', stroke);
    svg.appendChild(dot);
    return svg;
  }

  function rowsToCsv(rows) {
    const headers = ['id', 'date', 'respondent', 'role', 'team', 'organisation',
      'answered', 'teamsPercent', 'stakeholdersPercent', 'practicesPercent',
      'overallPercent', 'maturity', 'weakSections', 'flags'];
    function esc(v) { return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    function fmtPct(n) { return n === null || n === undefined ? '' : Math.round(n).toString(); }
    const lines = [headers.join(',')];
    rows.forEach(function (r) {
      lines.push([
        r.id, r.date,
        r.isAnonymous ? 'Anonymous' : r.respondent,
        r.isAnonymous ? '' : r.role,
        r.team, r.organisation,
        String(r.answered),
        fmtPct(r.teamsPercent),
        fmtPct(r.stakeholdersPercent),
        fmtPct(r.practicesPercent),
        fmtPct(r.overallPercent),
        r.maturity,
        r.weakSections.join('; '),
        r.flags.join('; '),
      ].map(esc).join(','));
    });
    return lines.join('\n') + '\n';
  }

  function parseCsv(text) {
    // RFC4180-ish parser that handles "quoted, commas" and ""escaped quotes"".
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"') {
          if (text[i + 1] === '"') { field += '"'; i += 1; }
          else { inQuotes = false; }
        } else {
          field += c;
        }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ''; }
        else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
        else if (c === '\r') { /* ignore */ }
        else field += c;
      }
    }
    if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
    return rows.filter(function (r) { return r.length > 1 || (r.length === 1 && r[0] !== ''); });
  }

  function rowsFromCsv(text) {
    const rows = parseCsv(text);
    if (!rows.length) throw new Error('empty CSV');
    const headers = rows[0].map(function (h) { return h.trim(); });
    const colIndex = {};
    headers.forEach(function (h, i) { colIndex[h] = i; });
    const required = ['id', 'date', 'team', 'organisation', 'maturity'];
    for (const r of required) {
      if (!(r in colIndex)) throw new Error('missing required column: ' + r);
    }
    function pickPct(row, key) {
      const v = row[colIndex[key]];
      if (v === undefined || v === '') return null;
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    }
    function splitList(s) {
      return s ? s.split(/;\s*/).filter(Boolean) : [];
    }
    return rows.slice(1).map(function (row) {
      const respondent = (row[colIndex['respondent']] || '').trim();
      return {
        id: (row[colIndex['id']] || '').trim(),
        date: (row[colIndex['date']] || '').trim(),
        respondent: respondent,
        role: (row[colIndex['role']] || '').trim(),
        team: (row[colIndex['team']] || '').trim(),
        organisation: (row[colIndex['organisation']] || '').trim(),
        answered: Number(row[colIndex['answered']] || 0) || 0,
        teamsPercent: pickPct(row, 'teamsPercent'),
        stakeholdersPercent: pickPct(row, 'stakeholdersPercent'),
        practicesPercent: pickPct(row, 'practicesPercent'),
        overallPercent: pickPct(row, 'overallPercent'),
        maturity: (row[colIndex['maturity']] || 'insufficient-data').trim(),
        weakSections: splitList(row[colIndex['weakSections']] || ''),
        flags: splitList(row[colIndex['flags']] || ''),
        isAnonymous: respondent === 'Anonymous',
      };
    });
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

  function pct(p) {
    return p === null || p === undefined ? '—' : Math.round(p) + '%';
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
      const detailLink = el('a', {
        href: '#submission-' + r.id,
        class: 'detail-link',
        'data-detail-id': r.id,
      }, ['Detail \u2192']);
      detailLink.addEventListener('click', function (ev) {
        ev.preventDefault();
        renderDetail(r.id);
      });
      tbody.appendChild(el('tr', { class: 'data-table-row maturity-' + r.maturity }, [
        el('td', { class: 'data-table-td' }, [r.date]),
        el('td', { class: 'data-table-td' }, [respondentText]),
        el('td', { class: 'data-table-td' }, [roleText]),
        el('td', { class: 'data-table-td' }, [r.team]),
        el('td', { class: 'data-table-td' }, [r.organisation]),
        el('td', { class: 'data-table-td' }, [r.answered + '/57']),
        el('td', { class: 'data-table-td' }, [pct(r.teamsPercent)]),
        el('td', { class: 'data-table-td' }, [pct(r.stakeholdersPercent)]),
        el('td', { class: 'data-table-td' }, [pct(r.practicesPercent)]),
        el('td', { class: 'data-table-td overall' }, [pct(r.overallPercent)]),
        el('td', { class: 'data-table-td maturity' }, [r.maturity]),
        el('td', { class: 'data-table-td' }, [r.weakSections.join(', ') || '—']),
        el('td', { class: 'data-table-td' }, [r.flags.join(', ') || '—']),
        el('td', { class: 'data-table-td' }, [detailLink]),
      ]));
    });

    const teamTbody = document.getElementById('team-rows');
    teamTbody.innerHTML = '';
    aggregateByTeam(filtered).forEach(function (t) {
      const trendCell = el('td', { class: 'data-table-td' }, []);
      trendCell.appendChild(sparklineSvg(t.trend, t.maturity));
      teamTbody.appendChild(el('tr', { class: 'data-table-row maturity-' + t.maturity }, [
        el('td', { class: 'data-table-td' }, [t.team]),
        el('td', { class: 'data-table-td' }, [t.organisation]),
        el('td', { class: 'data-table-td' }, [String(t.count)]),
        el('td', { class: 'data-table-td' }, [t.meanOfMeans !== null ? Math.round(t.meanOfMeans) + '%' : '—']),
        el('td', { class: 'data-table-td maturity' }, [t.maturity]),
        trendCell,
        el('td', { class: 'data-table-td' }, [t.topFlags.join(', ') || '—']),
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
    const teammates = state.rows.filter(function (r) {
      return r.team === row.team && r.organisation === row.organisation;
    });
    const teamAgg = aggregateByTeam(teammates)[0];

    function metaRow(label, value) {
      return el('div', { class: 'detail-meta-row' }, [
        el('dt', null, [label]),
        el('dd', null, [value]),
      ]);
    }

    const close = el('button', { type: 'button', class: 'detail-close', 'aria-label': 'Close detail panel' }, ['Close \u2715']);
    close.addEventListener('click', function () { detail.innerHTML = ''; });

    detail.appendChild(el('div', { class: 'detail-header' }, [
      el('h2', null, [row.team + ' / ' + row.organisation]),
      close,
    ]));
    detail.appendChild(el('p', { class: 'detail-sub' }, [
      'Submission ', el('code', null, [row.id]), ' · ' + row.date,
    ]));
    detail.appendChild(el('div', { class: 'detail-banner maturity-' + row.maturity }, [
      el('p', { class: 'maturity' }, [
        el('strong', null, ['Composite maturity: ']),
        row.maturity.toUpperCase(),
      ]),
      el('p', null, [
        el('strong', null, ['Overall: ']),
        pct(row.overallPercent),
        ' · ',
        el('strong', null, ['Items answered: ']),
        row.answered + ' / 57',
      ]),
    ]));

    detail.appendChild(el('h3', null, ['Per-section breakdown']));
    const tbody = el('tbody', null, [
      el('tr', null, [el('td', null, ['Teams (25 items)']), el('td', { class: 'pct' }, [pct(row.teamsPercent)])]),
      el('tr', null, [el('td', null, ['Stakeholders (14 items)']), el('td', { class: 'pct' }, [pct(row.stakeholdersPercent)])]),
      el('tr', null, [el('td', null, ['Practices (18 items)']), el('td', { class: 'pct' }, [pct(row.practicesPercent)])]),
    ]);
    detail.appendChild(el('table', { class: 'detail-table' }, [
      el('thead', null, [el('tr', null, [el('th', null, ['Section']), el('th', null, ['Percent yes'])])]),
      tbody,
    ]));

    detail.appendChild(el('h3', null, ['Respondent']));
    detail.appendChild(el('dl', { class: 'detail-meta' }, [
      metaRow('Name', row.isAnonymous ? 'Anonymous 🔒' : (row.respondent || '—')),
      metaRow('Role', row.isAnonymous ? '—' : (row.role || '—')),
      metaRow('Team', row.team),
      metaRow('Organisation', row.organisation),
    ]));

    detail.appendChild(el('h3', null, ['Weak sections']));
    if (row.weakSections.length === 0) {
      detail.appendChild(el('p', { class: 'detail-empty' }, ['No section flagged as weak.']));
    } else {
      detail.appendChild(el('ul', { class: 'detail-list' },
        row.weakSections.map(function (s) { return el('li', null, [s]); }),
      ));
    }

    detail.appendChild(el('h3', null, ['Operational flags']));
    if (row.flags.length === 0) {
      detail.appendChild(el('p', { class: 'detail-empty' }, ['No operational flags raised.']));
    } else {
      detail.appendChild(el('ul', { class: 'detail-list' },
        row.flags.map(function (f) { return el('li', null, [el('code', null, [f])]); }),
      ));
    }

    if (teamAgg && teamAgg.trend.length > 1) {
      detail.appendChild(el('h3', null, ['Team trend']));
      const trendCell = el('div', { class: 'detail-trend' }, []);
      trendCell.appendChild(sparklineSvg(teamAgg.trend, teamAgg.maturity));
      detail.appendChild(el('p', { class: 'detail-sub' }, [
        'Mean of overall % across ' + teamAgg.count + ' submissions: ',
        el('strong', null, [teamAgg.meanOfMeans !== null ? Math.round(teamAgg.meanOfMeans) + '%' : '—']),
      ]));
      detail.appendChild(trendCell);
    }

    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    downloadCsv('agile-checklist-submissions.csv', rowsToCsv(applySortAndFilter(state.rows)));
  }

  function setStatus(msg, kind) {
    const el = document.getElementById('import-status');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'import-status' + (kind ? ' import-status-' + kind : '');
  }

  function importCsvFile(file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const rows = rowsFromCsv(String(reader.result || ''));
        if (!rows.length) {
          setStatus('No rows found in CSV.', 'warn');
          return;
        }
        state.rows = rows;
        state.filterMaturity = '';
        state.filterRole = '';
        renderTiles();
        renderFilters();
        renderTable();
        setStatus('Imported ' + rows.length + ' rows from ' + file.name + '.', 'ok');
      } catch (e) {
        setStatus('Import failed: ' + (e && e.message ? e.message : 'parse error'), 'warn');
      }
    };
    reader.onerror = function () {
      setStatus('Could not read file.', 'warn');
    };
    reader.readAsText(file);
  }

  function resetToSample() {
    state.rows = SAMPLE_CHECKLISTS.slice();
    state.filterMaturity = '';
    state.filterRole = '';
    renderTiles();
    renderFilters();
    renderTable();
    setStatus('Reset to sample data (' + state.rows.length + ' rows).', 'ok');
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
      // Avoid overwriting an explicit user message (e.g. after Reset).
      const el = document.getElementById('import-status');
      if (!el || !el.textContent || el.textContent.trim() === '') {
        setStatus('Showing bundled sample data (no backend reachable).', 'warn');
      }
    } else {
      setStatus('', '');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetchChecklists().then(applyFetchResult);

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

    const importInput = document.getElementById('import-csv');
    if (importInput) {
      importInput.addEventListener('change', function (ev) {
        const file = ev.target.files && ev.target.files[0];
        if (file) importCsvFile(file);
        ev.target.value = '';
      });
    }
    const resetBtn = document.getElementById('reset-sample');
    if (resetBtn) resetBtn.addEventListener('click', resetToSample);
  });
