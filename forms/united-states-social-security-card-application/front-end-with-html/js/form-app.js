import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { OPTIONS, applicationClassClass, applicationClassLabel, emptyApplication, optionLabel, priorityLabel, yesNoLabel } from './types.js';
import { evidenceGaps, missingFields } from './rules.js';

// United States Social Security card application (Form SS-5) - wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant or preparer scrolls through the six sections;
// a sticky top-of-page progress summary reflects how many fields have been
// answered, and a live readout shows the running application class
// (ready-to-submit / incomplete / evidence-missing / not-eligible) and the
// evidence gaps. Submission runs the pure engine (classification plus flagged
// issues) and renders an inline report. State is persisted to localStorage so a
// partial fill survives a page reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice and NOT an SSA
// decision. The engine checks completeness and evidence against the published
// SS-5 rules only. The Social Security number is never collected.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-social-security-card-application.front-end-with-html.v1';

/** @returns {import('./types.js').SocialSecurityApplication} */
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

/** @param {import('./types.js').SocialSecurityApplication} state */
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

/** @type {import('./types.js').SocialSecurityApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-social-security-card-application',
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
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

const yesNo = OPTIONS.yesNo;
const yesNoUnknown = OPTIONS.yesNoUnknown;

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'What you are requesting',
    description: 'The type of card, how the application is submitted, and the replacement history that decides the 3-per-year and 10-per-lifetime limits.'
  });
  card.appendChild(selectInput({
    label: 'Type of request', section: 'request', field: 'requestType',
    options: OPTIONS.requestType
  }));
  card.appendChild(textInput({
    label: 'Application date (item 15)', section: 'request', field: 'applicationDate', type: 'date'
  }));
  card.appendChild(selectInput({
    label: 'How the application is submitted', section: 'request', field: 'channel',
    options: OPTIONS.channel,
    hint: 'An applicant aged 12 or older requesting an original card must apply in person.'
  }));
  card.appendChild(radioGroup({
    label: 'Has anyone ever applied for or received a Social Security number for this person? (item 12)',
    section: 'request', field: 'previouslyApplied', options: yesNoUnknown
  }));
  card.appendChild(radioGroup({
    label: 'Has the name changed because of a legal name change?', section: 'request',
    field: 'nameChange', options: yesNo,
    hint: 'A legal name change does not count toward the replacement-card limits.'
  }));
  card.appendChild(selectInput({
    label: 'Reason for the name change', section: 'request', field: 'nameChangeReason',
    options: OPTIONS.nameChangeReason
  }));
  card.appendChild(radioGroup({
    label: 'Does this request correct the date of birth SSA holds?', section: 'request',
    field: 'dateOfBirthCorrection', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Replacement cards already issued this calendar year', section: 'request',
    field: 'replacementsThisYear', type: 'number', min: 0, max: 99,
    hint: 'Limit: 3 per calendar year. Count replacements only, not the original card.'
  }));
  card.appendChild(textInput({
    label: 'Replacement cards already issued in a lifetime', section: 'request',
    field: 'replacementsLifetime', type: 'number', min: 0, max: 99,
    hint: 'Limit: 10 per lifetime.'
  }));
  card.appendChild(selectInput({
    label: 'Exception reason if a limit is reached', section: 'request', field: 'limitExceptionReason',
    options: OPTIONS.limitExceptionReason,
    hint: 'Name change, legend change, non-receipt, SSA error, or hardship.'
  }));
  card.appendChild(radioGroup({
    label: 'Do you have documents supporting that exception?', section: 'request',
    field: 'limitExceptionEvidence', options: yesNo
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'The applicant',
    description: 'Items 1 to 11, 13, 14, 16, and 17 of Form SS-5. Do not enter the Social Security number.'
  });
  card.appendChild(textInput({
    label: 'Name to be shown on the card (item 1)', section: 'applicant', field: 'nameOnCard',
    placeholder: 'First, middle, last'
  }));
  card.appendChild(textInput({
    label: 'Full name at birth (item 2)', section: 'applicant', field: 'nameAtBirth'
  }));
  card.appendChild(textInput({
    label: 'Other names used (item 3)', section: 'applicant', field: 'otherNamesUsed'
  }));
  card.appendChild(textInput({
    label: 'Name on the most recent Social Security card (item 13)', section: 'applicant',
    field: 'nameOnMostRecentCard', hint: 'Required for a replacement or corrected card.'
  }));
  card.appendChild(textInput({
    label: 'Date of birth (item 7)', section: 'applicant', field: 'dateOfBirth', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'City or town of birth (item 6)', section: 'applicant', field: 'placeOfBirthCity'
  }));
  card.appendChild(textInput({
    label: 'State or country of birth (item 6)', section: 'applicant', field: 'placeOfBirthRegion'
  }));
  card.appendChild(selectInput({
    label: 'Sex (item 11)', section: 'applicant', field: 'sex', options: OPTIONS.sex
  }));
  card.appendChild(selectInput({
    label: 'Citizenship (item 8)', section: 'applicant', field: 'citizenship', options: OPTIONS.citizenship
  }));
  card.appendChild(radioGroup({
    label: 'If a legal alien not allowed to work: is a valid non-work reason documented?',
    section: 'applicant', field: 'nonWorkReasonValid', options: yesNo,
    hint: 'A federal statute or regulation, or a state or local law, that requires an SSN to receive a benefit.'
  }));
  card.appendChild(textInput({
    label: "Mother's name at her birth (item 4)", section: 'applicant', field: 'motherNameAtBirth',
    hint: 'Write "unknown" if not known.'
  }));
  card.appendChild(textInput({
    label: "Father's name (item 5)", section: 'applicant', field: 'fatherName',
    hint: 'Write "unknown" if not known.'
  }));
  card.appendChild(textInput({
    label: 'State of residence', section: 'applicant', field: 'stateOfResidence',
    placeholder: 'e.g. CA',
    hint: 'Two-letter USPS code. The SS-5 rules are federal and do not vary by state.'
  }));
  card.appendChild(textArea({
    label: 'Mailing address (item 17)', section: 'applicant', field: 'mailingAddress', rows: 3
  }));
  card.appendChild(textInput({
    label: 'Daytime telephone (item 16)', section: 'applicant', field: 'phone', type: 'tel'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Evidence documents',
    description: 'Proof of identity, age, and US citizenship or lawful alien status. SSA accepts only original documents or copies certified by the issuing agency.'
  });
  card.appendChild(selectInput({
    label: 'Proof of identity', section: 'evidence', field: 'identityDocument', options: OPTIONS.identityDocument,
    hint: 'Must be current and unexpired, and show your name, identifying information, and preferably a photograph.'
  }));
  card.appendChild(radioGroup({
    label: 'Is the identity document expired?', section: 'evidence', field: 'identityDocumentExpired', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Proof of age', section: 'evidence', field: 'ageDocument', options: OPTIONS.ageDocument,
    hint: 'Required for an original card and for a date-of-birth correction. A birth certificate is preferred.'
  }));
  card.appendChild(selectInput({
    label: 'Proof of US citizenship or lawful alien status', section: 'evidence', field: 'citizenshipDocument',
    options: OPTIONS.citizenshipDocument
  }));
  card.appendChild(radioGroup({
    label: 'Does SSA already hold your citizenship or status evidence?', section: 'evidence',
    field: 'citizenshipOnFile', options: yesNoUnknown,
    hint: 'For a replacement card, evidence already on file need not be shown again.'
  }));
  card.appendChild(selectInput({
    label: 'Legal name-change document', section: 'evidence', field: 'nameChangeDocument',
    options: OPTIONS.nameChangeDocument
  }));
  card.appendChild(radioGroup({
    label: 'Is every document an original or an agency-certified copy?', section: 'evidence',
    field: 'documentsOriginalOrCertified', options: yesNo,
    hint: 'Photocopies and notarized copies are not accepted.'
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Who is signing',
    description: 'Items 18 and 19. A parent or legal guardian signs for an applicant under 18.'
  });
  card.appendChild(selectInput({
    label: 'Signer relationship to the person in item 1 (item 18)', section: 'filer', field: 'signerRelationship',
    options: OPTIONS.signerRelationship
  }));
  card.appendChild(textInput({
    label: 'Signer name, if not the applicant', section: 'filer', field: 'signerName'
  }));
  card.appendChild(radioGroup({
    label: 'Has the signer, if not the applicant, brought their own proof of identity?', section: 'filer',
    field: 'signerIdentityDocument', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is the application signed? (item 19)', section: 'filer', field: 'signaturePresent', options: yesNo
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Tell SSA: death-related items',
    description: 'SSA does not issue a card for a person who has died. If the person has died, report the death instead of applying.'
  });
  card.appendChild(radioGroup({
    label: 'Has the person in item 1 died?', section: 'tellSsa', field: 'applicantDeceased', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Has the death already been reported to SSA?', section: 'tellSsa', field: 'deathReportedToSsa',
    options: yesNo, hint: 'The funeral home usually reports it, or call 1-800-772-1213.'
  }));
  card.appendChild(textArea({
    label: 'Preparer note', section: 'tellSsa', field: 'preparerNote',
    placeholder: 'Free-text note from the person preparing the application.'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Summary and class',
    description: 'The live application class and evidence gaps. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live application status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: class badge and the evidence-gap count. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${applicationClassClass(result.applicationClass)}">${esc(applicationClassLabel(result.applicationClass))}</span>`;
  const gaps = result.missingEvidenceCount > 0
    ? `<strong>Evidence gaps:</strong> ${result.missingEvidenceCount}`
    : `<span class="muted">No evidence gaps recorded</span>`;
  const limit = result.replacementLimitReached
    ? `<span class="muted">- replacement limit reached</span>`
    : '';
  return `${badge} ${gaps} ${limit}`;
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
  request: [['requestType'], ['applicationDate'], ['channel'], ['nameChange']],
  applicant: [['nameOnCard'], ['nameAtBirth'], ['dateOfBirth'], ['placeOfBirthCity', 'placeOfBirthRegion'], ['citizenship'], ['mailingAddress']],
  evidence: [['identityDocument'], ['ageDocument'], ['citizenshipDocument'], ['documentsOriginalOrCertified']],
  filer: [['signerRelationship'], ['signaturePresent']],
  tellSsa: [['applicantDeceased']]
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
    applicationClass, missingEvidenceCount, replacementLimitReached,
    flaggedIssues, timestamp
  } = lastResult;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No eligibility, evidence, or completeness flags raised.</p>`
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
  if (applicationClass === 'not-eligible') {
    guidance = `<p>This application is classified <strong>not eligible</strong>: either the person has died (SSA issues no card for a deceased person; report the death instead) or a replacement-card limit is reached with no supported exception. This is a documentation finding; SSA makes the decision.</p>`;
  } else if (applicationClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: required items are blank, the submission route is wrong for the applicant's age, or a parent or guardian must sign. Complete the items flagged below.</p>`;
  } else if (applicationClass === 'evidence-missing') {
    guidance = `<p>The form is complete but <strong>evidence is missing</strong>: SSA needs current, original (or agency-certified) proof of identity, age, citizenship or lawful alien status, and any name change. Gather the documents flagged below.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to submit</strong>: the items are complete and the evidence recorded matches the SS-5 rules. This is a completeness finding only; SSA decides every application.</p>`;
  }

  const rows = [
    ['Request', optionLabel('requestType', state.request.requestType)],
    ['Application date', state.request.applicationDate],
    ['Name on card', state.applicant.nameOnCard],
    ['State of residence', state.applicant.stateOfResidence],
    ['Citizenship', optionLabel('citizenship', state.applicant.citizenship)],
    ['Proof of identity', optionLabel('identityDocument', state.evidence.identityDocument)],
    ['Proof of age', optionLabel('ageDocument', state.evidence.ageDocument)],
    ['Proof of citizenship or status', optionLabel('citizenshipDocument', state.evidence.citizenshipDocument)],
    ['Original or certified documents', yesNoLabel(state.evidence.documentsOriginalOrCertified)],
    ['Signer', optionLabel('signerRelationship', state.filer.signerRelationship)]
  ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${v ? esc(v) : '<span class="muted">-</span>'}</td></tr>`).join('');

  const missing = missingFields(state);
  const gaps = evidenceGaps(state);
  const checklist = (missing.length + gaps.length) === 0
    ? '<p class="muted">Nothing outstanding.</p>'
    : `<ul>${missing.map((m) => `<li>Form item: ${esc(m.label)}</li>`).join('')}${gaps.map((g) => `<li>Evidence: ${esc(g.label)}</li>`).join('')}</ul>`;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Social Security Card Application - Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${applicationClassClass(applicationClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(applicationClassLabel(applicationClass))}</span>
        </div>
        ${replacementLimitReached ? '<span class="risk-badge risk-high">Replacement limit reached</span>' : ''}
      </div>

      <p><strong>Evidence gaps:</strong> ${missingEvidenceCount}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Application summary</h3>
      <table class="subscales">
        <tbody>${rows}</tbody>
      </table>

      <h3>What is still outstanding</h3>
      ${checklist}

      <h3>Next steps</h3>
      <p>Take the application and the original documents to a Social Security office, or follow the instructions at ssa.gov for the mail or online options that apply. Do not send original documents without checking SSA's current guidance, and never put the Social Security number in unsecured email.</p>

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
    missingEvidenceCount: result.missingEvidenceCount,
    replacementLimitReached: result.replacementLimitReached,
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
  { step: 1, section: 'request',   title: 'Request' },
  { step: 2, section: 'applicant', title: 'Applicant' },
  { step: 3, section: 'evidence',  title: 'Evidence' },
  { step: 4, section: 'filer',     title: 'Signer' },
  { step: 5, section: 'tellSsa',   title: 'Tell SSA' },
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
