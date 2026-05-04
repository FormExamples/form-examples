// Pre-Operative Assessment by Patient - patient wizard (vanilla JS, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure ASA-grading engine and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.PreOperativeAssessmentByPatient`. Pulling them off
// here keeps the rest of this file referring to short local names. Whole
// file is wrapped in an IIFE so its top-level identifiers don't leak to
// the global scope.
(function () {
'use strict';

const NS = window.PreOperativeAssessmentByPatient;
const {
  emptyAssessment,
  calculateBMI,
  bmiCategory,
  estimateMETs,
  calculateAge,
  asaGradeLabel,
  asaGradeClass,
  calculateASA,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'pre-operative-assessment-by-patient.front-end-form-with-html.v1';

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    // Merge over a fresh empty so any newly-added fields default correctly.
    const fresh = emptyAssessment();
    for (const key of Object.keys(fresh)) {
      const v = parsed ? parsed[key] : undefined;
      if (Array.isArray(fresh[key])) {
        if (Array.isArray(v)) fresh[key] = v.slice();
      } else if (v && typeof v === 'object') {
        fresh[key] = { ...fresh[key], ...v };
      }
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
 * Re-runs derived values (BMI, METs), progress, and conditional
 * visibility after each change.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  recomputeDerived();
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
  updatePregnancyStepVisibility();
}

/** Recompute auto-calculated values that depend on other fields. */
function recomputeDerived() {
  state.demographics.bmi = calculateBMI(
    state.demographics.weight,
    state.demographics.height
  );
  state.functionalCapacity.estimatedMETs = estimateMETs(
    state.functionalCapacity.exerciseTolerance
  );
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
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[],
 *           required?: boolean, placeholder?: string }} opts
 */
function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const placeholder = opts.placeholder || '— Select —';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">${esc(placeholder)}</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
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
 * Build a radio group.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.textContent = opts.label;
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

/** Yes / No radio shortcut. */
const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

function yesNoGroup(label, section, field) {
  return radioGroup({ label, section, field, options: yesNo });
}

/**
 * Read-only auto-calculated readout (e.g. BMI, METs).
 * @param {{ label: string, id: string, render: () => string }} opts
 */
function readOnlyReadout(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field readout';
  wrapper.innerHTML = `
    <label>${esc(opts.label)}</label>
    <div id="${opts.id}" class="readout-value">${opts.render()}</div>
  `;
  return wrapper;
}

/**
 * Build a section card.
 * @param {{ stepNumber: number, totalSteps: number, title: string, description?: string }} opts
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
      <span class="section-step">Section ${opts.stepNumber} of ${opts.totalSteps}</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/**
 * Conditional sub-block: hidden unless `state[section][field]` matches one
 * of the supplied target values. Re-evaluated in `updateConditionalSections`.
 *
 * @param {{ section: string, field: string, equals: string | string[] }} opts
 */
function conditionalBlock(opts) {
  const block = document.createElement('div');
  const targets = Array.isArray(opts.equals) ? opts.equals : [opts.equals];
  block.dataset.conditionalAny = `${opts.section}.${opts.field}=${targets.join(',')}`;
  return block;
}

// ----------------------------------------------------------------------
// Repeating-list editors (medications, allergies)
// ----------------------------------------------------------------------

/** Editor for the top-level `medications` array. */
function medicationListEditor() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = state.medications;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent =
        'No medications added. Add a medication, or skip this section if you take none.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row med-row';
      r.innerHTML = `
        <div class="list-grid med-grid">
          <label class="list-cell">
            <span>Name</span>
            <input type="text" class="text-input" data-key="name" value="${esc(row.name)}" placeholder="e.g. Atenolol">
          </label>
          <label class="list-cell">
            <span>Dose</span>
            <input type="text" class="text-input" data-key="dose" value="${esc(row.dose)}" placeholder="e.g. 50 mg">
          </label>
          <label class="list-cell">
            <span>Frequency</span>
            <input type="text" class="text-input" data-key="frequency" value="${esc(row.frequency)}" placeholder="e.g. OD, BD">
          </label>
          <button type="button" class="btn btn-icon" aria-label="Remove medication">&times;</button>
        </div>
      `;
      r.querySelectorAll('input').forEach((inp) => {
        inp.addEventListener('input', () => {
          const k = inp.dataset.key;
          rows[idx][k] = inp.value;
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
    addBtn.className = 'btn btn-add';
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

/** Editor for the top-level `allergies` array. */
function allergyListEditor() {
  const wrapper = document.createElement('div');
  wrapper.className = 'list-editor';

  function rerender() {
    const rows = state.allergies;
    wrapper.innerHTML = '';
    if (!rows.length) {
      const empty = document.createElement('p');
      empty.className = 'list-empty';
      empty.textContent =
        'No allergies added. Add an allergy, or skip this section if you have none.';
      wrapper.appendChild(empty);
    }
    rows.forEach((row, idx) => {
      const r = document.createElement('div');
      r.className = 'list-row allergy-row';
      r.innerHTML = `
        <div class="list-grid allergy-grid">
          <label class="list-cell">
            <span>Drug / allergen</span>
            <input type="text" class="text-input" data-key="allergen" value="${esc(row.allergen)}" placeholder="e.g. Penicillin">
          </label>
          <label class="list-cell">
            <span>Reaction</span>
            <input type="text" class="text-input" data-key="reaction" value="${esc(row.reaction)}" placeholder="e.g. Rash, swelling">
          </label>
          <label class="list-cell">
            <span>Severity</span>
            <select class="select-input" data-key="severity">
              <option value="">— Select —</option>
              <option value="mild"${row.severity === 'mild' ? ' selected' : ''}>Mild</option>
              <option value="moderate"${row.severity === 'moderate' ? ' selected' : ''}>Moderate</option>
              <option value="anaphylaxis"${row.severity === 'anaphylaxis' ? ' selected' : ''}>Anaphylaxis</option>
            </select>
          </label>
          <button type="button" class="btn btn-icon" aria-label="Remove allergy">&times;</button>
        </div>
      `;
      r.querySelectorAll('input, select').forEach((inp) => {
        const handler = () => {
          rows[idx][inp.dataset.key] = inp.value;
          saveState(state);
          updateProgress();
        };
        inp.addEventListener('input', handler);
        inp.addEventListener('change', handler);
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
    addBtn.className = 'btn btn-add';
    addBtn.textContent = '+ Add allergy';
    addBtn.addEventListener('click', () => {
      rows.push({ allergen: '', reaction: '', severity: '' });
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
// Section renderers (1 per ASA step)
// ----------------------------------------------------------------------

const TOTAL_STEPS = 16;

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1, totalSteps: TOTAL_STEPS,
    title: 'Demographics',
    description: 'Basic patient information and the planned procedure.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'demographics', field: 'firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last name', section: 'demographics', field: 'lastName', required: true }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of birth',
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
    ]
  }));

  const measurements = document.createElement('div');
  measurements.className = 'three-col';
  measurements.appendChild(textInput({
    label: 'Weight', section: 'demographics', field: 'weight',
    type: 'number', min: 1, max: 400, unit: 'kg', required: true
  }));
  measurements.appendChild(textInput({
    label: 'Height', section: 'demographics', field: 'height',
    type: 'number', min: 50, max: 250, unit: 'cm', required: true
  }));
  measurements.appendChild(readOnlyReadout({
    label: 'BMI',
    id: 'bmi-readout',
    render: () => {
      const bmi = state.demographics.bmi;
      if (bmi == null) return '<span class="muted">Auto-calculated</span>';
      return `<strong>${bmi}</strong> <span class="muted">(${esc(bmiCategory(bmi))})</span>`;
    }
  }));
  card.appendChild(measurements);

  card.appendChild(textInput({
    label: 'Planned procedure',
    section: 'demographics', field: 'plannedProcedure',
    placeholder: 'e.g. Right total knee replacement',
    required: true
  }));
  card.appendChild(selectInput({
    label: 'Procedure urgency',
    section: 'demographics', field: 'procedureUrgency',
    required: true,
    options: [
      { value: 'elective', label: 'Elective' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'emergency', label: 'Emergency' }
    ]
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2, totalSteps: TOTAL_STEPS,
    title: 'Cardiovascular',
    description: 'Heart and blood-vessel conditions.'
  });

  card.appendChild(yesNoGroup('Hypertension (high blood pressure)?', 'cardiovascular', 'hypertension'));
  const htnDetails = conditionalBlock({ section: 'cardiovascular', field: 'hypertension', equals: 'yes' });
  htnDetails.appendChild(yesNoGroup('Is it controlled with medication?', 'cardiovascular', 'hypertensionControlled'));
  card.appendChild(htnDetails);

  card.appendChild(yesNoGroup('Ischaemic heart disease?', 'cardiovascular', 'ischemicHeartDisease'));
  const ihdDetails = conditionalBlock({ section: 'cardiovascular', field: 'ischemicHeartDisease', equals: 'yes' });
  ihdDetails.appendChild(textInput({ label: 'Details', section: 'cardiovascular', field: 'ihdDetails' }));
  card.appendChild(ihdDetails);

  card.appendChild(yesNoGroup('Heart failure?', 'cardiovascular', 'heartFailure'));
  const hfDetails = conditionalBlock({ section: 'cardiovascular', field: 'heartFailure', equals: 'yes' });
  hfDetails.appendChild(selectInput({
    label: 'NYHA Class',
    section: 'cardiovascular', field: 'heartFailureNYHA',
    options: [
      { value: '1', label: 'Class I — No limitation' },
      { value: '2', label: 'Class II — Mild limitation' },
      { value: '3', label: 'Class III — Marked limitation' },
      { value: '4', label: 'Class IV — Severe limitation' }
    ]
  }));
  card.appendChild(hfDetails);

  card.appendChild(yesNoGroup('Valvular heart disease?', 'cardiovascular', 'valvularDisease'));
  const valvDetails = conditionalBlock({ section: 'cardiovascular', field: 'valvularDisease', equals: 'yes' });
  valvDetails.appendChild(textInput({ label: 'Details', section: 'cardiovascular', field: 'valvularDetails' }));
  card.appendChild(valvDetails);

  card.appendChild(yesNoGroup('Arrhythmia?', 'cardiovascular', 'arrhythmia'));
  const arrhDetails = conditionalBlock({ section: 'cardiovascular', field: 'arrhythmia', equals: 'yes' });
  arrhDetails.appendChild(textInput({ label: 'Type', section: 'cardiovascular', field: 'arrhythmiaType' }));
  card.appendChild(arrhDetails);

  card.appendChild(yesNoGroup('Pacemaker or ICD?', 'cardiovascular', 'pacemaker'));

  card.appendChild(yesNoGroup('Recent myocardial infarction (heart attack)?', 'cardiovascular', 'recentMI'));
  const miDetails = conditionalBlock({ section: 'cardiovascular', field: 'recentMI', equals: 'yes' });
  miDetails.appendChild(textInput({
    label: 'How many weeks ago?',
    section: 'cardiovascular', field: 'recentMIWeeks',
    type: 'number', min: 0, max: 26
  }));
  card.appendChild(miDetails);

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3, totalSteps: TOTAL_STEPS,
    title: 'Respiratory',
    description: 'Lung and airway conditions.'
  });

  card.appendChild(yesNoGroup('Asthma?', 'respiratory', 'asthma'));
  const asthmaDetails = conditionalBlock({ section: 'respiratory', field: 'asthma', equals: 'yes' });
  asthmaDetails.appendChild(selectInput({
    label: 'Asthma severity / frequency',
    section: 'respiratory', field: 'asthmaFrequency',
    options: [
      { value: 'intermittent', label: 'Intermittent' },
      { value: 'mild-persistent', label: 'Mild persistent' },
      { value: 'moderate-persistent', label: 'Moderate persistent' },
      { value: 'severe-persistent', label: 'Severe persistent' }
    ]
  }));
  card.appendChild(asthmaDetails);

  card.appendChild(yesNoGroup('COPD (chronic obstructive pulmonary disease)?', 'respiratory', 'copd'));
  const copdDetails = conditionalBlock({ section: 'respiratory', field: 'copd', equals: 'yes' });
  copdDetails.appendChild(selectInput({
    label: 'Severity',
    section: 'respiratory', field: 'copdSeverity',
    options: [
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));
  card.appendChild(copdDetails);

  card.appendChild(yesNoGroup('Obstructive sleep apnoea (OSA)?', 'respiratory', 'osa'));
  const osaDetails = conditionalBlock({ section: 'respiratory', field: 'osa', equals: 'yes' });
  osaDetails.appendChild(yesNoGroup('Do you use CPAP?', 'respiratory', 'osaCPAP'));
  card.appendChild(osaDetails);

  card.appendChild(radioGroup({
    label: 'Smoking status',
    section: 'respiratory', field: 'smoking',
    options: [
      { value: 'current', label: 'Current smoker' },
      { value: 'ex', label: 'Ex-smoker' },
      { value: 'never', label: 'Never smoked' }
    ]
  }));
  const packDetails = conditionalBlock({ section: 'respiratory', field: 'smoking', equals: ['current', 'ex'] });
  packDetails.appendChild(textInput({
    label: 'Pack-years',
    section: 'respiratory', field: 'smokingPackYears',
    type: 'number', min: 0, max: 200
  }));
  card.appendChild(packDetails);

  card.appendChild(yesNoGroup('Recent upper respiratory tract infection?', 'respiratory', 'recentURTI'));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4, totalSteps: TOTAL_STEPS,
    title: 'Renal',
    description: 'Kidney function.'
  });

  card.appendChild(yesNoGroup('Chronic kidney disease (CKD)?', 'renal', 'ckd'));
  const ckdDetails = conditionalBlock({ section: 'renal', field: 'ckd', equals: 'yes' });
  ckdDetails.appendChild(selectInput({
    label: 'CKD stage',
    section: 'renal', field: 'ckdStage',
    options: [
      { value: '1', label: 'Stage 1' },
      { value: '2', label: 'Stage 2' },
      { value: '3', label: 'Stage 3' },
      { value: '4', label: 'Stage 4' },
      { value: '5', label: 'Stage 5' }
    ]
  }));
  card.appendChild(ckdDetails);

  card.appendChild(yesNoGroup('On dialysis?', 'renal', 'dialysis'));
  const dialysisDetails = conditionalBlock({ section: 'renal', field: 'dialysis', equals: 'yes' });
  dialysisDetails.appendChild(selectInput({
    label: 'Dialysis type',
    section: 'renal', field: 'dialysisType',
    options: [
      { value: 'haemodialysis', label: 'Haemodialysis' },
      { value: 'peritoneal', label: 'Peritoneal dialysis' }
    ]
  }));
  card.appendChild(dialysisDetails);

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5, totalSteps: TOTAL_STEPS,
    title: 'Hepatic',
    description: 'Liver conditions.'
  });

  card.appendChild(yesNoGroup('Liver disease?', 'hepatic', 'liverDisease'));
  const liverDetails = conditionalBlock({ section: 'hepatic', field: 'liverDisease', equals: 'yes' });
  liverDetails.appendChild(yesNoGroup('Cirrhosis?', 'hepatic', 'cirrhosis'));
  card.appendChild(liverDetails);

  const cirrhosisDetails = conditionalBlock({ section: 'hepatic', field: 'cirrhosis', equals: 'yes' });
  cirrhosisDetails.appendChild(selectInput({
    label: 'Child-Pugh score',
    section: 'hepatic', field: 'childPughScore',
    options: [
      { value: 'A', label: 'A — Well compensated' },
      { value: 'B', label: 'B — Significant compromise' },
      { value: 'C', label: 'C — Decompensated' }
    ]
  }));
  card.appendChild(cirrhosisDetails);

  card.appendChild(yesNoGroup('Hepatitis?', 'hepatic', 'hepatitis'));
  const hepatitisDetails = conditionalBlock({ section: 'hepatic', field: 'hepatitis', equals: 'yes' });
  hepatitisDetails.appendChild(textInput({
    label: 'Hepatitis type', section: 'hepatic', field: 'hepatitisType',
    placeholder: 'e.g. Hepatitis B'
  }));
  card.appendChild(hepatitisDetails);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6, totalSteps: TOTAL_STEPS,
    title: 'Endocrine',
    description: 'Hormonal conditions including diabetes and thyroid.'
  });

  card.appendChild(selectInput({
    label: 'Diabetes',
    section: 'endocrine', field: 'diabetes',
    options: [
      { value: 'none', label: 'No' },
      { value: 'type1', label: 'Type 1' },
      { value: 'type2', label: 'Type 2' },
      { value: 'gestational', label: 'Gestational' }
    ]
  }));
  const diabetesDetails = conditionalBlock({
    section: 'endocrine', field: 'diabetes',
    equals: ['type1', 'type2', 'gestational']
  });
  diabetesDetails.appendChild(selectInput({
    label: 'Diabetes control',
    section: 'endocrine', field: 'diabetesControl',
    options: [
      { value: 'well-controlled', label: 'Well controlled' },
      { value: 'poorly-controlled', label: 'Poorly controlled' }
    ]
  }));
  diabetesDetails.appendChild(yesNoGroup('On insulin?', 'endocrine', 'diabetesOnInsulin'));
  card.appendChild(diabetesDetails);

  card.appendChild(yesNoGroup('Thyroid disease?', 'endocrine', 'thyroidDisease'));
  const thyroidDetails = conditionalBlock({ section: 'endocrine', field: 'thyroidDisease', equals: 'yes' });
  thyroidDetails.appendChild(selectInput({
    label: 'Type',
    section: 'endocrine', field: 'thyroidType',
    options: [
      { value: 'hypothyroid', label: 'Underactive (hypothyroid)' },
      { value: 'hyperthyroid', label: 'Overactive (hyperthyroid)' }
    ]
  }));
  card.appendChild(thyroidDetails);

  card.appendChild(yesNoGroup('Adrenal insufficiency?', 'endocrine', 'adrenalInsufficiency'));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7, totalSteps: TOTAL_STEPS,
    title: 'Neurological',
    description: 'Nervous system conditions.'
  });

  card.appendChild(yesNoGroup('Previous stroke or TIA?', 'neurological', 'strokeOrTIA'));
  const strokeDetails = conditionalBlock({ section: 'neurological', field: 'strokeOrTIA', equals: 'yes' });
  strokeDetails.appendChild(textInput({
    label: 'Details', section: 'neurological', field: 'strokeDetails'
  }));
  card.appendChild(strokeDetails);

  card.appendChild(yesNoGroup('Epilepsy?', 'neurological', 'epilepsy'));
  const epilepsyDetails = conditionalBlock({ section: 'neurological', field: 'epilepsy', equals: 'yes' });
  epilepsyDetails.appendChild(yesNoGroup('Is it well controlled?', 'neurological', 'epilepsyControlled'));
  card.appendChild(epilepsyDetails);

  card.appendChild(yesNoGroup('Neuromuscular disease?', 'neurological', 'neuromuscularDisease'));
  const nmDetails = conditionalBlock({ section: 'neurological', field: 'neuromuscularDisease', equals: 'yes' });
  nmDetails.appendChild(textInput({
    label: 'Details', section: 'neurological', field: 'neuromuscularDetails'
  }));
  card.appendChild(nmDetails);

  card.appendChild(yesNoGroup('Raised intracranial pressure?', 'neurological', 'raisedICP'));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8, totalSteps: TOTAL_STEPS,
    title: 'Haematological',
    description: 'Blood and clotting disorders.'
  });

  card.appendChild(yesNoGroup('Bleeding disorder?', 'haematological', 'bleedingDisorder'));
  const bleedDetails = conditionalBlock({ section: 'haematological', field: 'bleedingDisorder', equals: 'yes' });
  bleedDetails.appendChild(textInput({
    label: 'Details', section: 'haematological', field: 'bleedingDetails'
  }));
  card.appendChild(bleedDetails);

  card.appendChild(yesNoGroup('On anticoagulants (blood thinners)?', 'haematological', 'onAnticoagulants'));
  const anticoagDetails = conditionalBlock({ section: 'haematological', field: 'onAnticoagulants', equals: 'yes' });
  anticoagDetails.appendChild(textInput({
    label: 'Which anticoagulant?',
    section: 'haematological', field: 'anticoagulantType',
    placeholder: 'e.g. Warfarin, Rivaroxaban'
  }));
  card.appendChild(anticoagDetails);

  card.appendChild(yesNoGroup('Sickle cell disease?', 'haematological', 'sickleCellDisease'));
  const sickleTraitBlock = conditionalBlock({ section: 'haematological', field: 'sickleCellDisease', equals: 'no' });
  sickleTraitBlock.appendChild(yesNoGroup('Sickle cell trait?', 'haematological', 'sickleCellTrait'));
  card.appendChild(sickleTraitBlock);

  card.appendChild(yesNoGroup('Anaemia?', 'haematological', 'anaemia'));

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9, totalSteps: TOTAL_STEPS,
    title: 'Musculoskeletal & Airway',
    description: 'Joint, neck, mouth, and airway considerations.'
  });

  card.appendChild(yesNoGroup('Rheumatoid arthritis?', 'musculoskeletalAirway', 'rheumatoidArthritis'));
  card.appendChild(yesNoGroup('Cervical (neck) spine issues?', 'musculoskeletalAirway', 'cervicalSpineIssues'));
  card.appendChild(yesNoGroup('Limited neck movement?', 'musculoskeletalAirway', 'limitedNeckMovement'));
  card.appendChild(yesNoGroup('Limited mouth opening?', 'musculoskeletalAirway', 'limitedMouthOpening'));

  card.appendChild(yesNoGroup('Dental issues (loose teeth, crowns, bridges)?', 'musculoskeletalAirway', 'dentalIssues'));
  const dentalDetails = conditionalBlock({ section: 'musculoskeletalAirway', field: 'dentalIssues', equals: 'yes' });
  dentalDetails.appendChild(textInput({
    label: 'Details', section: 'musculoskeletalAirway', field: 'dentalDetails'
  }));
  card.appendChild(dentalDetails);

  card.appendChild(yesNoGroup('Previous difficult airway?', 'musculoskeletalAirway', 'previousDifficultAirway'));

  card.appendChild(selectInput({
    label: 'Mallampati score (if known)',
    section: 'musculoskeletalAirway', field: 'mallampatiScore',
    placeholder: 'Not assessed',
    options: [
      { value: '1', label: 'Class 1' },
      { value: '2', label: 'Class 2' },
      { value: '3', label: 'Class 3' },
      { value: '4', label: 'Class 4' }
    ]
  }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10, totalSteps: TOTAL_STEPS,
    title: 'Gastrointestinal',
    description: 'Stomach and reflux conditions affecting aspiration risk.'
  });

  card.appendChild(yesNoGroup('Gastro-oesophageal reflux (GORD)?', 'gastrointestinal', 'gord'));
  card.appendChild(yesNoGroup('Hiatus hernia?', 'gastrointestinal', 'hiatusHernia'));
  card.appendChild(yesNoGroup('Tendency to nausea or vomiting?', 'gastrointestinal', 'nausea'));

  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11, totalSteps: TOTAL_STEPS,
    title: 'Current Medications',
    description: 'List every medication you currently take. Skip if you take none.'
  });
  card.appendChild(medicationListEditor());
  return card;
}

