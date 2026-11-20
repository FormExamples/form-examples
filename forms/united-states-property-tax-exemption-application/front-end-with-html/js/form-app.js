import { detectFlaggedIssues } from './flags.js';
import { gradeApplication } from './grader.js';
import { emptyApplication, eligibilityClassClass, eligibilityClassLabel, exemptionLabel, priorityLabel } from './types.js';
import { STATE_RULES, claimedExemptions, exemptionStatus, stateKnown, stateRule } from './rules.js';

// United States Property Tax Exemption Application -- wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the eight sections; a sticky
// progress summary reflects how many fields are answered, and a live readout
// shows the running eligibility class (likely eligible / incomplete / likely
// ineligible), the state filing deadline, and whether the filing is late.
// Submission runs the pure engine (classification plus flagged issues) and
// renders an inline report. State is persisted to localStorage so a partial
// fill survives a reload.
//
// DOCUMENTATION SUPPORT, NOT LEGAL OR TAX ADVICE. The engine checks
// completeness and plausible eligibility under the state's published rule;
// the county assessor or state agency decides.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-states-property-tax-exemption-application.front-end-with-html.v1';

/** @returns {import('./types.js').PropertyTaxApplication} */
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

/** @param {import('./types.js').PropertyTaxApplication} state */
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

/** @type {import('./types.js').PropertyTaxApplication} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-states-property-tax-exemption-application',
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

/**
 * Set a deeply-nested field on the state and persist.
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

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];
const propertyTypeOptions = [
  { value: 'single-family', label: 'Single-family home' },
  { value: 'condominium', label: 'Condominium' },
  { value: 'manufactured-home', label: 'Manufactured home' },
  { value: 'multi-unit', label: 'Multi-unit building' },
  { value: 'other', label: 'Other' }
];
const ownershipOptions = [
  { value: 'sole', label: 'Sole owner' },
  { value: 'joint', label: 'Joint owners' },
  { value: 'trust', label: 'Held in a trust' },
  { value: 'life-estate', label: 'Life estate' },
  { value: 'contract-buyer', label: 'Contract buyer' },
  { value: 'other', label: 'Other' }
];
const applicationTypeOptions = [
  { value: 'initial', label: 'Initial application' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'late', label: 'Late filing (relief requested)' }
];
const stateOptions = Object.keys(STATE_RULES).map((k) => ({ value: k, label: `${k} - ${STATE_RULES[k].name}` }));

// ----------------------------------------------------------------------
// Step definitions (data-driven: one entry per wizard section)
// ----------------------------------------------------------------------

/**
 * kind: text | date | number | select | radio | textarea
 */
