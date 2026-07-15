import { calculateGrade } from './grader.js';
import { insufficientUnits, isAboDiscrepancy, isTwoSampleRuleUnmet } from './rules.js';
import { abnormalitySeverityClass, abnormalitySeverityLabel, bloodGroupLabel, componentLabel, crossmatchResultLabel, emptyResult, followUpUrgencyClass, followUpUrgencyLabel, priorityClass, priorityLabel, recommendationLabel, reportStatusLabel, requestTypeLabel, resultClassificationClass, resultClassificationLabel } from './types.js';

// Blood Cross-Match Test Result — report wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every step is rendered into the page in
// document order. The reporting clinician scrolls through them; a sticky
// top-of-page progress summary reflects how many fields have been answered and
// a live four-axis interpretation grade updates as the report is entered.
// Submission runs the pure grading engine (Axis A classification, Axis B
// severity + reporting category, Axis C completeness, Axis D follow-up
// urgency, overall recommendation, fired-rule audit trail, safety flags) and
// renders an inline report. State is persisted to localStorage so a partial
// fill survives a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'blood-cross-match-test-result.front-end-with-html.v1';

/** @returns {import('./types.js').BloodCrossMatchResult} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResult();
    const parsed = JSON.parse(raw);
    // Merge over a fresh empty so any newly-added fields default correctly.
    return Object.assign(emptyResult(), parsed);
  } catch (e) {
    console.warn('Could not parse saved report; starting fresh.', e);
    return emptyResult();
  }
}

/** @param {import('./types.js').BloodCrossMatchResult} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save report to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored report.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').BloodCrossMatchResult} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

const TOTAL_STEPS = 7;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a field on the flat report state and persist. Re-runs progress,
 * conditional alerts, and the live-grade readouts after each change.
 *
 * @param {string} field
 * @param {*} value
 */
function setField(field, value) {
  state[field] = value;
  saveState(state);
  updateProgress();
  refreshLiveGrade();
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
// Component builders (Lily headless class contract)
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
  const id = opts.field;
  const value = state[opts.field];
  const labelText = esc(opts.label);
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
  if (opts.required) attrs.push('required', 'data-required');
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${labelText}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.field, v);
    clearFieldError(id);
  });
  return wrapper;
}

function textArea(opts) {
  const id = opts.field;
  const value = state[opts.field] ?? '';
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
    setField(opts.field, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

function selectInput(opts) {
  const id = opts.field;
  const current = state[opts.field] ?? '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const labelText = esc(opts.label);

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${String(o.value) === String(current) ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${labelText}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <select id="${id}" name="${id}" class="select" aria-describedby="${id}-error"${opts.required ? ' required data-required' : ''}>
      ${optionsHtml}
    </select>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => {
    setField(opts.field, sel.value);
    clearFieldError(id);
  });
  return wrapper;
}

function checkboxInput(opts) {
  const id = opts.field;
  const checked = state[opts.field] === true;
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <span class="label" id="${id}-label">${esc(opts.label)}</span>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <div class="checkbox-group" role="group" aria-labelledby="${id}-label">
      <label for="${id}">
        <input class="checkbox-input" type="checkbox" id="${id}" name="${id}"${checked ? ' checked' : ''}>
        <span>${esc(opts.text)}</span>
      </label>
    </div>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setField(opts.field, input.checked);
    clearFieldError(id);
  });
  return wrapper;
}

/**
 * A conditional inline alert, shown/hidden by refreshLiveGrade() whenever the
 * `when` predicate over the current state changes.
 */
function conditionalAlert(opts) {
  const el = document.createElement('div');
  el.className = 'alert';
  el.setAttribute('data-type', opts.type);
  el.setAttribute('role', 'alert');
  el.id = opts.id;
  el.hidden = true;
  el.innerHTML = `<strong>${esc(opts.heading)}</strong> ${esc(opts.message)}`;
  conditionalAlerts.push({ id: opts.id, when: opts.when });
  return el;
}

