import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { STATE_RULES } from './rules.js';
import { applicationClassClass, applicationClassLabel, certificateTypeLabel, deliveryMethodLabel, emptyApplication, idTypeLabel, priorityLabel, purposeLabel, relationshipLabel, sexLabel, yesNoLabel } from './types.js';

// United States Birth Certificate Application - wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the seven sections; a sticky
// progress summary reflects how many fields have been answered, and a live
// readout shows the running class (ready to submit / incomplete / ineligible
// requester), the expected fee, and the state rule in force. Submission runs
// the pure engine (classification plus flagged issues) and renders an inline
// report. State is persisted to localStorage so a partial fill survives a
// page reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice and NOT a
// substitute for the issuing state or territory vital records office, which
// alone decides whether a request is accepted.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-birth-certificate-application.front-end-with-html.v1';

/** @returns {import('./types.js').BirthCertificateApplication} */
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

/** @param {import('./types.js').BirthCertificateApplication} state */
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

/** @type {import('./types.js').BirthCertificateApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-birth-certificate-application',
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

const fromLabels = (values, fn) => values.map((v) => ({ value: v, label: fn(v) }));

const sexOptions = fromLabels(['female', 'male', 'other', 'unknown'], sexLabel);
const relationshipOptions = fromLabels(['self', 'parent', 'legal-guardian', 'legal-representative', 'spouse', 'child', 'sibling', 'grandparent', 'grandchild', 'government-agency', 'other'], relationshipLabel);
const purposeOptions = fromLabels(['passport', 'real-id', 'school', 'employment', 'benefits', 'genealogy', 'foreign-use', 'other'], purposeLabel);
const certificateTypeOptions = fromLabels(['certified-long-form', 'certified-short-form', 'informational'], certificateTypeLabel);
const deliveryOptions = fromLabels(['online', 'mail', 'in-person'], deliveryMethodLabel);
const idTypeOptions = fromLabels(['state-driver-license', 'state-id-card', 'us-passport', 'military-id', 'other-photo-id', 'none'], idTypeLabel);

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Applicant',
    description: 'The person completing and signing this request for a certified copy.'
  });
  card.appendChild(textInput({ label: 'Your full legal name', section: 'applicant', field: 'applicantName', required: true }));
  card.appendChild(textInput({ label: 'Your date of birth', section: 'applicant', field: 'dateOfBirth', type: 'date', hint: 'Used to check minimum-age rules when you request your own record.' }));
  card.appendChild(textInput({ label: 'Email address', section: 'applicant', field: 'email', type: 'email' }));
  card.appendChild(textInput({ label: 'Phone number', section: 'applicant', field: 'phone', type: 'tel' }));
  card.appendChild(textArea({ label: 'Mailing address for delivery', section: 'applicant', field: 'postalAddress', rows: 2 }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Person named on the certificate',
    description: 'The data of the US Standard Certificate of Live Birth that the vital records office needs to find the record.'
  });
  card.appendChild(textInput({ label: 'Full name at birth', section: 'registrant', field: 'registrantName', required: true }));
  card.appendChild(selectInput({ label: 'Sex on the certificate', section: 'registrant', field: 'sex', options: sexOptions }));
  card.appendChild(textInput({ label: 'Date of birth', section: 'registrant', field: 'dateOfBirth', type: 'date', required: true }));
  card.appendChild(textInput({ label: 'City or town of birth', section: 'registrant', field: 'placeOfBirth', required: true }));
  card.appendChild(textInput({ label: 'County of birth', section: 'registrant', field: 'countyOfBirth' }));
  card.appendChild(textInput({ label: 'State or territory of birth (2-letter code)', section: 'registrant', field: 'state', required: true, placeholder: 'e.g. TX', hint: 'The state where the birth occurred issues the certificate; there is no national registry. Find the office through CDC Where to Write for Vital Records.' }));
  card.appendChild(textInput({ label: 'Hospital or facility of birth', section: 'registrant', field: 'birthFacility' }));
  card.appendChild(textInput({ label: 'Mother\'s full name before first marriage', section: 'registrant', field: 'motherNameBeforeFirstMarriage', required: true }));
  card.appendChild(textInput({ label: 'Father\'s or second parent\'s full name', section: 'registrant', field: 'fatherName' }));
  card.appendChild(radioGroup({ label: 'Is the person named deceased?', section: 'registrant', field: 'deceased', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Was the person named adopted?', section: 'registrant', field: 'adopted', options: yesNo }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Relationship and purpose',
    description: 'Who you are to the person named and what the certificate is for. Most states restrict certified copies to people with a direct and tangible interest.'
  });
  card.appendChild(selectInput({ label: 'Your relationship to the person named', section: 'purpose', field: 'relationship', options: relationshipOptions, required: true }));
  card.appendChild(selectInput({ label: 'Purpose of the certificate', section: 'purpose', field: 'purpose', options: purposeOptions, required: true }));
  card.appendChild(radioGroup({ label: 'Will the certificate be used in another country (apostille)?', section: 'purpose', field: 'needsApostille', options: yesNo }));
  const host = document.createElement('div');
  host.setAttribute('data-conditional', 'purpose.needsApostille=yes');
  host.appendChild(textInput({ label: 'Destination country', section: 'purpose', field: 'apostilleCountry' }));
  card.appendChild(host);
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Certificate order',
    description: 'The kind and number of copies, how you will submit, and the fee. Passports and apostilles need the certified long form.'
  });
  card.appendChild(selectInput({ label: 'Type of copy', section: 'order', field: 'certificateType', options: certificateTypeOptions, required: true }));
  card.appendChild(textInput({ label: 'Number of copies', section: 'order', field: 'copies', type: 'number', min: 1, max: 20, required: true }));
  card.appendChild(selectInput({ label: 'How will you submit the request?', section: 'order', field: 'deliveryMethod', options: deliveryOptions, required: true }));
  card.appendChild(textInput({ label: 'Total fee enclosed (US dollars)', section: 'order', field: 'feeEnclosedUsd', type: 'number', min: 0, hint: 'Online orders pay at checkout; leave blank.' }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Identity and supporting documents',
    description: 'Certified copies need a current government photo ID, and proof of relationship or authority where you are not the person named.'
  });
  card.appendChild(selectInput({ label: 'Photo ID you will present', section: 'evidence', field: 'idType', options: idTypeOptions }));
  card.appendChild(radioGroup({ label: 'Is the ID current and unexpired?', section: 'evidence', field: 'idUnexpired', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Do you enclose proof of your relationship to the person named?', section: 'evidence', field: 'proofOfRelationship', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Do you enclose a court order, guardianship letters, or agency authority?', section: 'evidence', field: 'authorityDocument', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Do you enclose a notarized sworn statement of identity?', section: 'evidence', field: 'notarizedSwornStatement', options: yesNo, hint: 'Required by some states (for example California) for mailed requests.' }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Declaration',
    description: 'You declare under penalty of perjury that you are entitled to the record and that the information is true.'
  });
  card.appendChild(radioGroup({ label: 'I have signed the declaration', section: 'declaration', field: 'declarationSigned', options: yesNo, required: true }));
  card.appendChild(textArea({ label: 'Note to the vital records office', section: 'declaration', field: 'applicationNote', placeholder: 'Optional.' }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and readiness',
    description: 'The live class, the expected fee, and the state rule in force. Submit to generate the full report.'
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

function feeText(fee) {
  return fee === null ? 'unknown' : `$${fee.toFixed(2)}`;
}

/** Render the live status: class badge, expected fee, and the rule applied. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${applicationClassClass(result.applicationClass)}">${esc(applicationClassLabel(result.applicationClass))}</span>`;
  const fee = `<strong>Expected fee:</strong> ${esc(feeText(result.expectedFeeUsd))}`;
  const rule = result.stateRuleApplied === 'state'
    ? `<span class="muted">- ${esc(STATE_RULES[String(state.registrant.state).trim().toUpperCase()].name)} rule applied</span>`
    : `<span class="muted">- uniform default rule applied; verify the state rule</span>`;
  return `${badge} ${fee} ${rule}`;
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
  applicant: [['applicantName'], ['dateOfBirth'], ['postalAddress']],
  registrant: [['registrantName'], ['dateOfBirth'], ['placeOfBirth'], ['state'], ['motherNameBeforeFirstMarriage']],
  purpose: [['relationship'], ['purpose']],
  order: [['certificateType'], ['copies'], ['deliveryMethod']],
  evidence: [['idType'], ['idUnexpired']],
  declaration: [['declarationSigned']]
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

  const { applicationClass, expectedFeeUsd, stateRuleApplied, flaggedIssues, timestamp } = lastResult;
  const dash = '<span class="muted">-</span>';
  const val = (v) => (v ? esc(v) : dash);
  const rule = stateRuleApplied === 'state'
    ? STATE_RULES[String(state.registrant.state).trim().toUpperCase()]
    : null;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No flags raised.</p>`
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
  if (applicationClass === 'ineligible-requester') {
    guidance = `<p>Under the rule applied, this requester is <strong>not eligible</strong> to obtain a certified copy. Completing the paperwork will not change that. Ask an eligible person to apply, obtain a court order, or (where the state offers one) request an informational copy.</p>`;
  } else if (applicationClass === 'incomplete') {
    guidance = `<p>This request is <strong>incomplete</strong>: resolve the high-priority items below before sending it, or the office is likely to return it.</p>`;
  } else {
    guidance = `<p>This request looks <strong>ready to submit</strong> against the rule applied. The issuing office makes the final decision, so confirm current fees and accepted ID with it first.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Birth Certificate Application - Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${applicationClassClass(applicationClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(applicationClassLabel(applicationClass))}</span>
        </div>
      </div>

      <p><strong>Issuing office:</strong> ${rule ? esc(rule.agency) : 'The state or territory vital records office (see CDC/NCHS Where to Write for Vital Records)'}</p>
      <p><strong>Expected fee:</strong> ${esc(feeText(expectedFeeUsd))}${stateRuleApplied === 'default' ? ' <span class="muted">(no verified state fee)</span>' : ''}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Request summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Applicant</th><td>${val(state.applicant.applicantName)}</td></tr>
          <tr><th scope="row">Person named</th><td>${val(state.registrant.registrantName)}</td></tr>
          <tr><th scope="row">Born</th><td>${val([state.registrant.placeOfBirth, state.registrant.state].filter(Boolean).join(', '))}</td></tr>
          <tr><th scope="row">Relationship</th><td>${val(relationshipLabel(state.purpose.relationship))}</td></tr>
          <tr><th scope="row">Purpose</th><td>${val(purposeLabel(state.purpose.purpose))}</td></tr>
          <tr><th scope="row">Copy type</th><td>${val(certificateTypeLabel(state.order.certificateType))}</td></tr>
          <tr><th scope="row">Copies</th><td>${state.order.copies === null ? dash : esc(state.order.copies)}</td></tr>
          <tr><th scope="row">Delivery</th><td>${val(deliveryMethodLabel(state.order.deliveryMethod))}</td></tr>
          <tr><th scope="row">Photo ID</th><td>${val(idTypeLabel(state.evidence.idType))}${state.evidence.idUnexpired ? ` (unexpired: ${esc(yesNoLabel(state.evidence.idUnexpired))})` : ''}</td></tr>
          <tr><th scope="row">Apostille needed</th><td>${val(yesNoLabel(state.purpose.needsApostille))}${state.purpose.apostilleCountry ? ': ' + esc(state.purpose.apostilleCountry) : ''}</td></tr>
        </tbody>
      </table>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">This tool supports documentation only; it is not legal advice. The issuing vital records office decides whether to issue a certified copy.</p>

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
    expectedFeeUsd: result.expectedFeeUsd,
    stateRuleApplied: result.stateRuleApplied,
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
  { step: 1, section: 'applicant',   title: 'Applicant' },
  { step: 2, section: 'registrant',  title: 'Person named' },
  { step: 3, section: 'purpose',     title: 'Relationship and purpose' },
  { step: 4, section: 'order',       title: 'Order' },
  { step: 5, section: 'evidence',    title: 'ID and documents' },
  { step: 6, section: 'declaration', title: 'Declaration' },
  { step: 7, section: 'summary',     title: 'Summary' }
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
