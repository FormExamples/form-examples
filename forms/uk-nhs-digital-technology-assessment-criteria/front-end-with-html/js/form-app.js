import { CRITERIA, SECTIONS } from './criteria.js';
import { emptyAssessment } from './types.js';
import { calculateGrade, OUTCOME_LABELS } from './grader.js';

// UK NHS Digital Technology Assessment Criteria (DTAC) - assessor wizard
// (vanilla JS).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order (supplier/product/assessor, one step per DTAC section A-G,
// then a review step). A sticky top-of-page progress summary reflects how
// many fields have been answered. Submission runs the pure DTAC grader
// (js/grader.js) and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload. The criterion radio
// groups are generated from CRITERIA (js/criteria.js), never hand-written.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'uk-nhs-digital-technology-assessment-criteria.front-end-with-html.v1';
window.__A11Y_DRAFT_KEY__ = STORAGE_KEY;

// Merge a possibly-partial or foreign-shaped object onto a fresh default
// assessment, keeping only known top-level sections. Shared by localStorage
// restore (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState) so both paths tolerate the same drift.
function mergeIntoDefaults(parsed) {
  const fresh = emptyAssessment();
  for (const key of Object.keys(fresh)) {
    const v = parsed && parsed[key];
    if (Array.isArray(fresh[key])) {
      fresh[key] = Array.isArray(v) ? v : [];
    } else if (v && typeof v === 'object') {
      fresh[key] = { ...fresh[key], ...v };
    }
  }
  return fresh;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    return mergeIntoDefaults(JSON.parse(raw));
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save assessment to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored assessment.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

// Captured before loadState() reads it, so js/restore-banner.js can tell
// "a previous draft was restored" apart from "this is a blank first visit".
let hadDraftAtLoad = false;
try {
  hadDraftAtLoad = localStorage.getItem(STORAGE_KEY) !== null;
} catch (e) {
  // Ignore; loadState() below will hit the same failure and fall back safely.
}

let state = loadState();
/** @type {ReturnType<typeof calculateGrade> | null} */
let lastResult = null;

const EMPTY_REPORT = '<p class="empty-message">Submit the form to see the report.</p>';

// Uniform, minimal cross-module contract for the shared js/form-export.js,
// js/form-import.js, and js/restore-banner.js snippets.
window.__FORM_STATE__ = {
  slug: 'uk-nhs-digital-technology-assessment-criteria',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    resetView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function resetView() {
  lastResult = null;
  document.getElementById('report').innerHTML = EMPTY_REPORT;
  renderErrorSummary([]);
  renderForm();
  updateProgress();
}

function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  refreshReviewReadout();
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ----------------------------------------------------------------------
// Steps
// ----------------------------------------------------------------------

const STATUS_LABELS = {
  'met': 'Met',
  'partially-met': 'Partially met',
  'not-met': 'Not met',
  'not-applicable': 'Not applicable'
};

const SECTION_RESULT_LABELS = {
  'met': 'Met',
  'partially-met': 'Partially met',
  'not-met': 'Not met',
  'incomplete': 'Incomplete'
};

const STEP_DEFINITIONS = [
  { step: 1, title: 'Supplier and product' },
  ...SECTIONS.map((s, i) => ({
    step: i + 2,
    title: `${s.id.toUpperCase()}. ${s.title}`
  })),
  { step: SECTIONS.length + 2, title: 'Review and sign-off' }
];
const TOTAL_STEPS = STEP_DEFINITIONS.length;

// Fields counted by the progress bar: every criterion plus the key
// identification fields.
const TRACKED_FIELDS = [
  ['supplier', 'name'],
  ['product', 'name'],
  ['assessor', 'name'],
  ...CRITERIA.map((c) => ['criteria', c.id])
];

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

function lilyInputClass(type) {
  switch (type) {
    case 'email': return 'email-input';
    case 'number': return 'number-input';
    case 'date': return 'date-input';
    case 'tel': return 'tel-input';
    case 'url': return 'url-input';
    default: return 'text-input';
  }
}

function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const type = opts.type || 'text';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <input id="${id}" name="${id}" type="${type}" class="${lilyInputClass(type)}"
      value="${esc(value ?? '')}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error">
    <span class="error-message" id="${id}-error"></span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'date') v = v === '' ? null : v;
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
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      aria-describedby="${id}-error"
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error"></span>
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
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(opts.label)}</label>
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
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
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}>
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

  const errSpan = document.createElement('span');
  errSpan.className = 'error-message';
  errSpan.id = `${groupId}-error`;
  wrapper.appendChild(errSpan);
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
  legend.innerHTML = `
    <span class="section-step">Step ${opts.stepNumber} of ${TOTAL_STEPS}</span>
    <h2 class="section-title">${esc(opts.title)}</h2>
    ${desc}
  `;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// Option lists
