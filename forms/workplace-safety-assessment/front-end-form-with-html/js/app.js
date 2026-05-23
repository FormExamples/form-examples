// Workplace Safety Assessment — auditor checklist (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The auditor scrolls through them; a sticky progress bar
// reflects how many checklist items have been answered. Submission runs the
// pure safety grading engine and renders an inline report with an outcome
// badge, findings-by-category table, action-plan summary, and a prioritised
// flagged-issues list. State is persisted to localStorage so a partial
// fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order: types →
// rules → safety-grader → flagged-issues → app) attach their exports to
// `window.WorkplaceSafetyAssessment`. The whole file is wrapped in an IIFE
// so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.WorkplaceSafetyAssessment;
const {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  gradeLabel,
  findingLevelClass,
  gradeToFindingLevel,
  actionTimeframe,
  safetyRules,
  gradeSafety,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'workplace-safety-assessment.front-end-form-with-html.v1';

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    // Merge over a fresh empty so any newly-added fields default correctly.
    const fresh = emptyAssessment();
    for (const key of Object.keys(fresh)) {
      if (parsed && typeof parsed[key] === 'object' && parsed[key] !== null) {
        if (Array.isArray(fresh[key])) {
          fresh[key] = Array.isArray(parsed[key]) ? parsed[key].slice() : fresh[key];
        } else {
          fresh[key] = { ...fresh[key], ...parsed[key] };
        }
      }
    }
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} st */
function saveState(st) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
  } catch (e) {
    console.warn('Could not save assessment to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored assessment.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

/**
 * Build a labelled text input.
 * @param {{ label: string, section: string, field: string, type?: string,
 *           placeholder?: string, min?: number, max?: number, step?: number,
 *           unit?: string }} opts
 */
function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value == null ? '' : value)}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v);
  });
  return wrapper;
}

/**
 * Build a labelled multi-line text area.
 */
function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] == null
    ? '' : state[opts.section][opts.field];
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="text-area-input">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a select / dropdown input.
 */
function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] == null
    ? '' : state[opts.section][opts.field];
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

// Yes/No/N/A radio chips for compliance items.
const YES_NO_NA_OPTIONS = [
  { value: 'yes', label: 'Yes',  cls: 'choice-yes' },
  { value: 'no',  label: 'No',   cls: 'choice-no' },
  { value: 'na',  label: 'N/A',  cls: 'choice-na' }
];

/**
 * Build a checklist item: a yes/no/N/A radio group with a rule id and
 * description. The "good direction" of an answer (yes vs no) varies by rule
 * and is encoded in rules.js — this UI just captures the auditor's answer.
 *
 * @param {{ ruleId: string, section: string, field: string, label: string,
 *           severity: number }} opts
 */
function checklistItem(opts) {
  const li = document.createElement('li');
  const sevCls = opts.severity >= 4
    ? 'is-severity-critical'
    : opts.severity === 3
      ? 'is-severity-major'
      : 'is-severity-minor';
  li.className = `checklist-item ${sevCls}`;
  li.dataset.ruleId = opts.ruleId;

  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];

  const optionsHtml = YES_NO_NA_OPTIONS.map((option) => {
    const radioId = `${groupId}-${option.value}`;
    const checked = current === option.value ? ' checked' : '';
    return `
      <label class="radio-option ${option.cls}" for="${radioId}">
        <input type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
        <span>${esc(option.label)}</span>
      </label>
    `;
  }).join('');

  li.innerHTML = `
    <fieldset class="field radio-group" style="margin:0;">
      <legend class="item-label">
        <span class="item-id">${esc(opts.ruleId)}</span>
        ${esc(opts.label)}
        <span class="item-severity grade-${opts.severity}">${esc(gradeLabel(opts.severity))}</span>
      </legend>
      <div class="radio-options yes-no-na">${optionsHtml}</div>
    </fieldset>
  `;

  li.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, input.value);
    });
  });
  return li;
}

/**
 * Build a section card.
 */
function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  if (opts.conditional) card.dataset.conditional = opts.conditional;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of 10</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/**
 * Look up the canonical rule definition by id (so checklist rendering
 * stays in sync with the grader's rule registry).
 */
function ruleById(id) {
  return safetyRules.find((r) => r.id === id);
}