function renderStep12() {
  const card = sectionCard({
    stepNumber: 12, totalSteps: TOTAL_STEPS,
    title: 'Allergies',
    description: 'List drug, food, and environmental allergies. Skip if you have none.'
  });
  card.appendChild(allergyListEditor());
  return card;
}

function renderStep13() {
  const card = sectionCard({
    stepNumber: 13, totalSteps: TOTAL_STEPS,
    title: 'Previous Anaesthesia',
    description: 'Previous experiences with anaesthesia and family history.'
  });

  card.appendChild(yesNoGroup('Have you had a general anaesthetic before?', 'previousAnaesthesia', 'previousAnaesthesia'));
  const prevDetails = conditionalBlock({ section: 'previousAnaesthesia', field: 'previousAnaesthesia', equals: 'yes' });
  prevDetails.appendChild(yesNoGroup('Any problems with anaesthesia?', 'previousAnaesthesia', 'anaesthesiaProblems'));
  card.appendChild(prevDetails);

  const problemDetails = conditionalBlock({ section: 'previousAnaesthesia', field: 'anaesthesiaProblems', equals: 'yes' });
  problemDetails.appendChild(textInput({
    label: 'Details',
    section: 'previousAnaesthesia', field: 'anaesthesiaProblemDetails'
  }));
  card.appendChild(problemDetails);

  card.appendChild(yesNoGroup('Family history of malignant hyperthermia?', 'previousAnaesthesia', 'familyMHHistory'));
  const mhDetails = conditionalBlock({ section: 'previousAnaesthesia', field: 'familyMHHistory', equals: 'yes' });
  mhDetails.appendChild(textInput({
    label: 'Details', section: 'previousAnaesthesia', field: 'familyMHDetails'
  }));
  card.appendChild(mhDetails);

  card.appendChild(yesNoGroup('History of post-operative nausea and vomiting (PONV)?', 'previousAnaesthesia', 'ponv'));

  return card;
}

