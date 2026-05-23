// Dashboard controller for the WHO Surgical Safety Checklist review
// dashboard. Wires up:
//   - initial data fetch (with sample-data fallback)
//   - filter bar (status, urgency, specialty, safety flags, free-text search)
//   - sortable table (toggles asc/desc on column-header click)
//   - row-click detail modal with all three phases + team roster
//
// Vanilla JS, no dependencies, no bundler. Attaches no executable export;
// every public symbol lives on `window.WhoSurgicalSafetyChecklistDashboard`.

(function () {
'use strict';

const ns = window.WhoSurgicalSafetyChecklistDashboard =
  window.WhoSurgicalSafetyChecklistDashboard || {};

// -------------------------------------------------------------------- //
// Column definitions for the sortable table.
// `key` is used as a stable identifier in the sort state.
// `getValue(row)` returns the value used for sort comparison.
// `render(row)` returns either a string (assigned to textContent) or an
// HTMLElement / DocumentFragment (appended directly).
// -------------------------------------------------------------------- //
const columns = [
  {
    key: 'caseDate',
    label: 'Case date',
    type: 'string',
    getValue: (r) => r.caseDate || '',
    render: (r) => {
      const el = document.createElement('span');
      el.className = 'date-cell';
      el.textContent = r.caseDate || '';
      return el;
    }
  },
  {
    key: 'patient',
    label: 'Patient',
    type: 'string',
    getValue: (r) => (r.patient || '').toLowerCase(),
    render: (r) => {
      const wrap = document.createElement('div');
      const name = document.createElement('div');
      name.textContent = r.patient || '';
      const proc = document.createElement('div');
      proc.className = 'site-or';
      proc.textContent = r.plannedProcedure || '';
      wrap.appendChild(name);
      wrap.appendChild(proc);
      return wrap;
    }
  },
  {
    key: 'site',
    label: 'Site / OR',
    type: 'string',
    getValue: (r) => (r.site || '').toLowerCase(),
    render: (r) => {
      const wrap = document.createElement('div');
      wrap.className = 'site-cell';
      const site = document.createElement('span');
      site.textContent = r.site || '';
      const orLine = document.createElement('span');
      orLine.className = 'site-or';
      orLine.textContent = r.operatingRoom || '';
      wrap.appendChild(site);
      wrap.appendChild(orLine);
      return wrap;
    }
  },
  {
    key: 'surgeon',
    label: 'Surgeon',
    type: 'string',
    getValue: (r) => (r.surgeon || '').toLowerCase(),
    render: (r) => r.surgeon || ''
  },
  {
    key: 'anaesthetist',
    label: 'Anaesthetist',
    type: 'string',
    getValue: (r) => (r.anaesthetist || '').toLowerCase(),
    render: (r) => r.anaesthetist || ''
  },
  {
    key: 'urgency',
    label: 'Urgency',
    type: 'string',
    getValue: (r) => urgencyRank(r.urgency),
    render: (r) => {
      if (!r.urgency) return '';
      const el = document.createElement('span');
      el.className = `urgency-badge urgency-${r.urgency}`;
      el.textContent = r.urgency;
      return el;
    }
  },
  {
    key: 'specialty',
    label: 'Specialty',
    type: 'string',
    getValue: (r) => (r.specialty || '').toLowerCase(),
    render: (r) => r.specialty || ''
  },
  {
    key: 'status',
    label: 'Status',
    type: 'string',
    getValue: (r) => statusRank(r.status),
    render: (r) => {
      if (!r.status) return '';
      const el = document.createElement('span');
      el.className = `status-badge status-${r.status}`;
      el.textContent = statusLabel(r.status);
      return el;
    }
  },
  {
    key: 'flags',
    label: 'Safety flags',
    type: 'number',
    getValue: (r) => (Array.isArray(r.flags) ? r.flags.length : 0),
    render: (r) => {
      const n = Array.isArray(r.flags) ? r.flags.length : 0;
      const el = document.createElement('span');
      el.className = 'flag-count' + (n === 0 ? ' flag-count-zero' : '');
      el.textContent = String(n);
      return el;
    }
  }
];

// Status sort order (lifecycle progression).
const statusOrder = [
  'not-started',
  'sign-in-complete',
  'time-out-complete',
  'sign-out-complete',
  'completed',
  'abandoned'
];
function statusRank(s) {
  const i = statusOrder.indexOf(s);
  return i === -1 ? 99 : i;
}
function statusLabel(s) {
  switch (s) {
    case 'not-started':       return 'Not started';
    case 'sign-in-complete':  return 'Sign In complete';
    case 'time-out-complete': return 'Time Out complete';
    case 'sign-out-complete': return 'Sign Out complete';
    case 'completed':         return 'Completed';
    case 'abandoned':         return 'Abandoned';
    default:                  return s || '';
  }
}

// Urgency sort order (least to most acute).
const urgencyOrder = ['elective', 'urgent', 'emergency', 'immediate'];
function urgencyRank(u) {
  const i = urgencyOrder.indexOf(u);
  return i === -1 ? 99 : i;
}

// -------------------------------------------------------------------- //
// Mutable dashboard state.
// -------------------------------------------------------------------- //
const state = {
  /** @type {import('./types.js').ChecklistRow[]} */
  rows: [],
  /** @type {import('./types.js').ChecklistRow[]} */
  filtered: [],
  sort: { key: 'caseDate', direction: 'desc' },
  filters: {
    search: '',
    status: '',
    urgency: '',
    specialty: '',
    flags: ''
  }
};

// -------------------------------------------------------------------- //
// DOM helpers.
// -------------------------------------------------------------------- //
function $(id) { return document.getElementById(id); }

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function setText(node, text) {
  clear(node);
  node.appendChild(document.createTextNode(text));
}

function appendRendered(cell, value) {
  if (value == null) return;
  if (typeof value === 'string' || typeof value === 'number') {
    cell.appendChild(document.createTextNode(String(value)));
  } else {
    cell.appendChild(value);
  }
}

// -------------------------------------------------------------------- //
// Sortable column headers.
// -------------------------------------------------------------------- //
function renderHeader() {
  const headRow = $('checklists-table-head');
  clear(headRow);
  headRow.classList.add('data-table-row');

  columns.forEach((col) => {
    const th = document.createElement('th');
    th.className = 'data-table-th';
    th.scope = 'col';
    th.setAttribute('data-key', col.key);

    let ariaSort = 'none';
    if (state.sort.key === col.key) {
      ariaSort = state.sort.direction === 'asc' ? 'ascending' : 'descending';
    }
    th.setAttribute('aria-sort', ariaSort);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sort-btn';
    btn.textContent = col.label;

    const indicator = document.createElement('span');
    indicator.className = 'sort-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    if (state.sort.key === col.key) {
      indicator.textContent = state.sort.direction === 'asc' ? '\u25B2' : '\u25BC';
    } else {
      indicator.textContent = '\u2195';
    }
    btn.appendChild(indicator);

    btn.addEventListener('click', () => {
      if (state.sort.key === col.key) {
        state.sort.direction = state.sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        state.sort.key = col.key;
        state.sort.direction = col.type === 'number' ? 'desc' : 'asc';
      }
      applyFiltersAndRender();
    });

    th.appendChild(btn);
    headRow.appendChild(th);
  });
}

// -------------------------------------------------------------------- //
// Filtering.
// -------------------------------------------------------------------- //
function matchesFilters(row) {
  const f = state.filters;

  if (f.status && row.status !== f.status) return false;
  if (f.urgency && row.urgency !== f.urgency) return false;
  if (f.specialty && row.specialty !== f.specialty) return false;

  if (f.flags === 'yes' && (!row.flags || row.flags.length === 0)) return false;
  if (f.flags === 'no' && row.flags && row.flags.length > 0) return false;

  if (f.search) {
    const q = f.search.toLowerCase();
    const haystack = [
      row.patient,
      row.plannedProcedure,
      row.surgeon,
      row.anaesthetist,
      row.site,
      row.operatingRoom,
      row.specialty
    ].filter(Boolean).join(' ').toLowerCase();
    if (haystack.indexOf(q) === -1) return false;
  }

  return true;
}

function compareRows(a, b) {
  const col = columns.find((c) => c.key === state.sort.key) || columns[0];
  const av = col.getValue(a);
  const bv = col.getValue(b);

  let result;
  if (typeof av === 'number' && typeof bv === 'number') {
    result = av - bv;
  } else {
    const as = String(av);
    const bs = String(bv);
    if (as < bs) result = -1;
    else if (as > bs) result = 1;
    else result = 0;
  }

  if (result === 0) {
    // Stable secondary sort by case date, then id, so output is deterministic.
    const ad = a.caseDate || '';
    const bd = b.caseDate || '';
    if (ad < bd) result = -1;
    else if (ad > bd) result = 1;
    else result = (a.id || '') < (b.id || '') ? -1 : 1;
  }

  return state.sort.direction === 'asc' ? result : -result;
}

// -------------------------------------------------------------------- //
// Body rendering.
// -------------------------------------------------------------------- //
function renderBody() {
  const tbody = $('checklists-table-body');
  clear(tbody);

  state.filtered.forEach((row) => {
    const tr = document.createElement('tr');
    tr.className = 'data-table-row';
    tr.setAttribute('data-id', row.id);
    tr.tabIndex = 0;

    const flagged = Array.isArray(row.flags) && row.flags.length > 0
      && (row.status === 'completed' || row.status === 'abandoned');
    if (flagged) tr.classList.add('row-flagged');

    columns.forEach((col) => {
      const td = document.createElement('td');
      td.className = 'data-table-td';
      appendRendered(td, col.render(row));
      tr.appendChild(td);
    });

    tr.addEventListener('click', () => openDetailModal(row));
    tr.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openDetailModal(row);
      }
    });

    tbody.appendChild(tr);
  });

  const emptyMsg = $('checklists-empty-message');
  if (state.filtered.length === 0) {
    emptyMsg.hidden = false;
  } else {
    emptyMsg.hidden = true;
  }
}