/** Build a checklist <ul> hosting the listed rule IDs.
 *
 * @param {Array<{ ruleId: string, section: string, field: string }>} entries
 */
function checklist(entries) {
  const ul = document.createElement('ul');
  ul.className = 'checklist';
  for (const entry of entries) {
    const rule = ruleById(entry.ruleId);
    if (!rule) {
      console.warn('Unknown rule id:', entry.ruleId);
      continue;
    }
    ul.appendChild(checklistItem({
      ruleId: rule.id,
      section: entry.section,
      field: entry.field,
      label: rule.description,
      severity: rule.severity
    }));
  }
  return ul;
}

// ----------------------------------------------------------------------
// Section renderers (1 per assessment step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics & Site Details',
    description: 'Identify the auditor, the site, and the scope of this audit.'
  });

  const row1 = document.createElement('div');
  row1.className = 'two-col';
  row1.appendChild(textInput({ label: 'Auditor name', section: 'siteDetails', field: 'auditorName' }));
  row1.appendChild(textInput({ label: 'Auditor role', section: 'siteDetails', field: 'auditorRole' }));
  card.appendChild(row1);

  const row2 = document.createElement('div');
  row2.className = 'two-col';
  row2.appendChild(textInput({
    label: 'Audit date', section: 'siteDetails', field: 'auditDate', type: 'date'
  }));
  row2.appendChild(textInput({
    label: 'Previous audit date', section: 'siteDetails', field: 'previousAuditDate', type: 'date'
  }));
  card.appendChild(row2);

  card.appendChild(textInput({ label: 'Site name', section: 'siteDetails', field: 'siteName' }));
  card.appendChild(textArea({
    label: 'Site address', section: 'siteDetails', field: 'siteAddress', rows: 2
  }));

  const row3 = document.createElement('div');
  row3.className = 'two-col';
  row3.appendChild(textInput({ label: 'Department / area', section: 'siteDetails', field: 'departmentArea' }));
  row3.appendChild(textInput({ label: 'Site manager', section: 'siteDetails', field: 'siteManager' }));
  card.appendChild(row3);

  card.appendChild(checklist([
    { ruleId: 'WS-001', section: 'siteDetails', field: 'previousFindingsClosed' }
  ]));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'PPE & Hazard Controls',
    description: 'Personal protective equipment, signage, and general housekeeping.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-002', section: 'ppeHazardControls', field: 'ppeAvailable' },
    { ruleId: 'WS-003', section: 'ppeHazardControls', field: 'ppeCorrectlyUsed' },
    { ruleId: 'WS-004', section: 'ppeHazardControls', field: 'ppeStockMaintained' },
    { ruleId: 'WS-005', section: 'ppeHazardControls', field: 'hazardSignageVisible' },
    { ruleId: 'WS-006', section: 'ppeHazardControls', field: 'signageLegible' },
    { ruleId: 'WS-007', section: 'ppeHazardControls', field: 'housekeepingSatisfactory' },
    { ruleId: 'WS-008', section: 'ppeHazardControls', field: 'slipTripHazardsControlled' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'ppeHazardControls', field: 'observations',
    placeholder: 'Evidence, photographs filed, narrative detail…',
    rows: 3
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Chemical & Biological Hazards',
    description: 'COSHH register, SDS, labelling, storage, spill response, sharps and clinical waste.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-009', section: 'chemicalBiologicalHazards', field: 'coshhRegisterPresent' },
    { ruleId: 'WS-010', section: 'chemicalBiologicalHazards', field: 'sdsAvailable' },
    { ruleId: 'WS-011', section: 'chemicalBiologicalHazards', field: 'chemicalsLabelledCorrectly' },
    { ruleId: 'WS-012', section: 'chemicalBiologicalHazards', field: 'chemicalsStoredSecurely' },
    { ruleId: 'WS-013', section: 'chemicalBiologicalHazards', field: 'spillKitsAvailable' },
    { ruleId: 'WS-014', section: 'chemicalBiologicalHazards', field: 'untreatedSpillsObserved' },
    { ruleId: 'WS-015', section: 'chemicalBiologicalHazards', field: 'sharpsContainersInDate' },
    { ruleId: 'WS-016', section: 'chemicalBiologicalHazards', field: 'clinicalWasteSegregated' },
    { ruleId: 'WS-017', section: 'chemicalBiologicalHazards', field: 'biologicalRiskAssessmentCurrent' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'chemicalBiologicalHazards', field: 'observations',
    placeholder: 'Spill kit location, COSHH register format, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Electrical Safety',
    description: 'PAT testing, fixed wiring, equipment condition, sockets and consumer unit.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-018', section: 'electricalSafety', field: 'patTestingInDate' },
    { ruleId: 'WS-019', section: 'electricalSafety', field: 'fixedWiringTestInDate' },
    { ruleId: 'WS-020', section: 'electricalSafety', field: 'damagedEquipmentObserved' },
    { ruleId: 'WS-021', section: 'electricalSafety', field: 'overloadedSocketsObserved' },
    { ruleId: 'WS-022', section: 'electricalSafety', field: 'extensionLeadsManagedSafely' },
    { ruleId: 'WS-023', section: 'electricalSafety', field: 'consumerUnitAccessible' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'electricalSafety', field: 'observations',
    placeholder: 'PAT label dates, EICR certificate location, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Fire Safety & Emergency Egress',
    description: 'Fire risk assessment, extinguishers, alarms, egress routes, lighting, fire doors.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-024', section: 'fireSafety', field: 'fireRiskAssessmentCurrent' },
    { ruleId: 'WS-025', section: 'fireSafety', field: 'fireExtinguishersServiced' },
    { ruleId: 'WS-026', section: 'fireSafety', field: 'fireExtinguishersAccessible' },
    { ruleId: 'WS-027', section: 'fireSafety', field: 'fireAlarmTestedWeekly' },
    { ruleId: 'WS-028', section: 'fireSafety', field: 'emergencyEgressClear' },
    { ruleId: 'WS-029', section: 'fireSafety', field: 'emergencyLightingFunctional' },
    { ruleId: 'WS-030', section: 'fireSafety', field: 'fireDoorsHeldOpenIllegally' },
    { ruleId: 'WS-031', section: 'fireSafety', field: 'assemblyPointSignposted' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'fireSafety', field: 'observations',
    placeholder: 'Alarm test log location, last drill date, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Ergonomics & Manual Handling',
    description: 'Manual handling assessments, lifting aids, DSE assessments, postural risks.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-032', section: 'ergonomicsManualHandling', field: 'manualHandlingAssessmentCurrent' },
    { ruleId: 'WS-033', section: 'ergonomicsManualHandling', field: 'liftingAidsAvailable' },
    { ruleId: 'WS-034', section: 'ergonomicsManualHandling', field: 'dseAssessmentsCompleted' },
    { ruleId: 'WS-035', section: 'ergonomicsManualHandling', field: 'workstationsAdjustable' },
    { ruleId: 'WS-036', section: 'ergonomicsManualHandling', field: 'repetitiveStrainConcerns' },
    { ruleId: 'WS-037', section: 'ergonomicsManualHandling', field: 'patientHandlingPlansInPlace' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'ergonomicsManualHandling', field: 'observations',
    placeholder: 'Hoist service stickers, DSE returns rate, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Emergency Procedures',
    description: 'Evacuation, first-aid kits, first aiders, AED, contacts, drills.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-038', section: 'emergencyProcedures', field: 'evacuationProcedurePosted' },
    { ruleId: 'WS-039', section: 'emergencyProcedures', field: 'firstAidKitsStocked' },
    { ruleId: 'WS-040', section: 'emergencyProcedures', field: 'firstAiderRosterCurrent' },
    { ruleId: 'WS-041', section: 'emergencyProcedures', field: 'aedAvailable' },
    { ruleId: 'WS-042', section: 'emergencyProcedures', field: 'aedServiceInDate' },
    { ruleId: 'WS-043', section: 'emergencyProcedures', field: 'emergencyContactsDisplayed' },
    { ruleId: 'WS-044', section: 'emergencyProcedures', field: 'drillConductedLast12Months' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'emergencyProcedures', field: 'observations',
    placeholder: 'AED location, last drill report reference, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Training & Competence',
    description: 'Mandatory training, fire marshals, infection control, induction.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-045', section: 'trainingCompetence', field: 'mandatoryTrainingUpToDate' },
    { ruleId: 'WS-046', section: 'trainingCompetence', field: 'fireMarshalsTrained' },
    { ruleId: 'WS-047', section: 'trainingCompetence', field: 'manualHandlingTrainingCurrent' },
    { ruleId: 'WS-048', section: 'trainingCompetence', field: 'infectionControlTrainingCurrent' },
    { ruleId: 'WS-049', section: 'trainingCompetence', field: 'trainingRecordsAccessible' },
    { ruleId: 'WS-050', section: 'trainingCompetence', field: 'inductionForNewStartersCompleted' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'trainingCompetence', field: 'observations',
    placeholder: 'Completion-rate snapshots, refresher schedules, etc.…',
    rows: 3
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Incident Reporting & Near Misses',
    description: 'Reporting system use, RIDDOR compliance, near-miss culture, lessons learned.'
  });
  card.appendChild(checklist([
    { ruleId: 'WS-051', section: 'incidentReporting', field: 'incidentReportingSystemUsed' },
    { ruleId: 'WS-052', section: 'incidentReporting', field: 'riddorReportableIncidentsReported' },
    { ruleId: 'WS-053', section: 'incidentReporting', field: 'nearMissReportingActive' }
  ]));

  const counts = document.createElement('div');
  counts.className = 'two-col';
  counts.appendChild(textInput({
    label: 'Incidents (last 12 months)',
    section: 'incidentReporting', field: 'incidentsLast12Months',
    type: 'number', min: 0, step: 1
  }));
  counts.appendChild(textInput({
    label: 'Near misses (last 12 months)',
    section: 'incidentReporting', field: 'nearMissesLast12Months',
    type: 'number', min: 0, step: 1
  }));
  card.appendChild(counts);

  card.appendChild(checklist([
    { ruleId: 'WS-054', section: 'incidentReporting', field: 'lessonsLearnedShared' },
    { ruleId: 'WS-055', section: 'incidentReporting', field: 'actionsFromIncidentsTracked' }
  ]));
  card.appendChild(textArea({
    label: 'Observations',
    section: 'incidentReporting', field: 'observations',
    placeholder: 'System name, recent RIDDOR submissions, etc.…',
    rows: 3
  }));
  return card;
}

