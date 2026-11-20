import { detectFlaggedIssues } from './flags.js';
import { assessBillOfSale } from './grader.js';
import { classificationClass, classificationLabel, dvlaNotificationLabel, emptyBillOfSale, financeStatusLabel, motStatusLabel, paymentMethodLabel, priorityLabel, saleTermsLabel, sellerCapacityLabel, yesNoLabel } from './types.js';

// United Kingdom Vehicle Bill of Sale — wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The user scrolls through the ten sections; a sticky
// top-of-page progress summary reflects how many fields have been answered,
// and a live readout shows the running classification (complete / incomplete /
// risk-flagged) with the missing-item and risk counts. Submission runs the
// pure engine (classification plus flagged issues) and renders an inline
// report. State is persisted to localStorage so a partial fill survives a
// reload.
//
// This is a COMPLETENESS and VALIDITY instrument. It is documentation support,
// not legal advice.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-vehicle-bill-of-sale.front-end-with-html.v1';

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

/** @type {import('./types.js').Object | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-vehicle-bill-of-sale',
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

const TOTAL_STEPS = 10;

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

const sellerCapacityOptions = [
  { value: 'private', label: 'Private individual' },
  { value: 'trader', label: 'Trader (selling in the course of a business)' }
];

const fuelOptions = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
  { value: 'other', label: 'Other' }
];

const mileageAccuracyOptions = [
  { value: 'recorded', label: 'Recorded reading from the odometer' },
  { value: 'not-known', label: 'Not known (odometer unreliable or replaced)' }
];

const motOptions = [
  { value: 'valid', label: 'Valid MOT' },
  { value: 'expired', label: 'MOT expired' },
  { value: 'exempt', label: 'Exempt from MOT' },
  { value: 'none', label: 'No MOT' }
];

const financeOptions = [
  { value: 'none', label: 'No outstanding finance (checked)' },
  { value: 'outstanding', label: 'Finance outstanding' },
  { value: 'unchecked', label: 'Not checked' }
];

const paymentMethodOptions = [
  { value: 'bank-transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' }
];

const saleTermsOptions = [
  { value: 'sold-as-seen', label: 'Sold as seen' },
  { value: 'warranty-given', label: 'Warranty given' }
];

const dvlaOptions = [
  { value: 'online', label: 'Told DVLA online' },
  { value: 'post', label: 'Told DVLA by post (V5C)' },
  { value: 'not-yet', label: 'Not yet told' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per bill-of-sale step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The sale',
    description: 'When and where the sale took place, and whether the seller is a private individual or a trader.'
  });
  card.appendChild(textInput({ label: 'Date of sale', section: 'sale', field: 'saleDate', type: 'date', required: true }));
  card.appendChild(textInput({ label: 'Place of sale', section: 'sale', field: 'salePlace', placeholder: 'e.g. Seller\'s home, Leeds' }));
  card.appendChild(selectInput({
    label: 'Seller is', section: 'sale', field: 'sellerCapacity', options: sellerCapacityOptions,
    hint: 'A trader cannot sell as a private seller; the Consumer Rights Act 2015 applies to traders.'
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Seller',
    description: 'The person selling the vehicle.'
  });
  card.appendChild(textInput({ label: 'Seller — full name', section: 'seller', field: 'name', required: true, placeholder: 'As shown on the V5C' }));
  card.appendChild(textArea({ label: 'Seller — address', section: 'seller', field: 'address', rows: 2 }));
  card.appendChild(textInput({ label: 'Seller — postcode', section: 'seller', field: 'postcode', placeholder: 'e.g. LS1 4AP' }));
  card.appendChild(textInput({ label: 'Seller — phone', section: 'seller', field: 'phone', type: 'tel' }));
  card.appendChild(textInput({ label: 'Seller — email', section: 'seller', field: 'email', type: 'email' }));
  card.appendChild(radioGroup({
    label: 'Is the seller the registered keeper named on the V5C?', section: 'seller',
    field: 'isRegisteredKeeper', options: yesNo,
    hint: 'Only the registered keeper (or someone acting for them) should sell the vehicle.'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Buyer',
    description: 'The person buying the vehicle.'
  });
  card.appendChild(textInput({ label: 'Buyer — full name', section: 'buyer', field: 'name', required: true }));
  card.appendChild(textArea({ label: 'Buyer — address', section: 'buyer', field: 'address', rows: 2 }));
  card.appendChild(textInput({ label: 'Buyer — postcode', section: 'buyer', field: 'postcode' }));
  card.appendChild(textInput({ label: 'Buyer — phone', section: 'buyer', field: 'phone', type: 'tel' }));
  card.appendChild(textInput({ label: 'Buyer — email', section: 'buyer', field: 'email', type: 'email' }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'The vehicle',
    description: 'Identify the vehicle exactly as shown on the V5C and on the vehicle itself.'
  });
  card.appendChild(textInput({ label: 'Registration number', section: 'vehicle', field: 'registration', required: true, placeholder: 'e.g. AB12 CDE' }));
  card.appendChild(textInput({ label: 'Make', section: 'vehicle', field: 'make', placeholder: 'e.g. Ford' }));
  card.appendChild(textInput({ label: 'Model', section: 'vehicle', field: 'model', placeholder: 'e.g. Focus' }));
  card.appendChild(textInput({ label: 'Colour', section: 'vehicle', field: 'colour' }));
  card.appendChild(textInput({
    label: 'Vehicle identification number (VIN)', section: 'vehicle', field: 'vin',
    hint: 'Also called the chassis number; 17 characters on modern vehicles. Check it against the V5C.',
    placeholder: 'e.g. WF0XXXGCDXAB12345'
  }));
  card.appendChild(textInput({ label: 'Year first registered', section: 'vehicle', field: 'firstRegisteredYear', type: 'number', min: 1900, max: 2100 }));
  card.appendChild(selectInput({ label: 'Fuel type', section: 'vehicle', field: 'fuelType', options: fuelOptions }));
  card.appendChild(textInput({ label: 'Mileage at sale (miles)', section: 'vehicle', field: 'mileage', type: 'number', min: 0 }));
  card.appendChild(selectInput({ label: 'Mileage accuracy', section: 'vehicle', field: 'mileageAccuracy', options: mileageAccuracyOptions }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Checks: V5C, MOT, and finance',
    description: 'The V5C log book, the MOT, and whether any finance is still owed on the vehicle.'
  });
  card.appendChild(radioGroup({ label: 'Does the seller have the V5C (log book)?', section: 'checks', field: 'v5cPresent', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Do the V5C details match the vehicle and the seller?', section: 'checks', field: 'v5cDetailsMatch', options: yesNo }));
  card.appendChild(selectInput({ label: 'MOT status', section: 'checks', field: 'motStatus', options: motOptions, hint: 'A vehicle generally needs an MOT once it is three years old.' }));
  card.appendChild(textInput({ label: 'MOT expiry date', section: 'checks', field: 'motExpiryDate', type: 'date' }));
  card.appendChild(selectInput({
    label: 'Outstanding finance', section: 'checks', field: 'financeStatus', options: financeOptions,
    hint: 'If a lender still owns the vehicle (hire purchase, PCP, logbook loan), it can be repossessed from the buyer.'
  }));
  card.appendChild(textInput({ label: 'Date finance / vehicle history check was run', section: 'checks', field: 'financeCheckDate', type: 'date' }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Price and payment',
    description: 'The agreed price and how it is paid. Prefer a bank transfer and keep proof of payment.'
  });
  card.appendChild(textInput({ label: 'Price (£)', section: 'payment', field: 'priceAsGbp', type: 'number', min: 0, required: true }));
  card.appendChild(textInput({ label: 'Deposit paid (£)', section: 'payment', field: 'depositAsGbp', type: 'number', min: 0 }));
  card.appendChild(selectInput({ label: 'Payment method', section: 'payment', field: 'paymentMethod', options: paymentMethodOptions }));
  card.appendChild(radioGroup({ label: 'Has the seller received cleared funds?', section: 'payment', field: 'paymentReceived', options: yesNo }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Condition and description',
    description: 'In a private sale the vehicle is usually sold as seen, but the seller must still describe it honestly.'
  });
  card.appendChild(selectInput({ label: 'Sale terms', section: 'condition', field: 'saleTerms', options: saleTermsOptions }));
  card.appendChild(textArea({
    label: 'Known faults disclosed by the seller', section: 'condition', field: 'knownFaults',
    placeholder: 'e.g. Slight oil leak; scratch on the rear bumper'
  }));
  card.appendChild(radioGroup({
    label: 'Does the vehicle match the advert and what the seller said?', section: 'condition',
    field: 'descriptionMatchesAdvert', options: yesNo
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Telling DVLA',
    description: 'The seller must tell DVLA about the sale, and the buyer keeps the V5C/2 new keeper section until the new V5C arrives. The buyer must tax the vehicle before driving it, because tax does not transfer.'
  });
  card.appendChild(radioGroup({ label: 'Has the seller given the buyer the V5C/2 new keeper section?', section: 'dvla', field: 'newKeeperSlipGiven', options: yesNo }));
  card.appendChild(selectInput({ label: 'How has DVLA been told of the sale?', section: 'dvla', field: 'dvlaNotification', options: dvlaOptions }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Signatures',
    description: 'Both parties sign and date the bill of sale, and each keeps a copy.'
  });
  card.appendChild(radioGroup({ label: 'Has the seller signed?', section: 'signatures', field: 'sellerSigned', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Has the buyer signed?', section: 'signatures', field: 'buyerSigned', options: yesNo }));
  card.appendChild(textInput({ label: 'Date signed', section: 'signatures', field: 'signatureDate', type: 'date' }));
  card.appendChild(textArea({ label: 'Note', section: 'signatures', field: 'note', placeholder: 'Anything else the parties agreed.' }));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Summary and classification',
    description: 'The live classification and the number of missing items and risk conditions. Submit to generate the full report.'
  });
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

/** Render the live status: classification badge plus missing and risk counts. */
function renderLiveStatus() {
  const result = assessBillOfSale(state);
  const badge =
    `<span class="risk-badge ${classificationClass(result.classification)}">${esc(classificationLabel(result.classification))}</span>`;
  return `${badge} <span class="muted">${result.missingItemCount} item(s) missing; ${result.riskFlagCount} risk condition(s)</span>`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
}


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
// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------


