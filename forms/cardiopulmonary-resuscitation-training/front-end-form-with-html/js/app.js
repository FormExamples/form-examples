// Cardiopulmonary Resuscitation Training — examiner wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The examiner scrolls through them; a sticky top-of-page
// progress summary reflects how many checklist items have been answered.
// Submission runs the pure BLS grading engine and renders an inline report
// with a Pass/Fail badge, critical-action audit table, and prioritised
// flagged-issues list. State is persisted to localStorage so a partial
// fill survives a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order: types →
// rules → bls-grader → flagged-issues → app) attach their exports to
// `window.CardiopulmonaryResuscitationTraining`. The whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.CardiopulmonaryResuscitationTraining;
const {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  triStateLabel,
  triStatePillClass,
  COMPRESSION_RATE_MIN,
  COMPRESSION_RATE_MAX,
  COMPRESSION_DEPTH_MIN,
  COMPRESSION_DEPTH_MAX,
  compressionRateInRange,
  compressionDepthInRange,
  blsRules,
  gradeBLS,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'cardiopulmonary-resuscitation-training.front-end-form-with-html.v1';

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

/** @param {import('./types.js').AssessmentData} st */
function saveState(st) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(st));
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
 *
 * @param {string} section
 * @param {string} field
 * @param {*} value
 */
function setField(section, field, value) {
  state[section][field] = value;
  saveState(state);
  updateProgress();
  refreshNumericReadouts();
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
 *           placeholder?: string, min?: number, max?: number, step?: number,
 *           unit?: string }} opts
 */
