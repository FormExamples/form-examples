import { detectFlaggedIssues } from './flags.js';
import { gradeDirective } from './grader.js';
import { agentRelationshipLabel, effectiveWhenLabel, emptyDirective, executionMethodLabel, lifeSustainingTreatmentLabel, organDonationLabel, polstStatusLabel, priorityLabel, readinessClassClass, readinessClassLabel, treatmentChoiceLabel, yesNoLabel } from './types.js';
import { executionDefects, stateRule } from './rules.js';

// United States Health Care Power of Attorney — wizard (vanilla JavaScript, no
// build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The principal (or the attorney or social worker helping)
// scrolls through the six sections; a sticky top-of-page progress summary
// reflects how many fields have been answered, and a live readout shows the
// running readiness class (ready-to-execute / incomplete / execution-risk) and
// the state rule applied. Submission runs the pure engine (readiness
// classification plus flagged issues) and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// This is a DOCUMENTATION instrument, NOT legal advice. The engine checks
// completeness and the signing formalities of the principal's state only.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-health-care-power-of-attorney.front-end-with-html.v1';

/** @returns {import('./types.js').Directive} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyDirective();

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
    if (!raw) return emptyDirective();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved directive; starting fresh.', e);
    return emptyDirective();
  }
}

/** @param {import('./types.js').Directive} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save directive to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored directive.', e);
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

/** @type {import('./types.js').Directive} */
let state = loadState();