// Each section maps to one or more progress "slots". A slot counts as answered
// when ANY of its fields is answered.
const STEP_SLOTS = {
  sale: [['saleDate'], ['sellerCapacity']],
  seller: [['name'], ['address'], ['isRegisteredKeeper']],
  buyer: [['name'], ['address']],
  vehicle: [['registration'], ['make'], ['model'], ['vin'], ['mileage']],
  checks: [['v5cPresent'], ['motStatus'], ['financeStatus']],
  payment: [['priceAsGbp'], ['paymentMethod']],
  condition: [['saleTerms'], ['descriptionMatchesAdvert']],
  dvla: [['newKeeperSlipGiven'], ['dvlaNotification']],
  signatures: [['sellerSigned'], ['buyerSigned']]
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

function cell(v) {
  return v === null || v === undefined || v === '' ? '<span class="muted">—</span>' : esc(String(v));
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { classification, missingItemCount, riskFlagCount, missingItems, flaggedIssues, timestamp } = lastResult;

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

  const missingList = missingItems.length === 0
    ? `<p class="muted">Every required item is filled in.</p>`
    : `<ul>${missingItems.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`;

  let guidance;
  if (classification === 'risk-flagged') {
    guidance = `<p>A risk condition holds, so this bill of sale is classified <strong>risk flagged</strong>: outstanding finance, no V5C or a V5C that does not match, a seller who is not the registered keeper, or a vehicle that does not match its description. Resolve the risk before the sale goes ahead. This is a documentation finding, not legal advice.</p>`;
  } else if (classification === 'incomplete') {
    guidance = `<p>This bill of sale is <strong>incomplete</strong>: ${missingItemCount} required item(s) are still missing. Complete them so the record shows who sold what to whom, for how much, and on what terms.</p>`;
  } else {
    guidance = `<p>This bill of sale is <strong>complete</strong>: every required item is filled in and no risk condition holds. That does <strong>not</strong> prove the seller owns the vehicle, that finance is settled, or that the vehicle matches its description.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United Kingdom Vehicle Bill of Sale — Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${classificationClass(classification)}">
        <div>
          <span class="risk-banner-label">Classification</span>
          <span class="risk-banner-value">${esc(classificationLabel(classification))}</span>
        </div>
        ${riskFlagCount > 0 ? `<span class="risk-badge risk-high">${riskFlagCount} risk condition(s)</span>` : ''}
      </div>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Sale summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Vehicle</th><td>${cell([state.vehicle.registration, state.vehicle.make, state.vehicle.model].filter(Boolean).join(' '))}</td></tr>
          <tr><th scope="row">VIN</th><td>${cell(state.vehicle.vin)}</td></tr>
          <tr><th scope="row">Mileage</th><td>${cell(state.vehicle.mileage === null ? '' : state.vehicle.mileage + ' miles')}</td></tr>
          <tr><th scope="row">Seller</th><td>${cell(state.seller.name)}${state.sale.sellerCapacity ? ' (' + esc(sellerCapacityLabel(state.sale.sellerCapacity)) + ')' : ''}</td></tr>
          <tr><th scope="row">Buyer</th><td>${cell(state.buyer.name)}</td></tr>
          <tr><th scope="row">Price</th><td>${cell(state.payment.priceAsGbp === null ? '' : '£' + state.payment.priceAsGbp)}</td></tr>
          <tr><th scope="row">Payment</th><td>${cell(paymentMethodLabel(state.payment.paymentMethod))}</td></tr>
          <tr><th scope="row">Terms</th><td>${cell(saleTermsLabel(state.condition.saleTerms))}</td></tr>
          <tr><th scope="row">MOT</th><td>${cell(motStatusLabel(state.checks.motStatus))}</td></tr>
          <tr><th scope="row">Finance</th><td>${cell(financeStatusLabel(state.checks.financeStatus))}</td></tr>
          <tr><th scope="row">V5C present</th><td>${cell(yesNoLabel(state.checks.v5cPresent))}</td></tr>
          <tr><th scope="row">DVLA</th><td>${cell(dvlaNotificationLabel(state.dvla.dvlaNotification))}</td></tr>
        </tbody>
      </table>

      <h3>Missing items (${missingItemCount})</h3>
      ${missingList}

      <h3>Next steps</h3>
      <p>The seller tells DVLA about the sale (online, or by post with the V5C), which cancels the vehicle tax and lets the seller claim a refund for any full months left. The seller gives the buyer the V5C/2 new keeper section. The buyer must tax and insure the vehicle before driving it, because tax does not transfer. Related forms: the DVLA forms in this collection and United Kingdom Vehicle Registration Application.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">This form is documentation support, not legal advice.</p>

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
  const result = assessBillOfSale(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    classification: result.classification,
    missingItemCount: result.missingItemCount,
    riskFlagCount: result.riskFlagCount,
    missingItems: result.missingItems,
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
  { step: 1, section: 'sale',       title: 'Sale' },
  { step: 2, section: 'seller',     title: 'Seller' },
  { step: 3, section: 'buyer',      title: 'Buyer' },
  { step: 4, section: 'vehicle',    title: 'Vehicle' },
  { step: 5, section: 'checks',     title: 'Checks' },
  { step: 6, section: 'payment',    title: 'Payment' },
  { step: 7, section: 'condition',  title: 'Condition' },
  { step: 8, section: 'dvla',       title: 'DVLA' },
  { step: 9, section: 'signatures', title: 'Signatures' },
  { step: 10, section: 'summary',   title: 'Summary' }
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