function textInput(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field];
  const type = opts.type || 'text';
  const attrs = [
    `id="${id}"`,
    `name="${id}"`,
    `type="${type}"`,
    `class="text-input"`,
    `value="${esc(value ?? '')}"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${esc(opts.label)}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.section, opts.field, v);
  });
  return wrapper;
}

/**
 * Build a labelled multi-line text area.
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

// Tri-state radio set used for every checklist item.
const TRI_STATE_OPTIONS = [
  { value: 'yes', label: 'Demonstrated correctly', cls: 'choice-yes' },
  { value: 'no', label: 'Not yet', cls: 'choice-no' },
  { value: 'na', label: 'Not assessed', cls: 'choice-na' }
];

/**
 * Build a tri-state checklist item (radio group inside a labelled list row).
 *
 * @param {{ ruleId: string, section: string, field: string, label: string,
 *           critical: boolean }} opts
 */
function checklistItem(opts) {
  const li = document.createElement('li');
  li.className = 'checklist-item' + (opts.critical ? ' is-critical' : '');
  li.dataset.ruleId = opts.ruleId;

  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];

  const optionsHtml = TRI_STATE_OPTIONS.map((option) => {
    const radioId = `${groupId}-${option.value}`;
    const checked = current === option.value ? ' checked' : '';
    return `
      <label class="radio-option ${option.cls}" for="${radioId}">
        <input type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
        <span>${esc(option.label)}</span>
      </label>
    `;
  }).join('');

  li.innerHTML = `
    <fieldset class="field radio-group" style="margin:0;">
      <legend class="item-label">
        <span class="item-id">${esc(opts.ruleId)}</span>
        ${esc(opts.label)}
      </legend>
      <div class="radio-options tri-state">${optionsHtml}</div>
    </fieldset>
  `;

  li.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.checked) setField(opts.section, opts.field, input.value);
    });
  });
  return li;
}

/**
 * Build a section card.
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
      <span class="section-step">Section ${opts.stepNumber} of 8</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

/**
 * Look up the canonical rule definition by id (so checklist rendering
 * stays in sync with the grader's rule registry).
 */
function ruleById(id) {
  return blsRules.find((r) => r.id === id);
}

/** Build a checklist <ul> hosting the listed rule IDs.
 *  Items are created from the rule registry so that label, critical flag,
 *  and rule id all match the grader. The (section,field) tuple is passed
 *  separately because rules read state via section/field.
 *
 * @param {Array<{ ruleId: string, section: string, field: string }>} entries
 */
function checklist(entries) {
  const ul = document.createElement('ul');
  ul.className = 'checklist';
  for (const entry of entries) {
    const rule = ruleById(entry.ruleId);
    if (!rule) {
      console.warn('Unknown rule id:', entry.ruleId);
      continue;
    }
    ul.appendChild(checklistItem({
      ruleId: rule.id,
      section: entry.section,
      field: entry.field,
      label: rule.label,
      critical: rule.critical
    }));
  }
  return ul;
}

// ----------------------------------------------------------------------
// Numeric metric helpers (compression rate / depth / time-to-shock)
// ----------------------------------------------------------------------

function rateRangeReadout(rate, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (rate === null || rate === undefined || rate === '') {
    return `<p${idAttr} class="metric-target">AHA target: ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX} compressions per minute.</p>`;
  }
  const ok = compressionRateInRange(rate);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within AHA target (${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min).`
    : `Outside AHA target ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min — coach toward target rate.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function depthRangeReadout(depth, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (depth === null || depth === undefined || depth === '') {
    return `<p${idAttr} class="metric-target">AHA target: ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm for an adult.</p>`;
  }
  const ok = compressionDepthInRange(depth);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within AHA target (${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm).`
    : `Outside AHA target ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm — coach toward target depth.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function refreshNumericReadouts() {
  const rateEl = document.getElementById('compression-rate-readout');
  if (rateEl) {
    rateEl.outerHTML = rateRangeReadout(
      state.chestCompressions.compressionRate, 'compression-rate-readout'
    );
  }
  const depthEl = document.getElementById('compression-depth-readout');
  if (depthEl) {
    depthEl.outerHTML = depthRangeReadout(
      state.chestCompressions.compressionDepth, 'compression-depth-readout'
    );
  }
}

// ----------------------------------------------------------------------
// Section renderers (1 per assessment step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Trainee Details',
    description: 'Identify the trainee and the certification context for this assessment.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'traineeDetails', field: 'firstName' }));
  grid.appendChild(textInput({ label: 'Last name', section: 'traineeDetails', field: 'lastName' }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Trainee ID / employee number',
    section: 'traineeDetails', field: 'traineeId'
  }));

  card.appendChild(selectInput({
    label: 'Role',
    section: 'traineeDetails', field: 'role',
    options: [
      { value: 'instructor', label: 'BLS instructor candidate' },
      { value: 'first-responder', label: 'First responder' },
      { value: 'nurse', label: 'Nurse' },
      { value: 'paramedic', label: 'Paramedic' },
      { value: 'physician', label: 'Physician' },
      { value: 'other', label: 'Other clinical staff' }
    ]
  }));

  const dateGrid = document.createElement('div');
  dateGrid.className = 'two-col';
  dateGrid.appendChild(textInput({
    label: 'Prior certification expiry',
    section: 'traineeDetails', field: 'priorCertificationExpiry',
    type: 'date'
  }));
  dateGrid.appendChild(textInput({
    label: 'Session date',
    section: 'traineeDetails', field: 'sessionDate',
    type: 'date'
  }));
  card.appendChild(dateGrid);

  card.appendChild(textInput({
    label: 'Examiner name',
    section: 'traineeDetails', field: 'examinerName'
  }));

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Scene Safety & Initial Assessment',
    description: 'Trainee surveys the scene before approaching the casualty.'
  });

  card.appendChild(checklist([
    { ruleId: 'BLS-SS-SAFE', section: 'sceneSafety', field: 'sceneSafe' },
    { ruleId: 'BLS-SS-PPE', section: 'sceneSafety', field: 'ppeApplied' },
    { ruleId: 'BLS-SS-HAZARDS', section: 'sceneSafety', field: 'hazardsIdentified' },
    { ruleId: 'BLS-SS-BYSTANDERS', section: 'sceneSafety', field: 'bystandersControlled' }
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Responsiveness & Breathing Check',
    description: 'Trainee assesses responsiveness, breathing, and pulse within 10 seconds.'
  });

  card.appendChild(checklist([
    { ruleId: 'BLS-RB-TAP', section: 'responsivenessBreathing', field: 'tappedAndShouted' },
    { ruleId: 'BLS-RB-BREATH', section: 'responsivenessBreathing', field: 'checkedBreathing' },
    { ruleId: 'BLS-RB-PULSE', section: 'responsivenessBreathing', field: 'checkedPulseSimultaneously' },
    { ruleId: 'BLS-RB-TIME', section: 'responsivenessBreathing', field: 'timeWithinTenSeconds' }
  ]));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Activate Emergency Response',
    description: 'Trainee calls 999 / 2222, communicates clearly, and designates an AED retriever.'
  });

  card.appendChild(checklist([
    { ruleId: 'BLS-ER-CALL', section: 'activateEmergencyResponse', field: 'calledEmergencyNumber' },
    { ruleId: 'BLS-ER-INFO', section: 'activateEmergencyResponse', field: 'statedLocationAndCondition' },
    { ruleId: 'BLS-ER-AED', section: 'activateEmergencyResponse', field: 'designatedAedRetriever' },
    { ruleId: 'BLS-ER-SPEAKER', section: 'activateEmergencyResponse', field: 'usedSpeakerphone' }
  ]));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Chest Compressions',
    description: 'Rate, depth, recoil, hand position, and minimised interruptions. Rate and depth are critical actions.'
  });

  // Numeric measurements first
  const rateRow = document.createElement('div');
  rateRow.className = 'metric-row';
  rateRow.appendChild(textInput({
    label: 'Measured compression rate',
    section: 'chestCompressions', field: 'compressionRate',
    type: 'number', min: 30, max: 200, step: 1, unit: '/min'
  }));
  rateRow.insertAdjacentHTML(
    'beforeend',
    rateRangeReadout(state.chestCompressions.compressionRate, 'compression-rate-readout')
  );
  card.appendChild(rateRow);

  const depthRow = document.createElement('div');
  depthRow.className = 'metric-row';
  depthRow.appendChild(textInput({
    label: 'Measured compression depth',
    section: 'chestCompressions', field: 'compressionDepth',
    type: 'number', min: 1, max: 10, step: 0.1, unit: 'cm'
  }));
  depthRow.insertAdjacentHTML(
    'beforeend',
    depthRangeReadout(state.chestCompressions.compressionDepth, 'compression-depth-readout')
  );
  card.appendChild(depthRow);

  card.appendChild(checklist([
    { ruleId: 'BLS-CC-RATE', section: 'chestCompressions', field: 'compressionsAtCorrectRate' },
    { ruleId: 'BLS-CC-DEPTH', section: 'chestCompressions', field: 'compressionsAtCorrectDepth' },
    { ruleId: 'BLS-CC-HAND', section: 'chestCompressions', field: 'correctHandPosition' },
    { ruleId: 'BLS-CC-RECOIL', section: 'chestCompressions', field: 'fullChestRecoil' },
    { ruleId: 'BLS-CC-INTERRUPT', section: 'chestCompressions', field: 'minimisedInterruptions' }
  ]));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Airway & Rescue Breaths',
    description: 'Head tilt-chin lift, effective seal, visible chest rise (critical), 1-second breaths, 30:2 ratio.'
  });

  card.appendChild(checklist([
    { ruleId: 'BLS-AB-AIRWAY', section: 'airwayRescueBreaths', field: 'headTiltChinLift' },
    { ruleId: 'BLS-AB-SEAL', section: 'airwayRescueBreaths', field: 'effectiveSeal' },
    { ruleId: 'BLS-AB-CHEST-RISE', section: 'airwayRescueBreaths', field: 'visibleChestRise' },
    { ruleId: 'BLS-AB-DURATION', section: 'airwayRescueBreaths', field: 'oneSecondPerBreath' },
    { ruleId: 'BLS-AB-RATIO', section: 'airwayRescueBreaths', field: 'ratio30to2' },
    { ruleId: 'BLS-AB-NOEXCESS', section: 'airwayRescueBreaths', field: 'avoidedExcessiveVentilation' }
  ]));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'AED Use & Shock Delivery',
    description: 'Pad placement, "I’m clear, you’re clear, everyone clear" — safe shock delivery is a critical action.'
  });

  card.appendChild(textInput({
    label: 'Time to first shock (from cardiac arrest recognition)',
    section: 'aedShockDelivery', field: 'timeToFirstShockSeconds',
    type: 'number', min: 0, max: 600, step: 1, unit: 'seconds'
  }));

  card.appendChild(checklist([
    { ruleId: 'BLS-AED-POWER', section: 'aedShockDelivery', field: 'poweredOnPromptly' },
    { ruleId: 'BLS-AED-PADS', section: 'aedShockDelivery', field: 'correctPadPlacement' },
    { ruleId: 'BLS-AED-CLEAR-ANALYSIS', section: 'aedShockDelivery', field: 'clearedDuringAnalysis' },
    { ruleId: 'BLS-AED-SAFE-SHOCK', section: 'aedShockDelivery', field: 'deliveredShockSafely' },
    { ruleId: 'BLS-AED-RESUME', section: 'aedShockDelivery', field: 'resumedCompressionsImmediately' }
  ]));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Team Dynamics, Handoff & Feedback',
    description: 'Communication, closed-loop orders, structured handoff, and post-event debrief.'
  });

  card.appendChild(checklist([
    { ruleId: 'BLS-TD-COMM', section: 'teamDynamicsHandoff', field: 'clearCommunication' },
    { ruleId: 'BLS-TD-CLOSED-LOOP', section: 'teamDynamicsHandoff', field: 'closedLoopOrders' },
    { ruleId: 'BLS-TD-HANDOFF', section: 'teamDynamicsHandoff', field: 'appropriateHandoff' },
    { ruleId: 'BLS-TD-DEBRIEF', section: 'teamDynamicsHandoff', field: 'debriefParticipated' }
  ]));

  card.appendChild(textArea({
    label: 'Examiner notes',
    section: 'teamDynamicsHandoff', field: 'examinerNotes',
    placeholder: 'Strengths, deficiencies, coaching focus for next session…',
    rows: 4
  }));
  card.appendChild(textArea({
    label: 'Trainee self-feedback',
    section: 'teamDynamicsHandoff', field: 'traineeFeedback',
    placeholder: 'Trainee\u2019s reflections after the scenario…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Track a curated set of fields whose presence drives the progress bar.
 * Includes every checklist tri-state field plus the two numeric BLS
 * measurements (rate and depth). Trainee-detail fields are intentionally
 * excluded so progress reflects skills assessment, not paperwork.
 */
const TRACKED_FIELDS = [
  ['sceneSafety', 'sceneSafe'],
  ['sceneSafety', 'ppeApplied'],
  ['sceneSafety', 'hazardsIdentified'],
  ['sceneSafety', 'bystandersControlled'],
  ['responsivenessBreathing', 'tappedAndShouted'],
  ['responsivenessBreathing', 'checkedBreathing'],
  ['responsivenessBreathing', 'checkedPulseSimultaneously'],
  ['responsivenessBreathing', 'timeWithinTenSeconds'],
  ['activateEmergencyResponse', 'calledEmergencyNumber'],
  ['activateEmergencyResponse', 'statedLocationAndCondition'],
  ['activateEmergencyResponse', 'designatedAedRetriever'],
  ['activateEmergencyResponse', 'usedSpeakerphone'],
  ['chestCompressions', 'compressionRate'],
  ['chestCompressions', 'compressionDepth'],
  ['chestCompressions', 'compressionsAtCorrectRate'],
  ['chestCompressions', 'compressionsAtCorrectDepth'],
  ['chestCompressions', 'correctHandPosition'],
  ['chestCompressions', 'fullChestRecoil'],
  ['chestCompressions', 'minimisedInterruptions'],
  ['airwayRescueBreaths', 'headTiltChinLift'],
  ['airwayRescueBreaths', 'effectiveSeal'],
  ['airwayRescueBreaths', 'visibleChestRise'],
  ['airwayRescueBreaths', 'oneSecondPerBreath'],
  ['airwayRescueBreaths', 'ratio30to2'],
  ['airwayRescueBreaths', 'avoidedExcessiveVentilation'],
  ['aedShockDelivery', 'poweredOnPromptly'],
  ['aedShockDelivery', 'correctPadPlacement'],
  ['aedShockDelivery', 'clearedDuringAnalysis'],
  ['aedShockDelivery', 'deliveredShockSafely'],
  ['aedShockDelivery', 'resumedCompressionsImmediately'],
  ['teamDynamicsHandoff', 'clearCommunication'],
  ['teamDynamicsHandoff', 'closedLoopOrders'],
  ['teamDynamicsHandoff', 'appropriateHandoff'],
  ['teamDynamicsHandoff', 'debriefParticipated']
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
  if (text) text.textContent = `${answered} of ${total} items assessed (${percent}%)`;
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
    outcome,
    criticalFailures,
    nonCriticalDeficiencies,
    firedRules,
    additionalFlags,
    answeredCount,
    totalRules,
    timestamp
  } = lastResult;

  // Critical-action audit table — always show all four critical rules.
  const criticalRules = firedRules.filter((r) => r.critical);
  const auditRows = criticalRules.map((r) => {
    const rowCls = r.status === 'no'
      ? 'critical-fail'
      : (r.status === 'yes' ? 'critical-pass' : '');
    return `
      <tr class="${rowCls}">
        <th scope="row">${esc(r.id)}</th>
        <td>${esc(r.category)}</td>
        <td>${esc(r.description)}</td>
        <td class="status">
          <span class="status-pill ${triStatePillClass(r.status)}">${esc(triStateLabel(r.status))}</span>
        </td>
      </tr>
    `;
  }).join('');

  const auditTable = `
    <table class="audit">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Category</th>
          <th scope="col">Critical action</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>${auditRows}</tbody>
    </table>
  `;

  // Non-critical deficiencies summary
  const ncDefList = nonCriticalDeficiencies.length === 0
    ? `<p class="muted">No non-critical deficiencies recorded.</p>`
    : `
      <ul class="checklist" style="gap:0.375rem;">
        ${nonCriticalDeficiencies.map((r) => `
          <li class="checklist-item">
            <span class="item-label">
              <span class="item-id">${esc(r.id)}</span>
              ${esc(r.description)}
            </span>
            <span class="muted">${esc(r.category)} (Section ${r.step})</span>
          </li>
        `).join('')}
      </ul>
    `;

  // Flagged-issues list
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

  // Outcome summary line
  let summaryText = '';
  if (outcome === 'pass') {
    summaryText = `All four critical actions met; ${nonCriticalDeficiencies.length} non-critical deficiency(ies).`;
  } else if (criticalFailures.length > 0) {
    summaryText = `${criticalFailures.length} critical-action failure(s) — automatic Fail.`;
  } else if (nonCriticalDeficiencies.length > 2) {
    summaryText = `${nonCriticalDeficiencies.length} non-critical deficiencies (limit is 2) — Fail.`;
  } else {
    summaryText = 'Insufficient items assessed to grade — please complete the checklist.';
  }

  const trainee = state.traineeDetails;
  const traineeName = `${trainee.firstName} ${trainee.lastName}`.trim();

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>BLS Skills Verification Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${
          traineeName ? ` for ${esc(traineeName)}` : ''
        }${trainee.examinerName ? ` · examiner: ${esc(trainee.examinerName)}` : ''}</p>
      </header>

      <h3>Outcome</h3>
      <p class="outcome-summary">
        <span class="outcome-badge ${outcomeClass(outcome)}">${esc(outcomeLabel(outcome) || '—')}</span>
        <span class="outcome-detail">${esc(summaryText)}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of ${totalRules} checklist items recorded.</p>

      <h3>Critical-action audit</h3>
      ${auditTable}

      <h3>Non-critical deficiencies</h3>
      ${ncDefList}

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
  const grading = gradeBLS(state);
  const additionalFlags = detectAdditionalFlags(state, grading);
  lastResult = {
    outcome: grading.outcome,
    criticalFailures: grading.criticalFailures,
    nonCriticalDeficiencies: grading.nonCriticalDeficiencies,
    firedRules: grading.firedRules,
    additionalFlags,
    answeredCount: grading.answeredCount,
    totalRules: grading.totalRules,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh skills verification?')) return;
  clearState();
  state = emptyAssessment();
  lastResult = null;
  document.getElementById('report').innerHTML = '';
  renderForm();
  updateProgress();
  refreshNumericReadouts();
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
  refreshNumericReadouts();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
