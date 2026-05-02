// DVLA M1 — patient wizard (vanilla classic <script>).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a top-of-page progress
// summary reflects how many fields have been answered. Submission runs the
// pure validator and renders an inline report. State is persisted to
// localStorage so a partial fill survives a page reload.
//
// Conditional rendering: when Q1 = No, the Q2 (Mental Health Conditions)
// and Q3 (Recent Contact) section cards are hidden from view entirely; the
// form ends after Q1 -> Authorisation. When Q1 = Yes, both sections are
// visible. This mirrors the SvelteKit step components.

// Sibling scripts loaded as plain <script> tags (in dependency order)
// attach their exports to `window.DvlaM1Form`. Pulling them off here keeps
// the rest of this file referring to short local names. Whole file wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';
const {
  emptyAssessment,
  validateM1,
  priorityLabel
} = window.DvlaM1Form;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY =
  'united-kingdom-driver-and-vehicle-licensing-agency-m1-form.front-end-form-with-html.v1';

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
        // Two-level deep merge for healthcareProfessionals.{gp,consultant}.
        if (key === 'healthcareProfessionals') {
          const hp = parsed[key];
          fresh[key].gp = { ...fresh[key].gp, ...(hp.gp || {}) };
          fresh[key].consultant = {
            ...fresh[key].consultant,
            ...(hp.consultant || {})
          };
        } else {
          fresh[key] = { ...fresh[key], ...parsed[key] };
        }
      }
    }
    return fresh;
  } catch (e) {
    console.warn('Could not parse saved M1 submission; starting fresh.', e);
    return emptyAssessment();
  }
}

/** @param {import('./types.js').AssessmentData} state */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save M1 submission to localStorage.', e);
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear stored M1 submission.', e);
  }
}

// ----------------------------------------------------------------------
// State
// ----------------------------------------------------------------------

/** @type {import('./types.js').AssessmentData} */
let state = loadState();

/** @type {import('./types.js').ValidationResult | null} */
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/**
 * Set a field on the state and persist. `path` is a dotted path inside
 * `state`; e.g. 'personalDetails.fullName' or
 * 'healthcareProfessionals.gp.gpName'.
 *
 * @param {string} path
 * @param {any} value
 */
function setField(path, value) {
  const parts = path.split('.');
  let node = state;
  for (let i = 0; i < parts.length - 1; i++) node = node[parts[i]];
  node[parts[parts.length - 1]] = value;
  saveState(state);
  updateProgress();
  updateConditionalSections();
}

/** Read a value from the state via the same dotted-path convention. */
function getField(path) {
  const parts = path.split('.');
  let node = state;
  for (const p of parts) {
    if (node == null) return undefined;
    node = node[p];
  }
  return node;
}

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
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
 * @param {{ label: string, path: string, type?: string,
 *           placeholder?: string, required?: boolean }} opts
 */
function textInput(opts) {
  const id = opts.path.replace(/\./g, '-');
  const value = getField(opts.path) || '';
  const labelText =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value)}"`
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
    setField(opts.path, input.value);
  });
  return wrapper;
}

/**
 * Build a labelled multi-line text area.
 * @param {{ label: string, path: string, rows?: number,
 *           placeholder?: string }} opts
 */
function textArea(opts) {
  const id = opts.path.replace(/\./g, '-');
  const value = getField(opts.path) || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      class="textarea">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => setField(opts.path, ta.value));
  return wrapper;
}

/**
 * Build a radio group.
 * @param {{ label: string, path: string, required?: boolean,
 *           options: { value: string, label: string }[] }} opts
 */
function radioGroup(opts) {
  const groupId = opts.path.replace(/\./g, '-');
  const current = getField(opts.path);
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.innerHTML =
    esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-options';
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value || 'blank'}`;
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
      if (input.checked) setField(opts.path, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/** Yes/No question is a 2-option radio group. */
function yesNoQuestion(opts) {
  return radioGroup({
    label: opts.label,
    path: opts.path,
    required: opts.required,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' }
    ]
  });
}

/**
 * Build a section card.
 * @param {{ stepNumber: number, title: string, description?: string,
 *           id?: string }} opts
 */
function sectionCard(opts) {
  const card = document.createElement('section');
  card.className = 'section-card';
  card.dataset.step = String(opts.stepNumber);
  card.id = opts.id || `step-${opts.stepNumber}`;
  const desc = opts.description
    ? `<p class="section-description">${esc(opts.description)}</p>`
    : '';
  card.innerHTML = `
    <header class="section-header">
      <span class="section-step">Step ${opts.stepNumber} of 6</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/** Inline notice element (info / warn / danger). */
