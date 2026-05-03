// WHO Emergency Unit Form: Trauma — patient/clinician wizard (vanilla
// JS, classic <script>). Single-page continuous wizard: every section
// is rendered into the page in document order. Conditional rules
// (time of death only when dead-on-arrival; spine stabilisation /
// GCS only for RED triage; road-traffic mechanism details only when
// RTI is ticked; with-life-vest only when drowning; FAST side
// indicator only for matching chest finding; admit ward / transfer
// destination / cause of death by disposition) are gated by the
// validator's applies() so the report only counts a rule when its
// branch is active. Submission runs the pure validator + flagged-
// issues engine and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload.

(function () {
'use strict';
const {
  emptyAssessment,
  hasNumber,
  sectionLabel,
  priorityLabel,
  validateEuTrauma,
  detectFlaggedIssues
} = window.WhoEmergencyUnitTraumaForm;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'who-emergency-unit-trauma-form.front-end-form-with-html.v1';

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
    } else if (Array.isArray(t) && Array.isArray(s)) {
      // Arrays: replace items in place up to target length, deep-merging objects.
      for (let i = 0; i < t.length; i++) {
        if (s[i] !== undefined) {
          if (
            t[i] !== null &&
            typeof t[i] === 'object' &&
            s[i] !== null &&
            typeof s[i] === 'object'
          ) {
            mergeDeep(t[i], s[i]);
          } else {
            t[i] = s[i];
          }
        }
      }
    } else if (s !== undefined) {
      target[key] = s;
    }
  }
  return target;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    const fresh = emptyAssessment();
    mergeDeep(fresh, parsed);
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved WHO emergency unit (trauma) form; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save WHO emergency unit (trauma) form to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored WHO emergency unit (trauma) form.', e);
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

/** Resolve a dotted path on state. Supports numeric segments for arrays. */
function getPath(path) {
  const parts = path.split('.');
  let cur = state;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Set a dotted path on state, persist, and re-render the form. */
function setPath(path, value) {
  const parts = path.split('.');
  let cur = state;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  saveState();
  renderForm();
  updateProgress();
}

/** Escape user-entered text for safe rendering. */
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
  const placeholderAttr = opts.placeholder ? ` placeholder="${esc(opts.placeholder)}"` : '';
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
    saveState();
    updateProgress();
  });
  return wrapper;
}

function numberInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const raw = getPath(opts.path);
  const value = hasNumber(raw) ? String(raw) : '';
  const labelText =
    esc(opts.label) +
    (opts.unit ? ` <span class="unit">${esc(opts.unit)}</span>` : '') +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const minAttr = opts.min !== undefined ? ` min="${opts.min}"` : '';
  const maxAttr = opts.max !== undefined ? ` max="${opts.max}"` : '';
  const stepAttr = opts.step !== undefined ? ` step="${opts.step}"` : '';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input id="${id}" name="${id}" type="number" class="text-input"
      value="${esc(value)}"${minAttr}${maxAttr}${stepAttr} inputmode="decimal">
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    const parts = opts.path.split('.');
    let cur = state;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    const txt = input.value.trim();
    if (txt === '') {
      cur[parts[parts.length - 1]] = null;
    } else {
      const n = Number(txt);
      cur[parts[parts.length - 1]] = Number.isFinite(n) ? n : null;
    }
    saveState();
    updateProgress();
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
  const placeholderAttr = opts.placeholder ? ` placeholder="${esc(opts.placeholder)}"` : '';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      class="textarea"${placeholderAttr}>${esc(value)}</textarea>
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

function selectInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const current = getPath(opts.path) == null ? '' : getPath(opts.path);
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const optionHtml = ['<option value="">— Select —</option>']
    .concat(opts.options.map((o) => {
      const sel = current === o.value ? ' selected' : '';
      return `<option value="${esc(o.value)}"${sel}>${esc(o.label)}</option>`;
    }))
    .join('');
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select-input">${optionHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setPath(opts.path, sel.value));
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
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of 17</span>
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

function fourCol(...children) {
  const grid = document.createElement('div');
  grid.className = 'four-col';
  for (const c of children) grid.appendChild(c);
  return grid;
}

function subsectionTitle(text) {
  const h = document.createElement('h3');
  h.className = 'subsection-title';
  h.textContent = text;
  return h;
}

function smallHeader(text) {
  const h = document.createElement('h4');
  h.style.margin = '0.75rem 0 0.5rem';
  h.style.fontSize = '0.9375rem';
  h.style.fontWeight = '600';
  h.textContent = text;
  return h;
}

// Shared option lists ------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' }
];

const AGE_CATEGORY_OPTIONS = [
  { value: 'infant', label: 'Infant' },
  { value: 'child', label: 'Child' },
  { value: 'adult', label: 'Adult' }
];

const ARRIVAL_MODE_OPTIONS = [
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'car-private', label: 'Car/Truck (Private)' },
  { value: 'car-taxi', label: 'Car/Truck (Taxi)' },
  { value: 'motor-2-3-private', label: 'Motorized 2/3-wheeler (Private)' },
  { value: 'motor-2-3-taxi', label: 'Motorized 2/3-wheeler (Taxi)' },
  { value: 'public-transport', label: 'Public Transport' },
  { value: 'walk', label: 'Walk' },
  { value: 'other', label: 'Other' }
];

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const TRIAGE_OPTIONS = [
  { value: 'red', label: 'RED (Immediate)' },
  { value: 'yellow', label: 'YELLOW (Urgent)' },
  { value: 'green', label: 'GREEN (Non-urgent)' }
];

const AVPU_OPTIONS = [
  { value: 'A', label: 'A — Alert' },
  { value: 'V', label: 'V — Voice' },
  { value: 'P', label: 'P — Pain' },
  { value: 'U', label: 'U — Unresponsive' }
];

const VAX_OPTIONS = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'no', label: 'No' },
  { value: 'yes', label: 'Yes' }
];

const DISPOSITION_OPTIONS = [
  { value: 'admit', label: 'Admit' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'discharge', label: 'Discharge' },
  { value: 'died', label: 'Died' }
];

const ADMIT_WARD_OPTIONS = [
  { value: 'ward', label: 'Ward' },
  { value: 'icu', label: 'ICU' },
  { value: 'ot', label: 'OT (operating theatre)' }
];

const SPINE_OPTIONS = [
  { value: 'before-arrival', label: 'Done before arrival' },
  { value: 'in-eu', label: 'Done in EU' },
  { value: 'not-needed', label: 'Not needed' }
];

const PELVIS_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'not-indicated', label: 'Not indicated' }
];

const ROAD_ROLE_OPTIONS = [
  { value: 'driver', label: 'Driver' },
  { value: 'passenger', label: 'Passenger' },
  { value: 'pedestrian', label: 'Pedestrian' }
];

const PREHOSPITAL_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'layperson', label: 'Layperson' },
  { value: 'healthcare-professional', label: 'Healthcare professional' }
];

const LOC_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'under-5min', label: '< 5 min' },
  { value: '5-29min', label: '5–29 min' },
  { value: '30min-24hr', label: '30 min – 24 hr' }
];

const INTENT_OPTIONS = [
  { value: 'unintentional', label: 'Unintentional / accidental' },
  { value: 'intentional-self-harm', label: 'Intentional — self harm' },
  { value: 'intentional-assault', label: 'Intentional — assault' },
  { value: 'legal-political-war', label: 'Legal process / political unrest / war' },
  { value: 'unknown', label: 'Unknown' }
];

const SUBSTANCE_OPTIONS = [
  { value: 'unknown', label: 'Unknown' },
  { value: 'none', label: 'None' },
  { value: 'reported', label: 'Reported' },
  { value: 'evidence', label: 'Evidence' }
];

const FAST_PERITONEUM_OPTIONS = [
  { value: 'negative', label: 'Negative' },
  { value: 'indeterminate', label: 'Indeterminate' },
  { value: 'free-fluid', label: 'Free fluid' }
];