// ─── Step 10: Sign-off & Action Plan ────────────────────────────────────

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical — immediate' },
  { value: 'major',    label: 'Major — within 30 days' },
  { value: 'minor',    label: 'Minor — within 90 days' }
];

function actionItemRow(item, index) {
  const row = document.createElement('li');
  row.className = 'action-item';
  row.dataset.index = String(index);

  const idBase = `action-${index}`;
  const optionsHtml = [
    `<option value="">— Priority —</option>`,
    ...PRIORITY_OPTIONS.map((o) =>
      `<option value="${esc(o.value)}"${o.value === item.priority ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  row.innerHTML = `
    <div class="action-item-grid">
      <div class="field action-desc">
        <label for="${idBase}-description">Description</label>
        <textarea id="${idBase}-description" class="text-area-input" rows="2"
          placeholder="What corrective action is required?">${esc(item.description)}</textarea>
      </div>
      <div class="field">
        <label for="${idBase}-owner">Owner</label>
        <input id="${idBase}-owner" class="text-input" type="text"
          value="${esc(item.owner)}" placeholder="Named individual or role">
      </div>
      <div class="field">
        <label for="${idBase}-dueDate">Due date</label>
        <input id="${idBase}-dueDate" class="text-input" type="date" value="${esc(item.dueDate)}">
      </div>
      <div class="field">
        <label for="${idBase}-priority">Priority</label>
        <select id="${idBase}-priority" class="select">${optionsHtml}</select>
      </div>
      <div class="action-item-actions">
        <button type="button" class="btn btn-tertiary action-remove" aria-label="Remove action item">Remove</button>
      </div>
    </div>
  `;

  const desc = row.querySelector(`#${idBase}-description`);
  desc.addEventListener('input', () => {
    state.signoffActionPlan.actionItems[index].description = desc.value;
    saveState(state);
  });
  const owner = row.querySelector(`#${idBase}-owner`);
  owner.addEventListener('input', () => {
    state.signoffActionPlan.actionItems[index].owner = owner.value;
    saveState(state);
  });
  const due = row.querySelector(`#${idBase}-dueDate`);
  due.addEventListener('input', () => {
    state.signoffActionPlan.actionItems[index].dueDate = due.value;
    saveState(state);
  });
  const pri = row.querySelector(`#${idBase}-priority`);
  pri.addEventListener('change', () => {
    state.signoffActionPlan.actionItems[index].priority = pri.value;
    saveState(state);
  });
  row.querySelector('.action-remove').addEventListener('click', () => {
    state.signoffActionPlan.actionItems.splice(index, 1);
    saveState(state);
    renderActionItemsList();
    updateProgress();
  });

  return row;
}

function renderActionItemsList() {
  const host = document.getElementById('action-items-list');
  if (!host) return;
  host.innerHTML = '';
  const items = state.signoffActionPlan.actionItems;
  if (items.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No action items yet. Add the first finding below.';
    host.appendChild(empty);
    return;
  }
  items.forEach((item, i) => host.appendChild(actionItemRow(item, i)));
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Sign-off & Action Plan',
    description: 'Capture the corrective action plan, debrief, and auditor sign-off.'
  });

  const planWrap = document.createElement('div');
  planWrap.className = 'field';
  planWrap.innerHTML = `
    <label>Action plan</label>
    <ol id="action-items-list" class="action-items"></ol>
    <button type="button" id="add-action-btn" class="button" data-variant="tertiary">+ Add action item</button>
  `;
  card.appendChild(planWrap);

  card.appendChild(textArea({
    label: 'Overall summary',
    section: 'signoffActionPlan', field: 'overallSummary',
    placeholder: 'Headline findings, themes, and recommended next steps…',
    rows: 4
  }));

  card.appendChild(checklist([
    { ruleId: 'WS-056', section: 'signoffActionPlan', field: 'debriefDelivered' }
  ]));

  const row = document.createElement('div');
  row.className = 'two-col';
  row.appendChild(textInput({
    label: 'Auditor signature (typed name)',
    section: 'signoffActionPlan', field: 'auditorSignature'
  }));
  row.appendChild(textInput({
    label: 'Sign-off date',
    section: 'signoffActionPlan', field: 'signoffDate', type: 'date'
  }));
  card.appendChild(row);

  // Wire add-button after appending so the host id exists in the doc fragment.
  setTimeout(() => {
    const addBtn = document.getElementById('add-action-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        state.signoffActionPlan.actionItems.push({
          description: '', owner: '', dueDate: '', priority: ''
        });
        saveState(state);
        renderActionItemsList();
      });
    }
    renderActionItemsList();
  }, 0);

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections (placeholder — kept for future expansion)
// ----------------------------------------------------------------------

