// Provider Transfer Request - clinician handover wizard (vanilla JS, classic
// <script>).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order and the user scrolls through them. Steps 1-8 are filled in
// by the requesting provider; step 9 (Sign-off & Acknowledgement) carries
// the receiving-provider acknowledgement, which only triggers required
// fields once any acknowledgement field has been touched (two-party gating).
// Submission runs the pure validator + flagged-issues engine and renders an
// inline aria-live report. State is persisted to localStorage so a partial
// fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.ProviderTransferRequest`. The whole file is wrapped in
// an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';
const NS = window.ProviderTransferRequest;
const {
  emptyAssessment,
  hasText,
  hasNumber,
  sectionLabel,
  priorityLabel,
  completenessLabel,
  validateTransfer,
  detectFlaggedIssues
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'provider-transfer-request.front-end-form-with-html.v1';

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
    console.warn('Could not parse saved provider transfer request; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save provider transfer request to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored provider transfer request.', e);
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

/** Resolve a dotted path on state. */
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
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Field component builders
// ----------------------------------------------------------------------

/**
 * @param {{ label: string, path: string, type?: string, placeholder?: string,
 *           required?: boolean }} opts
 */
function textInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getPath(opts.path) ?? '';
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

/**
 * Number input bound to a numeric path. Stores `null` when the field is
 * blanked, otherwise the parsed Number.
 * @param {{ label: string, path: string, min?: number, max?: number,
 *           step?: number, unit?: string }} opts
 */
function numberInput(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const raw = getPath(opts.path);
  const value = hasNumber(raw) ? String(raw) : '';
  const labelText =
    esc(opts.label) +
    (opts.unit ? ` <span class="unit">${esc(opts.unit)}</span>` : '');
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

/**
 * @param {{ label: string, path: string, rows?: number, placeholder?: string,
 *           required?: boolean }} opts
 */
function textArea(opts) {
  const id = `f-${opts.path.replace(/\./g, '-')}`;
  const value = getPath(opts.path) ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const placeholderAttr = opts.placeholder ? ` placeholder="${esc(opts.placeholder)}"` : '';
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

/**
 * @param {{ label: string, path: string,
 *           options: { value: string, label: string }[],
 *           required?: boolean }} opts
 */
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

/**
 * @param {{ label: string, path: string }} opts
 */
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

/**
 * Build a section card.
 * @param {{ stepNumber: number, title: string, description?: string,
 *           extraClass?: string }} opts
 */
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
      <span class="section-step">Section ${opts.stepNumber} of 9</span>
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

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown' }
];

const YES_NO_UNKNOWN = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'unknown', label: 'Unknown' }
];