// ----------------------------------------------------------------------

const YES_NO = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const PRODUCT_TYPES = [
  ['app', 'App'],
  ['web-service', 'Web service'],
  ['software-as-a-service', 'Software as a service'],
  ['wearable-integrated', 'Wearable-integrated'],
  ['clinical-decision-support', 'Clinical decision support'],
  ['remote-monitoring', 'Remote monitoring'],
  ['other', 'Other']
].map(([value, label]) => ({ value, label }));

const DEVICE_CLASSES = [
  ['not-a-medical-device', 'Not a medical device'],
  ['class-i', 'Class I'],
  ['class-iia', 'Class IIa'],
  ['class-iib', 'Class IIb'],
  ['class-iii', 'Class III'],
  ['unknown', 'Unknown']
].map(([value, label]) => ({ value, label }));

const ASSESSOR_ROLES = [
  ['commissioner', 'Commissioner'],
  ['procurement-lead', 'Procurement lead'],
  ['clinical-safety-officer', 'Clinical Safety Officer'],
  ['information-governance-lead', 'Information governance lead'],
  ['information-security-lead', 'Information security lead'],
  ['digital-lead', 'Digital lead'],
  ['other', 'Other']
].map(([value, label]) => ({ value, label }));

const ASSESSMENT_STATUSES = ['draft', 'submitted', 'reviewed', 'approved', 'rejected']
  .map((value) => ({ value, label: value.charAt(0).toUpperCase() + value.slice(1) }));

const OUTCOME_OPTIONS = Object.keys(OUTCOME_LABELS)
  .map((value) => ({ value, label: OUTCOME_LABELS[value] }));

const STATUS_OPTIONS = Object.keys(STATUS_LABELS)
  .map((value) => ({ value, label: STATUS_LABELS[value] }));

// ----------------------------------------------------------------------
// Step renderers
// ----------------------------------------------------------------------

