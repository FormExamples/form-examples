import { detectFlaggedIssues } from './flags.js';
import { validateBillOfSale } from './grader.js';
import { odometerExemption, stateRule } from './rules.js';
import { asIsClauseLabel, completenessClassClass, completenessClassLabel, emptyBillOfSale, lienStatusLabel, notarizedLabel, odometerStatusLabel, paymentMethodLabel, priorityLabel, taxBasisLabel, titleBrandLabel } from './types.js';

// United States Vehicle Bill of Sale: wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The seller and buyer scroll through the seven sections; a
// sticky top-of-page progress summary reflects how many fields have been
// answered, and a live readout shows the running completeness class (complete /
// incomplete / risk-flagged), whether the federal odometer disclosure is exempt,
// and the rule row applied for the chosen state. Submission runs the pure engine
// (completeness classification plus flagged issues) and renders an inline
// report. State is persisted to localStorage so a partial fill survives a page
// reload.
//
// This is a DOCUMENTATION-SUPPORT instrument, NOT legal advice. The engine
// checks completeness and consistency against federal law (49 CFR Part 580) and
// a small state-rule table; the issuing state agency decides.


// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-vehicle-bill-of-sale.front-end-with-html.v1';

/** @returns {import('./types.js').BillOfSale} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyBillOfSale();

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
    if (!raw) return emptyBillOfSale();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved bill of sale; starting fresh.', e);
    return emptyBillOfSale();
  }
}

/** @param {import('./types.js').BillOfSale} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save bill of sale to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored bill of sale.', e);
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

/** @type {import('./types.js').BillOfSale} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-vehicle-bill-of-sale',
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

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California', CO: 'Colorado',
  CT: 'Connecticut', DE: 'Delaware', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa', KS: 'Kansas',
  KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland', MA: 'Massachusetts',
  MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri', MT: 'Montana',
  NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma',
  OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota',
  TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming', PR: 'Puerto Rico', GU: 'Guam',
  VI: 'U.S. Virgin Islands', AS: 'American Samoa', MP: 'Northern Mariana Islands'
};

const stateOptions = Object.keys(STATE_NAMES).map((code) => ({ value: code, label: `${code}: ${STATE_NAMES[code]}` }));

const paymentOptions = [
  { value: 'cash', label: paymentMethodLabel('cash') },
  { value: 'check', label: paymentMethodLabel('check') },
  { value: 'wire', label: paymentMethodLabel('wire') },
  { value: 'financing', label: paymentMethodLabel('financing') },
  { value: 'trade', label: paymentMethodLabel('trade') },
  { value: 'gift', label: paymentMethodLabel('gift') }
];

const taxBasisOptions = [
  { value: 'purchase-price', label: taxBasisLabel('purchase-price') },
  { value: 'standard-presumptive-value', label: taxBasisLabel('standard-presumptive-value') },
  { value: 'fair-market-value', label: taxBasisLabel('fair-market-value') },
  { value: 'exempt-gift', label: taxBasisLabel('exempt-gift') },
  { value: 'exempt-family', label: taxBasisLabel('exempt-family') }
];

const partyTypeOptions = [
  { value: 'individual', label: 'Individual' },
  { value: 'business', label: 'Business' }
];

const titleBrandOptions = ['clean', 'salvage', 'rebuilt', 'flood', 'lemon', 'junk', 'unknown']
  .map((value) => ({ value, label: titleBrandLabel(value) }));

const odometerStatusOptions = ['actual', 'exceeds-mechanical-limits', 'not-actual']
  .map((value) => ({ value, label: odometerStatusLabel(value) }));

const lienOptions = ['none', 'released', 'outstanding']
  .map((value) => ({ value, label: lienStatusLabel(value) }));

const asIsOptions = ['as-is', 'warranty']
  .map((value) => ({ value, label: asIsClauseLabel(value) }));

const notarizedOptions = ['yes', 'no', 'not-required']
  .map((value) => ({ value, label: notarizedLabel(value) }));

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Sale transaction',
    description: 'The state whose rules apply, the date and price of the sale, how it was paid, and the sales-tax basis.'
  });
  card.appendChild(selectInput({
    label: 'State that will title the vehicle', section: 'transaction', field: 'state',
    options: stateOptions,
    hint: 'State law varies; the state selects the notarization, release-of-liability, and title-transfer rules shown below.'
  }));
  card.appendChild(readOnlyReadout({
    label: 'State rules applied',
    id: 'state-rule-readout',
    render: () => renderStateRule()
  }));
  card.appendChild(textInput({
    label: 'Date of sale', section: 'transaction', field: 'saleDate', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Sale price (US dollars)', section: 'transaction', field: 'salePriceAsUsd', type: 'number',
    min: 0, hint: 'Enter 0 for a gift.', placeholder: 'e.g. 8500'
  }));
  card.appendChild(selectInput({
    label: 'Payment method', section: 'transaction', field: 'paymentMethod', options: paymentOptions
  }));
  card.appendChild(selectInput({
    label: 'Sales-tax basis', section: 'transaction', field: 'taxBasis', options: taxBasisOptions,
    hint: 'The basis the buyer will use when paying sales or use tax at titling.'
  }));
  return card;
}

function partyStep(stepNumber, key, title, description) {
  const card = sectionCard({ stepNumber, title, description });
  const who = key === 'seller' ? 'Seller' : 'Buyer';
  card.appendChild(textInput({
    label: `${who} printed name`, section: key, field: 'name', required: key === 'seller',
    hint: key === 'seller' ? 'As it appears on the title.' : undefined, placeholder: 'Full legal name'
  }));
  card.appendChild(selectInput({
    label: `${who} is`, section: key, field: 'type', options: partyTypeOptions
  }));
  card.appendChild(textInput({
    label: `${who} street address`, section: key, field: 'streetAddress',
    hint: 'The current address is required on the federal odometer disclosure.'
  }));
  card.appendChild(textInput({ label: `${who} city`, section: key, field: 'city' }));
  card.appendChild(selectInput({ label: `${who} state`, section: key, field: 'state', options: stateOptions }));
  card.appendChild(textInput({ label: `${who} ZIP code`, section: key, field: 'postalCode', placeholder: '12345 or 12345-6789' }));
  card.appendChild(textInput({ label: `${who} telephone`, section: key, field: 'phone', type: 'tel' }));
  card.appendChild(radioGroup({
    label: `${who} has signed the bill of sale?`, section: key, field: 'signed', options: yesNo
  }));
  return card;
}

function renderStep2() {
  return partyStep(2, 'seller', 'Seller (transferor)', 'Who is selling the vehicle: printed name, current address, and signature.');
}

function renderStep3() {
  return partyStep(3, 'buyer', 'Buyer (transferee)', 'Who is buying the vehicle: printed name, current address, and signature.');
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Vehicle',
    description: 'Year, make, model, body type, and Vehicle Identification Number as they appear on the title, and the title brand.'
  });
  card.appendChild(textInput({
    label: 'Model year', section: 'vehicle', field: 'year', type: 'number', min: 1900, placeholder: 'e.g. 2018'
  }));
  card.appendChild(textInput({ label: 'Make', section: 'vehicle', field: 'make', placeholder: 'e.g. Honda' }));
  card.appendChild(textInput({ label: 'Model', section: 'vehicle', field: 'model', placeholder: 'e.g. Accord' }));
  card.appendChild(textInput({ label: 'Body type', section: 'vehicle', field: 'bodyType', placeholder: 'e.g. sedan, pickup, SUV' }));
  card.appendChild(textInput({
    label: 'Vehicle Identification Number (VIN)', section: 'vehicle', field: 'vin',
    hint: '17 characters for a 1981 or newer vehicle; never I, O, or Q.', placeholder: '17-character VIN'
  }));
  card.appendChild(textInput({ label: 'Color', section: 'vehicle', field: 'color' }));
  card.appendChild(textInput({ label: 'Certificate of title number', section: 'vehicle', field: 'titleNumber' }));
  card.appendChild(selectInput({
    label: 'Title brand', section: 'vehicle', field: 'titleBrand', options: titleBrandOptions,
    hint: 'A salvage, rebuilt, flood, lemon-law, or junk brand must be disclosed to the buyer.'
  }));
  card.appendChild(radioGroup({
    label: 'Gross vehicle weight rating over 16,000 pounds?', section: 'vehicle', field: 'gvwrOver16000',
    options: yesNo, hint: 'Heavy vehicles are exempt from the federal odometer disclosure.'
  }));
  card.appendChild(radioGroup({
    label: 'Self-propelled?', section: 'vehicle', field: 'selfPropelled', options: yesNo,
    hint: 'A trailer is not self-propelled and is exempt from the federal odometer disclosure.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Odometer disclosure (49 CFR 580)',
    description: 'The federal odometer disclosure statement. Federal law requires the seller to state the mileage; false statements may bring fines or imprisonment.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Federal odometer disclosure',
    id: 'odometer-exempt-readout',
    render: () => renderOdometerExempt()
  }));
  card.appendChild(textInput({
    label: 'Odometer reading (miles)', section: 'odometer', field: 'readingMiles', type: 'number', min: 0,
    hint: 'Whole miles, without tenths.', placeholder: 'e.g. 64210'
  }));
  card.appendChild(selectInput({
    label: 'Seller certification', section: 'odometer', field: 'status', options: odometerStatusOptions,
    hint: 'Choose the one statement the seller can truthfully make.'
  }));
  card.appendChild(radioGroup({
    label: 'Seller has signed the odometer disclosure?', section: 'odometer', field: 'sellerCertified', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Buyer has signed the acknowledgement?', section: 'odometer', field: 'buyerAcknowledged', options: yesNo
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Terms, title, and lien',
    description: 'The as-is clause, whether the seller holds the title and has signed it over, any lien and its release, and notarization where the state requires it.'
  });
  card.appendChild(selectInput({
    label: 'Warranty terms', section: 'terms', field: 'asIsClause', options: asIsOptions,
    hint: 'An as-is sale says the buyer accepts the vehicle in its present condition with no warranty.'
  }));
  const warranty = document.createElement('div');
  warranty.setAttribute('data-conditional', 'terms.asIsClause=warranty');
  warranty.appendChild(textArea({
    label: 'Written warranty', section: 'terms', field: 'warrantyNote', placeholder: 'Describe what is covered and for how long.'
  }));
  card.appendChild(warranty);
  card.appendChild(radioGroup({
    label: 'Seller holds the certificate of title?', section: 'terms', field: 'sellerHoldsTitle', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Seller has signed the title over to the buyer?', section: 'terms', field: 'titleSigned', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Lien status', section: 'terms', field: 'lienStatus', options: lienOptions,
    hint: 'An outstanding lien must be paid off and released before a clear title can pass.'
  }));
  card.appendChild(textInput({ label: 'Lienholder name', section: 'terms', field: 'lienholderName' }));
  card.appendChild(textInput({ label: 'Date the lien was released', section: 'terms', field: 'lienReleaseDate', type: 'date' }));
  card.appendChild(selectInput({
    label: 'Notarized?', section: 'terms', field: 'notarized', options: notarizedOptions,
    hint: 'Some states (for example Pennsylvania and Ohio for the title, Louisiana for the bill of sale) require notarization.'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'After the sale and summary',
    description: 'The seller release of liability, plates, and the buyer title application, then the live classification. Submit to generate the full report.'
  });
  card.appendChild(radioGroup({
    label: 'Seller filed the release of liability or notice of transfer?', section: 'afterSale',
    field: 'releaseOfLiabilityFiled', options: yesNo
  }));
  card.appendChild(textInput({ label: 'Date the release of liability was filed', section: 'afterSale', field: 'releaseFiledDate', type: 'date' }));
  card.appendChild(radioGroup({
    label: 'Seller removed the license plates?', section: 'afterSale', field: 'platesRemoved', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Date the buyer applied to title and register', section: 'afterSale', field: 'buyerTitleApplicationDate', type: 'date'
  }));
  card.appendChild(readOnlyReadout({
    label: 'Live classification',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}


// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

/** One line summarizing the rule row applied for the chosen state. */
function renderStateRule() {
  const { rule, known } = stateRule(state.transaction.state);
  if (state.transaction.state === '') {
    return '<span class="muted">Choose a state to see its rules.</span>';
  }
  const notary = rule.notary === 'none' ? 'no notarization required'
    : rule.notary === 'title' ? 'title signatures must be notarized'
      : 'the bill of sale must be notarized';
  const seller = rule.sellerNoticeDays === null ? 'no seller notice deadline encoded' : `seller notice within ${rule.sellerNoticeDays} days`;
  const buyer = rule.buyerTransferDays === null ? 'no buyer title deadline encoded' : `buyer applies within ${rule.buyerTransferDays} days`;
  const prefix = known
    ? `<strong>${esc(rule.name)}</strong>:`
    : '<strong>Not in the rule table</strong> (uniform default applied; verify with the state agency):';
  return `${prefix} ${esc(notary)}; ${esc(seller)}; ${esc(buyer)}. ${esc(rule.taxNote)}`;
}

