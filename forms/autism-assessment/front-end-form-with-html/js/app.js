// Autism Assessment - patient wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure AQ-10 scoring engine and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.AutismAssessment`. Pulling them off here keeps the
// rest of this file referring to short local names. Whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.AutismAssessment;
const {
  emptyAssessment,
  aq10Category,
  aq10ScoreClass,
  aq10Questions,
  aq10ResponseOptions,
  aq10ScoreFromResponse,
  calculateAQ10,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'autism-assessment.front-end-form-with-html.v1';

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
    // Ensure rawResponses exists on the AQ-10 section
    if (!fresh.aq10Questionnaire.rawResponses ||
        typeof fresh.aq10Questionnaire.rawResponses !== 'object') {
      fresh.aq10Questionnaire.rawResponses = {};
    }
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
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

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist.
 * Re-runs progress and conditional visibility after each change.
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
 *           max?: number, step?: number, unit?: string }} opts
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
      class="text-area-input">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[],
 *           required?: boolean }} opts
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

  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

/**
 * Build a radio group.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[],
 *           required?: boolean }} opts
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
 * Build a checkbox group bound to a string[] field.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[] }} opts
 */
function checkboxGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field checkbox-group';

  const legend = document.createElement('legend');
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'checkbox-options';
  for (const option of opts.options) {
    const id = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'checkbox-option';
    label.htmlFor = id;
    const arr = state[opts.section][opts.field] || [];
    const checked = arr.includes(option.value) ? ' checked' : '';
    label.innerHTML = `
      <input type="checkbox" id="${id}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      const list = state[opts.section][opts.field] || [];
      if (input.checked) {
        if (!list.includes(option.value)) list.push(option.value);
      } else {
        const idx = list.indexOf(option.value);
        if (idx >= 0) list.splice(idx, 1);
      }
      state[opts.section][opts.field] = list;
      saveState(state);
      updateProgress();
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
      <span class="section-step">Section ${opts.stepNumber} of 9</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Repeating-list editor: medications
// ----------------------------------------------------------------------

function medicationListEditor() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = state.currentSupport.medications;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent = 'No medications added.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row med-row';
      r.innerHTML = `
        <div class="list-grid med-grid">
          <label class="list-cell">
            <span>Name</span>
            <input type="text" class="text-input" data-key="name" value="${esc(row.name)}" placeholder="e.g. Risperidone">
          </label>
          <label class="list-cell">
            <span>Dose</span>
            <input type="text" class="text-input" data-key="dose" value="${esc(row.dose)}" placeholder="e.g. 0.5 mg">
          </label>
          <label class="list-cell">
            <span>Frequency</span>
            <input type="text" class="text-input" data-key="frequency" value="${esc(row.frequency)}" placeholder="e.g. once daily">
          </label>
          <button type="button" class="button" data-variant="icon" aria-label="Remove medication">&times;</button>
        </div>
      `;
      r.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('input', () => {
          rows[idx][inp.dataset.key] = inp.value;
          saveState(state);
          updateProgress();
        });
      });
      r.querySelector('button').addEventListener('click', () => {
        rows.splice(idx, 1);
        saveState(state);
        rerender();
        updateProgress();
      });
      wrapper.appendChild(r);
    });
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'button';
    addBtn.setAttribute('data-variant', 'add');
    addBtn.textContent = '+ Add medication';
    addBtn.addEventListener('click', () => {
      rows.push({ name: '', dose: '', frequency: '' });
      saveState(state);
      rerender();
      updateProgress();
    });
    wrapper.appendChild(addBtn);
  }

  rerender();
  return wrapper;
}

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const frequencyOptions = [
  { value: 'never', label: 'Never' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'often', label: 'Often' },
  { value: 'always', label: 'Always' }
];

const sensoryOptions = [
  { value: 'none', label: 'None' },
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' }
];

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First Name', section: 'demographics', field: 'firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last Name', section: 'demographics', field: 'lastName', required: true }));
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
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ],
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Age Group',
    section: 'demographics',
    field: 'ageGroup',
    options: [
      { value: 'child', label: 'Child (under 12)' },
      { value: 'adolescent', label: 'Adolescent (12-17)' },
      { value: 'adult', label: 'Adult (18+)' }
    ],
    required: true
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Screening Purpose',
    description: 'Reason for this autism screening assessment.'
  });

  card.appendChild(selectInput({
    label: 'Referral Source',
    section: 'screeningPurpose',
    field: 'referralSource',
    options: [
      { value: 'self', label: 'Self-referral' },
      { value: 'gp', label: 'GP / Primary care' },
      { value: 'school', label: 'School / Education' },
      { value: 'employer', label: 'Employer / Occupational health' },
      { value: 'family', label: 'Family member' },
      { value: 'other', label: 'Other' }
    ],
    required: true
  }));

  const otherHost = document.createElement('div');
  otherHost.dataset.conditional = 'screeningPurpose.referralSource=other';
  otherHost.appendChild(textInput({
    label: 'Other referral source',
    section: 'screeningPurpose', field: 'referralSourceOther',
    placeholder: 'Please specify...'
  }));
  card.appendChild(otherHost);

  card.appendChild(textArea({
    label: 'Reason for screening',
    section: 'screeningPurpose', field: 'reasonForScreening',
    placeholder: 'Describe the primary reason for seeking an autism screening...'
  }));

  card.appendChild(radioGroup({
    label: 'Have there been any previous autism assessments?',
    section: 'screeningPurpose', field: 'previousAssessments',
    options: yesNo,
    required: true
  }));

  const prevHost = document.createElement('div');
  prevHost.dataset.conditional = 'screeningPurpose.previousAssessments=yes';
  prevHost.appendChild(textArea({
    label: 'Previous assessment details',
    section: 'screeningPurpose', field: 'previousAssessmentDetails',
    placeholder: 'Provide details of previous assessments, dates, and outcomes...'
  }));
  card.appendChild(prevHost);

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'AQ-10 Questionnaire',
    description: 'Autism Spectrum Quotient-10 — indicate how strongly you agree or disagree with each statement.'
  });

  aq10Questions.forEach((question, i) => {
    const qkey = `q${i + 1}`;
    const qBlock = document.createElement('div');
    qBlock.className = 'aq10-question';
    qBlock.innerHTML = `
      <p class="aq10-prompt">
        <span class="qnum">${i + 1}.</span>${esc(question.text)}
      </p>
      <p class="aq10-domain">Domain: ${esc(question.domain)}</p>
    `;

    const radios = document.createElement('div');
    radios.className = 'radio-options';
    const groupName = `aq10-${qkey}`;
    const currentRaw = state.aq10Questionnaire.rawResponses[qkey] || '';

    aq10ResponseOptions.forEach((opt) => {
      const radioId = `${groupName}-${opt.value}`;
      const label = document.createElement('label');
      label.className = 'radio-option';
      label.htmlFor = radioId;
      const checked = currentRaw === opt.value ? ' checked' : '';
      label.innerHTML = `
        <input type="radio" id="${radioId}" name="${groupName}" value="${esc(opt.value)}"${checked}>
        <span>${esc(opt.label)}</span>
      `;
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (!input.checked) return;
        state.aq10Questionnaire.rawResponses[qkey] = opt.value;
        state.aq10Questionnaire[qkey] = aq10ScoreFromResponse(question.questionNumber, opt.value);
        saveState(state);
        updateProgress();
      });
      radios.appendChild(label);
    });
    qBlock.appendChild(radios);
    card.appendChild(qBlock);
  });

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Social Communication',
    description: 'Social interaction and communication patterns.'
  });

  card.appendChild(radioGroup({
    label: 'How often do you maintain comfortable eye contact during conversation?',
    section: 'socialCommunication', field: 'eyeContact',
    options: frequencyOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: "How often do you engage in social reciprocity (turn-taking in conversation, responding to others' emotions)?",
    section: 'socialCommunication', field: 'socialReciprocity',
    options: frequencyOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'How often do you find it easy to start and maintain conversations?',
    section: 'socialCommunication', field: 'conversationSkills',
    options: frequencyOptions, required: true
  }));
  card.appendChild(textArea({
    label: 'Describe your friendship patterns',
    section: 'socialCommunication', field: 'friendshipPatterns',
    placeholder: 'e.g., number of close friends, how friendships are maintained, difficulties in social relationships...'
  }));
  card.appendChild(textArea({
    label: 'Any additional social communication difficulties',
    section: 'socialCommunication', field: 'socialDifficultiesDetails',
    placeholder: 'Describe any other social or communication challenges...'
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Repetitive Behaviors',
    description: 'Routines, interests, and repetitive patterns.'
  });

  card.appendChild(radioGroup({
    label: 'How strongly do you adhere to routines and rituals?',
    section: 'repetitiveBehaviors', field: 'routineAdherence',
    options: frequencyOptions, required: true
  }));
  card.appendChild(textArea({
    label: 'Describe any special or intense interests',
    section: 'repetitiveBehaviors', field: 'specialInterests',
    placeholder: 'e.g., specific topics, collections, activities that are pursued with unusual intensity...'
  }));
  card.appendChild(radioGroup({
    label: 'Do you engage in repetitive movements (e.g., hand flapping, rocking, spinning)?',
    section: 'repetitiveBehaviors', field: 'repetitiveMovements',
    options: yesNo, required: true
  }));

  const repHost = document.createElement('div');
  repHost.dataset.conditional = 'repetitiveBehaviors.repetitiveMovements=yes';
  repHost.appendChild(textArea({
    label: 'Describe the repetitive movements',
    section: 'repetitiveBehaviors', field: 'repetitiveMovementsDetails',
    placeholder: 'Describe the types of repetitive movements and when they occur...'
  }));
  card.appendChild(repHost);

  card.appendChild(radioGroup({
    label: 'How much do you resist changes to routine or environment?',
    section: 'repetitiveBehaviors', field: 'resistanceToChange',
    options: frequencyOptions, required: true
  }));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Sensory Profile',
    description: 'Sensory sensitivities and seeking behaviors.'
  });

  card.appendChild(radioGroup({
    label: 'Visual sensitivity (e.g., bright lights, certain patterns, visual overload)',
    section: 'sensoryProfile', field: 'visualSensitivity',
    options: sensoryOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Auditory sensitivity (e.g., loud sounds, background noise, specific frequencies)',
    section: 'sensoryProfile', field: 'auditorySensitivity',
    options: sensoryOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Tactile sensitivity (e.g., clothing textures, light touch, temperature)',
    section: 'sensoryProfile', field: 'tactileSensitivity',
    options: sensoryOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Olfactory sensitivity (e.g., certain smells, perfumes, food odors)',
    section: 'sensoryProfile', field: 'olfactorySensitivity',
    options: sensoryOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Gustatory sensitivity (e.g., food textures, specific tastes, limited diet)',
    section: 'sensoryProfile', field: 'gustatorySensitivity',
    options: sensoryOptions, required: true
  }));
  card.appendChild(textArea({
    label: 'Sensory seeking behaviors',
    section: 'sensoryProfile', field: 'sensorySeekingBehaviors',
    placeholder: 'Describe any sensory seeking behaviors (e.g., spinning, deep pressure, chewing objects)...'
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Developmental History',
    description: 'Early developmental milestones and behaviors.'
  });

  card.appendChild(textArea({
    label: 'Language milestones',
    section: 'developmentalHistory', field: 'languageMilestones',
    placeholder: 'e.g., age of first words, first sentences, any speech delays or regression...'
  }));
  card.appendChild(textArea({
    label: 'Motor milestones',
    section: 'developmentalHistory', field: 'motorMilestones',
    placeholder: 'e.g., age of crawling, walking, fine motor skill development, coordination difficulties...'
  }));
  card.appendChild(textArea({
    label: 'Early social behavior',
    section: 'developmentalHistory', field: 'earlySocialBehavior',
    placeholder: 'e.g., joint attention, pointing, shared play, response to name, attachment patterns...'
  }));
  card.appendChild(textArea({
    label: 'Any developmental concerns noted by parents, teachers, or professionals',
    section: 'developmentalHistory', field: 'developmentalConcerns',
    placeholder: 'Describe any concerns raised during childhood...'
  }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Current Support',
    description: 'Current accommodations, therapies, and support services.'
  });

  card.appendChild(textArea({
    label: 'Current accommodations',
    section: 'currentSupport', field: 'currentAccommodations',
    placeholder: 'e.g., workplace adjustments, exam accommodations, environmental modifications...'
  }));

  card.appendChild(checkboxGroup({
    label: 'Current therapies',
    section: 'currentSupport', field: 'currentTherapies',
    options: [
      { value: 'speech-language', label: 'Speech & Language Therapy' },
      { value: 'occupational', label: 'Occupational Therapy' },
      { value: 'behavioral', label: 'Behavioral Therapy (ABA)' },
      { value: 'cbt', label: 'Cognitive Behavioral Therapy' },
      { value: 'social-skills', label: 'Social Skills Training' },
      { value: 'sensory-integration', label: 'Sensory Integration Therapy' },
      { value: 'psychotherapy', label: 'Psychotherapy / Counselling' },
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Educational support',
    section: 'currentSupport', field: 'educationalSupport',
    placeholder: 'e.g., EHCP, SEN support, teaching assistant, special school, mainstream with support...'
  }));

  const medHeader = document.createElement('div');
  medHeader.className = 'list-section-header';
  medHeader.innerHTML = '<h3>Current Medications</h3>';
  card.appendChild(medHeader);
  card.appendChild(medicationListEditor());

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Family History',
    description: 'Family history of neurodevelopmental and mental health conditions.'
  });

  card.appendChild(radioGroup({
    label: 'Family history of autism spectrum disorder?',
    section: 'familyHistory', field: 'autismFamily',
    options: yesNo, required: true
  }));
  const asdHost = document.createElement('div');
  asdHost.dataset.conditional = 'familyHistory.autismFamily=yes';
  asdHost.appendChild(textArea({
    label: 'Details of autism in family',
    section: 'familyHistory', field: 'autismFamilyDetails',
    placeholder: 'Which family members? Age at diagnosis?'
  }));
  card.appendChild(asdHost);

  card.appendChild(radioGroup({
    label: 'Family history of ADHD?',
    section: 'familyHistory', field: 'adhdFamily',
    options: yesNo, required: true
  }));
  const adhdHost = document.createElement('div');
  adhdHost.dataset.conditional = 'familyHistory.adhdFamily=yes';
  adhdHost.appendChild(textArea({
    label: 'Details of ADHD in family',
    section: 'familyHistory', field: 'adhdFamilyDetails',
    placeholder: 'Which family members? Age at diagnosis?'
  }));
  card.appendChild(adhdHost);

  card.appendChild(radioGroup({
    label: 'Family history of learning disabilities?',
    section: 'familyHistory', field: 'learningDisabilities',
    options: yesNo, required: true
  }));
  const ldHost = document.createElement('div');
  ldHost.dataset.conditional = 'familyHistory.learningDisabilities=yes';
  ldHost.appendChild(textArea({
    label: 'Details of learning disabilities in family',
    section: 'familyHistory', field: 'learningDisabilitiesDetails',
    placeholder: 'Which family members? What type of learning disability?'
  }));
  card.appendChild(ldHost);

  card.appendChild(radioGroup({
    label: 'Family history of mental health conditions?',
    section: 'familyHistory', field: 'mentalHealthFamily',
    options: yesNo, required: true
  }));
  const mhHost = document.createElement('div');
  mhHost.dataset.conditional = 'familyHistory.mentalHealthFamily=yes';
  mhHost.appendChild(textArea({
    label: 'Details of mental health conditions in family',
    section: 'familyHistory', field: 'mentalHealthFamilyDetails',
    placeholder: 'Which family members? What conditions (depression, anxiety, bipolar, etc.)?'
  }));
  card.appendChild(mhHost);

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section]?.[field];
    host.style.display = String(current) === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Demographics (5)
  ['demographics', 'firstName'],
  ['demographics', 'lastName'],
  ['demographics', 'dateOfBirth'],
  ['demographics', 'sex'],
  ['demographics', 'ageGroup'],
  // Screening purpose (3 core)
  ['screeningPurpose', 'referralSource'],
  ['screeningPurpose', 'reasonForScreening'],
  ['screeningPurpose', 'previousAssessments'],
  // AQ-10 (10 questions tracked via rawResponses)
  // tracked separately below
  // Social communication (3 frequency)
  ['socialCommunication', 'eyeContact'],
  ['socialCommunication', 'socialReciprocity'],
  ['socialCommunication', 'conversationSkills'],
  // Repetitive behaviors (3)
  ['repetitiveBehaviors', 'routineAdherence'],
  ['repetitiveBehaviors', 'repetitiveMovements'],
  ['repetitiveBehaviors', 'resistanceToChange'],
  // Sensory profile (5)
  ['sensoryProfile', 'visualSensitivity'],
  ['sensoryProfile', 'auditorySensitivity'],
  ['sensoryProfile', 'tactileSensitivity'],
  ['sensoryProfile', 'olfactorySensitivity'],
  ['sensoryProfile', 'gustatorySensitivity'],
  // Family history (4)
  ['familyHistory', 'autismFamily'],
  ['familyHistory', 'adhdFamily'],
  ['familyHistory', 'learningDisabilities'],
  ['familyHistory', 'mentalHealthFamily']
];

const AQ10_KEYS = ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10'];

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  // AQ-10: count answered raw responses
  for (const k of AQ10_KEYS) {
    if (state.aq10Questionnaire.rawResponses[k]) answered++;
  }
  const total = TRACKED_FIELDS.length + AQ10_KEYS.length;
  const percent = Math.round((answered / total) * 100);
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

  const { aq10Score, aq10Category: cat, firedRules, additionalFlags, timestamp } = lastResult;

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
      <td class="num">${r.score} / 1</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No AQ-10 questions scored a 1.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Domain</th>
            <th scope="col">Question</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Autism Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>AQ-10 Total Score</h3>
      <p class="aq10-summary">
        <span class="aq10-score-badge ${aq10ScoreClass(aq10Score)}">${aq10Score} / 10</span>
        <span class="aq10-category">${esc(cat)}</span>
      </p>
      <p class="muted">Threshold: a score of 6 or above suggests further diagnostic assessment may be helpful.</p>

      <h3>Items scored 1</h3>
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
  const { aq10Score, aq10CategoryLabel, firedRules } = calculateAQ10(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    aq10Score,
    aq10Category: aq10CategoryLabel,
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
  updateConditionalSections();
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
}

function init() {
  renderForm();
  updateProgress();
  updateConditionalSections();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
