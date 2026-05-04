// First Aid Training Checklist — examiner wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The examiner scrolls through them; a sticky top-of-page
// progress summary reflects how many checklist items have been answered.
// Submission runs the pure FAW grading engine and renders an inline report
// with a Pass / Needs Development / Fail badge, critical-skill audit table,
// non-critical deficiency list, and prioritised flagged-issues list. State
// is persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order: types →
// rules → first-aid-grader → flagged-issues → app) attach their exports to
// `window.FirstAidTrainingChecklist`. The whole file is wrapped in an IIFE
// so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.FirstAidTrainingChecklist;
const {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  triStateLabel,
  triStatePillClass,
  fawRules,
  gradeFirstAid,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'first-aid-training-checklist.front-end-form-with-html.v1';

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
        fresh[key] = { ...fresh[key], ...parsed[key] };
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

/** @type {object | null} */
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
}

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s ?? '')
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
    `value="${esc(value ?? '')}"`
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
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="textarea">${esc(value)}</textarea>
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
  const current = state[opts.section][opts.field] ?? '';
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
    <select id="${id}" name="${id}" class="select-input">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

// Tri-state radio set used for every checklist item.
const TRI_STATE_OPTIONS = [
  { value: 'yes', label: 'Demonstrated correctly', cls: 'choice-yes' },
  { value: 'no', label: 'Not yet', cls: 'choice-no' },
  { value: 'na', label: 'Not assessed', cls: 'choice-na' }
];

/**
 * Build a tri-state checklist item (radio group inside a labelled list row).
 *
 * @param {{ ruleId: string, section: string, field: string, label: string,
 *           critical: boolean }} opts
 */