function renderSupplierStep() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Supplier, product and assessor',
    description: 'Who supplies the technology, what it is, and who is assessing it.'
  });
  const add = (n) => card.appendChild(n);
  add(textInput({ section: 'supplier', field: 'name', label: 'Supplier name' }));
  add(textInput({ section: 'supplier', field: 'tradingName', label: 'Trading name' }));
  add(textInput({ section: 'supplier', field: 'companyRegistrationNumber', label: 'Company registration number' }));
  add(textInput({ section: 'supplier', field: 'countryOfRegistration', label: 'Country of registration' }));
  add(textInput({ section: 'supplier', field: 'icoRegistrationNumber', label: 'ICO registration number' }));
  add(textInput({ section: 'supplier', field: 'website', label: 'Website', type: 'url' }));
  add(textArea({ section: 'supplier', field: 'postalAddress', label: 'Postal address', rows: 2 }));
  add(textInput({ section: 'supplier', field: 'postcode', label: 'Postcode' }));
  add(textInput({ section: 'supplier', field: 'contactName', label: 'Supplier contact name' }));
  add(textInput({ section: 'supplier', field: 'contactEmail', label: 'Supplier contact email', type: 'email' }));
  add(textInput({ section: 'supplier', field: 'contactPhone', label: 'Supplier contact phone', type: 'tel' }));

  add(textInput({ section: 'product', field: 'name', label: 'Product name' }));
  add(textInput({ section: 'product', field: 'version', label: 'Product version' }));
  add(textArea({ section: 'product', field: 'description', label: 'Product description', rows: 3 }));
  add(textArea({ section: 'product', field: 'intendedPurpose', label: 'Intended purpose', rows: 3 }));
  add(selectInput({ section: 'product', field: 'productType', label: 'Product type', options: PRODUCT_TYPES }));
  add(selectInput({ section: 'product', field: 'medicalDeviceClass', label: 'Medical device class', options: DEVICE_CLASSES }));
  add(radioGroup({ section: 'product', field: 'handlesPatientData', label: 'Handles patient data?', options: YES_NO }));
  add(radioGroup({ section: 'product', field: 'isPatientFacing', label: 'Patient facing?', options: YES_NO }));

  add(textInput({ section: 'assessor', field: 'name', label: 'Assessor name' }));
  add(textInput({ section: 'assessor', field: 'email', label: 'Assessor email', type: 'email' }));
  add(textInput({ section: 'assessor', field: 'phone', label: 'Assessor phone', type: 'tel' }));
  add(textInput({ section: 'assessor', field: 'organisation', label: 'Assessor organization' }));
  add(selectInput({ section: 'assessor', field: 'role', label: 'Assessor role', options: ASSESSOR_ROLES }));
  return card;
}

// One step per DTAC section, criteria generated from CRITERIA.
function sectionRenderer(section, index) {
  return () => {
    const items = CRITERIA.filter((c) => c.section === section.id);
    const mandatoryCount = items.filter((c) => c.mandatory).length;
    const card = sectionCard({
      stepNumber: index + 2,
      title: `Section ${section.id.toUpperCase()}: ${section.title}`,
      description: `${items.length} criteria, ${mandatoryCount} mandatory.`
    });
    for (const c of items) {
      card.appendChild(radioGroup({
        section: 'criteria',
        field: c.id,
        label: `${c.id.toUpperCase()} (${c.mandatory ? 'mandatory' : 'advisory'}): ${c.description}`,
        options: STATUS_OPTIONS
      }));
    }
    card.appendChild(textArea({
      section: 'notes',
      field: section.id,
      label: `Notes for section ${section.id.toUpperCase()}`,
      rows: 3
    }));
    return card;
  };
}

function renderReviewStep() {
  const card = sectionCard({
    stepNumber: TOTAL_STEPS,
    title: 'Review and sign-off',
    description: 'Check the graded outcome, then record the assessor sign-off.'
  });
  const readout = document.createElement('div');
  readout.className = 'field readout';
  readout.innerHTML = `
    <p class="label" id="review-live-label">Graded outcome (live)</p>
    <div id="review-live" class="readout-value" aria-labelledby="review-live-label" aria-live="polite"></div>
  `;
  card.appendChild(readout);
  const add = (n) => card.appendChild(n);
  add(selectInput({ section: 'assessment', field: 'status', label: 'Assessment status', options: ASSESSMENT_STATUSES }));
  add(textInput({ section: 'assessment', field: 'assessmentDate', label: 'Assessment date', type: 'date' }));
  add(textInput({ section: 'assessment', field: 'reviewDueDate', label: 'Review due date', type: 'date' }));
  add(textInput({ section: 'assessment', field: 'dtacVersion', label: 'DTAC version assessed against' }));
  add(textInput({ section: 'assessment', field: 'commissioningOrganisation', label: 'Commissioning organization' }));
  add(textArea({ section: 'assessment', field: 'assessorNotes', label: 'Assessor notes', rows: 3 }));
  add(selectInput({ section: 'assessment', field: 'finalOutcome', label: 'Assessor sign-off outcome (override)', options: OUTCOME_OPTIONS }));
  add(textArea({ section: 'assessment', field: 'assessorOverrideReason', label: 'Override reason (required when the sign-off outcome differs from the graded outcome)', rows: 2 }));
  return card;
}