/** @type {{ id: string, when: (r: import('./types.js').BloodCrossMatchResult) => boolean }[]} */
const conditionalAlerts = [];

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
// Section renderers (1 per wizard step, mirroring the SvelteKit steps)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Report Identification',
    description: 'Who authored the report, the originating request, the test type, and key dates.'
  });

  card.appendChild(textInput({
    label: 'Reporting clinician',
    field: 'reportingClinician', required: true,
    placeholder: 'e.g. A Biomedical Scientist'
  }));
  card.appendChild(textInput({
    label: 'Originating request reference',
    field: 'originatingRequestReference',
    placeholder: 'e.g. XM-1001'
  }));
  card.appendChild(selectInput({
    label: 'Request type',
    field: 'requestType', required: true,
    options: [
      { value: 'group-and-save', label: 'Group and save' },
      { value: 'crossmatch', label: 'Crossmatch' },
      { value: 'antibody-screen', label: 'Antibody screen' },
      { value: 'emergency-issue', label: 'Emergency issue' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Report status',
    field: 'reportStatus', required: true,
    options: [
      { value: 'preliminary', label: 'Preliminary' },
      { value: 'final', label: 'Final' },
      { value: 'amended', label: 'Amended' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Performed date',
    field: 'performedDate', type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Reported date',
    field: 'reportedDate', type: 'date'
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Clinical Context',
    description: 'The clinical history and transfusion indication relevant to interpreting the result.'
  });

  card.appendChild(textArea({
    label: 'Clinical history',
    field: 'clinicalHistory', rows: 4,
    placeholder: 'Clinical history, transfusion indication, and the question the testing was performed to answer…'
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'ABO / RhD Grouping',
    description: 'The determined ABO and RhD group and concordance with the historical group on record.'
  });

  card.appendChild(selectInput({
    label: 'ABO group',
    field: 'aboGroup',
    options: [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'o', label: 'O' },
      { value: 'ab', label: 'AB' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'RhD group',
    field: 'rhdGroup',
    options: [
      { value: 'positive', label: 'RhD positive' },
      { value: 'negative', label: 'RhD negative' }
    ]
  }));
  card.appendChild(checkboxInput({
    label: 'Historical-group concordance',
    field: 'historicalGroupConcordant',
    text: 'Current group is concordant with the historical group on record'
  }));
  card.appendChild(conditionalAlert({
    id: 'alert-abo-discrepancy',
    type: 'error',
    heading: 'ABO discrepancy.',
    message: 'The current group is not concordant with the historical group. This is a possible Wrong-Blood-in-Tube / identity event: it auto-escalates the follow-up urgency to a critical alert. Do not issue until the discrepancy is resolved.',
    when: (r) => isAboDiscrepancy(r)
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Antibody Screen',
    description: 'The antibody screen result and any red-cell alloantibodies identified.'
  });

  card.appendChild(selectInput({
    label: 'Antibody screen result',
    field: 'antibodyScreenResult',
    options: [
      { value: 'negative', label: 'Negative' },
      { value: 'positive', label: 'Positive' }
    ]
  }));
  card.appendChild(textArea({
    label: 'Antibodies identified',
    field: 'antibodiesIdentified', rows: 3,
    hint: 'Specificity of any alloantibodies and the antigen-negative requirements arising.',
    placeholder: 'e.g. Anti-K identified; K-negative units required…'
  }));
  card.appendChild(conditionalAlert({
    id: 'alert-antibodies-positive',
    type: 'warning',
    heading: 'Clinically-significant antibodies.',
    message: 'A positive antibody screen requires antigen-negative unit selection and escalates the follow-up urgency. Record the antibody specificity above.',
    when: (r) => r.antibodyScreenResult === 'positive'
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Crossmatch & Components',
    description: 'The crossmatch / compatibility outcome, the component, unit counts, and special requirements.'
  });

  card.appendChild(selectInput({
    label: 'Crossmatch result',
    field: 'crossmatchResult',
    options: [
      { value: 'compatible', label: 'Compatible' },
      { value: 'incompatible', label: 'Incompatible' },
      { value: 'electronic-issue', label: 'Electronic issue' },
      { value: 'not-performed', label: 'Not performed' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Component',
    field: 'component',
    options: [
      { value: 'red-cells', label: 'Red cells' },
      { value: 'platelets', label: 'Platelets' },
      { value: 'fresh-frozen-plasma', label: 'Fresh frozen plasma' },
      { value: 'cryoprecipitate', label: 'Cryoprecipitate' },
      { value: 'none', label: 'None' }
    ]
  }));
  card.appendChild(textInput({
    label: 'Units crossmatched',
    field: 'unitsCrossmatched',
    type: 'number', min: 0, max: 50, step: 1, unit: 'units',
    hint: 'Number of units crossmatched / tested (0-50).'
  }));
  card.appendChild(textInput({
    label: 'Units available',
    field: 'unitsAvailable',
    type: 'number', min: 0, max: 50, step: 1, unit: 'units',
    hint: 'Number of compatible units available for issue (0-50).'
  }));
  card.appendChild(textArea({
    label: 'Special requirements',
    field: 'specialRequirements', rows: 2,
    hint: 'Special component requirements met or required (e.g. irradiated, CMV-negative, antigen-negative, washed).',
    placeholder: 'e.g. irradiated, CMV-negative, K-negative…'
  }));
  card.appendChild(conditionalAlert({
    id: 'alert-incompatible',
    type: 'error',
    heading: 'Incompatible crossmatch.',
    message: 'An incompatible crossmatch auto-escalates the follow-up urgency to a critical alert. Do not issue; investigate and arrange serologically compatible units.',
    when: (r) => r.crossmatchResult === 'incompatible'
  }));
  card.appendChild(conditionalAlert({
    id: 'alert-insufficient-units',
    type: 'warning',
    heading: 'Insufficient compatible units.',
    message: 'Fewer compatible units are available than were crossmatched. Order additional units as required.',
    when: (r) => r.crossmatchResult !== 'incompatible' && insufficientUnits(r)
  }));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Identity & Overall Result',
    description: 'The two-sample group-check rule, the overall result status, the findings narrative, and the impression.'
  });

  card.appendChild(checkboxInput({
    label: 'Two-sample (group-check) rule',
    field: 'twoSampleRuleMet',
    text: 'The BSH / SHOT two-sample group-check rule was satisfied before issue'
  }));
  card.appendChild(conditionalAlert({
    id: 'alert-two-sample-unmet',
    type: 'error',
    heading: 'Two-sample rule not met.',
    message: 'The two-sample group-check rule has not been satisfied. This auto-escalates the follow-up urgency to a critical alert. Obtain a second valid group-check sample before issue.',
    when: (r) => isTwoSampleRuleUnmet(r)
  }));
  card.appendChild(selectInput({
    label: 'Overall result status',
    field: 'overallResultStatus',
    options: [
      { value: 'normal', label: 'Normal' },
      { value: 'abnormal', label: 'Abnormal' },
      { value: 'critical', label: 'Critical' }
    ]
  }));
  card.appendChild(textArea({
    label: 'Findings narrative',
    field: 'findingsNarrative', rows: 5,
    placeholder: 'Narrative description of the laboratory findings (the body of the report)…'
  }));
  card.appendChild(textArea({
    label: 'Impression',
    field: 'impression', rows: 4, required: true,
    placeholder: 'Summary impression / conclusion answering the compatibility question…'
  }));
  card.appendChild(textArea({
    label: 'Recommended follow-up',
    field: 'recommendedFollowUp', rows: 3,
    placeholder: 'Repeat sample, further investigation, referral, or issue instructions…'
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Interpretation & Sign-off',
    description: 'Live four-axis interpretation grade, critical-result communication, and sign-off.'
  });

  card.appendChild(conditionalAlert({
    id: 'alert-critical-result',
    type: 'error',
    heading: 'Critical-result alert.',
    message: 'This report contains a critical result (incompatible crossmatch, clinically-significant antibodies, ABO discrepancy, or unmet two-sample rule). Communicate the result directly to the requester and record it below before signing.',
    when: (r) => calculateGrade(r).followUpUrgency === 'critical-alert'
  }));

  card.appendChild(readOnlyReadout({
    label: 'Axis A — Classification',
    id: 'axis-a-readout',
    render: () => renderAxisReadout('a')
  }));
  card.appendChild(readOnlyReadout({
    label: 'Axis B — Severity',
    id: 'axis-b-readout',
    render: () => renderAxisReadout('b')
  }));
  card.appendChild(readOnlyReadout({
    label: 'Axis C — Completeness',
    id: 'axis-c-readout',
    render: () => renderAxisReadout('c')
  }));
  card.appendChild(readOnlyReadout({
    label: 'Axis D — Follow-up urgency',
    id: 'axis-d-readout',
    render: () => renderAxisReadout('d')
  }));

  card.appendChild(checkboxInput({
    label: 'Critical-result communication',
    field: 'criticalResultCommunicated',
    text: 'Critical / urgent result communicated to requester'
  }));
  card.appendChild(textInput({
    label: 'Reported to',
    field: 'reportedTo',
    placeholder: 'Who was informed, with date and time'
  }));
  card.appendChild(textArea({
    label: 'Interpretation / sign-off notes',
    field: 'clinicianNotes', rows: 3
  }));
  card.appendChild(checkboxInput({
    label: 'Sign-off',
    field: 'signed',
    text: 'I sign and authorise this report'
  }));

  return card;
}

// ----------------------------------------------------------------------
// Live readouts + conditional alerts
// ----------------------------------------------------------------------

/** Render the live badge for one grading axis. */
function renderAxisReadout(axis) {
  const grade = calculateGrade(state);
  switch (axis) {
    case 'a':
      return `<span class="risk-badge ${resultClassificationClass(grade.resultClassification)}">${esc(resultClassificationLabel(grade.resultClassification))}</span>`;
    case 'b':
      return `<span class="risk-badge ${abnormalitySeverityClass(grade.abnormalitySeverity)}">${esc(abnormalitySeverityLabel(grade.abnormalitySeverity))}</span>` +
        ` <span class="muted">${esc(grade.reportingCategory)}</span>`;
    case 'c':
      return `<strong>${grade.reportCompletenessPercent}%</strong> <span class="muted">of mandatory report sections present</span>`;
    case 'd':
      return `<span class="risk-badge ${followUpUrgencyClass(grade.followUpUrgency)}">${esc(followUpUrgencyLabel(grade.followUpUrgency))}</span>` +
        ` <span class="muted">${esc(grade.targetTimeframe)}</span>`;
    default:
      return '';
  }
}

function refreshLiveGrade() {
  for (const axis of ['a', 'b', 'c', 'd']) {
    const el = document.getElementById(`axis-${axis}-readout`);
    if (el) el.innerHTML = renderAxisReadout(axis);
  }
  for (const alert of conditionalAlerts) {
    const el = document.getElementById(alert.id);
    if (el) el.hidden = !alert.when(state);
  }
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

// Each step maps to one or more progress "slots". A slot is a list of fields;
// the slot counts as answered when ANY of its fields is answered. Boolean
// fields count as answered when ticked.
const STEP_SLOTS = {
  1: [['reportingClinician'], ['requestType'], ['reportStatus'], ['performedDate'], ['reportedDate']],
  2: [['clinicalHistory']],
  3: [['aboGroup'], ['rhdGroup']],
  4: [['antibodyScreenResult']],
  5: [['crossmatchResult'], ['component'], ['unitsCrossmatched'], ['unitsAvailable']],
  6: [['overallResultStatus'], ['findingsNarrative'], ['impression']],
  7: [['signed']]
};

function isAnswered(field) {
  const v = state[field];
  return v !== null && v !== undefined && v !== '' && v !== false;
}

function updateProgress() {
  let answered = 0;
  let total = 0;
  const stepAnswered = {};
  const stepTotal = {};

  for (const step of Object.keys(STEP_SLOTS)) {
    const slots = STEP_SLOTS[step];
    stepTotal[step] = slots.length;
    stepAnswered[step] = 0;
    for (const slot of slots) {
      total++;
      const slotAnswered = slot.some((field) => isAnswered(field));
      if (slotAnswered) {
        answered++;
        stepAnswered[step]++;
      }
    }
  }

  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(stepAnswered, stepTotal);
}

// ----------------------------------------------------------------------
// Submit / Report
// ----------------------------------------------------------------------

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const g = lastResult;

  const summaryRows = [
    ['Request type', requestTypeLabel(state.requestType)],
    ['Report status', reportStatusLabel(state.reportStatus)],
    ['Blood group', bloodGroupLabel(state.aboGroup, state.rhdGroup)],
    ['Antibody screen', state.antibodyScreenResult === '' ? 'Not recorded' : (state.antibodyScreenResult === 'positive' ? 'Positive' : 'Negative')],
    ['Crossmatch result', crossmatchResultLabel(state.crossmatchResult)],
    ['Component', componentLabel(state.component)],
    ['Units crossmatched', state.unitsCrossmatched === null ? 'Not recorded' : String(state.unitsCrossmatched)],
    ['Units available', state.unitsAvailable === null ? 'Not recorded' : String(state.unitsAvailable)],
    ['Two-sample rule met', state.twoSampleRuleMet ? 'Yes' : 'No'],
    ['Historical group concordant', state.historicalGroupConcordant ? 'Yes' : 'No'],
    ['Signed', state.signed ? 'Yes' : 'No']
  ].map(([name, value]) => `
    <tr>
      <th scope="row">${esc(name)}</th>
      <td>${esc(value)}</td>
    </tr>
  `).join('');

  const axisRows = [
    ['Axis A — Result classification',
      `<span class="risk-badge ${resultClassificationClass(g.resultClassification)}">${esc(resultClassificationLabel(g.resultClassification))}</span>`],
    ['Axis B — Abnormality severity',
      `<span class="risk-badge ${abnormalitySeverityClass(g.abnormalitySeverity)}">${esc(abnormalitySeverityLabel(g.abnormalitySeverity))}</span> <span class="muted">${esc(g.reportingCategory)}</span>`],
    ['Axis C — Report completeness', `<strong>${g.reportCompletenessPercent}%</strong>`],
    ['Axis D — Follow-up urgency',
      `<span class="risk-badge ${followUpUrgencyClass(g.followUpUrgency)}">${esc(followUpUrgencyLabel(g.followUpUrgency))}</span> <span class="muted">${esc(g.targetTimeframe)}</span>`]
  ].map(([name, html]) => `
    <tr>
      <th scope="row">${esc(name)}</th>
      <td>${html}</td>
    </tr>
  `).join('');

  const rulesList = g.firedRules.length === 0
    ? `<p class="muted">No rules fired.</p>`
    : `
      <ul class="flags">
        ${g.firedRules.map((r) => `
          <li>
            <span class="flag-category">${esc(r.ruleId)}</span>
            <span class="flag-message">${esc(r.description)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const flagsList = g.flags.length === 0
    ? `<p class="muted">No safety flags raised.</p>`
    : `
      <ul class="flags">
        ${g.flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Blood Cross-Match Test Result — Interpretation Report</h2>
        <p class="muted">Graded ${esc(new Date(g.gradedAt).toLocaleString('en-GB'))}</p>
      </header>

      <div class="risk-banner ${resultClassificationClass(g.resultClassification)}">
        <div>
          <span class="risk-banner-label">Result classification</span>
          <span class="risk-banner-value">${esc(resultClassificationLabel(g.resultClassification))}</span>
        </div>
        <span class="risk-badge ${followUpUrgencyClass(g.followUpUrgency)}">${esc(followUpUrgencyLabel(g.followUpUrgency))}</span>
      </div>

      <h3>Four-axis interpretation grade</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Axis</th>
            <th scope="col">Grade</th>
          </tr>
        </thead>
        <tbody>${axisRows}</tbody>
      </table>

      <h3>Recommendation</h3>
      <p>
        <span class="risk-badge ${followUpUrgencyClass(g.followUpUrgency)}">${esc(recommendationLabel(g.recommendation))}</span>
        ${esc(g.recommendedAction)}
      </p>

      <h3>Structured findings</h3>
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">Finding</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>${summaryRows}</tbody>
      </table>

      <h3>Flagged issues (${g.flags.length})</h3>
      ${flagsList}

      <h3>Fired rules (${g.firedRules.length})</h3>
      ${rulesList}

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
  lastResult = calculateGrade(state);
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh report?')) return;
  clearState();
  state = emptyResult();
  lastResult = null;
  const _rep = document.getElementById('report');
  if (_rep) _rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  refreshLiveGrade();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, title: 'Identification' },
  { step: 2, title: 'Context' },
  { step: 3, title: 'Grouping' },
  { step: 4, title: 'Antibodies' },
  { step: 5, title: 'Crossmatch' },
  { step: 6, title: 'Result' },
  { step: 7, title: 'Sign-off' }
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

function updateStepListStatuses(stepAnswered, stepTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = stepAnswered[def.step] || 0;
    const t = stepTotal[def.step] || 0;
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
}

function setFieldError(id, message) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function validateForm() {
  const errors = [];
  const form = document.getElementById('report-form');
  if (!form) return errors;
  const required = form.querySelectorAll('input[data-required], select[data-required], textarea[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    let id = input.id;
    if (input.type === 'radio') id = input.name;
    if (seen.has(id)) return;
    seen.add(id);
    let value = '';
    if (input.type === 'radio') {
      const chosen = form.querySelector(`input[name="${id}"]:checked`);
      value = chosen ? chosen.value : '';
    } else {
      value = (input.value || '').trim();
    }
    if (!value) {
      const labelEl = form.querySelector(`label[for="${id}"]`);
      const labelText = labelEl
        ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim()
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
  conditionalAlerts.length = 0;
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
  refreshLiveGrade();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
