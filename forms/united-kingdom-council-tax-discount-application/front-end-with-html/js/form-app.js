import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { disqualifiers, missingItems } from './rules.js';
import { adaptationLabel, claimTypeLabel, eligibilityClassClass, eligibilityClassLabel, emptyApplication, emptyOccupant, indicativeOutcomeLabel, liableRoleLabel, occupantStatusLabel, priorityLabel } from './types.js';

// United Kingdom Council Tax Discount Application — wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the six sections; a sticky
// top-of-page progress summary reflects how many fields have been answered, and
// a live readout shows the running eligibility class (likely eligible /
// incomplete / likely ineligible), the counted adults and the indicative
// outcome. Submission runs the pure engine (eligibility classification plus
// flagged issues) and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload.
//
// This is a COMPLETENESS and ELIGIBILITY pre-check. ELIGIBILITY IS DECIDED BY
// THE BILLING AUTHORITY, not by this form.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-council-tax-discount-application.front-end-with-html.v1';

/** @returns {import('./types.js').Application} */
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
  const occupants = fresh.household && Array.isArray(fresh.household.occupants) ? fresh.household.occupants : [];
  fresh.household.occupants = occupants
    .filter((o) => o && typeof o === 'object')
    .map((o) => ({ ...emptyOccupant(), ...o }));
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

/** @param {import('./types.js').Application} state */
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

