import { detectFlaggedIssues } from './flags.js';
import { validateInstrument } from './grader.js';
import { effectivenessLabel, emptyInstrument, priorityLabel, relationshipLabel, validityClassClass, validityClassLabel, yesNoLabel, bankFormLabel, form2848Label, giftLimitLabel, compensationLabel, springingTriggerLabel, coAgentsLabel } from './types.js';
import { ruleFor, HOT_FIELDS, GRANT_FIELDS } from './rules.js';

// United States Durable Financial Power of Attorney (DPOA) -- wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The principal (or a helper) scrolls through the seven
// sections; a sticky progress summary reflects how many fields are answered,
// and a live readout shows the running validity class (ready-to-execute /
// incomplete / execution-risk) and the governing state rule. Submission runs
// the pure engine (classification plus flagged issues) and renders an inline
// report. State is persisted to localStorage so a partial fill survives reload.
//
// Documentation support, NOT legal advice. The engine checks the execution plan
// against the governing state's rule only; the statute, the notary, and a court
// decide.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-durable-financial-power-of-attorney.front-end-with-html.v1';

/** @returns {import('./types.js').PowerOfAttorney} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyInstrument();

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
    if (!raw) return emptyInstrument();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved plan; starting fresh.', e);
    return emptyInstrument();
  }
}

/** @param {import('./types.js').PowerOfAttorney} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save plan to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored plan.', e);
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

/** @type {import('./types.js').PowerOfAttorney} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-durable-financial-power-of-attorney',
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

const STATES = [['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']]
  .map(([value, name]) => ({ value, label: `${name} (${value})` }));

const effectivenessOptions = [
  { value: 'immediate', label: 'Immediately on signing' },
  { value: 'springing', label: 'Springing: only on a later event, such as incapacity' }
];
const triggerOptions = [
  { value: 'physician-certification', label: 'Physician certification of incapacity' },
  { value: 'named-person-declaration', label: 'Declaration by a named person' },
  { value: 'court-determination', label: 'Court determination' }
];
const relationshipOptions = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'other-family', label: 'Other family member' },
  { value: 'friend', label: 'Friend' },
  { value: 'professional', label: 'Professional fiduciary' },
  { value: 'financial-institution', label: 'Financial institution with trust powers' }
];
const coAgentsOptions = [
  { value: 'sole', label: 'One agent acts alone' },
  { value: 'jointly', label: 'Co-agents must act jointly' },
  { value: 'independently', label: 'Co-agents may act independently' }
];
const compensationOptions = [
  { value: 'none', label: 'No compensation' },
  { value: 'reasonable', label: 'Reasonable compensation' },
  { value: 'fixed', label: 'Fixed compensation' }
];
const giftLimitOptions = [
  { value: 'annual-exclusion', label: 'Federal annual exclusion per recipient' },
  { value: 'fixed-amount', label: 'Fixed amount per year' },
  { value: 'unlimited', label: 'Unlimited' },
  { value: 'none', label: 'No limit stated' }
];
const bankFormOptions = [
  { value: 'yes', label: 'Completed' },
  { value: 'no', label: 'Not completed' },
  { value: 'not-needed', label: 'Not needed' }
];
const form2848Options = [
  { value: 'filed', label: 'Filed or attached' },
  { value: 'not-filed', label: 'Not filed' },
  { value: 'not-needed', label: 'Not needed' }
];

const GRANT_LABELS = {
  grantBanking: 'Banking and financial institutions',
  grantRealEstate: 'Real estate',
  grantInvestments: 'Stocks, bonds, and investments',
  grantBusiness: 'Business operations',
  grantInsurance: 'Insurance and annuities',
  grantTaxMatters: 'Tax matters',
  grantBenefits: 'Government and public benefits',
  grantRetirement: 'Retirement plans',
  grantClaims: 'Claims and litigation',
  grantPersonalProperty: 'Personal property'
};
const HOT_LABELS = {
  hotCreateTrust: 'Create, amend, revoke, or terminate a trust',
  hotGift: 'Make gifts',
  hotSurvivorship: 'Create or change rights of survivorship',
  hotBeneficiary: 'Create or change a beneficiary designation',
  hotDelegate: 'Delegate the agent\'s authority',
  hotAnnuityWaiver: 'Waive the principal\'s joint and survivor annuity right',
  hotDisclaim: 'Disclaim property'
};

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Principal and governing state',
    description: 'Who is giving the power, where the instrument will be signed, and whether the principal can understand and sign it.'
  });
  card.appendChild(textInput({ label: 'Principal full legal name', section: 'principal', field: 'principalName', required: true, placeholder: 'As on government ID' }));
  card.appendChild(textInput({ label: 'Principal date of birth', section: 'principal', field: 'dateOfBirth', type: 'date' }));
  card.appendChild(selectInput({ label: 'Governing state', section: 'principal', field: 'state', options: STATES, required: true, hint: 'Where the principal lives and will sign. Execution formalities vary by state.' }));
  card.appendChild(textArea({ label: 'Principal address', section: 'principal', field: 'principalAddress', rows: 2 }));
  card.appendChild(radioGroup({ label: 'Capacity to sign confirmed?', section: 'principal', field: 'capacityConfirmed', options: yesNo, hint: 'The principal understands what the document does and its effect.' }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Durability and effectiveness',
    description: 'Whether the power survives incapacity, and when it starts.'
  });
  card.appendChild(radioGroup({ label: 'Does the authority survive the principal\'s later incapacity (durable)?', section: 'instrument', field: 'durableStatement', options: yesNo, hint: 'Texas and California need express durability wording; most states presume durability.' }));
  card.appendChild(selectInput({ label: 'When does the power take effect?', section: 'instrument', field: 'effectiveness', options: effectivenessOptions, hint: 'Florida does not allow a springing power.' }));
  card.appendChild(selectInput({ label: 'Who determines a springing event?', section: 'instrument', field: 'springingTrigger', options: triggerOptions, hint: 'Needed only for a springing power.' }));
  card.appendChild(radioGroup({ label: 'Statutory notice or warning text included?', section: 'instrument', field: 'statutoryNoticeIncluded', options: yesNo, hint: 'California, New York, and Pennsylvania call for notice text.' }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Agent and successors',
    description: 'The person or institution who will act, who acts if they cannot, and how they are paid.'
  });
  card.appendChild(textInput({ label: 'Agent full name', section: 'agents', field: 'agentName', required: true }));
  card.appendChild(selectInput({ label: 'Agent relationship', section: 'agents', field: 'agentRelationship', options: relationshipOptions }));
  card.appendChild(radioGroup({ label: 'Agent is an adult (18+) individual or a qualifying institution?', section: 'agents', field: 'agentIsAdult', options: yesNo }));
  card.appendChild(radioGroup({ label: 'Agent has signed the acknowledgment of duties?', section: 'agents', field: 'agentSignedAcknowledgment', options: yesNo, hint: 'Required by New York (for effectiveness) and Pennsylvania (before acting).' }));
  card.appendChild(textInput({ label: 'Successor agent full name', section: 'agents', field: 'successorAgentName' }));
  card.appendChild(selectInput({ label: 'Single agent or co-agents', section: 'agents', field: 'coAgentsMode', options: coAgentsOptions }));
  card.appendChild(selectInput({ label: 'Agent compensation', section: 'agents', field: 'compensation', options: compensationOptions }));
  card.appendChild(textInput({ label: 'Fixed annual compensation (USD)', section: 'agents', field: 'compensationAmount', type: 'number', min: 0 }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Authority granted',
    description: 'General powers, and the "hot powers" that need an express grant because they can reduce the principal\'s estate.'
  });
  for (const f of GRANT_FIELDS) {
    card.appendChild(radioGroup({ label: `General authority: ${GRANT_LABELS[f]}`, section: 'authority', field: f, options: yesNo }));
  }
  for (const f of HOT_FIELDS) {
    card.appendChild(radioGroup({ label: `Hot power: ${HOT_LABELS[f]}`, section: 'authority', field: f, options: yesNo, hint: 'Not granted unless expressly stated (Uniform Power of Attorney Act section 201).' }));
  }
  card.appendChild(radioGroup({ label: 'Principal initials beside each hot power?', section: 'authority', field: 'hotPowersInitialed', options: yesNo, hint: 'Florida requires the principal to sign or initial beside each.' }));
  card.appendChild(selectInput({ label: 'Gift limit', section: 'authority', field: 'giftLimitType', options: giftLimitOptions }));
  card.appendChild(textInput({ label: 'Fixed gift limit per year (USD)', section: 'authority', field: 'giftLimitAmount', type: 'number', min: 0 }));
  card.appendChild(radioGroup({ label: 'May the agent make gifts to the agent (self-gifting)?', section: 'authority', field: 'selfGiftingAllowed', options: yesNo }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Signing: notary and witnesses',
    description: 'How the principal\'s signature will be formalized.'
  });
  card.appendChild(radioGroup({ label: 'Notary acknowledgment arranged?', section: 'execution', field: 'notaryArranged', options: yesNo, required: true }));
  card.appendChild(textInput({ label: 'Number of witnesses arranged (not counting the notary)', section: 'execution', field: 'witnessCount', type: 'number', min: 0 }));
  card.appendChild(radioGroup({ label: 'Is any witness an agent or successor agent?', section: 'execution', field: 'witnessIsAgent', options: yesNo }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Acceptance and use',
    description: 'Banks, county recorders, and the IRS each have their own acceptance practices.'
  });
  card.appendChild(radioGroup({ label: 'Will the instrument be recorded for a real-estate transaction?', section: 'acceptance', field: 'usedForRealEstate', options: yesNo }));
  card.appendChild(selectInput({ label: 'Financial institution\'s own POA form', section: 'acceptance', field: 'bankFormCompleted', options: bankFormOptions }));
  card.appendChild(selectInput({ label: 'IRS Form 2848 status', section: 'acceptance', field: 'form2848Status', options: form2848Options, hint: 'A durable power does not by itself authorize representation before the IRS.' }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and readiness',
    description: 'The live validity class and the governing state rule. Submit to generate the full report.'
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

/** Render the live status: validity badge and the governing state rule. */
function renderLiveStatus() {
  const result = validateInstrument(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const rule = ruleFor(state);
  const governing = `<strong>Governing rule:</strong> ${esc(result.governingState)} <span class="muted">(${esc(rule.citation)})</span>`;
  const risk = result.executionRiskIndicated
    ? `<span class="muted">— execution risk indicated</span>`
    : `<span class="muted">— no execution risk detected</span>`;
  return `${badge} ${governing} ${risk}`;
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
  principal: [['principalName'], ['state'], ['capacityConfirmed']],
  instrument: [['durableStatement'], ['effectiveness']],
  agents: [['agentName'], ['agentIsAdult'], ['successorAgentName'], ['compensation']],
  authority: [['grantBanking', 'grantRealEstate', 'grantInvestments', 'grantBusiness', 'grantInsurance', 'grantTaxMatters', 'grantBenefits', 'grantRetirement', 'grantClaims', 'grantPersonalProperty'], ['hotGift'], ['giftLimitType']],
  execution: [['notaryArranged'], ['witnessCount']],
  acceptance: [['usedForRealEstate'], ['bankFormCompleted'], ['form2848Status']]
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
const val = (v) => (v === '' || v === null || v === undefined ? dash : esc(v));

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { validityClass, governingState, executionRiskIndicated, firedRules, flaggedIssues, timestamp } = lastResult;
  const rule = ruleFor(state);

  const grants = GRANT_FIELDS.filter((f) => state.authority[f] === 'yes').map((f) => GRANT_LABELS[f]);
  const hots = HOT_FIELDS.filter((f) => state.authority[f] === 'yes').map((f) => HOT_LABELS[f]);

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No flagged issues raised.</p>`
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
  if (validityClass === 'execution-risk') {
    guidance = `<p>At least one answered item contradicts the governing state's rule, so this plan is classified <strong>execution risk</strong>. Fix the high-priority items below before signing; an instrument that misses a formality may be refused by banks and recorders or later challenged. This is a documentation finding, not a legal opinion.</p>`;
  } else if (validityClass === 'incomplete') {
    guidance = `<p>This plan is <strong>incomplete</strong>: a core item is unanswered (principal, state, agent, effectiveness, durability, capacity, notary plan, or any granted authority). Complete the items below. Execution defects are not judged until the plan is complete.</p>`;
  } else {
    guidance = `<p>This plan is <strong>ready to execute</strong> against the ${esc(governingState)} rule: no execution defect was detected. This is a completeness finding, not a legal opinion. Advisory flags may remain, and a lawyer licensed in the state should review the final document.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Durable Financial Power of Attorney — Readiness Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Validity class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        ${executionRiskIndicated ? '<span class="risk-badge risk-high">Execution risk indicated</span>' : ''}
      </div>

      <p><strong>Governing state rule:</strong> ${esc(governingState)} <span class="muted">(${esc(rule.citation)})</span></p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Instrument summary</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Principal</th><td>${val(state.principal.principalName)}</td></tr>
          <tr><th scope="row">Agent</th><td>${val(state.agents.agentName)}${state.agents.agentRelationship ? ' (' + esc(relationshipLabel(state.agents.agentRelationship)) + ')' : ''}</td></tr>
          <tr><th scope="row">Successor agent</th><td>${val(state.agents.successorAgentName)}</td></tr>
          <tr><th scope="row">Effective</th><td>${state.instrument.effectiveness ? esc(effectivenessLabel(state.instrument.effectiveness)) : dash}</td></tr>
          <tr><th scope="row">Durable</th><td>${state.instrument.durableStatement ? esc(yesNoLabel(state.instrument.durableStatement)) : dash}</td></tr>
          <tr><th scope="row">General authority</th><td>${grants.length ? esc(grants.join('; ')) : dash}</td></tr>
          <tr><th scope="row">Hot powers granted</th><td>${hots.length ? esc(hots.join('; ')) : dash}</td></tr>
          <tr><th scope="row">Gift limit</th><td>${state.authority.giftLimitType ? esc(giftLimitLabel(state.authority.giftLimitType)) : dash}</td></tr>
          <tr><th scope="row">Compensation</th><td>${state.agents.compensation ? esc(compensationLabel(state.agents.compensation)) : dash}</td></tr>
          <tr><th scope="row">Notary / witnesses</th><td>${val(state.execution.notaryArranged ? yesNoLabel(state.execution.notaryArranged) : '')} / ${val(state.execution.witnessCount)}</td></tr>
          <tr><th scope="row">Bank form</th><td>${state.acceptance.bankFormCompleted ? esc(bankFormLabel(state.acceptance.bankFormCompleted)) : dash}</td></tr>
          <tr><th scope="row">IRS Form 2848</th><td>${state.acceptance.form2848Status ? esc(form2848Label(state.acceptance.form2848Status)) : dash}</td></tr>
        </tbody>
      </table>

      <h3>Rules that fired (${firedRules.length})</h3>
      ${firedRules.length === 0 ? '<p class="muted">None.</p>' : `<ul>${firedRules.map((r) => `<li><strong>${esc(r.ruleId)}</strong> ${esc(r.description)}</li>`).join('')}</ul>`}

      <h3>Next steps</h3>
      <p>Sign before a notary (and witnesses where the state requires), give the agent a copy, provide copies to banks in advance, record it with the county for any real-estate use, and store the original safely. Keep the principal's wishes in writing and review the document after major life events.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">Documentation support, not legal advice. The statute of the governing state, the notary, and a court decide whether an instrument is valid.</p>

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
  const result = validateInstrument(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    validityClass: result.validityClass,
    governingState: result.governingState,
    executionRiskIndicated: result.executionRiskIndicated,
    firedRules: result.firedRules,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh plan?')) return;
  clearState();
  state = emptyInstrument();
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
  { step: 1, section: 'principal',  title: 'Principal' },
  { step: 2, section: 'instrument', title: 'Durability' },
  { step: 3, section: 'agents',     title: 'Agents' },
  { step: 4, section: 'authority',  title: 'Authority' },
  { step: 5, section: 'execution',  title: 'Signing' },
  { step: 6, section: 'acceptance', title: 'Acceptance' },
  { step: 7, section: 'summary',    title: 'Summary' }
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
