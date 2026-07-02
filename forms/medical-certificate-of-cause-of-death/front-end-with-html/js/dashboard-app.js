// Medical Certificate of Cause of Death (MCCD) — certifier / medical-examiner
// dashboard (vanilla classic-script app).
//
// On boot we fetch the certificate list from the backend; on any failure (or
// empty response) we fall back to sample data and show a small banner. The
// rendered table is sortable (click any column header) and filterable (search
// box + validity-class dropdown + coroner-referral dropdown).
//
// This dashboard is a governance / review tool. It surfaces the engine's
// validity classification, the derived underlying cause, and the coroner-referral
// indication; it makes NO diagnostic judgement and does not discharge any
// statutory duty.
//
// Sibling modules loaded as plain `<script>` tags (in dependency order) attach
// their exports to `window.MedicalCertificateOfCauseOfDeathDashboard`. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak.
(function () {
'use strict';
const {
  fetchCertificates,
  sampleCertificates
} = window.MedicalCertificateOfCauseOfDeathDashboard;

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./dashboard-types.js').CertificateRow[]} */
let certificates = [];

const filters = {
  search: '',
  validity: '',   // '' | 'valid' | 'incomplete' | 'refer-to-coroner'
  referral: ''    // '' | 'yes' | 'no'
};

// Default sort: deceased name ascending, matching the SvelteKit dashboard.
const sortState = {
  key: 'deceasedName',
  direction: 'asc' // 'asc' | 'desc'
};

// Column definitions — single source of truth for header rendering and the
// row-cell renderer below.
const columns = [
  { key: 'patientIdentifier',        label: 'Patient ID' },
  { key: 'deceasedName',             label: 'Deceased' },
  { key: 'underlyingCause',          label: 'Underlying Cause' },
  { key: 'validityClass',            label: 'Validity' },
  { key: 'coronerReferralIndicated', label: 'Coroner Referral' },
  { key: 'certifyingDoctorName',     label: 'Certifying Doctor' }
];

// Rank tables so sorting is locale-independent and clinically ordered.
const validityRank = { 'valid': 0, 'incomplete': 1, 'refer-to-coroner': 2 };

// ----------------------------------------------------------------------
// Label / class helpers (dashboard-local; no dependency on the form engine)
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

function validityClassName(cls) {
  if (cls === 'valid') return 'risk-low';
  if (cls === 'incomplete') return 'risk-moderate';
  if (cls === 'refer-to-coroner') return 'risk-high';
  return '';
}

function validityLabel(cls) {
  if (cls === 'valid') return 'Valid';
  if (cls === 'incomplete') return 'Incomplete';
  if (cls === 'refer-to-coroner') return 'Refer to coroner';
  return 'N/A';
}

function hasActiveFilters() {
  return (
    filters.search !== '' ||
    filters.validity !== '' ||
    filters.referral !== ''
  );
}

// ----------------------------------------------------------------------
// Filter + sort
// ----------------------------------------------------------------------

/**
 * @param {import('./dashboard-types.js').CertificateRow} row
 * @returns {boolean}
 */
function matchesFilters(row) {
  if (filters.search) {
    const term = filters.search.toLowerCase();
    const matches =
      row.patientIdentifier.toLowerCase().includes(term) ||
      row.deceasedName.toLowerCase().includes(term) ||
      (row.underlyingCause || '').toLowerCase().includes(term) ||
      (row.certifyingDoctorName || '').toLowerCase().includes(term);
    if (!matches) return false;
  }
  if (filters.validity && row.validityClass !== filters.validity) return false;
  if (filters.referral) {
    const wantReferral = filters.referral === 'yes';
    if (Boolean(row.coronerReferralIndicated) !== wantReferral) return false;
  }
  return true;
}

/**
 * Compare two rows for the active sort column. Ranked columns use their rank
 * tables; everything else uses a locale-aware string compare with empty values
 * sorted last.
 */
function compareRows(a, b) {
  const key = sortState.key;
  const dir = sortState.direction === 'asc' ? 1 : -1;
  let av = a[key];
  let bv = b[key];

  if (key === 'validityClass') {
    return ((validityRank[av] ?? 99) - (validityRank[bv] ?? 99)) * dir;
  }
  if (key === 'coronerReferralIndicated') {
    return ((av ? 1 : 0) - (bv ? 1 : 0)) * dir;
  }

  // Default: string compare (patientIdentifier, deceasedName, underlyingCause,
  // certifyingDoctorName). Empty values sort last.
  const as = String(av ?? '');
  const bs = String(bv ?? '');
  if (as === '' && bs !== '') return 1;
  if (bs === '' && as !== '') return -1;
  return as.localeCompare(bs) * dir;
}

function visibleRows() {
  return certificates.filter(matchesFilters).slice().sort(compareRows);
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
    let indicator = '↕';
    if (sortState.key === col.key) {
      if (sortState.direction === 'asc') {
        ariaSort = 'ascending';
        indicator = '↑';
      } else {
        ariaSort = 'descending';
        indicator = '↓';
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

  if (empty) empty.hidden = rows.length !== 0;

  for (const row of rows) {
    const tr = document.createElement('tr');
    // Highlight rows that need attention: incomplete documentation or a
    // coroner-referral case.
    if (row.validityClass === 'incomplete' || row.coronerReferralIndicated) {
      tr.classList.add('row-critical');
    }

    const referralBadge = row.coronerReferralIndicated
      ? `<span class="risk-badge risk-high">Refer</span>`
      : `<span class="risk-badge risk-low">No</span>`;

    tr.innerHTML = `
      <td>${esc(row.patientIdentifier)}</td>
      <td>${esc(row.deceasedName)}</td>
      <td>${row.underlyingCause ? esc(row.underlyingCause) : '<span class="muted">Not determinable</span>'}</td>
      <td><span class="risk-badge ${validityClassName(row.validityClass)}">${esc(validityLabel(row.validityClass))}</span></td>
      <td>${referralBadge}</td>
      <td>${row.certifyingDoctorName ? esc(row.certifyingDoctorName) : '<span class="muted">Not recorded</span>'}</td>
    `;
    body.appendChild(tr);
  }
}

function renderFilterCount() {
  const el = document.getElementById('filter-count');
  if (!el) return;
  const total = certificates.length;
  const shown = visibleRows().length;
  if (total === 0) {
    el.textContent = 'No certificates to display.';
  } else if (shown === total) {
    el.textContent = `Showing ${total} of ${total} certificates`;
  } else {
    el.textContent = `Showing ${shown} of ${total} certificates`;
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
    sortState.direction = 'asc';
  }
  renderAll();
}

function bindFilterInputs() {
  const search = document.getElementById('filter-search');
  const validity = document.getElementById('filter-validity');
  const referral = document.getElementById('filter-referral');
  const clearBtn = document.getElementById('filter-clear-btn');

  if (search) {
    search.addEventListener('input', () => {
      filters.search = search.value;
      renderAll();
    });
  }
  if (validity) {
    validity.addEventListener('change', () => {
      filters.validity = validity.value;
      renderAll();
    });
  }
  if (referral) {
    referral.addEventListener('change', () => {
      filters.referral = referral.value;
      renderAll();
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      filters.search = '';
      filters.validity = '';
      filters.referral = '';
      if (search) search.value = '';
      if (validity) validity.value = '';
      if (referral) referral.value = '';
      renderAll();
    });
  }
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

async function loadCertificates() {
  // Optimistic: show sample data immediately so the page is never blank, then
  // try the backend and replace if we get real data back.
  certificates = sampleCertificates;
  renderAll();

  try {
    const items = await fetchCertificates();
    if (items && items.length > 0) {
      certificates = items;
      const banner = document.getElementById('status-banner');
      if (banner) banner.hidden = true;
    } else {
      showStatusBanner('Showing sample data — backend returned no certificates.');
    }
  } catch (err) {
    showStatusBanner(
      'Showing sample data — backend offline (' + (err && err.message ? err.message : 'fetch failed') + ').'
    );
  }

  renderAll();
}

function init() {
  bindFilterInputs();
  loadCertificates();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
