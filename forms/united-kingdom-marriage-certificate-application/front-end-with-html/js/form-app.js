import { detectFlaggedIssues } from './flags.js';
import { validateApplication } from './grader.js';
import { ceremonyTypeLabel, certificateServiceLabel, emptyApplication, maritalStatusLabel, nationalityStatusLabel, noticeTypeLabel, priorityLabel, validityClassClass, validityClassLabel } from './types.js';

// United Kingdom Marriage Certificate Application — wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The applicant scrolls through the six application sections;
// a sticky top-of-page progress summary reflects how many fields have been
// answered, and a live readout shows the running validity class (ready to
// submit / incomplete / needs evidence / ineligible), the permitted ceremony
// window, and whether an immigration referral is indicated. Submission runs the
// pure engine (classification plus flagged issues) and renders an inline
// report. State is persisted to localStorage so a partial fill survives a page
// reload.
//
// This is a COMPLETENESS and VALIDITY instrument, NOT legal advice and NOT a
// substitute for the register office's decision on the notice. The engine
// validates eligibility, completeness and evidence only.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'united-kingdom-marriage-certificate-application.front-end-with-html.v1';

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
  slug: 'united-kingdom-marriage-certificate-application',
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

const yesNoNotApplicable = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not-applicable', label: 'Not applicable' }
];

const noticeTypeOptions = [
  { value: 'marriage', label: 'Marriage' },
  { value: 'civil-partnership', label: 'Civil partnership' }
];

const ceremonyTypeOptions = [
  { value: 'civil-register-office', label: 'Civil ceremony at a register office' },
  { value: 'civil-approved-premises', label: 'Civil ceremony at approved premises (hotel, stately home, etc.)' },
  { value: 'religious-registered-building', label: 'Religious ceremony in a registered building' },
  { value: 'anglican', label: 'Church of England or Church in Wales ceremony' }
];

const nationalityOptions = [
  { value: 'british-or-irish', label: 'British or Irish citizen' },
  { value: 'eu-settlement-scheme', label: 'EU Settlement Scheme (settled or pre-settled status)' },
  { value: 'other', label: 'Other (from outside the UK and Ireland)' }
];

const maritalOptions = [
  { value: 'never-married', label: 'Never married or in a civil partnership' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'dissolved-civil-partnership', label: 'Civil partnership dissolved' },
  { value: 'annulled', label: 'Marriage or civil partnership annulled' },
  { value: 'currently-married-or-civil-partnered', label: 'Currently married or in a civil partnership' }
];

const certificateServiceOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'priority', label: 'Priority (sent next working day if ordered by 4pm)' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per application step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'The notice',
    description: 'Giving notice of marriage or civil partnership at your local register office. Notice must be given at least 29 days before the ceremony.'
  });
  card.appendChild(radioGroup({
    label: 'Marriage or civil partnership?', section: 'notice', field: 'noticeType',
    options: noticeTypeOptions, required: true
  }));
  card.appendChild(textInput({
    label: 'Date notice is given', section: 'notice', field: 'noticeDate',
    type: 'date', required: true,
    hint: 'The day of your appointment at the register office.'
  }));
  card.appendChild(textInput({
    label: 'Registration district', section: 'notice', field: 'registrationDistrict',
    required: true, placeholder: 'e.g. Leeds',
    hint: 'You must have lived in the district for at least 7 days before giving notice.'
  }));
  card.appendChild(radioGroup({
    label: 'Will both parties give notice together at one register office?', section: 'notice',
    field: 'noticeGivenTogether', options: yesNo,
    hint: 'Required when either party is from outside the UK and Ireland (unless they hold EU Settlement Scheme status).'
  }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'The ceremony',
    description: 'The planned ceremony: it must be at least 29 days after notice and within 12 months of it, with at least two witnesses.'
  });
  card.appendChild(selectInput({
    label: 'Type of ceremony', section: 'ceremony', field: 'ceremonyType',
    options: ceremonyTypeOptions, required: true
  }));
  card.appendChild(textInput({
    label: 'Ceremony date', section: 'ceremony', field: 'ceremonyDate',
    type: 'date', required: true
  }));
  card.appendChild(textInput({
    label: 'Ceremony venue', section: 'ceremony', field: 'venueName',
    required: true, placeholder: 'Name and address of the final venue'
  }));
  card.appendChild(radioGroup({
    label: 'Is the final venue confirmed?', section: 'ceremony', field: 'venueConfirmed',
    options: yesNo, hint: 'The final venue details are needed at the notice appointment.'
  }));
  card.appendChild(textInput({
    label: 'Number of witnesses', section: 'ceremony', field: 'witnessCount',
    type: 'number', min: 0, required: true,
    hint: 'At least two witnesses are needed at every ceremony.'
  }));
  return card;
}

