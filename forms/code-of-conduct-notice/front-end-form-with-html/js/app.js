// Code of Conduct Notice - acknowledgement wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many required fields have been filled.
// Submission runs the pure validator and renders an inline report. State is
// persisted to localStorage so a partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.CodeOfConductNotice`. Pulling them off here keeps the
// rest of this file referring to short local names. Whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.CodeOfConductNotice;
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

const STORAGE_KEY = 'code-of-conduct-notice.front-end-form-with-html.v1';

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
    description: 'Enter the details of the person acknowledging the code of conduct.'
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
    placeholder: 'e.g. Dr Jane Smith',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Recipient Role',
    section: 'recipientDetails',
    field: 'recipientRole',
    placeholder: 'e.g. General Practitioner, Healthcare Assistant, Contractor',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Employee / Contractor ID (optional)',
    section: 'recipientDetails',
    field: 'recipientEmployeeId',
    placeholder: 'e.g. 4827'
  }));

  return card;
}

// Step 2: Code of Conduct Notice (read-only twelve principles).
// Mirrors `Step2CodeOfConductNotice.svelte` 1:1.
const PRINCIPLES = [
  { number: 1,  text: 'Ensure all individuals eligible for the medical programme can access timely care.' },
  { number: 2,  text: 'Provide health care with competence and compassion.' },
  { number: 3,  text: 'Treat patients and colleagues with dignity and respect.' },
  { number: 4,  text: 'Ensure every encounter is conducted without discrimination based on age, sexual orientation, gender, race, ethnicity, national origin, language, disease, disability, or religion.' },
  { number: 5,  text: 'Do not engage in retaliation against colleagues or patients for any reason.' },
  { number: 6,  text: 'Make all reasonable attempts to respectfully provide care to each patient. If for any reason a provider is unable to do so, ensure the patient receives non-judgemental and prompt referral to another clinician, or seek alternative options to preserve patient autonomy.' },
  { number: 7,  text: "Provide each patient with the information needed for considered decision-making about their health. A patient's informed and voluntary consent must be secured, when possible, before initiating a medical procedure." },
  { number: 8,  text: 'Safeguard patient confidentiality, medical information, and privacy.' },
  { number: 9,  text: 'Report unintended events promptly, honestly, and thoroughly through appropriate channels.' },
  { number: 10, text: 'Commit to continued education and adaptation: fulfil educational and training requirements, seek out and apply the soundest medical guidance, and, in situations of uncertainty, ask for help.' },
  { number: 11, text: 'Follow guidelines and policies with professionalism, honesty, and integrity.' },
  { number: 12, text: 'Report wrongdoing (including violations of this Code of Conduct) to the appropriate authorities.' }
];

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Code of Conduct Notice',
    description: 'All medical-service providers, employed staff, contractors, eligible family members, and re-employed annuitants are expected to uphold the following principles.'
  });

  const prose = document.createElement('div');
  prose.className = 'principles-prose';

  const preamble = document.createElement('p');
  preamble.className = 'preamble';
  preamble.textContent =
    'This Code of Conduct reflects four fundamental principles: ' +
    '(1) responsibilities to patients; (2) respect for patients and ' +
    'colleagues; (3) adherence to established medical standards; ' +
    '(4) acknowledgement that medicine is an ever-evolving field that ' +
    'requires providers to stay current in their fields to ensure ' +
    'excellent patient care.';
  prose.appendChild(preamble);

  const ol = document.createElement('ol');
  ol.className = 'principles-list';
  for (const p of PRINCIPLES) {
    const li = document.createElement('li');
    li.textContent = p.text;
    ol.appendChild(li);
  }
  prose.appendChild(ol);

  const closing = document.createElement('p');
  closing.className = 'closing-note';
  closing.textContent =
    'Please read each principle carefully before proceeding to acknowledge and sign.';
  prose.appendChild(closing);

  card.appendChild(prose);
  return card;
}

// Step 3: Acknowledgement & Signature
function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Acknowledgement & Signature',
    description: 'Please confirm you have read and understood the code of conduct.'
  });

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
      I have read, understood, and agree to uphold the above Code of Conduct
      principles. I will abide by these principles in every professional
      interaction with patients and colleagues.
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
        <h2>Code of Conduct Acknowledgement Report</h2>
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
        <button type="button" id="start-over-btn" class="btn btn-secondary">Start over</button>
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