/** The odometer-exemption readout. */
function renderOdometerExempt() {
  const ex = odometerExemption(state);
  if (ex.exempt) {
    const why = {
      gvwr: 'gross vehicle weight rating over 16,000 pounds',
      'not-self-propelled': 'not self-propelled',
      'ten-year': 'model year 2010 or earlier and at least 10 years old',
      'twenty-year': 'model year 2011 or later and at least 20 years old'
    }[ex.reason];
    return `<span class="risk-badge risk-low">Exempt</span> <span class="muted">${esc(why)} (49 CFR 580.17). Recording the mileage is still wise.</span>`;
  }
  return '<span class="risk-badge risk-moderate">Required</span> <span class="muted">The seller must disclose the mileage to the buyer in writing.</span>';
}

/** Render the live status: class badge, odometer exemption, state-rule note. */
function renderLiveStatus() {
  const result = validateBillOfSale(state);
  const badge =
    `<span class="risk-badge ${completenessClassClass(result.completenessClass)}">${esc(completenessClassLabel(result.completenessClass))}</span>`;
  const odo = result.odometerExempt
    ? '<span class="muted">- federal odometer disclosure exempt</span>'
    : '<span class="muted">- federal odometer disclosure required</span>';
  const rule = state.transaction.state === ''
    ? '<span class="muted">- no state chosen</span>'
    : result.stateRuleKnown
      ? '<span class="muted">- state rule table applied</span>'
      : '<span class="muted">- uniform default applied; verify the state rule</span>';
  return `${badge} ${odo} ${rule}`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
  const rule = document.getElementById('state-rule-readout');
  if (rule) rule.innerHTML = renderStateRule();
  const odo = document.getElementById('odometer-exempt-readout');
  if (odo) odo.innerHTML = renderOdometerExempt();
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
  transaction: [['state'], ['saleDate'], ['salePriceAsUsd'], ['paymentMethod'], ['taxBasis']],
  seller: [['name'], ['streetAddress'], ['city'], ['signed']],
  buyer: [['name'], ['streetAddress'], ['city'], ['signed']],
  vehicle: [['year'], ['make'], ['model'], ['vin'], ['titleBrand']],
  odometer: [['readingMiles'], ['status'], ['sellerCertified'], ['buyerAcknowledged']],
  terms: [['asIsClause'], ['sellerHoldsTitle'], ['lienStatus'], ['notarized']],
  afterSale: [['releaseOfLiabilityFiled'], ['platesRemoved']]
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
    completenessClass, odometerExempt, stateRuleKnown,
    flaggedIssues, timestamp
  } = lastResult;

  const dash = '<span class="muted">—</span>';
  const val = (v) => (v === null || v === undefined || v === '' ? dash : esc(v));
  const { rule } = stateRule(state.transaction.state);
  const price = typeof state.transaction.salePriceAsUsd === 'number'
    ? `$${state.transaction.salePriceAsUsd.toLocaleString('en-US')}`
    : '';
  const odometer = typeof state.odometer.readingMiles === 'number'
    ? `${state.odometer.readingMiles.toLocaleString('en-US')} miles`
    : '';
  const vehicle = [state.vehicle.year, state.vehicle.make, state.vehicle.model]
    .filter((x) => x !== null && x !== '').join(' ');
  const partyLine = (p) => [p.name, p.streetAddress, p.city, p.state, p.postalCode].filter((x) => x).join(', ');

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
  if (completenessClass === 'risk-flagged') {
    guidance = `<p>This bill of sale is <strong>risk flagged</strong>: an odometer discrepancy, an invalid VIN, an outstanding lien, no title in hand, or a branded title needs attention. Resolve the high-priority flags below, and make sure the buyer has been told, before the sale is completed.</p>`;
  } else if (completenessClass === 'incomplete') {
    guidance = `<p>This bill of sale is <strong>incomplete</strong>: required details, signatures, the odometer disclosure, or a state-required notarization are missing. Complete the items flagged below before the parties sign.</p>`;
  } else {
    guidance = `<p>This bill of sale is <strong>complete</strong>: parties, vehicle, price, terms, odometer disclosure (or its exemption), title, and any required notarization are recorded, and no risk condition was found. Finish the post-sale filings flagged below, and keep a signed copy for at least five years.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Vehicle Bill of Sale: Completeness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${completenessClassClass(completenessClass)}">
        <div>
          <span class="risk-banner-label">Completeness class</span>
          <span class="risk-banner-value">${esc(completenessClassLabel(completenessClass))}</span>
        </div>
        ${odometerExempt ? '<span class="risk-badge risk-low">Odometer disclosure exempt</span>' : ''}
        ${stateRuleKnown ? '' : '<span class="risk-badge risk-moderate">Verify state rule</span>'}
      </div>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Sale summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">State</th><td>${val(state.transaction.state)}</td></tr>
          <tr><th scope="row">Date of sale</th><td>${val(state.transaction.saleDate)}</td></tr>
          <tr><th scope="row">Price</th><td>${val(price)} ${state.transaction.paymentMethod ? `<span class="muted">(${esc(paymentMethodLabel(state.transaction.paymentMethod))})</span>` : ''}</td></tr>
          <tr><th scope="row">Sales-tax basis</th><td>${val(taxBasisLabel(state.transaction.taxBasis))}</td></tr>
          <tr><th scope="row">Seller</th><td>${val(partyLine(state.seller))}</td></tr>
          <tr><th scope="row">Buyer</th><td>${val(partyLine(state.buyer))}</td></tr>
          <tr><th scope="row">Vehicle</th><td>${val(vehicle)}</td></tr>
          <tr><th scope="row">VIN</th><td>${val(state.vehicle.vin)}</td></tr>
          <tr><th scope="row">Title brand</th><td>${val(titleBrandLabel(state.vehicle.titleBrand))}</td></tr>
          <tr><th scope="row">Odometer</th><td>${val(odometer)} ${state.odometer.status ? `<span class="muted">(${esc(odometerStatusLabel(state.odometer.status))})</span>` : ''}</td></tr>
          <tr><th scope="row">Warranty terms</th><td>${val(asIsClauseLabel(state.terms.asIsClause))}</td></tr>
          <tr><th scope="row">Lien</th><td>${val(lienStatusLabel(state.terms.lienStatus))}</td></tr>
          <tr><th scope="row">Notarized</th><td>${val(notarizedLabel(state.terms.notarized))}</td></tr>
        </tbody>
      </table>

      <h3>State rule applied</h3>
      <p>${renderStateRule()}</p>
      <p class="muted">${esc(rule.verified === 'agency' ? 'Values read from a state agency page or form.' : rule.verified === 'secondary' ? 'Values taken from secondary guides; confirm with the agency.' : 'No rule row; confirm with the agency.')}</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">Documentation support, not legal advice. The state motor vehicle agency decides what it accepts.</p>

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
  const result = validateBillOfSale(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    completenessClass: result.completenessClass,
    odometerExempt: result.odometerExempt,
    stateRuleKnown: result.stateRuleKnown,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh bill of sale?')) return;
  clearState();
  state = emptyBillOfSale();
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
  { step: 1, section: 'transaction', title: 'Sale' },
  { step: 2, section: 'seller',      title: 'Seller' },
  { step: 3, section: 'buyer',       title: 'Buyer' },
  { step: 4, section: 'vehicle',     title: 'Vehicle' },
  { step: 5, section: 'odometer',    title: 'Odometer' },
  { step: 6, section: 'terms',       title: 'Terms and title' },
  { step: 7, section: 'afterSale',   title: 'After the sale' }
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