function renderCount() {
  const node = $('filter-count');
  const x = state.filtered.length;
  const y = state.rows.length;
  setText(node, `Showing ${x} of ${y} case${y === 1 ? '' : 's'}`);
}

function renderClearButton() {
  const btn = $('filter-clear-btn');
  const f = state.filters;
  const anyActive = !!(f.search || f.status || f.urgency
    || f.specialty || f.flags);
  btn.hidden = !anyActive;
}

function applyFiltersAndRender() {
  state.filtered = state.rows.filter(matchesFilters).slice().sort(compareRows);
  renderHeader();
  renderBody();
  renderCount();
  renderClearButton();
}

// -------------------------------------------------------------------- //
// Filter-bar wiring.
// -------------------------------------------------------------------- //
function populateSpecialtyOptions() {
  const select = $('filter-specialty');
  const seen = new Set();
  state.rows.forEach((r) => { if (r.specialty) seen.add(r.specialty); });
  const sorted = Array.from(seen).sort((a, b) => a.localeCompare(b));
  // Preserve the "All specialties" option already in the markup, then append.
  // We rebuild from scratch to be safe.
  clear(select);
  const allOpt = document.createElement('option');
  allOpt.value = '';
  allOpt.textContent = 'All specialties';
  select.appendChild(allOpt);
  sorted.forEach((sp) => {
    const opt = document.createElement('option');
    opt.value = sp;
    opt.textContent = sp;
    select.appendChild(opt);
  });
}