function renderStep14() {
  const card = sectionCard({
    stepNumber: 14, totalSteps: TOTAL_STEPS,
    title: 'Social History',
    description: 'Alcohol and recreational drug use.'
  });

  card.appendChild(selectInput({
    label: 'Alcohol consumption',
    section: 'socialHistory', field: 'alcohol',
    options: [
      { value: 'none', label: 'None' },
      { value: 'occasional', label: 'Occasional (1-7 units/week)' },
      { value: 'moderate', label: 'Moderate (8-14 units/week)' },
      { value: 'heavy', label: 'Heavy (>14 units/week)' }
    ]
  }));
  const alcoholDetails = conditionalBlock({
    section: 'socialHistory', field: 'alcohol',
    equals: ['occasional', 'moderate', 'heavy']
  });
  alcoholDetails.appendChild(textInput({
    label: 'Units per week',
    section: 'socialHistory', field: 'alcoholUnitsPerWeek',
    type: 'number', min: 0, max: 200
  }));
  card.appendChild(alcoholDetails);

  card.appendChild(yesNoGroup('Recreational drug use?', 'socialHistory', 'recreationalDrugs'));
  const drugDetails = conditionalBlock({ section: 'socialHistory', field: 'recreationalDrugs', equals: 'yes' });
  drugDetails.appendChild(textInput({
    label: 'Details',
    section: 'socialHistory', field: 'drugDetails'
  }));
  card.appendChild(drugDetails);

  return card;
}

