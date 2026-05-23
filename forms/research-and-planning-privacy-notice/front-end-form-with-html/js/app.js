// Research and Planning Privacy Notice - acknowledgement wizard (vanilla
// JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many required fields have been filled.
// Submission runs the pure validator and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.ResearchAndPlanningPrivacyNotice`. Pulling them off
// here keeps the rest of this file referring to short local names. Whole
// file is wrapped in an IIFE so its top-level identifiers don't leak to
// the global scope.
(function () {
'use strict';

const NS = window.ResearchAndPlanningPrivacyNotice;
const {
  emptyAssessment,
  validationRules,
  validateForm,
  detectAdditionalFlags,
  acknowledgementStatus,
  acknowledgementStatusLabel,
  acknowledgementStatusClass,
  completenessLabel
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'research-and-planning-privacy-notice.front-end-form-with-html.v1';

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    // Merge over a fresh empty so any newly-added fields default correctly.
    const fresh = emptyAssessment();
    for (const key of Object.keys(fresh)) {
      if (parsed && typeof parsed[key] === 'object' && parsed[key] !== null) {
        fresh[key] = { ...fresh[key], ...parsed[key] };
      }
    }
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved acknowledgement; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save acknowledgement to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored acknowledgement.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// Auto-populate today's date if not yet set (mirrors Step3 Svelte logic).
if (!state.acknowledgementSignature.recipientTypedDate) {
  state.acknowledgementSignature.recipientTypedDate =
    new Date().toISOString().slice(0, 10);
  saveState(state);
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state and persist.
 * Re-runs progress and checkbox visual state after each change.
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  updateCheckboxVisual();
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

/**
 * Build a labelled text input.
 * @param {{ label: string, section: string, field: string, type?: string,
 *           placeholder?: string, required?: boolean }} opts
 */
function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    setField(opts.section, opts.field, input.value);
  });
  return wrapper;
}

/**
 * Build a radio-group fieldset for an opt-out preference.
 * @param {{
 *   legend: string,
 *   section: string,
 *   field: string,
 *   options: Array<{value: string, label: string}>
 * }} opts
 */
function radioGroup(opts) {
  const fs = document.createElement('fieldset');
  fs.className = 'optout-group';

  const legend = document.createElement('legend');
  legend.innerHTML = `${esc(opts.legend)} <span class="req" aria-hidden="true">*</span>`;
  fs.appendChild(legend);

  const groupName = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];

  for (const opt of opts.options) {
    const id = `${groupName}-${opt.value}`;
    const lbl = document.createElement('label');
    lbl.className = 'optout-option';
    lbl.htmlFor = id;
    lbl.innerHTML = `
      <input type="radio"
        id="${id}"
        name="${groupName}"
        value="${esc(opt.value)}"
        ${String(current) === opt.value ? 'checked' : ''}>
      <span>${esc(opt.label)}</span>
    `;
    const input = lbl.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, opt.value);
    });
    fs.appendChild(lbl);
  }

  return fs;
}

/**
 * Build a section card.
 * @param {{ stepNumber: number, title: string, description?: string }} opts
 */
function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Section ${opts.stepNumber} of 3</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Section renderers (1 per step)
// ----------------------------------------------------------------------

// Step 1: Recipient Details
function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Recipient Details',
    description: 'Enter the details of the patient acknowledging the research and planning privacy notice.'
  });

  card.appendChild(textInput({
    label: 'Organisation Name',
    section: 'recipientDetails',
    field: 'organisationName',
    placeholder: 'e.g. Riverside Medical Practice',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Recipient Name',
    section: 'recipientDetails',
    field: 'recipientName',
    placeholder: 'e.g. Mrs Jane Smith',
    required: true
  }));
  card.appendChild(textInput({
    label: 'NHS Number (optional)',
    section: 'recipientDetails',
    field: 'recipientNhsNumber',
    placeholder: 'e.g. 943 476 5919'
  }));
  card.appendChild(textInput({
    label: 'Date of Birth (optional)',
    section: 'recipientDetails',
    field: 'recipientDob',
    type: 'date'
  }));

  return card;
}

