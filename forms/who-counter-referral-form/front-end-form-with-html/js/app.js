// WHO Counter-Referral Form — patient wizard (vanilla JS, classic script).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a top-of-page progress
// summary reflects how many fields have been answered. Submission runs the
// pure validation engine and the flagged-issues detector and renders an
// inline report. State is persisted to localStorage so a partial fill
// survives a page reload.
//
// Sibling modules loaded as plain `<script>` tags (in order) attach their
// exports to `window.WhoCounterReferralForm`. Pulling them off here keeps the
// rest of this file referring to short local names. Whole file wrapped in
// an IIFE so its top-level identifiers don't leak to the global scope.

(function () {
'use strict';
const {
  emptyAssessment,
  validateCounterReferral,
  detectFlaggedIssues,
  sectionLabel,
  priorityLabel
} = window.WhoCounterReferralForm;

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

function saveState(state) {
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
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

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
  saveState(state);
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
// Component builders
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const value = getAt(opts.path) || '';
  const labelText =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    'id="' + id + '"',
    'name="' + id + '"',
    'type="' + type + '"',
    'class="text-input"',
    'value="' + esc(value) + '"'
  ];
  if (opts.placeholder) attrs.push('placeholder="' + esc(opts.placeholder) + '"');
  if (opts.required) attrs.push('required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label for="' + id + '">' + labelText + '</label>' +
    '<input ' + attrs.join(' ') + '>';

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => setAt(opts.path, input.value));
  return wrapper;
}

function textArea(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const value = getAt(opts.path) || '';
  const labelText =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label for="' + id + '">' + labelText + '</label>' +
    '<textarea id="' + id + '" name="' + id + '" rows="' + (opts.rows || 3) + '" ' +
    (opts.placeholder ? 'placeholder="' + esc(opts.placeholder) + '" ' : '') +
    'class="text-area-input">' + esc(value) + '</textarea>';
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setAt(opts.path, ta.value));
  return wrapper;
}

function radioGroup(opts) {
  const groupId = 'g-' + opts.path.replace(/\./g, '-');
  const current = getAt(opts.path);
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = groupId + '-' + option.value;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML =
      '<input type="radio" id="' + radioId + '" name="' + groupId +
      '" value="' + esc(option.value) + '"' + checked + '>' +
      '<span>' + esc(option.label) + '</span>';
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setAt(opts.path, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

function checkbox(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const checked = !!getAt(opts.path);
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox-row';
  wrapper.htmlFor = id;
  wrapper.innerHTML =
    '<input type="checkbox" id="' + id + '" name="' + id + '"' +
    (checked ? ' checked' : '') + '>' +
    '<span>' + esc(opts.label) + '</span>';
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => setAt(opts.path, input.checked));
  return wrapper;
}

function subheader(text, note) {
  const wrap = document.createElement('div');
  const h = document.createElement('h3');
  h.className = 'subheader';
  h.textContent = text;
  wrap.appendChild(h);
  if (note) {
    const p = document.createElement('p');
    p.className = 'subnote';
    p.textContent = note;
    wrap.appendChild(p);
  }
  return wrap;
}

function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = 'step-' + opts.stepNumber;
  const desc = opts.description
    ? '<p class="section-description">' + esc(opts.description) + '</p>'
    : '';
  card.innerHTML =
    '<header class="section-header">' +
    '<span class="section-step">Section ' + opts.stepNumber + ' of 7</span>' +
    '<h2 class="section-title">' + esc(opts.title) + '</h2>' +
    desc +
    '</header>';
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
  note.className = 'note-box';
  note.textContent =
    'Note: Attach a copy of the discharge medication chart or current medications list, including doses and time of last dose.';
  card.appendChild(note);

  return card;
}

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
// Progress
// ----------------------------------------------------------------------

function updateProgress() {
  const result = validateCounterReferral(state);
  const total = result.totalRequired;
  const answered = result.totalSatisfied;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = percent + '%';
  if (text) {
    text.textContent =
      answered + ' of ' + total + ' required fields answered (' + percent + '%)';
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
  const out = document.getElementById('report');
  if (!out) return;

  const { validation, flags, timestamp } = lastResult;

  const completenessBadge = validation.complete
    ? '<span class="completeness-banner completeness-complete">Form complete</span>'
    : '<span class="completeness-banner completeness-incomplete">' +
      validation.missing.length + ' field(s) missing</span>';

  const sectionRow = (sec) => {
    const status = sec.required === sec.satisfied
      ? '<span class="section-status-complete">Complete</span>'
      : '<span class="section-status-incomplete">' +
        (sec.required - sec.satisfied) + ' missing</span>';
    return '<tr>' +
      '<th scope="row">' + esc(sectionLabel(sec.section)) + '</th>' +
      '<td>' + sec.satisfied + ' / ' + sec.required + '</td>' +
      '<td>' + status + '</td>' +
      '</tr>';
  };

  const sectionsList = validation.sections.length === 0
    ? '<p class="muted">No required fields were checked.</p>'
    : '<table class="sections">' +
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
    '<div class="report-card">' +
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
      '</div>' +
    '</div>';
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startOverBtn = document.getElementById('start-over-btn');
  if (startOverBtn) startOverBtn.addEventListener('click', startOver);
}

function submitForm() {
  const validation = validateCounterReferral(state);
  const flags = detectFlaggedIssues(state);
  lastResult = {
    validation: validation,
    flags: flags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh counter-referral form?')) return;
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
