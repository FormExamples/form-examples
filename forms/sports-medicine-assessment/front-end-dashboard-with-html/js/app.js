// Sports Medicine Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the athlete list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + clearance dropdown + sport dropdown + contact-level
// dropdown + age-band dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to `window.SportsMedicineAssessmentDashboard`.
// Pulling them off here keeps the rest of this file referring to short
// local names. The whole file is wrapped in an IIFE so its top-level
// identifiers do not leak to the global scope.
(function () {
'use strict';
const {
  fetchAthletes,
  sampleAthletes
} = window.SportsMedicineAssessmentDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AthleteRow[]} */
let athletes = [];

const filters = {
  search: '',
  clearance: '',
  sport: '',
  contact: '',
  ageBand: ''
};

// Default sort: clearance category descending (highest-risk first), so
// "Not Cleared for Sport" rows surface at the top of the list, then
// "Not Cleared Pending Further Evaluation", then "Cleared with Conditions",
// then "Cleared". Athletes who most need clinician attention come first.
const sortState = {
  key: 'clearance',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',    label: 'NHS Number' },
  { key: 'athleteName',  label: 'Athlete Name' },
  { key: 'age',          label: 'Age' },
  { key: 'ageBand',      label: 'Age Band' },
  { key: 'sport',        label: 'Sport' },
  { key: 'position',     label: 'Position' },
  { key: 'contactLevel', label: 'Contact Level' },
  { key: 'clearance',    label: 'Clearance' },
  { key: 'flags',        label: 'Risk Flags' }
];

// Categorical rank tables: ascending = lowest risk first, descending =
// highest risk first. Sorting routes through these so e.g. "Cleared" is
// always less than "Not Cleared for Sport" regardless of locale.
const clearanceRank = {
  'Cleared': 0,
  'Cleared with Conditions': 1,
  'Not Cleared Pending Further Evaluation': 2,
  'Not Cleared for Sport': 3
};

const contactRank = {
  'Non-Contact': 0,
  'Limited Contact': 1,
  'Contact': 2
};

const ageBandRank = {
  'Youth': 0,
  'Adolescent': 1,
  'Adult': 2,
  'Masters': 3
};

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Escape user-entered or backend-supplied text for safe rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clearanceClass(label) {
  if (!label) return '';
  return 'clearance-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function contactClass(label) {
  if (!label) return '';
  return 'contact-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

/** Count how many of the three PPE risk flags are set on a row. */
function flagCount(row) {
  return (
    (row.concussionHistory ? 1 : 0) +
    (row.redS ? 1 : 0) +
    (row.familyCardiovascular ? 1 : 0)
  );
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.clearance !== '' ||
    filters.sport !== '' ||
    filters.contact !== '' ||
    filters.ageBand !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').AthleteRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.athleteName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.clearance && row.clearance !== filters.clearance) {
    return false;
  }
  if (filters.sport && row.sport !== filters.sport) {
    return false;
  }
  if (filters.contact && row.contactLevel !== filters.contact) {
    return false;
  }
  if (filters.ageBand && row.ageBand !== filters.ageBand) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numeric columns compare numerically; "flags" column
 * sorts by total flag count; everything else uses a locale-aware string
 * compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'clearance') {
    av = clearanceRank[av] ?? -1;
    bv = clearanceRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'contactLevel') {
    av = contactRank[av] ?? -1;
    bv = contactRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'ageBand') {
    av = ageBandRank[av] ?? -1;
    bv = ageBandRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'age') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  if (key === 'flags') {
    return (flagCount(a) - flagCount(b)) * dir;
  }

  // Default: string compare (nhsNumber, athleteName, sport, position)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return athletes.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('athletes-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.dataset.column = col.key;

    let ariaSort = 'none';
    let indicator = '\u2195'; // up-down arrow
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
      `<span>${esc(col.label)}</span>` +
      `<span class="sort-indicator" aria-hidden="true">${indicator}</span>`;
    btn.addEventListener('click', () => onSortClick(col.key));
    th.appendChild(btn);

    head.appendChild(th);
  }
}