/** One party's section (steps 3 and 4). */
function renderPartyStep(stepNumber, section, ordinal) {
  const card = sectionCard({
    stepNumber,
    title: `${ordinal} party`,
    description: `Identity, residence, previous relationships and immigration evidence for the ${ordinal.toLowerCase()} party. Bring original documents to the appointment.`
  });
  card.appendChild(textInput({
    label: `${ordinal} party — full name`, section, field: 'name',
    required: true, placeholder: 'As on identity documents'
  }));
  card.appendChild(textInput({
    label: 'Date of birth', section, field: 'dateOfBirth', type: 'date', required: true,
    hint: 'Both parties must be at least 18 on the ceremony date.'
  }));
  card.appendChild(textInput({
    label: 'Days lived in the registration district', section, field: 'daysResidentInDistrict',
    type: 'number', min: 0, required: true, hint: 'At least 7 days are required.'
  }));
  card.appendChild(selectInput({
    label: 'Nationality or immigration route', section, field: 'nationalityStatus',
    options: nationalityOptions, required: true
  }));
  card.appendChild(selectInput({
    label: 'Marital or civil partnership status', section, field: 'maritalStatus',
    options: maritalOptions, required: true
  }));
  card.appendChild(radioGroup({
    label: 'Original photographic identity available?', section, field: 'identityProvided',
    options: yesNo, hint: 'A current passport or other accepted photographic identity; photocopies are not accepted.'
  }));
  card.appendChild(radioGroup({
    label: 'Original proof of home address available?', section, field: 'addressProofProvided',
    options: yesNo, hint: 'If living overseas, give a UK contact address instead.'
  }));
  card.appendChild(radioGroup({
    label: 'Evidence the previous marriage or civil partnership ended?', section,
    field: 'priorEndEvidenceProvided', options: yesNoNotApplicable,
    hint: 'Decree absolute, final order, annulment certificate, or the former partner\'s death certificate.'
  }));
  card.appendChild(radioGroup({
    label: 'Immigration evidence available?', section, field: 'immigrationEvidenceProvided',
    options: yesNoNotApplicable,
    hint: 'Passport with visa or endorsement, eVisa or biometric residence permit share code, or EU Settlement Scheme share code.'
  }));
  return card;
}

function renderStep3() {
  return renderPartyStep(3, 'partyOne', 'First');
}

