import { detectFlaggedIssues } from './flags.js';
import { validateRegistration } from './grader.js';
import { birthCountryLabel, emptyRegistration, identityDocumentLabel, informantRelationshipLabel, parentsRelationshipLabel, paternityBasisLabel, priorityLabel, readinessClassClass, readinessClassLabel, registrationRouteLabel, sexLabel, yesNoLabel } from './types.js';
import { missingItems, STATUTORY_DAYS } from './rules.js';

// United Kingdom Birth Registration — wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the five sections; a sticky
// top-of-page progress summary reflects how many fields have been answered, and
// a live readout shows the running readiness class (ready to submit /
// incomplete / needs additional evidence / out of scope), the days since birth
// against the 42-day statutory period, and the count of missing items.
// Submission runs the pure engine (readiness classification plus flagged
// issues) and renders an inline report. State is persisted to localStorage so a
// partial fill survives a page reload.
//
// This is an ADMINISTRATIVE completeness instrument, NOT legal advice and NOT a
// substitute for the registrar's statutory decision. The engine validates
// completeness and the evidence GOV.UK asks for only.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-birth-registration.front-end-with-html.v1';

/** @returns {import('./types.js').BirthRegistration} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyRegistration();

  for (const key of Object.keys(fresh)) {
    if (parsed && typeof parsed[key] === 'object' && parsed[key] !== null) {
      fresh[key] = { ...fresh[key], ...parsed[key] };
    } else if (parsed && typeof parsed[key] !== 'object' && parsed[key] !== undefined) {
      fresh[key] = parsed[key];
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyRegistration();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved application; starting fresh.', e);
    return emptyRegistration();
  }
}

/** @param {import('./types.js').BirthRegistration} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save application to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored application.', e);
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

/** @type {import('./types.js').BirthRegistration} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-birth-registration',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    lastResult = null;
    const _rep = document.getElementById('report');
    if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
    renderErrorSummary([]);
    renderForm();
    updateProgress();
    updateConditionalSections();
    refreshLiveStatus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const TOTAL_STEPS = 6;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist. Re-runs progress,
 * conditional visibility, and the live-status readout after each change.
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();
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

/** Map an <input type=…> to its Lily class name. */
function lilyInputClass(type) {
  switch (type) {
    case 'email':          return 'email-input';
    case 'number':         return 'number-input';
    case 'date':           return 'date-input';
    case 'datetime-local': return 'date-input';
    case 'time':           return 'time-input';
    case 'tel':            return 'tel-input';
    case 'url':            return 'url-input';
    case 'search':         return 'search-input';
    default:               return 'text-input';
  }
}

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`,
    `aria-describedby="${id}-error"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.min !== undefined) attrs.push(`min="${esc(opts.min)}"`);
  if (opts.max !== undefined) attrs.push(`max="${esc(opts.max)}"`);
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <input ${attrs.join(' ')}>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v;
    if (input.value === '' && (type === 'date' || type === 'datetime-local' || type === 'time')) {
      v = null;
    } else if (type === 'number') {
      v = input.value === '' ? null : Number(input.value);
    } else {
      v = input.value;
    }
    setField(opts.section, opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      ${opts.required ? 'required data-required' : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
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
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${esc(opts.label)}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error"${opts.required ? ' required data-required' : ''}>
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.section, opts.field, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-fieldset';
  wrapper.id = `${groupId}-fieldset`;
  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
  if (opts.required) legend.setAttribute('data-required', '');
  wrapper.appendChild(legend);
  if (opts.hint) {
    const hint = document.createElement('span');
    hint.className = 'hint';
    hint.textContent = opts.hint;
    wrapper.appendChild(hint);
  }
  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', `${groupId}-fieldset`);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-input';
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
        setField(opts.section, opts.field, option.value);
        clearFieldError(groupId);
      }
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  const err = document.createElement('span');
  err.className = 'error-message';
  err.id = `${groupId}-error`;
  err.setAttribute('aria-live', 'polite');
  wrapper.appendChild(err);
  return wrapper;
}