function wireFilters() {
  const search = $('filter-search');
  const status = $('filter-status');
  const urgency = $('filter-urgency');
  const specialty = $('filter-specialty');
  const flags = $('filter-flags');
  const clearBtn = $('filter-clear-btn');

  search.addEventListener('input', () => {
    state.filters.search = search.value.trim();
    applyFiltersAndRender();
  });
  status.addEventListener('change', () => {
    state.filters.status = status.value;
    applyFiltersAndRender();
  });
  urgency.addEventListener('change', () => {
    state.filters.urgency = urgency.value;
    applyFiltersAndRender();
  });
  specialty.addEventListener('change', () => {
    state.filters.specialty = specialty.value;
    applyFiltersAndRender();
  });
  flags.addEventListener('change', () => {
    state.filters.flags = flags.value;
    applyFiltersAndRender();
  });
  clearBtn.addEventListener('click', () => {
    state.filters = {
      search: '', status: '', urgency: '', specialty: '', flags: ''
    };
    search.value = '';
    status.value = '';
    urgency.value = '';
    specialty.value = '';
    flags.value = '';
    applyFiltersAndRender();
  });
}

// -------------------------------------------------------------------- //
// Detail modal.
// -------------------------------------------------------------------- //

// Pretty-print the canonical answer codes used across the three phases.
function formatAnswer(value) {
  if (value === null || value === undefined || value === '') {
    return { text: 'Not answered', cssClass: 'item-value-unanswered' };
  }
  switch (value) {
    case 'yes':
      return { text: 'Yes', cssClass: 'item-value-yes' };
    case 'no':
      return { text: 'No', cssClass: 'item-value-no' };
    case 'not-applicable':
      return { text: 'Not applicable', cssClass: 'item-value-na' };
    case 'yes-equipment-available':
      return { text: 'Yes — equipment available', cssClass: 'item-value-yes' };
    case 'yes-two-ivs-and-fluids-planned':
      return { text: 'Yes — 2 IVs + fluids planned', cssClass: 'item-value-yes' };
    default:
      if (typeof value === 'number') {
        return { text: String(value), cssClass: '' };
      }
      return { text: String(value), cssClass: '' };
  }
}