function renderStep15() {
  const card = sectionCard({
    stepNumber: 15, totalSteps: TOTAL_STEPS,
    title: 'Functional Capacity',
    description: 'How much physical activity you can perform without symptoms.'
  });

  card.appendChild(selectInput({
    label: 'Exercise tolerance',
    section: 'functionalCapacity', field: 'exerciseTolerance',
    options: [
      { value: 'unable', label: 'Unable to perform daily activities' },
      { value: 'light-housework', label: 'Light housework / walking around the house' },
      { value: 'climb-stairs', label: 'Climb a flight of stairs / walk uphill' },
      { value: 'moderate-exercise', label: 'Moderate exercise (jogging, cycling)' },
      { value: 'vigorous-exercise', label: 'Vigorous exercise (running, swimming laps)' }
    ]
  }));
  card.appendChild(readOnlyReadout({
    label: 'Estimated METs',
    id: 'mets-readout',
    render: () => {
      const v = state.functionalCapacity.estimatedMETs;
      if (v == null) return '<span class="muted">Auto-calculated</span>';
      return `<strong>${v}</strong> <span class="muted">METs</span>`;
    }
  }));

  card.appendChild(yesNoGroup('Do you use mobility aids?', 'functionalCapacity', 'mobilityAids'));
  card.appendChild(yesNoGroup('Recent decline in functional capacity?', 'functionalCapacity', 'recentDecline'));

  return card;
}

