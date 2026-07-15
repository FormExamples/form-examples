import { detectFlags } from './flags.js';
import { calculateGrade } from './grader.js';
import { abnormalitySeverityClass, abnormalitySeverityLabel, biopsyMethodLabel, biopsySiteLabel, emptyResult, followUpUrgencyClass, followUpUrgencyLabel, histologicalGradeLabel, priorityLabel, recommendationLabel, reportStatusLabel, resectionMarginsLabel, resultClassificationClass, resultClassificationLabel, specimenAdequacyLabel } from './types.js';

// Biopsy Test Result — single-page report wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every report section is rendered into the page
// in document order. The reporting clinician scrolls through the seven sections;
// a sticky top-of-page progress summary reflects how many fields have been
// answered and a live four-axis interpretation grade updates as the report is
// entered. Submission runs the pure grading engine (four axes + safety flags)
// and renders an inline histopathology report. State is persisted to
// localStorage so a partial fill survives a page reload.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'biopsy-test-result.front-end-with-html.v1';

/** @returns {import('./types.js').BiopsyResult} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyResult();
    const parsed = JSON.parse(raw);
    // Merge over a fresh empty so any newly-added fields default correctly.
    return { ...emptyResult(), ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch (e) {
    console.warn('Could not parse saved report; starting fresh.', e);
    return emptyResult();
  }
}

/** @param {import('./types.js').BiopsyResult} state */
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

/** @type {import('./types.js').BiopsyResult} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

const TOTAL_STEPS = 7;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a top-level field on the state and persist. Re-runs progress,
 * conditional visibility, and the live-grade readout after each change.
 *
 * @param {string} field
 * @param {*} value
 */
function setField(field, value) {
  state[field] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
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

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}"${opts.required ? ' data-required' : ''}>${labelText}</label>
    ${opts.hint ? `<span class="hint" id="${id}-hint">${esc(opts.hint)}</span>` : ''}
    <input ${attrs.join(' ')}>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    setField(opts.field, input.value);
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
      aria-describedby="${id}-error"
      class="text-area-input"${opts.required ? ' required data-required' : ''}>${esc(value)}</textarea>
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

