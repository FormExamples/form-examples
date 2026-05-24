// Prescription Request - patient wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure priority-classification engine and renders an inline report.
// State is persisted to localStorage so a partial fill survives a reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.PrescriptionRequest`. Pulling them off here keeps the
// rest of this file referring to short local names. Whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.PrescriptionRequest;
const {
  emptyAssessment,
  priorityLevelLabel,
  priorityLevelClass,
  calculatePriorityLevel,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'prescription-request.front-end-form-with-html.v1';

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
    console.warn('Could not parse saved request; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save request to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored request.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a deeply-nested field on the state, persist, and refresh progress.
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
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
 * Build a labelled multi-line text area.
 * @param {{ label: string, section: string, field: string, rows?: number,
 *           placeholder?: string }} opts
 */
function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="text-area-input">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[] }} opts
 */
function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

/**
 * Build a radio group.
 * @param {{ label: string, section: string, field: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
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
      <span class="section-step">Section ${opts.stepNumber} of 5</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Section option lists
// ----------------------------------------------------------------------

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const newRefillOptions = [
  { value: 'yes', label: 'New Prescription' },
  { value: 'no', label: 'Refill / Repeat' }
];

const emergencyOptions = [
  { value: 'yes', label: 'Emergency' },
  { value: 'no', label: 'Normal' }
];

const routeOptions = [
  { value: 'oral', label: 'Oral' },
  { value: 'topical', label: 'Topical' },
  { value: 'intravenous', label: 'Intravenous' },
  { value: 'intramuscular', label: 'Intramuscular' },
  { value: 'subcutaneous', label: 'Subcutaneous' },
  { value: 'inhaled', label: 'Inhaled' },
  { value: 'rectal', label: 'Rectal' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'transdermal', label: 'Transdermal' },
  { value: 'other', label: 'Other' }
];

// ----------------------------------------------------------------------
// Section renderers (1 per Svelte step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Patient Information',
    description: 'Details of the patient requesting the prescription.'
  });

  const names = document.createElement('div');
  names.className = 'two-col';
  names.appendChild(textInput({
    label: 'First Name', section: 'patientInformation', field: 'firstName', required: true
  }));
  names.appendChild(textInput({
    label: 'Last Name', section: 'patientInformation', field: 'lastName', required: true
  }));
  card.appendChild(names);

  card.appendChild(textInput({
    label: 'NHS Patient Number',
    section: 'patientInformation', field: 'nhsNumber',
    placeholder: 'e.g. 943 476 5919'
  }));

  const contact = document.createElement('div');
  contact.className = 'two-col';
  contact.appendChild(textInput({
    label: 'Phone', section: 'patientInformation', field: 'phone', required: true
  }));
  contact.appendChild(textInput({
    label: 'Email', section: 'patientInformation', field: 'email', type: 'email'
  }));
  card.appendChild(contact);

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Clinician Information',
    description: 'Details of the prescribing clinician.'
  });

  const names = document.createElement('div');
  names.className = 'two-col';
  names.appendChild(textInput({
    label: 'First Name', section: 'clinicianInformation', field: 'firstName', required: true
  }));
  names.appendChild(textInput({
    label: 'Last Name', section: 'clinicianInformation', field: 'lastName', required: true
  }));
  card.appendChild(names);

  card.appendChild(textInput({
    label: 'NHS Employee Number',
    section: 'clinicianInformation', field: 'nhsEmployeeNumber',
    placeholder: 'e.g. C1234567'
  }));

  const contact = document.createElement('div');
  contact.className = 'two-col';
  contact.appendChild(textInput({
    label: 'Phone', section: 'clinicianInformation', field: 'phone', required: true
  }));
  contact.appendChild(textInput({
    label: 'Email', section: 'clinicianInformation', field: 'email', type: 'email'
  }));
  card.appendChild(contact);

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Prescription Details',
    description: 'Medication and dosage information.'
  });

  card.appendChild(textInput({
    label: 'Request Date',
    section: 'prescriptionDetails', field: 'requestDate',
    type: 'date', required: true
  }));
  card.appendChild(textInput({
    label: 'Medication Name',
    section: 'prescriptionDetails', field: 'medicationName',
    required: true, placeholder: 'e.g. Amoxicillin'
  }));

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'Dosage',
    section: 'prescriptionDetails', field: 'dosage',
    required: true, placeholder: 'e.g. 500mg'
  }));
  grid.appendChild(textInput({
    label: 'Frequency',
    section: 'prescriptionDetails', field: 'frequency',
    placeholder: 'e.g. TDS, BD, OD'
  }));
  card.appendChild(grid);

  card.appendChild(selectInput({
    label: 'Route of Administration',
    section: 'prescriptionDetails', field: 'routeOfAdministration',
    options: routeOptions
  }));
  card.appendChild(textArea({
    label: 'Treatment Instructions',
    section: 'prescriptionDetails', field: 'treatmentInstructions',
    placeholder: 'Instructions for the patient…',
    rows: 3
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Substitution Options',
    description: 'Indicate whether alternatives are acceptable.'
  });

  card.appendChild(radioGroup({
    label: 'Allow brand name substitution?',
    section: 'substitutionOptions', field: 'allowBrandSubstitution',
    options: yesNoOptions
  }));
  card.appendChild(radioGroup({
    label: 'Allow generic substitution?',
    section: 'substitutionOptions', field: 'allowGenericSubstitution',
    options: yesNoOptions
  }));
  card.appendChild(radioGroup({
    label: 'Allow dosage adjustment?',
    section: 'substitutionOptions', field: 'allowDosageAdjustment',
    options: yesNoOptions
  }));
  card.appendChild(textArea({
    label: 'Substitution Notes',
    section: 'substitutionOptions', field: 'substitutionNotes',
    placeholder: 'Any additional notes about substitution preferences…',
    rows: 3
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Request Type',
    description: 'Classify this prescription request.'
  });

  card.appendChild(radioGroup({
    label: 'Is this a new prescription or a refill?',
    section: 'requestType', field: 'isNewPrescription',
    required: true,
    options: newRefillOptions
  }));
  card.appendChild(radioGroup({
    label: 'Is this an emergency request?',
    section: 'requestType', field: 'isEmergency',
    required: true,
    options: emergencyOptions
  }));
  card.appendChild(textArea({
    label: 'Additional Notes',
    section: 'requestType', field: 'additionalNotes',
    placeholder: 'Any other information relevant to this request…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Patient info
  ['patientInformation', 'firstName'],
  ['patientInformation', 'lastName'],
  ['patientInformation', 'phone'],
  ['patientInformation', 'email'],
  ['patientInformation', 'nhsNumber'],
  // Clinician info
  ['clinicianInformation', 'firstName'],
  ['clinicianInformation', 'lastName'],
  ['clinicianInformation', 'phone'],
  ['clinicianInformation', 'email'],
  ['clinicianInformation', 'nhsEmployeeNumber'],
  // Prescription details
  ['prescriptionDetails', 'requestDate'],
  ['prescriptionDetails', 'medicationName'],
  ['prescriptionDetails', 'dosage'],
  ['prescriptionDetails', 'frequency'],
  ['prescriptionDetails', 'routeOfAdministration'],
  ['prescriptionDetails', 'treatmentInstructions'],
  // Substitution options
  ['substitutionOptions', 'allowBrandSubstitution'],
  ['substitutionOptions', 'allowGenericSubstitution'],
  ['substitutionOptions', 'allowDosageAdjustment'],
  // Request type
  ['requestType', 'isNewPrescription'],
  ['requestType', 'isEmergency']
];

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') answered++;
  }
  const total = TRACKED_FIELDS.length;
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

function flagPriorityClass(priority) {
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

  const { priorityLevel, firedRules, additionalFlags, timestamp } = lastResult;

  const flagsList = additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${flagPriorityClass(f.priority)}">
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
      <td>${esc(r.category)}</td>
      <td>${esc(r.description)}</td>
      <td>${esc(r.priorityLevel.toUpperCase())}</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No classification rules fired - default routine processing.</p>`
    : `
      <table class="rules">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
            <th scope="col">Priority</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Prescription Request Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Priority Classification</h3>
      <p class="priority-summary">
        <span class="priority-badge ${priorityLevelClass(priorityLevel)}">${esc(priorityLevel)}</span>
        <span class="priority-description">${esc(priorityLevelLabel(priorityLevel))}</span>
      </p>

      <h3>Fired Rules</h3>
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
  const { priorityLevel, firedRules } = calculatePriorityLevel(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    priorityLevel,
    firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh request?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
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
  host.appendChild(renderStep4());
  host.appendChild(renderStep5());
}

function init() {
  renderForm();
  updateProgress();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