const FAST_CHEST_OPTIONS = [
  { value: 'negative', label: 'Negative' },
  { value: 'indeterminate', label: 'Indeterminate' },
  { value: 'pneumothorax', label: 'Pneumothorax' },
  { value: 'pleural-fluid', label: 'Pleural fluid' },
  { value: 'pericardial-effusion', label: 'Pericardial effusion' }
];

const SIDE_OPTIONS = [
  { value: 'left', label: 'L' },
  { value: 'right', label: 'R' },
  { value: 'bilateral', label: 'Bilateral' }
];

const PE_SYSTEMS = [
  { key: 'general', label: 'General' },
  { key: 'neuroPsych', label: 'Neuro / Psych' },
  { key: 'heent', label: 'HEENT' },
  { key: 'neck', label: 'Neck' },
  { key: 'respiratory', label: 'Respiratory' },
  { key: 'cardiac', label: 'Cardiac' },
  { key: 'abdominal', label: 'Abdominal' },
  { key: 'pelvis', label: 'Pelvis' },
  { key: 'guRectal', label: 'GU / Rectal' },
  { key: 'musculoskeletal', label: 'MSK (musculoskeletal)' },
  { key: 'skin', label: 'Skin' }
];

const LABS = [
  { key: 'labHgb', label: 'Hgb (haemoglobin)' },
  { key: 'labBloodType', label: 'Blood type' },
  { key: 'labChemistry', label: 'Chemistry' },
  { key: 'labHepatic', label: 'Hepatic panel' },
  { key: 'labUpt', label: 'Urine pregnancy test (UPT)' },
  { key: 'labOther', label: 'Other labs' }
];

