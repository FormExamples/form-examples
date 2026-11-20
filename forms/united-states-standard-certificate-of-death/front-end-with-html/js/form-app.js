import { detectFlaggedIssues } from './flags.js';
import { validateCertificate } from './grader.js';
import { STATE_RULES, stateRule } from './rules.js';
import { OPTIONS, emptyCertificate, optionLabel, priorityLabel, validityClassClass, validityClassLabel } from './types.js';

// US Standard Certificate of Death (NCHS 2003 revision) - wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The funeral director and the medical certifier scroll through
// the eleven certificate sections; a sticky top-of-page progress summary
// reflects how many fields have been answered, and a live readout shows the
// running validity class (valid / incomplete / refer to medical examiner or
// coroner), the derived underlying cause, and whether a referral is indicated.
// Submission runs the pure engine (validity classification plus flagged issues)
// and renders an inline report. State is persisted to localStorage so a partial
// fill survives a page reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice and NOT a
// substitute for the certifier's or the registering state agency's judgement.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-standard-certificate-of-death.front-end-with-html.v1';

/** @returns {import('./types.js').DeathCertificate} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyCertificate();

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
    if (!raw) return emptyCertificate();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved certificate; starting fresh.', e);
    return emptyCertificate();
  }
}

/** @param {import('./types.js').DeathCertificate} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save certificate to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored certificate.', e);
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

/** @type {import('./types.js').DeathCertificate} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-standard-certificate-of-death',
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

const TOTAL_STEPS = 11;

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
// Option lists (shared with types.js)
// ----------------------------------------------------------------------

const yesNo = OPTIONS.yesNo;

const stateOptions = Object.keys(STATE_RULES)
  .map((code) => ({ value: code, label: `${STATE_RULES[code].name} (${code})` }))
  .concat([
    { value: 'AK', label: 'Alaska (AK; default rule)' },
    { value: 'AZ', label: 'Arizona (AZ; default rule)' },
    { value: 'CO', label: 'Colorado (CO; default rule)' },
    { value: 'GA', label: 'Georgia (GA; default rule)' },
    { value: 'MA', label: 'Massachusetts (MA; default rule)' },
    { value: 'MI', label: 'Michigan (MI; default rule)' },
    { value: 'NC', label: 'North Carolina (NC; default rule)' },
    { value: 'NJ', label: 'New Jersey (NJ; default rule)' },
    { value: 'VA', label: 'Virginia (VA; default rule)' },
    { value: 'OTHER', label: 'Another state or territory (default rule)' }
  ]);

// ----------------------------------------------------------------------
// Section renderers (1 per certificate step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'State and decedent',
    description: 'The registering state, which sets the filing deadline and certified-copy fee, and who the certificate is about (funeral director items 1 to 14).'
  });
  card.appendChild(selectInput({
    label: 'State of registration', section: 'jurisdiction', field: 'state', options: stateOptions, required: true,
    hint: 'The state whose vital-records office registers the death. States outside the table use the uniform default rule and raise a "verify state rule" flag.'
  }));
  card.appendChild(textInput({
    label: 'Decedent: legal name', section: 'decedent', field: 'decedentName', required: true,
    placeholder: 'First, middle, last'
  }));
  card.appendChild(selectInput({ label: 'Sex', section: 'decedent', field: 'sex', options: OPTIONS.sex }));
  card.appendChild(textInput({ label: 'Date of birth', section: 'decedent', field: 'dateOfBirth', type: 'date' }));
  card.appendChild(textInput({
    label: 'Age at death (years)', section: 'decedent', field: 'ageYears', type: 'number', min: 0, max: 130,
    hint: 'Enter 0 for an infant under one year.'
  }));
  card.appendChild(selectInput({ label: 'Marital status at time of death', section: 'decedent', field: 'maritalStatus', options: OPTIONS.maritalStatus }));
  card.appendChild(radioGroup({ label: 'Ever in the US Armed Forces?', section: 'decedent', field: 'veteranStatus', options: yesNo }));
  card.appendChild(textInput({
    label: 'State of residence (two letters)', section: 'decedent', field: 'stateOfResidence', placeholder: 'e.g. CA'
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Death details',
    description: 'When and where the death occurred (items 20 to 30).'
  });
  card.appendChild(textInput({ label: 'Date of death', section: 'death', field: 'dateOfDeath', type: 'date' }));
  card.appendChild(textInput({ label: 'Time of death', section: 'death', field: 'timeOfDeath', type: 'time' }));
  card.appendChild(selectInput({ label: 'Place of death', section: 'death', field: 'placeOfDeathType', options: OPTIONS.placeOfDeathType }));
  card.appendChild(textInput({
    label: 'Facility name or address where death occurred', section: 'death', field: 'placeOfDeathFacility',
    placeholder: 'Hospital, residence address, or where the body was found'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Certifier',
    description: 'The person who completes the cause-of-death section: attending or pronouncing physician, medical examiner, or coroner.'
  });
  card.appendChild(textInput({ label: 'Certifier: name', section: 'certifier', field: 'certifierName', required: true }));
  card.appendChild(selectInput({
    label: 'Certifier type', section: 'certifier', field: 'certifierType', options: OPTIONS.certifierType,
    hint: 'A medical examiner or coroner who certifies the death takes the case; no further referral is needed.'
  }));
  card.appendChild(textInput({ label: 'State license number', section: 'certifier', field: 'certifierLicenseNumber', placeholder: 'e.g. A123456' }));
  card.appendChild(textInput({ label: 'Date certified', section: 'certifier', field: 'certificationDate', type: 'date' }));
  card.appendChild(radioGroup({
    label: 'Attended the decedent during the last illness?', section: 'certifier', field: 'attendedDeceased', options: yesNo,
    hint: 'Many states require a death not attended by a physician to be reported to the medical examiner or coroner.'
  }));
  card.appendChild(textInput({ label: 'Date last seen alive by the certifier', section: 'certifier', field: 'lastSeenAliveDate', type: 'date' }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Part I: cause of death chain',
    description: 'Enter the chain of events leading directly to death: the immediate cause on line (a), each line "due to" the line below it, with the underlying cause on the lowest line used. Add an approximate interval between onset and death on each line.'
  });
  const lines = [
    ['a', 'Ia', 'e.g. Aspiration pneumonia', 'e.g. 3 days'],
    ['b', 'Ib', 'e.g. Ischemic stroke of the left middle cerebral artery', 'e.g. 2 weeks'],
    ['c', 'Ic', 'e.g. Atrial fibrillation', 'e.g. 6 years'],
    ['d', 'Id', 'e.g. Rheumatic mitral valve stenosis', 'e.g. 30 years']
  ];
  for (const [letter, key, condPlaceholder, intPlaceholder] of lines) {
    card.appendChild(textInput({
      label: `Line (${letter}): ${letter === 'a' ? 'immediate cause (final disease or condition resulting in death)' : letter === 'b' ? 'due to, or as a consequence of' : letter === 'c' ? 'due to, or as a consequence of' : 'due to, or as a consequence of (underlying cause)'}`,
      section: 'partI', field: `cause${key}Condition`, placeholder: condPlaceholder,
      hint: letter === 'a'
        ? 'State a disease or injury, not a mechanism of dying (never "cardiac arrest" or "respiratory arrest" alone). Write every term in full; no abbreviations except HIV and AIDS.'
        : letter === 'd'
          ? 'Name the cancer site and cell type, the organism, and Type 1 or Type 2 diabetes. For an injury, state the injury, then how it occurred.'
          : undefined
    }));
    card.appendChild(textInput({
      label: `Line (${letter}): approximate interval between onset and death`, section: 'partI',
      field: `cause${key}Interval`, placeholder: intPlaceholder
    }));
  }
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Part II and autopsy',
    description: 'Other significant conditions that contributed to death but did not result in the underlying cause given in Part I, and whether an autopsy was done.'
  });
  card.appendChild(textArea({
    label: 'Part II: other significant conditions contributing to death', section: 'partII', field: 'partIiConditions',
    placeholder: 'e.g. Type 2 diabetes mellitus; chronic kidney disease stage 3'
  }));
  card.appendChild(radioGroup({ label: 'Was an autopsy performed?', section: 'partII', field: 'autopsyPerformed', options: yesNo }));
  card.appendChild(radioGroup({
    label: 'Were autopsy findings available to complete the cause of death?', section: 'partII',
    field: 'autopsyFindingsAvailable', options: yesNo
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Manner of death, tobacco and pregnancy',
    description: 'Manner of death (item 41), tobacco use (item 37), and pregnancy status (item 36).'
  });
  card.appendChild(selectInput({
    label: 'Manner of death', section: 'manner', field: 'mannerOfDeath', options: OPTIONS.manner,
    hint: 'Anything other than natural is a medical examiner or coroner case. Use "pending investigation" if the manner is not yet known.'
  }));
  card.appendChild(selectInput({
    label: 'Did tobacco use contribute to death?', section: 'manner', field: 'tobaccoUseContributed', options: OPTIONS.tobacco
  }));
  card.appendChild(selectInput({
    label: 'Pregnancy status', section: 'manner', field: 'pregnancyStatus', options: OPTIONS.pregnancy,
    hint: 'Required for a female decedent aged 10 to 54.'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Injury items',
    description: 'Complete when the manner of death is accident, suicide or homicide, or when an injury contributed (items 43 to 49).'
  });
  card.appendChild(textInput({ label: 'Date of injury', section: 'injury', field: 'injuryDate', type: 'date' }));
  card.appendChild(textInput({ label: 'Time of injury', section: 'injury', field: 'injuryTime', type: 'time' }));
  card.appendChild(textInput({ label: 'Place of injury', section: 'injury', field: 'injuryPlace', placeholder: 'e.g. Decedent’s home, construction site, restaurant' }));
  card.appendChild(radioGroup({ label: 'Injury at work?', section: 'injury', field: 'injuryAtWork', options: yesNo }));
  card.appendChild(textInput({ label: 'Location of injury', section: 'injury', field: 'injuryLocation', placeholder: 'State, city, street and number, zip code' }));
  card.appendChild(textArea({
    label: 'Describe how the injury occurred', section: 'injury', field: 'injuryDescription',
    hint: 'Specific enough to code the external cause, for example "Fell from a ladder while painting a ceiling".'
  }));
  card.appendChild(selectInput({
    label: 'If a transportation injury, the decedent was the', section: 'injury', field: 'transportationInjuryRole',
    options: OPTIONS.transportationRole
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Medical examiner or coroner referral',
    description: 'Whether the death has been referred to the medical examiner or coroner and why. Any listed circumstance makes the certificate a referral case.'
  });
  card.appendChild(radioGroup({
    label: 'Referred to the medical examiner or coroner?', section: 'referral', field: 'referredToMedicalExaminer', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Referral reason', section: 'referral', field: 'referralReason', options: OPTIONS.referralReason,
    hint: 'Any reason other than "none" classifies the certificate as a referral case.'
  }));
  card.appendChild(textArea({
    label: 'Certifier note', section: 'referral', field: 'certifierNote',
    placeholder: 'Free-text note from the certifier or funeral director.'
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Funeral director and disposition',
    description: 'The funeral director or person acting as such, the method and place of disposition, and when the certificate was filed (items 19 to 28).'
  });
  card.appendChild(textInput({ label: 'Funeral director: name', section: 'funeral', field: 'funeralDirectorName', required: true }));
  card.appendChild(textInput({ label: 'Funeral director: state license number', section: 'funeral', field: 'funeralDirectorLicenseNumber' }));
  card.appendChild(selectInput({ label: 'Method of disposition', section: 'funeral', field: 'dispositionMethod', options: OPTIONS.dispositionMethod }));
  card.appendChild(textInput({ label: 'Date of disposition', section: 'funeral', field: 'dispositionDate', type: 'date' }));
  card.appendChild(textInput({ label: 'Place of disposition', section: 'funeral', field: 'dispositionPlace', placeholder: 'Cemetery, crematory, or other place' }));
  card.appendChild(textInput({ label: 'Date filed with the registrar', section: 'funeral', field: 'filedDate', type: 'date' }));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Certified copies',
    description: 'Ordering certified copies from the state vital-records office. Most states limit who may obtain them.'
  });
  card.appendChild(textInput({ label: 'Number of certified copies', section: 'copies', field: 'certifiedCopiesRequested', type: 'number', min: 0, max: 100 }));
  card.appendChild(selectInput({ label: 'Requester’s relationship to the decedent', section: 'copies', field: 'requesterRelationship', options: OPTIONS.requesterRelationship }));
  card.appendChild(radioGroup({ label: 'Requester’s identity and eligibility verified?', section: 'copies', field: 'requesterIdentityVerified', options: yesNo }));
  card.appendChild(textInput({ label: 'Total fee paid (US dollars)', section: 'copies', field: 'feePaidInUsd', type: 'number', min: 0, hint: 'Checked against the state fee table.' }));
  return card;
}

function renderStep11() {
  const card = sectionCard({
    stepNumber: 11,
    title: 'Summary and validity',
    description: 'The live validity class, the derived underlying cause, and the referral indication. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live validity status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** Render the live status: validity badge, underlying cause, referral note. */
