import { detectFlaggedIssues } from './flags.js';
import { validateRegistration } from './grader.js';
import { emptyRegistration, registrationClassLabel, registrationClassClass, deadlineStatusLabel, sexLabel, jurisdictionLabel, coronerStageLabel, relationshipLabel, disposalMethodLabel, tellUsOnceStatusLabel, copyOrderChannelLabel, medicalExaminerStatusLabel, yesNoLabel, priorityLabel } from './types.js';

// United Kingdom death registration (England and Wales) - wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The informant scrolls through the six process sections; a
// sticky top-of-page progress summary reflects how many fields have been
// answered, and a live readout shows the running registration class (ready to
// register / incomplete / referred to coroner - pending / registered) and the
// 5-day deadline status. Submission runs the pure engine (classification plus
// flagged issues) and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload.
//
// This is a COMPLETENESS and VALIDITY instrument, NOT legal advice and not a
// substitute for the registrar. The engine checks readiness only.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-death-registration.front-end-with-html.v1';

/** @returns {import('./types.js').Registration} */
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
    console.warn('Could not parse saved registration; starting fresh.', e);
    return emptyRegistration();
  }
}

/** @param {import('./types.js').Registration} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save registration to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored registration.', e);
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

/** @type {import('./types.js').Registration} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-death-registration',
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

const TOTAL_STEPS = 7;

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

const sexOptions = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'unknown', label: 'Unknown' }
];

const jurisdictionOptions = [
  { value: 'england-wales', label: 'England or Wales' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'northern-ireland', label: 'Northern Ireland' },
  { value: 'abroad', label: 'Abroad' }
];

const medicalExaminerOptions = [
  { value: 'confirmed', label: 'Confirmed - the death can be registered' },
  { value: 'pending', label: 'Awaiting the medical examiner' }
];

const coronerStageOptions = [
  { value: 'investigating', label: 'Coroner investigating' },
  { value: 'post-mortem', label: 'Post-mortem ordered' },
  { value: 'inquest-opened', label: 'Inquest opened' },
  { value: 'released-no-inquest', label: 'Released - no inquest needed' },
  { value: 'inquest-concluded', label: 'Inquest concluded' }
];

const relationshipOptions = [
  { value: 'relative-present-at-death', label: 'Relative present at the death' },
  { value: 'relative-in-attendance', label: 'Relative in attendance during the last illness' },
  { value: 'relative-in-district', label: 'Relative living in the registration district' },
  { value: 'person-present-at-death', label: 'Person present at the death' },
  { value: 'occupier-of-premises', label: 'Occupier of the premises where the death occurred' },
  { value: 'person-arranging-funeral', label: 'Person arranging the funeral' },
  { value: 'not-qualified', label: 'None of these (for example a friend or neighbour not otherwise involved)' }
];

const disposalOptions = [
  { value: 'burial', label: 'Burial' },
  { value: 'cremation', label: 'Cremation' },
  { value: 'other', label: 'Other' },
  { value: 'undecided', label: 'Not yet decided' }
];

const tellUsOnceOptions = [
  { value: 'reference-received', label: 'Reference number received' },
  { value: 'not-offered', label: 'Not offered' },
  { value: 'declined', label: 'Declined' }
];

const channelOptions = [
  { value: 'at-registration', label: 'At registration' },
  { value: 'gro-online', label: 'General Register Office - online' },
  { value: 'phone', label: 'General Register Office - phone' },
  { value: 'post', label: 'General Register Office - post' },
  { value: 'local-register-office', label: 'Local register office' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per process step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The deceased and the death',
    description: 'Who died, when and where. This process covers deaths in England and Wales only.'
  });
  card.appendChild(textInput({
    label: 'Deceased - full name', section: 'deceased', field: 'deceasedName',
    required: true, placeholder: 'Full name of the deceased'
  }));
  card.appendChild(selectInput({ label: 'Sex', section: 'deceased', field: 'sex', options: sexOptions }));
  card.appendChild(textInput({ label: 'Date of birth', section: 'deceased', field: 'dateOfBirth', type: 'date' }));
  card.appendChild(textInput({ label: 'Date of death', section: 'deceased', field: 'dateOfDeath', type: 'date' }));
  card.appendChild(textInput({ label: 'Place of death', section: 'deceased', field: 'placeOfDeath', placeholder: 'Hospital, home, care home or other' }));
  card.appendChild(selectInput({
    label: 'Where did the death occur?', section: 'deceased', field: 'deathJurisdiction',
    options: jurisdictionOptions, hint: 'Scotland, Northern Ireland and deaths abroad follow different rules.'
  }));
  card.appendChild(radioGroup({
    label: 'Can the informant give the deceased\u2019s full particulars?', section: 'deceased',
    field: 'deceasedParticularsKnown', options: yesNo,
    hint: 'Names, date and place of birth, last address, occupation and marital status.'
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Medical certificate and medical examiner',
    description: 'A doctor completes the medical certificate of cause of death (MCCD); the medical examiner\u2019s office must then confirm that the death can be registered. The 5-day clock starts at that confirmation.'
  });
  card.appendChild(radioGroup({
    label: 'Has the register office received the MCCD?', section: 'medical', field: 'mccdReceived', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Medical examiner status', section: 'medical', field: 'medicalExaminerStatus', options: medicalExaminerOptions
  }));
  card.appendChild(textInput({
    label: 'Date the medical examiner confirmed', section: 'medical', field: 'medicalExaminerConfirmationDate', type: 'date',
    hint: 'The death must be registered within 5 days of this date, counting weekends and bank holidays.'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Coroner',
    description: 'Some deaths are reported to a coroner. Registration then waits for the coroner\u2019s certificate.'
  });
  card.appendChild(radioGroup({
    label: 'Has the death been reported to a coroner?', section: 'coroner', field: 'referredToCoroner', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Stage of the coroner\u2019s involvement', section: 'coroner', field: 'coronerStage', options: coronerStageOptions
  }));
  card.appendChild(radioGroup({
    label: 'Has the registrar received the coroner\u2019s certificate?', section: 'coroner', field: 'coronerCertificateReceived',
    options: yesNo, hint: 'Form CN2 when there is no inquest, or the certificate after an inquest.'
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'The informant',
    description: 'Only a qualified informant can register the death: a relative, a person present at the death, the occupier of the premises, or the person arranging the funeral.'
  });
  card.appendChild(textInput({
    label: 'Informant - full name', section: 'informant', field: 'informantName',
    required: true, placeholder: 'Person who will register the death'
  }));
  card.appendChild(selectInput({
    label: 'Why is this person qualified to register?', section: 'informant', field: 'informantRelationship', options: relationshipOptions
  }));
  card.appendChild(textArea({
    label: 'Informant address', section: 'informant', field: 'informantAddress', placeholder: 'Postal address'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Registration appointment',
    description: 'Where and when the death is registered, and the date this assessment is made.'
  });
  card.appendChild(textInput({
    label: 'Register office', section: 'registration', field: 'registerOffice',
    hint: 'The district where the death occurred, or any office that can take the details.'
  }));
  card.appendChild(radioGroup({
    label: 'Appointment booked?', section: 'registration', field: 'appointmentBooked', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Supporting documents to hand?', section: 'registration', field: 'supportingDocumentsAvailable', options: yesNo,
    hint: 'Birth or marriage certificate, passport, NHS medical card, driving licence, proof of address. Helpful, not mandatory.'
  }));
  card.appendChild(textInput({
    label: 'Date registered', section: 'registration', field: 'registrationDate', type: 'date',
    hint: 'Leave empty until the death has been registered.'
  }));
  card.appendChild(textInput({
    label: 'Assessment date (today)', section: 'registration', field: 'asOfDate', type: 'date',
    hint: 'Used to count the days since the medical examiner confirmed.'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'After registration',
    description: 'The certificate for burial or cremation, Tell Us Once, and certified copies of the death certificate.'
  });
  card.appendChild(selectInput({ label: 'Intended disposal', section: 'aftercare', field: 'disposalMethod', options: disposalOptions }));
  card.appendChild(radioGroup({
    label: 'Certificate for burial or cremation (green form) issued?', section: 'aftercare', field: 'disposalCertificateIssued', options: yesNo
  }));
  card.appendChild(selectInput({ label: 'Tell Us Once', section: 'aftercare', field: 'tellUsOnceStatus', options: tellUsOnceOptions }));
  card.appendChild(textInput({ label: 'Tell Us Once reference number', section: 'aftercare', field: 'tellUsOnceReference' }));
  card.appendChild(textInput({
    label: 'Certified copies requested', section: 'aftercare', field: 'copiesRequested', type: 'number', min: 0, max: 50
  }));
  card.appendChild(selectInput({ label: 'How are copies ordered?', section: 'aftercare', field: 'copyOrderChannel', options: channelOptions }));
  card.appendChild(textInput({
    label: 'GRO index reference', section: 'aftercare', field: 'groIndexReference',
    hint: 'Ordering online without it adds a search fee and takes longer.'
  }));
  card.appendChild(radioGroup({ label: 'Priority service (next working day)?', section: 'aftercare', field: 'priorityService', options: yesNo }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and readiness',
    description: 'The live registration class and 5-day deadline status. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live registration status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: class badge, deadline status, days elapsed. */