/** @type {import('./types.js').{ readinessClass: string, flaggedIssues: object[] } | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-health-care-power-of-attorney',
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

const stateOptions = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming']
].map(([value, label]) => ({ value, label: `${label} (${value})` }));

const relationshipOptions = [
  { value: 'spouse', label: 'Spouse or partner' },
  { value: 'adult-child', label: 'Adult child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'other-relative', label: 'Other relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' }
];

const effectiveWhenOptions = [
  { value: 'immediately', label: 'Immediately on signing' },
  { value: 'upon-incapacity', label: 'Only when I cannot decide for myself' }
];

const incapacityOptions = [
  { value: 'one-physician', label: 'One physician' },
  { value: 'two-physicians', label: 'Two physicians' },
  { value: 'other', label: 'Another method stated in the document' }
];

const organOptions = [
  { value: 'any-needs', label: 'Any needed organs and tissues' },
  { value: 'transplant-only', label: 'Transplant or therapy only' },
  { value: 'research-only', label: 'Research only' },
  { value: 'none', label: 'No donation' },
  { value: 'not-addressed', label: 'Not addressed' }
];

const priorOptions = [
  { value: 'none-existing', label: 'I have no earlier health care power of attorney' },
  { value: 'revokes-prior', label: 'This document revokes my earlier one' },
  { value: 'prior-remains', label: 'An earlier one remains in force' }
];

const lifeSustainingOptions = [
  { value: 'refuse', label: 'Refuse life-sustaining treatment if terminal or permanently unconscious' },
  { value: 'time-limited-trial', label: 'Accept a time-limited trial, then stop if no improvement' },
  { value: 'want-all', label: 'Want all available treatment' },
  { value: 'agent-decides', label: 'Leave it to my agent' }
];

const treatmentOptions = [
  { value: 'accept', label: 'Accept' },
  { value: 'refuse', label: 'Refuse' },
  { value: 'agent-decides', label: 'Agent decides' }
];

const polstOptions = [
  { value: 'none', label: 'No POLST' },
  { value: 'in-place', label: 'A POLST is in place' },
  { value: 'discussing', label: 'Discussing a POLST with my clinician' }
];

const methodOptions = [
  { value: 'two-witnesses', label: 'Two witnesses' },
  { value: 'one-witness', label: 'One witness' },
  { value: 'notary', label: 'Notary acknowledgment' },
  { value: 'witnesses-and-notary', label: 'Witnesses and notary' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per directive step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Principal',
    description: 'The person making the directive, and the state whose law governs how it must be signed.'
  });
  card.appendChild(textInput({
    label: 'Principal — full legal name', section: 'principal', field: 'principalName',
    required: true, placeholder: 'Name as on your ID'
  }));
  card.appendChild(textInput({
    label: 'Date of birth', section: 'principal', field: 'birthDate', type: 'date', required: true
  }));
  card.appendChild(selectInput({
    label: 'State of residence', section: 'principal', field: 'state', options: stateOptions, required: true,
    hint: 'The witness and notary rules differ by state. Eight states are checked in detail; others use the uniform default.'
  }));
  card.appendChild(textInput({
    label: 'Phone', section: 'principal', field: 'phone', type: 'tel'
  }));
  card.appendChild(radioGroup({
    label: 'Does the principal understand this document and what it does?', section: 'principal',
    field: 'capacityConfirmed', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is the principal signing freely, without pressure?', section: 'principal',
    field: 'signedVoluntarily', options: yesNo
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Agent and successors',
    description: 'The person who will make health care decisions if you cannot, and the people who step in if the agent cannot.'
  });
  card.appendChild(textInput({
    label: 'Agent — full name', section: 'agent', field: 'agentName', required: true
  }));
  card.appendChild(selectInput({
    label: 'Relationship to the principal', section: 'agent', field: 'agentRelationship', options: relationshipOptions
  }));
  card.appendChild(textInput({
    label: 'Agent age (years)', section: 'agent', field: 'agentAge', type: 'number', min: 0, max: 120,
    hint: 'The agent must be an adult (18 or older).'
  }));
  card.appendChild(textInput({
    label: 'Agent phone', section: 'agent', field: 'agentPhone', type: 'tel'
  }));
  card.appendChild(radioGroup({
    label: 'Is the agent the principal\'s health care provider, or that provider\'s employee?', section: 'agent',
    field: 'agentIsHealthCareProvider', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the agent operate or work at the facility where the principal is a patient?', section: 'agent',
    field: 'agentIsFacilityEmployee', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is the agent related to the principal by blood, marriage, or adoption?', section: 'agent',
    field: 'agentRelatedToPrincipal', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Has the agent agreed to serve?', section: 'agent', field: 'agentAccepted', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'First successor agent', section: 'agent', field: 'successor1Name'
  }));
  card.appendChild(textInput({
    label: 'First successor phone', section: 'agent', field: 'successor1Phone', type: 'tel'
  }));
  card.appendChild(textInput({
    label: 'Second successor agent', section: 'agent', field: 'successor2Name'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Authority',
    description: 'When the agent\'s power begins, medical-record access, mental health decisions, organ donation, and earlier documents.'
  });
  card.appendChild(selectInput({
    label: 'When does the agent\'s authority begin?', section: 'authority', field: 'effectiveWhen',
    options: effectiveWhenOptions, required: true
  }));
  card.appendChild(selectInput({
    label: 'Who decides that the principal cannot decide?', section: 'authority', field: 'incapacityDeterminedBy',
    options: incapacityOptions
  }));
  card.appendChild(radioGroup({
    label: 'Includes a HIPAA release so the agent can see records?', section: 'authority', field: 'hipaaRelease',
    options: yesNo, hint: 'HIPAA authorization, 45 CFR 164.508.'
  }));
  card.appendChild(radioGroup({
    label: 'Agent may decide on mental health treatment?', section: 'authority', field: 'mentalHealthAuthority',
    options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Organ and tissue donation', section: 'authority', field: 'organDonation', options: organOptions
  }));
  card.appendChild(selectInput({
    label: 'Earlier health care powers of attorney', section: 'authority', field: 'priorDirectiveStatus',
    options: priorOptions
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Treatment wishes',
    description: 'Guidance for the agent and clinicians. A power of attorney is not a medical order; a POLST is.'
  });
  card.appendChild(selectInput({
    label: 'Life-sustaining treatment', section: 'wishes', field: 'lifeSustainingTreatment', options: lifeSustainingOptions
  }));
  card.appendChild(selectInput({
    label: 'CPR (cardiopulmonary resuscitation)', section: 'wishes', field: 'cpr', options: treatmentOptions
  }));
  card.appendChild(selectInput({
    label: 'Ventilator (breathing machine)', section: 'wishes', field: 'ventilator', options: treatmentOptions
  }));
  card.appendChild(selectInput({
    label: 'Artificial nutrition and hydration', section: 'wishes', field: 'artificialNutrition', options: treatmentOptions
  }));
  card.appendChild(radioGroup({
    label: 'Prioritize comfort and pain relief?', section: 'wishes', field: 'comfortCareFirst', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the principal have a serious illness or frailty?', section: 'wishes', field: 'seriousIllness',
    options: yesNo, hint: 'A POLST is for people with serious illness or frailty.'
  }));
  card.appendChild(selectInput({
    label: 'POLST status', section: 'wishes', field: 'polstStatus', options: polstOptions
  }));
  card.appendChild(textArea({
    label: 'Other wishes or values', section: 'wishes', field: 'wishesNote',
    placeholder: 'What matters most to you, in your own words.'
  }));
  return card;
}

function witnessFields(card, n) {
  card.appendChild(textInput({
    label: `Witness ${n} — name`, section: 'execution', field: `witness${n}Name`
  }));
  card.appendChild(radioGroup({
    label: `Witness ${n} is related to the principal?`, section: 'execution', field: `witness${n}IsRelative`, options: yesNo
  }));
  card.appendChild(radioGroup({
    label: `Witness ${n} would inherit from the principal?`, section: 'execution', field: `witness${n}IsHeir`, options: yesNo
  }));
  card.appendChild(radioGroup({
    label: `Witness ${n} is the agent?`, section: 'execution', field: `witness${n}IsAgent`, options: yesNo
  }));
  card.appendChild(radioGroup({
    label: `Witness ${n} is the principal's provider or facility staff?`, section: 'execution', field: `witness${n}IsProvider`, options: yesNo
  }));
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Signing and witnesses',
    description: 'How the document is signed. Witness and notary rules come from the principal\'s state.'
  });
  card.appendChild(textInput({
    label: 'Signature date', section: 'execution', field: 'signatureDate', type: 'date', required: true
  }));
  card.appendChild(selectInput({
    label: 'Signing method', section: 'execution', field: 'executionMethod', options: methodOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Signed (or signature acknowledged) in the presence of the witnesses or notary?', section: 'execution',
    field: 'witnessesPresent', options: yesNo
  }));
  witnessFields(card, 1);
  witnessFields(card, 2);
  card.appendChild(textInput({
    label: 'Notary — name', section: 'execution', field: 'notaryName'
  }));
  card.appendChild(radioGroup({
    label: 'Is the principal a resident of a skilled nursing facility?', section: 'execution',
    field: 'principalInSkilledNursingFacility', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Did a patient advocate or ombudsman sign as a witness?', section: 'execution',
    field: 'ombudsmanSigned', options: yesNo, hint: 'California requires this for skilled nursing facility residents.'
  }));
  card.appendChild(radioGroup({
    label: 'Copy given to the agent?', section: 'distribution', field: 'copyToAgent', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Copy given to the principal\'s physician?', section: 'distribution', field: 'copyToPhysician', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Copy given to the successor agents?', section: 'distribution', field: 'copyToSuccessor', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Copy brought to the hospital or care facility?', section: 'distribution', field: 'copyToFacility', options: yesNo,
    hint: 'Federal law (Patient Self-Determination Act) requires providers to ask whether you have a directive.'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Summary and readiness',
    description: 'The live readiness class and the state rule applied. Submit to generate the full report.'
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

/** Render the live status: readiness badge, state rule applied, missing count. */
function renderLiveStatus() {
  const result = gradeDirective(state);
  const badge =
    `<span class="risk-badge ${readinessClassClass(result.readinessClass)}">${esc(readinessClassLabel(result.readinessClass))}</span>`;
  const rule = state.principal.state
    ? `<strong>State rule:</strong> ${esc(result.ruleSetName)}`
    : `<span class="muted">Choose a state to apply its witness and notary rule</span>`;
  const missing = result.missingCount > 0
    ? `<span class="muted">— ${result.missingCount} required item${result.missingCount === 1 ? '' : 's'} missing</span>`
    : `<span class="muted">— all required items present</span>`;
  return `${badge} ${rule} ${missing}`;
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
  principal: [['principalName'], ['birthDate'], ['state'], ['capacityConfirmed']],
  agent: [['agentName'], ['agentAge'], ['agentRelatedToPrincipal'], ['successor1Name', 'successor2Name']],
  authority: [['effectiveWhen'], ['hipaaRelease'], ['organDonation'], ['priorDirectiveStatus']],
  wishes: [['lifeSustainingTreatment'], ['cpr'], ['seriousIllness'], ['polstStatus']],
  execution: [['signatureDate'], ['executionMethod'], ['witnessesPresent'], ['witness1Name', 'notaryName']]
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

  const { readinessClass, ruleSetName, flaggedIssues, defects, timestamp } = lastResult;
  const rule = stateRule(state);
  const dash = '<span class="muted">—</span>';
  const val = (v) => (v ? esc(v) : dash);

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No execution, eligibility, or completeness flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-id">${esc(f.id)}</span>
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  let guidance;
  if (readinessClass === 'execution-risk') {
    guidance = `<p>This directive carries an <strong>execution risk</strong>: ${defects.length > 0 ? 'a signing formality does not match the rule applied' : 'an eligibility or capacity problem is recorded'}. Fix the high-priority items below <strong>before anyone signs</strong>. A document signed with these defects may be refused by a hospital or set aside by a court.</p>`;
  } else if (readinessClass === 'incomplete') {
    guidance = `<p>This directive is <strong>incomplete</strong>: required content is missing. Complete the items flagged below before printing it for signing.</p>`;
  } else {
    guidance = `<p>This directive is <strong>ready to execute</strong> under the rule applied: required content is present, the agent is eligible, and the signing method matches. This is a completeness check, not legal advice; a court or the treating facility decides validity.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Health Care Power of Attorney — Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${readinessClassClass(readinessClass)}">
        <div>
          <span class="risk-banner-label">Readiness class</span>
          <span class="risk-banner-value">${esc(readinessClassLabel(readinessClass))}</span>
        </div>
      </div>

      <p><strong>State rule applied:</strong> ${esc(ruleSetName)} <span class="muted">(${esc(rule.cite)})</span></p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Directive summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Principal</th><td>${val(state.principal.principalName)}</td></tr>
          <tr><th scope="row">Agent</th><td>${val(state.agent.agentName)}${state.agent.agentRelationship ? ` (${esc(agentRelationshipLabel(state.agent.agentRelationship))})` : ''}</td></tr>
          <tr><th scope="row">Successors</th><td>${val([state.agent.successor1Name, state.agent.successor2Name].filter(Boolean).join(', '))}</td></tr>
          <tr><th scope="row">Authority begins</th><td>${val(effectiveWhenLabel(state.authority.effectiveWhen))}</td></tr>
          <tr><th scope="row">HIPAA release</th><td>${val(yesNoLabel(state.authority.hipaaRelease))}</td></tr>
          <tr><th scope="row">Life-sustaining treatment</th><td>${val(lifeSustainingTreatmentLabel(state.wishes.lifeSustainingTreatment))}</td></tr>
          <tr><th scope="row">CPR</th><td>${val(treatmentChoiceLabel(state.wishes.cpr))}</td></tr>
          <tr><th scope="row">Organ donation</th><td>${val(organDonationLabel(state.authority.organDonation))}</td></tr>
          <tr><th scope="row">POLST</th><td>${val(polstStatusLabel(state.wishes.polstStatus))}</td></tr>
          <tr><th scope="row">Signing method</th><td>${val(executionMethodLabel(state.execution.executionMethod))}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Print the directive, sign it in front of the witnesses or notary your state requires, and give copies to the agent, successor agents, and physician. Bring a copy to every hospital admission. Review the document after major life events, and ask your clinician about a POLST if you have a serious illness.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">Documentation support, not legal advice. The issuing court, the treating facility, and the state decide whether a directive is valid.</p>

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
  const result = gradeDirective(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    readinessClass: result.readinessClass,
    ruleSetName: result.ruleSetName,
    flaggedIssues,
    defects: executionDefects(state),
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh directive?')) return;
  clearState();
  state = emptyDirective();
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
  { step: 1, section: 'principal', title: 'Principal' },
  { step: 2, section: 'agent',     title: 'Agent' },
  { step: 3, section: 'authority', title: 'Authority' },
  { step: 4, section: 'wishes',    title: 'Wishes' },
  { step: 5, section: 'execution', title: 'Signing' },
  { step: 6, section: 'summary',   title: 'Summary' }
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