/** A single boolean checkbox bound to a top-level boolean field. */
function checkboxInput(opts) {
  const id = opts.field;
  const checked = state[opts.field] === true;
  const wrapper = document.createElement('div');
  wrapper.className = 'field check-field';
  wrapper.innerHTML = `
    <div class="checkbox-group">
      <label class="checkbox-input" for="${id}">
        <input class="checkbox-input" type="checkbox" id="${id}" name="${id}"${checked ? ' checked' : ''}>
        <span>${esc(opts.label)}</span>
      </label>
    </div>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setField(opts.field, input.checked);
  });
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
// Section renderers (1 per report step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Report Identification',
    description: 'Who authored the report, the originating request, and key dates.'
  });

  card.appendChild(textInput({
    label: 'Reporting clinician',
    field: 'reportingClinician', required: true,
    placeholder: 'e.g. Dr A Histopathologist'
  }));
  card.appendChild(textInput({
    label: 'Originating request reference',
    field: 'originatingRequestReference',
    placeholder: 'e.g. REQ-1001',
    hint: 'Leave blank if unknown — an unexpected malignancy with no request auto-escalates to critical.'
  }));
  card.appendChild(selectInput({
    label: 'Report status',
    field: 'reportStatus', required: true,
    options: [
      { value: 'preliminary', label: 'Preliminary' },
      { value: 'final', label: 'Final' },
      { value: 'amended', label: 'Amended' },
      { value: 'supplementary', label: 'Supplementary' },
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
    title: 'Specimen & Procedure',
    description: 'The anatomical site, biopsy method, and specimen adequacy.'
  });

  card.appendChild(selectInput({
    label: 'Biopsy site',
    field: 'biopsySite', required: true,
    options: [
      { value: 'skin', label: 'Skin' },
      { value: 'breast', label: 'Breast' },
      { value: 'lymph-node', label: 'Lymph node' },
      { value: 'liver', label: 'Liver' },
      { value: 'kidney', label: 'Kidney' },
      { value: 'prostate', label: 'Prostate' },
      { value: 'lung', label: 'Lung' },
      { value: 'bone-marrow', label: 'Bone marrow' },
      { value: 'gi-tract', label: 'GI tract' },
      { value: 'thyroid', label: 'Thyroid' },
      { value: 'soft-tissue', label: 'Soft tissue' },
      { value: 'other', label: 'Other' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Biopsy method',
    field: 'biopsyMethod',
    options: [
      { value: 'punch', label: 'Punch' },
      { value: 'excision', label: 'Excision' },
      { value: 'incision', label: 'Incision' },
      { value: 'core-needle', label: 'Core needle' },
      { value: 'fine-needle-aspiration', label: 'Fine-needle aspiration' },
      { value: 'image-guided', label: 'Image-guided' },
      { value: 'endoscopic', label: 'Endoscopic' },
      { value: 'other', label: 'Other' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Specimen adequacy',
    field: 'specimenAdequacy',
    options: [
      { value: 'adequate', label: 'Adequate' },
      { value: 'suboptimal', label: 'Suboptimal' },
      { value: 'inadequate', label: 'Inadequate' }
    ]
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Clinical History',
    description: 'The clinical question and any comparison with previous histopathology.'
  });

  card.appendChild(textArea({
    label: 'Clinical history',
    field: 'clinicalHistory', rows: 3,
    placeholder: 'Clinical history and the question the biopsy was performed to answer…'
  }));
  card.appendChild(textArea({
    label: 'Comparison with previous histopathology',
    field: 'comparisonWithPrevious', rows: 3,
    placeholder: 'Relevant previous histopathology or cytology and changes since…'
  }));

  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Description',
    description: 'The macroscopic (gross) and microscopic (histological) descriptions.'
  });

  card.appendChild(textArea({
    label: 'Macroscopic description',
    field: 'macroscopicDescription', rows: 4,
    placeholder: 'Macroscopic (gross) description of the specimen as received…'
  }));
  card.appendChild(textArea({
    label: 'Microscopic description',
    field: 'microscopicDescription', rows: 5,
    placeholder: 'Microscopic (histological) description of the specimen…'
  }));

  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Diagnosis & Grading',
    description: 'The definitive diagnosis, malignancy status, grade, margins, and ancillary tests.'
  });

  card.appendChild(textArea({
    label: 'Diagnosis',
    field: 'diagnosis', rows: 4,
    placeholder: 'Definitive histopathological diagnosis (the body of the report)…'
  }));
  card.appendChild(checkboxInput({
    label: 'Malignancy present',
    field: 'malignancyPresent'
  }));
  card.appendChild(checkboxInput({
    label: 'Lymphovascular invasion',
    field: 'lymphovascularInvasion'
  }));
  card.appendChild(textInput({
    label: 'Tumour type',
    field: 'tumourType',
    placeholder: 'e.g. invasive ductal carcinoma, squamous cell carcinoma'
  }));
  card.appendChild(selectInput({
    label: 'Histological grade',
    field: 'histologicalGrade',
    options: [
      { value: 'well-differentiated', label: 'Well differentiated (G1)' },
      { value: 'moderately-differentiated', label: 'Moderately differentiated (G2)' },
      { value: 'poorly-differentiated', label: 'Poorly differentiated (G3)' },
      { value: 'undifferentiated', label: 'Undifferentiated (G4)' },
      { value: 'not-applicable', label: 'Not applicable' }
    ]
  }));
  card.appendChild(selectInput({
    label: 'Resection margins',
    field: 'resectionMargins',
    options: [
      { value: 'clear', label: 'Clear' },
      { value: 'involved', label: 'Involved' },
      { value: 'close', label: 'Close' },
      { value: 'not-applicable', label: 'Not applicable' }
    ]
  }));
  card.appendChild(textArea({
    label: 'Immunohistochemistry',
    field: 'immunohistochemistry', rows: 3,
    placeholder: 'Immunohistochemistry panel results and interpretation…'
  }));
  card.appendChild(textArea({
    label: 'Molecular results',
    field: 'molecularResults', rows: 3,
    placeholder: 'Molecular / genetic test results relevant to diagnosis or therapy…'
  }));
  card.appendChild(textInput({
    label: 'SNOMED CT code',
    field: 'snomedCode',
    placeholder: 'SNOMED CT morphology / topography code'
  }));

  // Critical-finding alert (conditional).
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.dataset.type = 'error';
  alert.setAttribute('role', 'alert');
  alert.id = 'critical-finding-alert';
  alert.hidden = true;
  alert.innerHTML =
    '<strong>Critical finding selected.</strong> ' +
    'An involved resection margin or an unexpected malignancy auto-escalates the ' +
    'follow-up urgency to a critical alert and urgent MDT. Ensure the result is ' +
    'communicated to the referrer on sign-off.';
  card.appendChild(alert);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Impression',
    description: 'The summary impression, reporting category, and recommended follow-up.'
  });

  card.appendChild(textArea({
    label: 'Impression',
    field: 'impression', required: true, rows: 4,
    placeholder: 'Summary impression / conclusion answering the clinical question…'
  }));
  card.appendChild(textInput({
    label: 'Reporting category',
    field: 'reportingCategory',
    placeholder: 'e.g. RCPath dataset / TNM8 category',
    hint: 'An RCPath cancer-dataset or TNM8 category label, if applicable.'
  }));
  card.appendChild(textArea({
    label: 'Recommended follow-up',
    field: 'recommendedFollowUp', rows: 3,
    placeholder: 'Recommended follow-up, MDT discussion, referral, or management…'
  }));

  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Interpretation & Sign-off',
    description: 'Live four-axis interpretation grade, critical-result communication, and sign-off.'
  });

  // Critical-result alert (conditional).
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.dataset.type = 'error';
  alert.setAttribute('role', 'alert');
  alert.id = 'critical-result-alert';
  alert.hidden = true;
  alert.innerHTML =
    '<strong>Critical-result alert.</strong> ' +
    'This report contains a critical finding. Communicate the result directly to ' +
    'the referrer and record it below before signing.';
  card.appendChild(alert);

  card.appendChild(readOnlyReadout({
    label: 'Live four-axis interpretation grade',
    id: 'live-grade-readout',
    render: () => renderLiveGrade()
  }));

  card.appendChild(checkboxInput({
    label: 'Critical / urgent result communicated to referrer',
    field: 'criticalResultCommunicated'
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
    label: 'I sign and authorise this report',
    field: 'signed'
  }));

  return card;
}

// ----------------------------------------------------------------------
// Live readouts
// ----------------------------------------------------------------------

/** Render a single axis badge cell. */
function axisBadge(label, value, labelFn, classFn) {
  return `
    <div class="axis-cell">
      <span class="axis-label">${esc(label)}</span>
      <span class="risk-badge ${classFn(value)}">${esc(labelFn(value))}</span>
    </div>
  `;
}

/** Render the live four-axis interpretation grade grid. */
function renderLiveGrade() {
  const g = calculateGrade(state);
  const category = g.reportingCategory
    ? ` <span class="muted">${esc(g.reportingCategory)}</span>` : '';
  return `
    <div class="axis-grid">
      ${axisBadge('Axis A — Classification', g.resultClassification, resultClassificationLabel, resultClassificationClass)}
      <div class="axis-cell">
        <span class="axis-label">Axis B — Severity</span>
        <span class="risk-badge ${abnormalitySeverityClass(g.abnormalitySeverity)}">${esc(abnormalitySeverityLabel(g.abnormalitySeverity))}</span>${category}
      </div>
      <div class="axis-cell">
        <span class="axis-label">Axis C — Completeness</span>
        <strong>${g.reportCompletenessPercent}%</strong>
      </div>
      <div class="axis-cell">
        <span class="axis-label">Axis D — Follow-up urgency</span>
        <span class="risk-badge ${followUpUrgencyClass(g.followUpUrgency)}">${esc(followUpUrgencyLabel(g.followUpUrgency))}</span>
        <span class="muted">${esc(g.targetTimeframe)}</span>
      </div>
    </div>
  `;
}

function refreshLiveGrade() {
  const live = document.getElementById('live-grade-readout');
  if (live) live.innerHTML = renderLiveGrade();
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

function updateConditionalSections() {
  const g = calculateGrade(state);
  const critical = g.followUpUrgency === 'critical-alert';

  const findingAlert = document.getElementById('critical-finding-alert');
  if (findingAlert) findingAlert.hidden = !critical;

  const resultAlert = document.getElementById('critical-result-alert');
  if (resultAlert) resultAlert.hidden = !critical;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

// Each step maps to one or more progress "slots". A slot is a list of fields;
// the slot counts as answered when ANY of its fields is answered.
const STEP_SLOTS = {
  1: [['reportingClinician'], ['reportStatus'], ['performedDate'], ['reportedDate']],
  2: [['biopsySite'], ['biopsyMethod'], ['specimenAdequacy']],
  3: [['clinicalHistory'], ['comparisonWithPrevious']],
  4: [['macroscopicDescription'], ['microscopicDescription']],
  5: [['diagnosis'], ['histologicalGrade'], ['resectionMargins']],
  6: [['impression'], ['recommendedFollowUp']],
  7: [['reportedTo', 'criticalResultCommunicated'], ['signed']]
};

function isAnswered(field) {
  const v = state[field];
  if (typeof v === 'boolean') return v === true;
  return v !== null && v !== undefined && v !== '';
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

  const g = lastResult;

  const axisRows = [
    ['Axis A — Result classification', resultClassificationLabel(g.resultClassification), resultClassificationClass(g.resultClassification)],
    ['Axis B — Abnormality severity', abnormalitySeverityLabel(g.abnormalitySeverity) + (g.reportingCategory ? ` (${g.reportingCategory})` : ''), abnormalitySeverityClass(g.abnormalitySeverity)],
    ['Axis C — Report completeness', `${g.reportCompletenessPercent}%`, ''],
    ['Axis D — Follow-up urgency', followUpUrgencyLabel(g.followUpUrgency) + ` — ${g.targetTimeframe}`, followUpUrgencyClass(g.followUpUrgency)]
  ].map(([name, value, cls]) => `
    <tr>
      <th scope="row">${esc(name)}</th>
      <td>${cls ? `<span class="risk-badge ${cls}">${esc(value)}</span>` : esc(value)}</td>
    </tr>
  `).join('');

  const specimenRows = [
    ['Reporting clinician', esc(state.reportingClinician) || '—'],
    ['Report status', reportStatusLabel(state.reportStatus)],
    ['Biopsy site', biopsySiteLabel(state.biopsySite)],
    ['Biopsy method', biopsyMethodLabel(state.biopsyMethod)],
    ['Specimen adequacy', specimenAdequacyLabel(state.specimenAdequacy)],
    ['Histological grade', histologicalGradeLabel(state.histologicalGrade)],
    ['Resection margins', resectionMarginsLabel(state.resectionMargins)]
  ].map(([name, value]) => `
    <tr>
      <th scope="row">${esc(name)}</th>
      <td>${value}</td>
    </tr>
  `).join('');

  const flags = g.flags;
  const flagsList = flags.length === 0
    ? `<p class="muted">No safety flags raised.</p>`
    : `
      <ul class="flags">
        ${flags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority))}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.description)}${f.suggestedAction ? ` — ${esc(f.suggestedAction)}` : ''}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const firedList = g.firedRules.length === 0
    ? `<p class="muted">No rules fired.</p>`
    : `
      <ul class="fired-rules">
        ${g.firedRules.map((r) => `
          <li>
            <span class="rule-id">${esc(r.ruleId)}</span>
            <span class="rule-axis">${esc(r.axis)}</span>
            <span class="rule-desc">${esc(r.description)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const bandClass = followUpUrgencyClass(g.followUpUrgency);

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Biopsy Histopathology Report</h2>
        <p class="muted">Generated ${esc(new Date(g.gradedAt).toLocaleString())}</p>
      </header>

      <div class="risk-banner ${bandClass}">
        <div>
          <span class="risk-banner-label">Overall recommendation</span>
          <span class="risk-banner-value">${esc(recommendationLabel(g.recommendation))}</span>
        </div>
        <span class="risk-badge ${bandClass}">${esc(followUpUrgencyLabel(g.followUpUrgency))}</span>
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

      <h3>Recommended action</h3>
      <p>${esc(g.recommendedAction)}</p>

      <h3>Specimen and diagnosis</h3>
      <table class="subscales">
        <tbody>${specimenRows}</tbody>
      </table>

      <h3>Safety flags (${flags.length})</h3>
      ${flagsList}

      <h3>Fired rules (${g.firedRules.length})</h3>
      ${firedList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  lastResult = calculateGrade(state);
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh report?')) return;
  clearState();
  state = emptyResult();
  lastResult = null;
  const rep = document.getElementById('report');
  if (rep) rep.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshLiveGrade();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ----------------------------------------------------------------------
// Step list (table of contents + completion status)
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, title: 'Identification' },
  { step: 2, title: 'Specimen' },
  { step: 3, title: 'History' },
  { step: 4, title: 'Description' },
  { step: 5, title: 'Diagnosis' },
  { step: 6, title: 'Impression' },
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
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  const required = form.querySelectorAll(
    'input[data-required], select[data-required], textarea[data-required]'
  );
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
  refreshLiveGrade();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