/**
 * Show / hide elements marked with `data-conditional`. The current schema has
 * no hard conditional gating, but the hook is wired so future rules can
 * reveal sub-fields based on an answer (e.g. only ask about AED service if
 * AED available === yes).
 */
function updateConditionalSections() {
  // AED service question is moot if there's no AED available.
  const aedServiceItem = document.querySelector(
    'li.checklist-item[data-rule-id="WS-042"]'
  );
  if (aedServiceItem) {
    if (state.emergencyProcedures.aedAvailable === 'no') {
      aedServiceItem.classList.add('is-hidden');
    } else {
      aedServiceItem.classList.remove('is-hidden');
    }
  }
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Build the list of fields whose presence drives the progress bar. Includes
 * every yes/no/N/A checklist field plus key narrative / numeric fields.
 */
function trackedFields() {
  const fields = [];
  // Every safety rule maps to a tracked field.
  for (const rule of safetyRules) {
    // Find the (section, field) whose value the rule reads. We can recover
    // that from the rule's `evaluate` source — but it's easier to maintain a
    // small table by category of the field names. The rules are 1:1 with
    // schema fields, so derive from the schema instead.
  }
  // Tri-state checklist fields, by section:
  const items = [
    ['siteDetails', ['previousFindingsClosed']],
    ['ppeHazardControls', [
      'ppeAvailable', 'ppeCorrectlyUsed', 'ppeStockMaintained',
      'hazardSignageVisible', 'signageLegible', 'housekeepingSatisfactory',
      'slipTripHazardsControlled'
    ]],
    ['chemicalBiologicalHazards', [
      'coshhRegisterPresent', 'sdsAvailable', 'chemicalsLabelledCorrectly',
      'chemicalsStoredSecurely', 'spillKitsAvailable', 'untreatedSpillsObserved',
      'sharpsContainersInDate', 'clinicalWasteSegregated',
      'biologicalRiskAssessmentCurrent'
    ]],
    ['electricalSafety', [
      'patTestingInDate', 'fixedWiringTestInDate', 'damagedEquipmentObserved',
      'overloadedSocketsObserved', 'extensionLeadsManagedSafely',
      'consumerUnitAccessible'
    ]],
    ['fireSafety', [
      'fireRiskAssessmentCurrent', 'fireExtinguishersServiced',
      'fireExtinguishersAccessible', 'fireAlarmTestedWeekly',
      'emergencyEgressClear', 'emergencyLightingFunctional',
      'fireDoorsHeldOpenIllegally', 'assemblyPointSignposted'
    ]],
    ['ergonomicsManualHandling', [
      'manualHandlingAssessmentCurrent', 'liftingAidsAvailable',
      'dseAssessmentsCompleted', 'workstationsAdjustable',
      'repetitiveStrainConcerns', 'patientHandlingPlansInPlace'
    ]],
    ['emergencyProcedures', [
      'evacuationProcedurePosted', 'firstAidKitsStocked',
      'firstAiderRosterCurrent', 'aedAvailable', 'aedServiceInDate',
      'emergencyContactsDisplayed', 'drillConductedLast12Months'
    ]],
    ['trainingCompetence', [
      'mandatoryTrainingUpToDate', 'fireMarshalsTrained',
      'manualHandlingTrainingCurrent', 'infectionControlTrainingCurrent',
      'trainingRecordsAccessible', 'inductionForNewStartersCompleted'
    ]],
    ['incidentReporting', [
      'incidentReportingSystemUsed', 'riddorReportableIncidentsReported',
      'nearMissReportingActive', 'incidentsLast12Months',
      'nearMissesLast12Months', 'lessonsLearnedShared',
      'actionsFromIncidentsTracked'
    ]],
    ['signoffActionPlan', ['debriefDelivered']]
  ];
  for (const [section, fieldList] of items) {
    for (const field of fieldList) fields.push([section, field]);
  }
  return fields;
}

const TRACKED_FIELDS = trackedFields();

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  const aria = document.getElementById('progress-bar');
  if (aria) aria.setAttribute('aria-valuenow', String(percent));
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'urgent': return 'flag-high';
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default: return '';
  }
}