function teamRoleLabel(role) {
  switch (role) {
    case 'surgeon':              return 'Surgeon';
    case 'assistant-surgeon':    return 'Assistant surgeon';
    case 'anaesthetist':         return 'Anaesthetist';
    case 'circulating-nurse':    return 'Circulating nurse';
    case 'scrub-nurse':          return 'Scrub nurse';
    case 'anaesthetic-assistant':return 'Anaesthetic assistant';
    case 'perfusionist':         return 'Perfusionist';
    case 'technician':           return 'Technician';
    case 'observer':             return 'Observer';
    case 'other':                return 'Other';
    default:                     return role || '';
  }
}

function formatTimestamp(iso) {
  if (!iso) return '';
  // Display the timestamp as-is when it's not parseable; otherwise format
  // in the viewer's locale.
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString();
  } catch (e) {
    return iso;
  }
}

function appendDetailItem(list, label, valueObj, freeText) {
  const li = document.createElement('li');
  const lbl = document.createElement('span');
  lbl.className = 'item-label';
  lbl.textContent = label;
  const val = document.createElement('span');
  val.className = 'item-value' + (valueObj.cssClass ? ' ' + valueObj.cssClass : '');
  val.textContent = valueObj.text;
  li.appendChild(lbl);
  li.appendChild(val);

  if (freeText) {
    const ft = document.createElement('span');
    ft.className = 'item-value item-value-free';
    ft.textContent = freeText;
    li.appendChild(ft);
  }
  list.appendChild(li);
}

function phaseTag(phase) {
  // Phase is "complete" if its coordinator + completedAt are populated.
  const complete = !!(phase && phase.coordinator && phase.completedAt);
  const tag = document.createElement('span');
  tag.className = 'phase-tag ' + (complete
    ? 'phase-tag-complete'
    : 'phase-tag-incomplete');
  tag.textContent = complete ? 'complete' : 'incomplete';
  return tag;
}

