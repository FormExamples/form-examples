import { fetchCards } from './api.js';
import { sampleCards } from './data.js';

// Clinical Microbiology Waiting List Card — booking-office dashboard.
//
// On boot we attempt a backend fetch; on any failure (or empty response)
// we fall back to the sample data and surface a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search + specialty + clinical priority + Waiting Time Status).

  

  /** @type {import('./types.js').WaitingListCardSummary[]} */
  let cards = [];

  const filters = {
    search: '',
    specialty: '',
    priority: '',
    status: ''
  };

  // Default sort: weeks waited descending — longest waiters first.
  const sortState = {
    key: 'weeksWaited',
    direction: 'desc'
  };

  const columns = [
    { key: 'patientName', label: 'Patient' },
    { key: 'nhsNumber', label: 'NHS number' },
    { key: 'specialty', label: 'Specialty' },
    { key: 'procedureDescription', label: 'Procedure' },
    { key: 'clinicalPriority', label: 'Priority' },
    { key: 'rttClockStartDate', label: 'Clock-start' },
    { key: 'weeksWaited', label: 'Weeks' },
    { key: 'waitingTimeStatus', label: 'Waiting Time Status' },
    { key: 'nextAppointmentDate', label: 'Next appt' },
    { key: 'practitionerName', label: 'Practitioner' },
    { key: 'flags', label: 'Flags' }
  ];

  const priorityRank = {
    P1a: 0,
    P1b: 1,
    P2: 2,
    P3: 3,
    P4: 4,
    P5: 5,
    P6: 6
  };

  const statusRank = {
    'long-wait': 0,
    breached: 1,
    'approaching-breach': 2,
    'within-target': 3
  };

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusLabel(v) {
    return (
      {
        'within-target': 'Within target',
        'approaching-breach': 'Approaching breach',
        breached: 'Breached',
        'long-wait': 'Long wait (> 52 wk)'
      }[v] || v || '—'
    );
  }

  function statusClass(v) {
    return v ? 'status-' + v : '';
  }

  function highestFlagPriority(flags) {
    if (!flags || flags.length === 0) return '';
    if (flags.some(function (f) { return f.priority === 'high'; })) return 'high';
    if (flags.some(function (f) { return f.priority === 'medium'; })) return 'medium';
    return 'low';
  }

  function hasActiveFilters() {
    return filters.search !== '' || filters.specialty !== '' || filters.priority !== '' || filters.status !== '';
  }

  // ---------------------------------------------------------------------
  // Filter + sort
  // ---------------------------------------------------------------------

  function matchesFilters(row) {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      const matches =
        row.patientName.toLowerCase().includes(term) ||
        row.nhsNumber.toLowerCase().includes(term) ||
        row.specialty.toLowerCase().includes(term) ||
        row.procedureDescription.toLowerCase().includes(term) ||
        row.practitionerName.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (filters.specialty && row.specialty !== filters.specialty) return false;
    if (filters.priority && row.clinicalPriority !== filters.priority) return false;
    if (filters.status && row.waitingTimeStatus !== filters.status) return false;
    return true;
  }

  function compareRows(a, b) {
    const key = sortState.key;
    const dir = sortState.direction === 'asc' ? 1 : -1;
    let av = a[key];
    let bv = b[key];

    if (key === 'clinicalPriority') {
      av = priorityRank[av] != null ? priorityRank[av] : 99;
      bv = priorityRank[bv] != null ? priorityRank[bv] : 99;
      return (av - bv) * dir;
    }

    if (key === 'waitingTimeStatus') {
      av = statusRank[av] != null ? statusRank[av] : 99;
      bv = statusRank[bv] != null ? statusRank[bv] : 99;
      return (av - bv) * dir;
    }

    if (key === 'weeksWaited') {
      return ((av == null ? 0 : av) - (bv == null ? 0 : bv)) * dir;
    }

    if (key === 'nextAppointmentDate' || key === 'rttClockStartDate') {
      // null sorts last regardless of direction.
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return String(av).localeCompare(String(bv)) * dir;
    }

    if (key === 'flags') {
      return ((a.flags ? a.flags.length : 0) - (b.flags ? b.flags.length : 0)) * dir;
    }

    return String(av == null ? '' : av).localeCompare(String(bv == null ? '' : bv)) * dir;
  }

  function visibleRows() {
    return cards.filter(matchesFilters).slice().sort(compareRows);
  }

  // ---------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------

  function renderTableHead() {
    const head = document.getElementById('cards-table-head');
    if (!head) return;
    head.innerHTML = '';

    for (const col of columns) {
      const th = document.createElement('th');
      th.className = 'data-table-th';
      th.scope = 'col';
      th.dataset.column = col.key;

      let ariaSort = 'none';
      let indicator = '\u2195';
      if (sortState.key === col.key) {
        if (sortState.direction === 'asc') {
          ariaSort = 'ascending';
          indicator = '\u2191';
        } else {
          ariaSort = 'descending';
          indicator = '\u2193';
        }
      }
      th.setAttribute('aria-sort', ariaSort);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sort-btn';
      btn.innerHTML =
        '<span>' + esc(col.label) + '</span>' +
        '<span class="sort-indicator" aria-hidden="true">' + indicator + '</span>';
      btn.addEventListener('click', function () { onSortClick(col.key); });
      th.appendChild(btn);

      head.appendChild(th);
    }
  }

  function renderTableBody() {
    const body = document.getElementById('cards-table-body');
    const empty = document.getElementById('cards-empty-message');
    if (!body) return;

    const rows = visibleRows();
    body.innerHTML = '';

    if (rows.length === 0) {
      if (empty) empty.hidden = false;
    } else {
      if (empty) empty.hidden = true;
    }

    for (const row of rows) {
      const tr = document.createElement('tr');
      tr.className = 'data-table-row';
      if (row.waitingTimeStatus === 'breached' || row.waitingTimeStatus === 'long-wait') {
        tr.classList.add('row-incomplete');
      }

      const flagCount = row.flags ? row.flags.length : 0;
      const flagPriority = highestFlagPriority(row.flags);
      const flagBadge = flagCount === 0
        ? '—'
        : '<span class="completeness-badge completeness-' + esc(flagPriority) + '">' + flagCount + ' (' + esc(flagPriority) + ')</span>';

      tr.innerHTML =
        '<td class="data-table-td"><strong>' + esc(row.patientName) + '</strong></td>' +
        '<td class="data-table-td">' + esc(row.nhsNumber) + '</td>' +
        '<td class="data-table-td">' + esc(row.specialty) + '</td>' +
        '<td class="data-table-td">' + esc(row.procedureDescription) + '</td>' +
        '<td class="data-table-td"><span class="completeness-badge completeness-' + esc(row.clinicalPriority || '') + '">' + esc(row.clinicalPriority || '') + '</span></td>' +
        '<td class="data-table-td">' + esc(row.rttClockStartDate) + '</td>' +
        '<td class="data-table-td">' + esc(row.weeksWaited) + '</td>' +
        '<td class="data-table-td"><span class="completeness-badge ' + statusClass(row.waitingTimeStatus) + '">' + esc(statusLabel(row.waitingTimeStatus)) + '</span></td>' +
        '<td class="data-table-td">' + (row.nextAppointmentDate ? esc(row.nextAppointmentDate) : '—') + '</td>' +
        '<td class="data-table-td">' + esc(row.practitionerName) + '</td>' +
        '<td class="data-table-td">' + flagBadge + '</td>';
      body.appendChild(tr);
    }
  }

  function renderFilterCount() {
    const el = document.getElementById('filter-count');
    if (!el) return;
    const total = cards.length;
    const shown = visibleRows().length;
    if (total === 0) {
      el.textContent = 'No cards to display.';
    } else if (shown === total) {
      el.textContent = 'Showing ' + total + ' of ' + total + ' cards';
    } else {
      el.textContent = 'Showing ' + shown + ' of ' + total + ' cards';
    }
  }

  function renderClearButton() {
    const btn = document.getElementById('filter-clear-btn');
    if (!btn) return;
    btn.hidden = !hasActiveFilters();
  }

  function renderSummary() {
    const all = cards.length;
    const breached = cards.filter(function (c) { return c.waitingTimeStatus === 'breached'; }).length;
    const approaching = cards.filter(function (c) { return c.waitingTimeStatus === 'approaching-breach'; }).length;
    const longWait = cards.filter(function (c) { return c.waitingTimeStatus === 'long-wait'; }).length;
    const highFlags = cards.filter(function (c) {
      return c.flags && c.flags.some(function (f) { return f.priority === 'high'; });
    }).length;

    const setText = function (id, v) {
      const el = document.getElementById(id);
      if (el) el.textContent = v;
    };
    setText('summary-all', all);
    setText('summary-approaching', approaching);
    setText('summary-breached', breached);
    setText('summary-long-wait', longWait);
    setText('summary-high-flags', highFlags);
  }

  function populateSpecialtyFilter() {
    const sel = document.getElementById('filter-specialty');
    if (!sel) return;
    const seen = {};
    const specialties = [];
    for (const c of cards) {
      if (c.specialty && !seen[c.specialty]) {
        seen[c.specialty] = true;
        specialties.push(c.specialty);
      }
    }
    specialties.sort();
    // Preserve the "all" option already in the markup, then append.
    while (sel.options.length > 1) sel.remove(1);
    for (const s of specialties) {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      sel.appendChild(opt);
    }
  }

  function renderAll() {
    renderTableHead();
    renderTableBody();
    renderFilterCount();
    renderClearButton();
    renderSummary();
  }

  function showStatusBanner(message) {
    const banner = document.getElementById('status-banner');
    if (!banner) return;
    banner.textContent = message;
    banner.hidden = false;
  }

  // ---------------------------------------------------------------------
  // Event handlers
  // ---------------------------------------------------------------------

  function onSortClick(key) {
    if (sortState.key === key) {
      sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      sortState.key = key;
      sortState.direction = 'asc';
    }
    renderAll();
  }

  function bindFilterInputs() {
    const search = document.getElementById('filter-search');
    const specialty = document.getElementById('filter-specialty');
    const priority = document.getElementById('filter-priority');
    const status = document.getElementById('filter-status');
    const clearBtn = document.getElementById('filter-clear-btn');

    if (search) search.addEventListener('input', function () { filters.search = search.value; renderAll(); });
    if (specialty) specialty.addEventListener('change', function () { filters.specialty = specialty.value; renderAll(); });
    if (priority) priority.addEventListener('change', function () { filters.priority = priority.value; renderAll(); });
    if (status) status.addEventListener('change', function () { filters.status = status.value; renderAll(); });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        filters.search = '';
        filters.specialty = '';
        filters.priority = '';
        filters.status = '';
        if (search) search.value = '';
        if (specialty) specialty.value = '';
        if (priority) priority.value = '';
        if (status) status.value = '';
        renderAll();
      });
    }
  }

  // ---------------------------------------------------------------------
  // Bootstrap
  // ---------------------------------------------------------------------

  async function loadCards() {
    cards = sampleCards;
    populateSpecialtyFilter();
    renderAll();

    try {
      const items = await fetchCards();
      if (items && items.length > 0) {
        cards = items;
        const banner = document.getElementById('status-banner');
        if (banner) banner.hidden = true;
        populateSpecialtyFilter();
      } else {
        showStatusBanner('Showing sample data — backend returned no cards.');
      }
    } catch (err) {
      showStatusBanner('Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').');
    }

    renderAll();
  }

  function init() {
    bindFilterInputs();
    loadCards();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
