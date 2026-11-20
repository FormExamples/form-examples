import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { addressDocumentTypeLabel, applicationTypeLabel, emptyApplication, feePaymentMethodLabel, fuelTypeLabel, identityDocumentTypeLabel, insuranceStatusLabel, keeperTypeLabel, motStatusLabel, novaStatusLabel, poundsLabel, priorityLabel, typeApprovalLabel, v5cStatusLabel, validityClassClass, validityClassLabel, vehicleCategoryLabel, yesNoLabel } from './types.js';

// United Kingdom Vehicle Registration Application (DVLA V62, V55/4, V55/5,
// imports, V627/1) - wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the seven application
// sections; a sticky top-of-page progress summary reflects how many fields have
// been answered, and a live readout shows the running validity class
// (ready-to-submit / incomplete / needs-supporting-documents), the fee due, and
// the count of missing items. Submission runs the pure engine (validity
// classification plus flagged issues) and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// This is a COMPLETENESS AND VALIDITY check, NOT a decision on the
// application. Only the DVLA decides whether a vehicle is registered.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-vehicle-registration-application.front-end-with-html.v1';

/** @returns {import('./types.js').VehicleApplication} */
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

/** @param {import('./types.js').VehicleApplication} state */
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

/** @type {import('./types.js').VehicleApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-vehicle-registration-application',
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

const applicationTypeOptions = [
  'v62-replacement-v5c', 'v62-acquired-without-v5c', 'v55-4-new-vehicle',
  'v55-5-used-vehicle', 'imported-vehicle', 'v627-1-rebuilt-or-kit'
].map((value) => ({ value, label: applicationTypeLabel(value) }));

const v5cStatusOptions = ['lost', 'stolen', 'destroyed', 'not-received', 'damaged']
  .map((value) => ({ value, label: v5cStatusLabel(value) }));

const keeperTypeOptions = ['individual', 'company', 'organization', 'trade', 'other']
  .map((value) => ({ value, label: keeperTypeLabel(value) }));

const identityDocumentOptions = ['photocard-driving-licence', 'passport', 'other-name-document', 'none']
  .map((value) => ({ value, label: identityDocumentTypeLabel(value) }));

const addressDocumentOptions = ['photocard-driving-licence', 'utility-bill', 'bank-statement', 'council-tax-bill', 'none']
  .map((value) => ({ value, label: addressDocumentTypeLabel(value) }));

const vehicleCategoryOptions = ['car', 'motorcycle', 'light-goods', 'heavy-goods', 'bus', 'other']
  .map((value) => ({ value, label: vehicleCategoryLabel(value) }));

const fuelTypeOptions = ['petrol', 'diesel', 'electric', 'hybrid', 'lpg', 'other']
  .map((value) => ({ value, label: fuelTypeLabel(value) }));

const typeApprovalOptions = ['ecwvta', 'gb-type-approval', 'ni-type-approval', 'iva', 'msva', 'exempt-over-10-years', 'none']
  .map((value) => ({ value, label: typeApprovalLabel(value) }));

const motOptions = ['valid', 'not-required', 'missing']
  .map((value) => ({ value, label: motStatusLabel(value) }));

const insuranceOptions = ['in-force', 'none']
  .map((value) => ({ value, label: insuranceStatusLabel(value) }));

const novaOptions = ['notified', 'not-notified', 'not-applicable']
  .map((value) => ({ value, label: novaStatusLabel(value) }));

const feePaymentOptions = ['cheque', 'postal-order', 'post-office-card', 'online-card', 'none']
  .map((value) => ({ value, label: feePaymentMethodLabel(value) }));

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Which application',
    description: 'Choose the DVLA form that fits: V62 for a replacement V5C, or V55/4, V55/5, an import, or V627/1 for a first registration.'
  });
  card.appendChild(selectInput({
    label: 'Application type', section: 'application', field: 'applicationType',
    required: true, options: applicationTypeOptions,
    hint: 'V55/4 is for new vehicles and V55/5 for used vehicles, including imports. V627/1 is for rebuilt or kit vehicles.'
  }));
  card.appendChild(textInput({
    label: 'Application date', section: 'application', field: 'applicationDate', type: 'date'
  }));
  const v62 = document.createElement('div');
  v62.setAttribute('data-conditional', 'application.applicationType=v62-replacement-v5c');
  v62.appendChild(selectInput({
    label: 'Why do you need a replacement V5C?', section: 'application', field: 'v5cStatus',
    options: v5cStatusOptions
  }));
  v62.appendChild(textInput({
    label: 'Weeks since the change of keeper', section: 'application', field: 'weeksSinceChangeOfKeeper',
    type: 'number', min: 0, max: 520,
    hint: 'If the V5C has not arrived, contact the DVLA within 6 weeks to avoid the 25 pound fee.'
  }));
  card.appendChild(v62);
  const slip = document.createElement('div');
  slip.setAttribute('data-conditional', 'application.applicationType=v62-acquired-without-v5c');
  slip.appendChild(radioGroup({
    label: 'Is the green new-keeper slip from the most recent V5C enclosed?', section: 'application',
    field: 'newKeeperSlipProvided', options: yesNo,
    hint: 'With the slip there is no fee; without it the V62 costs 25 pounds.'
  }));
  card.appendChild(slip);
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Applicant',
    description: 'The person making the application, and the documents that prove who they are and where they live.'
  });
  card.appendChild(textInput({
    label: 'Applicant full name', section: 'applicant', field: 'name', required: true,
    placeholder: 'As shown on the identity document'
  }));
  card.appendChild(textInput({
    label: 'Date of birth', section: 'applicant', field: 'birthDate', type: 'date'
  }));
  card.appendChild(textArea({
    label: 'Address', section: 'applicant', field: 'postalAddressAsFullText', rows: 3
  }));
  card.appendChild(textInput({
    label: 'Postcode', section: 'applicant', field: 'postcode', placeholder: 'e.g. SW1A 2AA'
  }));
  card.appendChild(textInput({
    label: 'Email', section: 'applicant', field: 'email', type: 'email'
  }));
  card.appendChild(textInput({
    label: 'Phone', section: 'applicant', field: 'phone', type: 'tel'
  }));
  card.appendChild(textInput({
    label: 'Driving licence number', section: 'applicant', field: 'drivingLicenceNumber',
    hint: 'The 16-character number on a Great Britain photocard licence, if you have one.'
  }));
  card.appendChild(selectInput({
    label: 'Proof of identity enclosed', section: 'applicant', field: 'identityDocumentType',
    options: identityDocumentOptions,
    hint: 'A photocopy of a photocard driving licence, or a copy of one document proving your name plus one proving your address.'
  }));
  card.appendChild(selectInput({
    label: 'Proof of address enclosed', section: 'applicant', field: 'addressDocumentType',
    options: addressDocumentOptions
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Registered keeper and owner',
    description: 'The keeper is the person or organization responsible for the vehicle; the owner may be someone else.'
  });
  card.appendChild(textInput({
    label: 'Registered keeper name', section: 'keeper', field: 'keeperName'
  }));
  card.appendChild(selectInput({
    label: 'Keeper type', section: 'keeper', field: 'keeperType', options: keeperTypeOptions
  }));
  const company = document.createElement('div');
  company.setAttribute('data-conditional', 'keeper.keeperType=company');
  company.appendChild(textInput({
    label: 'Companies House registration number', section: 'keeper', field: 'companyRegistrationNumber',
    placeholder: 'e.g. 01234567'
  }));
  card.appendChild(company);
  card.appendChild(radioGroup({
    label: 'Is the owner different from the keeper?', section: 'keeper', field: 'ownerDiffersFromKeeper',
    options: yesNo
  }));
  const owner = document.createElement('div');
  owner.setAttribute('data-conditional', 'keeper.ownerDiffersFromKeeper=yes');
  owner.appendChild(textInput({
    label: 'Owner name', section: 'keeper', field: 'ownerName'
  }));
  card.appendChild(owner);
  card.appendChild(radioGroup({
    label: 'Is the keeper address in Northern Ireland?', section: 'keeper',
    field: 'keeperAddressInNorthernIreland', options: yesNo,
    hint: 'A Northern Ireland address needs an insurance certificate, and the MOT threshold is 4 years.'
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Vehicle',
    description: 'Identify the vehicle. A first registration is given its number by the DVLA, so the registration number may be left blank.'
  });
  card.appendChild(textInput({
    label: 'Registration number', section: 'vehicle', field: 'registrationNumber',
    placeholder: 'e.g. AB12 CDE',
    hint: 'Required for a V62. Leave blank for a first registration.'
  }));
  card.appendChild(textInput({
    label: 'Vehicle identification number (VIN)', section: 'vehicle', field: 'vehicleIdentificationNumber',
    placeholder: '17 characters, e.g. WVWZZZ1JZXW000001',
    hint: 'Also called the chassis number. From 1981 it has 17 characters, with no I, O, or Q.'
  }));
  card.appendChild(textInput({
    label: 'Engine number', section: 'vehicle', field: 'engineNumber'
  }));
  card.appendChild(textInput({
    label: 'Make', section: 'vehicle', field: 'make'
  }));
  card.appendChild(textInput({
    label: 'Model', section: 'vehicle', field: 'model'
  }));
  card.appendChild(textInput({
    label: 'Colour', section: 'vehicle', field: 'colour'
  }));
  card.appendChild(selectInput({
    label: 'Vehicle category', section: 'vehicle', field: 'vehicleCategory', options: vehicleCategoryOptions
  }));
  card.appendChild(selectInput({
    label: 'Fuel type', section: 'vehicle', field: 'fuelType', options: fuelTypeOptions
  }));
  card.appendChild(textInput({
    label: 'Engine capacity (cc)', section: 'vehicle', field: 'engineCapacityAsCc',
    type: 'number', min: 0, max: 20000
  }));
  card.appendChild(textInput({
    label: 'Date of manufacture', section: 'vehicle', field: 'dateOfManufacture', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Date first used', section: 'vehicle', field: 'dateFirstUsed', type: 'date'
  }));
  card.appendChild(radioGroup({
    label: 'Is the vehicle seriously damaged, so that it cannot be repaired?', section: 'vehicle',
    field: 'seriouslyDamaged', options: yesNo,
    hint: 'A vehicle that cannot be repaired cannot be registered.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Supporting evidence',
    description: 'The documents sent with a first registration: newness, approval, MOT, insurance, and build evidence.'
  });
  card.appendChild(radioGroup({
    label: 'Certificate of newness enclosed?', section: 'evidence', field: 'certificateOfNewnessProvided',
    options: yesNo, hint: 'For a new vehicle. An import sends a declaration of newness.'
  }));
  card.appendChild(selectInput({
    label: 'Vehicle approval evidence', section: 'evidence', field: 'typeApproval',
    options: typeApprovalOptions,
    hint: 'Needed for a vehicle under 10 years old, unless exempt.'
  }));
  card.appendChild(selectInput({
    label: 'MOT certificate', section: 'evidence', field: 'motStatus', options: motOptions,
    hint: 'Needed for a used vehicle over 3 years old (over 4 in Northern Ireland).'
  }));
  card.appendChild(selectInput({
    label: 'Insurance', section: 'evidence', field: 'insuranceStatus', options: insuranceOptions,
    hint: 'Insurance evidence is sent when registering to a Northern Ireland address; every vehicle must be insured before it is driven.'
  }));
  card.appendChild(radioGroup({
    label: 'Build evidence enclosed (rebuilt or kit vehicle)?', section: 'evidence',
    field: 'buildEvidenceProvided', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Number of donor vehicles', section: 'evidence', field: 'donorVehicleCount',
    type: 'number', min: 0, max: 50
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Imported vehicle',
    description: 'Complete this step only for an imported vehicle. HMRC must be notified of the arrival (NOVA) within 14 days.'
  });
  card.appendChild(textInput({
    label: 'Country of export', section: 'importDetails', field: 'countryOfExport'
  }));
  card.appendChild(textInput({
    label: 'Date the vehicle arrived in Great Britain', section: 'importDetails', field: 'importDate', type: 'date'
  }));
  card.appendChild(selectInput({
    label: 'HMRC NOVA status', section: 'importDetails', field: 'novaStatus', options: novaOptions
  }));
  card.appendChild(textInput({
    label: 'NOVA reference', section: 'importDetails', field: 'novaReference'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Fee and declaration',
    description: 'The fee is 25 pounds for a V62 (waived with a new-keeper slip) and 55 pounds for a first registration. Send a cheque or postal order payable to DVLA, Swansea; never cash.'
  });
  card.appendChild(selectInput({
    label: 'Payment method', section: 'feeAndDeclaration', field: 'feePaymentMethod', options: feePaymentOptions
  }));
  card.appendChild(textInput({
    label: 'Amount paid (pence)', section: 'feeAndDeclaration', field: 'feePaidAsPence',
    type: 'number', min: 0, max: 100000, hint: 'For example 2500 for 25 pounds.'
  }));
  card.appendChild(radioGroup({
    label: 'Declaration signed?', section: 'feeAndDeclaration', field: 'declarationSigned',
    options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Declaration date', section: 'feeAndDeclaration', field: 'declarationDate', type: 'date'
  }));
  card.appendChild(textArea({
    label: 'Note', section: 'feeAndDeclaration', field: 'applicantNote',
    placeholder: 'Anything else the DVLA should know.'
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Summary and validity',
    description: 'The live validity class, the fee due, and the number of missing items. Submit to generate the full report.'
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

/** Render the live status: validity badge, fee due, missing-item count. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const fee = result.feeDueAsPence === null
    ? '<span class="muted">Fee not yet determinable (choose an application type)</span>'
    : `<strong>Fee due:</strong> ${esc(poundsLabel(result.feeDueAsPence))}`;
  const missing = `<span class="muted">- ${result.missingItemCount} missing item${result.missingItemCount === 1 ? '' : 's'}</span>`;
  return `${badge} ${fee} ${missing}`;
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
  application: [['applicationType'], ['applicationDate'], ['v5cStatus']],
  applicant: [['name'], ['birthDate'], ['postalAddressAsFullText'], ['identityDocumentType']],
  keeper: [['keeperName'], ['keeperType'], ['ownerDiffersFromKeeper']],
  vehicle: [['registrationNumber', 'vehicleIdentificationNumber'], ['make'], ['model'], ['dateOfManufacture', 'dateFirstUsed']],
  evidence: [['typeApproval'], ['motStatus'], ['insuranceStatus']],
  importDetails: [['countryOfExport', 'novaStatus']],
  feeAndDeclaration: [['feePaymentMethod'], ['declarationSigned']]
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
    validityClass, feeDueAsPence, missingItemCount, rules,
    flaggedIssues, timestamp
  } = lastResult;

  const rulesRows = rules.length === 0
    ? '<tr><td colspan="3"><span class="muted">No missing items.</span></td></tr>'
    : rules.map((r) => `
    <tr>
      <th scope="row">${esc(r.ruleId)}</th>
      <td>${esc(r.dimension)}</td>
      <td>${esc(r.description)}</td>
    </tr>
  `).join('');

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No identity, evidence, fee, or format flags raised.</p>`
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
  if (validityClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: required details are missing, a format check failed, the vehicle cannot be registered, or the declaration is not signed. Complete the items listed below before gathering the documents to send.</p>`;
  } else if (validityClass === 'needs-supporting-documents') {
    guidance = `<p>All details are present, but the application <strong>needs supporting documents or payment</strong>. Enclose the evidence and fee listed below, then post it to the DVLA. The DVLA may inspect the vehicle and decides every application.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to submit</strong>: the details are complete and the documents and fee match what the DVLA asks for. This is a completeness check, not a decision; the DVLA decides every application. Post it with the enclosures; the V5C usually arrives within 4 weeks.</p>`;
  }

  const a = state.application;
  const v = state.vehicle;
  const dash = '<span class="muted">-</span>';
  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United Kingdom Vehicle Registration Application - Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Validity class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        <span class="risk-badge ${validityClassClass(validityClass)}">${missingItemCount} missing</span>
      </div>

      <p><strong>Fee due:</strong> ${feeDueAsPence === null ? dash : esc(poundsLabel(feeDueAsPence))}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Application summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Application</th><td>${a.applicationType ? esc(applicationTypeLabel(a.applicationType)) : dash}</td></tr>
          <tr><th scope="row">Applicant</th><td>${state.applicant.name ? esc(state.applicant.name) : dash}</td></tr>
          <tr><th scope="row">Keeper</th><td>${state.keeper.keeperName ? esc(state.keeper.keeperName) : dash}</td></tr>
          <tr><th scope="row">Vehicle</th><td>${esc([v.make, v.model].filter(Boolean).join(' ')) || dash}</td></tr>
          <tr><th scope="row">Registration number</th><td>${v.registrationNumber ? esc(v.registrationNumber) : dash}</td></tr>
          <tr><th scope="row">VIN</th><td>${v.vehicleIdentificationNumber ? esc(v.vehicleIdentificationNumber) : dash}</td></tr>
          <tr><th scope="row">Identity evidence</th><td>${state.applicant.identityDocumentType ? esc(identityDocumentTypeLabel(state.applicant.identityDocumentType)) : dash}</td></tr>
          <tr><th scope="row">Declaration signed</th><td>${state.feeAndDeclaration.declarationSigned ? esc(yesNoLabel(state.feeAndDeclaration.declarationSigned)) : dash}</td></tr>
        </tbody>
      </table>

      <h3>Findings (${rules.length})</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Dimension</th>
            <th scope="col">Finding</th>
          </tr>
        </thead>
        <tbody>${rulesRows}</tbody>
      </table>

      <h3>Next steps</h3>
      <p>Post the V62 or V55 form, the fee, and your identity documents to the DVLA, Swansea. Do not send cash. If the DVLA approves, it sends a V5C log book and returns your identity documents.</p>

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
    validityClass: result.validityClass,
    feeDueAsPence: result.feeDueAsPence,
    missingItemCount: result.missingItemCount,
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
  { step: 1, section: 'application',       title: 'Application' },
  { step: 2, section: 'applicant',         title: 'Applicant' },
  { step: 3, section: 'keeper',            title: 'Keeper and owner' },
  { step: 4, section: 'vehicle',           title: 'Vehicle' },
  { step: 5, section: 'evidence',          title: 'Evidence' },
  { step: 6, section: 'importDetails',     title: 'Import' },
  { step: 7, section: 'feeAndDeclaration', title: 'Fee and declaration' },
  { step: 8, section: 'summary',           title: 'Summary' }
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
