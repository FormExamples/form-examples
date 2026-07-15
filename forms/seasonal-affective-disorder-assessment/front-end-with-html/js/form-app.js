import { detectAdditionalFlags } from './flagged-issues.js';
import { gradeSAD } from './sad-grader.js';
import { PHQ9_OPTIONS, SPAQ_OPTIONS, combinedSeverityClass, combinedSeverityLabel, phq9BandLabel, phq9Items, spaqBandLabel, spaqItems } from './sad-rules.js';
import { emptyAssessment, mergeOver } from './types.js';

// Seasonal Affective Disorder Assessment - patient wizard (vanilla JavaScript).
//
// Single-page continuous wizard: every section is rendered in document order.
// The user scrolls through them; a sticky top-of-page progress summary
// reflects how many fields have been answered. Submission runs the pure
// `gradeSAD` engine and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload.

const TOTAL_STEPS = 10;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'seasonal-affective-disorder-assessment.front-end-form-with-html.v1';

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return mergeOver(emptyAssessment(), parsed);
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

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Set a field on the state, supporting both flat (section.field) and nested
 * (section.subsection.field) paths. Persists and refreshes UI.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 * @param {string} [subsection]  Optional intermediate key (e.g. 'phq9', 'spaq')
 */
function setField(section, field, value, subsection) {
  if (subsection) {
    state[section][subsection][field] = value;
  } else {
    state[section][field] = value;
  }
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

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
  const idSafe = opts.subsection
    ? `${opts.section}-${opts.subsection}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const value = opts.subsection
    ? state[opts.section][opts.subsection][opts.field]
    : state[opts.section][opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${idSafe}"`,
    `name="${idSafe}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`,
    `aria-describedby="${idSafe}-error"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${idSafe}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    <span class="error-message" id="${idSafe}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v, opts.subsection);
    clearFieldError(idSafe);
  });
  return wrapper;
}

function textArea(opts) {
  const idSafe = opts.subsection
    ? `${opts.section}-${opts.subsection}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const value = opts.subsection
    ? state[opts.section][opts.subsection][opts.field] ?? ''
    : state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${idSafe}">${esc(opts.label)}</label>
    <textarea id="${idSafe}" name="${idSafe}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${idSafe}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${idSafe}-error" aria-live="polite"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.section, opts.field, ta.value, opts.subsection);
    clearFieldError(idSafe);
  });
  return wrapper;
}