function renderSignIn(phase) {
  const section = document.createElement('section');
  section.className = 'detail-section';
  const h = document.createElement('h3');
  h.textContent = 'Sign In — before induction of anaesthesia ';
  h.appendChild(phaseTag(phase));
  section.appendChild(h);

  const list = document.createElement('ul');
  list.className = 'detail-items';

  appendDetailItem(list, 'Identity / site / procedure / consent confirmed',
    formatAnswer(phase.identitySiteProcedureConsent));
  appendDetailItem(list, 'Site marked',
    formatAnswer(phase.siteMarked));
  appendDetailItem(list, 'Anaesthesia safety check complete',
    formatAnswer(phase.anaesthesiaCheckComplete));
  appendDetailItem(list, 'Pulse oximeter on patient and functioning',
    formatAnswer(phase.pulseOximeterOnPatient));
  appendDetailItem(list, 'Known allergy',
    formatAnswer(phase.knownAllergy),
    phase.knownAllergyDetail || '');
  appendDetailItem(list, 'Difficult airway / aspiration risk',
    formatAnswer(phase.difficultAirwayAspirationRisk));
  appendDetailItem(list, 'Risk of > 500 ml blood loss (7 ml/kg in children)',
    formatAnswer(phase.bloodLossRisk));
  appendDetailItem(list, 'Coordinator',
    { text: phase.coordinator || 'Not recorded',
      cssClass: phase.coordinator ? '' : 'item-value-unanswered' });
  appendDetailItem(list, 'Completed at',
    { text: phase.completedAt ? formatTimestamp(phase.completedAt) : 'Not recorded',
      cssClass: phase.completedAt ? '' : 'item-value-unanswered' });

  section.appendChild(list);
  return section;
}

function renderTimeOut(phase) {
  const section = document.createElement('section');
  section.className = 'detail-section';
  const h = document.createElement('h3');
  h.textContent = 'Time Out — before skin incision ';
  h.appendChild(phaseTag(phase));
  section.appendChild(h);

  const list = document.createElement('ul');
  list.className = 'detail-items';

  appendDetailItem(list, 'Team introductions confirmed',
    formatAnswer(phase.teamIntroductionsConfirmed));
  appendDetailItem(list, 'Patient / procedure / incision confirmed',
    formatAnswer(phase.patientProcedureIncisionConfirmed));
  appendDetailItem(list, 'Antibiotic prophylaxis within 60 min',
    formatAnswer(phase.antibioticProphylaxisWithin60min));
  appendDetailItem(list, 'Surgeon: critical / unexpected steps',
    { text: phase.surgeonCriticalSteps ? '' : 'Not recorded',
      cssClass: phase.surgeonCriticalSteps ? '' : 'item-value-unanswered' },
    phase.surgeonCriticalSteps || '');
  appendDetailItem(list, 'Anticipated case duration (min)',
    formatAnswer(phase.surgeonCaseDurationMinutes));
  appendDetailItem(list, 'Anticipated blood loss (ml)',
    formatAnswer(phase.surgeonAnticipatedBloodLossMl));
  appendDetailItem(list, 'Anaesthetist: patient-specific concerns',
    { text: phase.anaesthetistPatientConcerns ? '' : 'Not recorded',
      cssClass: phase.anaesthetistPatientConcerns ? '' : 'item-value-unanswered' },
    phase.anaesthetistPatientConcerns || '');
  appendDetailItem(list, 'Nursing: sterility confirmed',
    formatAnswer(phase.nursingSterilityConfirmed));
  appendDetailItem(list, 'Nursing: equipment concerns',
    { text: phase.nursingEquipmentConcerns ? '' : 'None recorded',
      cssClass: phase.nursingEquipmentConcerns ? '' : 'item-value-unanswered' },
    phase.nursingEquipmentConcerns || '');
  appendDetailItem(list, 'Essential imaging displayed',
    formatAnswer(phase.essentialImagingDisplayed));
  appendDetailItem(list, 'Coordinator',
    { text: phase.coordinator || 'Not recorded',
      cssClass: phase.coordinator ? '' : 'item-value-unanswered' });
  appendDetailItem(list, 'Completed at',
    { text: phase.completedAt ? formatTimestamp(phase.completedAt) : 'Not recorded',
      cssClass: phase.completedAt ? '' : 'item-value-unanswered' });

  section.appendChild(list);
  return section;
}