function renderStep16() {
  const card = sectionCard({
    stepNumber: 16, totalSteps: TOTAL_STEPS,
    title: 'Pregnancy',
    description: 'Pregnancy assessment (shown for female patients aged 12-55).'
  });
  card.id = 'step-16';

  card.appendChild(yesNoGroup('Could you be pregnant?', 'pregnancy', 'possiblyPregnant'));
  const pregDetails = conditionalBlock({ section: 'pregnancy', field: 'possiblyPregnant', equals: 'yes' });
  pregDetails.appendChild(yesNoGroup('Has pregnancy been confirmed?', 'pregnancy', 'pregnancyConfirmed'));
  card.appendChild(pregDetails);

  const gestationDetails = conditionalBlock({ section: 'pregnancy', field: 'pregnancyConfirmed', equals: 'yes' });
  gestationDetails.appendChild(textInput({
    label: 'Gestation (weeks)',
    section: 'pregnancy', field: 'gestationWeeks',
    type: 'number', min: 1, max: 42
  }));
  card.appendChild(gestationDetails);

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + auto-calculated readouts
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const [path, targetCsv] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String(state[section]?.[field] ?? '');
    const targets = targetCsv.split(',');
    host.style.display = targets.includes(current) ? '' : 'none';
  });
}

function refreshAutoCalculatedReadouts() {
  const bmi = document.getElementById('bmi-readout');
  if (bmi) {
    const v = state.demographics.bmi;
    bmi.innerHTML = v == null
      ? '<span class="muted">Auto-calculated</span>'
      : `<strong>${v}</strong> <span class="muted">(${esc(bmiCategory(v))})</span>`;
  }
  const mets = document.getElementById('mets-readout');
  if (mets) {
    const v = state.functionalCapacity.estimatedMETs;
    mets.innerHTML = v == null
      ? '<span class="muted">Auto-calculated</span>'
      : `<strong>${v}</strong> <span class="muted">METs</span>`;
  }
}

