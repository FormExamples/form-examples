// Encounter Satisfaction Survey - patient wizard (vanilla JavaScript,
// no build).
//
// Single-page continuous wizard: every section is rendered into the page
// in document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many of the 19 ESS Likert questions have
// been answered. Submission runs the pure ESS scoring engine and renders
// an inline report. State is persisted to localStorage so a partial fill
// survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.EncounterSatisfaction`. Pulling them off here keeps
// the rest of this file referring to short local names. Whole file is
// wrapped in an IIFE so its top-level identifiers don't leak globally.
(function () {
'use strict';

const NS = window.EncounterSatisfaction;
const {
  emptyAssessment,
  satisfactionCategory,
  categoryClass,
  satisfactionQuestions,
  likertResponseOptions,
  calculateSatisfaction,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'encounter-satisfaction.front-end-form-with-html.v1';
const TOTAL_STEPS = 8;

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
    console.warn('Could not parse saved survey; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save survey to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored survey.', e);
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
 *
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
      class="textarea">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.section, opts.field, ta.value));
  return wrapper;
}

/**
 * Build a select / dropdown input.
 * @param {{ label: string, section: string, field: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function selectInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field] ?? '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const wrapper = document.createElement('div');
  wrapper.className = 'field';

  const optionsHtml = [
    `<option value="">— Select —</option>`,
    ...opts.options.map((o) =>
      `<option value="${esc(o.value)}"${o.value === current ? ' selected' : ''}>${esc(o.label)}</option>`
    )
  ].join('');

  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <select id="${id}" name="${id}" class="select-input">
      ${optionsHtml}
    </select>
  `;
  const sel = wrapper.querySelector('select');
  sel.addEventListener('change', () => setField(opts.section, opts.field, sel.value));
  return wrapper;
}

/**
 * Build a radio group for free-form text values.
 * @param {{ label: string, section: string, field: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.textContent = opts.label + (opts.required ? ' *' : '');
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
 * Likert (1-5) radio question.
 * @param {{ id: string, text: string, section: string, field: string }} opts
 */
