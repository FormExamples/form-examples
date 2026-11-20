import { detectFlaggedIssues } from './flags.js';
import { validateWill } from './grader.js';
import { stateRuleFor, STATE_RULES } from './rules.js';
import { dollars, emptyWill, executionFormLabel, maritalStatusLabel, priorityLabel, validityClassClass, validityClassLabel } from './types.js';

// United States Last Will and Testament — wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The drafter scrolls through the seven will sections; a sticky
// top-of-page progress summary reflects how many fields have been answered, and
// a live readout shows the running validity class (valid-ready-to-execute /
// incomplete / formality-risk), the residuary total, and the estimated spousal
// elective share. Submission runs the pure engine (validity
// classification plus flagged issues) and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// This is a DOCUMENTATION instrument, NOT legal advice and NOT a
// substitute for a licensed attorney or the probate court.
// The engine validates completeness and formalities only.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-last-will-and-testament.front-end-with-html.v1';

/** @returns {import('./types.js').Will} */
// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields. Shared by localStorage restore
// (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same
// drift -- an older export, a hand-edited file, or a differently-
// shaped upload.
function mergeIntoDefaults(parsed) {
  // Merge over a fresh empty so any newly-added fields default correctly.
  const fresh = emptyWill();

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
    if (!raw) return emptyWill();
    const parsed = JSON.parse(raw);
    return mergeIntoDefaults(parsed);
  } catch (e) {
    console.warn('Could not parse saved will plan; starting fresh.', e);
    return emptyWill();
  }
}

