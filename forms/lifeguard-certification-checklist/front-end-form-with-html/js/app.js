// Lifeguard Certification Checklist — examiner wizard (vanilla JS).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The examiner scrolls through them; a sticky top-of-page
// progress summary reflects how many checklist items have been answered.
// Submission runs the pure lifeguard grading engine and renders an inline
// report with a Pass / Needs Development / Fail badge, critical-skill
// audit table, deficiency list, and prioritised flagged-issues list.
// State is persisted to localStorage so a partial fill survives a page
// reload.
//
// Sibling files loaded as plain `<script>` tags (in order: types →
// rules → lifeguard-grader → flagged-issues → app) attach their exports to
// `window.LifeguardCertificationChecklist`. The whole file is wrapped
// in an IIFE so its top-level identifiers don't leak to the global scope.
(function () {
'use strict';

const NS = window.LifeguardCertificationChecklist;
const {
  emptyAssessment,
  outcomeLabel,
  outcomeClass,
  triStateLabel,
  triStatePillClass,
  SWIM_50M_MAX_SECONDS,
  SWIM_200M_MAX_SECONDS,
  COMPRESSION_RATE_MIN,
  COMPRESSION_RATE_MAX,
  COMPRESSION_DEPTH_MIN,
  COMPRESSION_DEPTH_MAX,
  SLOW_AED_SECONDS,
  SURFACE_DIVE_MIN_METRES,
  swim50mWithinTarget,
  swim200mWithinTarget,
  compressionRateInRange,
  compressionDepthInRange,
  surfaceDiveDepthAdequate,
  lifeguardRules,
  gradeLifeguard,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'lifeguard-certification-checklist.front-end-form-with-html.v1';
const TOTAL_STEPS = 10;

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

/** Build a labelled multi-line text area. */
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

/** Build a select / dropdown input. */
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

/** Build a section card. */
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

/** Look up the canonical rule definition by id. */
function ruleById(id) {
  return lifeguardRules.find((r) => r.id === id);
}

/** Build a checklist <ul> hosting the listed rule IDs.
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
// Numeric metric readouts
// ----------------------------------------------------------------------

function swim50mReadout(sec, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (sec === null || sec === undefined || sec === '') {
    return `<p${idAttr} class="metric-target">NPLQ target: 50 m in ${SWIM_50M_MAX_SECONDS}s or less.</p>`;
  }
  const ok = swim50mWithinTarget(sec);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within NPLQ target (≤ ${SWIM_50M_MAX_SECONDS}s).`
    : `Exceeds NPLQ target of ${SWIM_50M_MAX_SECONDS}s — critical-competency failure.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function swim200mReadout(sec, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (sec === null || sec === undefined || sec === '') {
    return `<p${idAttr} class="metric-target">Suggested target: 200 m mixed strokes in ${SWIM_200M_MAX_SECONDS}s or less.</p>`;
  }
  const ok = swim200mWithinTarget(sec);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within suggested target (≤ ${SWIM_200M_MAX_SECONDS}s).`
    : `Exceeds suggested ${SWIM_200M_MAX_SECONDS}s target — recommend conditioning.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function diveDepthReadout(m, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (m === null || m === undefined || m === '') {
    return `<p${idAttr} class="metric-target">Suggested minimum surface dive: ${SURFACE_DIVE_MIN_METRES}m.</p>`;
  }
  const ok = surfaceDiveDepthAdequate(m);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `At or below suggested minimum (${SURFACE_DIVE_MIN_METRES}m).`
    : `Above suggested ${SURFACE_DIVE_MIN_METRES}m minimum — practice deeper recovery.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function rateRangeReadout(rate, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (rate === null || rate === undefined || rate === '') {
    return `<p${idAttr} class="metric-target">Target: ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX} compressions per minute.</p>`;
  }
  const ok = compressionRateInRange(rate);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within target (${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min).`
    : `Outside target ${COMPRESSION_RATE_MIN}-${COMPRESSION_RATE_MAX}/min — coach toward target rate.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function depthRangeReadout(depth, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (depth === null || depth === undefined || depth === '') {
    return `<p${idAttr} class="metric-target">Target: ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm for an adult.</p>`;
  }
  const ok = compressionDepthInRange(depth);
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within target (${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm).`
    : `Outside target ${COMPRESSION_DEPTH_MIN}-${COMPRESSION_DEPTH_MAX} cm — coach toward target depth.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function aedShockReadout(sec, id) {
  const idAttr = id ? ` id="${id}"` : '';
  if (sec === null || sec === undefined || sec === '') {
    return `<p${idAttr} class="metric-target">ILSF target: time to first shock under ${SLOW_AED_SECONDS}s.</p>`;
  }
  const ok = sec <= SLOW_AED_SECONDS;
  const cls = ok ? 'in-range' : 'out-of-range';
  const msg = ok
    ? `Within ILSF target (≤ ${SLOW_AED_SECONDS}s).`
    : `Exceeds ILSF target of ${SLOW_AED_SECONDS}s — practice rapid AED retrieval.`;
  return `<p${idAttr} class="metric-target ${cls}">${msg}</p>`;
}

function refreshNumericReadouts() {
  /** @type {[string, () => string][]} */
  const readouts = [
    ['swim-50m-readout', () => swim50mReadout(state.physicalFitnessSwim.swim50mTimeSeconds, 'swim-50m-readout')],
    ['swim-200m-readout', () => swim200mReadout(state.physicalFitnessSwim.swim200mTimeSeconds, 'swim-200m-readout')],
    ['dive-depth-readout', () => diveDepthReadout(state.physicalFitnessSwim.surfaceDiveDepthMetres, 'dive-depth-readout')],
    ['compression-rate-readout', () => rateRangeReadout(state.cprAed.compressionRate, 'compression-rate-readout')],
    ['compression-depth-readout', () => depthRangeReadout(state.cprAed.compressionDepth, 'compression-depth-readout')],
    ['aed-shock-readout', () => aedShockReadout(state.cprAed.timeToFirstShockSeconds, 'aed-shock-readout')]
  ];
  for (const [id, build] of readouts) {
    const el = document.getElementById(id);
    if (el) el.outerHTML = build();
  }
}

// ----------------------------------------------------------------------
// Section renderers (1 per assessment step)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Candidate Details',
    description: 'Identify the candidate and certification context for this verification.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First name', section: 'candidateDetails', field: 'firstName' }));
  grid.appendChild(textInput({ label: 'Last name', section: 'candidateDetails', field: 'lastName' }));
  card.appendChild(grid);

  const idGrid = document.createElement('div');
  idGrid.className = 'two-col';
  idGrid.appendChild(textInput({
    label: 'Candidate ID / membership number',
    section: 'candidateDetails', field: 'candidateId'
  }));
  idGrid.appendChild(textInput({
    label: 'Date of birth',
    section: 'candidateDetails', field: 'dateOfBirth',
    type: 'date'
  }));
  card.appendChild(idGrid);

  card.appendChild(selectInput({
    label: 'Venue type',
    section: 'candidateDetails', field: 'venueType',
    options: [
      { value: 'pool', label: 'Pool (NPLQ)' },
      { value: 'beach', label: 'Beach lifeguard' },
      { value: 'inland-water', label: 'Inland water (lake / river)' },
      { value: 'water-park', label: 'Water park / leisure' },
      { value: 'leisure', label: 'Leisure facility' },
      { value: 'other', label: 'Other' }
    ]
  }));

  card.appendChild(textInput({
    label: 'Venue name',
    section: 'candidateDetails', field: 'venueName',
    placeholder: 'e.g. King\u2019s Pool, Westside Aquatic Centre'
  }));

  card.appendChild(selectInput({
    label: 'Assessment type',
    section: 'candidateDetails', field: 'assessmentType',
    options: [
      { value: 'initial', label: 'Initial certification' },
      { value: 'requalification', label: 'Requalification (re-cert)' },
      { value: 'cross-over', label: 'Cross-over from another body' },
      { value: 'in-service', label: 'In-service review' },
      { value: 'other', label: 'Other' }
    ]
  }));

  const dateGrid = document.createElement('div');
  dateGrid.className = 'two-col';
  dateGrid.appendChild(textInput({
    label: 'Prior certification expiry',
    section: 'candidateDetails', field: 'priorCertificationExpiry',
    type: 'date'
  }));
  dateGrid.appendChild(textInput({
    label: 'Session date',
    section: 'candidateDetails', field: 'sessionDate',
    type: 'date'
  }));
  card.appendChild(dateGrid);

  const examinerGrid = document.createElement('div');
  examinerGrid.className = 'two-col';
  examinerGrid.appendChild(textInput({
    label: 'Examiner name',
    section: 'candidateDetails', field: 'examinerName'
  }));
  examinerGrid.appendChild(textInput({
    label: 'Examiner licence number',
    section: 'candidateDetails', field: 'examinerLicenceNumber'
  }));
  card.appendChild(examinerGrid);

  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Physical Fitness & Swim Competency',
    description: 'NPLQ swim test: 50 m timed swim (≤60 s, critical), sustained surface dive, 200 m mixed-strokes swim, water tread, and casualty tow.'
  });

  // 50 m timed swim
  const row1 = document.createElement('div');
  row1.className = 'metric-row';
  row1.appendChild(textInput({
    label: 'Measured 50 m swim time',
    section: 'physicalFitnessSwim', field: 'swim50mTimeSeconds',
    type: 'number', min: 20, max: 200, step: 0.1, unit: 'seconds'
  }));
  row1.insertAdjacentHTML(
    'beforeend',
    swim50mReadout(state.physicalFitnessSwim.swim50mTimeSeconds, 'swim-50m-readout')
  );
  card.appendChild(row1);

  // Surface dive depth
  const row2 = document.createElement('div');
  row2.className = 'metric-row';
  row2.appendChild(textInput({
    label: 'Surface-dive recovery depth',
    section: 'physicalFitnessSwim', field: 'surfaceDiveDepthMetres',
    type: 'number', min: 0.5, max: 5, step: 0.1, unit: 'metres'
  }));
  row2.insertAdjacentHTML(
    'beforeend',
    diveDepthReadout(state.physicalFitnessSwim.surfaceDiveDepthMetres, 'dive-depth-readout')
  );
  card.appendChild(row2);

  // 200 m sustained swim
  const row3 = document.createElement('div');
  row3.className = 'metric-row';
  row3.appendChild(textInput({
    label: 'Measured 200 m sustained swim time',
    section: 'physicalFitnessSwim', field: 'swim200mTimeSeconds',
    type: 'number', min: 60, max: 900, step: 1, unit: 'seconds'
  }));
  row3.insertAdjacentHTML(
    'beforeend',
    swim200mReadout(state.physicalFitnessSwim.swim200mTimeSeconds, 'swim-200m-readout')
  );
  card.appendChild(row3);

  card.appendChild(checklist([
    { ruleId: 'LIFE-PF-50M-TIME', section: 'physicalFitnessSwim', field: 'swim50mWithinTime' },
    { ruleId: 'LIFE-PF-DIVE', section: 'physicalFitnessSwim', field: 'sustainedSurfaceDive' },
    { ruleId: 'LIFE-PF-200M', section: 'physicalFitnessSwim', field: 'swim200mMixedStrokes' },
    { ruleId: 'LIFE-PF-TREAD', section: 'physicalFitnessSwim', field: 'treadWaterTwoMinutes' },
    { ruleId: 'LIFE-PF-TOW', section: 'physicalFitnessSwim', field: 'towCasualty50m' }
  ]));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Supervision, Scanning & Zoning',
    description: 'Effective scanning is a critical competency. Apply the 10/20 rule and maintain a defined zone of responsibility.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-SCAN-ZONE', section: 'supervisionScanningZoning', field: 'understandsZoneOfResponsibility' },
    { ruleId: 'LIFE-SCAN-PATTERN', section: 'supervisionScanningZoning', field: 'effectiveScanningPattern' },
    { ruleId: 'LIFE-SCAN-1020', section: 'supervisionScanningZoning', field: 'tenTwentyScanRule' },
    { ruleId: 'LIFE-SCAN-DISTRESS', section: 'supervisionScanningZoning', field: 'recognisesDistressedSwimmer' },
    { ruleId: 'LIFE-SCAN-ROTATION', section: 'supervisionScanningZoning', field: 'appropriateRotation' },
    { ruleId: 'LIFE-SCAN-WHISTLE', section: 'supervisionScanningZoning', field: 'usesWhistleAndSignals' }
  ]));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Rescue Scenario — Conscious Casualty',
    description: 'Recognition, alert, controlled entry, approach with floating aid, reassurance, tow, and extrication.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-RC-RECOG', section: 'rescueConscious', field: 'recognitionAndAlert' },
    { ruleId: 'LIFE-RC-ENTRY', section: 'rescueConscious', field: 'entryWithoutLossOfSight' },
    { ruleId: 'LIFE-RC-AID', section: 'rescueConscious', field: 'approachWithFloatingAid' },
    { ruleId: 'LIFE-RC-REASSURE', section: 'rescueConscious', field: 'reassuresCasualty' },
    { ruleId: 'LIFE-RC-TOW', section: 'rescueConscious', field: 'towToSafety' },
    { ruleId: 'LIFE-RC-EXTRICATE', section: 'rescueConscious', field: 'extricationFromWater' }
  ]));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Rescue Scenario — Unconscious Casualty',
    description: 'Effective tow and safe extrication of an unconscious casualty are critical competencies.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-RU-RECOG', section: 'rescueUnconscious', field: 'recognitionAndAlert' },
    { ruleId: 'LIFE-RU-ENTRY', section: 'rescueUnconscious', field: 'safeEntryAndApproach' },
    { ruleId: 'LIFE-RU-AIRWAY', section: 'rescueUnconscious', field: 'airwayManagementInWater' },
    { ruleId: 'LIFE-RU-TOW', section: 'rescueUnconscious', field: 'effectiveTowToSafety' },
    { ruleId: 'LIFE-RU-EXTRICATE', section: 'rescueUnconscious', field: 'safeExtrication' },
    { ruleId: 'LIFE-RU-HANDOVER', section: 'rescueUnconscious', field: 'handoverHandsignal' }
  ]));
  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Spinal Injury Management',
    description: 'Head-splint hold and correct spineboard use are critical competencies. Maintain in-line stabilisation throughout.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-SP-MECH', section: 'spinalInjuryManagement', field: 'recognisesMechanism' },
    { ruleId: 'LIFE-SP-HEADSPLINT', section: 'spinalInjuryManagement', field: 'headSplintHold' },
    { ruleId: 'LIFE-SP-INLINE', section: 'spinalInjuryManagement', field: 'maintainsInlineStabilisation' },
    { ruleId: 'LIFE-SP-ROLL', section: 'spinalInjuryManagement', field: 'carefulRollIfNeeded' },
    { ruleId: 'LIFE-SP-BOARD', section: 'spinalInjuryManagement', field: 'useOfSpineboard' },
    { ruleId: 'LIFE-SP-SECURE', section: 'spinalInjuryManagement', field: 'secureCasualtyToBoard' }
  ]));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'CPR & AED',
    description: 'Effective compressions and prompt AED delivery are critical competencies.'
  });

  // Compression rate
  const rateRow = document.createElement('div');
  rateRow.className = 'metric-row';
  rateRow.appendChild(textInput({
    label: 'Measured compression rate',
    section: 'cprAed', field: 'compressionRate',
    type: 'number', min: 30, max: 200, step: 1, unit: '/min'
  }));
  rateRow.insertAdjacentHTML(
    'beforeend',
    rateRangeReadout(state.cprAed.compressionRate, 'compression-rate-readout')
  );
  card.appendChild(rateRow);

  // Compression depth
  const depthRow = document.createElement('div');
  depthRow.className = 'metric-row';
  depthRow.appendChild(textInput({
    label: 'Measured compression depth',
    section: 'cprAed', field: 'compressionDepth',
    type: 'number', min: 1, max: 10, step: 0.1, unit: 'cm'
  }));
  depthRow.insertAdjacentHTML(
    'beforeend',
    depthRangeReadout(state.cprAed.compressionDepth, 'compression-depth-readout')
  );
  card.appendChild(depthRow);

  // Time to first shock
  const shockRow = document.createElement('div');
  shockRow.className = 'metric-row';
  shockRow.appendChild(textInput({
    label: 'Time to first shock (from arrest recognition)',
    section: 'cprAed', field: 'timeToFirstShockSeconds',
    type: 'number', min: 0, max: 600, step: 1, unit: 'seconds'
  }));
  shockRow.insertAdjacentHTML(
    'beforeend',
    aedShockReadout(state.cprAed.timeToFirstShockSeconds, 'aed-shock-readout')
  );
  card.appendChild(shockRow);

  card.appendChild(checklist([
    { ruleId: 'LIFE-CPR-COMPRESSIONS', section: 'cprAed', field: 'effectiveCompressions' },
    { ruleId: 'LIFE-CPR-VENTILATIONS', section: 'cprAed', field: 'effectiveVentilations' },
    { ruleId: 'LIFE-CPR-AED-PROMPT', section: 'cprAed', field: 'aedDeliveredPromptly' },
    { ruleId: 'LIFE-CPR-AED-SAFE', section: 'cprAed', field: 'safeShockNoUnsafeContact' },
    { ruleId: 'LIFE-CPR-QUALITY', section: 'cprAed', field: 'continuousQualityCpr' }
  ]));
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'First Aid & Oxygen Therapy',
    description: 'Bleeding control, burns, fractures, recovery position, oxygen therapy, and pocket-mask / BVM technique.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-FA-BLEEDING', section: 'firstAidOxygen', field: 'bleedingControl' },
    { ruleId: 'LIFE-FA-BURNS', section: 'firstAidOxygen', field: 'burnsManagement' },
    { ruleId: 'LIFE-FA-FRACTURE', section: 'firstAidOxygen', field: 'fractureImmobilisation' },
    { ruleId: 'LIFE-FA-RECOVERY', section: 'firstAidOxygen', field: 'recoveryPositionUse' },
    { ruleId: 'LIFE-FA-OXYGEN', section: 'firstAidOxygen', field: 'oxygenTherapyAdministration' },
    { ruleId: 'LIFE-FA-MASK', section: 'firstAidOxygen', field: 'usesPocketMaskOrBVM' }
  ]));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Legal, Regulatory & Incident Reporting',
    description: 'Duty of care, PSOP / NOP / EAP knowledge, incident reporting, RIDDOR awareness, safeguarding.'
  });

  card.appendChild(checklist([
    { ruleId: 'LIFE-LR-DUTY', section: 'legalRegulatoryIncident', field: 'dutyOfCareUnderstood' },
    { ruleId: 'LIFE-LR-PSWP', section: 'legalRegulatoryIncident', field: 'pswpKnowledge' },
    { ruleId: 'LIFE-LR-EAP', section: 'legalRegulatoryIncident', field: 'eapInvocation' },
    { ruleId: 'LIFE-LR-REPORT', section: 'legalRegulatoryIncident', field: 'incidentReportCompleted' },
    { ruleId: 'LIFE-LR-RIDDOR', section: 'legalRegulatoryIncident', field: 'riddorAwareness' },
    { ruleId: 'LIFE-LR-SAFEGUARD', section: 'legalRegulatoryIncident', field: 'safeguardingChildrenAdults' }
  ]));
  return card;
}

