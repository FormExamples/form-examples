import { gradeFitNote } from './fit-note-grader.js';
import {
  ADVICE_OPTIONS,
  METHOD_OPTIONS,
  REGISTRATION_BODY_OPTIONS,
  ROLE_OPTIONS,
  YES_NO_OPTIONS,
  adviceLabel,
  approvalLabel,
  emptyAssessment
} from './types.js';

// Medical Fit Note -- clinician sign-off wizard (vanilla JS).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure approval engine (js/fit-note-grader.js) and renders an inline
// report with the approval status, fired rules and flags. State is persisted
// to localStorage so a partial fill survives a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'medical-fit-note.front-end-with-html.v1';
const TOTAL_STEPS = 8;
const EMPTY_REPORT = '<p class="empty-message">Submit the form to see the report.</p>';

// Merge a possibly-partial or foreign-shaped object onto a fresh default
// state, keeping only known fields of the same primitive kind. Shared by
// localStorage restore (loadState) and JSON import (js/form-import.js, via
// window.__FORM_STATE__.setState).
function mergeIntoDefaults(parsed) {
  const fresh = emptyAssessment();
  for (const key of Object.keys(fresh)) {
    const v = parsed && parsed[key];
    if (v === undefined) continue;
    if (fresh[key] === null) {
      // null-default fields are dates or numbers.
      fresh[key] = typeof v === 'string' || typeof v === 'number' ? v : null;
    } else if (typeof fresh[key] === 'string') {
      fresh[key] = typeof v === 'string' ? v : fresh[key];
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
    console.warn('Could not parse saved fit note; starting fresh.', e);
    return emptyAssessment();
  }
}

function saveState(s) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch (e) {
    console.warn('Could not save fit note to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored fit note.', e);
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
/** @type {(ReturnType<typeof gradeFitNote> & { timestamp: string }) | null} */
let lastResult = null;

// Uniform, minimal cross-module contract for the shared js/form-export.js and
// js/form-import.js snippets.
window.__FORM_STATE__ = {
  slug: 'medical-fit-note',
  hadDraftAtLoad,
  getState: () => state,
  setState: (raw) => {
    state = mergeIntoDefaults(raw);
    saveState(state);
    resetView();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function setField(field, value) {
  state[field] = value;
  saveState(state);
  updateProgress();
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
// Component builders
// ----------------------------------------------------------------------

function lilyInputClass(type) {
  switch (type) {
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    default:       return 'text-input';
  }
}

function labelHtml(opts) {
  return esc(opts.label) + (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
}

function textInput(opts) {
  const id = opts.field;
  const value = state[opts.field];
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelHtml(opts)}</label>
    <input ${attrs.join(' ')}>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <span class="error-message" id="${id}-error"></span>
  `;
  const input = wrapper.querySelector('input');
  input.setAttribute('aria-describedby', `${opts.hint ? `${id}-hint ` : ''}${id}-error`);
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') v = v === '' ? null : Number(v);
    else if (type === 'date' && v === '') v = null;
    setField(opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = opts.field;
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelHtml(opts)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"
      class="text-area-input">${esc(state[id] ?? '')}</textarea>
    <span class="error-message" id="${id}-error"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(id, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = opts.field;
  const current = state[id] ?? '';
  const optionsHtml = [
    '<option value="">— Select —</option>',
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelHtml(opts)}</label>
    <select id="${id}" name="${id}" class="select"${opts.required ? ' data-required' : ''} aria-describedby="${id}-error">
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(id, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

/** Checkbox bound to a 'yes' / '' engine field. */
function yesField(opts) {
  const id = opts.field;
  const wrapper = document.createElement('div');
  wrapper.className = 'bool-field';
  wrapper.innerHTML = `
    <input type="checkbox" class="checkbox-input" id="${id}" name="${id}"${state[id] === 'yes' ? ' checked' : ''}>
    <label for="${id}">${esc(opts.label)}</label>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => setField(id, input.checked ? 'yes' : ''));
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

function subHead(text) {
  const h = document.createElement('h3');
  h.textContent = text;
  return h;
}

function grid(cols, children) {
  const g = document.createElement('div');
  g.className = cols;
  for (const c of children) g.appendChild(c);
  return g;
}

// ----------------------------------------------------------------------
// Step renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Employee',
    description: 'Who the fit note is for.'
  });
  card.appendChild(textInput({ label: 'Employee name', field: 'employeeName', required: true }));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Date of birth', field: 'employeeBirthDate', type: 'date' }),
    textInput({ label: 'NHS number', field: 'employeeNhsNumber', placeholder: 'NNN NNN NNNN' })
  ]));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Employer', field: 'employerName' }),
    textInput({ label: 'Job title', field: 'jobTitle' })
  ]));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Assessment',
    description: 'When and how the employee was assessed (rule R-01).'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'Assessment date', field: 'assessmentDate', type: 'date' }),
    selectInput({ label: 'Assessment method', field: 'assessmentMethod', options: METHOD_OPTIONS })
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Condition',
    description: 'The diagnosis the advice is based on (rule R-02) and its functional effects.'
  });
  card.appendChild(textInput({ label: 'Primary diagnosis', field: 'diagnosisPrimary' }));
  card.appendChild(textInput({ label: 'Additional diagnoses', field: 'diagnosisAdditional' }));
  card.appendChild(textArea({
    label: 'Functional effects', field: 'functionalEffects', rows: 3,
    placeholder: 'How the condition affects the employee at work.'
  }));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Fitness advice',
    description: 'Not fit for work, or may be fit for work with adjustments (rule R-03).'
  });
  card.appendChild(selectInput({
    label: 'Fitness advice', field: 'fitnessAdvice', options: ADVICE_OPTIONS
  }));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Adjustments',
    description: 'Required when the employee may be fit for work: select at least one (rule R-05).'
  });
  card.appendChild(yesField({ label: 'Phased return to work', field: 'adjustmentPhasedReturn' }));
  card.appendChild(yesField({ label: 'Altered hours', field: 'adjustmentAlteredHours' }));
  card.appendChild(yesField({ label: 'Amended duties', field: 'adjustmentAmendedDuties' }));
  card.appendChild(yesField({ label: 'Workplace adaptations', field: 'adjustmentWorkplaceAdaptations' }));
  card.appendChild(textArea({ label: 'Comments', field: 'comments', rows: 3 }));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Period',
    description: 'The period the advice covers (rules R-04, R-08, R-09). Give an end date or a duration in days.'
  });
  card.appendChild(grid('two-col', [
    textInput({ label: 'From', field: 'periodFrom', type: 'date' }),
    textInput({ label: 'To', field: 'periodTo', type: 'date' })
  ]));
  card.appendChild(textInput({
    label: 'Duration in days (when there is no end date)', field: 'periodDurationDays',
    type: 'number', min: 1
  }));
  card.appendChild(selectInput({
    label: 'Reassessment needed', field: 'reassessmentRequired', options: YES_NO_OPTIONS
  }));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Consent and sign-off',
    description: 'Employee consent, then the clinician declaration and registration (rules R-06, R-07).'
  });
  card.appendChild(selectInput({
    label: 'Employee consents to sharing with the employer', field: 'employeeConsentToShare',
    options: YES_NO_OPTIONS
  }));
  card.appendChild(subHead('Clinician'));
  card.appendChild(grid('two-col', [
    textInput({ label: 'Clinician name', field: 'clinicianName' }),
    selectInput({ label: 'Clinician role', field: 'clinicianRole', options: ROLE_OPTIONS })
  ]));
  card.appendChild(grid('two-col', [
    selectInput({
      label: 'Registration body', field: 'clinicianRegistrationBody',
      options: REGISTRATION_BODY_OPTIONS
    }),
    textInput({ label: 'Registration number', field: 'clinicianRegistrationNumber' })
  ]));
  card.appendChild(yesField({
    label: 'I declare that this advice is my clinical opinion and I sign this fit note.',
    field: 'clinicianDeclaration'
  }));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Report',
    description: 'Submit to compute the approval status, the rules that fired and the flags.'
  });
  const p = document.createElement('p');
  p.textContent = 'The report appears below the form.';
  card.appendChild(p);
  return card;
}

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4,
  renderStep5, renderStep6, renderStep7, renderStep8
];