const IMAGING = [
  { key: 'imgChestRadiograph', label: 'Chest radiograph (CXR)' },
  { key: 'imgPelvicRadiograph', label: 'Pelvic radiograph' },
  { key: 'imgHeadCt', label: 'Head CT' },
  { key: 'imgCspine', label: 'C-spine radiograph or CT' },
  { key: 'imgChestAbdomenCt', label: 'Chest / abdomen CT' },
  { key: 'imgExtremityRadiograph', label: 'Extremity radiograph' },
  { key: 'imgOther', label: 'Other imaging' }
];

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Registration',
    description: 'Demographics, arrival mode, residence and injury location.'
  });

  card.appendChild(textInput({
    label: 'Hospital registration number / sticker',
    path: 'patientRegistration.hospitalRegistrationNumber'
  }));

  card.appendChild(twoCol(
    textInput({
      label: 'Patient surname (family name)',
      path: 'patientRegistration.surname',
      placeholder: 'DOE',
      required: true
    }),
    textInput({
      label: 'Patient first name (given name)',
      path: 'patientRegistration.firstName',
      placeholder: 'Jane',
      required: true
    })
  ));

  card.appendChild(twoCol(
    textInput({
      label: 'Date of birth',
      path: 'patientRegistration.dateOfBirth',
      type: 'date',
      required: true
    }),
    numberInput({
      label: 'Age',
      path: 'patientRegistration.age',
      min: 0,
      max: 130
    })
  ));

  card.appendChild(selectInput({
    label: 'Age category (if age unavailable)',
    path: 'patientRegistration.ageCategory',
    options: AGE_CATEGORY_OPTIONS
  }));

  card.appendChild(radioGroup({
    label: 'Sex',
    path: 'patientRegistration.sex',
    options: SEX_OPTIONS,
    required: true
  }));

  card.appendChild(textInput({
    label: 'Patient defined racial and ethnic identity',
    path: 'patientRegistration.racialAndEthnicIdentity'
  }));
  card.appendChild(checkbox({
    label: 'Racial and ethnic identity: Unknown',
    path: 'patientRegistration.racialAndEthnicIdentityUnknown'
  }));

  card.appendChild(radioGroup({
    label: 'Is an interpreter required?',
    path: 'patientRegistration.interpreterRequired',
    options: YES_NO
  }));

  card.appendChild(textInput({
    label: 'Occupation',
    path: 'patientRegistration.occupation'
  }));

  card.appendChild(subsectionTitle('Contact person'));
  card.appendChild(textInput({ label: 'Name', path: 'patientRegistration.contactPerson' }));
  card.appendChild(textInput({ label: 'Phone', path: 'patientRegistration.contactPhone', type: 'tel' }));
  card.appendChild(textInput({ label: 'Relation', path: 'patientRegistration.contactRelation' }));

  card.appendChild(subsectionTitle('Arrival'));
  card.appendChild(twoCol(
    textInput({
      label: 'Date of arrival',
      path: 'patientRegistration.dateOfArrival',
      type: 'date',
      required: true
    }),
    textInput({
      label: 'Time of arrival (24h)',
      path: 'patientRegistration.timeOfArrival',
      type: 'time',
      required: true
    })
  ));

  card.appendChild(selectInput({
    label: 'Arrival mode',
    path: 'patientRegistration.arrivalMode',
    options: ARRIVAL_MODE_OPTIONS,
    required: true
  }));

  card.appendChild(subsectionTitle('Residence and injury location'));
  card.appendChild(textInput({
    label: 'Patient residence (Address or City/Sub-district)',
    path: 'patientRegistration.patientResidence'
  }));
  card.appendChild(checkbox({
    label: 'Patient residence: Unknown',
    path: 'patientRegistration.patientResidenceUnknown'
  }));

  card.appendChild(textInput({
    label: 'Injury location (Sub-district)',
    path: 'patientRegistration.injuryLocation'
  }));
  card.appendChild(checkbox({
    label: 'Injury location: Unknown',
    path: 'patientRegistration.injuryLocationUnknown'
  }));

  card.appendChild(numberInput({
    label: 'Number of prior facilities',
    path: 'patientRegistration.priorFacilitiesCount',
    min: 0
  }));
  card.appendChild(textInput({
    label: 'Referred from',
    path: 'patientRegistration.referredFrom'
  }));

  card.appendChild(radioGroup({
    label: 'Safe at home?',
    path: 'patientRegistration.safeAtHome',
    options: YES_NO
  }));

  card.appendChild(numberInput({
    label: 'Weight',
    path: 'patientRegistration.weightKg',
    unit: 'kg',
    min: 0,
    step: 0.1
  }));

  card.appendChild(subsectionTitle('Vaccinations'));
  card.appendChild(selectInput({
    label: 'Vaccinations up to date?',
    path: 'patientRegistration.vaccinationsStatus',
    options: VAX_OPTIONS
  }));
  if (state.patientRegistration.vaccinationsStatus === 'yes') {
    card.appendChild(textInput({
      label: 'Last vaccination date',
      path: 'patientRegistration.vaccinationsDate',
      type: 'date'
    }));
  }

  card.appendChild(subsectionTitle('Pregnancy'));
  card.appendChild(radioGroup({
    label: 'Pregnant?',
    path: 'patientRegistration.pregnant',
    options: YES_NO
  }));
  if (state.patientRegistration.pregnant === 'yes') {
    card.appendChild(checkbox({
      label: 'Pregnancy: Reported',
      path: 'patientRegistration.pregnancyReported'
    }));
    card.appendChild(checkbox({
      label: 'Pregnancy: Testing done',
      path: 'patientRegistration.pregnancyTestingDone'
    }));
  }
  card.appendChild(textInput({
    label: 'Last menstrual cycle',
    path: 'patientRegistration.lastMenstrualCycle',
    type: 'date'
  }));
  card.appendChild(twoCol(
    numberInput({ label: 'Gravida (G)', path: 'patientRegistration.gravida', min: 0 }),
    numberInput({ label: 'Para (P)', path: 'patientRegistration.para', min: 0 })
  ));
  card.appendChild(checkbox({
    label: 'LMP / G&P: Unknown',
    path: 'patientRegistration.lmpUnknown'
  }));

  card.appendChild(subsectionTitle('Substance use'));
  card.appendChild(checkbox({ label: 'Tobacco', path: 'patientRegistration.tobaccoUse' }));
  card.appendChild(checkbox({ label: 'Alcohol', path: 'patientRegistration.alcoholUse' }));
  card.appendChild(checkbox({ label: 'Drugs', path: 'patientRegistration.drugUse' }));
  card.appendChild(checkbox({ label: 'IV drug use', path: 'patientRegistration.ivDrugUse' }));
  card.appendChild(checkbox({
    label: 'Substance use: Unknown',
    path: 'patientRegistration.substanceUseUnknown'
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Chief Complaint & Vitals',
    description: 'Capture chief complaint, allergies, initial vital signs, and dead-on-arrival status.'
  });

  card.appendChild(textArea({
    label: 'Chief complaint',
    path: 'chiefComplaintAndVitals.chiefComplaint',
    rows: 2,
    placeholder: "In the patient's own words where possible (e.g. 'multiple injuries from RTA').",
    required: true
  }));

  card.appendChild(textArea({
    label: 'Allergies',
    path: 'chiefComplaintAndVitals.allergies',
    rows: 2
  }));
  card.appendChild(checkbox({
    label: 'Allergies: Unknown',
    path: 'chiefComplaintAndVitals.allergiesUnknown'
  }));

  card.appendChild(subsectionTitle('Initial vital signs'));
  card.appendChild(textInput({
    label: 'Time (24h)',
    path: 'chiefComplaintAndVitals.initialVitals.time',
    type: 'time',
    required: true
  }));

  const doa = state.chiefComplaintAndVitals.deadOnArrival;
  card.appendChild(twoCol(
    numberInput({ label: 'Temperature', path: 'chiefComplaintAndVitals.initialVitals.tempC', unit: '°C', step: 0.1, min: 25, max: 45 }),
    numberInput({ label: 'Pulse', path: 'chiefComplaintAndVitals.initialVitals.pulse', unit: 'bpm', min: 0, max: 300, required: !doa }),
    numberInput({ label: 'Systolic BP', path: 'chiefComplaintAndVitals.initialVitals.bpSystolic', unit: 'mmHg', min: 0, max: 300, required: !doa }),
    numberInput({ label: 'Diastolic BP', path: 'chiefComplaintAndVitals.initialVitals.bpDiastolic', unit: 'mmHg', min: 0, max: 250 }),
    numberInput({ label: 'Respiratory rate', path: 'chiefComplaintAndVitals.initialVitals.respiratoryRate', unit: '/min', min: 0, max: 80, required: !doa }),
    numberInput({ label: 'SpO2', path: 'chiefComplaintAndVitals.initialVitals.spo2', unit: '%', min: 0, max: 100, required: !doa }),
    textInput({ label: 'SpO2 on (e.g. RA, NC 2L)', path: 'chiefComplaintAndVitals.initialVitals.spo2OnOxygen' }),
    numberInput({ label: 'Pain score', path: 'chiefComplaintAndVitals.initialVitals.painScore', unit: '0–10', min: 0, max: 10 })
  ));

  card.appendChild(subsectionTitle('Dead on arrival'));
  card.appendChild(checkbox({
    label: 'Patient is dead on arrival',
    path: 'chiefComplaintAndVitals.deadOnArrival'
  }));
  if (state.chiefComplaintAndVitals.deadOnArrival) {
    card.appendChild(textInput({
      label: 'Time of death (24h)',
      path: 'chiefComplaintAndVitals.timeOfDeath',
      type: 'time',
      required: true
    }));
  }

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'High Risk Signs',
    description: 'Tick any high-risk red signs (A/B, C, D, Other) and trauma indicators (general trauma, road traffic). These guide rapid clinical escalation.'
  });

  card.appendChild(subsectionTitle('A / B (airway / breathing)'));
  card.appendChild(checkbox({ label: 'Stridor', path: 'highRiskSigns.redStridor' }));
  card.appendChild(checkbox({ label: 'Cyanosis', path: 'highRiskSigns.redCyanosis' }));
  card.appendChild(checkbox({ label: 'Respiratory distress', path: 'highRiskSigns.redRespiratoryDistress' }));

  card.appendChild(subsectionTitle('C (circulation)'));
  card.appendChild(checkbox({ label: 'Poor perfusion', path: 'highRiskSigns.redPoorPerfusion' }));
  card.appendChild(checkbox({ label: 'Weak / fast pulse', path: 'highRiskSigns.redWeakFastPulse' }));
  card.appendChild(checkbox({ label: 'Capillary refill > 3 sec', path: 'highRiskSigns.redCapRefillOver3' }));
  card.appendChild(checkbox({ label: 'Heavy bleeding', path: 'highRiskSigns.redHeavyBleeding' }));
  card.appendChild(checkbox({ label: 'Adult HR < 50 or > 150', path: 'highRiskSigns.redAdultHrAbnormal' }));
  card.appendChild(checkbox({ label: 'Child (≥2): lethargy', path: 'highRiskSigns.redChildLethargy' }));
  card.appendChild(checkbox({ label: 'Child (≥2): sunken eyes', path: 'highRiskSigns.redChildSunkenEyes' }));
  card.appendChild(checkbox({ label: 'Child (≥2): slow skin pinch', path: 'highRiskSigns.redChildSlowSkinPinch' }));
  card.appendChild(checkbox({ label: 'Child (≥2): poor drinking', path: 'highRiskSigns.redChildPoorDrinking' }));

  card.appendChild(subsectionTitle('D (disability)'));
  card.appendChild(checkbox({ label: 'Unresponsive', path: 'highRiskSigns.redUnresponsive' }));
  card.appendChild(checkbox({ label: 'Acute convulsions', path: 'highRiskSigns.redAcuteConvulsions' }));
  card.appendChild(checkbox({ label: 'Hypoglycaemia', path: 'highRiskSigns.redHypoglycaemia' }));
  card.appendChild(checkbox({ label: 'Acute focal neurologic deficit', path: 'highRiskSigns.redAcuteFocalNeuroDeficit' }));
  card.appendChild(checkbox({
    label: 'Altered mental status with fever / hypothermia / stiff neck / headache',
    path: 'highRiskSigns.redAlteredMentalStatusWithFeverEtc'
  }));

  card.appendChild(subsectionTitle('Other red signs'));
  card.appendChild(checkbox({ label: 'Threatened limb', path: 'highRiskSigns.redThreatenedLimb' }));
  card.appendChild(checkbox({ label: 'Snake bite', path: 'highRiskSigns.redSnakeBite' }));
  card.appendChild(checkbox({ label: 'Poisoning, ingestion, chemical exposure', path: 'highRiskSigns.redPoisoningChemicalExposure' }));
  card.appendChild(checkbox({ label: 'Violent or aggressive', path: 'highRiskSigns.redViolentOrAggressive' }));
  card.appendChild(checkbox({ label: 'Acute testicular pain or priapism', path: 'highRiskSigns.redAcuteTesticularPainOrPriapism' }));
  card.appendChild(checkbox({
    label: 'Adult: severe chest / abdominal pain or ECG with ischemia',
    path: 'highRiskSigns.redAdultSevereChestOrAbdoPain'
  }));
  card.appendChild(checkbox({ label: 'Pregnant with high-risk findings', path: 'highRiskSigns.redPregnantWithHighRiskFindings' }));
  card.appendChild(checkbox({ label: 'Infant < 8 days old', path: 'highRiskSigns.redInfantUnder8Days' }));
  card.appendChild(checkbox({
    label: 'Infant < 2 months with temp > 39°C or < 36°C',
    path: 'highRiskSigns.redInfantUnder2MonthsAbnormalTemp'
  }));

  card.appendChild(subsectionTitle('High-risk trauma — general'));
  card.appendChild(checkbox({ label: "Fall from twice person's height", path: 'highRiskSigns.traumaFallTwiceHeight' }));
  card.appendChild(checkbox({ label: 'All penetrating trauma (excepting distal to knee/elbow)', path: 'highRiskSigns.traumaAllPenetrating' }));
  card.appendChild(checkbox({
    label: 'Penetrating trauma distal to knee/elbow with uncontrolled bleeding',
    path: 'highRiskSigns.traumaPenetratingDistalUncontrolledBleeding'
  }));
  card.appendChild(checkbox({ label: 'Crush injury', path: 'highRiskSigns.traumaCrushInjury' }));
  card.appendChild(checkbox({ label: 'Polytrauma (injury to multiple body areas)', path: 'highRiskSigns.traumaPolytrauma' }));
  card.appendChild(checkbox({
    label: 'Patient with bleeding disorder or on anticoagulation',
    path: 'highRiskSigns.traumaBleedingDisorderOrAnticoag'
  }));
  card.appendChild(checkbox({ label: 'Pregnant', path: 'highRiskSigns.traumaPregnant' }));

  card.appendChild(subsectionTitle('High-risk trauma — road traffic'));
  card.appendChild(checkbox({ label: 'High speed motor vehicle crash', path: 'highRiskSigns.rtHighSpeedCrash' }));
  card.appendChild(checkbox({ label: 'Pedestrian or cyclist hit by vehicle', path: 'highRiskSigns.rtPedestrianOrCyclistHit' }));
  card.appendChild(checkbox({ label: 'Other person in same vehicle died at scene', path: 'highRiskSigns.rtOtherInVehicleDied' }));
  card.appendChild(checkbox({ label: 'Motor vehicle crash without a seatbelt', path: 'highRiskSigns.rtNoSeatbelt' }));
  card.appendChild(checkbox({ label: 'Trapped or thrown from vehicle (incl. motorcycle)', path: 'highRiskSigns.rtTrappedOrThrown' }));
  card.appendChild(checkbox({ label: 'Dead on arrival', path: 'highRiskSigns.rtDeadOnArrival' }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Triage',
    description: 'Assign a triage category and record what triage was based on. Treating provider assessment date and time may also be recorded here.'
  });
  card.appendChild(radioGroup({
    label: 'Triage category',
    path: 'triage.category',
    options: TRIAGE_OPTIONS,
    required: true
  }));
  card.appendChild(textInput({
    label: 'Triaged for (free text)',
    path: 'triage.triagedFor',
    placeholder: 'e.g. polytrauma; chest injury'
  }));

  card.appendChild(subsectionTitle('Treating provider assessment'));
  card.appendChild(twoCol(
    textInput({ label: 'Date', path: 'triage.providerAssessmentDate', type: 'date' }),
    textInput({ label: 'Time (24h)', path: 'triage.providerAssessmentTime', type: 'time' })
  ));

  if (state.triage.category === 'red') {
    const note = document.createElement('p');
    note.className = 'info-note';
    note.textContent = 'RED triage selected — spine stabilization status (Airway step) and a GCS total or "Qualified GCS" tick (Disability step) are required.';
    card.appendChild(note);
  }

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Airway (A)',
    description: 'Primary survey — airway findings, obstruction, interventions and spine stabilisation.'
  });
  card.appendChild(checkbox({ label: 'Normal (no abnormal findings)', path: 'airway.normal' }));

  card.appendChild(subsectionTitle('Concerning findings'));
  card.appendChild(checkbox({ label: 'Swelling', path: 'airway.swelling' }));
  card.appendChild(checkbox({ label: 'Stridor', path: 'airway.stridor' }));
  card.appendChild(checkbox({ label: 'Voice changes', path: 'airway.voiceChanges' }));
  card.appendChild(checkbox({ label: 'Burns', path: 'airway.burns' }));

  card.appendChild(subsectionTitle('Obstructed by'));
  card.appendChild(checkbox({ label: 'Tongue', path: 'airway.obstructedByTongue' }));
  card.appendChild(checkbox({ label: 'Blood', path: 'airway.obstructedByBlood' }));
  card.appendChild(checkbox({ label: 'Secretion', path: 'airway.obstructedBySecretion' }));
  card.appendChild(checkbox({ label: 'Vomit', path: 'airway.obstructedByVomit' }));
  card.appendChild(checkbox({ label: 'Foreign body', path: 'airway.obstructedByForeignBody' }));

  card.appendChild(subsectionTitle('Interventions'));
  card.appendChild(checkbox({ label: 'Repositioning', path: 'airway.interventionRepositioning' }));
  card.appendChild(checkbox({ label: 'Suction', path: 'airway.interventionSuction' }));
  card.appendChild(checkbox({ label: 'OPA (oropharyngeal airway)', path: 'airway.interventionOpa' }));
  card.appendChild(checkbox({ label: 'NPA (nasopharyngeal airway)', path: 'airway.interventionNpa' }));
  card.appendChild(checkbox({ label: 'LMA (laryngeal mask airway)', path: 'airway.interventionLma' }));
  card.appendChild(checkbox({ label: 'BVM (bag-valve mask)', path: 'airway.interventionBvm' }));
  card.appendChild(checkbox({ label: 'ETT (endotracheal tube)', path: 'airway.interventionEtt' }));

  card.appendChild(subsectionTitle('Spine stabilization'));
  card.appendChild(radioGroup({
    label: 'Spine stabilized' + (state.triage.category === 'red' ? ' (required for RED triage)' : ''),
    path: 'airway.spineStabilized',
    options: SPINE_OPTIONS,
    required: state.triage.category === 'red'
  }));

  card.appendChild(textArea({ label: 'Notes', path: 'airway.notes', rows: 2 }));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Breathing (B)',
    description: 'Primary survey — chest rise, trachea, breath sounds, cyanosis, oxygenation, ventilation, and chest tubes.'
  });
  card.appendChild(checkbox({ label: 'Normal (no abnormal findings)', path: 'breathing.normal' }));

  card.appendChild(numberInput({
    label: 'Spontaneous respiratory rate',
    path: 'breathing.spontaneousRespiratoryRate',
    unit: '/min',
    min: 0,
    max: 80
  }));

  card.appendChild(subsectionTitle('Chest rise'));
  card.appendChild(checkbox({ label: 'Shallow', path: 'breathing.chestRiseShallow' }));
  card.appendChild(checkbox({ label: 'Retractions', path: 'breathing.chestRiseRetractions' }));
  card.appendChild(checkbox({ label: 'Paradoxical', path: 'breathing.chestRiseParadoxical' }));

  card.appendChild(subsectionTitle('Trachea'));
  card.appendChild(checkbox({ label: 'Midline', path: 'breathing.tracheaMidline' }));
  card.appendChild(checkbox({ label: 'Deviated to L', path: 'breathing.tracheaDeviatedLeft' }));
  card.appendChild(checkbox({ label: 'Deviated to R', path: 'breathing.tracheaDeviatedRight' }));

  card.appendChild(subsectionTitle('Breath sounds'));
  card.appendChild(twoCol(
    textInput({ label: 'Left', path: 'breathing.breathSoundsLeft' }),
    textInput({ label: 'Right', path: 'breathing.breathSoundsRight' })
  ));

  card.appendChild(checkbox({ label: 'Cyanosis present on exam', path: 'breathing.cyanosis' }));

  card.appendChild(subsectionTitle('Oxygen / ventilation'));
  card.appendChild(numberInput({
    label: 'Oxygen',
    path: 'breathing.oxygenLitres',
    unit: 'L/min',
    min: 0,
    max: 30,
    step: 0.5
  }));
  card.appendChild(checkbox({ label: 'Nasal cannula', path: 'breathing.oxygenNasalCannula' }));
  card.appendChild(checkbox({ label: 'Facemask', path: 'breathing.oxygenMask' }));
  card.appendChild(checkbox({ label: 'Non-rebreather (NRB)', path: 'breathing.oxygenNonRebreather' }));
  card.appendChild(checkbox({ label: 'BVM', path: 'breathing.oxygenBvm' }));
  card.appendChild(checkbox({ label: 'CPAP / BIPAP', path: 'breathing.oxygenCpapBipap' }));
  card.appendChild(checkbox({ label: 'Ventilator', path: 'breathing.oxygenVentilator' }));

  card.appendChild(subsectionTitle('Chest tube'));
  card.appendChild(twoCol(
    textInput({ label: 'L — Size', path: 'breathing.chestTubeLeftSize' }),
    textInput({ label: 'L — Depth (cm)', path: 'breathing.chestTubeLeftDepth' }),
    textInput({ label: 'R — Size', path: 'breathing.chestTubeRightSize' }),
    textInput({ label: 'R — Depth (cm)', path: 'breathing.chestTubeRightDepth' })
  ));

  card.appendChild(textArea({ label: 'Notes', path: 'breathing.notes', rows: 2 }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Circulation (C)',
    description: 'Primary survey — skin, perfusion, pulses, JVD, pelvis stability, bleeding control, vascular access, fluids and blood.'
  });
  card.appendChild(checkbox({ label: 'Normal (no abnormal findings)', path: 'circulation.normal' }));

  card.appendChild(subsectionTitle('Skin'));
  card.appendChild(checkbox({ label: 'Warm', path: 'circulation.skinWarm' }));
  card.appendChild(checkbox({ label: 'Dry', path: 'circulation.skinDry' }));
  card.appendChild(checkbox({ label: 'Cool', path: 'circulation.skinCool' }));
  card.appendChild(checkbox({ label: 'Moist', path: 'circulation.skinMoist' }));
  card.appendChild(checkbox({ label: 'Pale', path: 'circulation.skinPale' }));

  card.appendChild(subsectionTitle('Capillary refill'));
  card.appendChild(checkbox({ label: '< 3 sec', path: 'circulation.capillaryRefillUnder3' }));
  card.appendChild(numberInput({
    label: 'Capillary refill',
    path: 'circulation.capillaryRefillSeconds',
    unit: 'sec',
    min: 0,
    step: 0.5
  }));

  card.appendChild(subsectionTitle('Pulses'));
  card.appendChild(checkbox({ label: 'Weak', path: 'circulation.pulsesWeak' }));
  card.appendChild(checkbox({ label: 'Asymmetric', path: 'circulation.pulsesAsymmetric' }));

  card.appendChild(radioGroup({ label: 'JVD?', path: 'circulation.jvd', options: YES_NO }));
  card.appendChild(radioGroup({ label: 'Unstable pelvis?', path: 'circulation.unstablePelvis', options: YES_NO }));

  card.appendChild(subsectionTitle('Bleeding controlled'));
  card.appendChild(checkbox({ label: 'Direct pressure', path: 'circulation.bleedingControlDirectPressure' }));
  card.appendChild(checkbox({ label: 'Bandage', path: 'circulation.bleedingControlBandage' }));
  card.appendChild(checkbox({ label: 'Tourniquet', path: 'circulation.bleedingControlTourniquet' }));

  card.appendChild(subsectionTitle('Vascular access — Line 1'));
  card.appendChild(twoCol(
    textInput({ label: 'IV — Location', path: 'circulation.accessIvLocation' }),
    textInput({ label: 'IV — Size', path: 'circulation.accessIvSize' }),
    textInput({ label: 'Central — Location', path: 'circulation.accessCentralLocation' }),
    textInput({ label: 'Central — Size', path: 'circulation.accessCentralSize' }),
    textInput({ label: 'IO — Location', path: 'circulation.accessIoLocation' }),
    textInput({ label: 'IO — Size', path: 'circulation.accessIoSize' })
  ));

  card.appendChild(subsectionTitle('Vascular access — Line 2'));
  card.appendChild(twoCol(
    textInput({ label: 'Line 2 — Location', path: 'circulation.accessLine2Location' }),
    textInput({ label: 'Line 2 — Size', path: 'circulation.accessLine2Size' })
  ));

  card.appendChild(subsectionTitle('IV fluids'));
  card.appendChild(numberInput({ label: 'IVF', path: 'circulation.ivfMls', unit: 'mL', min: 0, step: 10 }));
  card.appendChild(checkbox({ label: 'NS (normal saline)', path: 'circulation.ivfNs' }));
  card.appendChild(checkbox({ label: "LR (lactated Ringer's)", path: 'circulation.ivfLr' }));
  card.appendChild(textInput({ label: 'Other fluid', path: 'circulation.ivfOther' }));

  card.appendChild(subsectionTitle('Blood'));
  card.appendChild(checkbox({ label: 'Blood ordered', path: 'circulation.bloodOrdered' }));
  card.appendChild(checkbox({ label: 'Blood given', path: 'circulation.bloodGiven' }));
  card.appendChild(textInput({ label: 'Blood — Type / Amount', path: 'circulation.bloodTypeAmount' }));

  card.appendChild(radioGroup({
    label: 'Pelvis stabilized',
    path: 'circulation.pelvisStabilized',
    options: PELVIS_OPTIONS
  }));

  card.appendChild(textArea({ label: 'Notes', path: 'circulation.notes', rows: 2 }));

  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Disability (D)',
    description: 'Neurological status — AVPU, GCS, motor exam in 4 extremities, pupils, blood glucose and interventions.'
  });
  card.appendChild(checkbox({ label: 'Normal (no abnormal findings)', path: 'disability.normal' }));

  card.appendChild(radioGroup({
    label: 'AVPU (Alert / Voice / Pain / Unresponsive)',
    path: 'disability.avpu',
    options: AVPU_OPTIONS,
    required: true
  }));

  card.appendChild(subsectionTitle('GCS (Glasgow Coma Scale)'));
  card.appendChild(fourCol(
    numberInput({
      label: 'GCS Total',
      path: 'disability.gcsTotal',
      min: 3,
      max: 15,
      required: state.triage.category === 'red' && !state.disability.gcsQualified
    }),
    numberInput({ label: 'E (Eye)', path: 'disability.gcsEye', min: 1, max: 4 }),
    numberInput({ label: 'V (Verbal)', path: 'disability.gcsVerbal', min: 1, max: 5 }),
    numberInput({ label: 'M (Motor)', path: 'disability.gcsMotor', min: 1, max: 6 })
  ));
  card.appendChild(checkbox({
    label: 'Qualified GCS (sedated, intubated, vision obstructed)',
    path: 'disability.gcsQualified'
  }));

  card.appendChild(subsectionTitle('Moves extremities'));
  card.appendChild(checkbox({ label: 'RUE (right upper extremity)', path: 'disability.movesRue' }));
  card.appendChild(checkbox({ label: 'LUE (left upper extremity)', path: 'disability.movesLue' }));
  card.appendChild(checkbox({ label: 'RLE (right lower extremity)', path: 'disability.movesRle' }));
  card.appendChild(checkbox({ label: 'LLE (left lower extremity)', path: 'disability.movesLle' }));

  card.appendChild(subsectionTitle('Pupils'));
  card.appendChild(twoCol(
    numberInput({ label: 'Size L', path: 'disability.pupilSizeLeft', unit: 'mm', min: 0, max: 10, step: 0.5 }),
    numberInput({ label: 'Size R', path: 'disability.pupilSizeRight', unit: 'mm', min: 0, max: 10, step: 0.5 }),
    textInput({ label: 'Reactivity L', path: 'disability.pupilReactivityLeft', placeholder: 'brisk / sluggish / fixed' }),
    textInput({ label: 'Reactivity R', path: 'disability.pupilReactivityRight', placeholder: 'brisk / sluggish / fixed' })
  ));

  card.appendChild(numberInput({
    label: 'Blood glucose (abnormal if < 65 mg/dL)',
    path: 'disability.bloodGlucose',
    unit: 'mg/dL',
    min: 0,
    max: 1000,
    step: 1
  }));

  card.appendChild(subsectionTitle('Interventions'));
  card.appendChild(checkbox({ label: 'Glucose', path: 'disability.interventionGlucose' }));
  card.appendChild(checkbox({ label: 'Antidote', path: 'disability.interventionAntidote' }));
  card.appendChild(checkbox({ label: 'Antiepileptic', path: 'disability.interventionAntiepileptic' }));
  card.appendChild(checkbox({ label: 'Raise head of bed', path: 'disability.interventionRaiseHeadOfBed' }));
  card.appendChild(textInput({ label: 'Other interventions', path: 'disability.interventionOther' }));

  card.appendChild(textArea({ label: 'Notes', path: 'disability.notes', rows: 2 }));

  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Exposure (E) & FAST (F)',
    description: 'Exposure (full undressing) and Focused Assessment with Sonography for Trauma.'
  });

  card.appendChild(subsectionTitle('Exposure'));
  card.appendChild(checkbox({ label: 'Patient exposed completely', path: 'exposureAndFast.exposedCompletely' }));
  card.appendChild(textArea({ label: 'Exposure notes', path: 'exposureAndFast.exposureNotes', rows: 2 }));

  card.appendChild(subsectionTitle('FAST'));
  card.appendChild(checkbox({ label: 'Normal (no abnormal findings)', path: 'exposureAndFast.fastNormal' }));
  card.appendChild(checkbox({ label: 'Not indicated', path: 'exposureAndFast.fastNotIndicated' }));
  card.appendChild(checkbox({ label: 'Not available', path: 'exposureAndFast.fastNotAvailable' }));

  card.appendChild(radioGroup({
    label: 'Peritoneum',
    path: 'exposureAndFast.fastPeritoneum',
    options: FAST_PERITONEUM_OPTIONS
  }));

  card.appendChild(radioGroup({
    label: 'Chest',
    path: 'exposureAndFast.fastChest',
    options: FAST_CHEST_OPTIONS
  }));

  if (state.exposureAndFast.fastChest === 'pneumothorax') {
    card.appendChild(radioGroup({
      label: 'Pneumothorax side',
      path: 'exposureAndFast.fastChestPneumothoraxSide',
      options: SIDE_OPTIONS
    }));
  }
  if (state.exposureAndFast.fastChest === 'pleural-fluid') {
    card.appendChild(radioGroup({
      label: 'Pleural fluid side',
      path: 'exposureAndFast.fastChestPleuralFluidSide',
      options: SIDE_OPTIONS
    }));
  }

  card.appendChild(textArea({ label: 'FAST notes', path: 'exposureAndFast.fastNotes', rows: 2 }));

  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Injury History',
    description: 'Place, activity, mechanism, prehospital care, intent, fasting status and substance use within 6 hours of injury.'
  });

  card.appendChild(textInput({ label: 'Place of injury', path: 'injuryHistory.placeOfInjury' }));
  card.appendChild(checkbox({ label: 'Place of injury: Unknown', path: 'injuryHistory.placeOfInjuryUnknown' }));

  card.appendChild(textInput({ label: 'Activity at time of injury', path: 'injuryHistory.activityAtTimeOfInjury' }));
  card.appendChild(checkbox({ label: 'Activity: Unknown', path: 'injuryHistory.activityAtTimeOfInjuryUnknown' }));

  card.appendChild(subsectionTitle('Mechanism of injury'));
  card.appendChild(checkbox({ label: 'Road traffic incident', path: 'injuryHistory.mechRoadTrafficIncident' }));
  if (state.injuryHistory.mechRoadTrafficIncident) {
    card.appendChild(radioGroup({
      label: 'Role',
      path: 'injuryHistory.mechRoadRole',
      options: ROAD_ROLE_OPTIONS
    }));
    card.appendChild(twoCol(
      textInput({ label: 'Patient vehicle', path: 'injuryHistory.mechPatientVehicle' }),
      textInput({ label: 'Impacted with', path: 'injuryHistory.mechImpactedWith' })
    ));
    card.appendChild(checkbox({ label: 'Airbag deployed', path: 'injuryHistory.mechAirbag' }));
    card.appendChild(checkbox({ label: 'Seat belt worn', path: 'injuryHistory.mechSeatbelt' }));
    card.appendChild(checkbox({ label: 'Helmet worn', path: 'injuryHistory.mechHelmet' }));
    card.appendChild(checkbox({ label: 'Extricated', path: 'injuryHistory.mechExtricated' }));
    card.appendChild(checkbox({ label: 'Ejected', path: 'injuryHistory.mechEjected' }));
  }

  card.appendChild(textInput({ label: 'Fall from (height / details)', path: 'injuryHistory.mechFallFrom' }));
  card.appendChild(checkbox({ label: 'Hit by falling object', path: 'injuryHistory.mechHitByFallingObject' }));
  card.appendChild(checkbox({ label: 'Stab / cut', path: 'injuryHistory.mechStabCut' }));
  card.appendChild(checkbox({ label: 'Gunshot', path: 'injuryHistory.mechGunshot' }));
  card.appendChild(checkbox({ label: 'Sexual assault', path: 'injuryHistory.mechSexualAssault' }));
  card.appendChild(checkbox({ label: 'Other blunt force trauma', path: 'injuryHistory.mechOtherBluntForce' }));
  card.appendChild(checkbox({ label: 'Suffocation, choking, hanging', path: 'injuryHistory.mechSuffocationChokingHanging' }));
  card.appendChild(checkbox({ label: 'Drowning', path: 'injuryHistory.mechDrowning' }));
  if (state.injuryHistory.mechDrowning) {
    card.appendChild(radioGroup({
      label: 'With life vest?',
      path: 'injuryHistory.mechDrowningLifeVest',
      options: YES_NO
    }));
  }
  card.appendChild(textInput({ label: 'Burn caused by', path: 'injuryHistory.mechBurnCausedBy' }));
  card.appendChild(checkbox({ label: 'Poisoning / toxic exposure', path: 'injuryHistory.mechPoisoningToxicExposure' }));
  card.appendChild(checkbox({ label: 'Unknown mechanism', path: 'injuryHistory.mechUnknown' }));

  card.appendChild(subsectionTitle('Prehospital care'));
  card.appendChild(textInput({ label: 'First care sought', path: 'injuryHistory.firstCareSought' }));
  card.appendChild(radioGroup({
    label: 'Prehospital care provider',
    path: 'injuryHistory.prehospitalCareProvider',
    options: PREHOSPITAL_OPTIONS,
    required: true
  }));
  card.appendChild(textArea({ label: 'Prehospital care given', path: 'injuryHistory.prehospitalCareGiven', rows: 2 }));

  card.appendChild(subsectionTitle('Date / time of injury'));
  card.appendChild(twoCol(
    textInput({ label: 'Date of injury', path: 'injuryHistory.dateOfInjury', type: 'date', required: true }),
    textInput({ label: 'Time of injury (24h)', path: 'injuryHistory.timeOfInjury', type: 'time', required: true })
  ));

  card.appendChild(subsectionTitle('Details'));
  card.appendChild(radioGroup({
    label: 'Loss of consciousness',
    path: 'injuryHistory.lossOfConsciousnessDuration',
    options: LOC_OPTIONS
  }));
  card.appendChild(checkbox({ label: 'Head trauma', path: 'injuryHistory.headTrauma' }));
  card.appendChild(checkbox({ label: 'Neck trauma', path: 'injuryHistory.neckTrauma' }));
  card.appendChild(textArea({ label: 'Other details', path: 'injuryHistory.otherTraumaDetails', rows: 2 }));

  card.appendChild(subsectionTitle('Intent'));
  card.appendChild(radioGroup({
    label: 'Intent of injury',
    path: 'injuryHistory.intent',
    options: INTENT_OPTIONS,
    required: true
  }));
  if (state.injuryHistory.intent === 'intentional-assault') {
    card.appendChild(textInput({
      label: 'Assaulted by',
      path: 'injuryHistory.assaultedBy'
    }));
  }

  card.appendChild(subsectionTitle('Fasting and substance use'));
  card.appendChild(numberInput({
    label: 'Hours since last meal',
    path: 'injuryHistory.hoursSinceLastMeal',
    unit: 'hr',
    min: 0,
    step: 0.5
  }));
  card.appendChild(checkbox({
    label: 'Hours since last meal: Unknown',
    path: 'injuryHistory.hoursSinceLastMealUnknown'
  }));

  card.appendChild(radioGroup({
    label: 'Substance use within 6 hours of injury',
    path: 'injuryHistory.substanceUseStatus',
    options: SUBSTANCE_OPTIONS
  }));
  card.appendChild(checkbox({ label: 'Alcohol', path: 'injuryHistory.substanceAlcohol' }));
  card.appendChild(textInput({ label: 'Other substance', path: 'injuryHistory.substanceOther' }));

  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11,
    title: 'Past Histories',
    description: 'Past medical, medications, past surgeries and family history.'
  });

  card.appendChild(subsectionTitle('Past medical'));
  card.appendChild(checkbox({ label: 'None', path: 'pastHistories.pmhNone' }));
  card.appendChild(checkbox({ label: 'Unknown', path: 'pastHistories.pmhUnknown' }));
  card.appendChild(checkbox({ label: 'HTN (hypertension)', path: 'pastHistories.pmhHtn' }));
  card.appendChild(checkbox({ label: 'DM (diabetes mellitus)', path: 'pastHistories.pmhDm' }));
  card.appendChild(checkbox({ label: 'COPD', path: 'pastHistories.pmhCopd' }));
  card.appendChild(checkbox({ label: 'Psychiatric', path: 'pastHistories.pmhPsych' }));
  card.appendChild(checkbox({ label: 'Renal disease', path: 'pastHistories.pmhRenalDisease' }));
  card.appendChild(textArea({ label: 'Other past medical', path: 'pastHistories.pmhOther', rows: 2 }));

  card.appendChild(subsectionTitle('Medications'));
  card.appendChild(checkbox({ label: 'None', path: 'pastHistories.medicationsNone' }));
  card.appendChild(checkbox({ label: 'Unknown', path: 'pastHistories.medicationsUnknown' }));
  card.appendChild(textArea({ label: 'Medications list', path: 'pastHistories.medications', rows: 3 }));

  card.appendChild(subsectionTitle('Past surgeries'));
  card.appendChild(checkbox({ label: 'None', path: 'pastHistories.pastSurgeriesNone' }));
  card.appendChild(checkbox({ label: 'Unknown', path: 'pastHistories.pastSurgeriesUnknown' }));
  card.appendChild(textArea({ label: 'Past surgeries (type & date)', path: 'pastHistories.pastSurgeries', rows: 2 }));

  card.appendChild(subsectionTitle('Family history'));
  card.appendChild(checkbox({ label: 'None', path: 'pastHistories.familyHistoryNone' }));
  card.appendChild(checkbox({ label: 'Unknown', path: 'pastHistories.familyHistoryUnknown' }));
  card.appendChild(textArea({ label: 'Family history', path: 'pastHistories.familyHistory', rows: 2 }));

  return card;
}

