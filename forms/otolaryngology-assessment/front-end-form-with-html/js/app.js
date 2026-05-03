// Otolaryngology Assessment — patient/clinician wizard (vanilla JS, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure SNOT-22 grader and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.OtolaryngologyAssessment`. Pulling them off here keeps
// the rest of this file referring to short local names. Whole file is
// wrapped in an IIFE so its top-level identifiers don't leak to the global
// scope.
(function () {
'use strict';

const NS = window.OtolaryngologyAssessment;
const {
  emptyAssessment,
  SNOT22_ITEMS,
  SNOT22_OPTIONS,
  calculateSnot22,
  classifySnot22Score,
  severityLabel,
  severityClass,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'otolaryngology-assessment.front-end-form-with-html.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return mergeDeep(emptyAssessment(), parsed);
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** Recursive plain-object merge (arrays + primitives are replaced). */
function mergeDeep(base, override) {
  if (override == null || typeof override !== 'object') return base;
  for (const key of Object.keys(base)) {
    const b = base[key];
    const o = override[key];
    if (o === undefined) continue;
    if (b && typeof b === 'object' && !Array.isArray(b)) {
      base[key] = mergeDeep(b, o ?? {});
    } else {
      base[key] = o;
    }
  }
  return base;
}

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

let state = loadState();
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a value at `state[section][...path]`. `pathOrField` may be a single
 * field name (e.g. 'firstName') or a dotted path for nested groups
 * (e.g. 'right.tympanicMembrane' under the otoscopy section).
 */
function setField(section, pathOrField, value) {
  const parts = String(pathOrField).split('.');
  let target = state[section];
  for (let i = 0; i < parts.length - 1; i++) target = target[parts[i]];
  target[parts[parts.length - 1]] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  updateSnot22Readout();
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getNested(section, pathOrField) {
  const parts = String(pathOrField).split('.');
  let target = state[section];
  for (const p of parts) target = target?.[p];
  return target;
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = `${opts.section}-${opts.field.replace(/\./g, '-')}`;
  const value = getNested(opts.section, opts.field);
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
    if (type === 'number') v = v === '' ? null : Number(v);
    setField(opts.section, opts.field, v);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field.replace(/\./g, '-')}`;
  const value = getNested(opts.section, opts.field) ?? '';
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
  const id = `${opts.section}-${opts.field.replace(/\./g, '-')}`;
  const current = getNested(opts.section, opts.field) ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select-input">${optionsHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field.replace(/\./g, '-')}`;
  const current = getNested(opts.section, opts.field);
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';
  if (opts.compact) wrapper.classList.add('radio-compact');

  const legend = document.createElement('legend');
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${String(option.value).replace(/\W+/g, '_')}`;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = String(current) === String(option.value) ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        const raw = input.value;
        const numeric = opts.numeric ? Number(raw) : raw;
        setField(opts.section, opts.field, numeric);
      }
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

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

// ----------------------------------------------------------------------
// Section renderers
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
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(textInput({
    label: 'Occupation',
    section: 'demographics', field: 'occupation',
    placeholder: 'e.g. Teacher, Builder, Retired'
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Presenting Complaint',
    description: 'Which body region is bothering you? Tick all that apply.'
  });

  card.appendChild(radioGroup({
    label: 'Ear symptoms (pain, discharge, hearing loss, tinnitus, blockage)?',
    section: 'presentingComplaint', field: 'earSymptoms', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Nose / sinus symptoms (blockage, discharge, loss of smell, facial pressure)?',
    section: 'presentingComplaint', field: 'noseSymptoms', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Throat symptoms (sore throat, hoarseness, swallowing difficulty)?',
    section: 'presentingComplaint', field: 'throatSymptoms', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Neck symptoms (lump, swelling, pain)?',
    section: 'presentingComplaint', field: 'neckSymptoms', options: yesNo
  }));

  card.appendChild(textArea({
    label: 'In your own words, what is the main reason for today\u2019s visit?',
    section: 'presentingComplaint', field: 'chiefComplaint',
    placeholder: 'Describe the main symptom that brought you in today…',
    rows: 3
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'History of Present Illness',
    description: 'When did the symptoms begin and how have they evolved?'
  });

  card.appendChild(textInput({
    label: 'Date symptoms began',
    section: 'historyOfPresentIllness', field: 'onsetDate',
    type: 'date'
  }));
  card.appendChild(radioGroup({
    label: 'How did the symptoms start?',
    section: 'historyOfPresentIllness', field: 'onsetType',
    options: [
      { value: 'sudden', label: 'Sudden' },
      { value: 'gradual', label: 'Gradual' }
    ]
  }));
  card.appendChild(radioGroup({
    label: 'Progression since onset',
    section: 'historyOfPresentIllness', field: 'progression',
    options: [
      { value: 'worsening', label: 'Worsening' },
      { value: 'stable', label: 'Stable' },
      { value: 'improving', label: 'Improving' },
      { value: 'fluctuating', label: 'Fluctuating' }
    ]
  }));
  card.appendChild(radioGroup({
    label: 'Side affected',
    section: 'historyOfPresentIllness', field: 'laterality',
    options: [
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
      { value: 'both', label: 'Both' }
    ]
  }));
  card.appendChild(radioGroup({
    label: 'Have you had similar episodes before?',
    section: 'historyOfPresentIllness', field: 'previousEpisodes', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'What makes the symptoms worse?',
    section: 'historyOfPresentIllness', field: 'aggravatingFactors',
    placeholder: 'e.g. cold weather, lying down, eating…',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'What makes the symptoms better?',
    section: 'historyOfPresentIllness', field: 'relievingFactors',
    placeholder: 'e.g. saline rinse, decongestants, rest…',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Associated symptoms',
    section: 'historyOfPresentIllness', field: 'associatedSymptoms',
    placeholder: 'e.g. fever, weight loss, night sweats…',
    rows: 2
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Past ENT History & Surgery',
    description: 'Prior conditions, operations, and lifestyle factors.'
  });

  card.appendChild(radioGroup({
    label: 'Have you had previous ENT surgery?',
    section: 'pastEntHistory', field: 'priorEntSurgery', options: yesNo
  }));
  const surgeryDetails = document.createElement('div');
  surgeryDetails.dataset.conditional = 'pastEntHistory.priorEntSurgery=yes';
  surgeryDetails.appendChild(textInput({
    label: 'Details (procedure and year)',
    section: 'pastEntHistory', field: 'priorEntSurgeryDetails',
    placeholder: 'e.g. Septoplasty 2018, Tonsillectomy 1995'
  }));
  card.appendChild(surgeryDetails);

  card.appendChild(radioGroup({ label: 'Chronic sinusitis?',  section: 'pastEntHistory', field: 'chronicSinusitis', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Allergic rhinitis (hay fever)?', section: 'pastEntHistory', field: 'allergicRhinitis', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Hearing loss?', section: 'pastEntHistory', field: 'hearingLoss', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Tinnitus (ringing in the ears)?', section: 'pastEntHistory', field: 'tinnitus', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Vertigo (spinning sensation)?', section: 'pastEntHistory', field: 'vertigo', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Do you wear hearing aids?', section: 'pastEntHistory', field: 'hearingAids', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Personal history of head/neck cancer?', section: 'pastEntHistory', field: 'headNeckCancer', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Prior radiotherapy to head or neck?', section: 'pastEntHistory', field: 'headNeckRadiotherapy', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Currently smoke?', section: 'pastEntHistory', field: 'smoking', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Drink alcohol regularly (>14 units/week)?', section: 'pastEntHistory', field: 'alcohol', options: yesNo }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'SNOT-22 Questionnaire',
    description: 'Considering the past 2 weeks, how big a problem has each item been? 0 = no problem, 5 = as bad as it can be.'
  });

  // Live total readout.
  const readout = document.createElement('div');
  readout.className = 'snot22-readout';
  readout.id = 'snot22-readout';
  readout.innerHTML = renderSnot22Readout();
  card.appendChild(readout);

  for (let i = 0; i < SNOT22_ITEMS.length; i++) {
    const item = SNOT22_ITEMS[i];
    card.appendChild(radioGroup({
      label: `${i + 1}. ${item.label}`,
      section: 'snot22',
      field: item.key,
      options: SNOT22_OPTIONS,
      numeric: true,
      compact: true
    }));
  }
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'External Examination',
    description: 'Inspection of the face, ears, and external nose.'
  });

  card.appendChild(radioGroup({ label: 'Facial asymmetry?', section: 'externalExamination', field: 'facialAsymmetry', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Facial swelling?', section: 'externalExamination', field: 'facialSwelling', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Skin lesions on head/neck?', section: 'externalExamination', field: 'skinLesions', options: yesNo }));

  card.appendChild(textArea({
    label: 'External ear findings',
    section: 'externalExamination', field: 'externalEarFindings',
    placeholder: 'e.g. pinna deformity, mastoid tenderness, pre-auricular tag…',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'External nose findings',
    section: 'externalExamination', field: 'externalNoseFindings',
    placeholder: 'e.g. saddle deformity, columellar lesion, septal haematoma…',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Examination notes',
    section: 'externalExamination', field: 'examinationNotes',
    rows: 2
  }));

  return card;
}

function renderOtoscopySide(side) {
  const wrapper = document.createElement('div');
  wrapper.className = 'side-block';
  wrapper.innerHTML = `<h3>${side === 'right' ? 'Right ear' : 'Left ear'}</h3>`;
  wrapper.appendChild(selectInput({
    label: 'Tympanic membrane',
    section: 'otoscopy', field: `${side}.tympanicMembrane`,
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'erythematous', label: 'Erythematous' },
      { value: 'bulging', label: 'Bulging' },
      { value: 'retracted', label: 'Retracted' },
      { value: 'perforated', label: 'Perforated' },
      { value: 'effusion', label: 'Middle-ear effusion' }
    ]
  }));
  wrapper.appendChild(selectInput({
    label: 'External canal',
    section: 'otoscopy', field: `${side}.canal`,
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'wax', label: 'Wax (cerumen)' },
      { value: 'discharge', label: 'Discharge' },
      { value: 'foreign-body', label: 'Foreign body' },
      { value: 'inflamed', label: 'Inflamed' }
    ]
  }));
  wrapper.appendChild(radioGroup({
    label: 'Tympanic membrane mobility (pneumatic otoscopy)?',
    section: 'otoscopy', field: `${side}.mobility`, options: yesNo
  }));
  return wrapper;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Otoscopy',
    description: 'Examination of the ear canal and tympanic membrane on each side.'
  });
  const grid = document.createElement('div');
  grid.className = 'two-col side-grid';
  grid.appendChild(renderOtoscopySide('right'));
  grid.appendChild(renderOtoscopySide('left'));
  card.appendChild(grid);
  card.appendChild(textArea({
    label: 'Otoscopy notes',
    section: 'otoscopy', field: 'otoscopyNotes',
    rows: 2
  }));
  return card;
}

function renderRhinoscopySide(side) {
  const wrapper = document.createElement('div');
  wrapper.className = 'side-block';
  wrapper.innerHTML = `<h3>${side === 'right' ? 'Right nasal cavity' : 'Left nasal cavity'}</h3>`;
  wrapper.appendChild(selectInput({
    label: 'Septum',
    section: 'anteriorRhinoscopy', field: `${side}.septum`,
    options: [
      { value: 'midline', label: 'Midline' },
      { value: 'deviated-left', label: 'Deviated left' },
      { value: 'deviated-right', label: 'Deviated right' }
    ]
  }));
  wrapper.appendChild(selectInput({
    label: 'Mucosa',
    section: 'anteriorRhinoscopy', field: `${side}.mucosa`,
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'pale', label: 'Pale' },
      { value: 'congested', label: 'Congested / erythematous' },
      { value: 'pale-boggy', label: 'Pale & boggy' }
    ]
  }));
  wrapper.appendChild(selectInput({
    label: 'Polyps',
    section: 'anteriorRhinoscopy', field: `${side}.polyps`,
    options: [
      { value: 'none', label: 'None' },
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large / obstructing' }
    ]
  }));
  wrapper.appendChild(selectInput({
    label: 'Discharge',
    section: 'anteriorRhinoscopy', field: `${side}.discharge`,
    options: [
      { value: 'none', label: 'None' },
      { value: 'clear', label: 'Clear' },
      { value: 'mucoid', label: 'Mucoid' },
      { value: 'purulent', label: 'Purulent' },
      { value: 'blood', label: 'Blood-stained' }
    ]
  }));
  wrapper.appendChild(selectInput({
    label: 'Inferior turbinate hypertrophy',
    section: 'anteriorRhinoscopy', field: `${side}.turbinateHypertrophy`,
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));
  return wrapper;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Anterior Rhinoscopy',
    description: 'Examination of the anterior nasal cavities on each side.'
  });
  const grid = document.createElement('div');
  grid.className = 'two-col side-grid';
  grid.appendChild(renderRhinoscopySide('right'));
  grid.appendChild(renderRhinoscopySide('left'));
  card.appendChild(grid);
  card.appendChild(textArea({
    label: 'Rhinoscopy notes',
    section: 'anteriorRhinoscopy', field: 'rhinoscopyNotes',
    rows: 2
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Oropharyngeal & Neck Examination',
    description: 'Mouth, throat, and neck inspection / palpation.'
  });

  card.appendChild(selectInput({
    label: 'Oral mucosa',
    section: 'oropharyngealNeckExamination', field: 'oralMucosa',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'erythematous', label: 'Erythematous' },
      { value: 'exudate', label: 'Exudate' },
      { value: 'ulcerated', label: 'Ulcerated' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Tonsils',
    section: 'oropharyngealNeckExamination', field: 'tonsils',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'enlarged', label: 'Enlarged (symmetric)' },
      { value: 'absent', label: 'Absent (post-tonsillectomy)' },
      { value: 'asymmetric', label: 'Asymmetric' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Pharynx',
    section: 'oropharyngealNeckExamination', field: 'pharynx',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'erythematous', label: 'Erythematous' },
      { value: 'cobblestone', label: 'Cobblestone (lymphoid hyperplasia)' },
      { value: 'postNasalDrip', label: 'Post-nasal drip visible' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Palate movement',
    section: 'oropharyngealNeckExamination', field: 'palateMovement',
    options: [
      { value: 'normal', label: 'Symmetric / normal' },
      { value: 'asymmetric', label: 'Asymmetric' },
      { value: 'limited', label: 'Limited' }
    ]
  }));

  card.appendChild(radioGroup({
    label: 'Cervical lymphadenopathy?',
    section: 'oropharyngealNeckExamination', field: 'cervicalLymphadenopathy', options: yesNo
  }));
  const lnDetails = document.createElement('div');
  lnDetails.dataset.conditional = 'oropharyngealNeckExamination.cervicalLymphadenopathy=yes';
  lnDetails.appendChild(textInput({
    label: 'Lymph-node details (level, size, mobility, tenderness)',
    section: 'oropharyngealNeckExamination', field: 'cervicalLymphadenopathyDetails'
  }));
  card.appendChild(lnDetails);

  card.appendChild(radioGroup({ label: 'Thyroid enlarged?', section: 'oropharyngealNeckExamination', field: 'thyroidEnlarged', options: yesNo }));

  card.appendChild(radioGroup({
    label: 'Other neck mass?',
    section: 'oropharyngealNeckExamination', field: 'neckMass', options: yesNo
  }));
  const massDetails = document.createElement('div');
  massDetails.dataset.conditional = 'oropharyngealNeckExamination.neckMass=yes';
  massDetails.appendChild(textInput({
    label: 'Neck mass details',
    section: 'oropharyngealNeckExamination', field: 'neckMassDetails'
  }));
  card.appendChild(massDetails);

  card.appendChild(textArea({
    label: 'Examination notes',
    section: 'oropharyngealNeckExamination', field: 'examinationNotes',
    rows: 2
  }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Clinical Impression & Management Plan',
    description: 'Working diagnosis and next steps.'
  });

  card.appendChild(textArea({
    label: 'Working diagnosis',
    section: 'clinicalImpressionPlan', field: 'workingDiagnosis',
    placeholder: 'e.g. Chronic rhinosinusitis with nasal polyps',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Differential diagnoses',
    section: 'clinicalImpressionPlan', field: 'differentialDiagnosis',
    placeholder: 'List alternative diagnoses to consider…',
    rows: 2
  }));

  card.appendChild(radioGroup({
    label: 'Investigations required?',
    section: 'clinicalImpressionPlan', field: 'investigationsRequired', options: yesNo
  }));
  const inv = document.createElement('div');
  inv.dataset.conditional = 'clinicalImpressionPlan.investigationsRequired=yes';
  inv.appendChild(textArea({
    label: 'Investigations details',
    section: 'clinicalImpressionPlan', field: 'investigationsDetails',
    placeholder: 'e.g. Pure-tone audiometry, nasendoscopy, CT sinuses, FNA…',
    rows: 2
  }));
  card.appendChild(inv);

  card.appendChild(radioGroup({
    label: 'Medication prescribed today?',
    section: 'clinicalImpressionPlan', field: 'medicationPrescribed', options: yesNo
  }));
  const meds = document.createElement('div');
  meds.dataset.conditional = 'clinicalImpressionPlan.medicationPrescribed=yes';
  meds.appendChild(textArea({
    label: 'Medication details',
    section: 'clinicalImpressionPlan', field: 'medicationDetails',
    placeholder: 'Drug, dose, route, duration…',
    rows: 2
  }));
  card.appendChild(meds);

  card.appendChild(radioGroup({
    label: 'Onward referral required?',
    section: 'clinicalImpressionPlan', field: 'referralRequired', options: yesNo
  }));
  const ref = document.createElement('div');
  ref.dataset.conditional = 'clinicalImpressionPlan.referralRequired=yes';
  ref.appendChild(textArea({
    label: 'Referral details',
    section: 'clinicalImpressionPlan', field: 'referralDetails',
    placeholder: 'Specialty, urgency, reason…',
    rows: 2
  }));
  card.appendChild(ref);

  card.appendChild(radioGroup({
    label: 'Surgery being considered?',
    section: 'clinicalImpressionPlan', field: 'surgeryConsidered', options: yesNo
  }));
  const surg = document.createElement('div');
  surg.dataset.conditional = 'clinicalImpressionPlan.surgeryConsidered=yes';
  surg.appendChild(textArea({
    label: 'Surgery details',
    section: 'clinicalImpressionPlan', field: 'surgeryDetails',
    placeholder: 'Procedure, indication, timing…',
    rows: 2
  }));
  card.appendChild(surg);

  card.appendChild(textArea({
    label: 'Follow-up plan',
    section: 'clinicalImpressionPlan', field: 'followUpPlan',
    placeholder: 'When and where to be reviewed…',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Patient education / safety-net advice',
    section: 'clinicalImpressionPlan', field: 'patientEducation',
    placeholder: 'What the patient should look out for and when to seek help…',
    rows: 2
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + live SNOT-22 readout
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, ...rest] = path.split('.');
    const current = getNested(section, rest.join('.'));
    host.style.display = String(current) === target ? '' : 'none';
  });
}

function renderSnot22Readout() {
  const { totalScore, severityLevel, answeredCount } = calculateSnot22(state);
  if (answeredCount === 0) {
    return `<div class="snot22-readout-empty"><span class="muted">SNOT-22: 0 of 22 items answered.</span></div>`;
  }
  return `
    <div class="snot22-readout-row">
      <span class="snot22-total ${severityClass(severityLevel)}">${totalScore} / 110</span>
      <span class="snot22-severity">${esc(severityLabel(severityLevel))}</span>
      <span class="muted">${answeredCount} of 22 items answered</span>
    </div>
  `;
}

function updateSnot22Readout() {
  const el = document.getElementById('snot22-readout');
  if (el) el.innerHTML = renderSnot22Readout();
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
  ['demographics', 'occupation'],
  // Presenting complaint (5)
  ['presentingComplaint', 'earSymptoms'],
  ['presentingComplaint', 'noseSymptoms'],
  ['presentingComplaint', 'throatSymptoms'],
  ['presentingComplaint', 'neckSymptoms'],
  ['presentingComplaint', 'chiefComplaint'],
  // History of present illness (5 core)
  ['historyOfPresentIllness', 'onsetDate'],
  ['historyOfPresentIllness', 'onsetType'],
  ['historyOfPresentIllness', 'progression'],
  ['historyOfPresentIllness', 'laterality'],
  ['historyOfPresentIllness', 'previousEpisodes'],
  // Past ENT history (10 yes/no)
  ['pastEntHistory', 'priorEntSurgery'],
  ['pastEntHistory', 'chronicSinusitis'],
  ['pastEntHistory', 'allergicRhinitis'],
  ['pastEntHistory', 'hearingLoss'],
  ['pastEntHistory', 'tinnitus'],
  ['pastEntHistory', 'vertigo'],
  ['pastEntHistory', 'hearingAids'],
  ['pastEntHistory', 'headNeckCancer'],
  ['pastEntHistory', 'headNeckRadiotherapy'],
  ['pastEntHistory', 'smoking'],
  ['pastEntHistory', 'alcohol'],
  // SNOT-22 (22 items)
  ...SNOT22_ITEMS.map((item) => ['snot22', item.key]),
  // External examination (3 yes/no)
  ['externalExamination', 'facialAsymmetry'],
  ['externalExamination', 'facialSwelling'],
  ['externalExamination', 'skinLesions'],
  // Otoscopy (per side)
  ['otoscopy', 'right.tympanicMembrane'],
  ['otoscopy', 'right.canal'],
  ['otoscopy', 'left.tympanicMembrane'],
  ['otoscopy', 'left.canal'],
  // Anterior rhinoscopy (per side)
  ['anteriorRhinoscopy', 'right.septum'],
  ['anteriorRhinoscopy', 'right.mucosa'],
  ['anteriorRhinoscopy', 'right.polyps'],
  ['anteriorRhinoscopy', 'right.discharge'],
  ['anteriorRhinoscopy', 'left.septum'],
  ['anteriorRhinoscopy', 'left.mucosa'],
  ['anteriorRhinoscopy', 'left.polyps'],
  ['anteriorRhinoscopy', 'left.discharge'],
  // Oropharyngeal & neck (6)
  ['oropharyngealNeckExamination', 'oralMucosa'],
  ['oropharyngealNeckExamination', 'tonsils'],
  ['oropharyngealNeckExamination', 'pharynx'],
  ['oropharyngealNeckExamination', 'cervicalLymphadenopathy'],
  ['oropharyngealNeckExamination', 'thyroidEnlarged'],
  ['oropharyngealNeckExamination', 'neckMass'],
  // Clinical impression (2)
  ['clinicalImpressionPlan', 'workingDiagnosis'],
  ['clinicalImpressionPlan', 'followUpPlan']
];

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = getNested(section, field);
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
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
    case 'urgent': return 'flag-urgent';
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

  const { totalScore, severityLevel, answeredCount, firedRules, additionalFlags, timestamp } = lastResult;

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
      <td>${esc(r.description)}</td>
      <td class="num">${r.score} / 5</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No SNOT-22 items answered.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Item</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Otolaryngology Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>SNOT-22 Total</h3>
      <p class="snot-summary">
        <span class="snot-score-badge ${severityClass(severityLevel)}">${totalScore} / 110</span>
        <span class="severity-level">${esc(severityLabel(severityLevel))}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of 22 SNOT-22 items answered.</p>

      <h3>Per-item scores</h3>
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
  const { totalScore, severityLevel, answeredCount, firedRules } = calculateSnot22(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    totalScore,
    severityLevel,
    answeredCount,
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
  updateSnot22Readout();
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
  updateConditionalSections();
  updateSnot22Readout();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