const STEPS = [
  {
    section: 'applicant', title: 'Applicant',
    description: 'The property owner applying. Age is measured on the assessment date.',
    fields: [
      { kind: 'text', field: 'applicantName', label: 'Applicant full legal name', required: true },
      { kind: 'date', field: 'dateOfBirth', label: 'Date of birth' },
      { kind: 'number', field: 'ageOnAssessmentDate', label: 'Age on the assessment date', min: 0, max: 130, hint: 'Whole years on the assessment (lien) date, usually January 1.' },
      { kind: 'textarea', field: 'mailingAddress', label: 'Mailing address', hint: 'Where the assessor sends notices.' }
    ]
  },
  {
    section: 'property', title: 'Property and occupancy',
    description: 'The parcel, how you hold title, and your ownership and occupancy as of the assessment date.',
    fields: [
      { kind: 'select', field: 'state', label: 'State', options: stateOptions, required: true, hint: 'The state selects the rule set. States outside the list use a default rule and raise a verify flag.' },
      { kind: 'text', field: 'county', label: 'County', required: true },
      { kind: 'text', field: 'parcelNumber', label: 'Parcel number (APN or account number)', required: true },
      { kind: 'textarea', field: 'propertyAddress', label: 'Property address', required: true },
      { kind: 'select', field: 'propertyType', label: 'Property type', options: propertyTypeOptions },
      { kind: 'select', field: 'ownershipType', label: 'How you hold title', options: ownershipOptions },
      { kind: 'radio', field: 'ownerOnAssessmentDate', label: 'Did you own the property on the assessment date?', options: yesNo },
      { kind: 'radio', field: 'occupiedAsPrimaryResidence', label: 'Was it your primary residence on the assessment date?', options: yesNo },
      { kind: 'date', field: 'occupancyStartDate', label: 'Date you began living there as your primary residence' },
      { kind: 'radio', field: 'otherHomesteadClaimed', label: 'Do you claim a homestead exemption on any other property?', options: yesNo, hint: 'Only one primary residence may carry a homestead exemption.' }
    ]
  },
  {
    section: 'exemptions', title: 'Exemptions claimed',
    description: 'The homestead exemption and any related relief. Each is tested against the state rule.',
    fields: [
      { kind: 'radio', field: 'claimHomestead', label: 'General homestead exemption', options: yesNo },
      { kind: 'radio', field: 'claimSenior', label: 'Senior (age-based) exemption or relief', options: yesNo },
      { kind: 'radio', field: 'claimDisability', label: 'Disability exemption', options: yesNo },
      { kind: 'radio', field: 'claimVeteran', label: 'Disabled-veteran exemption', options: yesNo },
      { kind: 'number', field: 'veteranDisabilityPercent', label: 'VA service-connected disability rating (%)', min: 0, max: 100, conditional: 'exemptions.claimVeteran=yes' },
      { kind: 'radio', field: 'claimCircuitBreaker', label: 'Circuit-breaker (income-based) property tax relief', options: yesNo }
    ]
  },
  {
    section: 'income', title: 'Household income',
    description: 'Needed for the income-tested relief (senior, disability, circuit-breaker) where the state sets a limit.',
    fields: [
      { kind: 'number', field: 'householdIncomeDollars', label: 'Total household income (whole US dollars)', min: 0, hint: 'All owners and resident spouses, for the income year below.' },
      { kind: 'number', field: 'incomeTaxYear', label: 'Income year', min: 1990, max: 2100 }
    ]
  },
  {
    section: 'documents', title: 'Proof documents',
    description: 'Mark each document you are attaching. The documents required depend on the exemptions claimed.',
    fields: [
      { kind: 'radio', field: 'proofOfOwnership', label: 'Proof of ownership (deed or tax bill)', options: yesNo },
      { kind: 'radio', field: 'proofOfResidency', label: 'Proof of residency (driver licence, voter or vehicle registration)', options: yesNo },
      { kind: 'radio', field: 'proofOfAge', label: 'Proof of age', options: yesNo },
      { kind: 'radio', field: 'proofOfIncome', label: 'Proof of income (tax return or benefit letter)', options: yesNo },
      { kind: 'radio', field: 'proofOfDisability', label: 'Proof of disability or VA rating letter', options: yesNo }
    ]
  },
  {
    section: 'filing', title: 'Filing and deadline',
    description: 'The assessment year and the date you file. The state deadline is derived from the state rule.',
    fields: [
      { kind: 'number', field: 'assessmentYear', label: 'Assessment (tax) year the exemption is for', min: 2000, max: 2100, required: true },
      { kind: 'date', field: 'filingDate', label: 'Filing date', required: true },
      { kind: 'select', field: 'applicationType', label: 'Application type', options: applicationTypeOptions }
    ]
  },
  {
    section: 'appeal', title: 'Assessment appeal basics',
    description: 'An exemption lowers the taxable value; it does not contest the assessed value. Appeals have their own, shorter deadlines.',
    fields: [
      { kind: 'radio', field: 'appealRequested', label: 'Do you also want guidance on appealing the assessed value?', options: yesNo },
      { kind: 'date', field: 'noticeOfValueDate', label: 'Date on the notice of assessed value', conditional: 'appeal.appealRequested=yes' },
      { kind: 'radio', field: 'appealFiled', label: 'Have you already filed an appeal?', options: yesNo, conditional: 'appeal.appealRequested=yes' }
    ]
  },
  {
    section: 'declaration', title: 'Declaration',
    description: 'A false statement on this application can lead to back taxes, penalties and prosecution.',
    fields: [
      { kind: 'radio', field: 'penaltyAcknowledged', label: 'I understand the penalty for knowingly making a false statement', options: yesNo },
      { kind: 'radio', field: 'signedByApplicant', label: 'I declare under penalty of perjury that the information is true and complete', options: yesNo },
      { kind: 'date', field: 'signatureDate', label: 'Date signed' }
    ]
  }
];

