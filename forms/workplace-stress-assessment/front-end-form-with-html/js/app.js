// Workplace Stress Assessment - employee wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard implementing the 35-item HSE Management
// Standards Indicator Tool. Sections render in document order; the user
// scrolls through them. A sticky top-of-page progress summary reflects how
// many fields have been answered. Submission runs the pure scoring engine
// (per-domain mean → percentile category → overall worst category) and
// renders an inline report. State is persisted to localStorage so a
// partial fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.WorkplaceStressAssessment`. Pulling them off here
// keeps the rest of this file referring to short local names. The whole
// file is wrapped in an IIFE so its top-level identifiers don't leak to
// the global scope.

(function () {
'use strict';

const NS = window.WorkplaceStressAssessment;
const {
  emptyAssessment,
  riskLevelLabel,
  riskLevelClass,
  LIKERT_FREQUENCY,
  LIKERT_AGREEMENT,
  DOMAINS,
  stressItems,
  DEPARTMENT_OPTIONS,
  TENURE_OPTIONS,
  HOURS_OPTIONS,
  gradeStress,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'workplace-stress-assessment.front-end-form-with-html.v1';

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
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').GradingResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

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
    <select id="${id}" name="${id}" class="select-input">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
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
      class="textarea">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a 1-5 Likert radio group for a single HSE item.
 *
 * @param {{ id: string, domain: string, label: string,
 *           scale: 'frequency' | 'agreement' }} item
 */
function likertGroup(item) {
  const groupName = `${item.domain}-${item.id}`;
  const current = state[item.domain]?.[item.id];

  const fieldset = document.createElement('fieldset');
  fieldset.className = 'field likert-group';

  const legend = document.createElement('legend');
  legend.innerHTML =
    `<span class="item-id">${esc(item.id.toUpperCase())}</span>` +
    esc(item.label);
  fieldset.appendChild(legend);

  const opts = item.scale === 'agreement' ? LIKERT_AGREEMENT : LIKERT_FREQUENCY;
  const list = document.createElement('div');
  list.className = 'likert-options';

  for (const opt of opts) {
    const radioId = `${groupName}-${opt.value}`;
    const label = document.createElement('label');
    label.className = 'likert-option';
    label.htmlFor = radioId;
    const checked = current === opt.value ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupName}" value="${opt.value}"${checked}>
      <span class="likert-num">${opt.value}</span>
      <span class="likert-label">${esc(opt.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setField(item.domain, item.id, opt.value);
    });
    list.appendChild(label);
  }
  fieldset.appendChild(list);
  return fieldset;
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
      <span class="section-step">Step ${opts.stepNumber} of 9</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1Demographics() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'About you',
    description:
      'Anonymous, non-identifying details only. These help group results in the dashboard but cannot single out an individual.'
  });

  card.appendChild(selectInput({
    label: 'Department / function',
    section: 'demographics',
    field: 'department',
    options: DEPARTMENT_OPTIONS
  }));
  card.appendChild(selectInput({
    label: 'Tenure (how long you have been in your current role)',
    section: 'demographics',
    field: 'tenureBand',
    options: TENURE_OPTIONS
  }));
  card.appendChild(selectInput({
    label: 'Working hours (typical week)',
    section: 'demographics',
    field: 'hoursBand',
    options: HOURS_OPTIONS
  }));

  return card;
}

/**
 * Render a domain step — a section card containing one Likert item
 * fieldset per HSE statement in that domain.
 *
 * @param {{ key: string, title: string, stepNumber: number, description?: string }} domain
 */
function renderDomainStep(domain) {
  const card = sectionCard({
    stepNumber: domain.stepNumber,
    title: domain.title,
    description: domain.description
  });

  const items = stressItems.filter((it) => it.domain === domain.key);
  for (const item of items) {
    card.appendChild(likertGroup(item));
  }
  return card;
}