const STEP_RENDERERS = [
  renderSupplierStep,
  ...SECTIONS.map(sectionRenderer),
  renderReviewStep
];

function refreshReviewReadout() {
  const el = document.getElementById('review-live');
  if (!el) return;
  const g = calculateGrade(state);
  el.textContent =
    `${g.outcomeLabel}: ${g.mandatoryMet} of ${g.mandatoryTotal} mandatory criteria met, ` +
    `${g.advisoryMet} of ${g.advisoryTotal} advisory.`;
}

// ----------------------------------------------------------------------
// Progress and step list
// ----------------------------------------------------------------------

function stepOfField(section, field) {
  if (section === 'criteria') {
    const c = CRITERIA.find((x) => x.id === field);
    return SECTIONS.findIndex((s) => s.id === c.section) + 2;
  }
  return 1;
}

function updateProgress() {
  let answered = 0;
  const stepAnswered = {};
  const stepTotal = {};
  for (const [section, field] of TRACKED_FIELDS) {
    const step = stepOfField(section, field);
    stepTotal[step] = (stepTotal[step] || 0) + 1;
    const v = state[section][field];
    if (v !== null && v !== undefined && v !== '') {
      answered++;
      stepAnswered[step] = (stepAnswered[step] || 0) + 1;
    }
  }
  const total = TRACKED_FIELDS.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;

  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const done = stepAnswered[def.step] || 0;
    const tot = stepTotal[def.step] || 0;
    li.removeAttribute('aria-current');
    if (tot > 0 && done === tot) {
      li.dataset.status = 'finished';
    } else {
      li.dataset.status = done > 0 ? 'in-progress' : 'waiting';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    }
  }
  if (firstUnfinished === -1) firstUnfinished = STEP_DEFINITIONS[0].step;
  const current = ol.querySelector(`[data-step="${firstUnfinished}"]`);
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') current.dataset.status = 'in-progress';
  }
  ol.dataset.current = String(firstUnfinished - 1);
}

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

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
}

// The only hard rule: an assessor sign-off that differs from the graded
// outcome needs a reason. A blank or partial assessment can always be
// submitted; the grader reports it as Incomplete.
function validateForm() {
  const errors = [];
  const a = state.assessment;
  const graded = calculateGrade(state).outcome;
  if (a.finalOutcome && a.finalOutcome !== graded && !String(a.assessorOverrideReason).trim()) {
    errors.push({
      id: 'assessment-assessorOverrideReason',
      message: 'Enter a reason for overriding the graded outcome.'
    });
    const span = document.getElementById('assessment-assessorOverrideReason-error');
    if (span) span.textContent = 'Required when the sign-off outcome differs from the graded outcome.';
    const input = document.getElementById('assessment-assessorOverrideReason');
    if (input) input.setAttribute('aria-invalid', 'true');
  }
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
  summary.innerHTML = `
    <strong>Please correct the following:</strong>
    <ul>
      ${errors.map((e) => `<li><a href="#${esc(e.id)}">${esc(e.message)}</a></li>`).join('')}
    </ul>
  `;
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  summary.focus({ preventScroll: true });
}

// ----------------------------------------------------------------------
// Report
// ----------------------------------------------------------------------

function severityClass(severity) {
  if (severity === 'critical') return 'flag-high';
  if (severity === 'warning') return 'flag-medium';
  return 'flag-low';
}