const URGENCY_OPTIONS = [
  { value: 'routine', label: 'Routine' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergent', label: 'Emergent' }
];

const TRANSFER_TYPE_OPTIONS = [
  { value: 'ward-to-ward', label: 'Ward to ward (same site)' },
  { value: 'inter-hospital', label: 'Inter-hospital' },
  { value: 'inter-organisation', label: 'Inter-organisation' },
  { value: 'community', label: 'To community / home' }
];

const TRANSPORT_MODE_OPTIONS = [
  { value: 'self', label: 'Self / walking' },
  { value: 'wheelchair', label: 'Wheelchair' },
  { value: 'stretcher', label: 'Stretcher' },
  { value: 'ambulance', label: 'Ambulance' },
  { value: 'critical-care-transport', label: 'Critical care transport' }
];

const CONSCIOUS_OPTIONS = [
  { value: 'awake', label: 'Awake / alert' },
  { value: 'drowsy', label: 'Drowsy' },
  { value: 'unresponsive', label: 'Unresponsive' }
];

const REGISTRATION_BODY_OPTIONS = [
  { value: '', label: '— Select —' },
  { value: 'GMC', label: 'GMC (General Medical Council)' },
  { value: 'NMC', label: 'NMC (Nursing & Midwifery Council)' },
  { value: 'HCPC', label: 'HCPC (Health & Care Professions Council)' },
  { value: 'GPhC', label: 'GPhC (General Pharmaceutical Council)' },
  { value: 'other', label: 'Other' }
];

// ----------------------------------------------------------------------
// Provider details sub-form (used for Steps 1 & 2)
// ----------------------------------------------------------------------

/**
 * @param {{ pathBase: string, requireEmail?: boolean }} opts
 */
function renderProviderDetails(opts, host) {
  host.appendChild(textInput({
    label: 'Clinician name',
    path: `${opts.pathBase}.clinicianName`,
    required: true
  }));
  host.appendChild(twoCol(
    textInput({
      label: 'Role / job title',
      path: `${opts.pathBase}.clinicianRole`,
      required: true,
      placeholder: 'e.g. Registrar, Charge Nurse'
    }),
    textInput({
      label: 'Ward / unit',
      path: `${opts.pathBase}.ward`,
      placeholder: 'e.g. AMU, Ward 7'
    })
  ));
  host.appendChild(textInput({
    label: 'Organisation',
    path: `${opts.pathBase}.organisation`,
    required: true,
    placeholder: 'e.g. NHS Trust, hospital, GP practice'
  }));
  host.appendChild(twoCol(
    textInput({
      label: 'Phone',
      path: `${opts.pathBase}.phone`,
      type: 'tel',
      required: true
    }),
    textInput({
      label: 'Email',
      path: `${opts.pathBase}.email`,
      type: 'email'
    })
  ));

  // Registration body select + number
  const regWrapper = document.createElement('div');
  regWrapper.className = 'two-col';

  const regBodyId = `f-${(opts.pathBase + '.registrationBody').replace(/\./g, '-')}`;
  const regBodyField = document.createElement('div');
  regBodyField.className = 'field';
  const currentRegBody = getPath(`${opts.pathBase}.registrationBody`) ?? '';
  regBodyField.innerHTML = `
    <label for="${regBodyId}">Registration body</label>
    <select id="${regBodyId}" name="${regBodyId}" class="select">
      ${REGISTRATION_BODY_OPTIONS.map((o) =>
        `<option value="${esc(o.value)}"${o.value === currentRegBody ? ' selected' : ''}>${esc(o.label)}</option>`
      ).join('')}
    </select>
  `;
  const regBodySel = regBodyField.querySelector('select');
  regBodySel.addEventListener('change', () => {
    const parts = `${opts.pathBase}.registrationBody`.split('.');
    let cur = state;
    for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
    cur[parts[parts.length - 1]] = regBodySel.value;
    saveState();
    updateProgress();
  });
  regWrapper.appendChild(regBodyField);

  regWrapper.appendChild(textInput({
    label: 'Registration number',
    path: `${opts.pathBase}.registrationNumber`,
    placeholder: 'e.g. GMC 1234567'
  }));
  host.appendChild(regWrapper);
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Requesting Provider Details',
    description:
      'The clinician initiating this transfer. Used by the receiving team for clarification and feedback.'
  });
  renderProviderDetails({ pathBase: 'requestingProvider' }, card);
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Receiving Provider Details',
    description:
      'The clinician or service being asked to take over care. Confirm acceptance before the patient leaves.'
  });
  renderProviderDetails({ pathBase: 'receivingProvider' }, card);
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Patient Demographics',
    description: 'Confirm the patient identity at handover. NHS number is preferred where available.'
  });
  card.appendChild(twoCol(
    textInput({
      label: 'First name',
      path: 'patientDemographics.firstName',
      required: true
    }),
    textInput({
      label: 'Last name',
      path: 'patientDemographics.lastName',
      required: true
    })
  ));
  card.appendChild(twoCol(
    textInput({
      label: 'Date of birth',
      path: 'patientDemographics.dateOfBirth',
      type: 'date',
      required: true
    }),
    radioGroup({
      label: 'Sex',
      path: 'patientDemographics.sex',
      options: SEX_OPTIONS,
      required: true
    })
  ));
  card.appendChild(twoCol(
    textInput({
      label: 'NHS number',
      path: 'patientDemographics.nhsNumber',
      placeholder: '10 digits, e.g. 123 456 7890'
    }),
    textInput({
      label: 'Hospital / local number',
      path: 'patientDemographics.hospitalNumber'
    })
  ));
  card.appendChild(twoCol(
    textInput({
      label: 'Address line',
      path: 'patientDemographics.addressLine'
    }),
    textInput({
      label: 'Postcode',
      path: 'patientDemographics.postcode'
    })
  ));

  const kinHeader = document.createElement('h3');
  kinHeader.className = 'subsection-title';
  kinHeader.textContent = 'Next of kin';
  card.appendChild(kinHeader);

  card.appendChild(twoCol(
    textInput({
      label: 'Next of kin name',
      path: 'patientDemographics.nextOfKinName'
    }),
    textInput({
      label: 'Next of kin phone',
      path: 'patientDemographics.nextOfKinPhone',
      type: 'tel'
    })
  ));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Situation (S) — Reason for Transfer',
    description: 'Briefly state why the patient needs to be transferred now.'
  });
  card.appendChild(textArea({
    label: 'Reason for transfer',
    path: 'situation.reasonForTransfer',
    rows: 3,
    required: true,
    placeholder: 'e.g. Specialist input required for acute pancreatitis with rising amylase.'
  }));
  card.appendChild(textInput({
    label: 'Primary diagnosis',
    path: 'situation.primaryDiagnosis',
    required: true,
    placeholder: 'e.g. Acute pancreatitis'
  }));
  card.appendChild(radioGroup({
    label: 'Transfer urgency',
    path: 'situation.urgency',
    options: URGENCY_OPTIONS,
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Transfer type',
    path: 'situation.transferType',
    options: TRANSFER_TYPE_OPTIONS,
    required: true
  }));
  card.appendChild(textInput({
    label: 'Requested transfer date / time',
    path: 'situation.requestedDateTime',
    type: 'datetime-local'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Background (B) — Relevant History',
    description:
      'Concise background needed for the receiving team to take over safely.'
  });
  card.appendChild(textArea({
    label: 'Presenting complaint',
    path: 'background.presentingComplaint',
    rows: 2,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Relevant history of current admission',
    path: 'background.relevantHistory',
    rows: 3,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Past medical / surgical history',
    path: 'background.pastMedicalHistory',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Current medications',
    path: 'background.currentMedications',
    rows: 3,
    required: true,
    placeholder: 'List each drug, dose, route, frequency.'
  }));
  card.appendChild(textArea({
    label: 'Allergies / adverse reactions',
    path: 'background.allergies',
    rows: 2,
    required: true,
    placeholder: 'Document explicitly. Record "NKDA" if no known drug allergies.'
  }));
  card.appendChild(textArea({
    label: 'Recent investigations / results',
    path: 'background.recentInvestigations',
    rows: 3,
    placeholder: 'e.g. bloods, imaging, microbiology, ECG.'
  }));
  card.appendChild(textArea({
    label: 'Infection / colonisation status',
    path: 'background.infectionStatus',
    rows: 2,
    required: true,
    placeholder: 'e.g. MRSA negative on screening, COVID-19 swab pending, none known.'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Assessment (A) — Current Clinical Status',
    description:
      'Summary of how the patient is now and the latest set of vital signs.'
  });
  card.appendChild(textArea({
    label: 'Current clinical status',
    path: 'assessment.currentClinicalStatus',
    rows: 4,
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Conscious level',
    path: 'assessment.consciousLevel',
    options: CONSCIOUS_OPTIONS,
    required: true
  }));

  const vitalsHeader = document.createElement('h3');
  vitalsHeader.className = 'subsection-title';
  vitalsHeader.textContent = 'Vital signs';
  card.appendChild(vitalsHeader);

  const vitalsGrid = document.createElement('div');
  vitalsGrid.className = 'vitals-grid';
  vitalsGrid.appendChild(numberInput({
    label: 'Heart rate',
    path: 'assessment.vitalSigns.heartRate',
    min: 0, max: 300, step: 1, unit: 'bpm'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'Respiratory rate',
    path: 'assessment.vitalSigns.respiratoryRate',
    min: 0, max: 80, step: 1, unit: '/min'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'Systolic BP',
    path: 'assessment.vitalSigns.systolicBloodPressure',
    min: 0, max: 300, step: 1, unit: 'mmHg'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'Diastolic BP',
    path: 'assessment.vitalSigns.diastolicBloodPressure',
    min: 0, max: 200, step: 1, unit: 'mmHg'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'Temperature',
    path: 'assessment.vitalSigns.temperatureCelsius',
    min: 25, max: 45, step: 0.1, unit: '°C'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'Oxygen saturation',
    path: 'assessment.vitalSigns.oxygenSaturation',
    min: 0, max: 100, step: 1, unit: '%'
  }));
  vitalsGrid.appendChild(numberInput({
    label: 'NEWS2 score',
    path: 'assessment.vitalSigns.newsScore',
    min: 0, max: 20, step: 1
  }));
  card.appendChild(vitalsGrid);

  card.appendChild(radioGroup({
    label: 'Clinically stable for transfer?',
    path: 'assessment.clinicallyStable',
    options: YES_NO_UNKNOWN,
    required: true
  }));
  if (
    state.assessment.clinicallyStable === 'no' ||
    state.assessment.clinicallyStable === 'unknown'
  ) {
    card.appendChild(textArea({
      label: 'Stability notes / concerns',
      path: 'assessment.stabilityNotes',
      rows: 3,
      required: state.assessment.clinicallyStable === 'no',
      placeholder: 'Describe instability and what is being done about it.'
    }));
  }
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Recommendation (R) — Requested Action',
    description:
      'Be specific about what you are asking the receiving provider to do.'
  });
  card.appendChild(textArea({
    label: 'Requested action',
    path: 'recommendation.requestedAction',
    rows: 3,
    required: true,
    placeholder: 'e.g. Accept for HDU monitoring; review by gastroenterology within 4 hours.'
  }));
  card.appendChild(textArea({
    label: 'Expected outcomes / goals of transfer',
    path: 'recommendation.expectedOutcomes',
    rows: 2
  }));
  card.appendChild(textArea({
    label: 'Ongoing care plan',
    path: 'recommendation.ongoingCarePlan',
    rows: 3,
    required: true,
    placeholder: 'Treatments to continue, reviews booked, escalation plan.'
  }));
  card.appendChild(textArea({
    label: 'Pending results / follow-up',
    path: 'recommendation.pendingResults',
    rows: 2,
    placeholder: 'Tests booked, samples sent, results outstanding and how to chase them.'
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Transfer Logistics',
    description:
      'Practical details the transport service and receiving area need.'
  });
  card.appendChild(radioGroup({
    label: 'Transport mode',
    path: 'transferLogistics.transportMode',
    options: TRANSPORT_MODE_OPTIONS,
    required: true
  }));
  card.appendChild(twoCol(
    textInput({
      label: 'Planned departure date / time',
      path: 'transferLogistics.departureDateTime',
      type: 'datetime-local',
      required: true
    }),
    textInput({
      label: 'Estimated arrival date / time',
      path: 'transferLogistics.estimatedArrivalDateTime',
      type: 'datetime-local'
    })
  ));

  const requirementsHeader = document.createElement('h3');
  requirementsHeader.className = 'subsection-title';
  requirementsHeader.textContent = 'Transport requirements';
  card.appendChild(requirementsHeader);

  const requirementsList = document.createElement('div');
  requirementsList.className = 'checkbox-list';
  requirementsList.appendChild(checkbox({
    label: 'Clinical escort required',
    path: 'transferLogistics.escortRequired'
  }));
  requirementsList.appendChild(checkbox({
    label: 'Supplemental oxygen required',
    path: 'transferLogistics.oxygenRequired'
  }));
  requirementsList.appendChild(checkbox({
    label: 'Cardiac monitoring required',
    path: 'transferLogistics.cardiacMonitoringRequired'
  }));
  requirementsList.appendChild(checkbox({
    label: 'Infectious precautions required',
    path: 'transferLogistics.infectiousPrecautions'
  }));
  requirementsList.appendChild(checkbox({
    label: 'Falls risk',
    path: 'transferLogistics.fallsRisk'
  }));
  requirementsList.appendChild(checkbox({
    label: 'Mental Capacity Act / safeguarding concerns',
    path: 'transferLogistics.mentalCapacityConcerns'
  }));
  card.appendChild(requirementsList);

  if (state.transferLogistics.escortRequired) {
    card.appendChild(textArea({
      label: 'Escort details',
      path: 'transferLogistics.escortDetails',
      rows: 2,
      required: true,
      placeholder: 'Who is escorting, qualifications, what equipment they bring.'
    }));
  }
  if (state.transferLogistics.infectiousPrecautions) {
    card.appendChild(textArea({
      label: 'Infectious-precaution details',
      path: 'transferLogistics.infectiousPrecautionsDetails',
      rows: 2,
      required: true,
      placeholder: 'e.g. droplet precautions for influenza A; contact precautions for C. difficile.'
    }));
  }

  card.appendChild(textArea({
    label: 'Equipment / lines / drains accompanying patient',
    path: 'transferLogistics.equipmentRequired',
    rows: 3,
    placeholder: 'e.g. peripheral IV (right ACF), urinary catheter, NG tube on free drainage.'
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Sign-off & Acknowledgement',
    description:
      'Requesting provider signs the handover; receiving provider acknowledges acceptance on arrival.',
    extraClass: 'acknowledgement'
  });

  const requestingHeader = document.createElement('h3');
  requestingHeader.className = 'subsection-title';
  requestingHeader.textContent = 'Requesting provider sign-off';
  card.appendChild(requestingHeader);

  card.appendChild(twoCol(
    textInput({
      label: 'Signature (typed full name)',
      path: 'signoffAcknowledgement.requestingProviderSignature',
      required: true
    }),
    textInput({
      label: 'Signature date',
      path: 'signoffAcknowledgement.requestingProviderSignatureDate',
      type: 'date',
      required: true
    })
  ));

  const note = document.createElement('p');
  note.className = 'info-note';
  note.textContent =
    'The fields below are filled in by the receiving provider on arrival. Validation rules for the receipt-side only fire once any acknowledgement field is filled in.';
  card.appendChild(note);

  const receivingHeader = document.createElement('h3');
  receivingHeader.className = 'subsection-title';
  receivingHeader.textContent = 'Receiving provider acknowledgement';
  card.appendChild(receivingHeader);

  card.appendChild(textInput({
    label: 'Receiving provider name',
    path: 'signoffAcknowledgement.receivingProviderName'
  }));
  card.appendChild(twoCol(
    textInput({
      label: 'Receiving provider signature (typed full name)',
      path: 'signoffAcknowledgement.receivingProviderSignature'
    }),
    textInput({
      label: 'Signature date',
      path: 'signoffAcknowledgement.receivingProviderSignatureDate',
      type: 'date'
    })
  ));
  card.appendChild(checkbox({
    label: 'Acknowledgement received and care accepted',
    path: 'signoffAcknowledgement.acknowledgementReceived'
  }));
  card.appendChild(textArea({
    label: 'Acknowledgement notes',
    path: 'signoffAcknowledgement.acknowledgementNotes',
    rows: 2,
    placeholder: 'Any caveats noted by the receiving provider on acceptance.'
  }));
  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Compute progress: how many currently-applicable rules are satisfied.
 * Uses the same validator as submit so progress and missing counts agree.
 */
function updateProgress() {
  const result = validateTransfer(state);
  const total = result.totalRequired;
  const answered = result.totalSatisfied;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) {
    text.textContent =
      `${answered} of ${total} fields answered (${percent}%) — ` +
      `${result.mandatorySatisfied}/${result.mandatoryRequired} mandatory`;
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

function completenessBadgeClass(level) {
  switch (level) {
    case 'complete': return 'complete';
    case 'partial': return 'partial';
    case 'incomplete': return 'incomplete';
    default: return '';
  }
}

function renderReport() {
  if (!lastResult) return;
  const { validation, flags, timestamp } = lastResult;
  const out = document.getElementById('report');
  if (!out) return;

  const completenessBadge =
    `<span class="completeness-badge ${completenessBadgeClass(validation.completeness)}">${esc(completenessLabel(validation.completeness))}</span>`;

  const sectionRows = validation.sections.map((s) => {
    const missingItems = s.missing.length === 0
      ? '<span class="muted">All required fields completed.</span>'
      : `<ul class="missing-list">${s.missing.map(
          (m) => `<li>${esc(m.id)} — ${esc(m.description)}${m.mandatory ? ' <strong>(mandatory)</strong>' : ''}</li>`
        ).join('')}</ul>`;
    return `
      <tr>
        <th scope="row">${esc(sectionLabel(s.section))}</th>
        <td>${s.satisfied} / ${s.required}<br><span class="muted">${s.mandatorySatisfied}/${s.mandatoryRequired} mandatory</span></td>
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
        <h2>Provider Transfer Request — submission report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="completeness">
        ${completenessBadge}
        <span>${validation.totalSatisfied} of ${validation.totalRequired} fields answered, ${validation.mandatorySatisfied} of ${validation.mandatoryRequired} mandatory.</span>
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
  const validation = validateTransfer(state);
  const flags = detectFlaggedIssues(state);
  lastResult = {
    validation,
    flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh provider transfer request?')) return;
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
  renderStep1, renderStep2, renderStep3, renderStep4, renderStep5,
  renderStep6, renderStep7, renderStep8, renderStep9
];

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  // Preserve scroll position across re-renders.
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
