// Framingham Risk Score for Hard CHD — patient/clinician wizard.
//
// Single-page continuous wizard: every section renders into the page in
// document order. The user scrolls through them; a sticky top progress
// bar reflects how many tracked fields are answered. Submission runs the
// pure scoring engine (Framingham Wilson 1998 hard-CHD model) and renders
// an inline report. State persists to localStorage so a partial fill
// survives a reload.
//
// Sibling files load as classic <script> tags (in order) and attach their
// exports to `window.FraminghamRiskScore`. We pull them off here to keep
// later code referring to short local names. Whole file is wrapped in an
// IIFE so its top-level identifiers don't leak.
(function () {
'use strict';

const NS = window.FraminghamRiskScore;
const {
  emptyAssessment,
  calculateBmi,
  riskLevelLabel,
  riskLevelClass,
  calculateRisk,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'framingham-risk-score-for-hard-coronary-heart-disease.front-end-form-with-html.v1';

/** Load persisted state and merge over a fresh empty assessment. */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
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

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
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
const TOTAL_STEPS = 10;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist. Re-runs progress,
 * conditional visibility, and any auto-calculated readouts.
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
  refreshReviewSummary();
}

/** Escape user-entered text for safe innerHTML rendering. */
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
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select-input">${optionsHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

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

function readOnlyReadout(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field readout';
  wrapper.innerHTML = `
    <label>${esc(opts.label)}</label>
    <div id="${opts.id}" class="readout-value">${opts.render()}</div>
  `;
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
      <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Section renderers (one per Svelte step)
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Information',
    description: 'Please provide patient identification details.'
  });

  const grid1 = document.createElement('div');
  grid1.className = 'two-col';
  grid1.appendChild(textInput({
    label: 'Full Name', section: 'patientInformation', field: 'fullName',
    placeholder: 'e.g. John Smith'
  }));
  grid1.appendChild(textInput({
    label: 'Date of Birth', section: 'patientInformation', field: 'dateOfBirth',
    type: 'date'
  }));
  card.appendChild(grid1);

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(textInput({
    label: 'NHS Number', section: 'patientInformation', field: 'nhsNumber',
    placeholder: 'e.g. 123 456 7890'
  }));
  grid2.appendChild(textInput({
    label: 'Telephone', section: 'patientInformation', field: 'telephone',
    placeholder: 'e.g. 07700 900000'
  }));
  card.appendChild(grid2);

  card.appendChild(textArea({
    label: 'Address', section: 'patientInformation', field: 'address',
    placeholder: 'Full postal address', rows: 2
  }));

  card.appendChild(textInput({
    label: 'Email', section: 'patientInformation', field: 'email',
    type: 'email', placeholder: 'e.g. patient@example.com'
  }));

  const grid3 = document.createElement('div');
  grid3.className = 'two-col';
  grid3.appendChild(textInput({
    label: 'GP Name', section: 'patientInformation', field: 'gpName',
    placeholder: 'e.g. Dr Jones'
  }));
  grid3.appendChild(textInput({
    label: 'GP Practice', section: 'patientInformation', field: 'gpPractice',
    placeholder: 'e.g. City Health Centre'
  }));
  card.appendChild(grid3);

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Demographics',
    description: 'Age and sex are required for the Framingham calculation. Valid age range: 30-79.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Age (years)', section: 'demographics', field: 'age',
    type: 'number', min: 1, max: 120, placeholder: 'e.g. 55', required: true
  }));
  grid.appendChild(radioGroup({
    label: 'Sex', section: 'demographics', field: 'sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ]
  }));
  card.appendChild(grid);

  card.appendChild(selectInput({
    label: 'Ethnicity', section: 'demographics', field: 'ethnicity',
    placeholder: '— Prefer not to say —',
    options: [
      { value: 'whitebritish', label: 'White - British' },
      { value: 'whiteother', label: 'White - Other' },
      { value: 'asian', label: 'Asian or Asian British' },
      { value: 'black', label: 'Black or Black British' },
      { value: 'mixed', label: 'Mixed / Multiple' },
      { value: 'other', label: 'Other' }
    ]
  }));

  const measurements = document.createElement('div');
  measurements.className = 'three-col';
  measurements.appendChild(textInput({
    label: 'Height', section: 'demographics', field: 'heightCm',
    type: 'number', min: 50, max: 250, step: 0.1, unit: 'cm',
    placeholder: 'e.g. 175'
  }));
  measurements.appendChild(textInput({
    label: 'Weight', section: 'demographics', field: 'weightKg',
    type: 'number', min: 20, max: 300, step: 0.1, unit: 'kg',
    placeholder: 'e.g. 80'
  }));
  measurements.appendChild(readOnlyReadout({
    label: 'BMI (auto)', id: 'bmi-readout',
    render: () => {
      const bmi = calculateBmi(state.demographics.heightCm, state.demographics.weightKg);
      if (bmi == null) return '<span class="muted">Auto-calculated</span>';
      return `<strong>${bmi}</strong>`;
    }
  }));
  card.appendChild(measurements);

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Smoking History',
    description: 'Smoking status is a key factor in the Framingham risk calculation.'
  });

  card.appendChild(radioGroup({
    label: 'Current Smoking Status',
    section: 'smokingHistory', field: 'smokingStatus',
    options: [
      { value: 'current', label: 'Current Smoker' },
      { value: 'former', label: 'Former Smoker' },
      { value: 'never', label: 'Never Smoked' }
    ]
  }));

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Cigarettes per Day (if applicable)',
    section: 'smokingHistory', field: 'cigarettesPerDay',
    type: 'number', min: 0, max: 100, placeholder: 'e.g. 20'
  }));
  grid.appendChild(textInput({
    label: 'Years Smoked',
    section: 'smokingHistory', field: 'yearsSmoked',
    type: 'number', min: 0, max: 100, placeholder: 'e.g. 15'
  }));
  card.appendChild(grid);

  // Years since quitting only relevant for former smokers.
  const sinceQuitHost = document.createElement('div');
  sinceQuitHost.dataset.conditional = 'smokingHistory.smokingStatus=former';
  sinceQuitHost.appendChild(textInput({
    label: 'Years Since Quitting',
    section: 'smokingHistory', field: 'yearsSinceQuit',
    type: 'number', min: 0, max: 100, placeholder: 'e.g. 5'
  }));
  card.appendChild(sinceQuitHost);

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Blood Pressure',
    description: 'Blood pressure and treatment status affect risk calculation. Treatment increases the BP coefficient.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Systolic BP', section: 'bloodPressure', field: 'systolicBp',
    type: 'number', min: 60, max: 300, step: 1, unit: 'mmHg',
    placeholder: 'e.g. 130'
  }));
  grid.appendChild(textInput({
    label: 'Diastolic BP', section: 'bloodPressure', field: 'diastolicBp',
    type: 'number', min: 30, max: 200, step: 1, unit: 'mmHg',
    placeholder: 'e.g. 85'
  }));
  card.appendChild(grid);

  card.appendChild(radioGroup({
    label: 'Currently on Blood Pressure Treatment?',
    section: 'bloodPressure', field: 'onBpTreatment',
    options: yesNo
  }));

  // Conditional medication name field, only when on BP treatment.
  const bpMedHost = document.createElement('div');
  bpMedHost.dataset.conditional = 'bloodPressure.onBpTreatment=yes';
  bpMedHost.appendChild(textInput({
    label: 'BP Medication Name',
    section: 'bloodPressure', field: 'bpMedicationName',
    placeholder: 'e.g. Amlodipine 5mg'
  }));
  card.appendChild(bpMedHost);

  card.appendChild(selectInput({
    label: 'Measurement Method', section: 'bloodPressure', field: 'bpMeasurementMethod',
    options: [
      { value: 'clinic', label: 'Clinic Reading' },
      { value: 'ambulatory', label: 'Ambulatory (24h)' },
      { value: 'home', label: 'Home Monitoring' }
    ]
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Cholesterol',
    description: 'Total cholesterol and HDL are required for the Framingham calculation. Values in mg/dL or mmol/L.'
  });

  card.appendChild(selectInput({
    label: 'Cholesterol Unit',
    section: 'cholesterol', field: 'cholesterolUnit',
    placeholder: 'mg/dL',
    options: [
      { value: 'mgDl', label: 'mg/dL' },
      { value: 'mmolL', label: 'mmol/L' }
    ]
  }));

  const grid1 = document.createElement('div');
  grid1.className = 'two-col';
  grid1.appendChild(textInput({
    label: 'Total Cholesterol', section: 'cholesterol', field: 'totalCholesterol',
    type: 'number', min: 0, step: 0.1, placeholder: 'e.g. 220'
  }));
  grid1.appendChild(textInput({
    label: 'HDL Cholesterol', section: 'cholesterol', field: 'hdlCholesterol',
    type: 'number', min: 0, step: 0.1, placeholder: 'e.g. 50'
  }));
  card.appendChild(grid1);

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(textInput({
    label: 'LDL Cholesterol (optional)', section: 'cholesterol', field: 'ldlCholesterol',
    type: 'number', min: 0, step: 0.1, placeholder: 'e.g. 140'
  }));
  grid2.appendChild(textInput({
    label: 'Triglycerides (optional)', section: 'cholesterol', field: 'triglycerides',
    type: 'number', min: 0, step: 0.1, placeholder: 'e.g. 150'
  }));
  card.appendChild(grid2);

  card.appendChild(radioGroup({
    label: 'Fasting Sample?',
    section: 'cholesterol', field: 'fastingSample',
    options: yesNo
  }));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Medical History',
    description: 'The Framingham Risk Score is designed for patients without diabetes or prior CHD. These conditions are flagged if present.'
  });

  card.appendChild(radioGroup({ label: 'Has Diabetes?', section: 'medicalHistory', field: 'hasDiabetes', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has Prior Coronary Heart Disease?', section: 'medicalHistory', field: 'hasPriorChd', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has Peripheral Vascular Disease?', section: 'medicalHistory', field: 'hasPeripheralVascularDisease', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has Cerebrovascular Disease?', section: 'medicalHistory', field: 'hasCerebrovascularDisease', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has Heart Failure?', section: 'medicalHistory', field: 'hasHeartFailure', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has Atrial Fibrillation?', section: 'medicalHistory', field: 'hasAtrialFibrillation', options: yesNo }));

  card.appendChild(textArea({
    label: 'Other Conditions', section: 'medicalHistory', field: 'otherConditions',
    placeholder: 'List any other relevant medical conditions', rows: 3
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Family History',
    description: 'Family history of premature CHD is an important risk modifier not captured in the core Framingham equation.'
  });

  card.appendChild(radioGroup({
    label: 'Family History of Coronary Heart Disease?',
    section: 'familyHistory', field: 'familyChdHistory',
    options: yesNo
  }));

  const detailsHost = document.createElement('div');
  detailsHost.dataset.conditional = 'familyHistory.familyChdHistory=yes';
  detailsHost.appendChild(selectInput({
    label: 'Age of Onset in Family Member',
    section: 'familyHistory', field: 'familyChdAgeOnset',
    options: [
      { value: 'under55', label: 'Under 55' },
      { value: '55to65', label: '55 - 65' },
      { value: 'over65', label: 'Over 65' }
    ]
  }));
  detailsHost.appendChild(textInput({
    label: 'Relationship to Patient',
    section: 'familyHistory', field: 'familyChdRelationship',
    placeholder: 'e.g. Father, Mother, Sibling'
  }));
  card.appendChild(detailsHost);

  card.appendChild(radioGroup({
    label: 'Family History of Stroke?',
    section: 'familyHistory', field: 'familyStrokeHistory',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Family History of Diabetes?',
    section: 'familyHistory', field: 'familyDiabetesHistory',
    options: yesNo
  }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Lifestyle Factors',
    description: 'Lifestyle factors provide additional context for clinical decision-making beyond the core risk score.'
  });

  const grid1 = document.createElement('div');
  grid1.className = 'two-col';
  grid1.appendChild(selectInput({
    label: 'Physical Activity Level',
    section: 'lifestyleFactors', field: 'physicalActivity',
    options: [
      { value: 'sedentary', label: 'Sedentary' },
      { value: 'light', label: 'Light' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'vigorous', label: 'Vigorous' }
    ]
  }));
  grid1.appendChild(selectInput({
    label: 'Alcohol Consumption',
    section: 'lifestyleFactors', field: 'alcoholConsumption',
    options: [
      { value: 'none', label: 'None' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'heavy', label: 'Heavy' }
    ]
  }));
  card.appendChild(grid1);

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(selectInput({
    label: 'Diet Quality',
    section: 'lifestyleFactors', field: 'dietQuality',
    options: [
      { value: 'poor', label: 'Poor' },
      { value: 'average', label: 'Average' },
      { value: 'good', label: 'Good' },
      { value: 'excellent', label: 'Excellent' }
    ]
  }));
  grid2.appendChild(selectInput({
    label: 'Stress Level',
    section: 'lifestyleFactors', field: 'stressLevel',
    options: [
      { value: 'low', label: 'Low' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'high', label: 'High' }
    ]
  }));
  card.appendChild(grid2);

  const grid3 = document.createElement('div');
  grid3.className = 'two-col';
  grid3.appendChild(textInput({
    label: 'BMI (if known)', section: 'lifestyleFactors', field: 'bmi',
    type: 'number', min: 10, max: 80, step: 0.1, placeholder: 'e.g. 27.5'
  }));
  grid3.appendChild(textInput({
    label: 'Waist Circumference', section: 'lifestyleFactors', field: 'waistCircumferenceCm',
    type: 'number', min: 30, max: 250, step: 0.1, unit: 'cm',
    placeholder: 'e.g. 95'
  }));
  card.appendChild(grid3);

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Current Medications',
    description: 'Current medication use helps identify treatment gaps and informs clinical recommendations.'
  });

  card.appendChild(radioGroup({
    label: 'Currently on Statin Therapy?',
    section: 'currentMedications', field: 'onStatin',
    options: yesNo
  }));
  const statinHost = document.createElement('div');
  statinHost.dataset.conditional = 'currentMedications.onStatin=yes';
  statinHost.appendChild(textInput({
    label: 'Statin Name',
    section: 'currentMedications', field: 'statinName',
    placeholder: 'e.g. Atorvastatin 20mg'
  }));
  card.appendChild(statinHost);

  card.appendChild(radioGroup({
    label: 'Currently on Aspirin?',
    section: 'currentMedications', field: 'onAspirin',
    options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Currently on Antihypertensive?',
    section: 'currentMedications', field: 'onAntihypertensive',
    options: yesNo
  }));
  const antiHost = document.createElement('div');
  antiHost.dataset.conditional = 'currentMedications.onAntihypertensive=yes';
  antiHost.appendChild(textInput({
    label: 'Antihypertensive Name',
    section: 'currentMedications', field: 'antihypertensiveName',
    placeholder: 'e.g. Lisinopril 10mg'
  }));
  card.appendChild(antiHost);

  card.appendChild(textArea({
    label: 'Other Medications', section: 'currentMedications', field: 'otherMedications',
    placeholder: 'List any other current medications', rows: 3
  }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Review & Calculate',
    description: 'Review the assessment and provide clinician details before calculating the Framingham Risk Score.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Clinician Name', section: 'reviewCalculate', field: 'clinicianName',
    placeholder: 'e.g. Dr Smith'
  }));
  grid.appendChild(textInput({
    label: 'Review Date', section: 'reviewCalculate', field: 'reviewDate',
    type: 'date'
  }));
  card.appendChild(grid);

  card.appendChild(textArea({
    label: 'Clinical Notes', section: 'reviewCalculate', field: 'clinicalNotes',
    placeholder: 'Any additional clinical observations or notes', rows: 4
  }));

  card.appendChild(radioGroup({
    label: 'Patient Consent Obtained?',
    section: 'reviewCalculate', field: 'patientConsent',
    options: yesNo
  }));

  // Live key-inputs summary, mirrors Svelte review step.
  const summary = document.createElement('div');
  summary.className = 'summary-card';
  summary.id = 'review-summary';
  summary.innerHTML = renderReviewSummaryInner();
  card.appendChild(summary);

  return card;
}