// Step 2: Research & Planning Privacy Notice (read-only prose).
// Mirrors `Step2ResearchPlanningPrivacyNotice.svelte` 1:1.
function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Research & Planning Privacy Notice',
    description: 'How your confidential patient information is used for research and service planning, and your choices about this use.'
  });

  const prose = document.createElement('div');
  prose.className = 'notice-prose';
  prose.innerHTML = `
    <h3>Who we are and what we do</h3>
    <p>
      The NHS and organisations providing NHS services use confidential
      patient information to run the health service, plan services, and
      conduct research that benefits current and future patients. This
      notice explains how your information is used and the choices you
      have.
    </p>

    <h3>Legal bases</h3>
    <p>
      We process your information under <strong>UK GDPR Article 6(1)(e)</strong>
      (task in the public interest) and, for health data,
      <strong>Article 9(2)(h)</strong> (provision of health care) and, for
      research, <strong>Article 9(2)(j)</strong> (scientific research). The
      Common Law Duty of Confidentiality also applies.
    </p>

    <h3>What we use your information for</h3>
    <ul>
      <li>Direct care (always, and unrelated to the opt-out below)</li>
      <li>Service planning &mdash; measuring demand, waiting times, and outcomes</li>
      <li>Research &mdash; approved studies following Health Research Authority rules</li>
      <li>Quality assurance and audit</li>
      <li>Public-health surveillance (where legally required)</li>
    </ul>

    <h3>Your opt-out choices</h3>
    <p>You have two separate choices:</p>
    <ul class="spaced">
      <li>
        <strong>Type 1 opt-out</strong> &mdash; asks your GP practice not to
        share your identifiable information from their records for purposes
        beyond direct care at that practice.
      </li>
      <li>
        <strong>NHS National Data Opt-Out</strong> &mdash; asks the NHS not to
        share your confidential patient information for research and planning
        across the wider NHS. You can set or change this at any time at
        <a href="https://www.nhs.uk/your-nhs-data-matters/" target="_blank" rel="noopener">nhs.uk/your-nhs-data-matters</a>.
      </li>
    </ul>

    <h3>Your rights</h3>
    <p>
      You have rights to access, correct, and (in some cases) object to or
      erase your personal data. You can complain to the Information
      Commissioner's Office at
      <a href="https://ico.org.uk/" target="_blank" rel="noopener">ico.org.uk</a>.
    </p>

    <p class="closing-note">
      Please read each section carefully before proceeding to record your
      preferences, acknowledge, and sign.
    </p>
  `;

  card.appendChild(prose);
  return card;
}

// Step 3: Opt-Out Preference, Acknowledgement & Signature
function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Opt-Out Preference, Acknowledgement & Signature',
    description: 'Record your Type 1 and National Data Opt-Out preferences, then acknowledge and sign.'
  });

  // Type 1 opt-out fieldset
  card.appendChild(radioGroup({
    legend: 'Type 1 opt-out (from this practice)',
    section: 'acknowledgementSignature',
    field: 'type1OptOut',
    options: [
      { value: 'opt-in',  label: 'Opt in — I consent to my information being used for research and planning purposes' },
      { value: 'opt-out', label: 'Opt out — I do not want my identifiable information shared from this practice for research or planning' }
    ]
  }));

  // National Data Opt-Out fieldset
  card.appendChild(radioGroup({
    legend: 'NHS National Data Opt-Out',
    section: 'acknowledgementSignature',
    field: 'nationalDataOptOut',
    options: [
      { value: 'opt-in',  label: 'Opt in — I allow my confidential patient information to be used for research and planning across the NHS' },
      { value: 'opt-out', label: 'Opt out — I do not want my data used beyond my individual care and treatment' }
    ]
  }));

  // Acknowledgement checkbox
  const ackLabel = document.createElement('label');
  ackLabel.className = 'ack-checkbox';
  ackLabel.id = 'ack-checkbox-label';
  ackLabel.htmlFor = 'acknowledgementSignature-agreed';
  if (state.acknowledgementSignature.agreed) {
    ackLabel.classList.add('is-checked');
  }
  ackLabel.innerHTML = `
    <input
      type="checkbox"
      id="acknowledgementSignature-agreed"
      name="acknowledgementSignature-agreed"
      ${state.acknowledgementSignature.agreed ? 'checked' : ''}
    >
    <span class="ack-checkbox-text">
      I confirm I have read and understood the research and planning privacy
      notice and my opt-out choices above.
      <span class="req" aria-hidden="true">*</span>
    </span>
  `;
  const ackInput = ackLabel.querySelector('input');
  ackInput.addEventListener('change', () => {
    setField('acknowledgementSignature', 'agreed', ackInput.checked);
  });
  card.appendChild(ackLabel);

  card.appendChild(textInput({
    label: 'Full Name',
    section: 'acknowledgementSignature',
    field: 'recipientTypedFullName',
    placeholder: 'Type your full name',
    required: true
  }));
  card.appendChild(textInput({
    label: "Today's Date",
    section: 'acknowledgementSignature',
    field: 'recipientTypedDate',
    type: 'date',
    required: true
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + visual state
// ----------------------------------------------------------------------

/**
 * Re-evaluate `data-conditional` blocks (none in this form by default,
 * but the helper is provided for symmetry with the canonical reference
 * and so future fields can use `data-conditional="section.field=value"`).
 */
function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section] && state[section][field];
    host.style.display = String(current) === target ? '' : 'none';
  });
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const [path, targetCsv] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String((state[section] && state[section][field]) ?? '');
    const targets = targetCsv.split(',');
    host.style.display = targets.includes(current) ? '' : 'none';
  });
}

