// WHO Emergency First Aid Form — Community First Aid Responder wizard
// (vanilla JS, classic <script>).
//
// Single-page continuous wizard: every section is rendered in document
// order. Each CABCDE category (steps 5–10) pairs an Assessment block with
// an Intervention block; major bleeding (C) is intentionally placed before
// airway/breathing/circulation/disability/exposure as the catastrophic
// haemorrhage step. Submission runs the pure validator + flagged-issues
// engine and renders an inline report. State is persisted to localStorage
// so a partial fill survives a page reload.

(function () {
'use strict';
const {
  emptyAssessment,
  hasText,
  calculateAge,
  sectionLabel,
  priorityLabel,
  validateCfar,
  detectFlaggedIssues
} = window.WhoEmergencyFirstAidForm;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'who-emergency-first-aid-form.front-end-form-with-html.v1';

/** Deep-merge persisted state over a fresh empty assessment. */
function mergeDeep(target, source) {
  if (!source || typeof source !== 'object') return target;
  for (const key of Object.keys(target)) {
    const t = target[key];
    const s = source[key];
    if (
      t !== null &&
      typeof t === 'object' &&
      !Array.isArray(t) &&
      s !== null &&
      typeof s === 'object' &&
      !Array.isArray(s)
    ) {
      mergeDeep(t, s);
    } else if (s !== undefined) {
      target[key] = s;
    }
  }
  return target;
}

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    const fresh = emptyAssessment();
    mergeDeep(fresh, parsed);
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved WHO emergency first aid form; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save WHO emergency first aid form to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored WHO emergency first aid form.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {{ validation: any, flags: any[], timestamp: string } | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function getPath(path) {
  const parts = path.split('.');
  let cur = state;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setPath(path, value) {
  const parts = path.split('.');
  let cur = state;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
  saveState();
  renderForm();
  updateProgress();
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Field component builders
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getPath(opts.path) == null ? '' : getPath(opts.path);
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const placeholderAttr = opts.placeholder
    ? ` placeholder="${esc(opts.placeholder)}"`
    : '';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input id="${id}" name="${id}" type="${type}" class="text-input"
      value="${esc(value)}"${placeholderAttr}${opts.required ? ' required' : ''}>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    const parts = opts.path.split('.');
    let cur = state;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = input.value;
    if (opts.path === 'patientIdentification.dateOfBirth') {
      state.patientIdentification.age = calculateAge(input.value);
    }
    saveState();
    updateProgress();
    if (opts.path === 'patientIdentification.dateOfBirth') {
      const ageEl = document.getElementById('f-patientIdentification-age-display');
      if (ageEl) {
        const a = state.patientIdentification.age;
        ageEl.textContent = a == null ? '' : `${a} years`;
      }
    }
  });
  return wrapper;
}

function textArea(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getPath(opts.path) == null ? '' : getPath(opts.path);
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const placeholderAttr = opts.placeholder
    ? ` placeholder="${esc(opts.placeholder)}"`
    : '';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      class="text-area-input"${placeholderAttr}>${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    const parts = opts.path.split('.');
    let cur = state;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = ta.value;
    saveState();
    updateProgress();
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `f-${opts.path.replace(/\./g, '-')}`;
  const current = getPath(opts.path);
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML = labelText;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const lab = document.createElement('label');
    lab.className = 'radio-option';
    lab.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    lab.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = lab.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setPath(opts.path, option.value);
    });
    list.appendChild(lab);
  }
  wrapper.appendChild(list);
  return wrapper;
}