function renderLiveStatus() {
  const result = validateCertificate(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const underlying = result.underlyingCause
    ? `<strong>Underlying cause:</strong> ${esc(result.underlyingCause)}`
    : `<span class="muted">Underlying cause not yet determinable (Part I empty)</span>`;
  const referral = result.referralIndicated
    ? `<span class="muted">- medical examiner or coroner referral indicated</span>`
    : `<span class="muted">- no referral criterion met</span>`;
  return `${badge} ${underlying} ${referral}`;
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
  jurisdiction: [['state']],
  decedent: [['decedentName'], ['sex'], ['dateOfBirth', 'ageYears']],
  death: [['dateOfDeath'], ['placeOfDeathType']],
  certifier: [['certifierName'], ['certifierType'], ['certifierLicenseNumber'], ['certificationDate']],
  partI: [['causeIaCondition'], ['causeIaInterval']],
  partII: [['partIiConditions', 'autopsyPerformed']],
  manner: [['mannerOfDeath'], ['tobaccoUseContributed'], ['pregnancyStatus']],
  injury: [['injuryDate', 'injuryDescription']],
  referral: [['referredToMedicalExaminer'], ['referralReason']],
  funeral: [['funeralDirectorName'], ['dispositionMethod']],
  copies: [['certifiedCopiesRequested']]
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
    validityClass, underlyingCause, referralIndicated,
    flaggedIssues, timestamp
  } = lastResult;

  const dash = '<span class="muted">—</span>';
  const cell = (v) => (v ? esc(v) : dash);

  const partIRows = [
    { line: '(a)', condition: state.partI.causeIaCondition, interval: state.partI.causeIaInterval },
    { line: '(b)', condition: state.partI.causeIbCondition, interval: state.partI.causeIbInterval },
    { line: '(c)', condition: state.partI.causeIcCondition, interval: state.partI.causeIcInterval },
    { line: '(d)', condition: state.partI.causeIdCondition, interval: state.partI.causeIdInterval }
  ].map((r) => `
    <tr>
      <th scope="row">Part I ${esc(r.line)}</th>
      <td>${cell(r.condition)}</td>
      <td>${cell(r.interval)}</td>
    </tr>
  `).join('');

  const partIiRow = `
    <tr>
      <th scope="row">Part II</th>
      <td>${cell(state.partII.partIiConditions)}</td>
      <td>${dash}</td>
    </tr>
  `;

  const rule = stateRule(state);
  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No flags raised.</p>`
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
  if (validityClass === 'refer-to-medical-examiner-or-coroner') {
    guidance = `<p>A medical examiner or coroner referral criterion is met, so this certificate is classified <strong>refer to medical examiner or coroner</strong>. The certifying physician should not complete the cause and manner of death until that office has accepted or declined the case. This is a documentation finding; the law of the state decides who certifies.</p>`;
  } else if (validityClass === 'incomplete') {
    guidance = `<p>This certificate is <strong>incomplete</strong>: a required item is blank or the only cause given is a mechanism of death. Complete the items flagged below before the certificate is filed with the registrar.</p>`;
  } else {
    guidance = `<p>This certificate is <strong>valid</strong>: the required items are present, Part I line (a) states a disease or injury, no mechanism stands alone, and no referral criterion is met. This is a completeness-and-consistency finding only; the registering state agency decides whether to accept the certificate.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>US Standard Certificate of Death — Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Validity class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        ${referralIndicated ? '<span class="risk-badge risk-high">Referral indicated</span>' : ''}
      </div>

      <p><strong>Underlying cause of death:</strong> ${underlyingCause ? esc(underlyingCause) : '<span class="muted">Not determinable (Part I empty)</span>'}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Cause-of-death chain</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Line</th>
            <th scope="col">Condition</th>
            <th scope="col">Interval</th>
          </tr>
        </thead>
        <tbody>${partIRows}${partIiRow}</tbody>
      </table>

      <h3>Other certifier items</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Manner of death</th><td>${cell(optionLabel('manner', state.manner.mannerOfDeath))}</td></tr>
          <tr><th scope="row">Tobacco use contributed</th><td>${cell(optionLabel('tobacco', state.manner.tobaccoUseContributed))}</td></tr>
          <tr><th scope="row">Pregnancy</th><td>${cell(optionLabel('pregnancy', state.manner.pregnancyStatus))}</td></tr>
          <tr><th scope="row">Autopsy performed</th><td>${cell(optionLabel('yesNo', state.partII.autopsyPerformed))}</td></tr>
          <tr><th scope="row">Referral reason</th><td>${cell(optionLabel('referralReason', state.referral.referralReason))}</td></tr>
        </tbody>
      </table>

      <h3>State rule: ${esc(rule.name)}</h3>
      <p>${rule.fileDays !== null ? `File within ${rule.fileDays} ${rule.business ? 'business ' : ''}days of death. ` : ''}${rule.certifyDays !== null ? `Certify the cause within ${rule.certifyDays} ${rule.business ? 'business ' : ''}days. ` : ''}${rule.copyFee !== null ? `First certified copy $${rule.copyFee.toFixed(2)}${rule.additionalCopyFee !== null ? `, $${rule.additionalCopyFee.toFixed(2)} each additional` : ''}. ` : 'No fee on file for this state. '}Confirm current values with the state vital-records office.</p>

      <h3>Next steps</h3>
      <p>The funeral director files the completed certificate with the local or state registrar, usually through the electronic death registration system, before final disposition. Certified copies are issued after registration. This tool supports documentation; it is not legal advice, and the registering agency decides.</p>

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
  const result = validateCertificate(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    validityClass: result.validityClass,
    underlyingCause: result.underlyingCause,
    referralIndicated: result.referralIndicated,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh certificate?')) return;
  clearState();
  state = emptyCertificate();
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
  { step: 1,  section: ['jurisdiction', 'decedent'], title: 'State and decedent' },
  { step: 2,  section: 'death',        title: 'Death details' },
  { step: 3,  section: 'certifier',    title: 'Certifier' },
  { step: 4,  section: 'partI',        title: 'Part I' },
  { step: 5,  section: 'partII',       title: 'Part II' },
  { step: 6,  section: 'manner',       title: 'Manner' },
  { step: 7,  section: 'injury',       title: 'Injury' },
  { step: 8,  section: 'referral',     title: 'Referral' },
  { step: 9,  section: 'funeral',      title: 'Disposition' },
  { step: 10, section: 'copies',       title: 'Copies' },
  { step: 11, section: 'summary',      title: 'Summary' }
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
    const keys = Array.isArray(def.section) ? def.section : [def.section];
    const a = keys.reduce((n, k) => n + (sectionAnswered[k] || 0), 0);
    const t = keys.reduce((n, k) => n + (sectionTotal[k] || 0), 0);
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
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
  host.appendChild(renderStep11());
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
