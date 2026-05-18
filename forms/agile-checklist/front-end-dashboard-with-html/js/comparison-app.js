(function () {
  'use strict';
  const NS = window.AgileChecklistDashboard;
  const C = NS.comparison;

  const QUADRANTS = [
    'healthy-adoption',
    'aspirational-gap',
    'cargo-cult',
    'pre-agile',
    'insufficient-data',
  ];

  const COLORS = {
    'healthy-adoption': '#15803d',
    'aspirational-gap': '#ca8a04',
    'cargo-cult': '#ea580c',
    'pre-agile': '#dc2626',
    'insufficient-data': '#94a3b8',
  };

  const state = {
    principlesRows: [],
    behaviourRows: [],
    principlesName: '',
    behaviourName: '',
  };

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') e.className = attrs[k];
        else if (k === 'html') e.innerHTML = attrs[k];
        else if (attrs[k] !== undefined && attrs[k] !== null) {
          e.setAttribute(k, attrs[k]);
        }
      });
    }
    (children || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      if (typeof c === 'string') e.appendChild(document.createTextNode(c));
      else e.appendChild(c);
    });
    return e;
  }

  function setStatus(msg, kind) {
    const el = document.getElementById('comp-status');
    if (!el) return;
    el.textContent = msg || '';
    el.className = 'import-status' + (kind ? ' import-status-' + kind : '');
  }

  function setFileMeta(side, rows, name) {
    const el = document.getElementById('meta-' + side);
    if (!el) return;
    el.textContent = rows + ' rows · ' + (name || 'no file loaded');
  }

  function importFile(side, file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = C.readSisterCsv(String(reader.result || ''));
        if (side === 'principles') {
          state.principlesRows = parsed;
          state.principlesName = file.name;
        } else {
          state.behaviourRows = parsed;
          state.behaviourName = file.name;
        }
        setFileMeta('principles', state.principlesRows.length, state.principlesName);
        setFileMeta('behaviour', state.behaviourRows.length, state.behaviourName);
        setStatus('Loaded ' + parsed.length + ' rows from ' + file.name + '.', 'ok');
        render();
      } catch (e) {
        setStatus('Import failed: ' + (e && e.message ? e.message : 'parse error'), 'warn');
      }
    };
    reader.onerror = function () { setStatus('Could not read file.', 'warn'); };
    reader.readAsText(file);
  }

  function clearAll() {
    state.principlesRows = [];
    state.behaviourRows = [];
    state.principlesName = '';
    state.behaviourName = '';
    setFileMeta('principles', 0, '');
    setFileMeta('behaviour', 0, '');
    setStatus('', '');
    render();
  }

  function dotPos(p) {
    if (!p.principles || !p.behaviour) return null;
    const ps = p.principles.score;
    const bs = p.behaviour.score;
    if (ps === null || bs === null) return null;
    const x = Math.max(0, Math.min(100, ((ps - 1) / 4) * 100));
    const y = Math.max(0, Math.min(100, bs));
    return { x: x, y: y };
  }

  function renderTiles(pairs) {
    const tiles = document.getElementById('comp-tiles');
    tiles.innerHTML = '';
    const totals = QUADRANTS.reduce(function (acc, q) { acc[q] = 0; return acc; }, {});
    pairs.forEach(function (p) { totals[p.quadrant] += 1; });
    QUADRANTS.forEach(function (q) {
      tiles.appendChild(el('div', { class: 'comp-tile q-' + q }, [
        el('p', { class: 'label' }, [C.QUADRANT_LABEL[q]]),
        el('p', { class: 'value' }, [String(totals[q])]),
      ]));
    });
  }

  function renderScatter(pairs) {
    const slot = document.getElementById('comp-scatter');
    slot.innerHTML = '';
    if (pairs.length === 0) return;

    const SVG = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('width', '360');
    svg.setAttribute('height', '260');
    svg.setAttribute('viewBox', '0 0 360 260');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Quadrant scatter: principles vs behaviour');

    function ns(tag, attrs) {
      const e = document.createElementNS(SVG, tag);
      Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
      return e;
    }

    svg.appendChild(ns('rect', { x: 40, y: 20, width: 280, height: 200, fill: '#f8fafc', stroke: '#cbd5e1' }));
    const vx = 40 + 280 * 0.6875;
    const hy = 20 + 200 * 0.25;
    svg.appendChild(ns('line', { x1: vx, y1: 20, x2: vx, y2: 220, stroke: '#94a3b8', 'stroke-dasharray': '3,3' }));
    svg.appendChild(ns('line', { x1: 40, y1: hy, x2: 320, y2: hy, stroke: '#94a3b8', 'stroke-dasharray': '3,3' }));

    function svgText(x, y, text, attrs) {
      const t = ns('text', Object.assign({ x: x, y: y, 'font-size': 11, fill: '#475569' }, attrs || {}));
      t.textContent = text;
      svg.appendChild(t);
    }
    svgText(180, 240, 'Principles maturity →', { 'text-anchor': 'middle' });
    const yAxis = ns('text', {
      x: 20, y: 120, 'text-anchor': 'middle', transform: 'rotate(-90,20,120)',
      'font-size': 11, fill: '#475569',
    });
    yAxis.textContent = 'Behaviour maturity →';
    svg.appendChild(yAxis);
    svgText(50, 35, 'cargo-cult', { 'font-size': 10, fill: '#ea580c' });
    svgText(310, 35, 'healthy', { 'font-size': 10, fill: '#15803d', 'text-anchor': 'end' });
    svgText(50, 215, 'pre-agile', { 'font-size': 10, fill: '#dc2626' });
    svgText(310, 215, 'aspirational', { 'font-size': 10, fill: '#ca8a04', 'text-anchor': 'end' });

    pairs.forEach(function (p) {
      const pos = dotPos(p);
      if (!pos) return;
      const cx = 40 + (pos.x / 100) * 280;
      const cy = 220 - (pos.y / 100) * 200;
      const dot = ns('circle', { cx: cx, cy: cy, r: 5, fill: COLORS[p.quadrant], 'fill-opacity': '0.85' });
      svg.appendChild(dot);
      const lbl = ns('text', { x: cx + 8, y: cy + 3, 'font-size': 10, fill: '#0f172a' });
      lbl.textContent = p.team;
      svg.appendChild(lbl);
    });

    slot.appendChild(svg);
  }

  function renderTable(pairs) {
    const tbody = document.getElementById('comp-rows');
    tbody.innerHTML = '';
    pairs.forEach(function (p) {
      const principles = p.principles
        ? el('span', null, [p.principles.scoreDisplay + ' · ',
            el('span', { class: 'upper' }, [p.principles.maturity])])
        : el('span', { class: 'muted' }, ['— no row']);
      const behaviour = p.behaviour
        ? el('span', null, [p.behaviour.scoreDisplay + ' · ',
            el('span', { class: 'upper' }, [p.behaviour.maturity])])
        : el('span', { class: 'muted' }, ['— no row']);
      tbody.appendChild(el('tr', { class: 'q-' + p.quadrant }, [
        el('td', null, [p.team]),
        el('td', null, [p.organisation]),
        el('td', null, [principles]),
        el('td', null, [behaviour]),
        el('td', { class: 'upper q-label' }, [C.QUADRANT_LABEL[p.quadrant]]),
        el('td', { class: 'muted-small' }, [C.QUADRANT_DESC[p.quadrant]]),
      ]));
    });
  }

  function render() {
    const pairs = C.pairSubmissions(state.principlesRows, state.behaviourRows);
    renderTiles(pairs);
    renderScatter(pairs);
    renderTable(pairs);
    document.getElementById('comp-empty').hidden = pairs.length > 0;
    document.getElementById('comp-content').hidden = pairs.length === 0;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('comp-principles')
      .addEventListener('change', function (ev) {
        const f = ev.target.files && ev.target.files[0];
        if (f) importFile('principles', f);
        ev.target.value = '';
      });
    document.getElementById('comp-behaviour')
      .addEventListener('change', function (ev) {
        const f = ev.target.files && ev.target.files[0];
        if (f) importFile('behaviour', f);
        ev.target.value = '';
      });
    document.getElementById('comp-clear').addEventListener('click', clearAll);
    render();
  });
})();