function renderSignOut(phase) {
  const section = document.createElement('section');
  section.className = 'detail-section';
  const h = document.createElement('h3');
  h.textContent = 'Sign Out — before patient leaves the OR ';
  h.appendChild(phaseTag(phase));
  section.appendChild(h);

  const list = document.createElement('ul');
  list.className = 'detail-items';

  appendDetailItem(list, 'Procedure name confirmed',
    formatAnswer(phase.procedureNameConfirmed));
  appendDetailItem(list, 'Instrument / sponge / needle counts confirmed',
    formatAnswer(phase.countsConfirmed));
  appendDetailItem(list, 'Specimens labelled',
    formatAnswer(phase.specimensLabelled));
  appendDetailItem(list, 'Equipment problems',
    { text: phase.equipmentProblems ? '' : 'None recorded',
      cssClass: phase.equipmentProblems ? '' : 'item-value-unanswered' },
    phase.equipmentProblems || '');
  appendDetailItem(list, 'Recovery / management concerns',
    { text: phase.recoveryConcerns ? '' : 'None recorded',
      cssClass: phase.recoveryConcerns ? '' : 'item-value-unanswered' },
    phase.recoveryConcerns || '');
  appendDetailItem(list, 'Coordinator',
    { text: phase.coordinator || 'Not recorded',
      cssClass: phase.coordinator ? '' : 'item-value-unanswered' });
  appendDetailItem(list, 'Completed at',
    { text: phase.completedAt ? formatTimestamp(phase.completedAt) : 'Not recorded',
      cssClass: phase.completedAt ? '' : 'item-value-unanswered' });

  section.appendChild(list);
  return section;
}

