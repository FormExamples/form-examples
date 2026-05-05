// Emergency Medical Technician Psychomotor Examination — examiner wizard.
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The examiner scrolls through them; a sticky top-of-page
// progress summary reflects how many checklist items have been answered.
// Submission runs the pure psychomotor grading engine and renders an inline
// report with a Pass/Fail badge, point breakdown table by section, the
// critical-criteria audit table, and the prioritised flagged-issues list.
// State is persisted to localStorage so a partial fill survives a reload.
//
// Sibling files loaded as plain `<script>` tags (in order: types →
// rules → psychomotor-grader → flagged-issues → app) attach their exports
// to `window.EmergencyMedicalTechnicianPsychomotorExamination`. The whole
// file is wrapped in an IIFE so its top-level identifiers don't leak to
// the global scope.

(function () {
'use strict';

const NS = window.EmergencyMedicalTechnicianPsychomotorExamination;
const {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  triStateLabel,
  triStatePillClass,
  psychomotorRules,
  gradePsychomotor,
  detectAdditionalFlags,
  PASS_PERCENT_THRESHOLD
} = NS;

const TOTAL_STEPS = 6;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'emergency-medical-technician-psychomotor-examination.front-end-form-with-html.v1';

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
  { value: 'yes', label: 'Performed', cls: 'choice-yes' },
  { value: 'no', label: 'Not performed', cls: 'choice-no' },
  { value: 'na', label: 'Not applicable', cls: 'choice-na' }
];

/**
 * Build a tri-state checklist item (radio group inside a labelled list row),
 * with a small point-chip pill indicating how many points the item is worth.
 *
 * @param {{ ruleId: string, section: string, field: string, label: string,
 *           critical: boolean, points: number }} opts
 */
function checklistItem(opts) {
  const li = document.createElement('li');
  li.className = 'checklist-item' + (opts.critical ? ' is-critical' : '');
  li.dataset.ruleId = opts.ruleId;

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

  const pointsLabel = opts.points === 1 ? '1 pt' : `${opts.points} pts`;

  li.innerHTML = `
    <fieldset class="field radio-group" style="margin:0;">
      <legend class="item-label">
        <span class="item-id">${esc(opts.ruleId)}</span>
        ${esc(opts.label)}
        <span class="point-chip" aria-label="Worth ${pointsLabel}">${esc(pointsLabel)}</span>
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
 * Build a section card with optional point-tally chip in the header.
 *
 * @param {{ stepNumber: number, title: string, description?: string,
 *           pointTotal?: number }} opts
 */
function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;

  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  const pointPill = opts.pointTotal && opts.pointTotal > 0
    ? `<span class="section-points">${opts.pointTotal} pts available</span>`
    : '';

  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
      <h2 class="section-title">${esc(opts.title)}${pointPill}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/** Look up the canonical rule definition by id. */
function ruleById(id) {
  return psychomotorRules.find((r) => r.id === id);
}

/** Sum of `points` across the rules with the given step. */
function pointsForStep(step) {
  return psychomotorRules
    .filter((r) => r.step === step)
    .reduce((sum, r) => sum + r.points, 0);
}

/** Build a checklist <ul> hosting the listed (ruleId, section, field) entries.
 *  Items are created from the rule registry so labels, critical flags,
 *  and point values stay in sync with the grader.
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
      critical: rule.critical,
      points: rule.points
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
    title: 'Candidate, Examiner & Scenario',
    description: 'Identify the candidate, examiner, and the medical-patient scenario presented.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'Candidate first name', section: 'candidateExaminerScenario', field: 'candidateFirstName' }));
  grid.appendChild(textInput({ label: 'Candidate last name', section: 'candidateExaminerScenario', field: 'candidateLastName' }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Candidate ID / NREMT registration number',
    section: 'candidateExaminerScenario', field: 'candidateId'
  }));

  card.appendChild(selectInput({
    label: 'Exam attempt',
    section: 'candidateExaminerScenario', field: 'attempt',
    options: [
      { value: 'first-attempt', label: 'First attempt' },
      { value: 'retest', label: 'Retest' }
    ]
  }));

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(textInput({
    label: 'Examiner name', section: 'candidateExaminerScenario', field: 'examinerName'
  }));
  grid2.appendChild(textInput({
    label: 'Session date', section: 'candidateExaminerScenario', field: 'sessionDate', type: 'date'
  }));
  card.appendChild(grid2);

  card.appendChild(textInput({
    label: 'Station / location',
    section: 'candidateExaminerScenario', field: 'stationLocation',
    placeholder: 'e.g. Station 3 — Medical Patient'
  }));

  card.appendChild(textInput({
    label: 'Chief complaint given in the scenario brief',
    section: 'candidateExaminerScenario', field: 'chiefComplaintGiven',
    placeholder: 'e.g. shortness of breath, chest pain, abdominal pain…'
  }));

  card.appendChild(textArea({
    label: 'Scenario summary (optional)',
    section: 'candidateExaminerScenario', field: 'scenarioSummary',
    placeholder: 'Brief summary of the scenario presented to the candidate.',
    rows: 3
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Scene Size-Up',
    description: 'Candidate sizes up the scene before approaching the patient. PPE precautions and scene safety are critical criteria.',
    pointTotal: pointsForStep(2)
  });

  card.appendChild(checklist([
    { ruleId: 'EMT-SS-PPE', section: 'sceneSizeUp', field: 'ppePrecautions' },
    { ruleId: 'EMT-SS-SAFE', section: 'sceneSizeUp', field: 'sceneSafe' },
    { ruleId: 'EMT-SS-MOI-NOI', section: 'sceneSizeUp', field: 'mechanismOrNature' },
    { ruleId: 'EMT-SS-PATIENTS', section: 'sceneSizeUp', field: 'numberOfPatients' },
    { ruleId: 'EMT-SS-RESOURCES', section: 'sceneSizeUp', field: 'additionalResources' },
    { ruleId: 'EMT-SS-CSPINE', section: 'sceneSizeUp', field: 'considersCspine' }
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Primary Survey',
    description: 'General impression, mental status, airway, breathing (with oxygen), circulation, and transport priority decision. Most items in this section are critical criteria.',
    pointTotal: pointsForStep(3)
  });

  card.appendChild(checklist([
    { ruleId: 'EMT-PS-IMPRESSION', section: 'primarySurvey', field: 'generalImpression' },
    { ruleId: 'EMT-PS-MENTAL', section: 'primarySurvey', field: 'mentalStatus' },
    { ruleId: 'EMT-PS-AIRWAY', section: 'primarySurvey', field: 'airway' },
    { ruleId: 'EMT-PS-BREATHING', section: 'primarySurvey', field: 'breathing' },
    { ruleId: 'EMT-PS-OXYGEN', section: 'primarySurvey', field: 'oxygenTherapy' },
    { ruleId: 'EMT-PS-CIRCULATION', section: 'primarySurvey', field: 'circulation' },
    { ruleId: 'EMT-PS-TRANSPORT', section: 'primarySurvey', field: 'transportPriority' }
  ]));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'History Taking & Secondary Assessment',
    description: 'Chief complaint, OPQRST, SAMPLE history, focused exam, baseline vitals, field impression, and interventions.',
    pointTotal: pointsForStep(4)
  });

  card.appendChild(checklist([
    { ruleId: 'EMT-HX-CC', section: 'historySecondaryAssessment', field: 'chiefComplaint' },
    { ruleId: 'EMT-HX-OPQRST', section: 'historySecondaryAssessment', field: 'historyOnsetOpqrst' },
    { ruleId: 'EMT-HX-SAMPLE-S', section: 'historySecondaryAssessment', field: 'sampleSignsSymptoms' },
    { ruleId: 'EMT-HX-SAMPLE-A', section: 'historySecondaryAssessment', field: 'sampleAllergies' },
    { ruleId: 'EMT-HX-SAMPLE-M', section: 'historySecondaryAssessment', field: 'sampleMedications' },
    { ruleId: 'EMT-HX-SAMPLE-P', section: 'historySecondaryAssessment', field: 'samplePastHistory' },
    { ruleId: 'EMT-HX-SAMPLE-L', section: 'historySecondaryAssessment', field: 'sampleLastIntake' },
    { ruleId: 'EMT-HX-SAMPLE-E', section: 'historySecondaryAssessment', field: 'sampleEvents' },
    { ruleId: 'EMT-SA-FOCUSED', section: 'historySecondaryAssessment', field: 'focusedExam' },
    { ruleId: 'EMT-SA-VITALS-BP', section: 'historySecondaryAssessment', field: 'baselineVitalsBp' },
    { ruleId: 'EMT-SA-VITALS-PULSE', section: 'historySecondaryAssessment', field: 'baselineVitalsPulse' },
    { ruleId: 'EMT-SA-VITALS-RESP', section: 'historySecondaryAssessment', field: 'baselineVitalsRespirations' },
    { ruleId: 'EMT-SA-FIELD-IMPRESSION', section: 'historySecondaryAssessment', field: 'fieldImpression' },
    { ruleId: 'EMT-SA-INTERVENTIONS', section: 'historySecondaryAssessment', field: 'interventions' }
  ]));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Reassessment',
    description: 'Repeats mental-status, airway, breathing, circulation, vitals and focused exam; manages transport interventions; provides hand-off / radio call within 15 minutes (critical).',
    pointTotal: pointsForStep(5)
  });

  card.appendChild(checklist([
    { ruleId: 'EMT-RA-MENTAL', section: 'reassessment', field: 'repeatsMentalStatus' },
    { ruleId: 'EMT-RA-AIRWAY', section: 'reassessment', field: 'repeatsAirway' },
    { ruleId: 'EMT-RA-BREATHING', section: 'reassessment', field: 'repeatsBreathing' },
    { ruleId: 'EMT-RA-CIRCULATION', section: 'reassessment', field: 'repeatsCirculation' },
    { ruleId: 'EMT-RA-VITALS', section: 'reassessment', field: 'repeatsVitals' },
    { ruleId: 'EMT-RA-FOCUSED', section: 'reassessment', field: 'repeatsFocusedExam' },
    { ruleId: 'EMT-RA-EVAL-INT', section: 'reassessment', field: 'evaluatesInterventions' },
    { ruleId: 'EMT-RA-TRANSPORT-INT', section: 'reassessment', field: 'transportInterventions' },
    { ruleId: 'EMT-RA-FIFTEEN-MIN', section: 'reassessment', field: 'fifteenMinuteCall' }
  ]));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Critical Criteria Review',
    description: 'Final overall critical-criteria checks and examiner / debrief notes. Any "Not performed" answer here forces a Fail outcome.',
    pointTotal: pointsForStep(6)
  });

  card.appendChild(checklist([
    { ruleId: 'EMT-CC-DANGEROUS', section: 'criticalCriteriaReview', field: 'dangerousIntervention' },
    { ruleId: 'EMT-CC-SPINAL', section: 'criticalCriteriaReview', field: 'spinalProtection' }
  ]));

  card.appendChild(textArea({
    label: 'Examiner notes',
    section: 'criticalCriteriaReview', field: 'examinerNotes',
    placeholder: 'Strengths, deficiencies, coaching focus for next session…',
    rows: 4
  }));
  card.appendChild(textArea({
    label: 'Debrief notes',
    section: 'criticalCriteriaReview', field: 'debriefNotes',
    placeholder: 'Candidate self-reflection and remediation plan…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/** All scored rule (section, field) tuples — drives the progress bar. */
function trackedFieldsFromRules() {
  return psychomotorRules.map((r) => {
    // Recover (section, field) by inspecting the evaluator. Rather than
    // parsing the function source, we maintain a mapping keyed by rule id
    // — every entry must match the rules.js `read(d, section, field)` call.
    return RULE_TO_FIELD[r.id];
  }).filter(Boolean);
}

/** Static map from rule id to (section, field). Mirrors rules.js. */
const RULE_TO_FIELD = {
  'EMT-SS-PPE':              ['sceneSizeUp', 'ppePrecautions'],
  'EMT-SS-SAFE':             ['sceneSizeUp', 'sceneSafe'],
  'EMT-SS-MOI-NOI':          ['sceneSizeUp', 'mechanismOrNature'],
  'EMT-SS-PATIENTS':         ['sceneSizeUp', 'numberOfPatients'],
  'EMT-SS-RESOURCES':        ['sceneSizeUp', 'additionalResources'],
  'EMT-SS-CSPINE':           ['sceneSizeUp', 'considersCspine'],
  'EMT-PS-IMPRESSION':       ['primarySurvey', 'generalImpression'],
  'EMT-PS-MENTAL':           ['primarySurvey', 'mentalStatus'],
  'EMT-PS-AIRWAY':           ['primarySurvey', 'airway'],
  'EMT-PS-BREATHING':        ['primarySurvey', 'breathing'],
  'EMT-PS-OXYGEN':           ['primarySurvey', 'oxygenTherapy'],
  'EMT-PS-CIRCULATION':      ['primarySurvey', 'circulation'],
  'EMT-PS-TRANSPORT':        ['primarySurvey', 'transportPriority'],
  'EMT-HX-CC':               ['historySecondaryAssessment', 'chiefComplaint'],
  'EMT-HX-OPQRST':           ['historySecondaryAssessment', 'historyOnsetOpqrst'],
  'EMT-HX-SAMPLE-S':         ['historySecondaryAssessment', 'sampleSignsSymptoms'],
  'EMT-HX-SAMPLE-A':         ['historySecondaryAssessment', 'sampleAllergies'],
  'EMT-HX-SAMPLE-M':         ['historySecondaryAssessment', 'sampleMedications'],
  'EMT-HX-SAMPLE-P':         ['historySecondaryAssessment', 'samplePastHistory'],
  'EMT-HX-SAMPLE-L':         ['historySecondaryAssessment', 'sampleLastIntake'],
  'EMT-HX-SAMPLE-E':         ['historySecondaryAssessment', 'sampleEvents'],
  'EMT-SA-FOCUSED':          ['historySecondaryAssessment', 'focusedExam'],
  'EMT-SA-VITALS-BP':        ['historySecondaryAssessment', 'baselineVitalsBp'],
  'EMT-SA-VITALS-PULSE':     ['historySecondaryAssessment', 'baselineVitalsPulse'],
  'EMT-SA-VITALS-RESP':      ['historySecondaryAssessment', 'baselineVitalsRespirations'],
  'EMT-SA-FIELD-IMPRESSION': ['historySecondaryAssessment', 'fieldImpression'],
  'EMT-SA-INTERVENTIONS':    ['historySecondaryAssessment', 'interventions'],
  'EMT-RA-MENTAL':           ['reassessment', 'repeatsMentalStatus'],
  'EMT-RA-AIRWAY':           ['reassessment', 'repeatsAirway'],
  'EMT-RA-BREATHING':        ['reassessment', 'repeatsBreathing'],
  'EMT-RA-CIRCULATION':      ['reassessment', 'repeatsCirculation'],
  'EMT-RA-VITALS':           ['reassessment', 'repeatsVitals'],
  'EMT-RA-FOCUSED':          ['reassessment', 'repeatsFocusedExam'],
  'EMT-RA-EVAL-INT':         ['reassessment', 'evaluatesInterventions'],
  'EMT-RA-TRANSPORT-INT':    ['reassessment', 'transportInterventions'],
  'EMT-RA-FIFTEEN-MIN':      ['reassessment', 'fifteenMinuteCall'],
  'EMT-CC-DANGEROUS':        ['criticalCriteriaReview', 'dangerousIntervention'],
  'EMT-CC-SPINAL':           ['criticalCriteriaReview', 'spinalProtection']
};

const TRACKED_FIELDS = trackedFieldsFromRules();

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = state[section] && state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
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

/**
 * Build the per-section point breakdown table for the report.
 *
 * @param {import('./types.js').FiredRule[]} firedRules
 */
function pointBreakdownTable(firedRules) {
  const sectionTitles = {
    2: 'Scene Size-Up',
    3: 'Primary Survey',
    4: 'History & Secondary Assessment',
    5: 'Reassessment',
    6: 'Critical Criteria Review'
  };
  const rows = [];
  let totalPoints = 0;
  let totalMax = 0;
  for (const step of [2, 3, 4, 5, 6]) {
    const sectionRules = firedRules.filter((r) => r.step === step);
    let sectionPoints = 0;
    let sectionMax = 0;
    let answered = 0;
    let total = 0;
    for (const r of sectionRules) {
      total++;
      if (r.status === 'yes') {
        sectionPoints += r.points;
        sectionMax += r.points;
        answered++;
      } else if (r.status === 'no') {
        sectionMax += r.points;
        answered++;
      }
    }
    totalPoints += sectionPoints;
    totalMax += sectionMax;
    const pct = sectionMax > 0
      ? `${((sectionPoints / sectionMax) * 100).toFixed(0)}%`
      : '—';
    rows.push(`
      <tr>
        <th scope="row">Section ${step} — ${esc(sectionTitles[step])}</th>
        <td class="num">${sectionPoints} / ${sectionMax}</td>
        <td class="num">${pct}</td>
        <td class="num">${answered} / ${total}</td>
      </tr>
    `);
  }
  const totalPct = totalMax > 0
    ? `${((totalPoints / totalMax) * 100).toFixed(0)}%`
    : '—';

  return `
    <table class="tally">
      <thead>
        <tr>
          <th scope="col">Section</th>
          <th scope="col" class="num">Points</th>
          <th scope="col" class="num">Score</th>
          <th scope="col" class="num">Items answered</th>
        </tr>
      </thead>
      <tbody>${rows.join('')}</tbody>
      <tfoot>
        <tr>
          <th scope="row">Total</th>
          <td class="num">${totalPoints} / ${totalMax}</td>
          <td class="num">${totalPct}</td>
          <td class="num"></td>
        </tr>
      </tfoot>
    </table>
  `;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    outcome,
    points,
    maxPoints,
    percent,
    criticalFailures,
    firedRules,
    additionalFlags,
    answeredCount,
    totalRules,
    timestamp
  } = lastResult;

  // Critical-criteria audit table — show every critical rule.
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
          <th scope="col">Section</th>
          <th scope="col">Critical criterion</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>${auditRows}</tbody>
    </table>
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
  const pctText = maxPoints > 0 ? `${percent.toFixed(0)}%` : '0%';
  if (outcome === 'pass') {
    summaryText = `${points} of ${maxPoints} points (${pctText}) and no critical-criterion failure.`;
  } else if (criticalFailures.length > 0) {
    summaryText = `${criticalFailures.length} critical-criterion failure(s) — automatic Fail regardless of point total.`;
  } else if (answeredCount === 0) {
    summaryText = 'Insufficient items assessed to grade — please complete the checklist.';
  } else {
    summaryText = `${points} of ${maxPoints} points (${pctText}) — below the ${PASS_PERCENT_THRESHOLD}% pass threshold.`;
  }

  const cs = state.candidateExaminerScenario;
  const candidateName = `${cs.candidateFirstName} ${cs.candidateLastName}`.trim();

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>NREMT Psychomotor Examination Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${
          candidateName ? ` for ${esc(candidateName)}` : ''
        }${cs.examinerName ? ` · examiner: ${esc(cs.examinerName)}` : ''}</p>
      </header>

      <h3>Outcome</h3>
      <p class="outcome-summary">
        <span class="outcome-badge ${outcomeClass(outcome)}">${esc(outcomeLabel(outcome) || '—')}</span>
        <span class="outcome-detail">${esc(summaryText)}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of ${totalRules} checklist items recorded.</p>

      <h3>Point breakdown by section</h3>
      ${pointBreakdownTable(firedRules)}

      <h3>Critical-criteria audit</h3>
      ${auditTable}

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
  const grading = gradePsychomotor(state);
  const additionalFlags = detectAdditionalFlags(state, grading);
  lastResult = {
    outcome: grading.outcome,
    points: grading.points,
    maxPoints: grading.maxPoints,
    percent: grading.percent,
    criticalFailures: grading.criticalFailures,
    firedRules: grading.firedRules,
    additionalFlags,
    answeredCount: grading.answeredCount,
    totalRules: grading.totalRules,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh psychomotor examination?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  host.appendChild(renderStep1());
  host.appendChild(renderStep2());
  host.appendChild(renderStep3());
  host.appendChild(renderStep4());
  host.appendChild(renderStep5());
  host.appendChild(renderStep6());
}

function init() {
  renderForm();
  updateProgress();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
