import { detectFlaggedIssues } from './flags.js';
import { validateWill } from './grader.js';
import { beneficiaries, nonEmpty, sharesTotalPercent, witnesses } from './rules.js';
import { ORDINALS, domicileLabel, emptyWill, estateValueBandLabel, executionStatusLabel, funeralWishesLabel, maritalStatusLabel, priorityLabel, relationshipLabel, validityClassClass, validityClassLabel, yesNoLabel } from './types.js';

// United Kingdom Last Will and Testament (England and Wales) — wizard
// (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The person preparing the will scrolls through the six
// sections; a sticky top-of-page progress summary reflects how many fields have
// been answered, and a live readout shows the running validity class (valid /
// incomplete / formality-risk), the total of the beneficiary shares, and the
// number of witnesses named. Submission runs the pure engine (validity
// classification plus flagged issues) and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// This is a WILL-DRAFTING DOCUMENTATION instrument, NOT legal advice. The engine
// validates completeness and the Wills Act 1837 formalities only; it cannot
// confirm that a will is legally valid.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-last-will-and-testament.front-end-with-html.v1';

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
    console.warn('Could not parse saved will; starting fresh.', e);
    return emptyWill();
  }
}

/** @param {import('./types.js').Will} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save will to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored will.', e);
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

/** @type {object | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-last-will-and-testament',
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

const domicileOptions = [
  { value: 'england-wales', label: 'England and Wales' },
  { value: 'scotland', label: 'Scotland' },
  { value: 'northern-ireland', label: 'Northern Ireland' },
  { value: 'other', label: 'Another country' }
];

const maritalStatusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'civil-partnership', label: 'In a civil partnership' },
  { value: 'cohabiting', label: 'Living with an unmarried partner' },
  { value: 'divorced-or-dissolved', label: 'Divorced or civil partnership dissolved' },
  { value: 'widowed', label: 'Widowed' }
];

const previousWillOptions = [
  { value: 'none', label: 'No earlier will' },
  { value: 'exists', label: 'An earlier will exists' },
  { value: 'unsure', label: 'Not sure' }
];

const estateValueOptions = [
  { value: 'under-325k', label: 'Under £325,000' },
  { value: '325k-500k', label: '£325,000 to £500,000' },
  { value: '500k-2m', label: '£500,000 to £2 million' },
  { value: 'over-2m', label: 'Over £2 million' }
];

const relationshipOptions = [
  { value: 'spouse-or-civil-partner', label: 'Spouse or civil partner' },
  { value: 'unmarried-partner', label: 'Unmarried partner' },
  { value: 'child', label: 'Child' },
  { value: 'grandchild', label: 'Grandchild' },
  { value: 'other-relative', label: 'Other relative' },
  { value: 'friend', label: 'Friend' },
  { value: 'charity', label: 'Charity' },
  { value: 'other', label: 'Other' }
];

const funeralOptions = [
  { value: 'burial', label: 'Burial' },
  { value: 'cremation', label: 'Cremation' },
  { value: 'no-preference', label: 'No preference' },
  { value: 'other', label: 'Other' }
];

const executionStatusOptions = [
  { value: 'draft', label: 'Draft — not yet signed' },
  { value: 'signed', label: 'Signed and witnessed' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The testator',
    description: 'Who is making the will, whether they can (18 or over, capacity, free choice), and whether an earlier will or a coming marriage affects it.'
  });
  card.appendChild(textInput({
    label: 'Testator — full legal name', section: 'testator', field: 'testatorName',
    required: true, placeholder: 'Full name as it will appear in the will'
  }));
  card.appendChild(textInput({
    label: 'Date of birth', section: 'testator', field: 'dateOfBirth', type: 'date',
    hint: 'You must be 18 or over to make a valid will.'
  }));
  card.appendChild(textArea({
    label: 'Address', section: 'testator', field: 'testatorAddress', rows: 2,
    placeholder: 'Postal address'
  }));
  card.appendChild(selectInput({
    label: 'Domicile (where your permanent home is)', section: 'testator', field: 'domicile',
    options: domicileOptions,
    hint: 'This tool follows the law of England and Wales. Scotland and Northern Ireland have their own rules.'
  }));
  card.appendChild(selectInput({
    label: 'Marital status', section: 'testator', field: 'maritalStatus',
    options: maritalStatusOptions,
    hint: 'Unmarried partners inherit nothing under the intestacy rules unless you provide for them.'
  }));
  card.appendChild(radioGroup({
    label: 'Do you expect to marry or form a civil partnership soon?', section: 'testator',
    field: 'marriageExpected', options: yesNo,
    hint: 'Marriage or a civil partnership revokes an existing will unless it was made in contemplation of that marriage.'
  }));
  card.appendChild(radioGroup({
    label: 'Does the will say it is made in contemplation of that marriage or civil partnership?', section: 'testator',
    field: 'contemplationOfMarriageClause', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Does the testator have mental capacity to make a will?', section: 'testator',
    field: 'hasMentalCapacity', options: yesNo,
    hint: 'They understand what a will does, roughly what they own, and who might expect to inherit.'
  }));
  card.appendChild(radioGroup({
    label: 'Is the testator making the will freely, with no pressure or undue influence?', section: 'testator',
    field: 'madeVoluntarily', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Earlier will', section: 'testator', field: 'previousWill', options: previousWillOptions
  }));
  card.appendChild(radioGroup({
    label: 'Does this will revoke all earlier wills and codicils?', section: 'testator',
    field: 'revocationClause', options: yesNo
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'The estate',
    description: 'Roughly what is owned, where, and the inheritance tax position. The nil-rate band is £325,000, and the residence nil-rate band adds up to £175,000 when a home is left to children or grandchildren.'
  });
  card.appendChild(selectInput({
    label: 'Approximate value of the estate', section: 'estate', field: 'estateValueBand',
    options: estateValueOptions,
    hint: 'Property, savings, investments and possessions, less debts. Estates above £325,000 may owe Inheritance Tax at 40% on the excess unless left to a spouse, civil partner or charity.'
  }));
  card.appendChild(radioGroup({
    label: 'Does the estate include a home?', section: 'estate', field: 'ownsHome', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Is the home left to children or grandchildren?', section: 'estate',
    field: 'homeToDirectDescendants', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Share of the net estate left to charity (%)', section: 'estate',
    field: 'charityGiftPercent', type: 'number', min: 0, max: 100,
    hint: 'At least 10% to charity can lower the inheritance tax rate on the rest to 36%.'
  }));
  card.appendChild(radioGroup({
    label: 'Is any property outside England and Wales?', section: 'estate',
    field: 'estateOtherJurisdictions', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Property outside England and Wales', section: 'estate',
    field: 'otherJurisdictionsDetail', placeholder: 'e.g. holiday flat in Spain'
  }));
  card.appendChild(textArea({
    label: 'Specific gifts', section: 'estate', field: 'specificGiftsNotes',
    hint: 'Items or sums of money for named people, before the residuary estate is shared.',
    placeholder: 'e.g. my watch to my brother'
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Executors',
    description: 'The people who carry out the will. At least one is needed; two is usual. They must be 18 or over and willing to act.'
  });
  card.appendChild(textInput({
    label: 'First executor — name', section: 'executors', field: 'executorFirstName',
    placeholder: 'Full name'
  }));
  card.appendChild(textInput({
    label: 'First executor — relationship', section: 'executors', field: 'executorFirstRelationship',
    placeholder: 'e.g. daughter, solicitor'
  }));
  card.appendChild(textInput({
    label: 'Second executor — name', section: 'executors', field: 'executorSecondName',
    placeholder: 'Full name'
  }));
  card.appendChild(textInput({
    label: 'Second executor — relationship', section: 'executors', field: 'executorSecondRelationship',
    placeholder: 'e.g. friend'
  }));
  card.appendChild(radioGroup({
    label: 'Is every executor 18 or over and willing to act?', section: 'executors',
    field: 'executorsAdultConfirmed', options: yesNo
  }));
  return card;
}

const ORDINAL_LABELS = { First: 'First', Second: 'Second', Third: 'Third', Fourth: 'Fourth' };

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Beneficiaries and residuary estate',
    description: 'Who inherits. Give each beneficiary a percentage share of the residuary estate, and the shares must total 100%.'
  });
  for (const o of ORDINALS) {
    const n = ORDINAL_LABELS[o];
    card.appendChild(textInput({
      label: `${n} beneficiary — name`, section: 'beneficiaries', field: `beneficiary${o}Name`,
      placeholder: 'Full name or charity name'
    }));
    card.appendChild(selectInput({
      label: `${n} beneficiary — relationship`, section: 'beneficiaries',
      field: `beneficiary${o}Relationship`, options: relationshipOptions
    }));
    card.appendChild(textInput({
      label: `${n} beneficiary — share of the residuary estate (%)`, section: 'beneficiaries',
      field: `beneficiary${o}SharePercent`, type: 'number', min: 0, max: 100
    }));
    card.appendChild(radioGroup({
      label: `${n} beneficiary — under 18?`, section: 'beneficiaries',
      field: `beneficiary${o}IsMinor`, options: yesNo
    }));
    card.appendChild(radioGroup({
      label: `${n} beneficiary — trustee appointed to hold the share until they are 18?`, section: 'beneficiaries',
      field: `beneficiary${o}HasTrustee`, options: yesNo
    }));
  }
  card.appendChild(readOnlyReadout({
    label: 'Total of shares',
    id: 'shares-total-readout',
    render: () => renderSharesTotal()
  }));
  card.appendChild(radioGroup({
    label: 'Does the will give away the residuary estate (everything not otherwise left)?', section: 'beneficiaries',
    field: 'residuaryClause', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Have you considered who might claim reasonable provision under the Inheritance (Provision for Family and Dependants) Act 1975?', section: 'beneficiaries',
    field: 'dependantsConsidered', options: yesNo,
    hint: 'A spouse, civil partner, former partner, partner of two years or more, a child, or someone you maintain can apply to court within six months of probate if left without reasonable provision.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Guardians and funeral wishes',
    description: 'Who looks after children under 18, and what the testator would like for their funeral.'
  });
  card.appendChild(radioGroup({
    label: 'Does the testator have children under 18?', section: 'family',
    field: 'hasChildrenUnder18', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Guardian for children under 18', section: 'family', field: 'guardianName',
    placeholder: 'Full name', hint: 'Guardians take over only if no parent with parental responsibility survives.'
  }));
  card.appendChild(selectInput({
    label: 'Funeral wishes', section: 'family', field: 'funeralWishes', options: funeralOptions,
    hint: 'Not legally binding on the executors.'
  }));
  card.appendChild(textArea({
    label: 'Funeral wishes — notes', section: 'family', field: 'funeralWishesNote',
    placeholder: 'e.g. a woodland burial; no flowers'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Signing and witnessing',
    description: 'Wills Act 1837 s.9: the will is in writing, signed by the testator in the presence of two independent adult witnesses present together, who then each sign. A witness, or their spouse or civil partner, must not be a beneficiary.'
  });
  card.appendChild(selectInput({
    label: 'Status', section: 'execution', field: 'executionStatus', options: executionStatusOptions
  }));
  card.appendChild(textInput({
    label: 'Date of will', section: 'execution', field: 'dateOfWill', type: 'date'
  }));
  card.appendChild(radioGroup({
    label: 'Is the will in writing?', section: 'execution', field: 'willInWriting', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Did the testator sign (or acknowledge their signature) intending it to give effect to the will?', section: 'execution',
    field: 'testatorSigned', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Were both witnesses present together when the testator signed or acknowledged?', section: 'execution',
    field: 'witnessesPresentTogether', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Did each witness then sign in the testator’s presence?', section: 'execution',
    field: 'witnessesSigned', options: yesNo
  }));
  for (const o of ['First', 'Second']) {
    card.appendChild(textInput({
      label: `${o} witness — name`, section: 'execution', field: `witness${o}Name`,
      placeholder: 'Full name'
    }));
    card.appendChild(radioGroup({
      label: `${o} witness — 18 or over?`, section: 'execution',
      field: `witness${o}Over18`, options: yesNo
    }));
    card.appendChild(radioGroup({
      label: `${o} witness — is the witness, or their spouse or civil partner, a beneficiary?`, section: 'execution',
      field: `witness${o}IsBeneficiaryOrSpouse`, options: yesNo
    }));
  }
  card.appendChild(textArea({
    label: 'Drafter note', section: 'execution', field: 'drafterNote',
    placeholder: 'Free-text note from the person preparing the will.'
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and validity',
    description: 'The live validity class, the total of the beneficiary shares, and the count of witnesses. Submit to generate the full report. This is documentation support, not legal advice.'
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

function renderSharesTotal() {
  const total = sharesTotalPercent(state);
  const ok = Math.abs(total - 100) <= 0.005;
  return `<strong>${esc(total)}%</strong> <span class="muted">${ok ? '— shares total 100%' : '— shares must total 100%'}</span>`;
}

/** Render the live status: validity badge, shares total, witness count. */
function renderLiveStatus() {
  const result = validateWill(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const shares = `<strong>Shares total:</strong> ${esc(result.sharesTotalPercent)}%`;
  const witnessText = `<strong>Witnesses named:</strong> ${esc(result.witnessCount)}`;
  const risk = result.formalityRisk
    ? `<span class="muted">— formality risk indicated</span>`
    : `<span class="muted">— no formality risk found</span>`;
  return `${badge} ${shares} ${witnessText} ${risk}`;
}

function refreshLiveStatus() {
  const el = document.getElementById('live-status-readout');
  if (el) el.innerHTML = renderLiveStatus();
  const sh = document.getElementById('shares-total-readout');
  if (sh) sh.innerHTML = renderSharesTotal();
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
  testator: [['testatorName'], ['dateOfBirth'], ['domicile'], ['maritalStatus'], ['hasMentalCapacity'], ['madeVoluntarily']],
  estate: [['estateValueBand'], ['estateOtherJurisdictions']],
  executors: [['executorFirstName', 'executorSecondName']],
  beneficiaries: [['beneficiaryFirstName'], ['beneficiaryFirstSharePercent'], ['residuaryClause'], ['dependantsConsidered']],
  family: [['hasChildrenUnder18'], ['funeralWishes']],
  execution: [['executionStatus'], ['witnessFirstName'], ['witnessSecondName']]
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

function cell(v) {
  return v ? esc(v) : '<span class="muted">—</span>';
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    validityClass, formalityRisk, sharesTotalPercent: sharesTotal, witnessCount: witnesses,
    flaggedIssues, timestamp
  } = lastResult;

  const beneficiaryRows = beneficiaries(state).map((b) => `
    <tr>
      <th scope="row">${esc(b.name)}</th>
      <td>${cell(relationshipLabel(b.relationship))}</td>
      <td>${b.share === null || b.share === undefined ? '<span class="muted">—</span>' : esc(b.share) + '%'}</td>
      <td>${b.isMinor === 'yes' ? (b.hasTrustee === 'yes' ? 'Under 18, trustee appointed' : 'Under 18, no trustee') : cell(yesNoLabel(b.isMinor) ? 'Adult' : '')}</td>
    </tr>
  `).join('');

  const partiesRows = [
    ['Executors', [state.executors.executorFirstName, state.executors.executorSecondName].filter(nonEmpty).join(', ')],
    ['Witnesses', witnessesText()],
    ['Guardian', state.family.guardianName],
    ['Funeral wishes', funeralWishesLabel(state.family.funeralWishes) + (state.family.funeralWishesNote ? ': ' + state.family.funeralWishesNote : '')],
    ['Status', executionStatusLabel(state.execution.executionStatus)],
    ['Domicile', domicileLabel(state.testator.domicile)],
    ['Marital status', maritalStatusLabel(state.testator.maritalStatus)],
    ['Estate value', estateValueBandLabel(state.estate.estateValueBand)]
  ].map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${cell(v)}</td></tr>`).join('');

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No formality, completeness, or awareness flags raised.</p>`
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
    guidance = `<p>A formality risk is indicated, so this will is classified <strong>formality risk</strong>. Fix the high-priority flags below before signing. A will that fails the Wills Act 1837 formalities (age 18 or over, in writing, signed in the presence of two independent adult witnesses present together) may be invalid, and a gift to a witness fails. This is a documentation finding, not legal advice.</p>`;
  } else if (validityClass === 'incomplete') {
    guidance = `<p>This will record is <strong>incomplete</strong>: required content is missing, such as an executor, a beneficiary, a residuary clause, shares that total 100%, or a trustee for a minor beneficiary. Complete the flagged items before signing.</p>`;
  } else {
    const signed = state.execution.executionStatus === 'signed';
    guidance = `<p>This will record is <strong>valid</strong> as a draft: ${signed ? 'it is recorded as signed and witnessed, and no known formality or content problem is flagged.' : 'no known formality or content problem is flagged, so it is ready to sign in front of two independent adult witnesses.'} This is a completeness finding and does <strong>not</strong> confirm the will is legally valid. Consider asking a solicitor to review it, particularly if the estate is large, the family is complex, or any property is abroad.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United Kingdom Last Will and Testament — Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Validity class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        ${formalityRisk ? '<span class="risk-badge risk-high">Formality risk indicated</span>' : ''}
      </div>

      <p><strong>Testator:</strong> ${state.testator.testatorName ? esc(state.testator.testatorName) : '<span class="muted">Not recorded</span>'}
        &nbsp; <strong>Shares total:</strong> ${esc(sharesTotal)}%
        &nbsp; <strong>Witnesses named:</strong> ${esc(witnesses)}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Beneficiaries</h3>
      ${beneficiaryRows
        ? `<table class="subscales">
        <thead><tr><th scope="col">Name</th><th scope="col">Relationship</th><th scope="col">Share</th><th scope="col">Age note</th></tr></thead>
        <tbody>${beneficiaryRows}</tbody>
      </table>`
        : '<p class="muted">No beneficiary named.</p>'}

      <h3>Will summary</h3>
      <table class="subscales">
        <tbody>${partiesRows}</tbody>
      </table>

      <h3>Next steps</h3>
      <p>Print the will, then the testator signs (or acknowledges their signature) in front of two independent adult witnesses who are present together; each witness then signs. Do not staple or alter it afterwards. Keep it safe and tell the executors where it is. To change it later, make a codicil or a new will, signed and witnessed the same way. A will is revoked by marriage or a civil partnership unless it was made in expectation of it, and a divorce changes how it is read.</p>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted"><strong>Disclaimer.</strong> This tool is documentation support. It is not legal advice, does not create a will, and cannot confirm that a will is valid. Take advice from a solicitor or a regulated will writer if your situation is not straightforward.</p>

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function witnessesText() {
  return witnesses(state).map((w) => w.name).join(', ');
}

function submitForm() {
  const _errors = validateForm();
  if (_errors.length > 0) return;
  const result = validateWill(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    validityClass: result.validityClass,
    formalityRisk: result.formalityRisk,
    sharesTotalPercent: result.sharesTotalPercent,
    witnessCount: result.witnessCount,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh will record?')) return;
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
  { step: 1, section: 'testator',      title: 'Testator' },
  { step: 2, section: 'estate',        title: 'Estate' },
  { step: 3, section: 'executors',     title: 'Executors' },
  { step: 4, section: 'beneficiaries', title: 'Beneficiaries' },
  { step: 5, section: 'family',        title: 'Guardians and funeral' },
  { step: 6, section: 'execution',     title: 'Signing' },
  { step: 7, section: 'summary',       title: 'Summary' }
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