function likertQuestion(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];

  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group likert-question';

  const legend = document.createElement('legend');
  legend.className = 'question-text';
  legend.innerHTML = `<span class="question-id">${esc(opts.id)}</span> ${esc(opts.text)}`;
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of likertResponseOptions) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.className = 'radio-option';
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
      <span>${option.value} - ${esc(option.label)}</span>
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
      <span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({
    label: 'First Name', section: 'demographics', field: 'firstName',
    required: true
  }));
  grid.appendChild(textInput({
    label: 'Last Name', section: 'demographics', field: 'lastName',
    required: true
  }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of Birth',
    section: 'demographics', field: 'dateOfBirth',
    type: 'date', required: true
  }));

  card.appendChild(radioGroup({
    label: 'Sex',
    section: 'demographics', field: 'sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Visit Information',
    description: 'Details about your recent healthcare visit.'
  });

  card.appendChild(textInput({
    label: 'Visit Date',
    section: 'visitInformation', field: 'visitDate',
    type: 'date', required: true
  }));
  card.appendChild(textInput({
    label: 'Department / Clinic',
    section: 'visitInformation', field: 'department',
    placeholder: 'e.g. Primary Care, Cardiology',
    required: true
  }));
  card.appendChild(textInput({
    label: 'Provider Name',
    section: 'visitInformation', field: 'providerName',
    placeholder: 'e.g. Dr. Smith',
    required: true
  }));

  card.appendChild(selectInput({
    label: 'Visit Type',
    section: 'visitInformation', field: 'visitType',
    required: true,
    options: [
      { value: 'routine-checkup', label: 'Routine Check-up' },
      { value: 'follow-up', label: 'Follow-up Visit' },
      { value: 'urgent-care', label: 'Urgent Care' },
      { value: 'specialist-referral', label: 'Specialist Referral' },
      { value: 'procedure', label: 'Procedure' },
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Reason for Visit',
    section: 'visitInformation', field: 'reasonForVisit',
    placeholder: 'Briefly describe the reason for your visit',
    rows: 3
  }));

  card.appendChild(radioGroup({
    label: 'Was this your first visit to this provider?',
    section: 'visitInformation', field: 'firstVisit',
    options: yesNo, required: true
  }));

  return card;
}

/**
 * Render an ESS domain section by filtering `satisfactionQuestions`.
 * @param {{ stepNumber: number, title: string, description: string,
 *           domain: string }} opts
 */
function renderDomainSection(opts) {
  const card = sectionCard({
    stepNumber: opts.stepNumber,
    title: opts.title,
    description: opts.description
  });
  for (const q of satisfactionQuestions) {
    if (q.domain !== opts.domain) continue;
    card.appendChild(likertQuestion({
      id: q.id,
      text: q.text,
      section: q.section,
      field: q.field
    }));
  }
  return card;
}

function renderStep3() {
  return renderDomainSection({
    stepNumber: 3,
    title: 'Access & Scheduling',
    description: 'Rate how easy it was to access care for this visit.',
    domain: 'Access & Scheduling'
  });
}

function renderStep4() {
  return renderDomainSection({
    stepNumber: 4,
    title: 'Communication',
    description: 'Rate how well your provider communicated with you.',
    domain: 'Communication'
  });
}

function renderStep5() {
  return renderDomainSection({
    stepNumber: 5,
    title: 'Staff & Professionalism',
    description: 'Rate the courtesy and professionalism of the staff.',
    domain: 'Staff & Professionalism'
  });
}

function renderStep6() {
  return renderDomainSection({
    stepNumber: 6,
    title: 'Care Quality',
    description: 'Rate the quality of the care you received.',
    domain: 'Care Quality'
  });
}

function renderStep7() {
  return renderDomainSection({
    stepNumber: 7,
    title: 'Environment',
    description: 'Rate the facility environment and comfort.',
    domain: 'Environment'
  });
}

function renderStep8() {
  const card = renderDomainSection({
    stepNumber: 8,
    title: 'Overall Satisfaction',
    description: 'Overall rating and likelihood to return / recommend.',
    domain: 'Overall Satisfaction'
  });

  card.appendChild(textArea({
    label: 'Additional comments (optional)',
    section: 'overallSatisfaction', field: 'comments',
    placeholder: 'Anything else you would like to share about your visit?',
    rows: 4
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress (based on the 19 ESS Likert questions)
// ----------------------------------------------------------------------

function updateProgress() {
  let answered = 0;
  for (const q of satisfactionQuestions) {
    const v = state[q.section] ? state[q.section][q.field] : null;
    if (typeof v === 'number' && v >= 1 && v <= 5) answered++;
  }
  const total = satisfactionQuestions.length;
  const percent = Math.round((answered / total) * 100);
  const bar = document.getElementById('progress-bar-fill');
  const text = document.getElementById('progress-text');
  if (bar) bar.style.width = `${percent}%`;
  if (text) {
    text.textContent =
      `${answered} of ${total} fields answered (${percent}%)`;
  }
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

function renderReport() {
  if (!lastResult) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    compositeScore, category, domainScores, additionalFlags,
    answeredCount, timestamp
  } = lastResult;

  const badgeClass = categoryClass(category);
  const scoreText = answeredCount > 0
    ? `${compositeScore.toFixed(1)} / 5.0`
    : '—';

  const domainCards = domainScores.length === 0
    ? `<p class="muted">No domains scored.</p>`
    : `
      <div class="domain-grid">
        ${domainScores.map((d) => `
          <div class="domain-card">
            <p class="domain-name">${esc(d.domain)}</p>
            <p>
              <span class="domain-mean">${d.mean.toFixed(2)}</span>
              <span class="domain-count">(${d.count} answered)</span>
            </p>
          </div>
        `).join('')}
      </div>
    `;

  const allQuestions = domainScores.flatMap((d) =>
    d.questions.map((q) => ({ ...q, domain: d.domain }))
  );

  const subscaleRows = allQuestions.map((q) => `
    <tr>
      <th scope="row">${esc(q.id)}</th>
      <td>${esc(q.domain)}</td>
      <td>${esc(q.text)}</td>
      <td class="num">${q.score} / 5</td>
    </tr>
  `).join('');

  const subscaleTable = allQuestions.length === 0
    ? `<p class="muted">No questions answered.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Domain</th>
            <th scope="col">Question</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>${subscaleRows}</tbody>
      </table>
    `;

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

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Encounter Satisfaction Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Composite ESS Score</h3>
      <p class="ess-summary">
        <span class="ess-score-badge ${badgeClass}">${scoreText}</span>
        <span class="ess-category">${esc(category)}</span>
      </p>
      <p class="muted">
        Based on ${answeredCount} of ${satisfactionQuestions.length}
        Likert questions answered.
      </p>

      <h3>Domain Breakdown</h3>
      ${domainCards}

      <h3>Per-question scores</h3>
      ${subscaleTable}

      <h3>Flagged Issues</h3>
      ${flagsList}

      <div class="report-actions">
        <button type="button" id="start-over-btn" class="btn btn-secondary">
          Start over
        </button>
      </div>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.getElementById('start-over-btn').addEventListener('click', startOver);
}

function submitForm() {
  const grading = calculateSatisfaction(state);
  const additionalFlags = detectAdditionalFlags(state, grading.compositeScore);
  lastResult = {
    compositeScore: grading.compositeScore,
    category: grading.category,
    domainScores: grading.domainScores,
    answeredCount: grading.answeredCount,
    additionalFlags,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh survey?')) return;
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
  host.appendChild(renderStep6());
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
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