function renderStep12() {
  const card = sectionCard({
    stepNumber: 12,
    title: 'Physical Exam',
    description: "For each of the 11 body systems: tick 'Normal' or describe findings (specify L or R if needed). Use the 'Detail area of injury' field to describe location of injuries (anterior / posterior body diagram)."
  });
  for (const sys of PE_SYSTEMS) {
    const block = document.createElement('div');
    block.className = 'inset-block';
    const h = document.createElement('h4');
    h.textContent = sys.label;
    block.appendChild(h);
    block.appendChild(checkbox({
      label: 'Normal',
      path: `physicalExam.${sys.key}.normal`
    }));
    if (!state.physicalExam[sys.key].normal) {
      block.appendChild(textArea({
        label: 'Notes',
        path: `physicalExam.${sys.key}.notes`,
        rows: 2
      }));
    }
    card.appendChild(block);
  }

  card.appendChild(subsectionTitle('Detail area of injury'));
  card.appendChild(textArea({
    label: 'Describe location, side and depth of injuries (anterior / posterior body diagram)',
    path: 'physicalExam.areaOfInjuryDetail',
    rows: 4
  }));
  return card;
}

function renderStep13() {
  const card = sectionCard({
    stepNumber: 13,
    title: 'Assessment & Plan',
    description: 'Summary, differential diagnosis and plan for diagnostics, intervention and consults.'
  });
  card.appendChild(textArea({
    label: 'Narrative',
    path: 'assessmentAndPlan.narrative',
    rows: 8,
    required: true,
    placeholder: 'Summary, differential diagnoses, plan for imaging / interventions / consults.'
  }));
  return card;
}