function renderTeamSection(team) {
  const section = document.createElement('section');
  section.className = 'detail-section';
  const h = document.createElement('h3');
  h.textContent = 'Operating team';
  section.appendChild(h);

  if (!team || team.length === 0) {
    const p = document.createElement('p');
    p.className = 'empty-message';
    p.textContent = 'No team members recorded.';
    section.appendChild(p);
    return section;
  }

  const table = document.createElement('table');
  table.className = 'team-table';
  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  ['Name', 'Role', 'Introduced'].forEach((label) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = label;
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  team.forEach((m) => {
    const tr = document.createElement('tr');
    const nameTd = document.createElement('td');
    nameTd.textContent = m.name || '';
    const roleTd = document.createElement('td');
    roleTd.textContent = teamRoleLabel(m.role);
    const introTd = document.createElement('td');
    if (m.introducedDuringTimeOut === 'yes') {
      introTd.className = 'team-introduced-yes';
      introTd.textContent = 'Yes';
    } else if (m.introducedDuringTimeOut === 'no') {
      introTd.className = 'team-introduced-no';
      introTd.textContent = 'No';
    } else {
      introTd.textContent = '\u2014';
    }
    tr.appendChild(nameTd);
    tr.appendChild(roleTd);
    tr.appendChild(introTd);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  section.appendChild(table);
  return section;
}

function renderSummary(row) {
  const dl = document.createElement('dl');
  dl.className = 'detail-summary';

  const entries = [
    ['Case ID', row.id],
    ['Case date', row.caseDate],
    ['Patient', row.patient],
    ['Site', row.site],
    ['Operating room', row.operatingRoom],
    ['Procedure', row.plannedProcedure],
    ['Surgeon', row.surgeon],
    ['Anaesthetist', row.anaesthetist],
    ['Lead nurse', row.leadNurse],
    ['Urgency', row.urgency],
    ['Specialty', row.specialty],
    ['Laterality', row.laterality],
    ['Status', statusLabel(row.status)]
  ];
  entries.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = (value === undefined || value === null || value === '')
      ? '\u2014' : String(value);
    dl.appendChild(dt);
    dl.appendChild(dd);
  });

  // Safety flags row spans full width.
  const dtFlags = document.createElement('dt');
  dtFlags.textContent = 'Safety flags';
  const ddFlags = document.createElement('dd');
  if (!row.flags || row.flags.length === 0) {
    ddFlags.textContent = 'None';
  } else {
    const wrap = document.createElement('span');
    wrap.className = 'flag-list-detail';
    row.flags.forEach((f) => {
      const chip = document.createElement('span');
      chip.className = 'flag-chip';
      chip.textContent = f;
      wrap.appendChild(chip);
    });
    ddFlags.appendChild(wrap);
  }
  dl.appendChild(dtFlags);
  dl.appendChild(ddFlags);

  return dl;
}

function openDetailModal(row) {
  const modal = $('detail-modal');
  const title = $('detail-modal-title');
  const body = $('detail-modal-body');

  setText(title,
    `Checklist — ${row.patient || 'Unknown patient'} (${row.id})`);
  clear(body);

  body.appendChild(renderSummary(row));

  if (row.status === 'abandoned' && row.abandonedReason) {
    const section = document.createElement('section');
    section.className = 'detail-section';
    const h = document.createElement('h3');
    h.textContent = 'Abandoned';
    section.appendChild(h);
    const p = document.createElement('p');
    p.textContent = row.abandonedReason;
    section.appendChild(p);
    body.appendChild(section);
  }

  body.appendChild(renderSignIn(row.phase1 || {}));
  body.appendChild(renderTimeOut(row.phase2 || {}));
  body.appendChild(renderSignOut(row.phase3 || {}));
  body.appendChild(renderTeamSection(row.team || []));

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  const closeBtn = $('detail-modal-close');
  if (closeBtn && typeof closeBtn.focus === 'function') {
    closeBtn.focus();
  }
}

function closeDetailModal() {
  const modal = $('detail-modal');
  modal.hidden = true;
  document.body.style.overflow = '';
}

function wireModal() {
  const modal = $('detail-modal');
  const closeBtn = $('detail-modal-close');

  closeBtn.addEventListener('click', closeDetailModal);
  modal.addEventListener('click', (e) => {
    // Click on the backdrop (not the card) closes the modal.
    if (e.target === modal) closeDetailModal();
  });
  document.addEventListener('keydown', (e) => {
    if (!modal.hidden && e.key === 'Escape') {
      closeDetailModal();
    }
  });
}

// -------------------------------------------------------------------- //
// Status banner.
// -------------------------------------------------------------------- //
function showBanner(message) {
  const banner = $('status-banner');
  if (!banner) return;
  setText(banner, message);
  banner.hidden = false;
}

// -------------------------------------------------------------------- //
// Initial data load.
// -------------------------------------------------------------------- //
async function loadData() {
  const sample = Array.isArray(ns.sampleChecklists) ? ns.sampleChecklists : [];

  if (typeof ns.fetchChecklists === 'function') {
    try {
      const rows = await ns.fetchChecklists();
      if (Array.isArray(rows) && rows.length > 0) {
        return rows;
      }
      showBanner('Backend returned no checklists; showing sample data for demonstration.');
      return sample;
    } catch (err) {
      const reason = err && err.message ? err.message : String(err);
      showBanner('Could not reach backend (' + reason + '); showing sample data for demonstration.');
      return sample;
    }
  }
  return sample;
}

// -------------------------------------------------------------------- //
// Bootstrap.
// -------------------------------------------------------------------- //
async function init() {
  try {
    state.rows = await loadData();
  } catch (e) {
    state.rows = Array.isArray(ns.sampleChecklists) ? ns.sampleChecklists : [];
    showBanner('Unexpected error loading checklists; showing sample data.');
  }

  populateSpecialtyOptions();
  wireFilters();
  wireModal();
  applyFiltersAndRender();
}

document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Expose a small surface for tests / debugging without making the
// closure-private state mutable from outside.
ns.app = {
  /** Re-run filter + sort + render (useful after programmatic state edits). */
  refresh: applyFiltersAndRender,
  /** Open the detail modal for a specific checklist row. */
  openDetail: openDetailModal,
  /** Close the detail modal. */
  closeDetail: closeDetailModal
};

})();