function renderStep4() {
  return renderPartyStep(4, 'partyTwo', 'Second');
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Relationship',
    description: 'Whether the parties are closely related. People within the prohibited degrees of relationship cannot marry or form a civil partnership.'
  });
  card.appendChild(radioGroup({
    label: 'Are the parties closely related (within the prohibited degrees)?', section: 'relationship',
    field: 'closelyRelated', options: yesNo, required: true
  }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Marriage certificate order',
    description: 'Optionally order copies of the marriage certificate from the General Register Office (GRO). A standard copy costs £12.50.'
  });
  card.appendChild(textInput({
    label: 'Number of certificate copies', section: 'certificate', field: 'certificateCopies',
    type: 'number', min: 0, hint: 'Leave blank to order none.'
  }));
  card.appendChild(selectInput({
    label: 'GRO service', section: 'certificate', field: 'certificateService',
    options: certificateServiceOptions
  }));
  card.appendChild(textInput({
    label: 'GRO index reference', section: 'certificate', field: 'groIndexReference',
    hint: 'Optional. Makes a standard order faster and avoids the search fee.'
  }));
  card.appendChild(textArea({
    label: 'Note', section: 'certificate', field: 'applicantNote', rows: 3
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Summary and validity',
    description: 'The live validity class and the permitted ceremony window. Submit to generate the full report.'
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

/** Render the live status: validity badge, ceremony window, immigration note. */
function renderLiveStatus() {
  const result = validateApplication(state);
  const badge =
    `<span class="risk-badge ${validityClassClass(result.validityClass)}">${esc(validityClassLabel(result.validityClass))}</span>`;
  const window = result.earliestCeremonyDate
    ? `<strong>Ceremony window:</strong> ${esc(result.earliestCeremonyDate)} to ${esc(result.latestCeremonyDate)}`
    : `<span class="muted">Ceremony window not yet determinable (no notice date)</span>`;
  const immigration = result.immigrationReferralIndicated
    ? `<span class="muted">— immigration referral indicated</span>`
    : `<span class="muted">— no immigration referral indicated</span>`;
  return `${badge} ${window} ${immigration}`;
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
  notice: [['noticeType'], ['noticeDate'], ['registrationDistrict'], ['noticeGivenTogether']],
  ceremony: [['ceremonyType'], ['ceremonyDate'], ['venueName'], ['venueConfirmed'], ['witnessCount']],
  partyOne: [['name'], ['dateOfBirth'], ['daysResidentInDistrict'], ['nationalityStatus'], ['maritalStatus']],
  partyTwo: [['name'], ['dateOfBirth'], ['daysResidentInDistrict'], ['nationalityStatus'], ['maritalStatus']],
  relationship: [['closelyRelated']],
  certificate: [['certificateCopies'], ['certificateService']]
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
    validityClass, earliestCeremonyDate, latestCeremonyDate, immigrationReferralIndicated,
    flaggedIssues, timestamp
  } = lastResult;

  const dash = '<span class="muted">—</span>';
  const val = (v) => (v === null || v === undefined || v === '' ? dash : esc(v));
  const partyRows = [
    { label: 'First party', p: state.partyOne },
    { label: 'Second party', p: state.partyTwo }
  ].map(({ label, p }) => `
    <tr>
      <th scope="row">${esc(label)}</th>
      <td>${val(p.name)}</td>
      <td>${val(p.dateOfBirth)}</td>
      <td>${p.daysResidentInDistrict === null ? dash : esc(p.daysResidentInDistrict)}</td>
      <td>${p.nationalityStatus ? esc(nationalityStatusLabel(p.nationalityStatus)) : dash}</td>
      <td>${p.maritalStatus ? esc(maritalStatusLabel(p.maritalStatus)) : dash}</td>
    </tr>
  `).join('');

  const flagsList = flaggedIssues.length === 0
    ? `<p class="muted">No eligibility, evidence, or timing flags raised.</p>`
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
  if (validityClass === 'ineligible') {
    guidance = `<p>This application is classified <strong>ineligible</strong>: a party is under 18 on the ceremony date, a party is already married or in a civil partnership, or the parties are closely related. Notice cannot be accepted on this basis. This is a documentation finding, not legal advice; the register office decides each notice.</p>`;
  } else if (validityClass === 'incomplete') {
    guidance = `<p>This application is <strong>incomplete</strong>: required details are missing, or certificate copies are requested without a service. Complete the outstanding items flagged below before booking the notice appointment.</p>`;
  } else if (validityClass === 'needs-evidence') {
    guidance = `<p>This application <strong>needs evidence or correction</strong>: documents, residence, timing, witnesses, or the venue still need attention. Resolve the flagged items before the appointment, and bring original documents, not photocopies.</p>`;
  } else {
    guidance = `<p>This application is <strong>ready to submit</strong>: both parties are eligible, the details are complete, the evidence is in hand, and the ceremony falls inside the permitted window. This is a completeness-and-consistency finding; the register office still decides the notice.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>United Kingdom Marriage Certificate Application — Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${validityClassClass(validityClass)}">
        <div>
          <span class="risk-banner-label">Application class</span>
          <span class="risk-banner-value">${esc(validityClassLabel(validityClass))}</span>
        </div>
        ${immigrationReferralIndicated ? '<span class="risk-badge risk-high">Immigration referral indicated</span>' : ''}
      </div>

      <p><strong>Permitted ceremony window:</strong> ${earliestCeremonyDate ? `${esc(earliestCeremonyDate)} to ${esc(latestCeremonyDate)}` : '<span class="muted">Not determinable (no notice date)</span>'}</p>

      <h3>Recommended action</h3>
      ${guidance}

      <h3>The notice and ceremony</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Notice</th><td>${state.notice.noticeType ? esc(noticeTypeLabel(state.notice.noticeType)) : dash}</td></tr>
          <tr><th scope="row">Notice date</th><td>${val(state.notice.noticeDate)}</td></tr>
          <tr><th scope="row">Registration district</th><td>${val(state.notice.registrationDistrict)}</td></tr>
          <tr><th scope="row">Ceremony</th><td>${state.ceremony.ceremonyType ? esc(ceremonyTypeLabel(state.ceremony.ceremonyType)) : dash}</td></tr>
          <tr><th scope="row">Ceremony date</th><td>${val(state.ceremony.ceremonyDate)}</td></tr>
          <tr><th scope="row">Venue</th><td>${val(state.ceremony.venueName)}</td></tr>
          <tr><th scope="row">Witnesses</th><td>${state.ceremony.witnessCount === null ? dash : esc(state.ceremony.witnessCount)}</td></tr>
        </tbody>
      </table>

      <h3>The parties</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Party</th>
            <th scope="col">Name</th>
            <th scope="col">Born</th>
            <th scope="col">Days in district</th>
            <th scope="col">Route</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>${partyRows}</tbody>
      </table>

      <h3>Certificate order</h3>
      <table class="subscales">
        <tbody>
          <tr><th scope="row">Copies</th><td>${state.certificate.certificateCopies === null ? dash : esc(state.certificate.certificateCopies)}</td></tr>
          <tr><th scope="row">Service</th><td>${state.certificate.certificateService ? esc(certificateServiceLabel(state.certificate.certificateService)) : dash}</td></tr>
          <tr><th scope="row">GRO index reference</th><td>${val(state.certificate.groIndexReference)}</td></tr>
        </tbody>
      </table>

      <h3>Next steps</h3>
      <p>Book the notice appointment at your local register office and bring original documents. Notice is displayed for 28 days; the ceremony can take place from 29 days after notice and must be held within 12 months. After the ceremony, order marriage certificate copies from the General Register Office or the register office.</p>

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
    earliestCeremonyDate: result.earliestCeremonyDate,
    latestCeremonyDate: result.latestCeremonyDate,
    immigrationReferralIndicated: result.immigrationReferralIndicated,
    flaggedIssues,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh application?')) return;
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
  { step: 1, section: 'notice',       title: 'Notice' },
  { step: 2, section: 'ceremony',     title: 'Ceremony' },
  { step: 3, section: 'partyOne',     title: 'First party' },
  { step: 4, section: 'partyTwo',     title: 'Second party' },
  { step: 5, section: 'relationship', title: 'Relationship' },
  { step: 6, section: 'certificate',  title: 'Certificate order' },
  { step: 7, section: 'summary',      title: 'Summary' }
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