function renderStep14() {
  const card = sectionCard({
    stepNumber: 14,
    title: 'Diagnostics',
    description: 'Tick the labs and imaging ordered, and record results when available.'
  });

  card.appendChild(subsectionTitle('Labs ordered'));
  for (const l of LABS) {
    const block = document.createElement('div');
    block.className = 'inset-block';
    block.appendChild(checkbox({
      label: `Ordered: ${l.label}`,
      path: `diagnostics.${l.key}.ordered`
    }));
    if (state.diagnostics[l.key].ordered) {
      block.appendChild(textArea({
        label: 'Result',
        path: `diagnostics.${l.key}.result`,
        rows: 2
      }));
    }
    card.appendChild(block);
  }

  card.appendChild(subsectionTitle('Imaging ordered'));
  for (const im of IMAGING) {
    const block = document.createElement('div');
    block.className = 'inset-block';
    block.appendChild(checkbox({
      label: `Ordered: ${im.label}`,
      path: `diagnostics.${im.key}.ordered`
    }));
    if (state.diagnostics[im.key].ordered) {
      block.appendChild(textArea({
        label: 'Result',
        path: `diagnostics.${im.key}.result`,
        rows: 2
      }));
    }
    card.appendChild(block);
  }

  return card;
}

function renderStep15() {
  const card = sectionCard({
    stepNumber: 15,
    title: 'Medications & Procedures',
    description: 'Pre-printed medication categories, free-text medication entries, procedures performed and a procedure log (each row with time given and clinician initials).'
  });

  card.appendChild(subsectionTitle('Pre-printed medication categories'));
  card.appendChild(twoCol(
    numberInput({ label: 'IVF', path: 'medicationsAndProcedures.ivfMls', unit: 'mL', min: 0, step: 10 }),
    textInput({ label: 'IVF type (NS / LR / Other)', path: 'medicationsAndProcedures.ivfType' })
  ));
  card.appendChild(textInput({ label: 'Blood (units)', path: 'medicationsAndProcedures.bloodUnits' }));
  card.appendChild(textInput({ label: 'Analgesia', path: 'medicationsAndProcedures.analgesia' }));
  card.appendChild(textInput({ label: 'Antimicrobials', path: 'medicationsAndProcedures.antimicrobials' }));
  card.appendChild(textInput({ label: 'Tetanus', path: 'medicationsAndProcedures.tetanus' }));

  card.appendChild(subsectionTitle('Medication entries (timed)'));
  for (let i = 0; i < state.medicationsAndProcedures.medications.length; i++) {
    const block = document.createElement('div');
    block.className = 'inset-block';
    block.appendChild(smallHeader(`Medication ${i + 1}`));
    block.appendChild(textInput({ label: 'Medication & dose', path: `medicationsAndProcedures.medications.${i}.medicationAndDose` }));
    block.appendChild(twoCol(
      textInput({ label: 'Time given (24h)', path: `medicationsAndProcedures.medications.${i}.timeGiven`, type: 'time' }),
      textInput({ label: 'Initials', path: `medicationsAndProcedures.medications.${i}.initials` })
    ));
    card.appendChild(block);
  }

  card.appendChild(subsectionTitle('Procedures performed'));
  card.appendChild(checkbox({ label: 'Intubation', path: 'medicationsAndProcedures.procIntubation' }));
  card.appendChild(checkbox({ label: 'Thoracostomy', path: 'medicationsAndProcedures.procThoracostomy' }));
  card.appendChild(checkbox({ label: 'Splinting / reduction', path: 'medicationsAndProcedures.procSplintingReduction' }));
  card.appendChild(checkbox({ label: 'Laceration repair', path: 'medicationsAndProcedures.procLacerationRepair' }));
  card.appendChild(textInput({ label: 'Other procedures', path: 'medicationsAndProcedures.procOther' }));

  card.appendChild(subsectionTitle('Procedure entries (timed)'));
  for (let i = 0; i < state.medicationsAndProcedures.procedures.length; i++) {
    const block = document.createElement('div');
    block.className = 'inset-block';
    block.appendChild(smallHeader(`Procedure ${i + 1}`));
    block.appendChild(textInput({ label: 'Procedure', path: `medicationsAndProcedures.procedures.${i}.procedure` }));
    block.appendChild(twoCol(
      textInput({ label: 'Time (24h)', path: `medicationsAndProcedures.procedures.${i}.timeGiven`, type: 'time' }),
      textInput({ label: 'Initials', path: `medicationsAndProcedures.procedures.${i}.initials` })
    ));
    card.appendChild(block);
  }

  return card;
}