/** Toggle the highlighted "is-checked" style on the acknowledgement label. */
function updateCheckboxVisual() {
  const lbl = document.getElementById('ack-checkbox-label');
  if (!lbl) return;
  if (state.acknowledgementSignature.agreed) {
    lbl.classList.add('is-checked');
  } else {
    lbl.classList.remove('is-checked');
  }
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Tracked fields = the validation-rule list. Each rule corresponds to a
 * single required field; we count how many are non-empty.
 */
function countAnswered() {
  let answered = 0;
  for (const rule of validationRules) {
    const v = state[rule.section] && state[rule.section][rule.field];
    if (v === '' || v === null || v === undefined || v === false) continue;
    answered++;
  }
  return answered;
}

function updateProgress() {
  const answered = countAnswered();
  const total = validationRules.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  const aria = document.getElementById('progress-bar');
  if (aria) aria.setAttribute('aria-valuenow', String(percent));
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function priorityClass(priority) {
  switch (priority) {
    case 'high':   return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low':    return 'flag-low';
    default:       return '';
  }
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    completenessPercent: pct,
    status,
    firedRules,
    additionalFlags,
    timestamp
  } = lastResult;

  const ackStatus = acknowledgementStatus(status, state);

  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.section)}</td>
      <td>${esc(r.field)}</td>
      <td>${esc(r.description)}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">All required fields completed.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Section</th>
            <th scope="col">Field</th>
            <th scope="col">Validation message</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Research and Planning Privacy Notice — Acknowledgement Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Status</h3>
      <p class="status-summary">
        <span class="status-badge ${acknowledgementStatusClass(ackStatus)}">${esc(acknowledgementStatusLabel(ackStatus))}</span>
        <span class="completeness-pct">${esc(completenessLabel(pct))}</span>
      </p>
      <p class="muted">
        Validation status: <strong>${esc(status)}</strong>
        (${firedRules.length} of ${validationRules.length} required fields outstanding).
      </p>

      <h3>Validation errors (fired rules)</h3>
      ${firedTable}

      <h3>Flagged Issues</h3>
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
  const { completeness, status, firedRules } = validateForm(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    completenessPercent: completeness,
    status,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh acknowledgement?')) return;
  clearState();
  state = emptyAssessment();
  // Repopulate today's date so step 3 is pre-filled like the Svelte version.
  state.acknowledgementSignature.recipientTypedDate =
    new Date().toISOString().slice(0, 10);
  saveState(state);
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
  updateConditionalSections();
  updateCheckboxVisual();
  window.scrollTo({ top: 0, behavior: 'smooth' });
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
}

function init() {
  renderForm();
  updateProgress();
  updateConditionalSections();
  updateCheckboxVisual();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