function outcomePill(outcome) {
  const risk = { 'meets': 'low', 'conditional': 'moderate', 'incomplete': 'high', 'does-not-meet': 'critical' }[outcome] || 'low';
  return `risk-${risk}`;
}

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;
  const r = lastResult;
  const a = state.assessment;

  const sectionRows = SECTIONS.map((s) => `
    <tr>
      <th scope="row">${esc(s.id.toUpperCase())}</th>
      <td>${esc(s.title)}</td>
      <td>${esc(SECTION_RESULT_LABELS[r.sections[s.id]] || r.sections[s.id])}</td>
    </tr>
  `).join('');

  const firedTable = r.firedRules.length === 0
    ? `<p class="muted">No rules fired: no applicable criterion is partially met or not met.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Section</th>
            <th scope="col">Status</th>
            <th scope="col">Type</th>
            <th scope="col">Criterion</th>
          </tr>
        </thead>
        <tbody>${r.firedRules.map((f) => `
          <tr>
            <th scope="row">${esc(f.ruleId)}</th>
            <td>${esc(f.section.toUpperCase())}</td>
            <td>${esc(STATUS_LABELS[f.status])}</td>
            <td>${f.mandatory ? 'Mandatory' : 'Advisory'}</td>
            <td>${esc(f.description)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    `;

  const flagsList = r.flags.length === 0
    ? `<p class="muted">No flags raised.</p>`
    : `
      <ul class="flags">
        ${r.flags.map((f) => `
          <li class="${severityClass(f.severity)}">
            <span class="flag-priority">${esc(String(f.severity).toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)} (${esc(f.flagId)})</span>
          </li>
        `).join('')}
      </ul>
    `;

  const finalOutcome = a.finalOutcome || r.outcome;
  const overridden = a.finalOutcome && a.finalOutcome !== r.outcome;
  const signOff = `
    <h3>Assessor sign-off</h3>
    <p>
      <span class="risk-pill ${outcomePill(finalOutcome)}">${esc(OUTCOME_LABELS[finalOutcome])}</span>
      ${overridden ? `<span class="muted">Overrides the graded outcome (${esc(r.outcomeLabel)}).</span>` : ''}
    </p>
    ${overridden ? `<p class="muted">Override reason: ${esc(a.assessorOverrideReason)}</p>` : ''}
    <p class="muted">
      Assessor: ${esc(state.assessor.name || 'not recorded')}
      · Assessment date: ${esc(a.assessmentDate || 'not recorded')}
      · Review due: ${esc(a.reviewDueDate || 'not set')}
    </p>
  `;

  out.innerHTML = `
    <h2>DTAC Assessment Report</h2>
    <p class="muted">
      ${esc(state.product.name || 'Unnamed product')} by ${esc(state.supplier.name || 'unnamed supplier')}.
      Generated ${esc(new Date(r.timestamp).toLocaleString())}
    </p>

    <h3>Graded outcome</h3>
    <p>
      <span class="risk-pill ${outcomePill(r.outcome)}">${esc(r.outcomeLabel)}</span>
    </p>
    <div class="subscale-chips">
      <span class="subscale-chip">Mandatory met: <strong>${r.mandatoryMet}</strong> / ${r.mandatoryTotal}</span>
      <span class="subscale-chip">Advisory met: <strong>${r.advisoryMet}</strong> / ${r.advisoryTotal}</span>
    </div>

    <h3>Section results</h3>
    <table class="subscales">
      <thead>
        <tr>
          <th scope="col">Section</th>
          <th scope="col">Title</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>${sectionRows}</tbody>
    </table>

    <h3>Fired rules</h3>
    ${firedTable}

    <h3>Flags</h3>
    ${flagsList}

    ${signOff}

    <div class="report-actions">
      <button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
  document.getElementById('print-btn').addEventListener('click', () => window.print());
}

function submitForm() {
  const errors = validateForm();
  renderErrorSummary(errors);
  if (errors.length > 0) return;
  lastResult = {
    ...calculateGrade(state),
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
  clearState();
  state = emptyAssessment();
  resetView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  host.innerHTML = '';
  for (const r of STEP_RENDERERS) host.appendChild(r());
  refreshReviewReadout();
}

function init() {
  renderStepList();
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