function buildField(section, f) {
  const base = { section, field: f.field, label: f.label, hint: f.hint, required: f.required, placeholder: f.placeholder };
  let el;
  switch (f.kind) {
    case 'select': el = selectInput({ ...base, options: f.options }); break;
    case 'radio': el = radioGroup({ ...base, options: f.options }); break;
    case 'textarea': el = textArea({ ...base, rows: 2 }); break;
    case 'number': el = textInput({ ...base, type: 'number', min: f.min, max: f.max }); break;
    case 'date': el = textInput({ ...base, type: 'date' }); break;
    default: el = textInput(base);
  }
  if (f.conditional) {
    const host = document.createElement('div');
    host.setAttribute('data-conditional', f.conditional);
    host.appendChild(el);
    return host;
  }
  return el;
}

function renderStep(index) {
  const def = STEPS[index];
  const card = sectionCard({ stepNumber: index + 1, title: def.title, description: def.description });
  for (const f of def.fields) card.appendChild(buildField(def.section, f));
  return card;
}

function renderSummaryStep() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Summary and eligibility',
    description: 'The live eligibility class, the state filing deadline, and whether the filing is late. Submit to generate the full report.'
  });
  card.appendChild(readOnlyReadout({
    label: 'Live eligibility status',
    id: 'live-status-readout',
    render: () => renderLiveStatus()
  }));
  return card;
}

// ----------------------------------------------------------------------
// Live readout
// ----------------------------------------------------------------------

