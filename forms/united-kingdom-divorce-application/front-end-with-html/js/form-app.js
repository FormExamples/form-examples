import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { applicationClassClass, applicationClassLabel, applicationModeLabel, applicationTypeLabel, certificateTypeLabel, childrenArrangementsLabel, emptyApplication, feeStatusLabel, financialOrderLabel, priorityLabel, serviceMethodLabel, stageLabel, yesNoLabel } from './types.js';

// United Kingdom divorce / dissolution application (England and Wales) - wizard
// (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the eight sections; a sticky
// top-of-page progress summary reflects how many fields have been answered, and
// a live readout shows the running application class (ready to apply /
// incomplete / not eligible yet), the earliest eligible date for the stage and
// whether a jurisdiction ground is met. Submission runs the pure engine
// (readiness classification plus flagged issues) and renders an inline report.
// State is persisted to localStorage so a partial fill survives a page reload.
//
// This is a COMPLETENESS and VALIDITY instrument, NOT legal advice. The court
// decides every application.


// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-divorce-application.front-end-with-html.v1';

/** @returns {import('./types.js').DivorceApplication} */
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

/** @param {import('./types.js').DivorceApplication} state */
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

/** @type {import('./types.js').DivorceApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-divorce-application',
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

const TOTAL_STEPS = 8;

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

const typeOptions = [
  { value: 'divorce', label: 'Divorce (marriage)' },
  { value: 'dissolution', label: 'Dissolution of a civil partnership' }
];

const modeOptions = [
  { value: 'sole', label: 'Sole application (one of you applies)' },
  { value: 'joint', label: 'Joint application (both of you apply together)' }
];

const stageOptions = [
  { value: 'application', label: 'Application for a divorce (form D8 or online)' },
  { value: 'conditional-order', label: 'Conditional order (form D84)' },
  { value: 'final-order', label: 'Final order (form D36)' }
];

const certificateOptions = [
  { value: 'original', label: 'Original certificate' },
  { value: 'certified-copy', label: 'Certified copy' },
  { value: 'not-held', label: 'Not held' }
];

const nameProofOptions = [
  { value: 'marriage-certificate', label: 'Marriage certificate' },
  { value: 'deed-poll', label: 'Deed poll' },
  { value: 'none', label: 'No proof held' }
];

const serviceOptions = [
  { value: 'email', label: 'By email' },
  { value: 'post', label: 'By post' },
  { value: 'alternative-service', label: 'Alternative service (court order needed)' }
];

const childrenArrangementsOptions = [
  { value: 'agreed', label: 'Agreed' },
  { value: 'not-agreed', label: 'Not agreed' },
  { value: 'undecided', label: 'Undecided' }
];

const financialOrderOptions = [
  { value: 'yes', label: 'Yes, I intend to apply for a financial order' },
  { value: 'no', label: 'No financial order intended' },
  { value: 'undecided', label: 'Undecided' }
];

const feeOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'help-with-fees-approved', label: 'Help with Fees approved' },
  { value: 'help-with-fees-pending', label: 'Help with Fees pending' },
  { value: 'unpaid', label: 'Not paid' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Application type and stage',
    description: 'What you are applying for, whether alone or jointly, which stage you are checking, and the date of the check.'
  });
  card.appendChild(selectInput({
    label: 'Type of application', section: 'application', field: 'applicationType',
    options: typeOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Sole or joint application?', section: 'application', field: 'applicationMode',
    options: modeOptions,
    hint: 'A joint application needs both spouses to agree and is not suitable where there is a risk of domestic abuse.'
  }));
  card.appendChild(selectInput({
    label: 'Stage you are checking', section: 'application', field: 'stage',
    options: stageOptions,
    hint: 'The application, then the conditional order after a 20-week reflection period, then the final order 6 weeks and 1 day later.'
  }));
  card.appendChild(textInput({
    label: 'Date of this check', section: 'application', field: 'asOfDate', type: 'date',
    hint: 'The time gates are tested against this date, so the result is reproducible.'
  }));
  card.appendChild(radioGroup({
    label: 'Is there a risk of domestic abuse?', section: 'application', field: 'domesticAbuseRisk',
    options: yesNo
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Marriage and certificate',
    description: 'When and where you married, whether the marriage is recognised, and the certificate and any name change.'
  });
  card.appendChild(textInput({
    label: 'Date of the marriage or civil partnership', section: 'marriage', field: 'marriageDate', type: 'date',
    hint: 'You must have been married for at least one year before you can apply.'
  }));
  card.appendChild(textInput({
    label: 'Place of the marriage', section: 'marriage', field: 'marriagePlace', placeholder: 'Town or register office'
  }));
  card.appendChild(textInput({
    label: 'Country of the marriage', section: 'marriage', field: 'marriageCountry', placeholder: 'e.g. England, Poland'
  }));
  card.appendChild(radioGroup({
    label: 'Is the marriage or civil partnership legally recognised in the UK?', section: 'marriage',
    field: 'legallyRecognised', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Has the relationship broken down irretrievably?', section: 'marriage',
    field: 'breakdownConfirmed', options: yesNo,
    hint: 'This is the only ground. You do not need to give a reason or blame anyone.'
  }));
  card.appendChild(selectInput({
    label: 'Marriage certificate held', section: 'marriage', field: 'marriageCertificateType',
    options: certificateOptions, hint: 'The original certificate or a certified copy is required.'
  }));
  card.appendChild(radioGroup({
    label: 'Is the marriage certificate in English?', section: 'marriage', field: 'certificateInEnglish',
    options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do you hold a certified translation?', section: 'marriage', field: 'certifiedTranslation',
    options: yesNo, hint: 'Needed when the certificate is not in English.'
  }));
  card.appendChild(radioGroup({
    label: 'Has your name changed since the marriage?', section: 'marriage', field: 'nameChanged',
    options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Proof of the name change', section: 'marriage', field: 'nameChangeProof',
    options: nameProofOptions
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Jurisdiction',
    description: 'The courts of England and Wales can hear the case only if a residence or domicile ground is met.'
  });
  card.appendChild(radioGroup({
    label: 'Are you habitually resident in England and Wales?', section: 'jurisdiction',
    field: 'applicantHabitualResident', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Months you have been habitually resident there', section: 'jurisdiction',
    field: 'applicantResidenceMonths', type: 'number', min: 0, max: 1200,
    hint: '12 months, or 6 months if you are also domiciled there, is enough for a sole application.'
  }));
  card.appendChild(radioGroup({
    label: 'Are you domiciled in England and Wales?', section: 'jurisdiction',
    field: 'applicantDomiciled', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is your spouse or civil partner habitually resident in England and Wales?', section: 'jurisdiction',
    field: 'respondentHabitualResident', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is your spouse or civil partner domiciled in England and Wales?', section: 'jurisdiction',
    field: 'respondentDomiciled', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Were you both last habitually resident there, and does one of you still live there?', section: 'jurisdiction',
    field: 'lastHabituallyResidentTogether', options: yesNo
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'The parties and service address',
    description: 'Full names and addresses. For a sole application the court must be able to serve the papers on your spouse.'
  });
  card.appendChild(textInput({
    label: 'Your full name', section: 'parties', field: 'applicantName', required: true,
    placeholder: 'As on the marriage certificate'
  }));
  card.appendChild(textArea({
    label: 'Your address', section: 'parties', field: 'applicantAddress', rows: 3
  }));
  card.appendChild(textInput({
    label: 'Your email address', section: 'parties', field: 'applicantEmail', type: 'email'
  }));
  card.appendChild(textInput({
    label: 'Spouse or civil partner - full name', section: 'parties', field: 'respondentName'
  }));
  card.appendChild(radioGroup({
    label: 'Do you know your spouse\'s current address?', section: 'parties', field: 'respondentAddressKnown',
    options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Spouse or civil partner - address (service address)', section: 'parties', field: 'respondentAddress', rows: 3
  }));
  card.appendChild(textInput({
    label: 'Spouse or civil partner - email address', section: 'parties', field: 'respondentEmail', type: 'email',
    hint: 'If given, the papers are sent online; otherwise by post.'
  }));
  card.appendChild(selectInput({
    label: 'How will the application be served?', section: 'parties', field: 'serviceMethod',
    options: serviceOptions
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Children',
    description: 'Arrangements for children under 18. The court does not decide these as part of the divorce unless there is a dispute.'
  });
  card.appendChild(radioGroup({
    label: 'Are there children of the family under 18?', section: 'children', field: 'childrenUnder18',
    options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Number of children under 18', section: 'children', field: 'childrenCount',
    type: 'number', min: 0, max: 30
  }));
  card.appendChild(selectInput({
    label: 'Arrangements for the children', section: 'children', field: 'childrenArrangements',
    options: childrenArrangementsOptions
  }));
  card.appendChild(textArea({
    label: 'Note on the children arrangements', section: 'children', field: 'childrenNote',
    placeholder: 'Where the children live, contact, maintenance'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Money, property and the fee',
    description: 'A financial order is separate from the divorce. Apply for it before the final order if you want a legally binding settlement.'
  });
  card.appendChild(selectInput({
    label: 'Do you intend to apply for a financial order?', section: 'finances', field: 'financialOrderIntended',
    options: financialOrderOptions
  }));
  card.appendChild(radioGroup({
    label: 'Has a financial order been applied for?', section: 'finances', field: 'financialOrderApplied',
    options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Court fee status', section: 'finances', field: 'feeStatus',
    options: feeOptions,
    hint: 'The application fee is GBP 628 and is not refunded once issued. Help with Fees may be available.'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Progress and dates',
    description: 'Dates the court has given you. The 20-week and 6-weeks-and-1-day waits run from these.'
  });
  card.appendChild(textInput({
    label: 'Date the court issued the application', section: 'progress', field: 'applicationIssuedDate', type: 'date',
    hint: 'A conditional order can be applied for 20 weeks after this date.'
  }));
  card.appendChild(radioGroup({
    label: 'Has your spouse returned the acknowledgement of service?', section: 'progress',
    field: 'respondentAcknowledged', options: yesNo, hint: 'Sole applications only; they have 14 days to respond.'
  }));
  card.appendChild(textInput({
    label: 'Date the conditional order was made', section: 'progress', field: 'conditionalOrderGrantedDate', type: 'date',
    hint: 'A final order can be applied for 6 weeks and 1 day (43 days) after this date.'
  }));
  card.appendChild(radioGroup({
    label: 'Is any delay of more than 12 months since the conditional order explained?', section: 'progress',
    field: 'finalOrderDelayExplained', options: yesNo
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Summary and readiness',
    description: 'The live application class, the earliest eligible date for the stage, and the jurisdiction result. Submit to generate the full report.'
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

/** Render the live status: class badge, earliest date, jurisdiction note. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${applicationClassClass(result.applicationClass)}">${esc(applicationClassLabel(result.applicationClass))}</span>`;
  const earliest = result.earliestEligibleDate
    ? `<strong>Earliest date for this stage:</strong> ${esc(result.earliestEligibleDate)}`
    : `<span class="muted">No time gate determinable yet</span>`;
  const juris = result.jurisdictionMet
    ? `<span class="muted">- jurisdiction ground met</span>`
    : `<span class="muted">- no jurisdiction ground met yet</span>`;
  return `${badge} ${earliest} ${juris}`;
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


const STEP_SLOTS = {
  application: [['applicationType'], ['applicationMode'], ['stage'], ['asOfDate'], ['domesticAbuseRisk']],
  marriage: [['marriageDate'], ['legallyRecognised'], ['breakdownConfirmed'], ['marriageCertificateType'], ['certificateInEnglish']],
  jurisdiction: [['applicantHabitualResident'], ['applicantDomiciled'], ['respondentHabitualResident'], ['respondentDomiciled']],
  parties: [['applicantName'], ['respondentName'], ['respondentAddressKnown'], ['serviceMethod']],
  children: [['childrenUnder18'], ['childrenArrangements']],
  finances: [['financialOrderIntended'], ['feeStatus']],
  progress: [['applicationIssuedDate'], ['conditionalOrderGrantedDate']]
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
    applicationClass, earliestEligibleDate, jurisdictionMet, rules,
    flaggedIssues, timestamp
  } = lastResult;

  const dash = '<span class="muted">-</span>';
  const val = (v) => (v === null || v === undefined || v === '' ? dash : esc(v));
  const m = state.marriage;
  const p = state.parties;

  const rulesList = rules.length === 0
    ? `<p class="muted">No readiness rule fired.</p>`
    : `<ul class="flags">${rules.map((r) => `
        <li class="flag-low">
          <span class="flag-priority">${esc(r.dimension)}</span>
          <span class="flag-category">${esc(r.id)}</span>
          <span class="flag-message">${esc(r.description)}</span>
        </li>`).join('')}</ul>`;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No eligibility, document, service or timing flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` - ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  let guidance;
  if (applicationClass === 'not-eligible-yet') {
    guidance = `<p>This ${esc(stageLabel(state.application.stage))} stage is <strong>not eligible yet</strong>: the time gate has not opened${earliestEligibleDate ? `, and the earliest date is <strong>${esc(earliestEligibleDate)}</strong>` : ''}. An application made now would be refused. This is a timing finding, not legal advice.</p>`;
  } else if (applicationClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: required information, a document or an eligibility fact is missing or unmet. Resolve the items below before you apply. This is a completeness finding, not legal advice.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to apply</strong> for the ${esc(stageLabel(state.application.stage))} stage: the time gate is met and the required information is present. This does <strong>not</strong> guarantee that the court will grant it, and it is not legal advice.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Divorce or Dissolution Application - Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${applicationClassClass(applicationClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(applicationClassLabel(applicationClass))}</span>
        </div>
        ${jurisdictionMet ? '' : '<span class="risk-badge risk-high">No jurisdiction ground met</span>'}
      </div>

      <p><strong>Earliest eligible date for this stage:</strong> ${earliestEligibleDate ? esc(earliestEligibleDate) : '<span class="muted">Not determinable (no time gate or date missing)</span>'}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Application summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Type</th><td>${val(applicationTypeLabel(state.application.applicationType))}</td></tr>
          <tr><th scope="row">Mode</th><td>${val(applicationModeLabel(state.application.applicationMode))}</td></tr>
          <tr><th scope="row">Stage</th><td>${val(stageLabel(state.application.stage))}</td></tr>
          <tr><th scope="row">Married on</th><td>${val(m.marriageDate)}</td></tr>
          <tr><th scope="row">Marriage certificate</th><td>${val(certificateTypeLabel(m.marriageCertificateType))}</td></tr>
          <tr><th scope="row">Applicant</th><td>${val(p.applicantName)}</td></tr>
          <tr><th scope="row">Other spouse</th><td>${val(p.respondentName)}</td></tr>
          <tr><th scope="row">Service</th><td>${val(serviceMethodLabel(p.serviceMethod))}</td></tr>
          <tr><th scope="row">Children under 18</th><td>${val(yesNoLabel(state.children.childrenUnder18))}${state.children.childrenArrangements ? ' (' + esc(childrenArrangementsLabel(state.children.childrenArrangements)) + ')' : ''}</td></tr>
          <tr><th scope="row">Financial order</th><td>${val(financialOrderLabel(state.finances.financialOrderIntended))}</td></tr>
          <tr><th scope="row">Fee</th><td>${val(feeStatusLabel(state.finances.feeStatus))}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Apply on GOV.UK (online or form D8). After the application is issued, wait 20 weeks and apply for the conditional order (form D84); wait 6 weeks and 1 day and apply for the final order (form D36), which ends the marriage. Apply for any financial order before the final order.</p>

      <h3>Rules fired (${rules.length})</h3>
      ${rulesList}

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
  const result = validateApplication(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    applicationClass: result.applicationClass,
    earliestEligibleDate: result.earliestEligibleDate,
    jurisdictionMet: result.jurisdictionMet,
    rules: result.rules,
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
  { step: 1, section: 'application',  title: 'Application' },
  { step: 2, section: 'marriage',     title: 'Marriage' },
  { step: 3, section: 'jurisdiction', title: 'Jurisdiction' },
  { step: 4, section: 'parties',      title: 'Parties' },
  { step: 5, section: 'children',     title: 'Children' },
  { step: 6, section: 'finances',     title: 'Money and fee' },
  { step: 7, section: 'progress',     title: 'Dates' },
  { step: 8, section: 'summary',      title: 'Summary' }
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
  host.appendChild(renderStep8());
}

function init() {
  if (state.application.asOfDate === null) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    state.application.asOfDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    saveState(state);
  }
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