function renderFlagsCell(row) {
  const chips = [];
  if (row.concussionHistory) {
    chips.push('<span class="flag-chip flag-concussion" title="Concussion history">Concussion</span>');
  }
  if (row.redS) {
    chips.push('<span class="flag-chip flag-red-s" title="Relative Energy Deficiency in Sport">RED-S</span>');
  }
  if (row.familyCardiovascular) {
    chips.push('<span class="flag-chip flag-family-cv" title="Family history of premature cardiovascular disease or sudden cardiac death">Family CV</span>');
  }
  if (chips.length === 0) {
    return '<span class="flags-empty">—</span>';
  }
  return `<div class="flags-cell">${chips.join('')}</div>`;
}

function renderTableBody() {
  const body = document.getElementById('athletes-table-body');
  const empty = document.getElementById('athletes-empty-message');
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
    if (row.clearance === 'Not Cleared for Sport') {
      tr.classList.add('row-not-cleared-for-sport');
    } else if (row.clearance === 'Not Cleared Pending Further Evaluation') {
      tr.classList.add('row-not-cleared-pending');
    }

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.athleteName)}</td>
      <td><span class="age-value">${esc(row.age)}</span></td>
      <td><span class="age-band-badge">${esc(row.ageBand)}</span></td>
      <td><span class="sport-badge">${esc(row.sport)}</span></td>
      <td>${esc(row.position)}</td>
      <td><span class="contact-badge ${contactClass(row.contactLevel)}">${esc(row.contactLevel)}</span></td>
      <td><span class="clearance-badge ${clearanceClass(row.clearance)}">${esc(row.clearance)}</span></td>
      <td>${renderFlagsCell(row)}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = athletes.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No athletes to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} athletes`;
  } else {
    el.textContent = `Showing ${shown} of ${total} athletes`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

function renderAll() {
  renderTableHead();
  renderTableBody();
  renderFilterCount();
  renderClearButton();
}

function showStatusBanner(message) {
  const banner = document.getElementById('status-banner');
  if (!banner) return;
  banner.textContent = message;
  banner.hidden = false;
}

// ----------------------------------------------------------------------
// Event handlers
// ----------------------------------------------------------------------

function onSortClick(key) {
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = key;
    // For categorical risk-tier columns, default to descending (highest
    // risk first) so a single click on the header surfaces problem cases.
    if (key === 'clearance' || key === 'contactLevel' || key === 'flags') {
      sortState.direction = 'desc';
    } else {
      sortState.direction = 'asc';
    }
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const clearance = document.getElementById('filter-clearance');
  const sport = document.getElementById('filter-sport');
  const contact = document.getElementById('filter-contact');
  const ageBand = document.getElementById('filter-age-band');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (clearance) {
    clearance.addEventListener('change', () => {
      filters.clearance = clearance.value;
      renderAll();
    });
  }
  if (sport) {
    sport.addEventListener('change', () => {
      filters.sport = sport.value;
      renderAll();
    });
  }
  if (contact) {
    contact.addEventListener('change', () => {
      filters.contact = contact.value;
      renderAll();
    });
  }
  if (ageBand) {
    ageBand.addEventListener('change', () => {
      filters.ageBand = ageBand.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.clearance = '';
      filters.sport = '';
      filters.contact = '';
      filters.ageBand = '';
      if (search) search.value = '';
      if (clearance) clearance.value = '';
      if (sport) sport.value = '';
      if (contact) contact.value = '';
      if (ageBand) ageBand.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadAthletes() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  athletes = sampleAthletes;
  renderAll();

  try {
    const items = await fetchAthletes();
    if (items && items.length > 0) {
      athletes = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no athletes.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadAthletes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
