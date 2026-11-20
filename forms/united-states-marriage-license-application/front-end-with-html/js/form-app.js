import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { ruleFor, waitingDays, witnessesRequired } from './rules.js';
import { LABELS, applicationClassClass, applicationClassLabel, emptyApplication, maritalStatusLabel, officiantTypeLabel, priorityLabel, ssnStatusLabel, yesNoLabel } from './types.js';

// United States Marriage License Application -- wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicants scroll through the seven sections; a sticky
// top-of-page progress summary reflects how many fields have been answered, and
// a live readout shows the running class (ready-to-apply / incomplete /
// not-eligible) and the earliest ceremony date and license expiry the state rule
// implies. Submission runs the pure engine (classification plus flagged issues)
// and renders an inline report. State is persisted to localStorage so a partial
// fill survives a page reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice. The issuing
// county clerk (or a court) decides; state rules change.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-marriage-license-application.front-end-with-html.v1';

/** @returns {import('./types.js').MarriageApplication} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyApplication();

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
    if (!raw) return emptyApplication();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved application; starting fresh.', e);
    return emptyApplication();
  }
}

/** @param {import('./types.js').MarriageApplication} state */
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

/** @type {import('./types.js').MarriageApplication} */
let state = loadState();

/** @type {import('./types.js').object | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-marriage-license-application',
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

const US_STATES = [
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
];
const stateOptions = US_STATES.map(([value, label]) => ({ value, label: `${label} (${value})` }));

const labelOptions = (table) => Object.keys(LABELS[table]).map((value) => ({ value, label: LABELS[table][value] }));
const sexOptions = labelOptions('sex');
const maritalOptions = labelOptions('maritalStatus');
const ssnOptions = labelOptions('ssnStatus');
const licenseTypeOptions = labelOptions('licenseType');
const relationshipOptions = labelOptions('relationship');
const minorConsentOptions = labelOptions('minorConsent');
const bloodTestOptions = labelOptions('bloodTest');
const officiantOptions = labelOptions('officiantType');

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Issuing jurisdiction',
    description: 'Marriage law is set by each state, and a county clerk issues the license. Choose the state and county where you will apply.'
  });
  card.appendChild(selectInput({
    label: 'State', section: 'jurisdiction', field: 'state', options: stateOptions, required: true,
    hint: 'Eleven states are encoded here in detail; any other state uses the uniform default and raises a "verify state rule" flag.'
  }));
  card.appendChild(textInput({
    label: 'County (or clerk jurisdiction)', section: 'jurisdiction', field: 'county', required: true,
    placeholder: 'e.g. Los Angeles County'
  }));
  card.appendChild(textInput({
    label: 'Date of application', section: 'jurisdiction', field: 'applicationDate', type: 'date'
  }));
  card.appendChild(selectInput({
    label: 'License type', section: 'jurisdiction', field: 'licenseType', options: licenseTypeOptions,
    hint: 'California offers a confidential license that needs no witness; most states issue only one kind.'
  }));
  return card;
}

function renderApplicant(stepNumber, section, title, ordinal) {
  const card = sectionCard({
    stepNumber,
    title,
    description: `Details of the ${ordinal} applicant, as they appear on government photo identification.`
  });
  card.appendChild(textInput({
    label: `${ordinal[0].toUpperCase()}${ordinal.slice(1)} applicant — full legal name`, section, field: 'name', required: true
  }));
  card.appendChild(selectInput({
    label: 'Sex or gender', section, field: 'sex', options: sexOptions,
    hint: 'Optional and never affects eligibility; same-sex couples may marry in every state (Obergefell v. Hodges).'
  }));
  card.appendChild(textInput({ label: 'Date of birth', section, field: 'dateOfBirth', type: 'date' }));
  card.appendChild(textInput({ label: 'Place of birth', section, field: 'placeOfBirth', placeholder: 'City, state or country' }));
  card.appendChild(selectInput({ label: 'State of residence', section, field: 'residenceState', options: stateOptions }));
  card.appendChild(radioGroup({
    label: 'Government photo ID presented?', section, field: 'idPresented', options: yesNo,
    hint: 'Driver license, state ID, or passport; some clerks also ask for a birth certificate.'
  }));
  card.appendChild(selectInput({
    label: 'Social Security number', section, field: 'ssnStatus', options: ssnOptions,
    hint: 'The number itself is never stored here. Federal law has states collect it where one was issued.'
  }));
  card.appendChild(selectInput({ label: 'Marital status before this marriage', section, field: 'maritalStatus', options: maritalOptions }));
  card.appendChild(textInput({
    label: 'Date the prior marriage ended', section, field: 'priorMarriageEndedDate', type: 'date',
    hint: 'Divorce decree date, date of death, or annulment date. Leave blank if never married.'
  }));
  return card;
}

function renderStep2() { return renderApplicant(2, 'applicantOne', 'First applicant', 'first'); }
function renderStep3() { return renderApplicant(3, 'applicantTwo', 'Second applicant', 'second'); }

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Eligibility',
    description: 'Relationship, age and consent, appearance, proxy, and any premarital requirements.'
  });
  card.appendChild(selectInput({
    label: 'Relationship between the applicants', section: 'eligibility', field: 'relationshipBetweenApplicants',
    options: relationshipOptions, hint: 'States prohibit marriage between close relatives; the degree varies.'
  }));
  card.appendChild(selectInput({
    label: 'Consent for an applicant under 18', section: 'eligibility', field: 'minorConsent', options: minorConsentOptions,
    hint: 'Most states set 18 as the age to marry; a few allow 16 or 17 with consent or a court order, and a growing number allow none.'
  }));
  card.appendChild(radioGroup({ label: 'Will both applicants appear in person before the clerk?', section: 'eligibility', field: 'appearInPerson', options: yesNo }));
  card.appendChild(radioGroup({
    label: 'Is a proxy marriage requested?', section: 'eligibility', field: 'proxyRequested', options: yesNo,
    hint: 'A few states allow proxy marriage only for a deployed service member.'
  }));
  card.appendChild(radioGroup({ label: 'Is either applicant on active military duty?', section: 'eligibility', field: 'activeDutyMilitary', options: yesNo }));
  card.appendChild(radioGroup({
    label: 'Completed a state-approved premarital course?', section: 'eligibility', field: 'premaritalCourseCompleted', options: yesNo,
    hint: 'Waives the waiting period and reduces the fee in Florida and Texas.'
  }));
  card.appendChild(selectInput({
    label: 'Premarital blood-test evidence', section: 'eligibility', field: 'bloodTestEvidence', options: bloodTestOptions,
    hint: 'No state requires a test today, but a few older rules and forms still mention one.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'License issuance and fee',
    description: 'When the clerk issued the license, and the fee paid. The waiting period and validity period run from the issue date.'
  });
  card.appendChild(textInput({ label: 'License issue date', section: 'issuance', field: 'licenseIssuedDate', type: 'date' }));
  card.appendChild(textInput({
    label: 'Fee paid (US dollars)', section: 'issuance', field: 'feePaidUsd', type: 'number', min: 0,
    hint: 'Clerks set the fee by county; many states discount it after a premarital course.'
  }));
  card.appendChild(textArea({ label: 'Note', section: 'issuance', field: 'clerkNote', placeholder: 'Free-text note from the applicants or the clerk.' }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Ceremony and marriage certificate',
    description: 'After the ceremony the officiant returns the signed license; the clerk records it and issues the certified marriage certificate.'
  });
  card.appendChild(textInput({ label: 'Ceremony date', section: 'ceremony', field: 'ceremonyDate', type: 'date' }));
  card.appendChild(selectInput({ label: 'Who solemnized the marriage?', section: 'ceremony', field: 'officiantType', options: officiantOptions }));
  card.appendChild(textInput({ label: 'Officiant name', section: 'ceremony', field: 'officiantName' }));
  card.appendChild(radioGroup({
    label: 'Is the officiant authorized to solemnize marriages in this state?', section: 'ceremony', field: 'officiantAuthorized', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Witnesses present', section: 'ceremony', field: 'witnessCount', type: 'number', min: 0,
    hint: 'New York needs one, Washington two, and California one on a public license.'
  }));
  card.appendChild(textInput({ label: 'Date the signed license was returned to the clerk', section: 'ceremony', field: 'licenseReturnedDate', type: 'date' }));
  card.appendChild(textInput({ label: 'Certified copies requested', section: 'ceremony', field: 'certifiedCopiesRequested', type: 'number', min: 0 }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and class',
    description: 'The live class and the two dates the state rule implies. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live eligibility status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: class badge, earliest ceremony date, and expiry. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${applicationClassClass(result.applicationClass)}">${esc(applicationClassLabel(result.applicationClass))}</span>`;
  const earliest = result.earliestCeremonyDate
    ? `<strong>Earliest ceremony:</strong> ${esc(result.earliestCeremonyDate)}`
    : `<span class="muted">Earliest ceremony not yet determinable (no application or issue date)</span>`;
  const expiry = result.licenseExpiryDate
    ? `<span class="muted">— license valid through ${esc(result.licenseExpiryDate)}</span>`
    : '';
  return `${badge} ${earliest} ${expiry}`;
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
  jurisdiction: [['state'], ['county'], ['applicationDate']],
  applicantOne: [['name'], ['dateOfBirth'], ['maritalStatus'], ['idPresented']],
  applicantTwo: [['name'], ['dateOfBirth'], ['maritalStatus'], ['idPresented']],
  eligibility: [['relationshipBetweenApplicants'], ['appearInPerson'], ['minorConsent']],
  issuance: [['licenseIssuedDate'], ['feePaidUsd']],
  ceremony: [['ceremonyDate'], ['officiantType'], ['witnessCount']]
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

const dash = '<span class="muted">—</span>';
const show = (v) => (v === null || v === undefined || v === '' ? dash : esc(v));

function applicantRows(a, label) {
  return `
    <tr><th scope="row" colspan="2">${esc(label)}</th></tr>
    <tr><th scope="row">Name</th><td>${show(a.name)}</td></tr>
    <tr><th scope="row">Date of birth</th><td>${show(a.dateOfBirth)}</td></tr>
    <tr><th scope="row">Marital status</th><td>${show(maritalStatusLabel(a.maritalStatus))}${a.priorMarriageEndedDate ? ' (ended ' + esc(a.priorMarriageEndedDate) + ')' : ''}</td></tr>
    <tr><th scope="row">Photo ID presented</th><td>${show(yesNoLabel(a.idPresented))}</td></tr>
    <tr><th scope="row">Social Security number</th><td>${show(ssnStatusLabel(a.ssnStatus))}</td></tr>
  `;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { applicationClass, earliestCeremonyDate, licenseExpiryDate, stateRuleKnown, flaggedIssues, timestamp } = lastResult;
  const rule = ruleFor(state);
  const wait = waitingDays(state);
  const witnesses = witnessesRequired(state);

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No eligibility, timing, ceremony, or certificate flags raised.</p>`
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
  if (applicationClass === 'not-eligible') {
    guidance = `<p>Something in this application bars the license under the rule applied: an applicant is under the minimum age with no permitted path, an applicant is still married, the applicants are related within a prohibited degree, or a proxy marriage is requested that the state does not allow. The county clerk cannot issue the license until the bar is removed. This is a documentation finding; the clerk or a court decides.</p>`;
  } else if (applicationClass === 'incomplete') {
    guidance = `<p>The application is <strong>incomplete</strong>: required details, identification, the prior-marriage end date, minor consent, or the ceremony timing, witnesses, or officiant still need attention. Resolve the flags below before applying or before the ceremony.</p>`;
  } else {
    guidance = `<p>The application is <strong>ready to apply</strong>: nothing recorded bars the license under the rule applied, and the details the clerk asks for are present. This is a completeness finding; the county clerk decides whether the license issues, and rules change, so confirm the waiting period, fee, and appointment steps with the clerk.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Marriage License Application — Eligibility Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${applicationClassClass(applicationClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(applicationClassLabel(applicationClass))}</span>
        </div>
        ${stateRuleKnown ? '' : '<span class="risk-badge risk-moderate">Verify state rule</span>'}
      </div>

      <p><strong>Earliest permitted ceremony:</strong> ${earliestCeremonyDate ? esc(earliestCeremonyDate) : dash}
        &nbsp; <strong>License valid through:</strong> ${licenseExpiryDate ? esc(licenseExpiryDate) : dash}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>State rule applied: ${esc(rule.name)}</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Minimum age to marry</th><td>${esc(rule.minAge)}</td></tr>
          <tr><th scope="row">Waiting period</th><td>${rule.waitingHours === 0 ? 'None' : esc(rule.waitingHours) + ' hours after issuance'}${wait.waivedBy ? ' (waived: ' + esc(wait.waivedBy) + ')' : ''}</td></tr>
          <tr><th scope="row">License valid for</th><td>${esc(rule.validDays)} days</td></tr>
          <tr><th scope="row">Witnesses at the ceremony</th><td>${esc(witnesses)}</td></tr>
          <tr><th scope="row">Signed license due back</th><td>${esc(rule.returnWithinDays)} days after the ceremony</td></tr>
          <tr><th scope="row">Premarital blood test</th><td>${rule.bloodTest ? 'Required' : 'Not required'}</td></tr>
          <tr><th scope="row">Proxy marriage</th><td>${rule.proxy === 'none' ? 'Not allowed' : 'Active-duty service members only'}</td></tr>
          <tr><th scope="row">Typical fee</th><td>${rule.typicalFeeUsd ? '$' + esc(rule.typicalFeeUsd) + ' (set by county)' : dash}</td></tr>
        </tbody>
      </table>

      <h3>Applicants</h3>
      <table class="subscales">
        <tbody>${applicantRows(state.applicantOne, 'First applicant')}${applicantRows(state.applicantTwo, 'Second applicant')}</tbody>
      </table>

      <h3>Ceremony and certificate</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">License issued</th><td>${show(state.issuance.licenseIssuedDate)}</td></tr>
          <tr><th scope="row">Fee paid</th><td>${state.issuance.feePaidUsd === null ? dash : '$' + esc(state.issuance.feePaidUsd)}</td></tr>
          <tr><th scope="row">Ceremony date</th><td>${show(state.ceremony.ceremonyDate)}</td></tr>
          <tr><th scope="row">Officiant</th><td>${show(officiantTypeLabel(state.ceremony.officiantType))}${state.ceremony.officiantName ? ': ' + esc(state.ceremony.officiantName) : ''}</td></tr>
          <tr><th scope="row">Witnesses present</th><td>${show(state.ceremony.witnessCount)}</td></tr>
          <tr><th scope="row">License returned to the clerk</th><td>${show(state.ceremony.licenseReturnedDate)}</td></tr>
          <tr><th scope="row">Certified copies requested</th><td>${show(state.ceremony.certifiedCopiesRequested)}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Both applicants usually apply together at the county clerk with photo ID. Hold the ceremony after any waiting period and before the license expires, with an authorized officiant and any required witnesses. The officiant returns the signed license to the clerk, who records the marriage; then order certified copies of the marriage certificate (you will need them to change a name or update benefits).</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">This report is documentation support, not legal advice. The issuing county clerk or a court decides, and state rules change.</p>

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
  const result = validateApplication(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    applicationClass: result.applicationClass,
    earliestCeremonyDate: result.earliestCeremonyDate,
    licenseExpiryDate: result.licenseExpiryDate,
    stateRuleKnown: result.stateRuleKnown,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh application?')) return;
  clearState();
  state = emptyApplication();
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
  { step: 1, section: 'jurisdiction',  title: 'Jurisdiction' },
  { step: 2, section: 'applicantOne',  title: 'First applicant' },
  { step: 3, section: 'applicantTwo',  title: 'Second applicant' },
  { step: 4, section: 'eligibility',   title: 'Eligibility' },
  { step: 5, section: 'issuance',      title: 'License and fee' },
  { step: 6, section: 'ceremony',      title: 'Ceremony' },
  { step: 7, section: 'summary',       title: 'Summary' }
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
