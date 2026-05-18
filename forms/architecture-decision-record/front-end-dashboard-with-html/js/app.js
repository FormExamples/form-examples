/*
 * ADR register dashboard.
 *
 * Reads window.ARCHITECTURE_DECISION_RECORDS (set by data.js), renders a
 * sortable, filterable register table, and links each row to the rendered
 * Markdown ADR.
 */
(function () {
  'use strict';

  var DATA = window.ARCHITECTURE_DECISION_RECORDS || [];

  // Display order: superseded/deprecated last by default
  var STATUS_ORDER = ['pending', 'decided', 'approved', 'superseded', 'deprecated'];

  var sortKey = 'number';
  var sortDir = 'asc';
  var filters = { status: 'all', group: 'all', search: '' };

  function pad4(n) {
    if (n === null || n === undefined || n === '') return '';
    return String(n).padStart(4, '0');
  }

  function compare(a, b, key) {
    var av = a[key], bv = b[key];
    if (key === 'status') {
      av = STATUS_ORDER.indexOf(av);
      bv = STATUS_ORDER.indexOf(bv);
    }
    if (av == null) av = '';
    if (bv == null) bv = '';
    if (typeof av === 'number' && typeof bv === 'number') return av - bv;
    return String(av).localeCompare(String(bv));
  }

  function applyFilters(rows) {
    var q = filters.search.trim().toLowerCase();
    return rows.filter(function (r) {
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.group !== 'all' && r.decisionGroup !== filters.group) return false;
      if (q) {
        var hay = [r.title, r.slug, r.authorName].join(' ').toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function applySort(rows) {
    var sorted = rows.slice();
    sorted.sort(function (a, b) {
      var c = compare(a, b, sortKey);
      return sortDir === 'asc' ? c : -c;
    });
    return sorted;
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) node.setAttribute(k, attrs[k]);
    }
    if (children) {
      if (!Array.isArray(children)) children = [children];
      children.forEach(function (c) {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function render() {
    var filtered = applyFilters(DATA);
    var rows = applySort(filtered);

    var tbody = document.getElementById('adr-tbody');
    tbody.innerHTML = '';

    rows.forEach(function (r) {
      var tr = el('tr', {
        onclick: function () {
          if (r.markdownUrl) window.open(r.markdownUrl, '_blank', 'noopener');
        }
      }, [
        el('td', { class: 'number-cell' }, pad4(r.number)),
        el('td', { class: 'title-cell' }, r.title),
        el('td', null, [
          el('span', {
            class: 'status-pill',
            'data-status': r.status
          }, r.status)
        ]),
        el('td', null, r.decisionGroup || '—'),
        el('td', null, r.decisionDate || '—'),
        el('td', null, r.authorName || '—')
      ]);
      tbody.appendChild(tr);
    });

    document.getElementById('empty-state').hidden = rows.length > 0;
    document.getElementById('filter-stats').textContent =
      rows.length + ' of ' + DATA.length + ' ADR' + (DATA.length === 1 ? '' : 's');

    document.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.sort === sortKey) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function wire() {
    document.querySelectorAll('th[data-sort]').forEach(function (th) {
      th.addEventListener('click', function () {
        var key = th.dataset.sort;
        if (sortKey === key) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortKey = key;
          sortDir = 'asc';
        }
        render();
      });
    });

    document.querySelectorAll('input[name="status-filter"]').forEach(function (input) {
      input.addEventListener('change', function () { filters.status = input.value; render(); });
    });

    document.getElementById('group-filter').addEventListener('change', function (e) {
      filters.group = e.target.value;
      render();
    });

    document.getElementById('search').addEventListener('input', function (e) {
      filters.search = e.target.value;
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    wire();
    render();
  });
})();
