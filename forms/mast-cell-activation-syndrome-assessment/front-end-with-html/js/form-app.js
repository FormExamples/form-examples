import { detectAdditionalFlags } from './flagged-issues.js';
import { calculateMCASScore } from './symptom-grader.js';
import { frequencyOptions, severityOptions } from './symptom-rules.js';
import { emptyAssessment, emptySymptomDetail, mcasCategory, mcasCategoryClass } from './types.js';

// Mast Cell Activation Syndrome (MCAS) Assessment - patient wizard
// (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure MCAS scoring engine and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.MastCellActivationSyndromeAssessment`. Whole file is
// wrapped in an IIFE so its top-level identifiers don't leak to the global
// scope.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'mast-cell-activation-syndrome-assessment.front-end-form-with-html.v1';

const SYMPTOM_SECTIONS = [
  ['dermatologicalSymptoms',  ['flushing', 'urticaria', 'angioedema', 'pruritus']],
  ['gastrointestinalSymptoms', ['abdominalPain', 'nausea', 'diarrhea', 'bloating']],
  ['cardiovascularSymptoms',   ['tachycardia', 'hypotension', 'presyncope', 'syncope']],
  ['respiratorySymptoms',      ['wheezing', 'dyspnea', 'nasalCongestion', 'throatTightening']],
  ['neurologicalSymptoms',     ['headache', 'brainFog', 'dizziness', 'fatigue']]
];

/**
 * Merge a saved-state object over a fresh empty assessment. Object-valued
 * fields are shallow-merged; symptom-detail objects are merged so newly
 * added fields default correctly.
 *
 * @param {AssessmentData} parsed
 * @returns {AssessmentData}
 */
function mergeState(parsed) {
  const fresh = emptyAssessment();
  if (!parsed || typeof parsed !== 'object') return fresh;

  for (const key of Object.keys(fresh)) {
    if (parsed[key] && typeof parsed[key] === 'object') {
      fresh[key] = { ...fresh[key], ...parsed[key] };
    }
  }

  // Per-symptom detail objects (severity + frequency) need a deeper merge
  // so we always have both keys present even if old saved state is sparse.
  for (const [section, keys] of SYMPTOM_SECTIONS) {
    for (const k of keys) {
      const existing = fresh[section][k];
      fresh[section][k] = {
        ...emptySymptomDetail(),
        ...(existing && typeof existing === 'object' ? existing : {})
      };
    }
  }
  return fresh;
}

/** @returns {AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    return mergeState(JSON.parse(raw));
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

/** @type {AssessmentData} */
let state = loadState();

/** @type {GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a top-level (section -> field) value on state and persist.
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
}

/**
 * Update a per-symptom detail field: severity or frequency.
 * @param {string} section
 * @param {string} symptomKey
 * @param {'severity' | 'frequency'} key
 * @param {*} value
 */
function setSymptomField(section, symptomKey, key, value) {
  state[section][symptomKey][key] = value;
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

/** Map an <input type=…> to its Lily class name. */
function lilyInputClass(type) {
  switch (type) {
    case 'email':  return 'email-input';
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    case 'time':   return 'time-input';
    case 'tel':    return 'tel-input';
    case 'url':    return 'url-input';
    case 'search': return 'search-input';
    default:       return 'text-input';
  }
}

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')} aria-describedby="${id}-error">
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    ${opts.hint ? `<span class="hint">${esc(opts.hint)}</span>` : ''}
    <span class="error-message" id="${id}-error"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}${opts.required ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      ${opts.required ? 'required data-required' : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.section, opts.field, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select"${opts.required ? ' required data-required' : ''} aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.section, opts.field, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-input';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    const requiredAttr = opts.required ? ' required data-required' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}${requiredAttr}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setField(opts.section, opts.field, option.value);
        clearFieldError(groupId);
      }
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);

  const errSpan = document.createElement('span');
  errSpan.className = 'error-message';
  errSpan.id = `${groupId}-error`;
  wrapper.appendChild(errSpan);
  return wrapper;
}