function notice(kind, html) {
  const div = document.createElement('div');
  div.className = `notice notice-${kind}`;
  div.innerHTML = html;
  return div;
}

// ----------------------------------------------------------------------
// Section renderers
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Part A — About You',
    description: 'Current driving licence details and any change of details.'
  });

  const grid1 = document.createElement('div');
  grid1.className = 'two-col';
  grid1.appendChild(textInput({
    label: 'Title',
    path: 'personalDetails.title',
    placeholder: 'e.g. Mr, Mrs, Ms, Dr'
  }));
  grid1.appendChild(textInput({
    label: 'Full name',
    path: 'personalDetails.fullName',
    required: true
  }));
  card.appendChild(grid1);

  card.appendChild(textInput({
    label: 'Date of birth',
    path: 'personalDetails.dateOfBirth',
    type: 'date',
    required: true
  }));

  card.appendChild(textArea({
    label: 'Address',
    path: 'personalDetails.address',
    rows: 3
  }));

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(textInput({
    label: 'Postcode',
    path: 'personalDetails.postcode',
    required: true
  }));
  grid2.appendChild(textInput({
    label: 'Contact number',
    path: 'personalDetails.contactNumber',
    type: 'tel'
  }));
  card.appendChild(grid2);

  card.appendChild(textInput({
    label: 'Email',
    path: 'personalDetails.email',
    type: 'email'
  }));

  card.appendChild(textArea({
    label: 'Change of details (optional)',
    path: 'personalDetails.changeOfDetails',
    placeholder: 'Note any changes (name, address, etc.) since your last licence',
    rows: 3
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Part B — Healthcare Professional',
    description: 'GP and consultant details for your mental health condition.'
  });

  // GP details ---------------------------------------------------------
  const gpHeader = document.createElement('h3');
  gpHeader.className = 'section-subtitle';
  gpHeader.textContent = 'GP details';
  card.appendChild(gpHeader);

  card.appendChild(textInput({ label: 'GP name', path: 'healthcareProfessionals.gp.gpName' }));
  card.appendChild(textInput({ label: 'Surgery name', path: 'healthcareProfessionals.gp.surgeryName' }));
  card.appendChild(textArea({ label: 'Address', path: 'healthcareProfessionals.gp.address', rows: 2 }));

  const gpGrid1 = document.createElement('div');
  gpGrid1.className = 'two-col';
  gpGrid1.appendChild(textInput({ label: 'Town', path: 'healthcareProfessionals.gp.town' }));
  gpGrid1.appendChild(textInput({ label: 'Postcode', path: 'healthcareProfessionals.gp.postcode' }));
  card.appendChild(gpGrid1);

  const gpGrid2 = document.createElement('div');
  gpGrid2.className = 'two-col';
  gpGrid2.appendChild(textInput({
    label: 'Contact number',
    path: 'healthcareProfessionals.gp.contactNumber',
    type: 'tel'
  }));
  gpGrid2.appendChild(textInput({
    label: 'Email (if known)',
    path: 'healthcareProfessionals.gp.email',
    type: 'email'
  }));
  card.appendChild(gpGrid2);

  card.appendChild(textInput({
    label: 'Date last seen for this condition',
    path: 'healthcareProfessionals.gp.dateLastSeen',
    type: 'date'
  }));

  card.appendChild(document.createElement('hr')).className = 'section-divider';

  // Consultant details -------------------------------------------------
  const conHeader = document.createElement('h3');
  conHeader.className = 'section-subtitle';
  conHeader.textContent = 'Consultant details';
  card.appendChild(conHeader);

  card.appendChild(textInput({ label: 'Consultant name', path: 'healthcareProfessionals.consultant.consultantName' }));

  const conGrid0 = document.createElement('div');
  conGrid0.className = 'two-col';
  conGrid0.appendChild(textInput({ label: 'Speciality', path: 'healthcareProfessionals.consultant.speciality' }));
  conGrid0.appendChild(textInput({ label: 'Department', path: 'healthcareProfessionals.consultant.department' }));
  card.appendChild(conGrid0);

  card.appendChild(textInput({ label: 'Hospital name', path: 'healthcareProfessionals.consultant.hospitalName' }));
  card.appendChild(textArea({ label: 'Address', path: 'healthcareProfessionals.consultant.address', rows: 2 }));

  const conGrid1 = document.createElement('div');
  conGrid1.className = 'two-col';
  conGrid1.appendChild(textInput({ label: 'Town', path: 'healthcareProfessionals.consultant.town' }));
  conGrid1.appendChild(textInput({ label: 'Postcode', path: 'healthcareProfessionals.consultant.postcode' }));
  card.appendChild(conGrid1);

  const conGrid2 = document.createElement('div');
  conGrid2.className = 'two-col';
  conGrid2.appendChild(textInput({
    label: 'Contact number',
    path: 'healthcareProfessionals.consultant.contactNumber',
    type: 'tel'
  }));
  conGrid2.appendChild(textInput({
    label: 'Email (if known)',
    path: 'healthcareProfessionals.consultant.email',
    type: 'email'
  }));
  card.appendChild(conGrid2);

  card.appendChild(textInput({
    label: 'Date last seen for this condition',
    path: 'healthcareProfessionals.consultant.dateLastSeen',
    type: 'date'
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Question 1 — Diagnosis Confirmation',
    description: 'Medical Questionnaire — Mental Health.'
  });

  card.appendChild(yesNoQuestion({
    label: 'Have you been diagnosed with a mental health condition?',
    path: 'diagnosisConfirmation.hasMentalHealthDiagnosis',
    required: true
  }));

  // Conditional: shown only when Q1 === 'no'
  const noNotice = notice(
    'info',
    'You answered <strong>No</strong>. The DVLA instructions ask you not to complete Questions 2 or 3. You may continue directly to the authorisation step, or start over.'
  );
  noNotice.dataset.conditional = 'diagnosisConfirmation.hasMentalHealthDiagnosis=no';
  card.appendChild(noNotice);

  return card;
}

function renderStep4() {
  // Whole card is conditional on Q1 !== 'no'.
  const card = sectionCard({
    stepNumber: 4,
    title: 'Question 2 — Mental Health Conditions',
    description:
      'Please confirm what mental health condition you have been diagnosed with. Mark Yes or No for each.'
  });
  card.dataset.conditional = 'diagnosisConfirmation.hasMentalHealthDiagnosis!=no';

  card.appendChild(yesNoQuestion({
    label:
      'Anxiety or depression (without any impairment of concentration, memory or agitation)',
    path: 'mentalHealthConditions.anxietyDepressionWithoutImpairment'
  }));
  card.appendChild(yesNoQuestion({
    label:
      'Anxiety or depression (with suicidal thoughts or impairment in concentration, memory or agitation)',
    path: 'mentalHealthConditions.anxietyDepressionWithImpairment'
  }));
  card.appendChild(yesNoQuestion({
    label: 'Bipolar affective disorder',
    path: 'mentalHealthConditions.bipolarAffectiveDisorder'
  }));
  card.appendChild(yesNoQuestion({
    label: 'Eating disorder (anorexia nervosa, bulimia)',
    path: 'mentalHealthConditions.eatingDisorder'
  }));
  card.appendChild(yesNoQuestion({
    label: 'Obsessive compulsive disorder or post-traumatic stress disorder',
    path: 'mentalHealthConditions.ocdOrPtsd'
  }));
  card.appendChild(yesNoQuestion({
    label: 'Personality disorder (any type)',
    path: 'mentalHealthConditions.personalityDisorder'
  }));
  card.appendChild(yesNoQuestion({
    label:
      'Schizophrenia or psychosis or delusional disorder or schizoaffective disorder',
    path: 'mentalHealthConditions.schizophreniaOrPsychosis'
  }));
  card.appendChild(yesNoQuestion({
    label: 'Other (please specify)',
    path: 'mentalHealthConditions.other'
  }));

  // Sub-conditional: details when "other" === 'yes'
  const detailsHost = document.createElement('div');
  detailsHost.dataset.conditional = 'mentalHealthConditions.other=yes';
  detailsHost.appendChild(textArea({
    label: 'Please specify the other mental health condition',
    path: 'mentalHealthConditions.otherDetails',
    rows: 3
  }));
  card.appendChild(detailsHost);

  // Sub-conditional: warn when impairment variant === 'yes'
  const impairWarn = notice(
    'warn',
    'You indicated suicidal thoughts or impairment. If you are in immediate danger, please call your local emergency number (999 in the UK) or contact the Samaritans on 116 123. Your healthcare professional should review this report urgently.'
  );
  impairWarn.dataset.conditional = 'mentalHealthConditions.anxietyDepressionWithImpairment=yes';
  card.appendChild(impairWarn);

  return card;
}

function renderStep5() {
  // Whole card is conditional on Q1 !== 'no'.
  const card = sectionCard({
    stepNumber: 5,
    title: 'Question 3 — Recent Contact',
    description:
      'Recent contact with your healthcare professional about your mental health condition.'
  });
  card.dataset.conditional = 'diagnosisConfirmation.hasMentalHealthDiagnosis!=no';

  card.appendChild(yesNoQuestion({
    label:
      'Have you had any contact (any phone, video or face-to-face consultation) with your healthcare professional about your mental health condition in the last 12 months?',
    path: 'recentContact.hadRecentContact'
  }));

  // Sub-conditional: dates when hadRecentContact === 'yes'
  const datesHost = document.createElement('div');
  datesHost.dataset.conditional = 'recentContact.hadRecentContact=yes';
  const note = document.createElement('p');
  note.className = 'muted';
  note.style.margin = '0.25rem 0 0.5rem';
  note.textContent = 'If yes, supply the last date of any contact:';
  datesHost.appendChild(note);
  datesHost.appendChild(textInput({
    label: 'Doctor — date last seen',
    path: 'recentContact.doctorLastDate',
    type: 'date'
  }));
  datesHost.appendChild(textInput({
    label: 'Consultant — date last seen',
    path: 'recentContact.consultantLastDate',
    type: 'date'
  }));
  datesHost.appendChild(textInput({
    label: 'Community psychiatric nurse — date last seen',
    path: 'recentContact.communityPsychiatricNurseLastDate',
    type: 'date'
  }));
  card.appendChild(datesHost);

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: "Applicant's Authorisation",
    description: 'Declaration authorising medical disclosure and contact preferences.'
  });

  card.appendChild(notice(
    'muted',
    'I authorise the release of medical reports and information to the Drivers Medical Group, DVLA, by my doctor(s) or those mentioned on this form, in strict confidence, to enable the DVLA to assess my fitness to drive. I understand that making a false declaration to obtain a driving licence is a criminal offence under section 174 of the Road Traffic Act 1988.'
  ));

  card.appendChild(yesNoQuestion({
    label: 'I confirm the declaration above',
    path: 'authorisation.declarationConfirmed',
    required: true
  }));

  const sigGrid = document.createElement('div');
  sigGrid.className = 'two-col';
  sigGrid.appendChild(textInput({
    label: 'Name (printed)',
    path: 'authorisation.signatoryName',
    required: true
  }));
  sigGrid.appendChild(textInput({
    label: 'Signature (typed)',
    path: 'authorisation.signatureText'
  }));
  card.appendChild(sigGrid);

  card.appendChild(textInput({
    label: 'Date',
    path: 'authorisation.signatureDate',
    type: 'date',
    required: true
  }));

  const hr = document.createElement('hr');
  hr.className = 'section-divider';
  card.appendChild(hr);

  card.appendChild(yesNoQuestion({
    label: 'Do you consent to electronic correspondence (email) from the DVLA?',
    path: 'authorisation.electronicCorrespondenceConsent'
  }));

  const contactOpts = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS (Text)' }
  ];
  card.appendChild(radioGroup({
    label: 'Preferred contact method from the DVLA',
    path: 'authorisation.dvlaContactPreference',
    options: contactOpts
  }));
  card.appendChild(radioGroup({
    label:
      'Preferred contact method from your healthcare professional on behalf of the DVLA',
    path: 'authorisation.healthcareProfessionalContactPreference',
    options: contactOpts
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections
// ----------------------------------------------------------------------

/**
 * Hide / show any element with `data-conditional="path=value"` (or
 * `path!=value`) based on the current state. Used both at the section-card
 * level (Q2/Q3 are hidden when Q1 = No) and at the in-section level
 * (Q2 details when "other" = yes, etc.).
 */
function updateConditionalSections() {
  const hosts = document.querySelectorAll('[data-conditional]');
  hosts.forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    let path, target, negate = false;
    if (expr.includes('!=')) {
      [path, target] = expr.split('!=');
      negate = true;
    } else {
      [path, target] = expr.split('=');
    }
    const current = getField(path);
    const matches = String(current == null ? '' : current) === target;
    const visible = negate ? !matches : matches;
    host.style.display = visible ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Tracked fields. The set is dynamic because Q2 and Q3 do not apply when
 * Q1 = No: in that case we only count Personal Details, Q1, and the
 * Authorisation block, so the patient who answers No to Q1 can still reach
 * 100%.
 *
 * @returns {string[]}
 */
function trackedFieldPaths() {
  const stoppedAtQ1 = state.diagnosisConfirmation.hasMentalHealthDiagnosis === 'no';

  /** @type {string[]} */
  const paths = [
    // Personal details (4 required-ish)
    'personalDetails.fullName',
    'personalDetails.dateOfBirth',
    'personalDetails.address',
    'personalDetails.postcode',
    // Q1
    'diagnosisConfirmation.hasMentalHealthDiagnosis',
    // Authorisation
    'authorisation.declarationConfirmed',
    'authorisation.signatoryName',
    'authorisation.signatureDate'
  ];
  if (!stoppedAtQ1) {
    // Q2 conditions (8 yes/no items)
    paths.push(
      'mentalHealthConditions.anxietyDepressionWithoutImpairment',
      'mentalHealthConditions.anxietyDepressionWithImpairment',
      'mentalHealthConditions.bipolarAffectiveDisorder',
      'mentalHealthConditions.eatingDisorder',
      'mentalHealthConditions.ocdOrPtsd',
      'mentalHealthConditions.personalityDisorder',
      'mentalHealthConditions.schizophreniaOrPsychosis',
      'mentalHealthConditions.other'
    );
    // Q3
    paths.push('recentContact.hadRecentContact');
  }
  return paths;
}

function updateProgress() {
  const paths = trackedFieldPaths();
  let answered = 0;
  for (const path of paths) {
    const v = getField(path);
    const isAnswered = v !== null && v !== undefined && v !== '';
    if (isAnswered) answered++;
  }
  const total = paths.length;
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
    case 'urgent': return 'flag-urgent';
    case 'high': return 'flag-high';
    case 'medium': return 'flag-medium';
    case 'low': return 'flag-low';
    default: return '';
  }
}

function renderReport() {
  const result = lastResult;
  if (!result) return;
  const out = document.getElementById('report');
  if (!out) return;

  const {
    complete,
    stoppedAtQ1,
    firedRules,
    additionalFlags,
    conditionCount,
    timestamp
  } = result;

  const statusBadge = stoppedAtQ1
    ? '<span class="status-badge status-stopped">Stopped at Q1 (No diagnosis)</span>'
    : complete
    ? '<span class="status-badge status-complete">Complete</span>'
    : '<span class="status-badge status-incomplete">Incomplete</span>';

  // Combine fired rules (rendered as flag-style entries) with additional
  // flags. Fired rules don't carry a separate "category" string for the
  // user — we re-use their `category` token (completeness/consistency/
  // safety/declaration) capitalised.
  const ruleItems = firedRules.map((r) => ({
    priority: r.priority,
    category: capitalise(r.category),
    message: r.message
  }));
  const flagItems = additionalFlags.map((f) => ({
    priority: f.priority,
    category: f.category,
    message: f.message
  }));
  const allItems = [...ruleItems, ...flagItems].sort((a, b) => {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
    return (order[a.priority] || 99) - (order[b.priority] || 99);
  });

  const flagsList = allItems.length === 0
    ? `<p class="muted">No flags raised. Submission appears complete.</p>`
    : `
      <ul class="flags">
        ${allItems.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(priorityLabel(f.priority).toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>DVLA M1 Validation Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>
      </header>

      <h3>Submission Status</h3>
      <dl class="summary-grid">
        <dt>Status</dt><dd>${statusBadge}</dd>
        <dt>Q1 (diagnosed)</dt><dd>${esc(stoppedAtQ1 ? 'No' : (state.diagnosisConfirmation.hasMentalHealthDiagnosis === 'yes' ? 'Yes' : 'Unanswered'))}</dd>
        <dt>Q2 conditions</dt><dd>${stoppedAtQ1 ? 'n/a' : conditionCount}</dd>
        <dt>Validation problems</dt><dd>${firedRules.length}</dd>
        <dt>Additional flags</dt><dd>${additionalFlags.length}</dd>
      </dl>

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

function capitalise(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function submitForm() {
  lastResult = validateM1(state);
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh M1 submission?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
  updateConditionalSections();
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
}

function init() {
  renderForm();
  updateProgress();
  updateConditionalSections();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