function renderReviewSummaryInner() {
  const d = state;
  const row = (k, v) =>
    `<div><span class="summary-key">${esc(k)}:</span> ${esc(v ?? '') === '' ? 'Not set' : esc(v)}</div>`;
  return `
    <h3>Key Inputs Summary</h3>
    <div class="summary-grid">
      ${row('Age', d.demographics.age == null ? '' : String(d.demographics.age))}
      ${row('Sex', d.demographics.sex)}
      ${row('Smoking', d.smokingHistory.smokingStatus)}
      ${row('BP Treatment', d.bloodPressure.onBpTreatment)}
      ${row('Systolic BP', d.bloodPressure.systolicBp == null ? '' : String(d.bloodPressure.systolicBp))}
      ${row('Total Cholesterol', d.cholesterol.totalCholesterol == null ? '' : String(d.cholesterol.totalCholesterol))}
      ${row('HDL', d.cholesterol.hdlCholesterol == null ? '' : String(d.cholesterol.hdlCholesterol))}
      ${row('Diabetes', d.medicalHistory.hasDiabetes)}
    </div>
  `;
}

function refreshReviewSummary() {
  const host = document.getElementById('review-summary');
  if (host) host.innerHTML = renderReviewSummaryInner();
}

// ----------------------------------------------------------------------
// Conditional sections + auto-calculated readouts
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section]?.[field];
    host.style.display = String(current) === target ? '' : 'none';
  });
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
    const v = calculateBmi(state.demographics.heightCm, state.demographics.weightKg);
    bmi.innerHTML = v == null
      ? '<span class="muted">Auto-calculated</span>'
      : `<strong>${v}</strong>`;
  }
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // 1 Patient information
  ['patientInformation', 'fullName'],
  ['patientInformation', 'dateOfBirth'],
  // 2 Demographics — required for calculation
  ['demographics', 'age'],
  ['demographics', 'sex'],
  ['demographics', 'heightCm'],
  ['demographics', 'weightKg'],
  // 3 Smoking
  ['smokingHistory', 'smokingStatus'],
  // 4 Blood pressure
  ['bloodPressure', 'systolicBp'],
  ['bloodPressure', 'diastolicBp'],
  ['bloodPressure', 'onBpTreatment'],
  // 5 Cholesterol
  ['cholesterol', 'totalCholesterol'],
  ['cholesterol', 'hdlCholesterol'],
  ['cholesterol', 'fastingSample'],
  // 6 Medical history
  ['medicalHistory', 'hasDiabetes'],
  ['medicalHistory', 'hasPriorChd'],
  ['medicalHistory', 'hasPeripheralVascularDisease'],
  ['medicalHistory', 'hasCerebrovascularDisease'],
  ['medicalHistory', 'hasHeartFailure'],
  ['medicalHistory', 'hasAtrialFibrillation'],
  // 7 Family history
  ['familyHistory', 'familyChdHistory'],
  ['familyHistory', 'familyStrokeHistory'],
  ['familyHistory', 'familyDiabetesHistory'],
  // 8 Lifestyle
  ['lifestyleFactors', 'physicalActivity'],
  ['lifestyleFactors', 'alcoholConsumption'],
  ['lifestyleFactors', 'dietQuality'],
  ['lifestyleFactors', 'stressLevel'],
  // 9 Medications
  ['currentMedications', 'onStatin'],
  ['currentMedications', 'onAspirin'],
  ['currentMedications', 'onAntihypertensive'],
  // 10 Review
  ['reviewCalculate', 'clinicianName'],
  ['reviewCalculate', 'reviewDate'],
  ['reviewCalculate', 'patientConsent']
];

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
  const fill = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (fill) fill.style.width = `${percent}%`;
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

function ruleLevelBadge(level) {
  switch (level) {
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return level;
  }
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    riskCategory,
    tenYearRiskPercent,
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
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${esc(ruleLevelBadge(r.riskLevel))}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No rules fired.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Level</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const isDraft = riskCategory === 'draft';
  const riskDisplay = isDraft
    ? '—'
    : `${tenYearRiskPercent.toFixed(1)}%`;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Framingham Risk Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>10-year Hard CHD Risk</h3>
      <p class="risk-summary">
        <span class="risk-score-badge ${riskLevelClass(riskCategory)}">${riskDisplay}</span>
        <span class="risk-level-label">${esc(riskLevelLabel(riskCategory))}</span>
      </p>
      ${isDraft
        ? '<p class="muted">Age and sex are required to calculate the Framingham score.</p>'
        : '<p class="muted">Categories: low &lt; 10%, intermediate 10-19.9%, high &ge; 20%.</p>'}

      <h3>Fired Rules</h3>
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
  const { riskCategory, tenYearRiskPercent, firedRules } = calculateRisk(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    riskCategory,
    tenYearRiskPercent,
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
  refreshAutoCalculatedReadouts();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