function renderLiveStatus() {
  const result = validateRegistration(state);
  const badge =
    `<span class="risk-badge ${registrationClassClass(result.registrationClass)}">${esc(registrationClassLabel(result.registrationClass))}</span>`;
  const days = result.daysSinceConfirmation === null
    ? ''
    : ` <span class="muted">(${result.daysSinceConfirmation} days since confirmation)</span>`;
  return `${badge} <strong>5-day deadline:</strong> ${esc(deadlineStatusLabel(result.deadlineStatus))}${days}`;
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
  deceased: [['deceasedName'], ['dateOfDeath'], ['deathJurisdiction'], ['deceasedParticularsKnown']],
  medical: [['mccdReceived'], ['medicalExaminerStatus'], ['medicalExaminerConfirmationDate']],
  coroner: [['referredToCoroner']],
  informant: [['informantName'], ['informantRelationship']],
  registration: [['registerOffice'], ['appointmentBooked'], ['asOfDate']],
  aftercare: [['disposalMethod'], ['tellUsOnceStatus'], ['copiesRequested']]
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

  const { registrationClass, deadlineStatus, daysSinceConfirmation, informantQualified, blockingRules, flaggedIssues, timestamp } = lastResult;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No deadline, statutory, or documentary flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` \u2014 ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const blockers = blockingRules.length === 0
    ? `<p class="muted">No blocking issues.</p>`
    : `<ul>${blockingRules.map((r) => `<li>${esc(r.description)}</li>`).join('')}</ul>`;

  let guidance;
  if (registrationClass === 'referred-to-coroner-pending') {
    guidance = `<p>The death has been reported to a coroner and the coroner\u2019s certificate has not arrived, so this registration is <strong>referred to coroner - pending</strong>. The 5-day clock is paused. Ask the coroner for an interim certificate if proof of death is needed meanwhile.</p>`;
  } else if (registrationClass === 'incomplete') {
    guidance = `<p>This registration is <strong>incomplete</strong>. Resolve the blocking issues below before the appointment.</p>`;
  } else if (registrationClass === 'registered') {
    guidance = `<p>The death is <strong>registered</strong>. Make sure you have the certificate for burial or cremation, the Tell Us Once reference, and the certified copies you need.</p>`;
  } else {
    guidance = `<p>This registration is <strong>ready to register</strong>: the medical examiner has confirmed (or the coroner has released the death) and a qualified informant is identified. Register within 5 days of the confirmation.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Death registration - readiness report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${registrationClassClass(registrationClass)}">
        <div>
          <span class="risk-banner-label">Registration class</span>
          <span class="risk-banner-value">${esc(registrationClassLabel(registrationClass))}</span>
        </div>
        <span class="risk-badge">5-day deadline: ${esc(deadlineStatusLabel(deadlineStatus))}</span>
      </div>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Deceased</th><td>${state.deceased.deceasedName ? esc(state.deceased.deceasedName) : '<span class="muted">-</span>'}</td></tr>
          <tr><th scope="row">Place of death</th><td>${state.deceased.deathJurisdiction ? esc(jurisdictionLabel(state.deceased.deathJurisdiction)) : '<span class="muted">-</span>'}</td></tr>
          <tr><th scope="row">Informant</th><td>${state.informant.informantName ? esc(state.informant.informantName) : '<span class="muted">-</span>'}${informantQualified ? ' (qualified)' : ' <span class="muted">(not qualified)</span>'}</td></tr>
          <tr><th scope="row">Basis</th><td>${state.informant.informantRelationship ? esc(relationshipLabel(state.informant.informantRelationship)) : '<span class="muted">-</span>'}</td></tr>
          <tr><th scope="row">Days since confirmation</th><td>${daysSinceConfirmation === null ? '<span class="muted">-</span>' : esc(String(daysSinceConfirmation))}</td></tr>
          <tr><th scope="row">Disposal</th><td>${state.aftercare.disposalMethod ? esc(disposalMethodLabel(state.aftercare.disposalMethod)) : '<span class="muted">-</span>'}</td></tr>
          <tr><th scope="row">Copies</th><td>${state.aftercare.copiesRequested === null ? '<span class="muted">-</span>' : esc(String(state.aftercare.copiesRequested))}${state.aftercare.copyOrderChannel ? ' (' + esc(copyOrderChannelLabel(state.aftercare.copyOrderChannel)) + ')' : ''}</td></tr>
        </tbody>
      </table>

      <h3>Blocking issues (${blockingRules.length})</h3>
      ${blockers}

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
    registrationClass: result.registrationClass,
    deadlineStatus: result.deadlineStatus,
    daysSinceConfirmation: result.daysSinceConfirmation,
    informantQualified: result.informantQualified,
    blockingRules: result.blockingRules,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh registration?')) return;
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
  { step: 1, section: 'deceased',     title: 'Deceased' },
  { step: 2, section: 'medical',      title: 'Medical examiner' },
  { step: 3, section: 'coroner',      title: 'Coroner' },
  { step: 4, section: 'informant',    title: 'Informant' },
  { step: 5, section: 'registration', title: 'Appointment' },
  { step: 6, section: 'aftercare',    title: 'After registration' },
  { step: 7, section: 'summary',      title: 'Summary' }
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
  host.appendChild(renderStep7());
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
