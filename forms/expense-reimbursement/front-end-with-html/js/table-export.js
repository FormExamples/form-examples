// Dashboard table export — generic CSV / TSV download of the rendered table.
//
// Shared, form-agnostic: on load it finds the dashboard's primary data table
// (any `table[id$="-table"]`, else the first table in the main region) and
// injects a small toolbar with "Download CSV" and "Download TSV" buttons above
// it. Clicking serialises the currently rendered header + visible body rows —
// so active filters and sorting are reflected — with correct delimiter
// escaping, and triggers a download. No per-form knowledge required.
(function () {
  'use strict';

  function findTable() {
    return (
      document.querySelector('table[id$="-table"]') ||
      document.querySelector('main table') ||
      document.querySelector('table')
    );
  }

  function cellText(cell) {
    return (cell.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function visibleRows(tbody) {
    return Array.from(tbody.querySelectorAll('tr')).filter((tr) => {
      if (tr.hasAttribute('hidden')) return false;
      if (tr.getAttribute('aria-hidden') === 'true') return false;
      const style = tr.ownerDocument.defaultView.getComputedStyle(tr);
      if (style.display === 'none' || style.visibility === 'hidden') return false;
      // A placeholder "no results" row has a single cell spanning the table.
      const cells = tr.querySelectorAll('td, th');
      if (cells.length === 1 && cells[0].hasAttribute('colspan')) return false;
      return true;
    });
  }

  function escapeField(value, sep) {
    // Quote when the field contains the delimiter, a quote, or a newline.
    if (value.includes('"') || value.includes('\n') || value.includes(sep)) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  function serialise(table, sep) {
    const rows = [];
    const headCells = table.querySelectorAll('thead th, thead td');
    if (headCells.length) {
      rows.push(Array.from(headCells).map((c) => escapeField(cellText(c), sep)).join(sep));
    }
    const tbody = table.querySelector('tbody');
    if (tbody) {
      for (const tr of visibleRows(tbody)) {
        const cells = tr.querySelectorAll('td, th');
        rows.push(Array.from(cells).map((c) => escapeField(cellText(c), sep)).join(sep));
      }
    }
    return rows.join('\r\n') + '\r\n';
  }

  function download(text, mime, filename) {
    const blob = new Blob([text], { type: mime + ';charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function baseName(table) {
    const id = (table.id || 'dashboard').replace(/-table$/, '');
    return id || 'dashboard';
  }

  function makeButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'button';
    btn.setAttribute('data-variant', 'secondary');
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function init() {
    const table = findTable();
    if (!table || table.dataset.exportReady === 'true') return;
    table.dataset.exportReady = 'true';

    const bar = document.createElement('div');
    bar.className = 'table-export-bar no-print';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Export table');
    bar.style.cssText = 'display:flex;gap:0.5rem;margin:0 0 0.75rem;flex-wrap:wrap;';

    const name = baseName(table);
    bar.appendChild(makeButton('Download CSV', function () {
      download(serialise(table, ','), 'text/csv', name + '-export.csv');
    }));
    bar.appendChild(makeButton('Download TSV', function () {
      download(serialise(table, '\t'), 'text/tab-separated-values', name + '-export.tsv');
    }));

    const anchor = table.closest('figure, section, div') || table;
    anchor.parentNode.insertBefore(bar, anchor);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