function checklistItem(opts) {
  const li = document.createElement('li');
  li.className = 'checklist-item' + (opts.critical ? ' is-critical' : '');
  if (opts.ruleId) li.dataset.ruleId = opts.ruleId;

  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];

  const optionsHtml = TRI_STATE_OPTIONS.map((option) => {
    const radioId = `${groupId}-${option.value}`;
    const checked = current === option.value ? ' checked' : '';
    return `
      <label class="radio-option ${option.cls}" for="${radioId}">
        <input type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
        <span>${esc(option.label)}</span>
      </label>
    `;
  }).join('');

  const idBadge = opts.ruleId ? `<span class="item-id">${esc(opts.ruleId)}</span>` : '';

  li.innerHTML = `
    <fieldset class="field radio-group" style="margin:0;">
      <legend class="item-label">
        ${idBadge}
        ${esc(opts.label)}
      </legend>
      <div class="radio-options tri-state">${optionsHtml}</div>
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
  return fawRules.find((r) => r.id === id);
}

/**
 * Build a checklist <ul> for a given step number — pulls every rule
 * registered for that step out of the declarative registry, in registry
 * order. The (section,field) tuple is inferred from the rule label and
 * its evaluator; we provide an explicit `entries` map below for clarity.
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
      label: rule.label,
      critical: rule.critical
    }));
  }
  return ul;
}

/**
 * Build a checklist <ul> for items that are NOT in the rule registry
 * (e.g. step 10 administrative tri-state items). These contribute to the
 * progress bar but are not graded.
 *
 * @param {Array<{ section: string, field: string, label: string }>} entries
 */
function adminChecklist(entries) {
  const ul = document.createElement('ul');
  ul.className = 'checklist';
  for (const entry of entries) {
    ul.appendChild(checklistItem({
      ruleId: '',
      section: entry.section,
      field: entry.field,
      label: entry.label,
      critical: false
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
    title: 'Trainee Details',
    description: 'Identify the trainee and the certification context for this assessment.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'traineeDetails', field: 'firstName' }));
  grid.appendChild(textInput({ label: 'Last name', section: 'traineeDetails', field: 'lastName' }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Trainee ID / employee number',
    section: 'traineeDetails', field: 'traineeId'
  }));

  card.appendChild(selectInput({
    label: 'Role',
    section: 'traineeDetails', field: 'role',
    options: [
      { value: 'first-aider', label: 'First aider (FAW)' },
      { value: 'workplace-first-aider', label: 'Workplace first aider' },
      { value: 'instructor-candidate', label: 'Instructor candidate' },
      { value: 'security-officer', label: 'Security officer' },
      { value: 'lifeguard', label: 'Lifeguard' },
      { value: 'teacher', label: 'Teacher' },
      { value: 'volunteer', label: 'Volunteer' },
      { value: 'other', label: 'Other' }
    ]
  }));

  const dateGrid = document.createElement('div');
  dateGrid.className = 'two-col';
  dateGrid.appendChild(textInput({
    label: 'Prior certification expiry',
    section: 'traineeDetails', field: 'priorCertificationExpiry',
    type: 'date'
  }));
  dateGrid.appendChild(textInput({
    label: 'Session date',
    section: 'traineeDetails', field: 'sessionDate',
    type: 'date'
  }));
  card.appendChild(dateGrid);

  const ctxGrid = document.createElement('div');
  ctxGrid.className = 'two-col';
  ctxGrid.appendChild(textInput({
    label: 'Examiner name',
    section: 'traineeDetails', field: 'examinerName'
  }));
  ctxGrid.appendChild(textInput({
    label: 'Venue',
    section: 'traineeDetails', field: 'venue'
  }));
  card.appendChild(ctxGrid);

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Scene Assessment & Safety',
    description: 'Trainee surveys the scene and controls hazards before approaching the casualty.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-SS-SAFE', section: 'sceneAssessmentSafety', field: 'sceneSafe' },
    { ruleId: 'FAW-SS-PPE', section: 'sceneAssessmentSafety', field: 'ppeApplied' },
    { ruleId: 'FAW-SS-HAZARDS', section: 'sceneAssessmentSafety', field: 'hazardsIdentified' },
    { ruleId: 'FAW-SS-BYSTANDERS', section: 'sceneAssessmentSafety', field: 'bystandersControlled' }
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Primary Survey (DRABC)',
    description: 'Danger, Response, Airway, Breathing, Circulation. The Response check is a critical skill.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-PS-DANGER', section: 'primarySurveyDRABC', field: 'dangerCheck' },
    { ruleId: 'FAW-PS-RESPONSE', section: 'primarySurveyDRABC', field: 'responseCheck' },
    { ruleId: 'FAW-PS-AIRWAY', section: 'primarySurveyDRABC', field: 'airwayManagement' },
    { ruleId: 'FAW-PS-BREATHING', section: 'primarySurveyDRABC', field: 'breathingCheck' },
    { ruleId: 'FAW-PS-CIRCULATION', section: 'primarySurveyDRABC', field: 'circulationAssessment' },
    { ruleId: 'FAW-PS-RECOVERY', section: 'primarySurveyDRABC', field: 'recoveryPositionWhenAppropriate' }
  ]));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'CPR & AED',
    description: 'Effective compressions, ventilations, and safe AED shock delivery are critical skills.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-CPR-COMPRESSIONS', section: 'cprAed', field: 'effectiveCompressions' },
    { ruleId: 'FAW-CPR-VENTILATIONS', section: 'cprAed', field: 'effectiveVentilations' },
    { ruleId: 'FAW-CPR-RATIO', section: 'cprAed', field: 'ratio30to2' },
    { ruleId: 'FAW-AED-POWER', section: 'cprAed', field: 'aedPowerOnPromptly' },
    { ruleId: 'FAW-AED-PADS', section: 'cprAed', field: 'aedPadPlacement' },
    { ruleId: 'FAW-AED-SAFE-SHOCK', section: 'cprAed', field: 'aedSafeShockDelivery' }
  ]));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Choking Management',
    description: 'Encourage coughing, alternate back blows and abdominal thrusts; transition to CPR if unconscious (critical).'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-CHOKE-COUGH', section: 'chokingManagement', field: 'encouragedCoughing' },
    { ruleId: 'FAW-CHOKE-BACKBLOWS', section: 'chokingManagement', field: 'fiveBackBlows' },
    { ruleId: 'FAW-CHOKE-THRUSTS', section: 'chokingManagement', field: 'fiveAbdominalThrusts' },
    { ruleId: 'FAW-CHOKE-ALTERNATE', section: 'chokingManagement', field: 'alternatesUntilDislodged' },
    { ruleId: 'FAW-CHOKE-UNCONSCIOUS', section: 'chokingManagement', field: 'unconsciousChokingCpr' }
  ]));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Bleeding & Wound Care',
    description: 'Direct pressure for major bleeds and tourniquet for catastrophic haemorrhage are critical skills.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-BLEED-PRESSURE', section: 'bleedingWoundCare', field: 'directPressureApplied' },
    { ruleId: 'FAW-BLEED-ELEVATE', section: 'bleedingWoundCare', field: 'elevatedAndImmobilised' },
    { ruleId: 'FAW-BLEED-DRESSING', section: 'bleedingWoundCare', field: 'appliedDressingCorrectly' },
    { ruleId: 'FAW-BLEED-TOURNIQUET', section: 'bleedingWoundCare', field: 'tourniquetWhenIndicated' },
    { ruleId: 'FAW-BLEED-HAEMOSTATIC', section: 'bleedingWoundCare', field: 'haemostaticDressingApplied' },
    { ruleId: 'FAW-BLEED-SHOCK', section: 'bleedingWoundCare', field: 'treatedForShock' }
  ]));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Burns & Scalds',
    description: 'Cool with running water for at least 20 minutes; cover with cling film or sterile dressing.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-BURN-COOL', section: 'burnsScalds', field: 'cooledForTwentyMinutes' },
    { ruleId: 'FAW-BURN-REMOVE', section: 'burnsScalds', field: 'removedJewelleryAndLooseClothing' },
    { ruleId: 'FAW-BURN-COVER', section: 'burnsScalds', field: 'coveredWithClingFilmOrSterileDressing' },
    { ruleId: 'FAW-BURN-NOCREAM', section: 'burnsScalds', field: 'avoidedCreamsOrIce' },
    { ruleId: 'FAW-BURN-REFER', section: 'burnsScalds', field: 'referredAppropriately' }
  ]));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Fractures, Sprains & Spinal Injury',
    description: 'Immobilise in position found, support the head and neck for suspected spinal injury.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-FX-IMMOB', section: 'fracturesSprainsSpinal', field: 'immobilisedInjuredLimb' },
    { ruleId: 'FAW-FX-RICE', section: 'fracturesSprainsSpinal', field: 'appliedRiceForSprains' },
    { ruleId: 'FAW-FX-SPINAL-SUPPORT', section: 'fracturesSprainsSpinal', field: 'suspectedSpinalManualSupport' },
    { ruleId: 'FAW-FX-LOGROLL', section: 'fracturesSprainsSpinal', field: 'performedLogRollWithTeam' },
    { ruleId: 'FAW-FX-NOMOVE', section: 'fracturesSprainsSpinal', field: 'avoidedUnnecessaryMovement' }
  ]));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Medical Emergencies',
    description: 'Anaphylaxis recognition is a critical skill. FAST stroke recognition and chest pain management included.'
  });

  card.appendChild(checklist([
    { ruleId: 'FAW-MED-ANAPHYLAXIS', section: 'medicalEmergencies', field: 'recognisedAnaphylaxis' },
    { ruleId: 'FAW-MED-EPIPEN', section: 'medicalEmergencies', field: 'administeredEpiPenSafely' },
    { ruleId: 'FAW-MED-ASTHMA', section: 'medicalEmergencies', field: 'assistedAsthmaInhaler' },
    { ruleId: 'FAW-MED-HYPO', section: 'medicalEmergencies', field: 'managedHypoglycaemia' },
    { ruleId: 'FAW-MED-SEIZURE', section: 'medicalEmergencies', field: 'managedSeizureSafely' },
    { ruleId: 'FAW-MED-STROKE', section: 'medicalEmergencies', field: 'recognisedStrokeFAST' },
    { ruleId: 'FAW-MED-CHEST-PAIN', section: 'medicalEmergencies', field: 'recognisedChestPain' }
  ]));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Recording, Reporting & Handover',
    description: 'Documentation, RIDDOR awareness, structured SBAR handoff, and post-event debrief notes.'
  });

  // Administrative tri-state items (not in rule registry — not graded, but
  // tracked for progress and rendered with the same UI for consistency).
  card.appendChild(adminChecklist([
    {
      section: 'recordingReportingHandover', field: 'accidentBookEntry',
      label: 'Completes a clear and accurate accident-book entry.'
    },
    {
      section: 'recordingReportingHandover', field: 'riddorAwareness',
      label: 'Demonstrates awareness of RIDDOR reporting obligations.'
    },
    {
      section: 'recordingReportingHandover', field: 'structuredHandoffSbar',
      label: 'Provides a structured SBAR handover to ambulance / next clinician.'
    },
    {
      section: 'recordingReportingHandover', field: 'confidentialityMaintained',
      label: 'Maintains casualty confidentiality and data protection throughout.'
    }
  ]));

  card.appendChild(textArea({
    label: 'Examiner notes',
    section: 'recordingReportingHandover', field: 'examinerNotes',
    placeholder: 'Strengths, deficiencies, coaching focus for next session…',
    rows: 4
  }));
  card.appendChild(textArea({
    label: 'Trainee self-feedback',
    section: 'recordingReportingHandover', field: 'traineeFeedback',
    placeholder: 'Trainee\u2019s reflections after the scenario…',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Debrief notes',
    section: 'recordingReportingHandover', field: 'debriefNotes',
    placeholder: 'Structured debrief notes for the training file…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Track every checklist tri-state field across steps 2-10 (skills + admin).
 * Trainee-detail fields are intentionally excluded so progress reflects the
 * skills assessment, not the paperwork.
 *
 * Rule-derived fields are looked up directly from the rule registry so this
 * stays in sync if rules are added or removed.
 */
function trackedFields() {
  /** @type {Array<[string, string]>} */
  const fields = [];

  // Every rule-backed field (steps 2-9).
  for (const rule of fawRules) {
    // The (section, field) tuple isn't directly carried on the rule, but the
    // evaluator follows the read(d, section, field) idiom — so we infer from
    // the explicit map below. Easier: hard-code the section/field per step.
  }

  // Hard-coded list (matches the section renderers). This is the single
  // source of truth for which fields drive the progress bar.
  const sections = [
    ['sceneAssessmentSafety', ['sceneSafe', 'ppeApplied', 'hazardsIdentified', 'bystandersControlled']],
    ['primarySurveyDRABC', ['dangerCheck', 'responseCheck', 'airwayManagement', 'breathingCheck', 'circulationAssessment', 'recoveryPositionWhenAppropriate']],
    ['cprAed', ['effectiveCompressions', 'effectiveVentilations', 'ratio30to2', 'aedPowerOnPromptly', 'aedPadPlacement', 'aedSafeShockDelivery']],
    ['chokingManagement', ['encouragedCoughing', 'fiveBackBlows', 'fiveAbdominalThrusts', 'alternatesUntilDislodged', 'unconsciousChokingCpr']],
    ['bleedingWoundCare', ['directPressureApplied', 'elevatedAndImmobilised', 'appliedDressingCorrectly', 'tourniquetWhenIndicated', 'haemostaticDressingApplied', 'treatedForShock']],
    ['burnsScalds', ['cooledForTwentyMinutes', 'removedJewelleryAndLooseClothing', 'coveredWithClingFilmOrSterileDressing', 'avoidedCreamsOrIce', 'referredAppropriately']],
    ['fracturesSprainsSpinal', ['immobilisedInjuredLimb', 'appliedRiceForSprains', 'suspectedSpinalManualSupport', 'performedLogRollWithTeam', 'avoidedUnnecessaryMovement']],
    ['medicalEmergencies', ['recognisedAnaphylaxis', 'administeredEpiPenSafely', 'assistedAsthmaInhaler', 'managedHypoglycaemia', 'managedSeizureSafely', 'recognisedStrokeFAST', 'recognisedChestPain']],
    ['recordingReportingHandover', ['accidentBookEntry', 'riddorAwareness', 'structuredHandoffSbar', 'confidentialityMaintained']]
  ];
  for (const [section, fieldList] of sections) {
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
  if (text) text.textContent = `${answered} of ${total} items assessed (${percent}%)`;
  const aria = document.getElementById('progress-bar');
  if (aria) aria.setAttribute('aria-valuenow', String(percent));
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    outcome,
    criticalFailures,
    deficiencies,
    firedRules,
    additionalFlags,
    answeredCount,
    totalRules,
    timestamp
  } = lastResult;

  // Critical-skill audit table — show every critical rule and its status.
  const criticalRules = firedRules.filter((r) => r.critical);
  const auditRows = criticalRules.map((r) => {
    const rowCls = r.status === 'no'
      ? 'critical-fail'
      : (r.status === 'yes' ? 'critical-pass' : '');
    return `
      <tr class="${rowCls}">
        <th scope="row">${esc(r.id)}</th>
        <td>${esc(r.category)}</td>
        <td>${esc(r.description)}</td>
        <td class="status">
          <span class="status-pill ${triStatePillClass(r.status)}">${esc(triStateLabel(r.status))}</span>
        </td>
      </tr>
    `;
  }).join('');

  const auditTable = `
    <table class="audit">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Category</th>
          <th scope="col">Critical skill</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>${auditRows}</tbody>
    </table>
  `;

  // Non-critical deficiencies summary
  const defList = deficiencies.length === 0
    ? `<p class="muted">No non-critical deficiencies recorded.</p>`
    : `
      <ul class="checklist" style="gap:0.375rem;">
        ${deficiencies.map((r) => `
          <li class="checklist-item">
            <span class="item-label">
              <span class="item-id">${esc(r.id)}</span>
              ${esc(r.description)}
            </span>
            <span class="muted">${esc(r.category)} (Section ${r.step})</span>
          </li>
        `).join('')}
      </ul>
    `;

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

  // Outcome summary line
  let summaryText = '';
  if (outcome === 'pass') {
    summaryText = `All critical skills demonstrated; no non-critical deficiencies.`;
  } else if (outcome === 'needs-development') {
    summaryText = `${deficiencies.length} non-critical deficiency(ies) — targeted retraining recommended.`;
  } else if (criticalFailures.length > 0) {
    summaryText = `${criticalFailures.length} critical-skill failure(s) — automatic Fail.`;
  } else if (deficiencies.length > 2) {
    summaryText = `${deficiencies.length} non-critical deficiencies (limit is 2) — Fail.`;
  } else {
    summaryText = 'Insufficient items assessed to grade — please complete the checklist.';
  }

  const trainee = state.traineeDetails;
  const traineeName = `${trainee.firstName} ${trainee.lastName}`.trim();

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>First Aid at Work Competency Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${
          traineeName ? ` for ${esc(traineeName)}` : ''
        }${trainee.examinerName ? ` · examiner: ${esc(trainee.examinerName)}` : ''}</p>
      </header>

      <h3>Outcome</h3>
      <p class="outcome-summary">
        <span class="outcome-badge ${outcomeClass(outcome)}">${esc(outcomeLabel(outcome) || '—')}</span>
        <span class="outcome-detail">${esc(summaryText)}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of ${totalRules} graded checklist items recorded.</p>

      <h3>Critical-skill audit</h3>
      ${auditTable}

      <h3>Non-critical deficiencies</h3>
      ${defList}

      <h3>Flagged issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="btn btn-secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const grading = gradeFirstAid(state);
  const additionalFlags = detectAdditionalFlags(state, grading);
  lastResult = {
    outcome: grading.outcome,
    criticalFailures: grading.criticalFailures,
    deficiencies: grading.deficiencies,
    firedRules: grading.firedRules,
    additionalFlags,
    answeredCount: grading.answeredCount,
    totalRules: grading.totalRules,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Are you sure? This will clear all answers and start a fresh competency assessment.')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  const report = document.getElementById('report');
  if (report) report.innerHTML = '';
  renderForm();
  updateProgress();
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

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.addEventListener('click', submitForm);
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