function checkbox(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const checked = !!getPath(opts.path);
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox-field';
  wrapper.htmlFor = id;
  wrapper.innerHTML = `
    <input type="checkbox" id="${id}" name="${id}"${checked ? ' checked' : ''}>
    <span>${esc(opts.label)}</span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setPath(opts.path, input.checked);
  });
  return wrapper;
}

function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card' + (opts.extraClass ? ' ' + opts.extraClass : '');
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of 12</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

function twoCol(...children) {
  const grid = document.createElement('div');
  grid.className = 'two-col';
  for (const c of children) grid.appendChild(c);
  return grid;
}

function intervList(...children) {
  const grid = document.createElement('div');
  grid.className = 'intervention-list';
  for (const c of children) grid.appendChild(c);
  return grid;
}

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unknown', label: 'Unknown' }
];

const YES_NO_UNKNOWN = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Unknown' }
];

// ----------------------------------------------------------------------
// CABCDE block helpers
// ----------------------------------------------------------------------

/**
 * Build the assessment sub-block (Normal checkbox + findings textarea).
 * @param {{ key: string, normalLabel: string, findingsLabel: string,
 *           findingsPlaceholder?: string }} opts
 */
function assessmentBlock(opts) {
  const block = document.createElement('div');
  block.className = 'inset-block';
  const h = document.createElement('h4');
  h.textContent = 'Assessment';
  block.appendChild(h);
  block.appendChild(checkbox({
    label: opts.normalLabel,
    path: `${opts.key}.assessmentNormal`
  }));
  block.appendChild(textArea({
    label: opts.findingsLabel,
    path: `${opts.key}.assessmentFindings`,
    rows: 3,
    placeholder: opts.findingsPlaceholder
  }));
  return block;
}

/**
 * Build the intervention sub-block: list of intervention checkboxes.
 * @param {{ key: string, items: { label: string, prop: string }[] }} opts
 */
function interventionBlock(opts) {
  const block = document.createElement('div');
  block.className = 'inset-block';
  const h = document.createElement('h4');
  h.textContent = 'Intervention';
  block.appendChild(h);
  const list = document.createElement('div');
  list.className = 'intervention-list';
  for (const item of opts.items) {
    list.appendChild(checkbox({
      label: item.label,
      path: `${opts.key}.interventions.${item.prop}`
    }));
  }
  block.appendChild(list);
  return block;
}

// ----------------------------------------------------------------------
// Section renderers — one per step
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Identification',
    description: 'Name the patient and at least one contact person who can be reached on their behalf.'
  });
  card.appendChild(textInput({
    label: 'Patient name (LAST, First)',
    path: 'patientIdentification.patientName',
    placeholder: 'e.g. SMITH, John',
    required: true
  }));

  const dobField = textInput({
    label: 'Date of birth',
    path: 'patientIdentification.dateOfBirth',
    type: 'date'
  });
  // age display
  const ageWrap = document.createElement('div');
  ageWrap.className = 'field';
  const ageVal = state.patientIdentification.age == null
    ? ''
    : `${state.patientIdentification.age} years`;
  ageWrap.innerHTML = `
    <label>Calculated age</label>
    <div id="f-patientIdentification-age-display"
      class="text-input" style="background:#f3f4f6;">${esc(ageVal)}</div>
  `;
  card.appendChild(twoCol(dobField, ageWrap));

  card.appendChild(radioGroup({
    label: 'Sex',
    path: 'patientIdentification.sex',
    options: SEX_OPTIONS,
    required: true
  }));
  card.appendChild(textInput({
    label: 'Patient contact information (phone, address)',
    path: 'patientIdentification.patientContactInformation'
  }));

  const ecHeader = document.createElement('h3');
  ecHeader.className = 'subsection-title';
  ecHeader.textContent = 'Contact person';
  card.appendChild(ecHeader);

  card.appendChild(twoCol(
    textInput({
      label: 'Contact person name',
      path: 'patientIdentification.contactPerson.name'
    }),
    textInput({
      label: 'Contact person phone / details',
      path: 'patientIdentification.contactPerson.contactInformation'
    })
  ));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Referral & Transport',
    description: 'Identify the receiving facility and the ambulance / transport team, and record the times.'
  });

  const refHeader = document.createElement('h3');
  refHeader.className = 'subsection-title';
  refHeader.textContent = 'Referral facility';
  card.appendChild(refHeader);

  card.appendChild(textInput({
    label: 'Referral facility name',
    path: 'referralTransport.referralFacility.name',
    required: true
  }));
  card.appendChild(twoCol(
    textInput({
      label: 'Focal point (contact person)',
      path: 'referralTransport.referralFacility.focalPoint'
    }),
    textInput({
      label: 'Phone number',
      path: 'referralTransport.referralFacility.phoneNumber',
      type: 'tel'
    })
  ));

  const ambHeader = document.createElement('h3');
  ambHeader.className = 'subsection-title';
  ambHeader.textContent = 'Ambulance service';
  card.appendChild(ambHeader);

  card.appendChild(textInput({
    label: 'Ambulance service / vehicle',
    path: 'referralTransport.ambulance.name'
  }));
  card.appendChild(twoCol(
    textInput({
      label: 'Focal point',
      path: 'referralTransport.ambulance.focalPoint'
    }),
    textInput({
      label: 'Phone number',
      path: 'referralTransport.ambulance.phoneNumber',
      type: 'tel'
    })
  ));

  const timeHeader = document.createElement('h3');
  timeHeader.className = 'subsection-title';
  timeHeader.textContent = 'Times';
  card.appendChild(timeHeader);

  card.appendChild(twoCol(
    textInput({
      label: 'Date/time of event',
      path: 'referralTransport.eventDateTime',
      type: 'datetime-local',
      required: true
    }),
    textInput({
      label: 'Date/time of departure from scene',
      path: 'referralTransport.departureDateTime',
      type: 'datetime-local',
      required: true
    })
  ));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Situation',
    description: 'Briefly describe what happened. Tick whether the problem is medical, trauma, or both.'
  });

  const typeHeader = document.createElement('h3');
  typeHeader.className = 'subsection-title';
  typeHeader.textContent = 'Problem type';
  card.appendChild(typeHeader);

  const typeNote = document.createElement('p');
  typeNote.className = 'subsection-note';
  typeNote.innerHTML = 'At least one of Medical or Trauma must be selected. <span class="req" aria-hidden="true">*</span>';
  card.appendChild(typeNote);

  const list = document.createElement('div');
  list.className = 'intervention-list';
  list.appendChild(checkbox({ label: 'Medical', path: 'situation.medical' }));
  list.appendChild(checkbox({ label: 'Trauma', path: 'situation.trauma' }));
  card.appendChild(list);

  card.appendChild(radioGroup({
    label: 'Pregnant?',
    path: 'situation.pregnant',
    options: YES_NO_UNKNOWN,
    required: true
  }));
  card.appendChild(textArea({
    label: 'What happened to the patient?',
    path: 'situation.whatHappened',
    rows: 4,
    required: true,
    placeholder: 'e.g. Fall from 2-metre ladder onto concrete; LOC unclear; complained of right hip pain.'
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Background',
    description: 'Briefly note past medical/surgical history and current medications or allergies. Write "None" if there is nothing relevant to record.'
  });
  card.appendChild(textArea({
    label: 'Past medical and surgical history',
    path: 'background.pastMedicalAndSurgicalHistory',
    rows: 3,
    required: true,
    placeholder: 'e.g. Hypertension, appendectomy 2018'
  }));
  card.appendChild(textArea({
    label: 'Current medications or allergies',
    path: 'background.currentMedicationsOrAllergies',
    rows: 3,
    required: true,
    placeholder: 'e.g. Atenolol 50 mg daily; allergic to penicillin'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'C — Major Bleeding',
    description: 'Catastrophic haemorrhage assessment and intervention. Always assess major bleeding before airway/breathing.',
    extraClass: 'cabcde-major-bleeding'
  });

  card.appendChild(assessmentBlock({
    key: 'majorBleeding',
    normalLabel: 'Normal — no major bleeding observed',
    findingsLabel: 'Findings (describe location, severity, mechanism)',
    findingsPlaceholder: 'e.g. Pulsatile bleeding from right thigh wound, ~500 ml lost.'
  }));

  // Intervention block (with conditional tourniquet time)
  const interv = document.createElement('div');
  interv.className = 'inset-block';
  const h = document.createElement('h4');
  h.textContent = 'Intervention';
  interv.appendChild(h);

  const list = document.createElement('div');
  list.className = 'intervention-list';
  list.appendChild(checkbox({
    label: 'Direct Pressure',
    path: 'majorBleeding.interventions.directPressure'
  }));
  list.appendChild(checkbox({
    label: 'Deep Wound Packing',
    path: 'majorBleeding.interventions.deepWoundPacking'
  }));
  list.appendChild(checkbox({
    label: 'Tourniquet (ONLY if life-threatening bleeding)',
    path: 'majorBleeding.interventions.tourniquet'
  }));
  list.appendChild(checkbox({
    label: 'Uterine Massage',
    path: 'majorBleeding.interventions.uterineMassage'
  }));
  list.appendChild(checkbox({
    label: 'None',
    path: 'majorBleeding.interventions.none'
  }));
  interv.appendChild(list);

  if (state.majorBleeding.interventions.tourniquet) {
    const tWrap = document.createElement('div');
    tWrap.className = 'tourniquet-time-block';
    tWrap.appendChild(textInput({
      label: 'Time of tourniquet application',
      path: 'majorBleeding.interventions.tourniquetApplicationTime',
      type: 'time',
      required: true
    }));
    interv.appendChild(tWrap);
  }
  card.appendChild(interv);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'A — Airway',
    description: 'Airway assessment and intervention.',
    extraClass: 'cabcde-airway'
  });
  card.appendChild(assessmentBlock({
    key: 'airway',
    normalLabel: 'Normal — airway patent',
    findingsLabel: 'Findings (e.g. obstruction, gurgling, stridor)',
    findingsPlaceholder: 'Describe airway compromise.'
  }));
  card.appendChild(interventionBlock({
    key: 'airway',
    items: [
      { prop: 'neckImmobilization', label: 'Neck Immobilization' },
      { prop: 'headTiltChinLift', label: 'Head-Tilt Chin-Lift' },
      { prop: 'jawThrust', label: 'Jaw Thrust' },
      { prop: 'chokingCare', label: 'Choking Care' },
      { prop: 'none', label: 'None' }
    ]
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'B — Breathing',
    description: 'Breathing assessment and intervention.',
    extraClass: 'cabcde-breathing'
  });
  card.appendChild(assessmentBlock({
    key: 'breathing',
    normalLabel: 'Normal — adequate spontaneous breathing',
    findingsLabel: 'Findings (rate, effort, symmetry)',
    findingsPlaceholder: 'e.g. RR 32, accessory muscle use, no air entry on right.'
  }));
  card.appendChild(interventionBlock({
    key: 'breathing',
    items: [
      { prop: 'maintainedPositionOfComfort', label: 'Maintained position of patient comfort' },
      { prop: 'none', label: 'None' }
    ]
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'C — Circulation',
    description: 'Circulation assessment and intervention.',
    extraClass: 'cabcde-circulation'
  });
  card.appendChild(assessmentBlock({
    key: 'circulation',
    normalLabel: 'Normal — perfusion adequate',
    findingsLabel: 'Findings (pulse, skin colour, capillary refill, hydration)',
    findingsPlaceholder: 'e.g. Weak rapid radial pulse, cool clammy skin, CR > 3 s.'
  }));
  card.appendChild(interventionBlock({
    key: 'circulation',
    items: [
      { prop: 'pelvicBinder', label: 'Pelvic Binder' },
      { prop: 'controlMinorBleeding', label: 'Control minor bleeding' },
      { prop: 'fractureCare', label: 'Fracture Care' },
      { prop: 'oralHydration', label: 'Oral Hydration' },
      { prop: 'leftLateralPosition', label: 'Left-lateral position' },
      { prop: 'none', label: 'None' }
    ]
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'D — Disability (neurologic)',
    description: 'Disability assessment and intervention.',
    extraClass: 'cabcde-disability'
  });
  card.appendChild(assessmentBlock({
    key: 'disability',
    normalLabel: 'Normal — alert, oriented, no deficit',
    findingsLabel: 'Findings (AVPU, GCS, focal deficits, glucose if known)',
    findingsPlaceholder: 'e.g. Responds to pain only; right-sided weakness.'
  }));
  card.appendChild(interventionBlock({
    key: 'disability',
    items: [
      { prop: 'spinalImmobilisation', label: 'Spinal Immobilisation' },
      { prop: 'glucoseGiven', label: 'Glucose Given' },
      { prop: 'seizureCare', label: 'Seizure Care' },
      { prop: 'highTemperatureCare', label: 'High Temperature Care' },
      { prop: 'lowTemperatureCare', label: 'Low Temperature Care' },
      { prop: 'none', label: 'None' }
    ]
  }));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'E — Exposure / Other',
    description: 'Exposure assessment, intervention, and any medication taken by the patient.',
    extraClass: 'cabcde-exposure'
  });
  card.appendChild(assessmentBlock({
    key: 'exposure',
    normalLabel: 'Normal — no exposure-related findings',
    findingsLabel: 'Findings (e.g. burns, environmental exposure, wounds, bite)',
    findingsPlaceholder: 'Describe exposure-related findings.'
  }));
  card.appendChild(interventionBlock({
    key: 'exposure',
    items: [
      { prop: 'recoveryPosition', label: 'Recovery Position' },
      { prop: 'burnCare', label: 'Burn Care' },
      { prop: 'woundCare', label: 'Wound Care' },
      { prop: 'drowningCare', label: 'Drowning Care' },
      { prop: 'snakebiteCare', label: 'Snakebite Care' },
      { prop: 'none', label: 'None' }
    ]
  }));

  const medHeader = document.createElement('h3');
  medHeader.className = 'subsection-title';
  medHeader.textContent = 'Any medication taken?';
  card.appendChild(medHeader);
  card.appendChild(checkbox({
    label: 'None',
    path: 'exposure.medicationTakenNone'
  }));
  card.appendChild(textArea({
    label: 'Describe medications taken (name, dose, time)',
    path: 'exposure.medicationTakenDetails',
    rows: 3,
    placeholder: 'e.g. Paracetamol 1 g 30 min ago.'
  }));
  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11,
    title: 'Recommendations',
    description: 'Transport plan, anticipated problems, and any precautions for the receiving facility.'
  });
  card.appendChild(textArea({
    label: 'Next steps in the transport plan',
    path: 'recommendations.transportPlan',
    rows: 3,
    required: true,
    placeholder: 'e.g. Continue manual airway support; transport supine, head-up 30°; reassess every 5 min.'
  }));
  card.appendChild(textArea({
    label: 'Problems anticipated during transport',
    path: 'recommendations.problemsAnticipated',
    rows: 3,
    placeholder: 'Anticipated complications and how to recognise/manage them.'
  }));
  card.appendChild(textArea({
    label: 'Other concerns',
    path: 'recommendations.otherConcerns',
    rows: 2,
    placeholder: 'Any other handover information.'
  }));

  const precHeader = document.createElement('h3');
  precHeader.className = 'subsection-title';
  precHeader.textContent = 'Precautions';
  card.appendChild(precHeader);

  const precNote = document.createElement('p');
  precNote.className = 'subsection-note';
  precNote.textContent = 'Tick any precautions that apply during transport and on arrival.';
  card.appendChild(precNote);

  const precWrap = document.createElement('div');
  precWrap.className = 'precaution-list';
  precWrap.appendChild(checkbox({
    label: 'Highly infectious disease',
    path: 'recommendations.precautions.highlyInfectiousDisease'
  }));
  precWrap.appendChild(checkbox({
    label: 'Spinal immobilization',
    path: 'recommendations.precautions.spinalImmobilization'
  }));
  precWrap.appendChild(checkbox({
    label: 'Possible fracture',
    path: 'recommendations.precautions.possibleFracture'
  }));
  precWrap.appendChild(checkbox({
    label: 'Fall risk',
    path: 'recommendations.precautions.fallRisk'
  }));
  precWrap.appendChild(checkbox({
    label: 'Altered mental status',
    path: 'recommendations.precautions.alteredMentalStatus'
  }));
  precWrap.appendChild(checkbox({
    label: 'Other',
    path: 'recommendations.precautions.other'
  }));
  card.appendChild(precWrap);

  if (state.recommendations.precautions.other) {
    card.appendChild(textArea({
      label: 'Describe how the "Other" precaution applies',
      path: 'recommendations.precautions.otherDetails',
      rows: 2,
      required: true
    }));
  }
  return card;
}

function renderStep12() {
  const card = sectionCard({
    stepNumber: 12,
    title: 'Responder Details (CFAR)',
    description: 'The Community First Aid Responder completes this section so the receiving team can follow up.'
  });
  card.appendChild(textInput({
    label: 'Responder name',
    path: 'responderDetails.name',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Signature (typed full name)',
    path: 'responderDetails.signature',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Contact information (phone / radio)',
    path: 'responderDetails.contactInformation',
    required: true
  }));
  card.appendChild(textInput({
    label: 'CFAR organization',
    path: 'responderDetails.cfarOrganization',
    required: true,
    placeholder: 'e.g. Red Crescent — District 4 team'
  }));
  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

function updateProgress() {
  const result = validateCfar(state);
  const total = result.totalRequired;
  const answered = result.totalSatisfied;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) {
    text.textContent =
      `${answered} of ${total} required fields answered (${percent}%)`;
  }
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
  const { validation, flags, timestamp } = lastResult;
  const out = document.getElementById('report');
  if (!out) return;

  const completenessBadge = validation.complete
    ? '<span class="completeness-badge complete">Complete</span>'
    : '<span class="completeness-badge incomplete">Incomplete</span>';

  const sectionRows = validation.sections.map((s) => {
    const missingItems = s.missing.length === 0
      ? '<span class="muted">All required fields completed.</span>'
      : `<ul class="missing-list">${s.missing.map(
          (m) => `<li>${esc(m.id)} — ${esc(m.description)}</li>`
        ).join('')}</ul>`;
    return `
      <tr>
        <th scope="row">${esc(sectionLabel(s.section))}</th>
        <td>${s.satisfied} / ${s.required}</td>
        <td>${missingItems}</td>
      </tr>
    `;
  }).join('');

  const flagsList = flags.length === 0
    ? '<p class="muted">No flagged issues raised.</p>'
    : `
      <ul class="flags">
        ${flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority).toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>WHO Emergency First Aid Form — submission report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="completeness">
        ${completenessBadge}
        <span>${validation.totalSatisfied} of ${validation.totalRequired} required fields answered.</span>
      </div>

      <h3>Section completeness</h3>
      <table class="sections-table">
        <thead>
          <tr>
            <th scope="col">Section</th>
            <th scope="col">Answered</th>
            <th scope="col">Missing items</th>
          </tr>
        </thead>
        <tbody>
          ${sectionRows}
        </tbody>
      </table>

      <h3>Flagged issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) startOverBtn.addEventListener('click', startOver);
}

function submitForm() {
  const validation = validateCfar(state);
  const flags = detectFlaggedIssues(state);
  lastResult = {
    validation,
    flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh WHO emergency first aid form?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  const out = document.getElementById('report');
  if (out) out.innerHTML = '';
  renderForm();
  updateProgress();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

const RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4,
  renderStep5, renderStep6, renderStep7, renderStep8,
  renderStep9, renderStep10, renderStep11, renderStep12
];

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  const scrollY = window.scrollY;
  host.innerHTML = '';
  for (const r of RENDERERS) host.appendChild(r());
  window.scrollTo({ top: scrollY });
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
