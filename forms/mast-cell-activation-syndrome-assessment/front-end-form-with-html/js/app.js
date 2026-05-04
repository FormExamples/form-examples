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
(function () {
'use strict';

const NS = window.MastCellActivationSyndromeAssessment;
const {
  emptyAssessment,
  emptySymptomDetail,
  mcasCategory,
  mcasCategoryClass,
  severityOptions,
  frequencyOptions,
  calculateMCASScore,
  detectAdditionalFlags
} = NS;

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

/**
 * Build a labelled text input.
 * @param {{ label: string, section: string, field: string, type?: string,
 *           placeholder?: string, required?: boolean, min?: number,
 *           max?: number, step?: number, unit?: string, hint?: string }} opts
 */
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
    `class="text-input"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    ${opts.hint ? `<p class="hint">${esc(opts.hint)}</p>` : ''}
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
 * @param {{ label: string, section: string, field: string, rows?: number,
 *           placeholder?: string }} opts
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
 * @param {{ label: string, section: string, field: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
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
    <label for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select-input">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

/**
 * Build a radio group bound to a top-level section field.
 * @param {{ label: string, section: string, field: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/**
 * Build a section card.
 * @param {{ stepNumber: number, title: string, description?: string }} opts
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
      <label class="radio-option" for="${radioId}">
        <input type="radio" id="${radioId}" name="${sevName}" value="${sopt.value}"${checked}>
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

    <fieldset class="field radio-group">
      <legend class="symptom-sub-label">Severity</legend>
      <div class="radio-options">${sevHtml}</div>
    </fieldset>

    <div class="field">
      <label for="${freqId}" class="symptom-sub-label">Frequency</label>
      <select id="${freqId}" name="${freqId}" class="select-input">${freqOptionsHtml}</select>
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

  for (const [section, field] of TRACKED_FIELDS) {
    if (isAnswered(state[section][field])) answered++;
  }

  // Per-symptom severity counts toward progress (one item per symptom).
  for (const [section, keys] of SYMPTOM_SECTIONS) {
    for (const k of keys) {
      total++;
      if (isAnswered(state[section][k].severity)) answered++;
    }
  }

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
        <button type="button" id="start-over-btn" class="btn btn-secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
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
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
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