/** @type {import('./types.js').Application} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets (mirrors the existing window.__A11Y_DRAFT_KEY__
// pattern above) -- keeps the actual export/import logic in one form-agnostic
// module while each form-app.js owns its own private `state`.
window.__FORM_STATE__ = {
  slug: 'united-kingdom-council-tax-discount-application',
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

const TOTAL_STEPS = 6;

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
// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const claimTypeOptions = [
  'single-person-discount', 'all-disregarded-discount', 'student-exemption',
  'severe-mental-impairment', 'disabled-band-reduction', 'care-leaver-relief',
  'council-tax-reduction'
].map((value) => ({ value, label: claimTypeLabel(value) }));

const occupantStatusOptions = [
  'counted-adult', 'full-time-student', 'severely-mentally-impaired', 'under-18',
  'apprentice', 'education-18-19', 'live-in-carer', 'care-leaver', 'other-disregarded'
].map((value) => ({ value, label: occupantStatusLabel(value) }));

const bandOptions = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((value) => ({ value, label: `Band ${value}` }));

const liableRoleOptions = ['owner-occupier', 'tenant', 'landlord', 'other']
  .map((value) => ({ value, label: liableRoleLabel(value) }));

const adaptationOptions = ['extra-bathroom', 'extra-kitchen', 'extra-room', 'wheelchair-space', 'none']
  .map((value) => ({ value, label: adaptationLabel(value) }));

// ----------------------------------------------------------------------
// Roster row builders (the occupant roster is an array, not a section)
// ----------------------------------------------------------------------

function occupantInput(index, field, opts) {
  const id = `occupant-${index}-${field}`;
  const occupant = state.household.occupants[index];
  const value = occupant[field];
  const type = opts.type || 'text';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <input id="${id}" name="${id}" type="${type}" class="${lilyInputClass(type)}" value="${esc(value ?? '')}"${opts.placeholder ? ` placeholder="${esc(opts.placeholder)}"` : ''}>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    occupant[field] = input.value === '' && type === 'date' ? null : input.value;
    saveState(state);
    updateProgress();
    refreshLiveStatus();
  });
  return wrapper;
}

function occupantSelect(index, field, opts) {
  const id = `occupant-${index}-${field}`;
  const occupant = state.household.occupants[index];
  const current = occupant[field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const optionsHtml = [
    '<option value="">— Select —</option>',
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`)
  ].join('');
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select">${optionsHtml}</select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    occupant[field] = sel.value;
    saveState(state);
    updateProgress();
    refreshLiveStatus();
  });
  return wrapper;
}

function renderRoster(host) {
  host.innerHTML = '';
  state.household.occupants.forEach((_, index) => {
    const row = document.createElement('fieldset');
    row.className = 'field occupant-row';
    row.innerHTML = `<legend class="label">Occupant ${index + 1}</legend>`;
    row.appendChild(occupantInput(index, 'name', { label: 'Full name', placeholder: 'Name of the occupant' }));
    row.appendChild(occupantInput(index, 'birthDate', { label: 'Date of birth', type: 'date' }));
    row.appendChild(occupantSelect(index, 'status', { label: 'Status', options: occupantStatusOptions }));
    row.appendChild(occupantSelect(index, 'evidenceHeld', { label: 'Evidence held for this status?', options: yesNo }));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button';
    remove.dataset.variant = 'secondary';
    remove.textContent = `Remove occupant ${index + 1}`;
    remove.addEventListener('click', () => {
      state.household.occupants.splice(index, 1);
      saveState(state);
      renderRoster(host);
      updateProgress();
      refreshLiveStatus();
    });
    row.appendChild(remove);
    host.appendChild(row);
  });
}

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Claim',
    description: 'Which Council Tax discount, exemption or reduction you are applying for, to which council, and from when.'
  });
  card.appendChild(selectInput({
    label: 'What are you applying for?', section: 'claim', field: 'claimType',
    options: claimTypeOptions, required: true,
    hint: 'Single person discount is 25% off for one counted adult. If everyone in the home is disregarded (for example all students or severely mentally impaired) it is 50% off. A home where everyone is a full-time student is exempt.'
  }));
  card.appendChild(textInput({
    label: 'Billing authority (your local council in England)', section: 'claim', field: 'billingAuthority',
    placeholder: 'e.g. Leeds City Council'
  }));
  card.appendChild(textInput({
    label: 'Council Tax account reference', section: 'claim', field: 'accountReference',
    hint: 'Printed on your bill, if you have one.', placeholder: 'e.g. 123456789'
  }));
  card.appendChild(textInput({
    label: 'Date of this application', section: 'claim', field: 'applicationDate', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Date the discount should start from', section: 'claim', field: 'effectiveDate',
    type: 'date',
    hint: 'A date before the application date asks for backdating, which is at the council\'s discretion.'
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Applicant and property',
    description: 'The person who pays the Council Tax and the property the bill is for.'
  });
  card.appendChild(textInput({
    label: 'Your full name', section: 'applicant', field: 'name', required: true,
    placeholder: 'Name on the Council Tax bill'
  }));
  card.appendChild(textInput({
    label: 'Your date of birth', section: 'applicant', field: 'birthDate', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Email', section: 'applicant', field: 'email', type: 'email'
  }));
  card.appendChild(textInput({
    label: 'Phone', section: 'applicant', field: 'phone', type: 'tel'
  }));
  card.appendChild(selectInput({
    label: 'Your own status', section: 'applicant', field: 'status',
    options: occupantStatusOptions,
    hint: 'Choose "Adult (counts)" unless you are yourself a disregarded person, such as a full-time student.'
  }));
  card.appendChild(textArea({
    label: 'Property address', section: 'property', field: 'addressAsFullText',
    placeholder: 'Address the Council Tax bill is for'
  }));
  card.appendChild(textInput({
    label: 'Property postcode', section: 'property', field: 'postcode',
    placeholder: 'e.g. LS1 1UR'
  }));
  card.appendChild(selectInput({
    label: 'Council Tax band', section: 'property', field: 'band', options: bandOptions,
    hint: 'Printed on your bill, or look it up with the Valuation Office Agency.'
  }));
  card.appendChild(radioGroup({
    label: 'Is this your main home?', section: 'property', field: 'mainResidence', options: yesNo
  }));
  card.appendChild(selectInput({
    label: 'Your role in paying the Council Tax', section: 'property', field: 'liableRole',
    options: liableRoleOptions
  }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Household',
    description: 'Everyone else who lives in the property. Disregarded people (students, severely mentally impaired people, apprentices, under 18s and others) do not count when working out the discount.'
  });
  card.appendChild(radioGroup({
    label: 'Does anyone other than you live in the property?', section: 'household',
    field: 'othersLive', options: yesNo
  }));
  const rosterHost = document.createElement('div');
  rosterHost.id = 'roster';
  rosterHost.setAttribute('data-conditional', 'household.othersLive=yes');
  const list = document.createElement('div');
  list.id = 'roster-list';
  rosterHost.appendChild(list);
  const add = document.createElement('button');
  add.type = 'button';
  add.id = 'add-occupant-btn';
  add.className = 'button';
  add.dataset.variant = 'secondary';
  add.textContent = 'Add an occupant';
  add.addEventListener('click', () => {
    state.household.occupants.push(emptyOccupant());
    saveState(state);
    renderRoster(list);
    updateProgress();
    refreshLiveStatus();
  });
  rosterHost.appendChild(add);
  card.appendChild(rosterHost);
  renderRoster(list);
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Evidence',
    description: 'Answer the questions for the claim you chose. The council may ask for the documents themselves.'
  });
  card.appendChild(radioGroup({
    label: 'Severe mental impairment: is a certificate from a registered medical practitioner held?',
    section: 'evidence', field: 'smiCertificate', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Severe mental impairment: does the person receive a qualifying benefit?',
    section: 'evidence', field: 'qualifyingBenefit', options: yesNo,
    hint: 'For example Attendance Allowance, the higher rate of the Disability Living Allowance care component, or the Personal Independence Payment daily living component.'
  }));
  card.appendChild(radioGroup({
    label: 'Students: is a certificate from the course provider held?',
    section: 'evidence', field: 'studentCertificate', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Student course length (months)', section: 'evidence', field: 'studentCourseMonths',
    type: 'number', min: 0, max: 120, hint: 'Full-time means at least 12 months.'
  }));
  card.appendChild(textInput({
    label: 'Student study hours a week', section: 'evidence', field: 'studentHoursPerWeek',
    type: 'number', min: 0, max: 80, hint: 'Full-time means at least 21 hours a week (12 hours and 3 months for under-20s studying up to A level).'
  }));
  card.appendChild(selectInput({
    label: 'Disabled band reduction: which adaptation or extra space applies?',
    section: 'evidence', field: 'disabilityAdaptation', options: adaptationOptions
  }));
  card.appendChild(radioGroup({
    label: 'Disabled band reduction: is this the main home of a disabled person?',
    section: 'evidence', field: 'disabledPersonMainHome', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'Apprentices: is an employer declaration held?',
    section: 'evidence', field: 'apprenticeDeclaration', options: yesNo,
    hint: 'Paid no more than £195 a week, on training leading to an Ofqual-accredited qualification.'
  }));
  card.appendChild(radioGroup({
    label: 'Care leavers: is proof from the local authority that looked after you held?',
    section: 'evidence', field: 'careLeaverProof', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Care leaver age (years)', section: 'evidence', field: 'careLeaverAgeYears',
    type: 'number', min: 0, max: 120
  }));
  card.appendChild(textArea({
    label: 'Supporting documents', section: 'evidence', field: 'notes',
    placeholder: 'List the documents you will send.'
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Declaration',
    description: 'Please read each statement and answer yes to confirm.'
  });
  card.appendChild(radioGroup({
    label: 'I declare that the information I have given is true and complete.',
    section: 'declaration', field: 'declaredTrue', options: yesNo
  }));
  card.appendChild(radioGroup({
    label: 'I will tell the council within 21 days of any change that affects this discount.',
    section: 'declaration', field: 'agreesToReportChanges', options: yesNo,
    hint: 'For example someone moving in, a student finishing a course, or a change of status.'
  }));
  card.appendChild(radioGroup({
    label: 'I understand that giving false information can lead to a penalty and prosecution, and that a discount I should not have had must be repaid.',
    section: 'declaration', field: 'fraudWarningAcknowledged', options: yesNo
  }));
  card.appendChild(textInput({
    label: 'Your name (declaration)', section: 'declaration', field: 'declarantName'
  }));
  card.appendChild(textInput({
    label: 'Date of declaration', section: 'declaration', field: 'declarationDate', type: 'date'
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Summary and eligibility',
    description: 'The live eligibility class, the counted adults and the indicative outcome. Submit to generate the full report. The billing authority makes the decision.'
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

/** Render the live status: eligibility badge, counted adults, indicative outcome. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${eligibilityClassClass(result.eligibilityClass)}">${esc(eligibilityClassLabel(result.eligibilityClass))}</span>`;
  const adults = `<strong>Counted adults:</strong> ${result.countedAdults}`;
  const outcome = result.indicativeOutcome !== 'none'
    ? `<span class="muted">— indicative outcome: ${esc(indicativeOutcomeLabel(result.indicativeOutcome))}</span>`
    : `<span class="muted">— no discount indicated yet</span>`;
  return `${badge} ${adults} ${outcome}`;
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
  claim: [['claimType'], ['billingAuthority'], ['effectiveDate']],
  applicant: [['name'], ['birthDate']],
  property: [['postcode'], ['band'], ['mainResidence']],
  household: [['othersLive']],
  evidence: [['smiCertificate', 'studentCertificate', 'disabilityAdaptation', 'careLeaverProof', 'apprenticeDeclaration']],
  declaration: [['declaredTrue'], ['agreesToReportChanges'], ['fraudWarningAcknowledged']]
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
    eligibilityClass, countedAdults, indicativeOutcome,
    flaggedIssues, timestamp, reasons
  } = lastResult;

  const dash = '<span class="muted">—</span>';
  const rosterRows = [
    { name: state.applicant.name, status: state.applicant.status || 'counted-adult', evidence: '', who: 'Applicant' },
    ...(state.household.othersLive === 'no' ? [] : state.household.occupants).map((o, i) => (
      { name: o.name, status: o.status || 'counted-adult', evidence: o.evidenceHeld, who: `Occupant ${i + 1}` }
    ))
  ].map((r) => `
    <tr>
      <th scope="row">${esc(r.who)}</th>
      <td>${r.name ? esc(r.name) : dash}</td>
      <td>${esc(occupantStatusLabel(r.status))}</td>
      <td>${r.evidence ? esc(r.evidence) : dash}</td>
    </tr>
  `).join('');

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No eligibility, evidence, or governance flags raised.</p>`
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

  const reasonList = reasons.length === 0
    ? ''
    : `<ul>${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`;

  let guidance;
  if (eligibilityClass === 'likely-ineligible') {
    guidance = `<p>On the answers given, this application is <strong>likely ineligible</strong> for the claim chosen. Check the points below and, if they are right, consider a different claim or contact the billing authority.</p>${reasonList}`;
  } else if (eligibilityClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>. Provide the outstanding items below before sending it to the billing authority.</p>${reasonList}`;
  } else {
    guidance = `<p>This application looks <strong>likely eligible</strong> on the answers given: it is complete and nothing disqualifies it. This is not a decision. Send it, with your evidence, to the billing authority, which decides whether to award it.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Council Tax Discount Application — Eligibility Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${eligibilityClassClass(eligibilityClass)}">
        <div>
          <span class="risk-banner-label">Eligibility class</span>
          <span class="risk-banner-value">${esc(eligibilityClassLabel(eligibilityClass))}</span>
        </div>
      </div>

      <p><strong>Claim:</strong> ${state.claim.claimType ? esc(claimTypeLabel(state.claim.claimType)) : dash}</p>
      <p><strong>Indicative outcome:</strong> ${esc(indicativeOutcomeLabel(indicativeOutcome))}</p>
      <p><strong>Counted adults:</strong> ${countedAdults}</p>

      <p class="disclaimer"><strong>Disclaimer.</strong> Eligibility is decided by the billing authority, not by this form. This result is a pre-check and not a decision, an award or a promise of any discount.</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>Household roster</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Person</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Evidence held</th>
          </tr>
        </thead>
        <tbody>${rosterRows}</tbody>
      </table>

      <h3>Property</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Billing authority</th><td>${state.claim.billingAuthority ? esc(state.claim.billingAuthority) : dash}</td></tr>
          <tr><th scope="row">Postcode</th><td>${state.property.postcode ? esc(state.property.postcode) : dash}</td></tr>
          <tr><th scope="row">Band</th><td>${state.property.band ? esc(state.property.band) : dash}</td></tr>
          <tr><th scope="row">Effective from</th><td>${state.claim.effectiveDate ? esc(state.claim.effectiveDate) : dash}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Send the application and your evidence to the billing authority. You must tell the council within 21 days of any change in your circumstances that affects the discount, such as someone moving in or a student finishing a course. A discount received by mistake must be reported and may have to be repaid, and a penalty can follow.</p>

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
    eligibilityClass: result.eligibilityClass,
    countedAdults: result.countedAdults,
    indicativeOutcome: result.indicativeOutcome,
    flaggedIssues,
    reasons: result.eligibilityClass === 'likely-ineligible'
      ? disqualifiers(state).map((r) => r.message)
      : missingItems(state).map((r) => r.message),
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
  { step: 1, section: 'claim',       title: 'Claim' },
  { step: 2, section: 'applicant',   title: 'Applicant and property' },
  { step: 3, section: 'household',   title: 'Household' },
  { step: 4, section: 'evidence',    title: 'Evidence' },
  { step: 5, section: 'declaration', title: 'Declaration' },
  { step: 6, section: 'summary',     title: 'Summary' }
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