function readOnlyReadout(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field readout';
  wrapper.innerHTML = `
    <label class="label">${esc(opts.label)}</label>
    <div id="${opts.id}" class="readout-value">${opts.render()}</div>
  `;
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
    `<span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const sexOptions = ['female', 'male', 'indeterminate'].map((v) => ({ value: v, label: sexLabel(v) }));

const placeOfBirthTypeOptions = [
  { value: 'hospital', label: 'Hospital' },
  { value: 'home', label: 'Home' },
  { value: 'birth-centre', label: 'Birth centre' },
  { value: 'other', label: 'Other' }
];

const birthCountryOptions = ['england', 'wales', 'scotland', 'northern-ireland', 'abroad']
  .map((v) => ({ value: v, label: birthCountryLabel(v) }));

const multipleBirthOptions = [
  { value: 'single', label: 'Single birth' },
  { value: 'twins', label: 'Twins' },
  { value: 'triplets-or-more', label: 'Triplets or more' }
];

const parentsRelationshipOptions = [
  'married-or-civil-partners', 'unmarried', 'female-couple-married', 'female-couple-unmarried', 'male-couple', 'mother-only'
].map((v) => ({ value: v, label: parentsRelationshipLabel(v) }));

const paternityBasisOptions = [
  'married-or-civil-partners', 'joint-registration', 'statutory-declaration', 'court-order-parental-responsibility', 'parental-order', 'none'
].map((v) => ({ value: v, label: paternityBasisLabel(v) }));

const informantOptions = [
  'mother', 'father', 'second-parent', 'both-parents', 'person-present-at-birth', 'person-responsible-for-child', 'hospital-administrator', 'other'
].map((v) => ({ value: v, label: informantRelationshipLabel(v) }));

const registrationRouteOptions = ['local-register-office', 'hospital', 'other-register-office']
  .map((v) => ({ value: v, label: registrationRouteLabel(v) }));

const identityDocumentOptions = [
  'passport', 'uk-photocard-driving-licence', 'eu-photocard-driving-licence', 'uk-birth-or-adoption-certificate',
  'biometric-immigration-document', 'uk-travel-document', 'refugee-or-stateless-travel-document', 'eu-identity-card',
  'proof-of-age-card', 'none'
].map((v) => ({ value: v, label: identityDocumentLabel(v) }));

const serviceLevelOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'priority', label: 'Priority (next working day if ordered by 4pm)' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The child',
    description: 'Who was born, when and where. A birth in England or Wales must be registered within 42 days.'
  });
  card.appendChild(textInput({
    label: "Child's forename(s)", section: 'child', field: 'childForenames', required: true,
    placeholder: 'First and middle names'
  }));
  card.appendChild(textInput({
    label: "Child's surname", section: 'child', field: 'childSurname', required: true
  }));
  card.appendChild(selectInput({ label: 'Sex', section: 'child', field: 'sex', options: sexOptions }));
  card.appendChild(textInput({ label: 'Date of birth', section: 'child', field: 'dateOfBirth', type: 'date' }));
  card.appendChild(textInput({
    label: 'Time of birth', section: 'child', field: 'timeOfBirth', type: 'time',
    hint: 'Needed for a multiple birth.'
  }));
  card.appendChild(selectInput({
    label: 'Type of place of birth', section: 'child', field: 'placeOfBirthType', options: placeOfBirthTypeOptions
  }));
  card.appendChild(textInput({
    label: 'Place of birth', section: 'child', field: 'placeOfBirth',
    hint: 'Name and address of the hospital or home; it decides the registration district.',
    placeholder: 'e.g. Royal Berkshire Hospital, Reading'
  }));
  card.appendChild(selectInput({
    label: 'Country of birth', section: 'child', field: 'birthCountry', options: birthCountryOptions,
    hint: 'This service covers England and Wales. Scotland, Northern Ireland and births abroad are registered differently.'
  }));
  card.appendChild(selectInput({
    label: 'Single or multiple birth', section: 'child', field: 'multipleBirth', options: multipleBirthOptions
  }));
  card.appendChild(radioGroup({
    label: 'Was the child born dead after the 24th week of pregnancy (a stillbirth)?', section: 'child',
    field: 'stillbirth', options: yesNo
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'The mother',
    description: 'The mother is the person who gave birth to the child.'
  });
  card.appendChild(textInput({
    label: "Mother's full name", section: 'mother', field: 'motherName', required: true
  }));
  card.appendChild(textInput({
    label: "Mother's maiden surname", section: 'mother', field: 'motherMaidenSurname',
    hint: 'Her surname at birth.'
  }));
  card.appendChild(textInput({ label: "Mother's date of birth", section: 'mother', field: 'motherDateOfBirth', type: 'date' }));
  card.appendChild(textInput({
    label: "Mother's place of birth", section: 'mother', field: 'motherPlaceOfBirth', placeholder: 'Town and country'
  }));
  card.appendChild(textInput({ label: "Mother's occupation", section: 'mother', field: 'motherOccupation' }));
  card.appendChild(textArea({ label: "Mother's usual address", section: 'mother', field: 'motherAddress' }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Parentage and the second parent',
    description: 'Whether a father or second parent is recorded, and on what basis. Unmarried parents need a specific route.'
  });
  card.appendChild(selectInput({
    label: "Parents' relationship", section: 'parentage', field: 'parentsRelationship', options: parentsRelationshipOptions
  }));
  card.appendChild(textInput({
    label: 'Date of marriage or civil partnership', section: 'parentage', field: 'marriageDate', type: 'date',
    hint: 'Only if the parents are married or civil partners.'
  }));
  card.appendChild(radioGroup({
    label: 'Record a second parent (father or female parent) on the entry?', section: 'parentage',
    field: 'secondParentIncluded', options: yesNo
  }));
  card.appendChild(textInput({ label: "Second parent's full name", section: 'parentage', field: 'secondParentName' }));
  card.appendChild(textInput({ label: "Second parent's date of birth", section: 'parentage', field: 'secondParentDateOfBirth', type: 'date' }));
  card.appendChild(textInput({
    label: "Second parent's place of birth", section: 'parentage', field: 'secondParentPlaceOfBirth', placeholder: 'Town and country'
  }));
  card.appendChild(textInput({ label: "Second parent's occupation", section: 'parentage', field: 'secondParentOccupation' }));
  card.appendChild(selectInput({
    label: 'Basis for recording the second parent', section: 'parentage', field: 'paternityBasis',
    options: paternityBasisOptions,
    hint: 'Unmarried parents: register together, bring a signed statutory declaration, or a court document giving parental responsibility.'
  }));
  card.appendChild(radioGroup({
    label: 'Is the signed form or court document in hand?', section: 'parentage', field: 'paternityEvidenceHeld',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Female couple not married: treated together at a UK licensed clinic with a parenthood agreement?',
    section: 'parentage', field: 'licensedClinicTreatment', options: yesNo
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Informant, registration and identity',
    description: 'Who registers, where and when, and the identity evidence they will bring.'
  });
  card.appendChild(selectInput({
    label: 'Informant (who is registering)', section: 'informant', field: 'informantRelationship', options: informantOptions
  }));
  card.appendChild(textInput({ label: "Informant's full name", section: 'informant', field: 'informantName' }));
  card.appendChild(radioGroup({
    label: 'If the informant is not a parent: are the parents unable to register?', section: 'informant',
    field: 'parentsUnableToRegister', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Where will the birth be registered?', section: 'informant', field: 'registrationRoute',
    options: registrationRouteOptions
  }));
  card.appendChild(textInput({
    label: 'Registration date', section: 'informant', field: 'registrationDate', type: 'date',
    hint: `The 42-day period runs from the date of birth (${STATUTORY_DAYS} days).`
  }));
  card.appendChild(selectInput({
    label: 'One accepted identity document', section: 'informant', field: 'identityPrimaryDocument',
    options: identityDocumentOptions,
    hint: 'Your first name and surname must show. Choose "None" if you only have secondary documents.'
  }));
  card.appendChild(textInput({
    label: 'Number of secondary documents', section: 'informant', field: 'identitySecondaryCount',
    type: 'number', min: 0, max: 10,
    hint: 'Without a single accepted document, two are needed: for example a utility bill (not mobile phone) and a bank statement.'
  }));
  card.appendChild(radioGroup({
    label: 'Are the documents originals?', section: 'informant', field: 'identityOriginals', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: "Will you bring the child's personal child health record (red book)?", section: 'informant',
    field: 'redBookPresented', options: yesNo
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Birth certificate order',
    description: 'Order certified copies from the General Register Office. A standard certificate costs 12.50 pounds, priority 38.50 pounds.'
  });
  card.appendChild(textInput({
    label: 'Number of certificates (0 if none)', section: 'certificate', field: 'certificatesRequested',
    type: 'number', min: 0, max: 20
  }));
  card.appendChild(selectInput({
    label: 'Service level', section: 'certificate', field: 'serviceLevel', options: serviceLevelOptions
  }));
  card.appendChild(textArea({ label: 'Delivery address', section: 'certificate', field: 'deliveryAddress' }));
  card.appendChild(radioGroup({
    label: 'Payment by debit or credit card confirmed?', section: 'certificate', field: 'paymentConfirmed',
    options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Note to the registrar', section: 'certificate', field: 'applicantNote',
    placeholder: 'Anything the registrar should know.'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Summary and readiness',
    description: 'The live readiness class, days since birth, and count of missing items. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live readiness status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: readiness badge, days since birth, missing-item count. */
function renderLiveStatus() {
  const result = validateRegistration(state);
  const badge =
    `<span class="risk-badge ${readinessClassClass(result.readinessClass)}">${esc(readinessClassLabel(result.readinessClass))}</span>`;
  const days = result.daysSinceBirth === null
    ? `<span class="muted">Days since birth not yet known</span>`
    : `<strong>${result.daysSinceBirth}</strong> days since birth (limit ${STATUTORY_DAYS})`;
  const missing = result.missingItemCount > 0
    ? `<span class="muted">— ${result.missingItemCount} required ${result.missingItemCount === 1 ? 'item' : 'items'} missing</span>`
    : `<span class="muted">— no required items missing</span>`;
  return `${badge} ${days} ${missing}`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section] ? state[section][field] : undefined;
    host.style.display = String(current) === target ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

// Each section maps to one or more progress "slots". A slot counts as answered
// when ANY of its fields is answered.
const STEP_SLOTS = {
  child: [['childForenames', 'childSurname'], ['sex'], ['dateOfBirth'], ['placeOfBirth'], ['birthCountry'], ['stillbirth']],
  mother: [['motherName'], ['motherMaidenSurname'], ['motherDateOfBirth'], ['motherAddress']],
  parentage: [['parentsRelationship'], ['secondParentIncluded']],
  informant: [['informantRelationship'], ['registrationDate'], ['identityPrimaryDocument', 'identitySecondaryCount']],
  certificate: [['certificatesRequested']]
};

function isAnswered(section, field) {
  const v = state[section][field];
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  let total = 0;
  const sectionAnswered = {};
  const sectionTotal = {};

  for (const section of Object.keys(STEP_SLOTS)) {
    const slots = STEP_SLOTS[section];
    sectionTotal[section] = slots.length;
    sectionAnswered[section] = 0;
    for (const slot of slots) {
      total++;
      const slotAnswered = slot.some((field) => isAnswered(section, field));
      if (slotAnswered) {
        answered++;
        sectionAnswered[section]++;
      }
    }
  }

  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
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
    readinessClass, daysSinceBirth, lateRegistration, missingItemCount,
    flaggedIssues, timestamp
  } = lastResult;

  const cell = (v) => (v === null || v === undefined || v === '' ? '<span class="muted">—</span>' : esc(v));
  const c = state.child;
  const m = state.mother;
  const p = state.parentage;
  const i = state.informant;
  const o = state.certificate;

  const rows = [
    ['Child', [c.childForenames, c.childSurname].filter(Boolean).join(' ')],
    ['Sex', sexLabel(c.sex)],
    ['Date of birth', c.dateOfBirth],
    ['Place and country of birth', [c.placeOfBirth, birthCountryLabel(c.birthCountry)].filter(Boolean).join(', ')],
    ['Mother', m.motherName],
    ["Parents' relationship", parentsRelationshipLabel(p.parentsRelationship)],
    ['Second parent', p.secondParentIncluded === 'yes' ? `${p.secondParentName || '—'} (${paternityBasisLabel(p.paternityBasis) || 'no basis stated'})` : yesNoLabel(p.secondParentIncluded)],
    ['Informant', [informantRelationshipLabel(i.informantRelationship), i.informantName].filter(Boolean).join(': ')],
    ['Registration', [registrationRouteLabel(i.registrationRoute), i.registrationDate].filter(Boolean).join(', ')],
    ['Identity document', i.identityPrimaryDocument ? identityDocumentLabel(i.identityPrimaryDocument) : (i.identitySecondaryCount !== null ? `${i.identitySecondaryCount} secondary document(s)` : '')],
    ['Certificates', o.certificatesRequested === null ? '' : `${o.certificatesRequested}${o.serviceLevel ? ` (${o.serviceLevel})` : ''}`]
  ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${cell(v)}</td></tr>`).join('');

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No statutory, evidence, or order flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  let guidance;
  if (readinessClass === 'out-of-scope') {
    guidance = `<p>This birth is <strong>out of scope</strong>: a stillbirth, or a birth outside England and Wales, is registered under different rules. Do not use this application; see the flagged issues for where to register.</p>`;
  } else if (readinessClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: ${missingItemCount} required ${missingItemCount === 1 ? 'item is' : 'items are'} missing, or the dates are inconsistent. Complete the items in the flagged issues before attending the register office.</p>`;
  } else if (readinessClass === 'needs-additional-evidence') {
    guidance = `<p>This application is complete but <strong>needs additional evidence</strong>: the informant, the basis for the second parent, the identity documents, or the age of the registration needs attention. Resolve the high-priority flags before attending.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to submit</strong>: every required item is present, the informant is qualified, the identity evidence is sufficient, and the second parent (if any) has a valid basis. The registrar still makes the final decision and the entry in the register.</p>`;
  }

  const deadline = daysSinceBirth === null
    ? '<span class="muted">Not yet known (enter the date of birth and registration date)</span>'
    : `${daysSinceBirth} days since birth — ${lateRegistration === 'yes' ? '<strong>after</strong>' : 'within'} the ${STATUTORY_DAYS}-day period`;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United Kingdom Birth Registration — Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${readinessClassClass(readinessClass)}">
        <div>
          <span class="risk-banner-label">Readiness class</span>
          <span class="risk-banner-value">${esc(readinessClassLabel(readinessClass))}</span>
        </div>
        ${lateRegistration === 'yes' ? '<span class="risk-badge risk-high">Late registration</span>' : ''}
      </div>

      <p><strong>Statutory period:</strong> ${deadline}</p>
      <p><strong>Missing required items:</strong> ${missingItemCount}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Application summary</h3>
      <table class="subscales">
        <tbody>${rows}</tbody>
      </table>

      <h3>Missing items</h3>
      ${missingItems(state).length === 0 ? '<p class="muted">None.</p>' : `<ul>${missingItems(state).map((m2) => `<li>${esc(m2.label)}</li>`).join('')}</ul>`}

      <h3>Next steps</h3>
      <p>Attend the local register office (or the hospital, if it registers births) with your identity documents and, if you have it, the red book. The registrar checks the evidence, enters the birth in the register, and you can order certified copies from the General Register Office.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
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
  const _errors = validateForm();
  if (_errors.length > 0) return;
  const result = validateRegistration(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    readinessClass: result.readinessClass,
    daysSinceBirth: result.daysSinceBirth,
    lateRegistration: result.lateRegistration,
    missingItemCount: result.missingItemCount,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh application?')) return;
  clearState();
  state = emptyRegistration();
  lastResult = null;
  const _rep = document.getElementById('report');
  if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, section: 'child',       title: 'Child' },
  { step: 2, section: 'mother',      title: 'Mother' },
  { step: 3, section: 'parentage',   title: 'Parentage' },
  { step: 4, section: 'informant',   title: 'Informant' },
  { step: 5, section: 'certificate', title: 'Certificate' },
  { step: 6, section: 'summary',     title: 'Summary' }
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
  const required = form.querySelectorAll('input[data-required], select[data-required], textarea[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    let id = input.id;
    if (input.type === 'radio') id = input.name;
    if (seen.has(id)) return;
    seen.add(id);
    // Skip fields hidden inside a collapsed conditional section.
    const conditional = input.closest('[data-conditional]');
    if (conditional && conditional.style.display === 'none') return;
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
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveStatus();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

