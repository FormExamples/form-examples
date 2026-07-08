// Medical Language Speaking Assessment For Cymraeg — admin dashboard
// (vanilla classic-script app).
//
// On boot we fetch the candidate list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + grade dropdown + profession dropdown + examiner dropdown +
// registration-outcome dropdown).
//
// Sibling modules loaded as plain `<script>` tags (in dependency order)
// attach their exports to
// `window.MedicalLanguageSpeakingAssessmentForCymraegDashboard`. Pulling
// them off here keeps the rest of this file referring to short local names.
// The whole file is wrapped in an IIFE so its top-level identifiers do not
// leak to the global scope.
(function () {
'use strict';
const {
  fetchCandidates,
  sampleCandidates
} = window.MedicalLanguageSpeakingAssessmentForCymraegDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').CandidateRow[]} */
let candidates = [];

const filters = {
  search: '',
  grade: '',
  profession: '',
  examiner: '',
  registration: ''
};

// Default sort: grade descending so E (worst) surfaces first. Exam admins
// and training coordinators want the candidates who most need attention or
// remediation at the top of the list. With `gradeRank` mapping A=0..E=5,
// 'desc' puts the highest rank (E) at the top.
const sortState = {
  key: 'grade',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'candidateNumber',     label: 'Candidate No.' },
  { key: 'candidateName',       label: 'Candidate Name' },
  { key: 'profession',          label: 'Profession' },
  { key: 'scaledScore',         label: 'Scaled Score' },
  { key: 'grade',               label: 'Grade' },
  { key: 'examiner',            label: 'Examiner' },
  { key: 'sittingDate',         label: 'Sitting Date' },
  { key: 'registrationOutcome', label: 'Registration' }
];

// Categorical rank table for the grade column. A is best; E is worst. C+
// sits between C and B (slightly above C, below B). With ranks ascending
// from A to E, sorting 'desc' puts E first — the default behaviour.
const gradeRank = {
  'A':  0,
  'B':  1,
  'C+': 2,
  'C':  3,
  'D':  4,
  'E':  5
};

// Categorical rank for profession column — alphabetical so the column
// behaves intuitively when sorted.
const professionRank = {
  'Dentist':         0,
  'Doctor':          1,
  'Nurse':           2,
  'Pharmacist':      3,
  'Physiotherapist': 4
};

// Categorical rank for registration outcome — surfaces problem rows
// (Not Eligible, then Pending) when sorted descending.
const registrationRank = {
  'Eligible':     0,
  'Pending':      1,
  'Not Eligible': 2
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

/** Map a Grade to its CSS class suffix. Handles the 'C+' edge case. */
function gradeClass(grade) {
  if (!grade) return '';
  if (grade === 'C+') return 'grade-c-plus';
  return 'grade-' + String(grade).toLowerCase();
}

/** Map a Grade to a row-emphasis class (only D and E surface as warning rows). */
function gradeRowClass(grade) {
  if (grade === 'D') return 'row-grade-d';
  if (grade === 'E') return 'row-grade-e';
  return '';
}

function registrationClass(outcome) {
  if (!outcome) return '';
  return 'registration-' + String(outcome).toLowerCase().replace(/\s+/g, '-');
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.grade !== '' ||
    filters.profession !== '' ||
    filters.examiner !== '' ||
    filters.registration !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').CandidateRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.candidateNumber.toLowerCase().includes(term) ||
      row.candidateName.toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.grade && row.grade !== filters.grade) return false;
  if (filters.profession && row.profession !== filters.profession) return false;
  if (filters.examiner && row.examiner !== filters.examiner) return false;
  if (filters.registration && row.registrationOutcome !== filters.registration) {
    return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Categorical columns use
 * their rank tables; numbers compare directly; everything else uses a
 * locale-aware string compare.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'grade') {
    av = gradeRank[av] ?? -1;
    bv = gradeRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'profession') {
    av = professionRank[av] ?? -1;
    bv = professionRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'registrationOutcome') {
    av = registrationRank[av] ?? -1;
    bv = registrationRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'scaledScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (candidateNumber, candidateName, examiner,
  // sittingDate — ISO-8601 dates sort correctly as strings).
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return candidates.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('candidates-table-head');
  if (!head) return;
  head.innerHTML = '';

  for (const col of columns) {
    const th = document.createElement('th');
    th.className = 'data-table-th';
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

function renderTableBody() {
  const body = document.getElementById('candidates-table-body');
  const empty = document.getElementById('candidates-empty-message');
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
    const rowCls = gradeRowClass(row.grade);
    if (rowCls) tr.classList.add(rowCls);

    tr.innerHTML = `
      <td class="data-table-td">${esc(row.candidateNumber)}</td>
      <td class="data-table-td">${esc(row.candidateName)}</td>
      <td class="data-table-td"><span class="profession-badge">${esc(row.profession)}</span></td>
      <td class="data-table-td"><span class="scaled-score">${esc(row.scaledScore)}/500</span></td>
      <td class="data-table-td"><span class="grade-badge ${gradeClass(row.grade)}">${esc(row.grade)}</span></td>
      <td class="data-table-td">${esc(row.examiner)}</td>
      <td class="data-table-td">${esc(row.sittingDate)}</td>
      <td class="data-table-td">
        <span class="registration-badge ${registrationClass(row.registrationOutcome)}">
          ${esc(row.registrationOutcome)}
        </span>
      </td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = candidates.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No candidates to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} candidates`;
  } else {
    el.textContent = `Showing ${shown} of ${total} candidates`;
  }
}

function renderClearButton() {
  const btn = document.getElementById('filter-clear-btn');
  if (!btn) return;
  btn.hidden = !hasActiveFilters();
}

/**
 * Populate the examiner dropdown with the unique examiner names in the
 * current candidate set. Preserves the active selection if the examiner
 * still exists in the new data.
 */
function populateExaminerDropdown() {
  const select = document.getElementById('filter-examiner');
  if (!select) return;

  const examinerSet = new Set();
  for (const row of candidates) {
    if (row.examiner) examinerSet.add(row.examiner);
  }
  const examiners = Array.from(examinerSet).sort((a, b) =>
    a.localeCompare(b)
  );

  const previous = filters.examiner;
  // Wipe existing dynamic options but keep the "All" placeholder.
  select.innerHTML = '<option value="">All examiners</option>';
  for (const name of examiners) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }
  // Restore selection if still valid.
  if (previous && examinerSet.has(previous)) {
    select.value = previous;
  } else if (previous) {
    filters.examiner = '';
    select.value = '';
  }
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const grade = document.getElementById('filter-grade');
  const profession = document.getElementById('filter-profession');
  const examiner = document.getElementById('filter-examiner');
  const registration = document.getElementById('filter-registration');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (grade) {
    grade.addEventListener('change', () => {
      filters.grade = grade.value;
      renderAll();
    });
  }
  if (profession) {
    profession.addEventListener('change', () => {
      filters.profession = profession.value;
      renderAll();
    });
  }
  if (examiner) {
    examiner.addEventListener('change', () => {
      filters.examiner = examiner.value;
      renderAll();
    });
  }
  if (registration) {
    registration.addEventListener('change', () => {
      filters.registration = registration.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.grade = '';
      filters.profession = '';
      filters.examiner = '';
      filters.registration = '';
      if (search) search.value = '';
      if (grade) grade.value = '';
      if (profession) profession.value = '';
      if (examiner) examiner.value = '';
      if (registration) registration.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadCandidates() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  candidates = sampleCandidates;
  populateExaminerDropdown();
  renderAll();

  try {
    const items = await fetchCandidates();
    if (items && items.length > 0) {
      candidates = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no candidates.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') +
        ').'
    );
  }

  populateExaminerDropdown();
  renderAll();
}

function init() {
  bindFilterInputs();
  loadCandidates();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
