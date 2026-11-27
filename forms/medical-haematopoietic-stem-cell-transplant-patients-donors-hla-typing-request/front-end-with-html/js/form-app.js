import { calculateGrade } from './grader.js';
import { emptyRequest, donorTypeLabel, roleLabel } from './types.js';

// Medical Haematopoietic Stem Cell Transplant Patients/Donors HLA Typing Request — clinician wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page progress
// summary reflects how many fields have been answered. Submission runs the
// pure four-axis grader and renders an inline vetting report. State is
// persisted to localStorage so a partial fill survives a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request.front-end-form-with-html.v1';
const TOTAL_STEPS = 8;

// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  const fresh = emptyRequest();

  for (const key of Object.keys(fresh)) {
    const v = parsed && parsed[key];
    if (Array.isArray(fresh[key])) {
      fresh[key] = Array.isArray(v) ? v : [];
    } else if (v && typeof v === 'object') {
      fresh[key] = { ...fresh[key], ...v };
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyRequest();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved request; starting fresh.', e);
    return emptyRequest();
  }
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save request to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored request.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

// Captured before loadState() reads it, so js/restore-banner.js can tell
// "a previous draft was restored" apart from "this is a blank first visit"
// without needing to know the STORAGE_KEY itself (its exact naming isn't
// uniform fleet-wide -- some forms still carry the pre-consolidation
// `.front-end-form-with-html.v1` suffix).
let hadDraftAtLoad = false;
try {
  hadDraftAtLoad = localStorage.getItem(STORAGE_KEY) !== null;
} catch (e) {
  // Ignore; loadState() below will hit the same failure and fall back safely.
}

let state = loadState();
/** @type {ReturnType<typeof calculateGrade> | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'medical-haematopoietic-stem-cell-transplant-patients-donors-hla-typing-request',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    lastResult = null;
    document.getElementById('report').innerHTML =
      '<p class="empty-message">Submit the form to see the vetting report.</p>';
    renderErrorSummary([]);
    renderForm();
    updateProgress();
    updateConditionalSections();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

function setBool(section, field, checked) {
  state[section][field] = !!checked;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

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

function lilyInputClass(type) {
  switch (type) {
    case 'email':  return 'email-input';
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    case 'time':   return 'time-input';
    case 'datetime-local': return 'text-input';
    case 'tel':    return 'tel-input';
    case 'url':    return 'url-input';
    case 'search': return 'search-input';
    default:       return 'text-input';
  }
}

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
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    <span class="error-message" id="${id}-error"></span>
  `;

  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', `${id}-error`);
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    setField(opts.section, opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.required ? 'data-required' : ''}
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.section, opts.field, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select"${opts.required ? ' data-required' : ''} aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.section, opts.field, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

/** Single boolean toggle (checkbox) bound to a boolean field. */
function boolField(opts) {
  const id = `${opts.section}-${opts.field}`;
  const checked = state[opts.section][opts.field] === true;
  const wrapper = document.createElement('div');
  wrapper.className = 'bool-field';
  wrapper.innerHTML = `
    <input type="checkbox" class="checkbox-input" id="${id}" name="${id}"${checked ? ' checked' : ''}>
    <label for="${id}">${esc(opts.label)}</label>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setBool(opts.section, opts.field, input.checked);
  });
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
  legend.innerHTML = `
    <span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <h2 class="section-title">${esc(opts.title)}</h2>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

function subHead(text) {
  const h = document.createElement('h3');
  h.textContent = text;
  return h;
}

function grid(cols, children) {
  const g = document.createElement('div');
  g.className = cols;
  for (const c of children) g.appendChild(c);
  return g;
}

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const SEX_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown' }
];

const SUBJECT_ROLE_OPTIONS = [
  { value: 'hsct-recipient', label: 'HSCT recipient (patient)' },
  { value: 'potential-donor', label: 'Potential donor' }
];

const DONOR_TYPE_OPTIONS = [
  { value: 'matched-sibling', label: 'Matched sibling' },
  { value: 'haploidentical-relative', label: 'Haploidentical relative' },
  { value: 'other-relative', label: 'Other relative' },
  { value: 'unrelated-volunteer', label: 'Unrelated volunteer' },
  { value: 'unknown', label: 'Unknown' }
];

const RESOLUTION_OPTIONS = [
  { value: 'not-specified', label: 'Not specified' },
  { value: 'low', label: 'Low resolution' },
  { value: 'high', label: 'High resolution' }
];

const ROLE_OPTIONS = [
  { value: 'haematologist', label: 'Haematologist' },
  { value: 'transplant-physician', label: 'Transplant physician' },
  { value: 'transplant-coordinator', label: 'Transplant coordinator' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'phlebotomist', label: 'Phlebotomist' },
  { value: 'other', label: 'Other' }
];

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Person sampled',
    description: 'One request is completed for each person sampled: the recipient, or each potential donor. Use at least three identifiers that also appear on the sample.'
  });
  card.appendChild(selectInput({ label: 'Role', section: 'request', field: 'subjectRole', options: SUBJECT_ROLE_OPTIONS, required: true }));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Family name', section: 'subject', field: 'familyName', required: true }),
    textInput({ label: 'Given names', section: 'subject', field: 'givenNames' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Date of birth', section: 'subject', field: 'birthDate', type: 'date', required: true }),
    selectInput({ label: 'Sex', section: 'subject', field: 'sex', options: SEX_OPTIONS })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'National health identifier', section: 'subject', field: 'nationalHealthIdentifier' }),
    textInput({ label: 'Medical record number', section: 'subject', field: 'medicalRecordNumber' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Previous name', section: 'subject', field: 'previousName' }),
    textInput({ label: 'Ethnicity (allele frequencies differ by population)', section: 'subject', field: 'ethnicity' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Address (optional)', section: 'subject', field: 'address' }),
    textInput({ label: 'Postcode (optional)', section: 'subject', field: 'postcode' })
  ]));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Referrer and report',
    description: 'Who is requesting the typing and where the report goes. Use an authorized secure email address only.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Referrer name', section: 'referrer', field: 'clinicianName', required: true }),
    selectInput({ label: 'Role', section: 'referrer', field: 'clinicianRole', options: ROLE_OPTIONS })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Department', section: 'referrer', field: 'department' }),
    textInput({ label: 'Hospital or organization', section: 'referrer', field: 'organization' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Referrer email', section: 'referrer', field: 'clinicianEmail', type: 'email' }),
    textInput({ label: 'Report email', section: 'referrer', field: 'reportEmail', type: 'email' })
  ]));
  card.appendChild(textInput({ label: 'Copy of report to', section: 'referrer', field: 'copyOfReportTo' }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Clinical details',
    description: 'The disease and the indication for transplant or donation. The laboratory vets the request against these details.'
  });
  card.appendChild(textArea({ label: 'Clinical details (disease, indication for HSCT or donor information)', section: 'request', field: 'clinicalDetails', rows: 4 }));
  card.appendChild(grid('two-col', [
    selectInput({ label: 'Donor type (for a potential donor)', section: 'request', field: 'donorType', options: DONOR_TYPE_OPTIONS }),
    selectInput({ label: 'HLA typing resolution (optional)', section: 'request', field: 'hlaTypingResolution', options: RESOLUTION_OPTIONS })
  ]));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Linked recipient',
    description: 'For a potential donor: name the recipient and the relationship so the laboratory can pair the samples. Leave blank when sampling the recipient.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Recipient family name', section: 'recipient', field: 'recipientFamilyName' }),
    textInput({ label: 'Recipient given names', section: 'recipient', field: 'recipientGivenNames' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Recipient medical record number', section: 'recipient', field: 'recipientMedicalRecordNumber' }),
    textInput({ label: 'Recipient date of birth', section: 'recipient', field: 'recipientBirthDate', type: 'date' })
  ]));
  card.appendChild(textInput({ label: 'Relationship to recipient', section: 'recipient', field: 'relationshipToRecipient' }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Urgency',
    description: 'Urgent testing needs a reason and a telephone call to the laboratory.'
  });
  card.appendChild(boolField({ label: 'Sample requires urgent testing', section: 'urgency', field: 'urgentTesting' }));
  card.appendChild(textInput({ label: 'Reason for urgent testing', section: 'urgency', field: 'urgentTestingReason' }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Requester and consent',
    description: 'The requester is responsible for informed consent and identity verification.'
  });
  card.appendChild(textInput({ label: 'Signed at', section: 'requester', field: 'requestedBySignedAt', type: 'datetime-local' }));
  card.appendChild(boolField({ label: 'I confirm informed consent was obtained and identity verified', section: 'requester', field: 'consentAndIdentityConfirmed' }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Sample collection',
    description: 'Recipient: 18 mL purple EDTA + 6 mL pink EDTA (hand-labelled) + 6 mL clotted. Donor: 10 mL purple EDTA + 6 mL pink EDTA (hand-labelled). Volumes are local policy.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Collected by', section: 'sample', field: 'sampleCollectorName' }),
    textInput({ label: 'Collected at', section: 'sample', field: 'sampleCollectedAt', type: 'datetime-local' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Identifiers on sample labels', section: 'sample', field: 'identifiersOnSampleCount', type: 'number', min: 0, max: 10 }),
    textInput({ label: 'Identifiers on request form', section: 'sample', field: 'identifiersOnFormCount', type: 'number', min: 0, max: 10 })
  ]));
  card.appendChild(boolField({ label: 'Sample and form details match', section: 'sample', field: 'sampleAndFormDetailsMatch' }));
  card.appendChild(subHead('Volumes sent (mL)'));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Purple EDTA (mL)', section: 'sample', field: 'edtaPurpleVolumeMl', type: 'number', min: 0, max: 100 }),
    textInput({ label: 'Pink EDTA, hand-labelled (mL)', section: 'sample', field: 'edtaPinkVolumeMl', type: 'number', min: 0, max: 100 })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Clotted red (mL)', section: 'sample', field: 'clottedRedVolumeMl', type: 'number', min: 0, max: 100 }),
    textInput({ label: 'Other samples sent (if any)', section: 'sample', field: 'samplesOtherDescription' })
  ]));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Laboratory use and submit',
    description: 'Optional: completed by the receiving laboratory. Submit to compute the four-axis grade and flags.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Recipient identifier', section: 'lab', field: 'laboratoryRecipientIdentifier' }),
    textInput({ label: 'Donor identifier', section: 'lab', field: 'laboratoryDonorIdentifier' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Sample number', section: 'lab', field: 'laboratorySampleNumber' }),
    textInput({ label: 'Received at', section: 'lab', field: 'laboratorySampleReceivedAt', type: 'datetime-local' })
  ]));
  card.appendChild(textInput({ label: 'Sample identifiers checked by', section: 'lab', field: 'laboratoryIdentifiersCheckedBy' }));
  return card;
}

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4,
  renderStep5, renderStep6, renderStep7, renderStep8
];