function renderLiveStatus() {
  const result = gradeApplication(state);
  const badge =
    `<span class="risk-badge ${eligibilityClassClass(result.eligibilityClass)}">${esc(eligibilityClassLabel(result.eligibilityClass))}</span>`;
  const deadline = result.filingDeadline
    ? `<strong>Filing deadline:</strong> ${esc(result.filingDeadline)}${result.filedLate ? ' <span class="muted">- filed late</span>' : ''}`
    : '<span class="muted">Filing deadline not determinable (state or year missing, or no statewide date)</span>';
  const qualifying = result.qualifyingExemptions.length
    ? `<span class="muted">- qualifying: ${esc(result.qualifyingExemptions.map(exemptionLabel).join(', '))}</span>`
    : '<span class="muted">- no claimed exemption passes yet</span>';
  return `${badge} ${deadline} ${qualifying}`;
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

// Each section maps to progress "slots"; a slot counts as answered when ANY of
// its fields is answered.
const STEP_SLOTS = {
  applicant: [['applicantName'], ['ageOnAssessmentDate', 'dateOfBirth']],
  property: [['state'], ['county'], ['parcelNumber'], ['propertyAddress'], ['ownerOnAssessmentDate'], ['occupiedAsPrimaryResidence'], ['otherHomesteadClaimed']],
  exemptions: [['claimHomestead'], ['claimSenior'], ['claimDisability'], ['claimVeteran'], ['claimCircuitBreaker']],
  income: [['householdIncomeDollars']],
  documents: [['proofOfOwnership'], ['proofOfResidency']],
  filing: [['assessmentYear'], ['filingDate']],
  appeal: [['appealRequested']],
  declaration: [['penaltyAcknowledged'], ['signedByApplicant'], ['signatureDate']]
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
      if (slot.some((field) => isAnswered(section, field))) {
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

function dash(v) {
  return v !== null && v !== undefined && v !== '' ? esc(v) : '<span class="muted">-</span>';
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { eligibilityClass, filingDeadline, filedLate, qualifyingExemptions, flaggedIssues, timestamp } = lastResult;
  const rule = stateRule(state);

  const claimed = claimedExemptions(state);
  const exemptionRows = claimed.length === 0
    ? '<tr><td colspan="3"><span class="muted">No exemption claimed</span></td></tr>'
    : claimed.map((id) => {
      const st = exemptionStatus(state, id);
      const label = st.status === 'pass' ? 'Passes the state test' : st.status === 'fail' ? `Fails (${esc(st.reason)})` : `Needs an answer (${esc(st.reason)})`;
      return `<tr><th scope="row">${esc(exemptionLabel(id))}</th><td>${label}</td><td>${qualifyingExemptions.includes(id) ? 'Qualifies' : '<span class="muted">-</span>'}</td></tr>`;
    }).join('');

  const flagsList = flaggedIssues.length === 0
    ? '<p class="muted">No flags raised.</p>'
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
  if (eligibilityClass === 'likely-ineligible') {
    guidance = '<p>The application is classified <strong>likely ineligible</strong>: a base requirement (ownership, occupancy, a single homestead, the filing deadline) or every claimed exemption fails the state test. Review the high-priority flags before filing. This is a documentation finding, not a decision; the assessor decides.</p>';
  } else if (eligibilityClass === 'incomplete') {
    guidance = '<p>The application is <strong>incomplete</strong>: identification, assessment-date answers, an exemption claim, proof documents or the signed declaration are missing. Resolve the flags below before filing.</p>';
  } else {
    guidance = '<p>The application is <strong>likely eligible</strong>: it is complete, signed, filed on time, and each claimed exemption passes the encoded state test. This is not an approval; the county assessor decides and may ask for more evidence.</p>';
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Property Tax Exemption Application - Eligibility Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${eligibilityClassClass(eligibilityClass)}">
        <div>
          <span class="risk-banner-label">Eligibility class</span>
          <span class="risk-banner-value">${esc(eligibilityClassLabel(eligibilityClass))}</span>
        </div>
        ${filedLate ? '<span class="risk-badge risk-high">Filed after the deadline</span>' : ''}
      </div>

      <p><strong>State rule:</strong> ${esc(rule.name)}${stateKnown(state) ? '' : ' (default rule)'} - ${esc(rule.homestead)}</p>
      <p><strong>Filing deadline:</strong> ${filingDeadline ? esc(filingDeadline) : '<span class="muted">none derived</span>'}. ${esc(rule.deadlineNote)}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Exemptions claimed</h3>
      <table class="subscales">
        <thead><tr><th scope="col">Exemption</th><th scope="col">State test</th><th scope="col">Result</th></tr></thead>
        <tbody>${exemptionRows}</tbody>
      </table>

      <h3>Property</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Applicant</th><td>${dash(state.applicant.applicantName)}</td></tr>
          <tr><th scope="row">Parcel</th><td>${dash(state.property.parcelNumber)} (${dash(state.property.county)} County, ${dash(state.property.state)})</td></tr>
          <tr><th scope="row">Address</th><td>${dash(state.property.propertyAddress)}</td></tr>
          <tr><th scope="row">Filed</th><td>${dash(state.filing.filingDate)} for assessment year ${dash(state.filing.assessmentYear)}</td></tr>
        </tbody>
      </table>

      <h3>Flagged issues (${flaggedIssues.length})</h3>
      ${flagsList}

      <p class="muted">Documentation support, not legal or tax advice. The county assessor or state agency decides the application.</p>

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
  const result = gradeApplication(state);
  const flaggedIssues = detectFlaggedIssues(state);
  lastResult = {
    eligibilityClass: result.eligibilityClass,
    filingDeadline: result.filingDeadline,
    filedLate: result.filedLate,
    qualifyingExemptions: result.qualifyingExemptions,
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
  { step: 2, section: 'property',    title: 'Property' },
  { step: 3, section: 'exemptions',  title: 'Exemptions' },
  { step: 4, section: 'income',      title: 'Income' },
  { step: 5, section: 'documents',   title: 'Proof' },
  { step: 6, section: 'filing',      title: 'Filing' },
  { step: 7, section: 'appeal',      title: 'Appeal' },
  { step: 8, section: 'declaration', title: 'Declaration' },
  { step: 9, section: 'summary',     title: 'Summary' }
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

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  for (let i = 0; i < STEPS.length; i++) host.appendChild(renderStep(i));
  host.appendChild(renderSummaryStep());
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