/**
 * Step 16 (Pregnancy) is conditional — only show for female patients aged
 * 12-55 (matches the SvelteKit `steps.ts` `shouldShow` logic). For everyone
 * else the section is hidden, mirroring the multi-step wizard's behaviour
 * within a single-page layout.
 */
function isPregnancyStepVisible() {
  if (state.demographics.sex !== 'female') return false;
  const age = calculateAge(state.demographics.dateOfBirth);
  if (age === null) return false;
  return age >= 12 && age <= 55;
}

function updatePregnancyStepVisibility() {
  const card = document.getElementById('step-16');
  if (!card) return;
  card.classList.toggle('section-hidden', !isPregnancyStepVisible());
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Demographics (8 core fields)
  ['demographics', 'firstName'],
  ['demographics', 'lastName'],
  ['demographics', 'dateOfBirth'],
  ['demographics', 'sex'],
  ['demographics', 'weight'],
  ['demographics', 'height'],
  ['demographics', 'plannedProcedure'],
  ['demographics', 'procedureUrgency'],
  // Cardiovascular yes/no items
  ['cardiovascular', 'hypertension'],
  ['cardiovascular', 'ischemicHeartDisease'],
  ['cardiovascular', 'heartFailure'],
  ['cardiovascular', 'valvularDisease'],
  ['cardiovascular', 'arrhythmia'],
  ['cardiovascular', 'pacemaker'],
  ['cardiovascular', 'recentMI'],
  // Respiratory
  ['respiratory', 'asthma'],
  ['respiratory', 'copd'],
  ['respiratory', 'osa'],
  ['respiratory', 'smoking'],
  ['respiratory', 'recentURTI'],
  // Renal
  ['renal', 'ckd'],
  ['renal', 'dialysis'],
  // Hepatic
  ['hepatic', 'liverDisease'],
  ['hepatic', 'hepatitis'],
  // Endocrine
  ['endocrine', 'diabetes'],
  ['endocrine', 'thyroidDisease'],
  ['endocrine', 'adrenalInsufficiency'],
  // Neurological
  ['neurological', 'strokeOrTIA'],
  ['neurological', 'epilepsy'],
  ['neurological', 'neuromuscularDisease'],
  ['neurological', 'raisedICP'],
  // Haematological
  ['haematological', 'bleedingDisorder'],
  ['haematological', 'onAnticoagulants'],
  ['haematological', 'sickleCellDisease'],
  ['haematological', 'anaemia'],
  // Musculoskeletal & Airway
  ['musculoskeletalAirway', 'rheumatoidArthritis'],
  ['musculoskeletalAirway', 'cervicalSpineIssues'],
  ['musculoskeletalAirway', 'limitedNeckMovement'],
  ['musculoskeletalAirway', 'limitedMouthOpening'],
  ['musculoskeletalAirway', 'dentalIssues'],
  ['musculoskeletalAirway', 'previousDifficultAirway'],
  // Gastrointestinal
  ['gastrointestinal', 'gord'],
  ['gastrointestinal', 'hiatusHernia'],
  ['gastrointestinal', 'nausea'],
  // Previous Anaesthesia
  ['previousAnaesthesia', 'previousAnaesthesia'],
  ['previousAnaesthesia', 'familyMHHistory'],
  ['previousAnaesthesia', 'ponv'],
  // Social
  ['socialHistory', 'alcohol'],
  ['socialHistory', 'recreationalDrugs'],
  // Functional capacity
  ['functionalCapacity', 'exerciseTolerance'],
  ['functionalCapacity', 'mobilityAids'],
  ['functionalCapacity', 'recentDecline']
];