// ----------------------------------------------------------------------
// Progress and step list
// ----------------------------------------------------------------------

// Tracked fields, grouped by the step that owns them.
const STEP_DEFINITIONS = [
  { step: 1, title: 'Employee', fields: ['employeeName', 'employeeBirthDate', 'employerName'] },
  { step: 2, title: 'Assessment', fields: ['assessmentDate', 'assessmentMethod'] },
  { step: 3, title: 'Condition', fields: ['diagnosisPrimary'] },
  { step: 4, title: 'Advice', fields: ['fitnessAdvice'] },
  { step: 5, title: 'Adjustments', fields: [
    'adjustmentPhasedReturn', 'adjustmentAlteredHours',
    'adjustmentAmendedDuties', 'adjustmentWorkplaceAdaptations'
  ], any: true },
  { step: 6, title: 'Period', fields: ['periodFrom', 'periodTo', 'reassessmentRequired'] },
  { step: 7, title: 'Sign-off', fields: [
    'employeeConsentToShare', 'clinicianRegistrationBody',
    'clinicianRegistrationNumber', 'clinicianDeclaration'
  ] },
  { step: 8, title: 'Report', fields: [] }
];

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function stepCounts(def) {
  const total = def.any ? 1 : def.fields.length;
  const answered = def.any
    ? (def.fields.some((f) => isAnswered(state[f])) ? 1 : 0)
    : def.fields.filter((f) => isAnswered(state[f])).length;
  return { answered, total };
}

