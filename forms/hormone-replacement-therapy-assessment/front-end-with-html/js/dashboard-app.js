import { fetchPatients } from './api.js';
import { samplePatients } from './data.js';

// HRT Assessment - clinician dashboard (vanilla classic-script app).
//
// On boot we fetch the patient list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable
// (search box + MRS severity dropdown + risk classification dropdown +
// HRT status dropdown).

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').PatientRow[]} */
let patients = [];

const filters = {
  search: '',
  mrs: '',     // '', 'minimal', 'mild', 'moderate', 'severe'
  risk: '',    // '', 'Favourable', 'Acceptable', 'Cautious', 'Contraindicated'
  hrt: ''      // '', 'yes' (on HRT), 'no' (not on HRT)
};

// Default sort: MRS score descending. Highest symptom severity = top of
// the list, surfacing the patients who most need clinical attention.
const sortState = {
  key: 'mrsScore',
  direction: 'desc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'nhsNumber',          label: 'NHS Number' },
  { key: 'patientName',        label: 'Patient Name' },
  { key: 'mrsScore',           label: 'MRS Score' },
  { key: 'menopauseStatus',    label: 'Menopause Status' },
  { key: 'riskClassification', label: 'Risk Classification' },
  { key: 'currentHRT',         label: 'Current HRT' }
];

// Rank used when sorting the menopauseStatus column so the natural
// progression Pre -> Peri -> Post is preserved regardless of locale.
const menopauseRank = {
  'Pre-menopausal': 0,
  'Peri-menopausal': 1,
  'Post-menopausal': 2
};

// Rank used when sorting the riskClassification column from safest to
// most severe.
const riskRank = {
  'Favourable': 0,
  'Acceptable': 1,
  'Cautious': 2,
  'Contraindicated': 3
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

/** Map an MRS score (0-44) to its severity bucket. */
function mrsSeverity(score) {
  if (score == null || isNaN(score)) return '';
  if (score <= 4)  return 'minimal';
  if (score <= 8)  return 'mild';
  if (score <= 15) return 'moderate';
  return 'severe';
}

/** Human label for the MRS severity bucket. */
function mrsSeverityLabel(bucket) {
  switch (bucket) {
    case 'minimal':  return 'Minimal';
    case 'mild':     return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe':   return 'Severe';
    default:         return '';
  }
}

function menopauseClass(label) {
  if (!label) return '';
  return 'menopause-' + String(label).toLowerCase().replace(/\s+/g, '-');
}

function riskClass(label) {
  if (!label) return '';
  return 'risk-' + String(label).toLowerCase();
}

/** True when `currentHRT` indicates the patient is actively on HRT. */
function isOnHRT(value) {
  if (!value) return false;
  const v = String(value).trim().toLowerCase();
  return v !== '' && v !== 'none' && v !== 'discontinued';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.mrs !== '' ||
    filters.risk !== '' ||
    filters.hrt !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./types.js').PatientRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.nhsNumber.toLowerCase().includes(term) ||
      row.patientName.toLowerCase().includes(term) ||
      String(row.currentHRT || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.mrs) {
    if (mrsSeverity(row.mrsScore) !== filters.mrs) return false;
  }
  if (filters.risk && row.riskClassification !== filters.risk) {
    return false;
  }
  if (filters.hrt === 'yes' && !isOnHRT(row.currentHRT)) return false;
  if (filters.hrt === 'no' && isOnHRT(row.currentHRT)) return false;
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

  if (key === 'menopauseStatus') {
    av = menopauseRank[av] ?? -1;
    bv = menopauseRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'riskClassification') {
    av = riskRank[av] ?? -1;
    bv = riskRank[bv] ?? -1;
    return (av - bv) * dir;
  }

  if (key === 'mrsScore') {
    return ((av ?? 0) - (bv ?? 0)) * dir;
  }

  // Default: string compare (nhsNumber, patientName, currentHRT)
  return String(av).localeCompare(String(bv)) * dir;
}

function visibleRows() {
  return patients.filter(matchesFilters).slice().sort(compareRows);
}

// ----------------------------------------------------------------------
// Rendering
// ----------------------------------------------------------------------

function renderTableHead() {
  const head = document.getElementById('patients-table-head');
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

function renderTableBody() {
  const body = document.getElementById('patients-table-body');
  const empty = document.getElementById('patients-empty-message');
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
    if (row.riskClassification === 'Contraindicated') {
      tr.classList.add('row-contraindicated');
    }

    const bucket = mrsSeverity(row.mrsScore);
    const bucketLabel = mrsSeverityLabel(bucket);
    const hrtValue = row.currentHRT || '';
    const hrtIsNone = !isOnHRT(hrtValue);

    tr.innerHTML = `
      <td>${esc(row.nhsNumber)}</td>
      <td>${esc(row.patientName)}</td>
      <td>
        <span class="mrs-badge mrs-${esc(bucket)}">
          ${esc(row.mrsScore)} (${esc(bucketLabel)})
        </span>
      </td>
      <td><span class="menopause-badge ${menopauseClass(row.menopauseStatus)}">${esc(row.menopauseStatus)}</span></td>
      <td><span class="risk-badge ${riskClass(row.riskClassification)}">${esc(row.riskClassification)}</span></td>
      <td><span class="hrt-text ${hrtIsNone ? 'hrt-none' : ''}">${esc(hrtValue)}</span></td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = patients.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No patients to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} patients`;
  } else {
    el.textContent = `Showing ${shown} of ${total} patients`;
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
    // Numeric columns default to descending (highest first); textual and
    // categorical columns default to ascending.
    sortState.direction = (key === 'mrsScore') ? 'desc' : 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const mrs = document.getElementById('filter-mrs');
  const risk = document.getElementById('filter-risk');
  const hrt = document.getElementById('filter-hrt');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (mrs) {
    mrs.addEventListener('change', () => {
      filters.mrs = mrs.value;
      renderAll();
    });
  }
  if (risk) {
    risk.addEventListener('change', () => {
      filters.risk = risk.value;
      renderAll();
    });
  }
  if (hrt) {
    hrt.addEventListener('change', () => {
      filters.hrt = hrt.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.mrs = '';
      filters.risk = '';
      filters.hrt = '';
      if (search) search.value = '';
      if (mrs) mrs.value = '';
      if (risk) risk.value = '';
      if (hrt) hrt.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadPatients() {
  // Optimistic: show sample data immediately so the page is never blank,
  // then try the backend and replace if we get real data back.
  patients = samplePatients;
  renderAll();

  try {
    const items = await fetchPatients();
    if (items && items.length > 0) {
      patients = items;
      // Hide any earlier banner if a previous attempt had failed.
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      // Backend reachable but empty — keep sample data and notify.
      showStatusBanner(
        'Showing sample data — backend returned no patients.'
      );
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' +
        (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadPatients();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