function gradeBadgeClass(grade) {
  return `grade grade-${grade}`;
}

function findingsTableHtml(findingsByCategory) {
  const rows = Object.values(findingsByCategory)
    .sort((a, b) => {
      const wa = a.critical * 1000 + a.major * 100 + a.minor * 10 + a.compliant;
      const wb = b.critical * 1000 + b.major * 100 + b.minor * 10 + b.compliant;
      return wb - wa;
    })
    .map((c) => {
      const worst = c.critical > 0 ? 4
        : c.major > 0 ? 3
        : c.minor > 0 ? 2 : 1;
      return `
        <tr>
          <th scope="row">${esc(c.category)}</th>
          <td class="num">${c.compliant}</td>
          <td class="num"><span class="grade grade-2">${c.minor}</span></td>
          <td class="num"><span class="grade grade-3">${c.major}</span></td>
          <td class="num"><span class="grade grade-4">${c.critical}</span></td>
          <td class="num">${c.total}</td>
          <td><span class="${gradeBadgeClass(worst)}">${esc(gradeLabel(worst))}</span></td>
        </tr>
      `;
    }).join('');

  return `
    <table class="audit findings-table">
      <thead>
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Compliant</th>
          <th scope="col">Minor</th>
          <th scope="col">Major</th>
          <th scope="col">Critical</th>
          <th scope="col">Total</th>
          <th scope="col">Worst grade</th>
        </tr>
      </thead>
      <tbody>${rows || `<tr><td colspan="7" class="muted">No items answered yet.</td></tr>`}</tbody>
    </table>
  `;
}