// ----------------------------------------------------------------------
// Conditional sections (none currently, but keep the hook for parity)
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String(state[section]?.[field] ?? '');
    host.style.display = current === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  ['request', 'subjectRole'],
  ['subject', 'familyName'], ['subject', 'birthDate'], ['subject', 'nationalHealthIdentifier'],
  ['referrer', 'clinicianName'], ['referrer', 'reportEmail'],
  ['request', 'clinicalDetails'],
  ['requester', 'requestedBySignedAt'],
  ['sample', 'sampleCollectorName'], ['sample', 'identifiersOnSampleCount'],
  ['lab', 'laboratorySampleNumber']
];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const [section, field] of TRACKED_FIELDS) {
    sectionTotal[section] = (sectionTotal[section] || 0) + 1;
    if (isAnswered(state[section][field])) {
      answered++;
      sectionAnswered[section] = (sectionAnswered[section] || 0) + 1;
    }
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = answered + ' of ' + total + ' fields answered (' + percent + '%)';
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, section: 'subject',   title: 'Person sampled' },
  { step: 2, section: 'referrer',  title: 'Referrer' },
  { step: 3, section: 'request',   title: 'Clinical details' },
  { step: 4, section: 'recipient', title: 'Linked recipient' },
  { step: 5, section: 'urgency',   title: 'Urgency' },
  { step: 6, section: 'requester', title: 'Requester' },
  { step: 7, section: 'sample',    title: 'Sample' },
  { step: 8, section: 'lab',       title: 'Laboratory' }
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
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
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
  required.forEach((input) => {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = labelEl ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim() : id;
      errors.push({ id, message: `${label} is required` });
      setFieldError(id, `${label} is required`);
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
  summary.innerHTML = `
    <strong>Please correct the following:</strong>
    <ul>
      ${errors.map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
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

function titleCase(s) {
  return String(s || '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    appropriatenessScore,
    appropriatenessBand,
    identitySafetyBand,
    completenessPercent,
    triageTier,
    targetTimeframe,
    recommendation,
    recommendationLabel,
    firedRules,
    flags,
    requiredSamplesSummary,
    timestamp
  } = lastResult;

  const flagsList = flags.length === 0
    ? `<p class="muted">No safety flags raised.</p>`
    : `
      <ul class="flags">
        ${flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}</span>
            <span class="flag-action">${esc(f.suggestedAction)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.ruleId)}</th>
      <td>${esc(r.axis)}</td>
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No rules fired.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Axis</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const summaryBits = [
    roleLabel(state.request.subjectRole),
    state.request.subjectRole === 'potential-donor' ? donorTypeLabel(state.request.donorType) : ''
  ].filter(Boolean).join(' · ');

  out.innerHTML = `
    <h2>HSCT HLA Typing Request Vetting Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${summaryBits ? ` · ${esc(summaryBits)}` : ''}</p>

    <div class="recommendation-banner">
      <span class="band-badge rec-${esc(recommendation)}">${esc(recommendationLabel)}</span>
      <span class="band-badge tier-${esc(triageTier)}">${esc(titleCase(triageTier))}${targetTimeframe ? ` · ${esc(targetTimeframe)}` : ''}</span>
    </div>

    <h3>Four-axis grade</h3>
    <div class="axis-grid">
      <div class="axis-card">
        <span class="axis-name">A · Appropriateness</span>
        <span class="axis-value">
          <span class="score-meter"><strong>${appropriatenessScore}</strong> / 9</span>
          <span class="band-badge band-${esc(appropriatenessBand)}">${esc(titleCase(appropriatenessBand))}</span>
        </span>
      </div>
      <div class="axis-card">
        <span class="axis-name">B · Identity / sample safety</span>
        <span class="axis-value"><span class="band-badge identity-${esc(identitySafetyBand)}">${esc(titleCase(identitySafetyBand))}</span></span>
      </div>
      <div class="axis-card">
        <span class="axis-name">C · Completeness</span>
        <span class="axis-value"><strong>${completenessPercent}%</strong></span>
        <div class="completeness-bar"><span style="width:${completenessPercent}%"></span></div>
      </div>
      <div class="axis-card">
        <span class="axis-name">D · Triage priority</span>
        <span class="axis-value"><span class="band-badge tier-${esc(triageTier)}">${esc(titleCase(triageTier))}</span></span>
      </div>
    </div>

    <h3>Sample tubes needed</h3>
    <p>${requiredSamplesSummary ? esc(requiredSamplesSummary) : '<span class="muted">No tests selected.</span>'}</p>

    <h3>Fired rules</h3>
    ${firedTable}

    <h3>Safety flags</h3>
    ${flagsList}

    <div class="report-actions">
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  const result = calculateGrade(state);
  lastResult = {
    ...result,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh request?')) return;
  clearState();
  state = emptyRequest();
  lastResult = null;
  document.getElementById('report').innerHTML =
    '<p class="empty-message">Submit the form to see the vetting report.</p>';
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
  for (const r of STEP_RENDERERS) host.appendChild(r());
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