function selectInput(opts) {
  const idSafe = opts.subsection
    ? `${opts.section}-${opts.subsection}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const current = opts.subsection
    ? state[opts.section][opts.subsection][opts.field] ?? ''
    : state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${idSafe}">${esc(opts.label)}</label>
    <select id="${idSafe}" name="${idSafe}" class="select" aria-describedby="${idSafe}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${idSafe}-error" aria-live="polite"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.section, opts.field, sel.value, opts.subsection);
    clearFieldError(idSafe);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = opts.subsection
    ? `${opts.section}-${opts.subsection}-${opts.field}`
    : `${opts.section}-${opts.field}`;
  const current = opts.subsection
    ? state[opts.section][opts.subsection][opts.field]
    : state[opts.section][opts.field];
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
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    const requiredAttr = opts.required ? ' data-required' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}${requiredAttr}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setField(opts.section, opts.field, option.value, opts.subsection);
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

/**
 * Numeric scale group (radio buttons with score chips). Used by both PHQ-9
 * (0-3) and SPAQ (0-4) items.
 */
function scaleItem(opts) {
  const groupId = opts.id;
  const current = opts.subsection
    ? state[opts.section][opts.subsection][opts.field]
    : state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field scale-item';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.innerHTML = esc(opts.label);
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
      <span><span class="score-chip">${option.value}</span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setField(opts.section, opts.field, option.value, opts.subsection);
        clearFieldError(groupId);
      }
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
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
    `<span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information and geographic context.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First Name', section: 'demographics', field: 'firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last Name', section: 'demographics', field: 'lastName', required: true }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of Birth',
    section: 'demographics', field: 'dateOfBirth',
    type: 'date', required: true
  }));
  card.appendChild(radioGroup({
    label: 'Sex',
    section: 'demographics', field: 'sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' }
    ]
  }));

  const geo = document.createElement('div');
  geo.className = 'two-col';
  geo.appendChild(textInput({
    label: 'Country of residence',
    section: 'demographics', field: 'country',
    placeholder: 'e.g. United Kingdom'
  }));
  geo.appendChild(textInput({
    label: 'Latitude (optional)',
    section: 'demographics', field: 'latitude',
    placeholder: 'e.g. 54.5N'
  }));
  card.appendChild(geo);

  card.appendChild(textInput({
    label: 'Years living at this latitude',
    section: 'demographics', field: 'yearsAtCurrentLatitude',
    type: 'number', min: 0, max: 120
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Seasonal Pattern History',
    description: 'How your mood and behaviour change with the seasons.'
  });

  card.appendChild(radioGroup({
    label: 'Do your symptoms recur at the same time of year, year after year?',
    section: 'seasonalPatternHistory', field: 'symptomsRecurAnnually',
    options: yesNo
  }));

  const months = document.createElement('div');
  months.className = 'two-col';
  months.appendChild(textInput({
    label: 'Worst months (when symptoms peak)',
    section: 'seasonalPatternHistory', field: 'worstMonths',
    placeholder: 'e.g. Nov–Feb'
  }));
  months.appendChild(textInput({
    label: 'Best months (when symptoms ease)',
    section: 'seasonalPatternHistory', field: 'bestMonths',
    placeholder: 'e.g. May–Aug'
  }));
  card.appendChild(months);

  const hist = document.createElement('div');
  hist.className = 'two-col';
  hist.appendChild(textInput({
    label: 'Years affected',
    section: 'seasonalPatternHistory', field: 'yearsAffected',
    type: 'number', min: 0, max: 80
  }));
  hist.appendChild(textInput({
    label: 'Age at first onset',
    section: 'seasonalPatternHistory', field: 'firstOnsetAge'
  }));
  card.appendChild(hist);

  card.appendChild(radioGroup({
    label: 'Family history of seasonal affective disorder?',
    section: 'seasonalPatternHistory', field: 'familyHistorySad',
    options: yesNo
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Current Mood Assessment (PHQ-9)',
    description:
      'Over the last 2 weeks, how often have you been bothered by any of the following problems? Each item is scored 0 (not at all) to 3 (nearly every day).'
  });

  for (const item of phq9Items) {
    card.appendChild(scaleItem({
      id: `phq9-${item.field}`,
      label: `${item.id.replace('PHQ9-', '')}. ${item.label}`,
      section: 'currentMood',
      subsection: 'phq9',
      field: item.field,
      options: PHQ9_OPTIONS
    }));
  }

  // Conditional follow-up appears when q9 >= 1 (any thoughts of self-harm).
  const q9Followup = document.createElement('div');
  q9Followup.dataset.conditional = 'currentMood.phq9.q9>=1';
  q9Followup.className = 'crisis-notice';
  q9Followup.innerHTML = `
    <h3>Important — please read</h3>
    <p>You have indicated some thoughts of self-harm. The next sections, especially the Risk Assessment (Section 9), will ask you more about this so we can help keep you safe.</p>
    <p>If you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E. To talk to someone now, contact the <strong>Samaritans on 116 123</strong> (free, 24/7, UK and ROI).</p>
  `;
  card.appendChild(q9Followup);

  card.appendChild(selectInput({
    label:
      'If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?',
    section: 'currentMood', field: 'difficultyLevel',
    options: [
      { value: 'not-difficult', label: 'Not difficult at all' },
      { value: 'somewhat', label: 'Somewhat difficult' },
      { value: 'very', label: 'Very difficult' },
      { value: 'extremely', label: 'Extremely difficult' }
    ]
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Sleep & Energy',
    description: 'Seasonal changes in sleep and energy. Includes two SPAQ items.'
  });

  // SPAQ item — sleep length (0-4)
  const sleepItem = spaqItems.find((i) => i.field === 'sleepLength');
  card.appendChild(scaleItem({
    id: 'spaq-sleepLength',
    label: 'SPAQ — Sleep length: how much does the season affect how long you sleep?',
    section: sleepItem.section,
    subsection: sleepItem.subsection,
    field: sleepItem.field,
    options: SPAQ_OPTIONS
  }));

  // SPAQ item — energy level (0-4)
  const energyItem = spaqItems.find((i) => i.field === 'energyLevel');
  card.appendChild(scaleItem({
    id: 'spaq-energyLevel',
    label: 'SPAQ — Energy level: how much does the season affect your energy?',
    section: energyItem.section,
    subsection: energyItem.subsection,
    field: energyItem.field,
    options: SPAQ_OPTIONS
  }));

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Average hours slept per night in winter',
    section: 'sleepEnergy', field: 'hoursSleptWinter',
    type: 'number', min: 0, max: 24, step: 0.5
  }));
  grid.appendChild(textInput({
    label: 'Average hours slept per night in summer',
    section: 'sleepEnergy', field: 'hoursSleptSummer',
    type: 'number', min: 0, max: 24, step: 0.5
  }));
  card.appendChild(grid);

  card.appendChild(radioGroup({
    label: 'Do you sleep more than 9 hours/day during winter (hypersomnia)?',
    section: 'sleepEnergy', field: 'hypersomnia', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you have difficulty waking in the morning, particularly during winter?',
    section: 'sleepEnergy', field: 'morningFatigue', options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Notes about sleep and energy',
    section: 'sleepEnergy', field: 'energyNotes',
    placeholder: 'Anything else relevant about your sleep or energy…',
    rows: 3
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Appetite & Weight Changes',
    description: 'Seasonal changes in appetite and body weight. Includes two SPAQ items.'
  });

  const appetiteItem = spaqItems.find((i) => i.field === 'appetite');
  card.appendChild(scaleItem({
    id: 'spaq-appetite',
    label: 'SPAQ — Appetite: how much does the season affect your appetite?',
    section: appetiteItem.section,
    subsection: appetiteItem.subsection,
    field: appetiteItem.field,
    options: SPAQ_OPTIONS
  }));

  const weightItem = spaqItems.find((i) => i.field === 'weight');
  card.appendChild(scaleItem({
    id: 'spaq-weight',
    label: 'SPAQ — Weight: how much does the season affect your weight?',
    section: weightItem.section,
    subsection: weightItem.subsection,
    field: weightItem.field,
    options: SPAQ_OPTIONS
  }));

  card.appendChild(radioGroup({
    label: 'Do you crave carbohydrates (bread, pasta, sweets) more in winter?',
    section: 'appetiteWeight', field: 'carbohydrateCraving', options: yesNo
  }));

  card.appendChild(textInput({
    label: 'Typical weight change between winter and summer',
    section: 'appetiteWeight', field: 'winterWeightChangeKg',
    type: 'number', min: -30, max: 30, step: 0.5, unit: 'kg (+/-)'
  }));

  card.appendChild(textArea({
    label: 'Other eating-pattern changes',
    section: 'appetiteWeight', field: 'eatingPatternChanges',
    placeholder: 'e.g. larger evening meals, late-night snacking…',
    rows: 3
  }));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Social & Occupational Impact',
    description: 'How seasonal symptoms affect your daily life. Includes two SPAQ items.'
  });

  const moodItem = spaqItems.find((i) => i.field === 'mood');
  card.appendChild(scaleItem({
    id: 'spaq-mood',
    label: 'SPAQ — Mood (general well-being): how much does the season affect your mood?',
    section: moodItem.section,
    subsection: moodItem.subsection,
    field: moodItem.field,
    options: SPAQ_OPTIONS
  }));

  const socialItem = spaqItems.find((i) => i.field === 'socialActivity');
  card.appendChild(scaleItem({
    id: 'spaq-socialActivity',
    label: 'SPAQ — Social activity: how much does the season affect how socially active you are?',
    section: socialItem.section,
    subsection: socialItem.subsection,
    field: socialItem.field,
    options: SPAQ_OPTIONS
  }));

  card.appendChild(radioGroup({
    label: 'Are these symptoms impairing your work or studies?',
    section: 'socialOccupational', field: 'workImpaired', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Are these symptoms affecting your relationships?',
    section: 'socialOccupational', field: 'relationshipsImpaired', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you withdraw socially during the worst months?',
    section: 'socialOccupational', field: 'socialWithdrawal', options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Notes on occupational or social impact',
    section: 'socialOccupational', field: 'occupationalNotes',
    placeholder: 'Describe any specific impact on work, study, or relationships…',
    rows: 3
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Light Exposure Assessment',
    description: 'Daily exposure to natural and artificial bright light.'
  });

  card.appendChild(textInput({
    label: 'Average minutes spent outdoors per day during winter',
    section: 'lightExposure', field: 'dailyOutdoorMinutes',
    type: 'number', min: 0, max: 1440, unit: 'min'
  }));

  card.appendChild(radioGroup({
    label: 'Do you predominantly work indoors?',
    section: 'lightExposure', field: 'workIndoors', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you usually keep curtains/blinds closed during the day?',
    section: 'lightExposure', field: 'curtainsClosedDaytime', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you typically go outside within an hour of waking?',
    section: 'lightExposure', field: 'sunriseExposure', options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Do you currently use a light-therapy box?',
    section: 'lightExposure', field: 'usesLightTherapyBox', options: yesNo
  }));
  const ltDetails = document.createElement('div');
  ltDetails.dataset.conditional = 'lightExposure.usesLightTherapyBox=yes';
  ltDetails.appendChild(textInput({
    label: 'Light therapy details (lux, duration, time of day)',
    section: 'lightExposure', field: 'lightTherapyDetails',
    placeholder: 'e.g. 10,000 lux, 30 minutes after waking'
  }));
  card.appendChild(ltDetails);

  card.appendChild(radioGroup({
    label: 'Do you have access to a 10,000 lux light-therapy box if recommended?',
    section: 'lightExposure', field: 'lightTherapyAccess', options: yesNo
  }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Previous Treatments',
    description: 'Treatments tried for SAD or depression, past or present.'
  });

  card.appendChild(radioGroup({
    label: 'Have you previously been treated with antidepressant medication?',
    section: 'previousTreatments', field: 'antidepressants', options: yesNo
  }));
  const adDetails = document.createElement('div');
  adDetails.dataset.conditional = 'previousTreatments.antidepressants=yes';
  adDetails.appendChild(textInput({
    label: 'Antidepressant details (medication, dose, duration, response)',
    section: 'previousTreatments', field: 'antidepressantDetails'
  }));
  card.appendChild(adDetails);

  card.appendChild(radioGroup({
    label: 'Have you previously had psychotherapy (e.g. CBT, counselling)?',
    section: 'previousTreatments', field: 'psychotherapy', options: yesNo
  }));
  const psyDetails = document.createElement('div');
  psyDetails.dataset.conditional = 'previousTreatments.psychotherapy=yes';
  psyDetails.appendChild(textInput({
    label: 'Psychotherapy details (modality, duration, response)',
    section: 'previousTreatments', field: 'psychotherapyDetails'
  }));
  card.appendChild(psyDetails);

  card.appendChild(radioGroup({
    label: 'Have you previously used light therapy?',
    section: 'previousTreatments', field: 'lightTherapyHistory', options: yesNo
  }));
  const lthDetails = document.createElement('div');
  lthDetails.dataset.conditional = 'previousTreatments.lightTherapyHistory=yes';
  lthDetails.appendChild(textInput({
    label: 'Light-therapy history (when, duration, response)',
    section: 'previousTreatments', field: 'lightTherapyHistoryDetails'
  }));
  card.appendChild(lthDetails);

  card.appendChild(radioGroup({
    label: 'Are you currently receiving any treatment for SAD or depression?',
    section: 'previousTreatments', field: 'currentTreatment', options: yesNo
  }));
  const ctDetails = document.createElement('div');
  ctDetails.dataset.conditional = 'previousTreatments.currentTreatment=yes';
  ctDetails.appendChild(textInput({
    label: 'Current treatment details',
    section: 'previousTreatments', field: 'currentTreatmentDetails'
  }));
  card.appendChild(ctDetails);

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Risk Assessment (Self-harm)',
    description:
      'These questions help us understand whether you are safe right now. Please answer honestly — what you tell us will be reviewed by a clinician.'
  });

  // Always-visible reminder banner.
  const banner = document.createElement('div');
  banner.className = 'crisis-notice';
  banner.innerHTML = `
    <h3>If you need help right now</h3>
    <p>If you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E.</p>
    <p>To talk to someone now, contact the <strong>Samaritans on 116 123</strong> (free, 24/7, UK and ROI).</p>
  `;
  card.appendChild(banner);

  card.appendChild(radioGroup({
    label: 'Have you had thoughts that you would be better off dead, or of hurting yourself?',
    section: 'riskAssessment', field: 'suicidalIdeation', options: yesNo
  }));

  const intentHost = document.createElement('div');
  intentHost.dataset.conditionalAny = 'riskAssessment.suicidalIdeation=yes';
  intentHost.appendChild(radioGroup({
    label: 'Do you have any intent to act on these thoughts?',
    section: 'riskAssessment', field: 'suicidalIntent', options: yesNo
  }));
  intentHost.appendChild(textArea({
    label: 'Do you have a plan? If so, please describe.',
    section: 'riskAssessment', field: 'suicidalPlan',
    placeholder: 'You may leave this blank if you prefer.',
    rows: 2
  }));
  card.appendChild(intentHost);

  card.appendChild(radioGroup({
    label: 'Have you harmed yourself recently?',
    section: 'riskAssessment', field: 'selfHarm', options: yesNo
  }));
  const shDetails = document.createElement('div');
  shDetails.dataset.conditional = 'riskAssessment.selfHarm=yes';
  shDetails.appendChild(textInput({
    label: 'Brief description (what, when)',
    section: 'riskAssessment', field: 'selfHarmDetails'
  }));
  card.appendChild(shDetails);

  card.appendChild(radioGroup({
    label: 'Have you ever attempted suicide in the past?',
    section: 'riskAssessment', field: 'previousAttempt', options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Protective factors (e.g. family, faith, reasons for living)',
    section: 'riskAssessment', field: 'protectiveFactors',
    placeholder: 'What helps keep you safe?',
    rows: 3
  }));

  card.appendChild(radioGroup({
    label: 'Do you have a written safety plan in place?',
    section: 'riskAssessment', field: 'safetyPlanInPlace', options: yesNo
  }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Treatment Plan & Monitoring',
    description:
      'Indicate which treatment options are agreed for the coming season, and when you will be reviewed.'
  });

  card.appendChild(radioGroup({
    label: 'Plan: bright-light therapy?',
    section: 'treatmentPlan', field: 'planLightTherapy', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Plan: antidepressant medication?',
    section: 'treatmentPlan', field: 'planAntidepressant', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Plan: psychotherapy (e.g. CBT)?',
    section: 'treatmentPlan', field: 'planPsychotherapy', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Plan: lifestyle measures (exercise, diet, daylight exposure)?',
    section: 'treatmentPlan', field: 'planLifestyle', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Plan: urgent crisis / mental-health team referral?',
    section: 'treatmentPlan', field: 'planCrisisReferral', options: yesNo
  }));

  card.appendChild(selectInput({
    label: 'Follow-up interval',
    section: 'treatmentPlan', field: 'followUpInterval',
    options: [
      { value: '1-week', label: '1 week' },
      { value: '2-weeks', label: '2 weeks' },
      { value: '4-weeks', label: '4 weeks' },
      { value: '8-weeks', label: '8 weeks' },
      { value: '12-weeks', label: '12 weeks' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Clinician notes',
    section: 'treatmentPlan', field: 'clinicianNotes',
    placeholder: 'Free-text notes about the plan…',
    rows: 4
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

/** Resolve a dotted state path, e.g. 'currentMood.phq9.q9'. */
function resolvePath(path) {
  const parts = path.split('.');
  let cur = state;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function updateConditionalSections() {
  // Equality: e.g. data-conditional="lightExposure.usesLightTherapyBox=yes"
  // Greater-than-or-equal: e.g. data-conditional="currentMood.phq9.q9>=1"
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    let match = false;
    if (expr.includes('>=')) {
      const [path, n] = expr.split('>=');
      const v = resolvePath(path);
      const num = Number(n);
      match = typeof v === 'number' && v >= num;
    } else if (expr.includes('=')) {
      const [path, target] = expr.split('=');
      const v = resolvePath(path);
      match = String(v) === target;
    }
    host.style.display = match ? '' : 'none';
  });
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const [path, csv] = expr.split('=');
    const v = String(resolvePath(path) ?? '');
    const targets = csv.split(',');
    host.style.display = targets.includes(v) ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED = [
  // Demographics (4)
  ['demographics', () => state.demographics.firstName],
  ['demographics', () => state.demographics.lastName],
  ['demographics', () => state.demographics.dateOfBirth],
  ['demographics', () => state.demographics.sex],
  // Seasonal pattern history (3)
  ['seasonalPatternHistory', () => state.seasonalPatternHistory.symptomsRecurAnnually],
  ['seasonalPatternHistory', () => state.seasonalPatternHistory.worstMonths],
  ['seasonalPatternHistory', () => state.seasonalPatternHistory.familyHistorySad],
  // PHQ-9 (9)
  ['currentMood', () => state.currentMood.phq9.q1],
  ['currentMood', () => state.currentMood.phq9.q2],
  ['currentMood', () => state.currentMood.phq9.q3],
  ['currentMood', () => state.currentMood.phq9.q4],
  ['currentMood', () => state.currentMood.phq9.q5],
  ['currentMood', () => state.currentMood.phq9.q6],
  ['currentMood', () => state.currentMood.phq9.q7],
  ['currentMood', () => state.currentMood.phq9.q8],
  ['currentMood', () => state.currentMood.phq9.q9],
  // SPAQ items (split across steps 4-6)
  ['sleepEnergy', () => state.sleepEnergy.spaq.sleepLength],
  ['sleepEnergy', () => state.sleepEnergy.spaq.energyLevel],
  ['appetiteWeight', () => state.appetiteWeight.spaq.appetite],
  ['appetiteWeight', () => state.appetiteWeight.spaq.weight],
  ['socialOccupational', () => state.socialOccupational.spaq.mood],
  ['socialOccupational', () => state.socialOccupational.spaq.socialActivity],
  // Sleep & Energy ancillary
  ['sleepEnergy', () => state.sleepEnergy.hypersomnia],
  ['sleepEnergy', () => state.sleepEnergy.morningFatigue],
  // Appetite ancillary
  ['appetiteWeight', () => state.appetiteWeight.carbohydrateCraving],
  // Social/occupational ancillary
  ['socialOccupational', () => state.socialOccupational.workImpaired],
  ['socialOccupational', () => state.socialOccupational.relationshipsImpaired],
  ['socialOccupational', () => state.socialOccupational.socialWithdrawal],
  // Light exposure
  ['lightExposure', () => state.lightExposure.workIndoors],
  ['lightExposure', () => state.lightExposure.curtainsClosedDaytime],
  ['lightExposure', () => state.lightExposure.sunriseExposure],
  ['lightExposure', () => state.lightExposure.usesLightTherapyBox],
  ['lightExposure', () => state.lightExposure.lightTherapyAccess],
  // Previous treatments
  ['previousTreatments', () => state.previousTreatments.antidepressants],
  ['previousTreatments', () => state.previousTreatments.psychotherapy],
  ['previousTreatments', () => state.previousTreatments.lightTherapyHistory],
  ['previousTreatments', () => state.previousTreatments.currentTreatment],
  // Risk assessment
  ['riskAssessment', () => state.riskAssessment.suicidalIdeation],
  ['riskAssessment', () => state.riskAssessment.selfHarm],
  ['riskAssessment', () => state.riskAssessment.previousAttempt],
  ['riskAssessment', () => state.riskAssessment.safetyPlanInPlace],
  // Treatment plan
  ['treatmentPlan', () => state.treatmentPlan.planLightTherapy],
  ['treatmentPlan', () => state.treatmentPlan.planAntidepressant],
  ['treatmentPlan', () => state.treatmentPlan.planPsychotherapy],
  ['treatmentPlan', () => state.treatmentPlan.planLifestyle],
  ['treatmentPlan', () => state.treatmentPlan.followUpInterval]
];

function isAnswered(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'string') return v !== '';
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const [section, get] of TRACKED) {
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    if (isAnswered(get())) {
      answered++;
      sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
    }
  }
  const total = TRACKED.length;
  const percent = Math.round((answered / total) * 100);
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
  { step: 1,  section: 'demographics',            title: 'Demographics' },
  { step: 2,  section: 'seasonalPatternHistory',  title: 'Seasonal Pattern' },
  { step: 3,  section: 'currentMood',             title: 'Current Mood (PHQ-9)' },
  { step: 4,  section: 'sleepEnergy',             title: 'Sleep & Energy' },
  { step: 5,  section: 'appetiteWeight',          title: 'Appetite & Weight' },
  { step: 6,  section: 'socialOccupational',      title: 'Social & Occupational' },
  { step: 7,  section: 'lightExposure',           title: 'Light Exposure' },
  { step: 8,  section: 'previousTreatments',      title: 'Previous Treatments' },
  { step: 9,  section: 'riskAssessment',          title: 'Risk Assessment' },
  { step: 10, section: 'treatmentPlan',           title: 'Treatment Plan' }
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
    spaqScore, spaqBand, phq9Score, phq9Band,
    combinedSeverity, firedRules, additionalFlags, timestamp
  } = lastResult;

  // Crisis notice — only when severity = critical
  const crisisHtml = combinedSeverity === 'critical' ? `
    <div class="crisis-notice" role="alert">
      <h3>Urgent — please read</h3>
      <p>Your responses indicate you may be at significant risk. Please speak to someone now.</p>
      <p>If you are in immediate danger, call <strong>999</strong> or go to your nearest A&amp;E.</p>
      <p>To talk to a trained listener for free, 24 hours a day, contact the <strong>Samaritans on 116 123</strong> (UK and ROI).</p>
    </div>
  ` : '';

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

  const spaqRules = firedRules.filter((r) => r.id.startsWith('SPAQ'));
  const phq9Rules = firedRules.filter((r) => r.id.startsWith('PHQ9'));

  const spaqRows = spaqRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${r.score} / 4</td>
    </tr>
  `).join('');

  const phq9Rows = phq9Rules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${r.score} / 3</td>
    </tr>
  `).join('');

  const spaqTable = spaqRules.length === 0
    ? `<p class="muted">No SPAQ items answered.</p>`
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
        <tbody>${spaqRows}</tbody>
      </table>
    `;

  const phq9Table = phq9Rules.length === 0
    ? `<p class="muted">No PHQ-9 items answered.</p>`
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
        <tbody>${phq9Rows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Seasonal Affective Disorder Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      ${crisisHtml}

      <h3>Combined severity</h3>
      <p class="score-summary">
        <span class="severity-badge ${combinedSeverityClass(combinedSeverity)}">${esc(combinedSeverityLabel(combinedSeverity))}</span>
      </p>

      <h3>SPAQ Global Seasonality Score</h3>
      <p class="score-summary">
        <span class="score-badge">${spaqScore} / 24</span>
        <span class="score-band">${esc(spaqBandLabel(spaqBand))}</span>
      </p>
      ${spaqTable}

      <h3>PHQ-9 Depression Severity</h3>
      <p class="score-summary">
        <span class="score-badge">${phq9Score} / 27</span>
        <span class="score-band">${esc(phq9BandLabel(phq9Band))}</span>
      </p>
      ${phq9Table}

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
  const grading = gradeSAD(state);
  const additionalFlags = detectAdditionalFlags(state, grading);
  lastResult = {
    spaqScore: grading.spaqScore,
    spaqBand: grading.spaqBand,
    phq9Score: grading.phq9Score,
    phq9Band: grading.phq9Band,
    combinedSeverity: grading.combinedSeverity,
    firedRules: grading.firedRules,
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
  host.appendChild(renderStep10());
}

function init() {
  renderStepList();
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