function updateProgress() {
  const tracked = TRACKED_FIELDS.slice();
  if (isPregnancyStepVisible()) {
    tracked.push(['pregnancy', 'possiblyPregnant']);
  }
  let answered = 0;
  for (const [section, field] of tracked) {
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = tracked.length;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
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

  const { asaGrade, firedRules, additionalFlags, timestamp } = lastResult;

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

  const ruleRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.system)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">ASA ${r.grade}</td>
    </tr>
  `).join('');

  const ruleTable = firedRules.length === 0
    ? `<p class="muted">No ASA rules fired — patient defaults to ASA I (healthy).</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">System</th>
            <th scope="col">Condition</th>
            <th scope="col">Grade</th>
          </tr>
        </thead>
        <tbody>${ruleRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Pre-Operative Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>ASA Physical Status Grade</h3>
      <p class="asa-summary">
        <span class="asa-grade-badge ${asaGradeClass(asaGrade)}">ASA ${asaGrade}</span>
        <span class="grade-label">${esc(asaGradeLabel(asaGrade))}</span>
      </p>
      <p class="muted">Maximum-grade rule wins. ${firedRules.length} rule${firedRules.length === 1 ? '' : 's'} fired.</p>

      <h3>Fired ASA rules</h3>
      ${ruleTable}

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
  recomputeDerived();
  const { asaGrade, firedRules } = calculateASA(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    asaGrade,
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
  refreshAutoCalculatedReadouts();
  updatePregnancyStepVisibility();
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
  host.appendChild(renderStep11());
  host.appendChild(renderStep12());
  host.appendChild(renderStep13());
  host.appendChild(renderStep14());
  host.appendChild(renderStep15());
  host.appendChild(renderStep16());
}

function init() {
  recomputeDerived();
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
  updatePregnancyStepVisibility();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
