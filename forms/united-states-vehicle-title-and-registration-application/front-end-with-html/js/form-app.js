import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { outstandingItems, stateRule } from './rules.js';
import { applicationClassClass, applicationClassLabel, emptyApplication, lienStatusLabel, odometerStatusLabel, priorityLabel, titleBrandLabel, vinStatusLabel, yesNoLabel } from './types.js';

// United States vehicle title and registration application — wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the eight application
// sections; a sticky top-of-page progress summary reflects how many fields have
// been answered, and a live readout shows the running application class
// (ready-to-submit / incomplete / title-brand-or-lien-issue), the VIN status,
// and the number of outstanding items. Submission runs the pure engine
// (classification plus flagged issues) and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// This is a COMPLETENESS / VALIDITY / ELIGIBILITY instrument, NOT legal advice
// and NOT a decision to issue a title. The issuing state agency decides.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-vehicle-title-and-registration-application.front-end-with-html.v1';

/** @returns {import('./types.js').TitleApplication} */
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

/** @param {import('./types.js').TitleApplication} state */
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

/** @type {import('./types.js').TitleApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-vehicle-title-and-registration-application',
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

const TOTAL_STEPS = 9;

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
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

const transactionOptions = [
  { value: 'title-and-registration', label: 'Title and registration' },
  { value: 'title-only', label: 'Title only' },
  { value: 'registration-only', label: 'Registration only (renewal or transfer of plates)' }
];

const conditionOptions = [
  { value: 'new', label: 'New (never titled)' },
  { value: 'used', label: 'Used' }
];

const acquisitionOptions = [
  { value: 'dealer-purchase', label: 'Purchased from a dealer' },
  { value: 'private-purchase', label: 'Purchased from a private seller' },
  { value: 'gift', label: 'Gift' },
  { value: 'inheritance', label: 'Inheritance' },
  { value: 'other', label: 'Other' }
];

const ownerTypeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business or organization' }
];

const conjunctionOptions = [
  { value: 'and', label: 'AND (both owners must sign to sell)' },
  { value: 'or', label: 'OR (either owner may sign to sell)' }
];

const identificationOptions = [
  { value: 'drivers-license', label: 'Driver license number' },
  { value: 'state-id', label: 'State identification card number' },
  { value: 'passport', label: 'Passport number' },
  { value: 'fein', label: 'Federal employer identification number (FEIN)' },
  { value: 'other', label: 'Other' }
];

const vehicleClassOptions = [
  { value: 'passenger', label: 'Passenger car' },
  { value: 'light-truck', label: 'Light truck, SUV, or van' },
  { value: 'heavy-truck', label: 'Heavy truck' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'trailer', label: 'Trailer' },
  { value: 'motorhome', label: 'Motorhome' }
];

const fuelOptions = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid or plug-in hybrid' },
  { value: 'other', label: 'Other' }
];

const odometerStatusOptions = [
  { value: 'actual', label: 'Actual mileage' },
  { value: 'exceeds-mechanical-limits', label: 'Exceeds the odometer\'s mechanical limits' },
  { value: 'not-actual', label: 'Not the actual mileage (warning: odometer discrepancy)' }
];

const titleDocumentOptions = [
  { value: 'state-title', label: 'Certificate of title issued by this state' },
  { value: 'out-of-state-title', label: 'Certificate of title issued by another state' },
  { value: 'manufacturer-statement-of-origin', label: 'Manufacturer\'s statement of origin (new vehicle)' },
  { value: 'none', label: 'No title available' }
];

const brandOptions = [
  { value: 'none', label: 'No brand' },
  { value: 'salvage', label: 'Salvage' },
  { value: 'junk', label: 'Junk' },
  { value: 'rebuilt', label: 'Rebuilt or reconstructed' },
  { value: 'flood', label: 'Flood' },
  { value: 'odometer-not-actual', label: 'Odometer: not actual mileage' },
  { value: 'lemon-law-buyback', label: 'Lemon-law buyback' },
  { value: 'hail', label: 'Hail damage' },
  { value: 'other', label: 'Other brand' }
];

const nmvtisOptions = [
  { value: 'clear', label: 'Checked: no brand, total-loss, or theft record' },
  { value: 'brand-or-theft-found', label: 'Checked: a brand, total-loss, or theft record was found' },
  { value: 'not-checked', label: 'Not checked' }
];

const brandInspectionOptions = [
  { value: 'passed', label: 'Passed' },
  { value: 'not-done', label: 'Not done' },
  { value: 'not-applicable', label: 'Not applicable' }
];

const lienOptions = [
  { value: 'none', label: 'No lien' },
  { value: 'new-lien', label: 'New lien on this purchase (financed)' },
  { value: 'existing-lien-released', label: 'Existing lien, released' },
  { value: 'existing-lien-unreleased', label: 'Existing lien, not yet released' }
];

const insuranceOptions = [
  { value: 'provided', label: 'Proof of insurance provided' },
  { value: 'not-provided', label: 'Not provided' }
];

const inspectionOptions = [
  { value: 'passed', label: 'Passed' },
  { value: 'not-done', label: 'Not done' },
  { value: 'exempt', label: 'Exempt' },
  { value: 'not-required', label: 'Not required' }
];

const vinVerificationOptions = [
  { value: 'done', label: 'Done (form attached)' },
  { value: 'not-done', label: 'Not done' },
  { value: 'not-required', label: 'Not required' }
];

const taxStatusOptions = [
  { value: 'paid-to-dealer', label: 'Paid to the dealer' },
  { value: 'due-at-title', label: 'Due when titling' },
  { value: 'exempt', label: 'Exempt' },
  { value: 'not-calculated', label: 'Not calculated yet' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The application',
    description: 'Which state will title the vehicle, what you are applying for, and how and when you acquired it.'
  });
  card.appendChild(selectInput({
    label: 'State that will issue the title', section: 'application', field: 'state',
    options: stateOptions, required: true,
    hint: 'Nine states carry encoded rules; any other state uses the uniform default and a "verify the state rule" flag.'
  }));
  card.appendChild(selectInput({
    label: 'Transaction type', section: 'application', field: 'transactionType', options: transactionOptions
  }));
  card.appendChild(radioGroup({
    label: 'New or used', section: 'application', field: 'vehicleCondition', options: conditionOptions
  }));
  card.appendChild(selectInput({
    label: 'How the vehicle was acquired', section: 'application', field: 'acquisitionMethod', options: acquisitionOptions
  }));
  card.appendChild(textInput({
    label: 'Acquisition date', section: 'application', field: 'acquisitionDate', type: 'date',
    hint: 'The date of sale or gift; most states set a deadline from this date.'
  }));
  card.appendChild(textInput({
    label: 'Application date', section: 'application', field: 'applicationDate', type: 'date'
  }));
  card.appendChild(radioGroup({
    label: 'Was the vehicle last titled in another state?', section: 'application',
    field: 'outOfStateTransfer', options: yesNo,
    hint: 'An out-of-state vehicle needs a VIN verification and the other state\'s title.'
  }));
  card.appendChild(selectInput({
    label: 'State that last titled the vehicle', section: 'application', field: 'previousState',
    options: stateOptions
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Owner identification',
    description: 'Who will be named on the title, how they are identified, and who has signed.'
  });
  card.appendChild(selectInput({
    label: 'Owner type', section: 'owner', field: 'ownerType', options: ownerTypeOptions
  }));
  card.appendChild(textInput({
    label: 'Owner — full legal name', section: 'owner', field: 'ownerName', required: true,
    placeholder: 'As shown on the identification'
  }));
  card.appendChild(textInput({
    label: 'Co-owner — full legal name (if any)', section: 'owner', field: 'coOwnerName'
  }));
  card.appendChild(selectInput({
    label: 'AND or OR between the owners', section: 'owner', field: 'coOwnerConjunction',
    options: conjunctionOptions, hint: 'Required when there is a co-owner; it controls who may sell and survivorship.'
  }));
  card.appendChild(selectInput({
    label: 'Identification type', section: 'owner', field: 'identificationType', options: identificationOptions
  }));
  card.appendChild(textInput({
    label: 'Identification number', section: 'owner', field: 'identificationNumber'
  }));
  card.appendChild(textArea({
    label: 'Mailing address', section: 'owner', field: 'mailingAddress', rows: 2
  }));
  card.appendChild(radioGroup({
    label: 'Owner has signed the application?', section: 'owner', field: 'ownerSigned', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Co-owner has signed the application?', section: 'owner', field: 'coOwnerSigned', options: yesNo
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'The vehicle',
    description: 'The VIN and the description. The VIN is checked for length, permitted characters, and the position-9 check digit.'
  });
  card.appendChild(textInput({
    label: 'Vehicle identification number (VIN)', section: 'vehicle', field: 'vin',
    hint: '17 characters for a model year 1981 or later; the letters I, O, and Q are never used.',
    placeholder: 'e.g. 1HGCM82633A004352'
  }));
  card.appendChild(textInput({
    label: 'Model year', section: 'vehicle', field: 'modelYear', type: 'number', min: 1900, max: 2100
  }));
  card.appendChild(textInput({ label: 'Make', section: 'vehicle', field: 'make', placeholder: 'e.g. Honda' }));
  card.appendChild(textInput({ label: 'Model', section: 'vehicle', field: 'model', placeholder: 'e.g. Accord' }));
  card.appendChild(textInput({ label: 'Body type', section: 'vehicle', field: 'bodyType', placeholder: 'e.g. 4-door sedan' }));
  card.appendChild(selectInput({
    label: 'Vehicle class', section: 'vehicle', field: 'vehicleClass', options: vehicleClassOptions
  }));
  card.appendChild(selectInput({
    label: 'Fuel type', section: 'vehicle', field: 'fuelType', options: fuelOptions
  }));
  card.appendChild(textInput({
    label: 'Gross vehicle weight rating (GVWR), pounds', section: 'vehicle', field: 'gvwrLbs',
    type: 'number', min: 0, max: 200000,
    hint: 'From the door-jamb label. Required for trucks, trailers, and motorhomes.'
  }));
  card.appendChild(textInput({ label: 'Color', section: 'vehicle', field: 'color' }));
  const vinLive = document.createElement('div');
  vinLive.className = 'field readout';
  vinLive.innerHTML = '<label class="label">VIN check</label><div id="vin-readout" class="readout-value"></div>';
  card.appendChild(vinLive);
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Odometer disclosure',
    description: 'The federal written odometer disclosure (49 CFR Part 580). Vehicles over 16,000 pounds GVWR, and older vehicles (10 years for model year 2010 or earlier, 20 years for 2011 or later), are exempt.'
  });
  card.appendChild(textInput({
    label: 'Odometer reading (miles, no tenths)', section: 'odometer', field: 'odometerReading',
    type: 'number', min: 0, max: 9999999
  }));
  card.appendChild(selectInput({
    label: 'Odometer status', section: 'odometer', field: 'odometerStatus', options: odometerStatusOptions
  }));
  card.appendChild(radioGroup({
    label: 'Seller has signed the odometer statement?', section: 'odometer',
    field: 'sellerOdometerStatement', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Buyer has acknowledged the odometer statement?', section: 'odometer',
    field: 'buyerOdometerAcknowledged', options: yesNo
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Title history and brands',
    description: 'The title document you hold, any brand on it (salvage, rebuilt, flood, and so on), and the NMVTIS vehicle-history check.'
  });
  card.appendChild(selectInput({
    label: 'Title document', section: 'titleHistory', field: 'titleDocument', options: titleDocumentOptions
  }));
  card.appendChild(radioGroup({
    label: 'Prior title surrendered with this application?', section: 'titleHistory',
    field: 'priorTitleSurrendered', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Title brand', section: 'titleHistory', field: 'titleBrand', options: brandOptions,
    hint: 'A brand follows the vehicle to every state and must be carried onto the new title.'
  }));
  card.appendChild(radioGroup({
    label: 'Brand disclosed on this application and to the buyer?', section: 'titleHistory',
    field: 'brandDisclosed', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'NMVTIS vehicle-history check', section: 'titleHistory', field: 'nmvtisCheck', options: nmvtisOptions,
    hint: 'The National Motor Vehicle Title Information System; the agency also queries it before issuing a title.'
  }));
  card.appendChild(selectInput({
    label: 'Rebuilt-vehicle inspection', section: 'titleHistory', field: 'brandInspection',
    options: brandInspectionOptions
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Lienholder',
    description: 'Whether anyone holds a security interest in the vehicle, and whether an existing lien has been released.'
  });
  card.appendChild(selectInput({
    label: 'Lien status', section: 'lien', field: 'lienStatus', options: lienOptions
  }));
  card.appendChild(textInput({
    label: 'Lienholder name', section: 'lien', field: 'lienholderName',
    hint: 'Required for a new lien: the bank or finance company exactly as it should print on the title.'
  }));
  card.appendChild(radioGroup({
    label: 'Electronic lien and title?', section: 'lien', field: 'lienElectronic', options: yesNo
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Insurance and inspections',
    description: 'Proof of insurance, emissions and safety inspections, and the VIN verification an out-of-state vehicle needs.'
  });
  card.appendChild(selectInput({
    label: 'Proof of insurance', section: 'compliance', field: 'insuranceProof', options: insuranceOptions
  }));
  card.appendChild(textInput({
    label: 'Insurance expiry date', section: 'compliance', field: 'insuranceExpiryDate', type: 'date'
  }));
  card.appendChild(selectInput({
    label: 'Emissions (smog) inspection', section: 'compliance', field: 'emissionsInspection', options: inspectionOptions
  }));
  card.appendChild(selectInput({
    label: 'Safety inspection', section: 'compliance', field: 'safetyInspection', options: inspectionOptions
  }));
  card.appendChild(selectInput({
    label: 'Out-of-state VIN verification', section: 'compliance', field: 'vinVerification',
    options: vinVerificationOptions
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Fees and tax',
    description: 'The purchase price, the sales or use tax, and the title and registration fees. Fee amounts change every legislative session, so check the agency\'s fee schedule.'
  });
  card.appendChild(textInput({
    label: 'Purchase price (US dollars)', section: 'feesTax', field: 'purchasePriceUsd', type: 'number', min: 0
  }));
  card.appendChild(selectInput({
    label: 'Sales or use tax status', section: 'feesTax', field: 'salesTaxStatus', options: taxStatusOptions
  }));
  card.appendChild(textInput({
    label: 'Tax rate entered (percent)', section: 'feesTax', field: 'salesTaxRatePercent', type: 'number', min: 0, max: 20,
    hint: 'State rate plus the local rate for the buyer\'s address.'
  }));
  card.appendChild(textInput({
    label: 'Tax amount (US dollars)', section: 'feesTax', field: 'salesTaxAmountUsd', type: 'number', min: 0
  }));
  card.appendChild(textInput({
    label: 'Tax exemption reason', section: 'feesTax', field: 'taxExemptionReason',
    placeholder: 'e.g. gift between family members'
  }));
  card.appendChild(textInput({
    label: 'Title fee (US dollars)', section: 'feesTax', field: 'titleFeeUsd', type: 'number', min: 0
  }));
  card.appendChild(textInput({
    label: 'Registration fee (US dollars)', section: 'feesTax', field: 'registrationFeeUsd', type: 'number', min: 0
  }));
  card.appendChild(radioGroup({
    label: 'Fees tendered with the application?', section: 'feesTax', field: 'feesTendered', options: yesNo
  }));
  card.appendChild(textArea({
    label: 'Applicant note', section: 'feesTax', field: 'applicantNote',
    placeholder: 'Anything the clerk should know.'
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Summary and class',
    description: 'The live application class, the VIN check, and the outstanding items. Submit to generate the full report.'
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

/** Render the live status: class badge, outstanding items, state-rule note. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${applicationClassClass(result.applicationClass)}">${esc(applicationClassLabel(result.applicationClass))}</span>`;
  const outstanding = result.outstandingItemCount > 0
    ? `<strong>${result.outstandingItemCount}</strong> outstanding item${result.outstandingItemCount === 1 ? '' : 's'}`
    : '<span class="muted">no outstanding items</span>';
  const rule = state.application.state
    ? (result.stateRuleKnown ? `<span class="muted">— ${esc(stateRule(state.application.state).rule.name)} rules applied</span>` : '<span class="muted">— state rule not encoded; verify</span>')
    : '<span class="muted">— no state selected</span>';
  return `${badge} ${outstanding} ${rule}`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
  const vin = document.getElementById('vin-readout');
  if (vin) {
    const result = validateApplication(state);
    vin.textContent = vinStatusLabel(result.vinStatus);
  }
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
  application: [['state'], ['transactionType'], ['vehicleCondition'], ['acquisitionDate'], ['outOfStateTransfer']],
  owner: [['ownerName'], ['identificationNumber'], ['mailingAddress'], ['ownerSigned']],
  vehicle: [['vin'], ['modelYear'], ['make'], ['model']],
  odometer: [['odometerReading', 'odometerStatus']],
  titleHistory: [['titleDocument'], ['titleBrand'], ['nmvtisCheck']],
  lien: [['lienStatus']],
  compliance: [['insuranceProof'], ['vinVerification', 'emissionsInspection']],
  feesTax: [['salesTaxStatus'], ['feesTendered']]
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

function row(label, value) {
  return `<tr><th scope="row">${esc(label)}</th><td>${value ? esc(value) : '<span class="muted">—</span>'}</td></tr>`;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    applicationClass, vinStatus, odometerDisclosureRequired, brandOrLienIssue,
    outstandingItemCount, stateRuleKnown, estimatedStateTaxUsd, flaggedIssues, timestamp
  } = lastResult;

  const items = outstandingItems(state);
  const itemsList = items.length === 0
    ? '<p class="muted">No outstanding items.</p>'
    : `<ul class="flags">${items.map((i) => `<li class="flag-medium"><span class="flag-message">${esc(i.label)}</span></li>`).join('')}</ul>`;

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No compliance or title-risk flags raised.</p>`
    : `
      <ul class="flags">
        ${flaggedIssues.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.id)}: ${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  let guidance;
  if (applicationClass === 'title-brand-or-lien-issue') {
    guidance = `<p>This application is classified <strong>title brand or lien issue</strong>: a branded title, an NMVTIS brand or theft record, an unreleased lien, or a "not actual mileage" disclosure needs special handling by the agency. Resolve or disclose each flagged item before submitting; the agency decides whether and how to issue the title.</p>`;
  } else if (applicationClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: the outstanding items below are missing or invalid. Complete them before submitting, or the agency will reject or delay the application.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to submit</strong>: every required item is present and consistent with the federal rules and the state rule applied. This is a completeness finding. It does <strong>not</strong> guarantee a title; the issuing agency decides.</p>`;
  }

  const sr = stateRule(state.application.state);
  const stateNote = state.application.state
    ? (stateRuleKnown
      ? `${sr.rule.name} (${sr.rule.agency}) rules applied`
      : `State ${esc(sr.code)} is not encoded: the uniform default rule was applied. Verify the state rule.`)
    : 'No state selected';

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Vehicle Title and Registration Application — Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${applicationClassClass(applicationClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(applicationClassLabel(applicationClass))}</span>
        </div>
        ${brandOrLienIssue ? '<span class="risk-badge risk-high">Brand or lien issue</span>' : ''}
      </div>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Application summary</h3>
      <table class="subscales">
        <tbody>
          ${row('State rule', stateNote)}
          ${row('Owner', state.owner.ownerName + (state.owner.coOwnerName ? ` ${state.owner.coOwnerConjunction ? state.owner.coOwnerConjunction.toUpperCase() : '&'} ${state.owner.coOwnerName}` : ''))}
          ${row('Vehicle', [state.vehicle.modelYear, state.vehicle.make, state.vehicle.model].filter((p) => p !== null && p !== '').join(' '))}
          ${row('VIN', state.vehicle.vin)}
          ${row('VIN check', vinStatusLabel(vinStatus))}
          ${row('Odometer disclosure', odometerDisclosureRequired ? (state.odometer.odometerReading !== null ? `${state.odometer.odometerReading} miles — ${odometerStatusLabel(state.odometer.odometerStatus)}` : 'Required, not recorded') : 'Not required (exempt)')}
          ${row('Title brand', titleBrandLabel(state.titleHistory.titleBrand))}
          ${row('Lien', lienStatusLabel(state.lien.lienStatus))}
          ${row('Out-of-state transfer', yesNoLabel(state.application.outOfStateTransfer))}
          ${row('State-level tax estimate', estimatedStateTaxUsd === null ? '' : `$${estimatedStateTaxUsd.toFixed(2)} (excludes local tax)`)}
        </tbody>
      </table>

      <h3>Outstanding items (${outstandingItemCount})</h3>
      ${itemsList}

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">This tool is documentation support, not legal advice. The issuing state agency decides whether to issue a title and registration.</p>

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
    ...result,
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
  { step: 2, section: 'owner',        title: 'Owner' },
  { step: 3, section: 'vehicle',      title: 'Vehicle' },
  { step: 4, section: 'odometer',     title: 'Odometer' },
  { step: 5, section: 'titleHistory', title: 'Title history' },
  { step: 6, section: 'lien',         title: 'Lien' },
  { step: 7, section: 'compliance',   title: 'Insurance' },
  { step: 8, section: 'feesTax',      title: 'Fees and tax' },
  { step: 9, section: 'summary',      title: 'Summary' }
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
  host.appendChild(renderStep9());
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
