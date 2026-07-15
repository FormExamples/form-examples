import { validateCounterReferral } from './counter-referral-validator.js';
import { detectFlaggedIssues } from './flagged-issues.js';
import { emptyAssessment, priorityLabel, sectionLabel } from './types.js';

// WHO Counter-Referral Form — single-page wizard controller (vanilla JS).
//
// Renders seven fieldset sections (Patient Identification, Facility Details,
// Situation, Background, Assessment, Recommendations, Provider Sign-off)
// into the #form-sections host, wires up navigation via the step-list table
// of contents, persists state to localStorage on every change, validates
// required fields on submit, and renders an inline report. Sibling modules
// (rules / validator / flagged-issues) are loaded as plain <script> tags and
// attach their public symbols to `window.WhoCounterReferralForm`. The whole
// file is wrapped in an IIFE so its top-level identifiers do not leak to
// the global scope.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'who-counter-referral-form.front-end-form-with-html.v1';

/** Deep-merge a partial saved object over a fresh empty so that any
 *  newly-added fields default correctly. */
function deepMerge(target, source) {
  if (!source || typeof source !== 'object') return target;
  for (const key of Object.keys(target)) {
    if (
      target[key] &&
      typeof target[key] === 'object' &&
      !Array.isArray(target[key])
    ) {
      if (source[key] && typeof source[key] === 'object') {
        deepMerge(target[key], source[key]);
      }
    } else if (source[key] !== undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return deepMerge(emptyAssessment(), parsed);
  } catch (e) {
    console.warn('Could not parse saved counter-referral form; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save counter-referral form to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored counter-referral form.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

let state = loadState();
/** Last grading result rendered into the report region. */
let lastResult = null;

/** Resolve a "section.path.to.field" string against state. */
function getAt(path) {
  const parts = path.split('.');
  let cur = state;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

/** Set "section.path.to.field" on state, persist, and refresh UI. */
function setAt(path, value) {
  const parts = path.split('.');
  let cur = state;
  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
  saveState();
  updateProgress();
  updateConditionalSections();
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
// Component builders (Lily HTML headless contract)
// ----------------------------------------------------------------------

function lilyInputClass(type) {
  switch (type) {
    case 'email':           return 'email-input';
    case 'number':          return 'number-input';
    case 'date':            return 'date-input';
    case 'time':            return 'time-input';
    case 'datetime-local':  return 'datetime-input';
    case 'tel':             return 'tel-input';
    case 'url':             return 'url-input';
    case 'search':          return 'search-input';
    default:                return 'text-input';
  }
}

function fieldId(path) {
  return 'f-' + path.replace(/\./g, '-');
}

function textInput(opts) {
  const id = fieldId(opts.path);
  const value = getAt(opts.path) || '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value)}"`,
    `aria-describedby="${id}-error"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    <span class="error-message" id="${id}-error"></span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    setAt(opts.path, input.value);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = fieldId(opts.path);
  const value = getAt(opts.path) || '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      ${opts.required ? 'required data-required' : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setAt(opts.path, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = fieldId(opts.path);
  const current = getAt(opts.path);
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
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}${opts.required ? ' data-required-radio' : ''}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) {
        setAt(opts.path, option.value);
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

function checkbox(opts) {
  const id = fieldId(opts.path);
  const checked = !!getAt(opts.path);
  const wrapper = document.createElement('div');
  wrapper.className = 'field checkbox-field';
  wrapper.innerHTML = `
    <label class="checkbox-row" for="${id}">
      <input class="checkbox-input" type="checkbox" id="${id}" name="${id}"${checked ? ' checked' : ''}>
      <span>${esc(opts.label)}</span>
    </label>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => setAt(opts.path, input.checked));
  return wrapper;
}

function subheader(text, note) {
  const wrap = document.createElement('div');
  wrap.className = 'subheader-block';
  const h = document.createElement('h3');
  h.className = 'subsection-heading';
  h.textContent = text;
  wrap.appendChild(h);
  if (note) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = note;
    wrap.appendChild(p);
  }
  return wrap;
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
  legend.innerHTML = `
    <span class="section-step">Section ${opts.stepNumber} of ${STEP_DEFINITIONS.length}</span>
    <span class="section-title">${esc(opts.title)}</span>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Identification',
    description:
      'Identify the patient being discharged from the referral facility back to primary care.'
  });

  card.appendChild(textInput({
    label: 'Patient name (LAST, First)',
    path: 'patientIdentification.patientName',
    placeholder: 'DOE, Jane',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Date of birth',
    path: 'patientIdentification.dateOfBirth',
    type: 'date',
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Sex',
    path: 'patientIdentification.sex',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'unknown', label: 'Unknown' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Patient contact information',
    path: 'patientIdentification.patientContact',
    placeholder: 'Phone number, address, or other contact',
    required: true
  }));

  card.appendChild(subheader('Emergency contact person'));
  card.appendChild(textInput({
    label: 'Name',
    path: 'patientIdentification.emergencyContact.name',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Contact information',
    path: 'patientIdentification.emergencyContact.contactInformation',
    placeholder: 'Phone, relationship, etc.',
    required: true
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Facility Details',
    description:
      'Initiating facility, referral facility, primary care facility, communication, and follow-up timeframe.'
  });

  card.appendChild(subheader('Initiating facility (originally referred patient)'));
  card.appendChild(textInput({
    label: 'Name',
    path: 'facilityDetails.initiatingFacility.name',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Focal point (contact person)',
    path: 'facilityDetails.initiatingFacility.focalPoint',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Phone number',
    path: 'facilityDetails.initiatingFacility.phoneNumber',
    type: 'tel',
    required: true
  }));

  card.appendChild(textInput({
    label: 'Date of original referral',
    path: 'facilityDetails.referralDate',
    type: 'date',
    required: true
  }));
  card.appendChild(textArea({
    label: 'Reason for original referral',
    path: 'facilityDetails.referralReason',
    rows: 3,
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Acuity',
    path: 'facilityDetails.acuity',
    required: true,
    options: [
      { value: 'acute', label: 'Acute' },
      { value: 'non-acute', label: 'Non-acute' }
    ]
  }));

  card.appendChild(subheader('Referral facility (treated and now discharging patient)'));
  card.appendChild(textInput({
    label: 'Name',
    path: 'facilityDetails.referralFacility.name',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Focal point (contact person)',
    path: 'facilityDetails.referralFacility.focalPoint',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Phone number',
    path: 'facilityDetails.referralFacility.phoneNumber',
    type: 'tel',
    required: true
  }));

  card.appendChild(subheader(
    'Communication',
    'Tick at least one. Confirm that follow-up arrangements have been discussed.'
  ));
  card.appendChild(checkbox({
    label: 'Discussed with primary care provider',
    path: 'facilityDetails.communication.discussedWithPrimaryCareProvider'
  }));
  card.appendChild(checkbox({
    label: 'Discussed with initiating facility',
    path: 'facilityDetails.communication.discussedWithInitiatingFacility'
  }));

  card.appendChild(subheader('Primary care facility (ongoing care)'));
  card.appendChild(textInput({
    label: 'Name',
    path: 'facilityDetails.primaryCareFacility.name'
  }));
  card.appendChild(textInput({
    label: 'Focal point (contact person)',
    path: 'facilityDetails.primaryCareFacility.focalPoint'
  }));
  card.appendChild(textInput({
    label: 'Phone number',
    path: 'facilityDetails.primaryCareFacility.phoneNumber',
    type: 'tel'
  }));

  card.appendChild(radioGroup({
    label: 'Time frame for primary care follow-up with patient',
    path: 'facilityDetails.followUpTimeframe',
    required: true,
    options: [
      { value: 'urgent-within-24-hours', label: 'Urgent (within 24 hours)' },
      { value: '2-to-6-days', label: '2–6 days' },
      { value: '1-to-2-weeks', label: '1–2 weeks' },
      { value: 'more-than-2-weeks', label: '> 2 weeks' }
    ]
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Situation',
    description:
      'The first part of the SBAR communication framework. Describe what brought the patient in and what care was delivered at the referral facility.'
  });

  card.appendChild(textArea({
    label: 'Chief complaint',
    path: 'situation.chiefComplaint',
    rows: 2,
    placeholder: "In the patient's own words where possible (e.g. 'severe chest pain').",
    required: true
  }));
  card.appendChild(textArea({
    label: 'Primary diagnosis',
    path: 'situation.primaryDiagnosis',
    rows: 2,
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Pregnant?',
    path: 'situation.pregnant',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: 'Unknown' }
    ]
  }));
  card.appendChild(textArea({
    label: 'Treatments initiated',
    path: 'situation.treatmentsInitiated',
    rows: 3,
    placeholder:
      'Therapies, medications, procedures, fluids initiated at the referral facility.',
    required: true
  }));

  card.appendChild(subheader(
    'Episode flags',
    'Tick any that apply during this referral episode.'
  ));
  card.appendChild(checkbox({ label: 'ICU stay', path: 'situation.icuStay' }));
  card.appendChild(checkbox({ label: 'Surgery performed', path: 'situation.surgery' }));
  card.appendChild(checkbox({ label: 'Hospitalised', path: 'situation.hospitalized' }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Background',
    description:
      'The second part of the SBAR framework. Briefly describe the relevant history and significant events during the referral episode.'
  });
  card.appendChild(textArea({
    label: 'Brief history of present illness',
    path: 'background.historyOfPresentIllness',
    rows: 3,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Relevant past medical history',
    path: 'background.pastMedicalHistory',
    rows: 3,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Significant investigations or events during the referral episode',
    path: 'background.significantEvents',
    rows: 3,
    placeholder:
      'Notable investigations, procedures, complications, or other events.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Assessment',
    description:
      'The third part of the SBAR framework. Final diagnoses, prognosis, goals of care, and patient/family communication.'
  });
  card.appendChild(textArea({
    label: 'Final diagnoses / problem list',
    path: 'assessment.finalDiagnoses',
    rows: 4,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Prognosis and goals of care',
    path: 'assessment.prognosisAndGoalsOfCare',
    rows: 3,
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Patient/family informed of diagnosis',
    path: 'assessment.patientFamilyInformed',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  }));

  // Conditional: explanation when patientFamilyInformed === 'yes' (rule ASS-04).
  const conditional = document.createElement('div');
  conditional.dataset.conditional = 'assessment.patientFamilyInformed=yes';
  conditional.appendChild(textArea({
    label: 'Explain how the patient/family were informed',
    path: 'assessment.informedExplanation',
    rows: 3,
    required: true
  }));
  card.appendChild(conditional);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Recommendations',
    description:
      'The fourth part of the SBAR framework. Follow-up plan, pending investigations, deterioration instructions, and status flags.'
  });
  card.appendChild(textArea({
    label: 'Next steps in follow-up plan',
    path: 'recommendations.followUpPlan',
    rows: 4,
    required: true
  }));
  card.appendChild(textArea({
    label: 'Pending investigations (results awaited)',
    path: 'recommendations.pendingInvestigations',
    rows: 3,
    placeholder: 'List any results that are not yet available.'
  }));
  card.appendChild(textArea({
    label: 'Follow-up arrangements (when, where, with whom)',
    path: 'recommendations.followUpArrangements',
    rows: 3,
    required: true
  }));
  card.appendChild(textArea({
    label: "Instructions if patient's condition deteriorates",
    path: 'recommendations.deteriorationInstructions',
    rows: 3,
    required: true
  }));

  card.appendChild(subheader('Contact for follow-up questions'));
  card.appendChild(textInput({
    label: 'Contact name',
    path: 'recommendations.contactName',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Contact information',
    path: 'recommendations.contactInformation',
    placeholder: 'Phone, email, etc.',
    required: true
  }));

  card.appendChild(subheader(
    'Status flags',
    'Tick any that apply to this patient.'
  ));
  card.appendChild(checkbox({
    label: 'Cognitive impairment',
    path: 'recommendations.statusFlags.cognitiveImpairment'
  }));
  card.appendChild(checkbox({
    label: 'Carer-dependent',
    path: 'recommendations.statusFlags.carerDependent'
  }));
  card.appendChild(checkbox({
    label: 'Spinal precautions',
    path: 'recommendations.statusFlags.spinalPrecautions'
  }));
  card.appendChild(checkbox({
    label: 'Weight-bearing restrictions',
    path: 'recommendations.statusFlags.weightBearingRestrictions'
  }));
  card.appendChild(checkbox({
    label: 'Palliative care',
    path: 'recommendations.statusFlags.palliativeCare'
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Referral Facility Provider Sign-off',
    description:
      'The provider at the referral facility certifies the information on this counter-referral form.'
  });
  card.appendChild(textInput({
    label: 'Provider name',
    path: 'providerSignOff.providerName',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Signature',
    path: 'providerSignOff.signature',
    placeholder: 'Type your full name to sign',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Date',
    path: 'providerSignOff.signatureDate',
    type: 'date',
    required: true
  }));

  const note = document.createElement('div');
  note.className = 'alert';
  note.setAttribute('data-type', 'info');
  note.textContent =
    'Note: Attach a copy of the discharge medication chart or current medications list, including doses and time of last dose.';
  card.appendChild(note);

  return card;
}

// ----------------------------------------------------------------------
// Step renderers and definitions
// ----------------------------------------------------------------------

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4,
  renderStep5, renderStep6, renderStep7
];

const STEP_DEFINITIONS = [
  { step: 1, section: 'patientIdentification', title: 'Patient Identification' },
  { step: 2, section: 'facilityDetails',       title: 'Facility Details' },
  { step: 3, section: 'situation',             title: 'Situation' },
  { step: 4, section: 'background',            title: 'Background' },
  { step: 5, section: 'assessment',            title: 'Assessment' },
  { step: 6, section: 'recommendations',       title: 'Recommendations' },
  { step: 7, section: 'providerSignOff',       title: 'Provider Sign-off' }
];

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  const hosts = document.querySelectorAll('[data-conditional]');
  hosts.forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const eq = expr.indexOf('=');
    const path = expr.substring(0, eq);
    const target = expr.substring(eq + 1);
    const current = getAt(path);
    const visible = String(current) === target;
    host.style.display = visible ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress (driven by the validator's per-section completeness)
// ----------------------------------------------------------------------

function updateProgress() {
  const result = validateCounterReferral(state);
  const total = result.totalRequired;
  const answered = result.totalSatisfied;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);

  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) {
    text.textContent = answered + ' of ' + total + ' required fields answered (' + percent + '%)';
  }

  // Build per-section answered/required tallies from the validator output.
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const sec of result.sections) {
    sectionTotal[sec.section] = sec.required;
    sectionAnswered[sec.section] = sec.satisfied;
  }
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

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
      if (t > 0 && firstUnfinished === -1) firstUnfinished = def.step;
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
// Validation (per-field errors + summary)
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
  // For radio groups the input id is the synthetic group id; clear any
  // marker attribute on the fieldset.
  const fs = document.getElementById(`${id}-fieldset`);
  if (fs) fs.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
  const fs = document.getElementById(`${id}-fieldset`);
  if (fs) fs.setAttribute('aria-invalid', 'true');
}

/** Map a fired-rule section/id pair to the synthetic DOM id we used when
 *  rendering the field, when we can. The rules engine already tracks
 *  which field each rule guards via convention in counter-referral-rules.js;
 *  for any rule we can't resolve to a concrete input, we fall back to the
 *  step-N anchor so the user can still jump to the right section. */
function fieldIdForMissingRule(rule) {
  // Heuristic: derive from rule id prefix. The rules file uses prefixes
  // tied to section keys (e.g. PID-, FAC-, SIT-, BG-, ASS-, REC-, SIG-).
  // Without parsing rule internals, fall back to the section anchor.
  return null;
}

function validateForm() {
  const result = validateCounterReferral(state);
  const errors = [];
  // Clear any stale per-field errors first.
  document.querySelectorAll('.error-message').forEach((el) => { el.textContent = ''; });
  document.querySelectorAll('[aria-invalid="true"]').forEach((el) =>
    el.removeAttribute('aria-invalid'));

  for (const m of result.missing) {
    const targetId = fieldIdForMissingRule(m);
    const message = m.description;
    errors.push({
      id: targetId || `step-${stepNumberForSection(m.section)}`,
      message: `${sectionLabel(m.section)}: ${message}`,
      ruleId: m.id
    });
    if (targetId) setFieldError(targetId, message);
  }

  renderErrorSummary(errors);
  return errors;
}

function stepNumberForSection(section) {
  const def = STEP_DEFINITIONS.find((d) => d.section === section);
  return def ? def.step : 1;
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
  summary.innerHTML = `
    <strong>Please complete the following before submitting:</strong>
    <ul>
      ${errors.map((e) =>
        `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'urgent': return 'flag-urgent';
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

  const { validation, flags, timestamp } = lastResult;

  const completenessBadge = validation.complete
    ? '<span class="status-badge status-complete">Form complete</span>'
    : '<span class="status-badge status-incomplete">' +
      validation.missing.length + ' field(s) missing</span>';

  const sectionRow = (sec) => {
    const status = sec.required === sec.satisfied
      ? '<span class="status-badge status-complete">Complete</span>'
      : '<span class="status-badge status-incomplete">' +
        (sec.required - sec.satisfied) + ' missing</span>';
    return '<tr>' +
      '<th scope="row">' + esc(sectionLabel(sec.section)) + '</th>' +
      '<td>' + sec.satisfied + ' / ' + sec.required + '</td>' +
      '<td>' + status + '</td>' +
      '</tr>';
  };

  const sectionsList = validation.sections.length === 0
    ? '<p class="muted">No required fields were checked.</p>'
    : '<table class="report-table">' +
      '<thead><tr><th scope="col">Section</th><th scope="col">Answered</th><th scope="col">Status</th></tr></thead>' +
      '<tbody>' + validation.sections.map(sectionRow).join('') + '</tbody>' +
      '</table>';

  const missingList = validation.missing.length === 0
    ? '<p class="muted">All required fields have been answered.</p>'
    : '<ul class="missing-list">' +
      validation.missing.map((m) =>
        '<li><span class="rule-id">' + esc(m.id) + '</span>' +
        esc(m.description) +
        ' <em>(' + esc(sectionLabel(m.section)) + ')</em></li>'
      ).join('') +
      '</ul>';

  const flagsList = flags.length === 0
    ? '<p class="muted">No clinical flags raised.</p>'
    : '<ul class="flags">' +
      flags.map((f) =>
        '<li class="' + priorityClass(f.priority) + '">' +
        '<span class="flag-priority">' + esc(priorityLabel(f.priority).toUpperCase()) + '</span>' +
        '<span class="flag-category">' + esc(f.category) + '</span>' +
        '<span class="flag-message">' + esc(f.message) + '</span>' +
        '</li>'
      ).join('') +
      '</ul>';

  out.innerHTML =
    '<header class="report-header">' +
      '<h2>Counter-Referral Report</h2>' +
      '<p class="muted">Generated ' + esc(new Date(timestamp).toLocaleString()) + '</p>' +
      completenessBadge +
    '</header>' +

    '<h3>Section completeness</h3>' +
    sectionsList +

    '<h3>Missing required fields</h3>' +
    missingList +

    '<h3>Flagged issues</h3>' +
    flagsList +

    '<div class="report-actions">' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
    '</div>';
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) startOverBtn.addEventListener('click', startOver);
}

function submitForm() {
  // Per Lily flow, run validation and surface errors before generating
  // the report. We still render the report even when fields are missing
  // so the user sees the running tally.
  const errors = validateForm();
  const validation = validateCounterReferral(state);
  const flags = detectFlaggedIssues(state);
  lastResult = {
    validation: validation,
    flags: flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
  // If there were errors, the error summary is already shown and focused.
  // Returning silently keeps the report visible alongside it for context.
  void errors;
}

function startOver() {
  if (!window.confirm('Clear all answers and start a fresh counter-referral form?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
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
  if (!host) return;
  host.innerHTML = '';
  for (const r of STEP_RENDERERS) host.appendChild(r());
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();

  const submit = document.getElementById('submit-btn');
  const reset = document.getElementById('reset-btn');
  if (submit) submit.addEventListener('click', submitForm);
  if (reset) reset.addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Expose a small public surface for debugging in the browser console.
export const _getState = () => state;
export const _submitForm = submitForm;