function updateProgress() {
  let answered = 0;
  let total = 0;
  for (const def of STEP_DEFINITIONS) {
    const c = stepCounts(def);
    answered += c.answered;
    total += c.total;
  }
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses();
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

function updateStepListStatuses() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const { answered, total } = stepCounts(def);
    if (total > 0 && answered === total) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
    } else if (answered > 0) {
      li.dataset.status = 'in-progress';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    } else {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
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

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

// Only the fields the form cannot be sensibly graded without are required;
// every other gap is the engine's job to report as a fired rule.
function validateForm() {
  const errors = [];
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  form.querySelectorAll('[data-required]').forEach((input) => {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const label = labelEl ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim() : id;
      errors.push({ id, message: `${label} is required` });
      setFieldError(id, `${label} is required`);
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
    outcome, approvalStatus, durationDays, adjustmentCount,
    firedRules, additionalFlags, timestamp
  } = lastResult;

  const flagsList = additionalFlags.length === 0
    ? '<p class="muted">No flags raised.</p>'
    : `
      <ul class="flags">
        ${additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}</span>
            <span class="flag-action">${esc(f.suggestedAction)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedTable = firedRules.length === 0
    ? '<p class="muted">No rules fired.</p>'
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">Category</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          ${firedRules.map((r) => `
            <tr>
              <th scope="row">${esc(r.ruleId)}</th>
              <td>${esc(r.category)}</td>
              <td>${esc(r.description)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

  out.innerHTML = `
    <h2>Fit Note Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())} · Employee: ${esc(state.employeeName || '—')}</p>

    <div class="status-summary">
      <span class="status-badge status-${esc(approvalStatus)}" data-testid="approval-status">${esc(approvalLabel(approvalStatus))}</span>
      <span class="muted">Advice: ${esc(adviceLabel(outcome) || 'not chosen')} ·
        Period: ${durationDays == null ? '—' : `${durationDays} day${durationDays === 1 ? '' : 's'}`} ·
        Adjustments: ${adjustmentCount}</span>
    </div>

    <h3>Fired rules</h3>
    ${firedTable}

    <h3>Flags</h3>
    ${flagsList}

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
  if (errors.length > 0) return;
  lastResult = { ...gradeFitNote(state), timestamp: new Date().toISOString() };
  renderReport();
}

function resetView() {
  lastResult = null;
  document.getElementById('report').innerHTML = EMPTY_REPORT;
  renderErrorSummary([]);
  renderForm();
  updateProgress();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh fit note?')) return;
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