function renderStep16() {
  const card = sectionCard({
    stepNumber: 16,
    title: 'Reassessment',
    description: 'Repeat vital signs and condition update.'
  });
  card.appendChild(textInput({ label: 'Time (24h)', path: 'reassessment.time', type: 'time' }));
  card.appendChild(twoCol(
    numberInput({ label: 'Temperature', path: 'reassessment.tempC', unit: '°C', step: 0.1, min: 25, max: 45 }),
    numberInput({ label: 'Pulse', path: 'reassessment.pulse', unit: 'bpm', min: 0, max: 300 }),
    numberInput({ label: 'Systolic BP', path: 'reassessment.bpSystolic', unit: 'mmHg', min: 0, max: 300 }),
    numberInput({ label: 'Diastolic BP', path: 'reassessment.bpDiastolic', unit: 'mmHg', min: 0, max: 250 }),
    numberInput({ label: 'Respiratory rate', path: 'reassessment.respiratoryRate', unit: '/min', min: 0, max: 80 }),
    numberInput({ label: 'SpO2', path: 'reassessment.spo2', unit: '%', min: 0, max: 100 }),
    textInput({ label: 'SpO2 on (e.g. RA, NC 2L)', path: 'reassessment.spo2OnOxygen' })
  ));
  card.appendChild(checkbox({ label: 'Condition same', path: 'reassessment.conditionSame' }));
  if (!state.reassessment.conditionSame) {
    card.appendChild(textArea({
      label: 'Condition changes',
      path: 'reassessment.conditionChanges',
      rows: 3
    }));
  }
  return card;
}