/** @param {import('./types.js').Will} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save will plan to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored will plan.', e);
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

/** @type {import('./types.js').Will} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-last-will-and-testament',
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
  if (opts.step !== undefined) attrs.push(`step="${esc(opts.step)}"`);
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

const stateOptions = Object.keys(STATE_RULES).map((code) => ({ value: code, label: `${STATE_RULES[code].name} (${code})` }));

const soundMindOptions = [
  { value: 'yes', label: 'Yes, of sound mind' },
  { value: 'uncertain', label: 'Uncertain' },
  { value: 'no', label: 'No' }
];

const undueInfluenceOptions = [
  { value: 'none', label: 'No concern' },
  { value: 'possible', label: 'Possible undue influence' }
];

const maritalOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' }
];

const executionFormOptions = [
  { value: 'witnessed', label: 'Witnessed will (two witnesses)' },
  { value: 'holographic', label: 'Holographic (handwritten, unwitnessed) will' },
  { value: 'electronic', label: 'Electronic will' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Testator and state',
    description: 'Who is making the will, which state\'s law applies, and whether the testator has capacity. Capacity needs age 18 or older and a sound mind.'
  });
  card.appendChild(selectInput({
    label: 'State of domicile', section: 'testator', field: 'state', options: stateOptions, required: true,
    hint: 'Will law is state law. A state not listed uses the Uniform Probate Code default and raises a "verify state rule" flag.'
  }));
  card.appendChild(textInput({
    label: 'Testator — full legal name', section: 'testator', field: 'testatorName',
    required: true, placeholder: 'Full legal name'
  }));
  card.appendChild(textInput({
    label: 'Testator — date of birth', section: 'testator', field: 'dateOfBirth', type: 'date'
  }));
  card.appendChild(selectInput({
    label: 'Is the testator of sound mind?', section: 'testator', field: 'soundMind', options: soundMindOptions,
    hint: 'Testamentary capacity: understands the act of making a will, the nature of the property, and the natural objects of their bounty.'
  }));
  card.appendChild(selectInput({
    label: 'Undue influence concern', section: 'testator', field: 'undueInfluenceConcern', options: undueInfluenceOptions,
    hint: 'For example, a beneficiary who arranged the will or controls the testator.'
  }));
  card.appendChild(selectInput({
    label: 'Marital status', section: 'testator', field: 'maritalStatus', options: maritalOptions
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Family and spouse',
    description: 'A surviving spouse may have a right to elect against the will (the elective share), except in community property states, where the spouse already owns half of community property.'
  });
  card.appendChild(textInput({
    label: 'Spouse — name', section: 'family', field: 'spouseName', placeholder: 'Required if married'
  }));
  card.appendChild(textInput({
    label: 'Value left to the spouse (US dollars)', section: 'family', field: 'spouseInheritanceValue',
    type: 'number', min: 0, step: 1000
  }));
  card.appendChild(radioGroup({
    label: 'Has the spouse waived the elective share in writing?', section: 'family',
    field: 'spouseWaivedElectiveShare', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the testator have minor children?', section: 'family', field: 'hasMinorChildren', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Guardian for minor children — name', section: 'family', field: 'guardianForMinorsName',
    placeholder: 'Nominated guardian'
  }));
  card.appendChild(radioGroup({
    label: 'Does the will leave a child out?', section: 'family', field: 'disinheritsChild', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is the omitted child named in the will?', section: 'family', field: 'disinheritedChildNamed', options: yesNo,
    hint: 'Naming the child and stating the intent avoids a pretermitted-heir claim.'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Estate and bequests',
    description: 'Specific gifts, and the residuary clause that gives away everything else. The residuary shares must add up to exactly 100%.'
  });
  card.appendChild(textInput({
    label: 'Estimated estate value (US dollars)', section: 'estate', field: 'estimatedEstateValue',
    type: 'number', min: 0, step: 1000
  }));
  card.appendChild(textInput({
    label: 'Specific bequests — total value (US dollars)', section: 'estate', field: 'specificBequestsTotal',
    type: 'number', min: 0, step: 1000
  }));
  card.appendChild(textArea({
    label: 'Specific bequests — summary', section: 'estate', field: 'specificBequestsSummary',
    placeholder: 'e.g. $25,000 to the church; the family home to my daughter'
  }));
  card.appendChild(radioGroup({
    label: 'Is there a residuary clause?', section: 'estate', field: 'residuaryClausePresent', options: yesNo
  }));
  for (const n of [1, 2, 3]) {
    card.appendChild(textInput({
      label: `Residuary beneficiary ${n} — name`, section: 'estate', field: `residuary${n}Name`
    }));
    card.appendChild(textInput({
      label: `Residuary beneficiary ${n} — share (%)`, section: 'estate', field: `residuary${n}Percent`,
      type: 'number', min: 0, max: 100, step: 0.01
    }));
  }
  card.appendChild(radioGroup({
    label: 'Is a contingent (backup) beneficiary named?', section: 'estate', field: 'contingentBeneficiaryNamed', options: yesNo
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Representative and clauses',
    description: 'The personal representative (executor) and the standard clauses a will should carry.'
  });
  card.appendChild(textInput({
    label: 'Personal representative (executor) — name', section: 'provisions', field: 'personalRepresentativeName',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Successor personal representative — name', section: 'provisions', field: 'successorPersonalRepresentativeName'
  }));
  card.appendChild(radioGroup({
    label: 'Is the bond waived?', section: 'provisions', field: 'bondWaived', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the will revoke all earlier wills and codicils?', section: 'provisions', field: 'revokesPriorWillsClause', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the will contain a no-contest clause?', section: 'provisions', field: 'noContestClause', options: yesNo,
    hint: 'Enforceability varies: Florida does not enforce one, and many states allow a challenge made with probable cause.'
  }));
  card.appendChild(radioGroup({
    label: 'Does the will authorize access to digital assets?', section: 'provisions', field: 'digitalAssetsClause', options: yesNo,
    hint: 'Under the Revised Uniform Fiduciary Access to Digital Assets Act (RUFADAA), content of electronic communications needs the testator\'s consent.'
  }));
  card.appendChild(radioGroup({
    label: 'Has a tax adviser reviewed estate tax?', section: 'provisions', field: 'estateTaxReviewed', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Where is the signed original kept?', section: 'provisions', field: 'originalWillLocation',
    placeholder: 'e.g. fireproof safe at home; attorney vault'
  }));
  card.appendChild(textArea({
    label: 'Drafter note', section: 'provisions', field: 'drafterNote',
    placeholder: 'Free-text note for the file.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Execution and witnesses',
    description: 'How the will will be signed. A witnessed will needs the testator\'s signature at the end and, normally, two adult witnesses who watch the signing. Witnesses should take nothing under the will.'
  });
  card.appendChild(selectInput({
    label: 'Form of execution', section: 'execution', field: 'executionForm', options: executionFormOptions, required: true
  }));
  card.appendChild(textInput({
    label: 'Execution date', section: 'execution', field: 'executionDate', type: 'date'
  }));
  card.appendChild(radioGroup({
    label: 'Does the testator sign at the end of the will?', section: 'execution', field: 'signedAtEnd', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the testator sign, or acknowledge the signature, in front of the witnesses?', section: 'execution',
    field: 'signedInWitnessPresence', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Do the witnesses sign in the testator\'s presence?', section: 'execution',
    field: 'witnessesSignedInTestatorPresence', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Holographic will: are the signature and material provisions in the testator\'s own handwriting?', section: 'execution',
    field: 'holographicEntirelyHandwritten', options: yesNo
  }));
  for (const n of [1, 2, 3]) {
    card.appendChild(textInput({
      label: `Witness ${n} — name`, section: 'execution', field: `witness${n}Name`,
      hint: n === 3 ? 'Optional extra (supernumerary) witness.' : undefined
    }));
    card.appendChild(radioGroup({
      label: `Witness ${n} — takes a gift under the will?`, section: 'execution', field: `witness${n}Beneficiary`, options: yesNo
    }));
  }
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Self-proving affidavit',
    description: 'A self-proving affidavit, signed by the testator and witnesses before a notary, lets the court accept the will without calling the witnesses. California accepts a declaration under penalty of perjury instead, and Ohio does not use one.'
  });
  card.appendChild(radioGroup({
    label: 'Will a self-proving affidavit be signed?', section: 'selfProving', field: 'selfProvingAffidavit', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Notary — name', section: 'selfProving', field: 'notaryName'
  }));
  card.appendChild(radioGroup({
    label: 'Did the notary acknowledge the signatures?', section: 'selfProving', field: 'notaryAcknowledged', options: yesNo
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and validity',
    description: 'The live validity class, the residuary total, and the estimated spousal elective share. Submit to generate the full report.'
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

/** Render the live status: validity badge, residuary total, elective share. */
function renderLiveStatus() {
  const result = validateWill(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const residuary = `<strong>Residuary total:</strong> ${esc(String(result.residuaryPercentTotal))}%`;
  const elective = result.electiveShareAmount === null
    ? `<span class="muted">— no elective share estimate</span>`
    : `<span class="muted">— estimated elective share ${esc(dollars(result.electiveShareAmount))}</span>`;
  return `${badge} ${residuary} ${elective}`;
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
  testator: [['state'], ['testatorName'], ['dateOfBirth'], ['soundMind'], ['maritalStatus']],
  family: [['hasMinorChildren'], ['spouseInheritanceValue', 'spouseName']],
  estate: [['estimatedEstateValue'], ['residuaryClausePresent'], ['contingentBeneficiaryNamed']],
  provisions: [['personalRepresentativeName'], ['revokesPriorWillsClause'], ['digitalAssetsClause']],
  execution: [['executionForm'], ['executionDate'], ['signedAtEnd'], ['witness1Name']],
  selfProving: [['selfProvingAffidavit']]
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
const cell = (v) => (v === null || v === undefined || v === '' ? dash : esc(v));

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    validityClass, residuaryPercentTotal, electiveShareAmount, witnessCount,
    selfProved, federalEstateTaxExposure, stateRuleSource, flaggedIssues, timestamp
  } = lastResult;
  const { rule } = stateRuleFor(state.testator.state);

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
  if (validityClass === 'formality-risk') {
    guidance = `<p>This will plan has a <strong>formality risk</strong>: at least one high-priority flag below could make the will, or a gift in it, fail. Fix those items <strong>before</strong> the signing ceremony. This is a documentation finding, not legal advice, and the probate court decides validity.</p>`;
  } else if (validityClass === 'incomplete') {
    guidance = `<p>This will plan is <strong>incomplete</strong>: required answers are missing, listed in the flags below. Complete them before the will is signed.</p>`;
  } else {
    guidance = `<p>This will plan is <strong>valid and ready to execute</strong> under the rules this tool checks: capacity, signature, witnesses and bequest arithmetic raise no high-priority issue. Review the medium and low flags, then hold the signing ceremony. This does <strong>not</strong> guarantee validity; the probate court decides.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United States Last Will and Testament — Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Validity class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        ${federalEstateTaxExposure ? '<span class="risk-badge risk-moderate">Federal estate tax may apply</span>' : ''}
      </div>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Key figures</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">State rule used</th><td>${esc(rule.name)} (${stateRuleSource === 'state-table' ? 'state table' : 'Uniform Probate Code default'})</td></tr>
          <tr><th scope="row">Testator</th><td>${cell(state.testator.testatorName)}</td></tr>
          <tr><th scope="row">Marital status</th><td>${cell(maritalStatusLabel(state.testator.maritalStatus))}</td></tr>
          <tr><th scope="row">Form of execution</th><td>${cell(executionFormLabel(state.execution.executionForm))}</td></tr>
          <tr><th scope="row">Witnesses named</th><td>${esc(String(witnessCount))} (state needs ${esc(String(rule.witnessesRequired))})</td></tr>
          <tr><th scope="row">Self-proved</th><td>${selfProved ? 'Yes' : 'No'}</td></tr>
          <tr><th scope="row">Residuary total</th><td>${esc(String(residuaryPercentTotal))}%</td></tr>
          <tr><th scope="row">Specific bequests</th><td>${cell(dollars(state.estate.specificBequestsTotal))}</td></tr>
          <tr><th scope="row">Estimated estate</th><td>${cell(dollars(state.estate.estimatedEstateValue))}</td></tr>
          <tr><th scope="row">Estimated spousal elective share</th><td>${electiveShareAmount === null ? 'Not applicable' : esc(dollars(electiveShareAmount))}</td></tr>
          <tr><th scope="row">Personal representative</th><td>${cell(state.provisions.personalRepresentativeName)}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Sign with the testator and witnesses together, add the self-proving affidavit before a notary where the state uses one, store the original safely, and tell the personal representative where it is. Review the will after a marriage, divorce, birth, death or move to another state.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">This tool is documentation support, not legal advice. The issuing court decides whether a will is valid; consult a licensed attorney in the testator's state.</p>

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
  const result = validateWill(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    ...result,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh will plan?')) return;
  clearState();
  state = emptyWill();
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
  { step: 1, section: 'testator',   title: 'Testator' },
  { step: 2, section: 'family',     title: 'Family' },
  { step: 3, section: 'estate',     title: 'Estate' },
  { step: 4, section: 'provisions', title: 'Clauses' },
  { step: 5, section: 'execution',  title: 'Execution' },
  { step: 6, section: 'selfProving', title: 'Self-proving' },
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