function renderStep10() {
  const card = sectionCard({
    stepNumber: 10,
    title: 'Overall Result, Feedback & Signoff',
    description: 'Examiner records the recommended outcome, captures strengths and development areas, and confirms the candidate has been debriefed.'
  });

  card.appendChild(selectInput({
    label: 'Examiner recommended outcome',
    section: 'overallResultSignoff', field: 'examinerOutcome',
    options: [
      { value: 'pass', label: 'Pass' },
      { value: 'needs-development', label: 'Needs Development' },
      { value: 'fail', label: 'Fail' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Strengths observed',
    section: 'overallResultSignoff', field: 'strengths',
    placeholder: 'Specific behaviours and skills the candidate performed well…',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Development areas',
    section: 'overallResultSignoff', field: 'developmentAreas',
    placeholder: 'Concrete coaching points for follow-up…',
    rows: 3
  }));
  card.appendChild(textArea({
    label: 'Examiner notes',
    section: 'overallResultSignoff', field: 'examinerNotes',
    placeholder: 'Context, scenario details, conditions, equipment…',
    rows: 4
  }));
  card.appendChild(textArea({
    label: 'Candidate self-feedback',
    section: 'overallResultSignoff', field: 'candidateFeedback',
    placeholder: 'Candidate\u2019s reflections on the session…',
    rows: 3
  }));

  // Candidate acknowledgement (tri-state — yes / no / na)
  const ackUl = document.createElement('ul');
  ackUl.className = 'checklist';
  ackUl.appendChild(checklistItem({
    ruleId: 'SIGNOFF-ACK',
    section: 'overallResultSignoff',
    field: 'candidateAcknowledged',
    label: 'Candidate has been debriefed and acknowledges the result.',
    critical: false
  }));
  card.appendChild(ackUl);

  return card;
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

/**
 * Track a curated set of fields whose presence drives the progress bar.
 * Includes every checklist tri-state field plus the key numeric
 * measurements. Candidate-detail fields are intentionally excluded so the
 * bar reflects skills assessment, not paperwork.
 */
const TRACKED_FIELDS = [
  ['physicalFitnessSwim', 'swim50mTimeSeconds'],
  ['physicalFitnessSwim', 'swim50mWithinTime'],
  ['physicalFitnessSwim', 'surfaceDiveDepthMetres'],
  ['physicalFitnessSwim', 'sustainedSurfaceDive'],
  ['physicalFitnessSwim', 'swim200mTimeSeconds'],
  ['physicalFitnessSwim', 'swim200mMixedStrokes'],
  ['physicalFitnessSwim', 'treadWaterTwoMinutes'],
  ['physicalFitnessSwim', 'towCasualty50m'],

  ['supervisionScanningZoning', 'understandsZoneOfResponsibility'],
  ['supervisionScanningZoning', 'effectiveScanningPattern'],
  ['supervisionScanningZoning', 'tenTwentyScanRule'],
  ['supervisionScanningZoning', 'recognisesDistressedSwimmer'],
  ['supervisionScanningZoning', 'appropriateRotation'],
  ['supervisionScanningZoning', 'usesWhistleAndSignals'],

  ['rescueConscious', 'recognitionAndAlert'],
  ['rescueConscious', 'entryWithoutLossOfSight'],
  ['rescueConscious', 'approachWithFloatingAid'],
  ['rescueConscious', 'reassuresCasualty'],
  ['rescueConscious', 'towToSafety'],
  ['rescueConscious', 'extricationFromWater'],

  ['rescueUnconscious', 'recognitionAndAlert'],
  ['rescueUnconscious', 'safeEntryAndApproach'],
  ['rescueUnconscious', 'airwayManagementInWater'],
  ['rescueUnconscious', 'effectiveTowToSafety'],
  ['rescueUnconscious', 'safeExtrication'],
  ['rescueUnconscious', 'handoverHandsignal'],

  ['spinalInjuryManagement', 'recognisesMechanism'],
  ['spinalInjuryManagement', 'headSplintHold'],
  ['spinalInjuryManagement', 'maintainsInlineStabilisation'],
  ['spinalInjuryManagement', 'carefulRollIfNeeded'],
  ['spinalInjuryManagement', 'useOfSpineboard'],
  ['spinalInjuryManagement', 'secureCasualtyToBoard'],

  ['cprAed', 'compressionRate'],
  ['cprAed', 'compressionDepth'],
  ['cprAed', 'effectiveCompressions'],
  ['cprAed', 'effectiveVentilations'],
  ['cprAed', 'timeToFirstShockSeconds'],
  ['cprAed', 'aedDeliveredPromptly'],
  ['cprAed', 'safeShockNoUnsafeContact'],
  ['cprAed', 'continuousQualityCpr'],

  ['firstAidOxygen', 'bleedingControl'],
  ['firstAidOxygen', 'burnsManagement'],
  ['firstAidOxygen', 'fractureImmobilisation'],
  ['firstAidOxygen', 'recoveryPositionUse'],
  ['firstAidOxygen', 'oxygenTherapyAdministration'],
  ['firstAidOxygen', 'usesPocketMaskOrBVM'],

  ['legalRegulatoryIncident', 'dutyOfCareUnderstood'],
  ['legalRegulatoryIncident', 'pswpKnowledge'],
  ['legalRegulatoryIncident', 'eapInvocation'],
  ['legalRegulatoryIncident', 'incidentReportCompleted'],
  ['legalRegulatoryIncident', 'riddorAwareness'],
  ['legalRegulatoryIncident', 'safeguardingChildrenAdults'],

  ['overallResultSignoff', 'examinerOutcome'],
  ['overallResultSignoff', 'candidateAcknowledged']
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
    deficiencies,
    firedRules,
    additionalFlags,
    answeredCount,
    totalRules,
    timestamp
  } = lastResult;

  // Critical-skills audit table — always show all critical rules.
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
          <th scope="col">Critical competency</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>${auditRows}</tbody>
    </table>
  `;

  // Non-critical deficiencies summary
  const defList = deficiencies.length === 0
    ? `<p class="muted">No non-critical deficiencies recorded.</p>`
    : `
      <ul class="checklist" style="gap:0.375rem;">
        ${deficiencies.map((r) => `
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
    summaryText = `All critical competencies met; no non-critical deficiencies.`;
  } else if (outcome === 'needs-development') {
    summaryText = `${deficiencies.length} non-critical deficiency(ies) recorded; no critical-competency failure.`;
  } else if (criticalFailures.length > 0) {
    summaryText = `${criticalFailures.length} critical-competency failure(s) — automatic Fail.`;
  } else {
    summaryText = 'Insufficient items assessed to grade — please complete the checklist.';
  }

  const candidate = state.candidateDetails;
  const candidateName = `${candidate.firstName} ${candidate.lastName}`.trim();
  const examiner = candidate.examinerName;

  // Compare engine outcome with examiner-recommended outcome (if recorded)
  const examinerOutcome = state.overallResultSignoff.examinerOutcome;
  let outcomeNote = '';
  if (examinerOutcome && examinerOutcome !== outcome) {
    outcomeNote = `<p class="muted">Examiner-recommended outcome: <strong>${esc(outcomeLabel(examinerOutcome))}</strong> (differs from engine outcome — examiner override may apply).</p>`;
  } else if (examinerOutcome && examinerOutcome === outcome) {
    outcomeNote = `<p class="muted">Examiner-recommended outcome confirms engine result.</p>`;
  }

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Lifeguard Competency Verification Report</h2>
        <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}${
          candidateName ? ` for ${esc(candidateName)}` : ''
        }${examiner ? ` · examiner: ${esc(examiner)}` : ''}</p>
      </header>

      <h3>Outcome</h3>
      <p class="outcome-summary">
        <span class="outcome-badge ${outcomeClass(outcome)}">${esc(outcomeLabel(outcome) || '—')}</span>
        <span class="outcome-detail">${esc(summaryText)}</span>
      </p>
      <p class="muted">Based on ${answeredCount} of ${totalRules} checklist items recorded.</p>
      ${outcomeNote}

      <h3>Critical-skills audit</h3>
      ${auditTable}

      <h3>Non-critical deficiencies</h3>
      ${defList}

      <h3>Flagged issues</h3>
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
  const grading = gradeLifeguard(state);
  const additionalFlags = detectAdditionalFlags(state, grading);
  lastResult = {
    outcome: grading.outcome,
    criticalFailures: grading.criticalFailures,
    deficiencies: grading.deficiencies,
    firedRules: grading.firedRules,
    additionalFlags,
    answeredCount: grading.answeredCount,
    totalRules: grading.totalRules,
    timestamp: new Date().toISOString()
  };
  renderReport();
}

function startOver() {
  if (!confirm('Clear all answers and start a fresh lifeguard verification?')) return;
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
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
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