function sectionCard(opts) {
  const card = document.createElement('fieldset');
  card.className = 'fieldset';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<span class="section-description">${esc(opts.description)}</span>`
    : '';
  const legend = document.createElement('legend');
  legend.className = 'fieldset-legend';
  legend.innerHTML =
    `<span class="section-step">Section ${opts.stepNumber} of 10</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

/**
 * Render one symptom-detail row (severity radios + frequency dropdown) for
 * the per-organ-system steps.
 *
 * @param {{ section: string, key: string, label: string, desc: string }} opts
 */
function symptomDetailGroup(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'symptom-group';

  const detail = state[opts.section][opts.key];
  const sevName = `severity-${opts.section}-${opts.key}`;

  const sevHtml = severityOptions.map((sopt) => {
    const radioId = `${sevName}-${sopt.value}`;
    const checked = detail.severity === sopt.value ? ' checked' : '';
    return `
      <label class="radio-input" for="${radioId}">
        <input class="radio-input" type="radio" id="${radioId}" name="${sevName}" value="${sopt.value}"${checked}>
        <span>${esc(sopt.label)}</span>
      </label>
    `;
  }).join('');

  const freqId = `freq-${opts.section}-${opts.key}`;
  const freqOptionsHtml = [
    `<option value="">— Select —</option>`,
    ...frequencyOptions.map((f) =>
      `<option value="${esc(f.value)}"${f.value === detail.frequency ? ' selected' : ''}>${esc(f.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <p class="symptom-name">${esc(opts.label)}</p>
    <p class="symptom-desc">${esc(opts.desc)}</p>

    <fieldset class="field">
      <legend class="symptom-sub-label">Severity</legend>
      <div class="radio-group" role="radiogroup">${sevHtml}</div>
    </fieldset>

    <div class="field">
      <label for="${freqId}" class="label symptom-sub-label">Frequency</label>
      <select id="${freqId}" name="${freqId}" class="select">${freqOptionsHtml}</select>
    </div>
  `;

  // Severity radios
  wrapper.querySelectorAll(`input[name="${sevName}"]`).forEach((inp) => {
    inp.addEventListener('change', () => {
      if (inp.checked) {
        const v = Number(inp.value);
        setSymptomField(opts.section, opts.key, 'severity', v);
      }
    });
  });

  // Frequency select
  const freqSel = wrapper.querySelector(`#${freqId}`);
  freqSel.addEventListener('change', () => {
    setSymptomField(opts.section, opts.key, 'frequency', freqSel.value);
  });

  return wrapper;
}

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'First Name', section: 'demographics', field: 'firstName', required: true
  }));
  grid.appendChild(textInput({
    label: 'Last Name', section: 'demographics', field: 'lastName', required: true
  }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of Birth',
    section: 'demographics',
    field: 'dateOfBirth',
    type: 'date',
    required: true
  }));

  card.appendChild(radioGroup({
    label: 'Sex',
    section: 'demographics',
    field: 'sex',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Symptom Overview',
    description: 'General information about your symptoms and their impact.'
  });

  card.appendChild(textInput({
    label: 'When did your symptoms first begin?',
    section: 'symptomOverview',
    field: 'onsetDate',
    type: 'date',
    required: true
  }));

  card.appendChild(textInput({
    label: 'How long have you had symptoms?',
    section: 'symptomOverview',
    field: 'symptomDuration',
    placeholder: 'e.g., 6 months, 2 years, since childhood',
    required: true
  }));

  card.appendChild(selectInput({
    label: 'How often do you experience symptoms?',
    section: 'symptomOverview',
    field: 'symptomFrequency',
    required: true,
    options: [
      { value: 'rarely',    label: 'Rarely (less than monthly)' },
      { value: 'sometimes', label: 'Sometimes (monthly)' },
      { value: 'often',     label: 'Often (weekly)' },
      { value: 'daily',     label: 'Daily' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'How much do symptoms affect your quality of life?',
    section: 'symptomOverview',
    field: 'qualityOfLife',
    required: true,
    options: [
      { value: 'none',     label: 'No impact' },
      { value: 'mild',     label: 'Mild impact - can manage daily activities' },
      { value: 'moderate', label: 'Moderate impact - some activities limited' },
      { value: 'severe',   label: 'Severe impact - significantly limited' }
    ]
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Dermatological Symptoms',
    description: 'Rate the severity and frequency of your skin-related symptoms.'
  });
  const section = 'dermatologicalSymptoms';
  const symptoms = [
    { key: 'flushing',   label: 'Flushing',          desc: 'Redness and warmth of the skin, especially face, neck, and chest' },
    { key: 'urticaria',  label: 'Urticaria (Hives)', desc: 'Itchy, raised welts or bumps on the skin' },
    { key: 'angioedema', label: 'Angioedema',        desc: 'Deep swelling under the skin, often around eyes, lips, or hands' },
    { key: 'pruritus',   label: 'Pruritus (Itching)', desc: 'Generalised itching without visible rash' }
  ];
  for (const s of symptoms) card.appendChild(symptomDetailGroup({ section, ...s }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Gastrointestinal Symptoms',
    description: 'Rate the severity and frequency of your digestive symptoms.'
  });
  const section = 'gastrointestinalSymptoms';
  const symptoms = [
    { key: 'abdominalPain', label: 'Abdominal Pain', desc: 'Cramping, aching, or sharp pain in the abdomen' },
    { key: 'nausea',        label: 'Nausea',         desc: 'Feeling of sickness or urge to vomit' },
    { key: 'diarrhea',      label: 'Diarrhea',       desc: 'Loose or watery stools, increased bowel frequency' },
    { key: 'bloating',      label: 'Bloating',       desc: 'Abdominal distension, feeling of fullness or swelling' }
  ];
  for (const s of symptoms) card.appendChild(symptomDetailGroup({ section, ...s }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Cardiovascular Symptoms',
    description: 'Rate the severity and frequency of your heart and blood pressure symptoms.'
  });
  const section = 'cardiovascularSymptoms';
  const symptoms = [
    { key: 'tachycardia', label: 'Tachycardia', desc: 'Rapid heart rate or heart pounding/racing' },
    { key: 'hypotension', label: 'Hypotension', desc: 'Low blood pressure, lightheadedness on standing' },
    { key: 'presyncope',  label: 'Presyncope',  desc: 'Feeling faint, near-fainting episodes' },
    { key: 'syncope',     label: 'Syncope',     desc: 'Complete loss of consciousness / fainting' }
  ];
  for (const s of symptoms) card.appendChild(symptomDetailGroup({ section, ...s }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Respiratory Symptoms',
    description: 'Rate the severity and frequency of your breathing-related symptoms.'
  });
  const section = 'respiratorySymptoms';
  const symptoms = [
    { key: 'wheezing',          label: 'Wheezing',          desc: 'Whistling sound when breathing, tightness in chest' },
    { key: 'dyspnea',           label: 'Dyspnea',           desc: 'Shortness of breath or difficulty breathing' },
    { key: 'nasalCongestion',   label: 'Nasal Congestion',  desc: 'Blocked or stuffy nose, sinus pressure' },
    { key: 'throatTightening',  label: 'Throat Tightening', desc: 'Sensation of throat closing, difficulty swallowing' }
  ];
  for (const s of symptoms) card.appendChild(symptomDetailGroup({ section, ...s }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Neurological Symptoms',
    description: 'Rate the severity and frequency of your neurological symptoms.'
  });
  const section = 'neurologicalSymptoms';
  const symptoms = [
    { key: 'headache',  label: 'Headache',  desc: 'Persistent or recurring headaches, migraines' },
    { key: 'brainFog',  label: 'Brain Fog', desc: 'Difficulty concentrating, mental confusion, memory problems' },
    { key: 'dizziness', label: 'Dizziness', desc: 'Feeling unsteady, vertigo, balance problems' },
    { key: 'fatigue',   label: 'Fatigue',   desc: 'Persistent tiredness, exhaustion not relieved by rest' }
  ];
  for (const s of symptoms) card.appendChild(symptomDetailGroup({ section, ...s }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Triggers & Patterns',
    description: 'Identify factors that trigger or worsen your symptoms.'
  });

  card.appendChild(textArea({
    label: 'Food triggers',
    section: 'triggersPatterns',
    field: 'foodTriggers',
    placeholder: 'e.g., alcohol, aged cheese, fermented foods, histamine-rich foods, additives…'
  }));

  card.appendChild(textArea({
    label: 'Environmental triggers',
    section: 'triggersPatterns',
    field: 'environmentalTriggers',
    placeholder: 'e.g., heat, cold, fragrances, chemicals, pollen, mould…'
  }));

  card.appendChild(radioGroup({
    label: 'Does emotional stress trigger or worsen your symptoms?',
    section: 'triggersPatterns', field: 'stressTriggers', options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Does physical exercise trigger or worsen your symptoms?',
    section: 'triggersPatterns', field: 'exerciseTrigger', options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Do temperature changes trigger or worsen your symptoms?',
    section: 'triggersPatterns', field: 'temperatureTrigger', options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Medication triggers',
    section: 'triggersPatterns',
    field: 'medicationTriggers',
    placeholder: 'e.g., NSAIDs, opioids, antibiotics, contrast dyes, anaesthetics…'
  }));

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Laboratory Results',
    description: 'Enter any available laboratory test results (leave blank if not tested).'
  });

  card.appendChild(textInput({
    label: 'Serum Tryptase',
    section: 'laboratoryResults', field: 'serumTryptase',
    type: 'number', min: 0, max: 200, step: 0.1,
    unit: 'ng/mL',
    hint: 'Normal range: < 11.4 ng/mL. Elevated levels may indicate mast cell activation.'
  }));

  card.appendChild(textInput({
    label: 'Plasma Histamine',
    section: 'laboratoryResults', field: 'histamine',
    type: 'number', min: 0, max: 50, step: 0.01,
    unit: 'ng/mL',
    hint: 'Normal range: < 1.0 ng/mL. Elevated during or shortly after mast cell episodes.'
  }));

  card.appendChild(textInput({
    label: 'Prostaglandin D2',
    section: 'laboratoryResults', field: 'prostaglandinD2',
    type: 'number', min: 0, max: 50, step: 0.01,
    unit: 'ng/mL',
    hint: 'Normal range: < 0.3 ng/mL. A key mediator released by mast cells.'
  }));

  card.appendChild(textInput({
    label: 'Chromogranin A',
    section: 'laboratoryResults', field: 'chromograninA',
    type: 'number', min: 0, max: 500, step: 0.1,
    unit: 'ng/mL',
    hint: 'Can be elevated in mast cell disorders. Interpret with caution (affected by PPIs).'
  }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Current Treatment',
    description: 'Indicate which treatments you are currently receiving for MCAS.'
  });

  card.appendChild(radioGroup({
    label: 'Are you taking antihistamines (H1 and/or H2 blockers)?',
    section: 'currentTreatment', field: 'antihistamines', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Are you taking mast cell stabilizers (e.g., cromolyn sodium, ketotifen)?',
    section: 'currentTreatment', field: 'mastCellStabilizers', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Are you taking leukotriene inhibitors (e.g., montelukast, zafirlukast)?',
    section: 'currentTreatment', field: 'leukotrienInhibitors', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you have an epinephrine auto-injector (e.g., EpiPen) prescribed?',
    section: 'currentTreatment', field: 'epinephrine', options: yesNo
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

// Top-level (section, field) pairs that count toward the progress meter.
// Per-symptom severity entries are tracked separately via SYMPTOM_SECTIONS.
const TRACKED_FIELDS = [
  // Demographics
  ['demographics', 'firstName'],
  ['demographics', 'lastName'],
  ['demographics', 'dateOfBirth'],
  ['demographics', 'sex'],
  // Symptom overview
  ['symptomOverview', 'onsetDate'],
  ['symptomOverview', 'symptomDuration'],
  ['symptomOverview', 'symptomFrequency'],
  ['symptomOverview', 'qualityOfLife'],
  // Triggers & patterns
  ['triggersPatterns', 'stressTriggers'],
  ['triggersPatterns', 'exerciseTrigger'],
  ['triggersPatterns', 'temperatureTrigger'],
  // Current treatment
  ['currentTreatment', 'antihistamines'],
  ['currentTreatment', 'mastCellStabilizers'],
  ['currentTreatment', 'leukotrienInhibitors'],
  ['currentTreatment', 'epinephrine']
];

function isAnswered(value) {
  return value !== null && value !== undefined && value !== '';
}

function updateProgress() {
  let answered = 0;
  let total = TRACKED_FIELDS.length;
  const sectionAnswered = {};
  const sectionTotal = {};

  for (const [section, field] of TRACKED_FIELDS) {
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    if (isAnswered(state[section][field])) {
      answered++;
      sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
    }
  }

  // Per-symptom severity counts toward progress (one item per symptom).
  for (const [section, keys] of SYMPTOM_SECTIONS) {
    for (const k of keys) {
      total++;
      sectionTotal[section] = (sectionTotal[section] || 0) + 1;
      if (isAnswered(state[section][k].severity)) {
        answered++;
        sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
      }
    }
  }

  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1,  section: 'demographics',              title: 'Demographics' },
  { step: 2,  section: 'symptomOverview',           title: 'Symptom Overview' },
  { step: 3,  section: 'dermatologicalSymptoms',    title: 'Dermatological' },
  { step: 4,  section: 'gastrointestinalSymptoms',  title: 'Gastrointestinal' },
  { step: 5,  section: 'cardiovascularSymptoms',    title: 'Cardiovascular' },
  { step: 6,  section: 'respiratorySymptoms',       title: 'Respiratory' },
  { step: 7,  section: 'neurologicalSymptoms',      title: 'Neurological' },
  { step: 8,  section: 'triggersPatterns',          title: 'Triggers' },
  { step: 9,  section: 'laboratoryResults',         title: 'Labs' },
  { step: 10, section: 'currentTreatment',          title: 'Treatment' }
];

function renderStepList() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  ol.innerHTML = '';
  for (const def of STEP_DEFINITIONS) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(def.step);
    li.setAttribute('aria-label', `Step ${def.step}: ${def.title}`);
    li.innerHTML = `<span>${esc(def.title)}</span>`;
    li.addEventListener('click', () => {
      const target = document.getElementById(`step-${def.step}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  }
}

function updateStepListStatuses(sectionAnswered, sectionTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = sectionAnswered[def.section] || 0;
    const t = sectionTotal[def.section] || 0;
    if (t > 0 && a === t) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
    } else if (a > 0) {
      li.dataset.status = 'in-progress';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    } else {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
    }
  }
  if (firstUnfinished === -1) firstUnfinished = STEP_DEFINITIONS[0].step;
  const current = ol.querySelector(`[data-step="${firstUnfinished}"]`);
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') {
      current.dataset.status = 'in-progress';
    }
  }
  ol.dataset.current = String(firstUnfinished - 1);
}

// ----------------------------------------------------------------------
// Validation (per-field + error summary)
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
  const fs = document.getElementById(`${id}-fieldset`);
  if (fs) fs.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function validateForm() {
  const errors = [];
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  const required = form.querySelectorAll('[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    let id = input.id;
    if (input.type === 'radio') id = input.name;
    if (seen.has(id)) return;
    seen.add(id);
    let value = '';
    if (input.type === 'radio') {
      const chosen = form.querySelector(`input[name="${id}"]:checked`);
      value = chosen ? chosen.value : '';
    } else {
      value = (input.value || '').trim();
    }
    if (!value) {
      const fs = document.getElementById(`${id}-fieldset`);
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = (fs ? fs.querySelector('legend') : labelEl);
      const labelText = label
        ? label.textContent.replace(/\s*\*\s*$/, '').trim()
        : id;
      errors.push({ id, message: `${labelText} is required` });
      setFieldError(id, `${labelText} is required`);
    } else {
      clearFieldError(id);
    }
  });
  renderErrorSummary(errors);
  return errors;
}

function renderErrorSummary(errors) {
  const summary = document.getElementById('error-summary');
  if (!summary) return;
  if (errors.length === 0) {
    summary.hidden = true;
    summary.innerHTML = '';
    return;
  }
  summary.hidden = false;
  summary.innerHTML =
    '<strong>Please correct the following:</strong>' +
    '<ul>' +
    errors.map((e) =>
      `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`
    ).join('') +
    '</ul>';
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof summary.focus === 'function') {
    summary.setAttribute('tabindex', '-1');
    summary.focus({ preventScroll: true });
  }
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default:       return '';
  }
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    symptomScore,
    mcasCategory: catLabel,
    organSystemsAffected,
    firedRules,
    additionalFlags,
    timestamp
  } = lastResult;

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

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.domain)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${r.score} / 3</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No symptoms reported above severity 0.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Organ system</th>
            <th scope="col">Symptom</th>
            <th scope="col">Severity</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>MCAS Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>MCAS Symptom Score</h3>
      <p class="mcas-summary">
        <span class="mcas-score-badge ${mcasCategoryClass(symptomScore)}">${symptomScore} / 40</span>
        <span class="mcas-category">${esc(catLabel)} symptom burden</span>
      </p>
      <p class="systems-summary">
        Organ systems affected:
        <strong>${organSystemsAffected} of 5</strong>
        (dermatological, gastrointestinal, cardiovascular, respiratory, neurological).
      </p>

      <h3>Per-symptom scores</h3>
      ${firedTable}

      <h3>Flagged Issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const errs = validateForm();
  if (errs.length > 0) return;
  const {
    symptomScore,
    mcasCategoryLabel,
    organSystemsAffected,
    firedRules
  } = calculateMCASScore(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    symptomScore,
    mcasCategory: mcasCategoryLabel,
    organSystemsAffected,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  const _rep = document.getElementById('report');
  if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
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
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
}

function init() {
  renderStepList();
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