function renderStep17() {
  const card = sectionCard({
    stepNumber: 17,
    title: 'Disposition',
    description: 'Admit / transfer / discharge / died, departure timestamps, final vital signs, and provider sign-off.'
  });

  card.appendChild(radioGroup({
    label: 'Checklist completed?',
    path: 'disposition.checklistCompleted',
    options: YES_NO
  }));

  card.appendChild(twoCol(
    textInput({ label: 'ED departure date', path: 'disposition.edDepartureDate', type: 'date', required: true }),
    textInput({ label: 'ED departure time (24h)', path: 'disposition.edDepartureTime', type: 'time', required: true })
  ));

  card.appendChild(subsectionTitle('Final vital signs'));
  card.appendChild(twoCol(
    numberInput({ label: 'Temperature', path: 'disposition.finalVitals.tempC', unit: '°C', step: 0.1, min: 25, max: 45 }),
    numberInput({ label: 'Pulse', path: 'disposition.finalVitals.pulse', unit: 'bpm', min: 0, max: 300 }),
    numberInput({ label: 'Systolic BP', path: 'disposition.finalVitals.bpSystolic', unit: 'mmHg', min: 0, max: 300 }),
    numberInput({ label: 'Diastolic BP', path: 'disposition.finalVitals.bpDiastolic', unit: 'mmHg', min: 0, max: 250 }),
    numberInput({ label: 'Respiratory rate', path: 'disposition.finalVitals.respiratoryRate', unit: '/min', min: 0, max: 80 }),
    numberInput({ label: 'SpO2', path: 'disposition.finalVitals.spo2', unit: '%', min: 0, max: 100 }),
    textInput({ label: 'SpO2 on (e.g. RA, NC 2L)', path: 'disposition.finalVitals.spo2OnOxygen' })
  ));

  card.appendChild(textArea({
    label: 'Diagnoses / Impressions (list all)',
    path: 'disposition.diagnosesImpressions',
    rows: 4,
    required: true
  }));

  card.appendChild(radioGroup({
    label: 'Disposition',
    path: 'disposition.disposition',
    options: DISPOSITION_OPTIONS,
    required: true
  }));

  if (state.disposition.disposition === 'admit') {
    card.appendChild(radioGroup({
      label: 'Admit to',
      path: 'disposition.admitWard',
      options: ADMIT_WARD_OPTIONS,
      required: true
    }));
  }

  if (state.disposition.disposition === 'transfer') {
    card.appendChild(textInput({
      label: 'Transfer to',
      path: 'disposition.transferTo',
      required: true
    }));
  }

  if (state.disposition.disposition === 'discharge') {
    card.appendChild(radioGroup({
      label: 'Discharge plan discussed?',
      path: 'disposition.dischargePlanDiscussed',
      options: YES_NO
    }));
  }

  card.appendChild(checkbox({
    label: 'Left without being seen or before treatment was complete',
    path: 'disposition.leftWithoutBeingSeen'
  }));

  if (state.disposition.disposition === 'died') {
    card.appendChild(textInput({
      label: 'Cause of death (NOT cardiopulmonary arrest)',
      path: 'disposition.diedCause',
      required: true
    }));
  }

  card.appendChild(subsectionTitle('Provider sign-off'));
  card.appendChild(textInput({ label: 'Accepting provider', path: 'disposition.acceptingProvider' }));
  card.appendChild(textInput({
    label: 'Emergency unit provider name / title (include handovers)',
    path: 'disposition.emergencyUnitProvider',
    required: true
  }));
  card.appendChild(textInput({ label: 'Signature', path: 'disposition.signature', required: true }));
  card.appendChild(textInput({
    label: 'Signature date',
    path: 'disposition.signatureDate',
    type: 'date',
    required: true
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

function updateProgress() {
  const result = validateEuTrauma(state);
  const total = result.totalRequired;
  const answered = result.totalSatisfied;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) {
    text.textContent = `${answered} of ${total} required fields answered (${percent}%)`;
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
        <h2>WHO Emergency Unit Form: Trauma — submission report</h2>
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
        <button type="button" id="start-over-btn" class="btn btn-secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) startOverBtn.addEventListener('click', startOver);
}

function submitForm() {
  const validation = validateEuTrauma(state);
  const flags = detectFlaggedIssues(state);
  lastResult = {
    validation,
    flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh WHO emergency unit (trauma) form?')) return;
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
  renderStep9, renderStep10, renderStep11, renderStep12,
  renderStep13, renderStep14, renderStep15, renderStep16,
  renderStep17
];

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  // Preserve scroll position across re-renders triggered by setPath().
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