function renderStep9AdditionalComments() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Additional comments',
    description:
      'Optional free-text feedback. Please do not include names or contact details — your responses are anonymous.'
  });

  card.appendChild(textArea({
    label: 'What is the most stressful aspect of your work right now?',
    section: 'additionalComments',
    field: 'mostStressfulAspect',
    placeholder: 'Describe the situation, not the people involved…',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'What changes would most reduce work-related stress for you?',
    section: 'additionalComments',
    field: 'suggestionsForImprovement',
    placeholder: 'e.g. clearer priorities, smaller meetings, better tools…',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Any other comments?',
    section: 'additionalComments',
    field: 'otherComments',
    placeholder: 'Anything else you would like occupational health to know…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = (() => {
  /** @type {[string, string][]} */
  const fields = [
    ['demographics', 'department'],
    ['demographics', 'tenureBand'],
    ['demographics', 'hoursBand']
  ];
  for (const item of stressItems) {
    fields.push([item.domain, item.id]);
  }
  return fields;
})();

function isAnswered(v) {
  return v !== null && v !== undefined && v !== '';
}

function updateProgress() {
  let answered = 0;
  for (const [section, field] of TRACKED_FIELDS) {
    if (isAnswered(state[section]?.[field])) answered++;
  }
  const total = TRACKED_FIELDS.length;
  const percent = total === 0 ? 0 : Math.round((answered / total) * 100);
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
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

const DOMAIN_DISPLAY_ORDER = [
  { key: 'demands',        label: 'Demands' },
  { key: 'control',        label: 'Control' },
  { key: 'managerSupport', label: 'Manager Support' },
  { key: 'peerSupport',    label: 'Peer Support' },
  { key: 'relationships',  label: 'Relationships' },
  { key: 'role',           label: 'Role Clarity' },
  { key: 'change',         label: 'Organisational Change' }
];

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const { domains, overallRisk, answeredCount, additionalFlags, timestamp } = lastResult;

  // Per-domain breakdown table.
  const domainRows = DOMAIN_DISPLAY_ORDER.map(({ key, label }) => {
    const r = domains[key];
    if (!r) return '';
    const meanText = r.mean === null
      ? '<span class="muted">No answers</span>'
      : r.mean.toFixed(2);
    const badge = r.category
      ? `<span class="risk-badge ${esc(riskLevelClass(r.category))}">${esc(riskLevelLabel(r.category))}</span>`
      : '<span class="muted">—</span>';
    return `
      <tr>
        <th scope="row">${esc(label)}</th>
        <td class="num">${meanText}</td>
        <td class="num">${r.answeredCount} / ${r.totalCount}</td>
        <td>${badge}</td>
      </tr>
    `;
  }).join('');

  const domainTable = `
    <table class="domains">
      <thead>
        <tr>
          <th scope="col">Domain</th>
          <th scope="col">Mean (1–5)</th>
          <th scope="col">Answered</th>
          <th scope="col">Concern</th>
        </tr>
      </thead>
      <tbody>${domainRows}</tbody>
    </table>
  `;

  // Flags.
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

  // Anonymous demographic summary (group-level; never individually
  // identifying because we only collected broad bands).
  const demoBits = [];
  const demoLabel = (opts, value) =>
    (opts.find((o) => o.value === value) || {}).label || '';
  const dept = demoLabel(DEPARTMENT_OPTIONS, state.demographics.department);
  const tenure = demoLabel(TENURE_OPTIONS, state.demographics.tenureBand);
  const hours = demoLabel(HOURS_OPTIONS, state.demographics.hoursBand);
  if (dept) demoBits.push(`Department: ${dept}`);
  if (tenure) demoBits.push(`Tenure: ${tenure}`);
  if (hours) demoBits.push(`Hours: ${hours}`);
  const demoLine = demoBits.length
    ? `<p class="muted">${esc(demoBits.join(' • '))}</p>`
    : `<p class="muted">No demographic banding entered.</p>`;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Workplace Stress Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())} · anonymous response</p>
      </header>

      <h3>Overall risk</h3>
      <p class="overall-summary">
        ${overallRisk
          ? `<span class="risk-badge ${esc(riskLevelClass(overallRisk))}">${esc(riskLevelLabel(overallRisk))}</span>`
          : '<span class="muted">No items answered yet.</span>'}
        <span class="muted">${answeredCount} of 35 items answered</span>
      </p>
      <p class="muted">
        Overall risk reflects the worst-performing of the seven HSE domains.
        Means are benchmarked against the indicative HSE 2007 norms (20th, 50th
        and 80th percentile cut-offs).
      </p>

      <h3>Per-domain breakdown</h3>
      ${domainTable}

      <h3>Anonymous response context</h3>
      ${demoLine}

      <h3>Flagged issues</h3>
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
  const grading = gradeStress(state);
  const additionalFlags = detectAdditionalFlags(state, grading.domains);
  lastResult = {
    domains: grading.domains,
    overallRisk: grading.overallRisk,
    answeredCount: grading.answeredCount,
    firedRules: grading.firedRules,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh assessment?')) return;
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
  host.appendChild(renderStep1Demographics());

  // Steps 2-8 = the seven HSE domains, in canonical order.
  for (const domain of DOMAINS) {
    host.appendChild(renderDomainStep(domain));
  }

  host.appendChild(renderStep9AdditionalComments());
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