function actionPlanSummaryHtml() {
  const items = state.signoffActionPlan.actionItems;
  if (items.length === 0) {
    return `<p class="muted">No action items recorded.</p>`;
  }
  const rows = items.map((it) => {
    const pCls = it.priority === 'critical' ? 'grade-4'
      : it.priority === 'major' ? 'grade-3'
      : it.priority === 'minor' ? 'grade-2' : '';
    const pLabel = it.priority
      ? it.priority.charAt(0).toUpperCase() + it.priority.slice(1)
      : '—';
    return `
      <tr>
        <td>${esc(it.description) || '<span class="muted">(no description)</span>'}</td>
        <td>${esc(it.owner) || '<span class="muted">—</span>'}</td>
        <td>${esc(it.dueDate) || '<span class="muted">—</span>'}</td>
        <td>${pCls ? `<span class="grade ${pCls}">${esc(pLabel)}</span>` : '<span class="muted">—</span>'}</td>
      </tr>
    `;
  }).join('');
  return `
    <table class="audit action-plan-table">
      <thead>
        <tr>
          <th scope="col">Description</th>
          <th scope="col">Owner</th>
          <th scope="col">Due date</th>
          <th scope="col">Priority</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    outcome,
    findingsByCategory,
    firedRules,
    additionalFlags,
    answeredCount,
    timestamp
  } = lastResult;

  // Flagged-issues list
  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  // Findings list (rules that fired with grade > 1)
  const nonCompliant = firedRules.filter((r) => r.grade > 1)
    .sort((a, b) => b.grade - a.grade);
  const findingsList = nonCompliant.length === 0
    ? `<p class="muted">No non-compliant items recorded.</p>`
    : `
      <ul class="findings-list">
        ${nonCompliant.map((r) => `
          <li class="finding-item finding-grade-${r.grade}">
            <span class="item-id">${esc(r.id)}</span>
            <span class="finding-desc">${esc(r.description)}</span>
            <span class="finding-meta">
              <span class="finding-category">${esc(r.category)}</span>
              <span class="grade grade-${r.grade}">${esc(gradeLabel(r.grade))}</span>
            </span>
          </li>
        `).join('')}
      </ul>
    `;

  const totalCount = TRACKED_FIELDS.length;
  const site = state.siteDetails;
  const siteHeader = [
    site.siteName,
    site.departmentArea
  ].filter((s) => s && s.trim() !== '').join(' — ');

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Workplace Safety Audit Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${
          siteHeader ? ` · ${esc(siteHeader)}` : ''
        }${site.auditorName ? ` · auditor: ${esc(site.auditorName)}` : ''}</p>
      </header>

      <h3>Outcome</h3>
      <p class="outcome-summary">
        <span class="outcome-badge ${outcomeClass(outcome)}">${esc(outcomeLabel(outcome) || '—')}</span>
        <span class="outcome-detail">${esc(actionTimeframe(outcome))}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of ${totalCount} checklist items recorded.</p>

      <h3>Findings by category</h3>
      ${findingsTableHtml(findingsByCategory)}

      <h3>Non-compliant items</h3>
      ${findingsList}

      <h3>Action plan</h3>
      ${actionPlanSummaryHtml()}

      <h3>Flagged issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startBtn = document.getElementById('start-over-btn');
  if (startBtn) startBtn.addEventListener('click', startOver);
}

function submitForm() {
  const grading = gradeSafety(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    outcome: grading.outcome,
    findingsByCategory: grading.findingsByCategory,
    firedRules: grading.firedRules,
    additionalFlags,
    answeredCount: grading.answeredCount,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Are you sure? This will clear all answers and start a fresh audit.')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  const out = document.getElementById('report');
  if (out) out.innerHTML = '';
  renderForm();
  updateProgress();
  updateConditionalSections();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  host.innerHTML = '';
  host.appendChild(renderStep1());
  host.appendChild(renderStep2());
  host.appendChild(renderStep3());
  host.appendChild(renderStep4());
  host.appendChild(renderStep5());
  host.appendChild(renderStep6());
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
}

function init() {
  renderForm();
  updateProgress();
  updateConditionalSections();

  const submit = document.getElementById('submit-btn');
  const reset = document.getElementById('reset-btn');
  if (submit) submit.addEventListener('click', submitForm);
  if (reset)  reset.addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
