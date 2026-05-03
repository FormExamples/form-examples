// Audio-Vestibular Assessment - patient/clinician wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page in
// document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered. Submission
// runs the pure WHO grading + DHI scoring engine and renders an inline
// report. State is persisted to localStorage so a partial fill survives a
// page reload.
//
// Sibling files loaded as plain <script> tags (in order) attach their
// exports to `window.AudioVestibularAssessment`. Pulling them off here keeps
// the rest of this file referring to short local names. Whole file is
// wrapped in an IIFE so its top-level identifiers don't leak to the global
// scope.
(function () {
'use strict';

const NS = window.AudioVestibularAssessment;
const {
  emptyAssessment,
  DHI_ITEMS,
  calculatePtaFromThresholds,
  hearingLossGradeLabel,
  hearingLossGradeClass,
  dhiHandicapLabel,
  dhiHandicapClass,
  grade,
  detectAdditionalFlags
} = NS;

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'audio-vestibular-assessment.front-end-form-with-html.v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return mergeIntoFresh(emptyAssessment(), parsed);
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** Deep merge `parsed` over `fresh`, only merging existing nested objects. */
function mergeIntoFresh(fresh, parsed) {
  if (!parsed || typeof parsed !== 'object') return fresh;
  for (const key of Object.keys(fresh)) {
    if (parsed[key] === undefined || parsed[key] === null) continue;
    const fv = fresh[key];
    const pv = parsed[key];
    if (Array.isArray(fv) || typeof fv !== 'object') {
      // primitive / array - take parsed value directly
      fresh[key] = pv;
    } else {
      // nested object - recurse
      fresh[key] = mergeIntoFresh({ ...fv }, pv);
    }
  }
  return fresh;
}

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

let state = loadState();
let lastResult = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

/** Walk a dotted path like 'pureToneAudiometry.rightEar.airConduction.hz500'. */
function getPath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}

function setPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null || typeof cur[parts[i]] !== 'object') {
      cur[parts[i]] = {};
    }
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

/** Set a deeply-nested field on the state and persist. */
function setField(path, value) {
  setPath(state, path, value);
  recomputeDerived();
  saveState(state);
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
}

/** Recompute auto-calculated values that depend on other fields. */
function recomputeDerived() {
  state.pureToneAudiometry.rightEar.pureToneAverage =
    calculatePtaFromThresholds(state.pureToneAudiometry.rightEar.airConduction);
  state.pureToneAudiometry.leftEar.pureToneAverage =
    calculatePtaFromThresholds(state.pureToneAudiometry.leftEar.airConduction);

  const r = state.pureToneAudiometry.rightEar.pureToneAverage;
  const l = state.pureToneAudiometry.leftEar.pureToneAverage;
  if (r != null && l != null) {
    state.pureToneAudiometry.betterEarPureToneAverage = Math.min(r, l);
    state.pureToneAudiometry.asymmetryDb = Math.round(Math.abs(r - l) * 10) / 10;
  } else if (r != null) {
    state.pureToneAudiometry.betterEarPureToneAverage = r;
    state.pureToneAudiometry.asymmetryDb = null;
  } else if (l != null) {
    state.pureToneAudiometry.betterEarPureToneAverage = l;
    state.pureToneAudiometry.asymmetryDb = null;
  } else {
    state.pureToneAudiometry.betterEarPureToneAverage = null;
    state.pureToneAudiometry.asymmetryDb = null;
  }
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

/** Build a labelled text input. `path` is a dotted state path. */
function textInput(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const value = getPath(state, opts.path);
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
  if (opts.min !== undefined) attrs.push(`min="${opts.min}"`);
  if (opts.max !== undefined) attrs.push(`max="${opts.max}"`);
  if (opts.step !== undefined) attrs.push(`step="${opts.step}"`);

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    ${opts.unit ? `<span class="unit">${esc(opts.unit)}</span>` : ''}
  `;

  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    let v = input.value;
    if (type === 'number') {
      v = v === '' ? null : Number(v);
    }
    setField(opts.path, v);
  });
  return wrapper;
}

function textArea(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const value = getPath(state, opts.path) ?? '';
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

function selectInput(opts) {
  const id = 'f-' + opts.path.replace(/\./g, '-');
  const current = getPath(state, opts.path) ?? '';
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
  sel.addEventListener('change', () => setField(opts.path, sel.value));
  return wrapper;
}

function radioGroup(opts) {
  const groupId = 'f-' + opts.path.replace(/\./g, '-');
  const current = getPath(state, opts.path);
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-group';

  const legend = document.createElement('legend');
  legend.textContent = opts.label;
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
      if (input.checked) setField(opts.path, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/** Read-only auto-calculated readout (e.g. PTA, better-ear PTA). */
function readOnlyReadout(opts) {
  const wrapper = document.createElement('div');
  wrapper.className = 'field readout';
  wrapper.innerHTML = `
    <label>${esc(opts.label)}</label>
    <div id="${opts.id}" class="readout-value">${opts.render()}</div>
  `;
  return wrapper;
}

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
      <span class="section-step">Section ${opts.stepNumber} of 9</span>
      <h2 class="section-title">${esc(opts.title)}</h2>
      ${desc}
    </header>
  `;
  return card;
}

function subsectionHeader(title, hint) {
  const el = document.createElement('div');
  el.className = 'subsection-header';
  el.innerHTML = `
    <h3>${esc(title)}</h3>
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
  `;
  return el;
}

// Common option lists.
const yesNo = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

const sideOptions = [
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'both', label: 'Both' }
];

// ----------------------------------------------------------------------
// Section 1 — Demographics
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First Name',  path: 'demographics.firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last Name',   path: 'demographics.lastName',  required: true }));
  card.appendChild(grid);

  const dobGrid = document.createElement('div');
  dobGrid.className = 'two-col';
  dobGrid.appendChild(textInput({
    label: 'Date of Birth',
    path: 'demographics.dateOfBirth',
    type: 'date',
    required: true
  }));
  dobGrid.appendChild(textInput({
    label: 'Assessment Date',
    path: 'demographics.assessmentDate',
    type: 'date'
  }));
  card.appendChild(dobGrid);

  card.appendChild(radioGroup({
    label: 'Sex',
    path: 'demographics.sex',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
      { value: 'other', label: 'Other' }
    ]
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 2 — Presenting Symptoms
// ----------------------------------------------------------------------

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'Presenting Symptoms',
    description: 'Hearing, balance, and related symptoms reported by the patient.'
  });

  card.appendChild(radioGroup({
    label: 'Hearing loss?',
    path: 'presentingSymptoms.hearingLoss',
    options: yesNo
  }));

  const hlDetails = document.createElement('div');
  hlDetails.dataset.conditional = 'presentingSymptoms.hearingLoss=yes';
  hlDetails.appendChild(radioGroup({
    label: 'Affected side',
    path: 'presentingSymptoms.hearingLossSide',
    options: sideOptions
  }));
  hlDetails.appendChild(radioGroup({
    label: 'Onset',
    path: 'presentingSymptoms.hearingLossOnset',
    options: [
      { value: 'sudden',       label: 'Sudden (< 72 h)' },
      { value: 'gradual',      label: 'Gradual' },
      { value: 'fluctuating',  label: 'Fluctuating' }
    ]
  }));
  hlDetails.appendChild(textInput({
    label: 'Duration',
    path: 'presentingSymptoms.hearingLossDurationMonths',
    type: 'number', min: 0, max: 1200, unit: 'months'
  }));
  card.appendChild(hlDetails);

  card.appendChild(radioGroup({
    label: 'Tinnitus?',
    path: 'presentingSymptoms.tinnitus',
    options: yesNo
  }));
  const tinDetails = document.createElement('div');
  tinDetails.dataset.conditional = 'presentingSymptoms.tinnitus=yes';
  tinDetails.appendChild(radioGroup({
    label: 'Tinnitus side',
    path: 'presentingSymptoms.tinnitusSide',
    options: sideOptions
  }));
  card.appendChild(tinDetails);

  const otGrid = document.createElement('div');
  otGrid.className = 'two-col';
  otGrid.appendChild(radioGroup({
    label: 'Otalgia (ear pain)?',
    path: 'presentingSymptoms.otalgia',
    options: yesNo
  }));
  otGrid.appendChild(radioGroup({
    label: 'Otorrhea (ear discharge)?',
    path: 'presentingSymptoms.otorrhea',
    options: yesNo
  }));
  card.appendChild(otGrid);

  card.appendChild(radioGroup({
    label: 'Aural fullness / pressure?',
    path: 'presentingSymptoms.auralFullness',
    options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Vertigo (true spinning)?',
    path: 'presentingSymptoms.vertigo',
    options: yesNo
  }));
  const vDetails = document.createElement('div');
  vDetails.dataset.conditional = 'presentingSymptoms.vertigo=yes';
  vDetails.appendChild(radioGroup({
    label: 'Character of dizziness',
    path: 'presentingSymptoms.vertigoCharacter',
    options: [
      { value: 'spinning',      label: 'Spinning' },
      { value: 'rocking',       label: 'Rocking / floating' },
      { value: 'lightheaded',   label: 'Lightheaded' },
      { value: 'imbalance',     label: 'Imbalance' }
    ]
  }));
  const vNumGrid = document.createElement('div');
  vNumGrid.className = 'two-col';
  vNumGrid.appendChild(textInput({
    label: 'Episode duration',
    path: 'presentingSymptoms.vertigoEpisodeDurationSeconds',
    type: 'number', min: 0, max: 86400, unit: 'seconds'
  }));
  vNumGrid.appendChild(textInput({
    label: 'Frequency',
    path: 'presentingSymptoms.vertigoFrequencyPerWeek',
    type: 'number', min: 0, max: 200, unit: 'per week'
  }));
  vDetails.appendChild(vNumGrid);
  card.appendChild(vDetails);

  card.appendChild(radioGroup({
    label: 'Imbalance / unsteadiness?',
    path: 'presentingSymptoms.imbalance',
    options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Falls in the past 12 months?',
    path: 'presentingSymptoms.falls',
    options: yesNo
  }));
  const fallsDetails = document.createElement('div');
  fallsDetails.dataset.conditional = 'presentingSymptoms.falls=yes';
  fallsDetails.appendChild(textInput({
    label: 'How many falls?',
    path: 'presentingSymptoms.fallsLastYearCount',
    type: 'number', min: 1, max: 1000
  }));
  card.appendChild(fallsDetails);

  card.appendChild(radioGroup({
    label: 'Headache or migraine history?',
    path: 'presentingSymptoms.headacheMigraine',
    options: yesNo
  }));

  card.appendChild(radioGroup({
    label: 'Neurological symptoms (weakness, double vision, slurred speech, numbness, ataxia)?',
    path: 'presentingSymptoms.neurologicalSymptoms',
    options: yesNo
  }));

  card.appendChild(textArea({
    label: 'Other symptoms',
    path: 'presentingSymptoms.otherSymptoms',
    placeholder: 'Anything else worth noting…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 3 — Otoscopic Examination
// ----------------------------------------------------------------------

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Otoscopic Examination',
    description: 'External canal and tympanic membrane appearance, each ear.'
  });

  const canalOptions = [
    { value: 'clear',    label: 'Clear' },
    { value: 'wax',      label: 'Wax / cerumen' },
    { value: 'debris',   label: 'Debris' },
    { value: 'edema',    label: 'Oedema' },
    { value: 'otorrhea', label: 'Otorrhea / discharge' }
  ];
  const tmOptions = [
    { value: 'intact',       label: 'Intact, normal' },
    { value: 'retracted',    label: 'Retracted' },
    { value: 'bulging',      label: 'Bulging' },
    { value: 'perforation',  label: 'Perforation' },
    { value: 'effusion',     label: 'Middle-ear effusion' },
    { value: 'tube',         label: 'Grommet / tube' },
    { value: 'scarred',      label: 'Tympanosclerosis / scarred' }
  ];

  card.appendChild(subsectionHeader('Right ear'));
  card.appendChild(selectInput({
    label: 'Canal status', path: 'otoscopicExamination.rightEar.canalStatus', options: canalOptions
  }));
  card.appendChild(selectInput({
    label: 'Tympanic membrane', path: 'otoscopicExamination.rightEar.tympanicMembrane', options: tmOptions
  }));

  card.appendChild(subsectionHeader('Left ear'));
  card.appendChild(selectInput({
    label: 'Canal status', path: 'otoscopicExamination.leftEar.canalStatus', options: canalOptions
  }));
  card.appendChild(selectInput({
    label: 'Tympanic membrane', path: 'otoscopicExamination.leftEar.tympanicMembrane', options: tmOptions
  }));

  card.appendChild(textArea({
    label: 'Otoscopy notes',
    path: 'otoscopicExamination.notes',
    placeholder: 'Any additional otoscopy findings…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 4 — Pure-Tone Audiometry
// ----------------------------------------------------------------------

function ptaThresholdGrid(basePath) {
  const grid = document.createElement('div');
  grid.className = 'pta-grid';
  const freqs = [
    { key: 'hz500',  label: '0.5 kHz' },
    { key: 'hz1000', label: '1 kHz' },
    { key: 'hz2000', label: '2 kHz' },
    { key: 'hz4000', label: '4 kHz' }
  ];
  for (const f of freqs) {
    grid.appendChild(textInput({
      label: f.label,
      path: `${basePath}.${f.key}`,
      type: 'number', min: -10, max: 120, unit: 'dB HL'
    }));
  }
  return grid;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'Pure-Tone Audiometry',
    description: 'Air-conduction and bone-conduction thresholds at 0.5, 1, 2, and 4 kHz.'
  });

  card.appendChild(subsectionHeader('Right ear — Air conduction', 'Threshold in dB HL.'));
  card.appendChild(ptaThresholdGrid('pureToneAudiometry.rightEar.airConduction'));

  card.appendChild(subsectionHeader('Right ear — Bone conduction'));
  card.appendChild(ptaThresholdGrid('pureToneAudiometry.rightEar.boneConduction'));

  card.appendChild(readOnlyReadout({
    label: 'Right ear PTA (4-frequency average, air conduction)',
    id: 'right-pta-readout',
    render: () => renderPtaReadout(state.pureToneAudiometry.rightEar.pureToneAverage)
  }));

  card.appendChild(subsectionHeader('Left ear — Air conduction'));
  card.appendChild(ptaThresholdGrid('pureToneAudiometry.leftEar.airConduction'));

  card.appendChild(subsectionHeader('Left ear — Bone conduction'));
  card.appendChild(ptaThresholdGrid('pureToneAudiometry.leftEar.boneConduction'));

  card.appendChild(readOnlyReadout({
    label: 'Left ear PTA (4-frequency average, air conduction)',
    id: 'left-pta-readout',
    render: () => renderPtaReadout(state.pureToneAudiometry.leftEar.pureToneAverage)
  }));

  const summaryGrid = document.createElement('div');
  summaryGrid.className = 'two-col';
  summaryGrid.appendChild(readOnlyReadout({
    label: 'Better-ear PTA',
    id: 'better-pta-readout',
    render: () => renderPtaReadout(state.pureToneAudiometry.betterEarPureToneAverage)
  }));
  summaryGrid.appendChild(readOnlyReadout({
    label: 'Inter-aural asymmetry',
    id: 'asymmetry-readout',
    render: () => renderAsymmetryReadout(state.pureToneAudiometry.asymmetryDb)
  }));
  card.appendChild(summaryGrid);

  card.appendChild(textArea({
    label: 'Audiometry notes',
    path: 'pureToneAudiometry.audiometryNotes',
    placeholder: 'Masking applied, no-response thresholds, equipment notes…',
    rows: 3
  }));

  return card;
}

function renderPtaReadout(v) {
  if (v == null) return '<span class="muted">Auto-calculated</span>';
  return `<strong>${v} dB HL</strong>`;
}

function renderAsymmetryReadout(v) {
  if (v == null) return '<span class="muted">Both ears required</span>';
  return `<strong>${v} dB</strong>`;
}

// ----------------------------------------------------------------------
// Section 5 — Speech Audiometry
// ----------------------------------------------------------------------

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'Speech Audiometry',
    description: 'Speech-reception threshold (SRT) and word-recognition score (WRS), each ear.'
  });

  card.appendChild(subsectionHeader('Right ear'));
  const rGrid = document.createElement('div');
  rGrid.className = 'two-col';
  rGrid.appendChild(textInput({
    label: 'SRT (right)',
    path: 'speechAudiometry.rightSrtDb',
    type: 'number', min: -10, max: 120, unit: 'dB HL'
  }));
  rGrid.appendChild(textInput({
    label: 'Word-recognition score (right)',
    path: 'speechAudiometry.rightWordRecognitionPercent',
    type: 'number', min: 0, max: 100, unit: '%'
  }));
  card.appendChild(rGrid);

  card.appendChild(subsectionHeader('Left ear'));
  const lGrid = document.createElement('div');
  lGrid.className = 'two-col';
  lGrid.appendChild(textInput({
    label: 'SRT (left)',
    path: 'speechAudiometry.leftSrtDb',
    type: 'number', min: -10, max: 120, unit: 'dB HL'
  }));
  lGrid.appendChild(textInput({
    label: 'Word-recognition score (left)',
    path: 'speechAudiometry.leftWordRecognitionPercent',
    type: 'number', min: 0, max: 100, unit: '%'
  }));
  card.appendChild(lGrid);

  card.appendChild(textArea({
    label: 'Speech-audiometry notes',
    path: 'speechAudiometry.speechAudiometryNotes',
    placeholder: 'Test list used, presentation level, masking…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 6 — Tympanometry & Acoustic Reflexes
// ----------------------------------------------------------------------

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Tympanometry & Acoustic Reflexes',
    description: 'Middle-ear admittance and stapedial reflex screening.'
  });

  const tympOptions = [
    { value: 'A',  label: 'Type A (normal)' },
    { value: 'As', label: 'Type As (shallow / stiff)' },
    { value: 'Ad', label: 'Type Ad (hypermobile)' },
    { value: 'B',  label: 'Type B (flat)' },
    { value: 'C',  label: 'Type C (negative pressure)' }
  ];
  const reflexOptions = [
    { value: 'present',  label: 'Present' },
    { value: 'absent',   label: 'Absent' },
    { value: 'partial',  label: 'Partial' }
  ];

  card.appendChild(subsectionHeader('Right ear'));
  const rGrid = document.createElement('div');
  rGrid.className = 'two-col';
  rGrid.appendChild(selectInput({
    label: 'Tympanogram',
    path: 'tympanometryAcousticReflexes.rightTympanogram',
    options: tympOptions
  }));
  rGrid.appendChild(selectInput({
    label: 'Acoustic reflexes',
    path: 'tympanometryAcousticReflexes.rightAcousticReflexes',
    options: reflexOptions
  }));
  card.appendChild(rGrid);

  card.appendChild(subsectionHeader('Left ear'));
  const lGrid = document.createElement('div');
  lGrid.className = 'two-col';
  lGrid.appendChild(selectInput({
    label: 'Tympanogram',
    path: 'tympanometryAcousticReflexes.leftTympanogram',
    options: tympOptions
  }));
  lGrid.appendChild(selectInput({
    label: 'Acoustic reflexes',
    path: 'tympanometryAcousticReflexes.leftAcousticReflexes',
    options: reflexOptions
  }));
  card.appendChild(lGrid);

  card.appendChild(textArea({
    label: 'Tympanometry / reflex notes',
    path: 'tympanometryAcousticReflexes.notes',
    placeholder: 'Probe-tone, ECV, peak admittance…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 7 — Vestibular Screening
// ----------------------------------------------------------------------

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'Vestibular Screening',
    description: 'Bedside vestibular tests: HIT, Dix-Hallpike, Romberg, tandem gait, nystagmus, Fukuda.'
  });

  card.appendChild(selectInput({
    label: 'Head Impulse Test (HIT)',
    path: 'vestibularScreening.headImpulseTest',
    options: [
      { value: 'normal',          label: 'Normal' },
      { value: 'abnormal-right',  label: 'Abnormal — right' },
      { value: 'abnormal-left',   label: 'Abnormal — left' },
      { value: 'not-done',        label: 'Not done' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Dix-Hallpike',
    path: 'vestibularScreening.dixHallpike',
    options: [
      { value: 'negative',        label: 'Negative' },
      { value: 'positive-right',  label: 'Positive — right' },
      { value: 'positive-left',   label: 'Positive — left' },
      { value: 'bilateral',       label: 'Bilateral' },
      { value: 'not-done',        label: 'Not done' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Romberg test',
    path: 'vestibularScreening.rombergTest',
    options: [
      { value: 'normal',   label: 'Normal' },
      { value: 'abnormal', label: 'Abnormal' },
      { value: 'unable',   label: 'Unable to perform' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Tandem gait',
    path: 'vestibularScreening.tandemGait',
    options: [
      { value: 'normal',   label: 'Normal' },
      { value: 'abnormal', label: 'Abnormal' },
      { value: 'unable',   label: 'Unable to perform' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Nystagmus',
    path: 'vestibularScreening.nystagmus',
    options: [
      { value: 'none',          label: 'None' },
      { value: 'spontaneous',   label: 'Spontaneous' },
      { value: 'gaze-evoked',   label: 'Gaze-evoked' },
      { value: 'positional',    label: 'Positional' }
    ]
  }));

  card.appendChild(selectInput({
    label: 'Fukuda stepping test',
    path: 'vestibularScreening.fukudaSteppingTest',
    options: [
      { value: 'normal',          label: 'Normal' },
      { value: 'rotation-right',  label: 'Rotation — right' },
      { value: 'rotation-left',   label: 'Rotation — left' },
      { value: 'not-done',        label: 'Not done' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Vestibular screening notes',
    path: 'vestibularScreening.notes',
    placeholder: 'Any additional bedside vestibular findings…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Section 8 — Dizziness Handicap Inventory (DHI)
// ----------------------------------------------------------------------

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'Dizziness Handicap Inventory (DHI)',
    description:
      '25 questions. For each, choose Yes (4 points), Sometimes (2 points), or No (0 points). Subscales: F = Functional, E = Emotional, P = Physical.'
  });

  const list = document.createElement('div');
  list.className = 'dhi-list';

  for (const item of DHI_ITEMS) {
    const path = `dizzinessHandicapInventory.q${item.num}`;
    const current = getPath(state, path) ?? '';
    const groupId = 'f-dhi-q' + item.num;

    const row = document.createElement('div');
    row.className = 'dhi-item';

    const q = document.createElement('div');
    q.className = 'dhi-question';
    q.innerHTML = `
      <span class="dhi-num">${item.num}.</span>
      <span class="dhi-prefix">${esc(item.subscale)}</span>
      ${esc(item.text)}
    `;
    row.appendChild(q);

    const opts = document.createElement('div');
    opts.className = 'radio-options';
    for (const opt of [
      { value: 'yes',       label: 'Yes' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'no',        label: 'No' }
    ]) {
      const radioId = `${groupId}-${opt.value}`;
      const label = document.createElement('label');
      label.className = 'radio-option';
      label.htmlFor = radioId;
      const checked = current === opt.value ? ' checked' : '';
      label.innerHTML = `
        <input type="radio" id="${radioId}" name="${groupId}" value="${esc(opt.value)}"${checked}>
        <span>${esc(opt.label)}</span>
      `;
      const input = label.querySelector('input');
      input.addEventListener('change', () => {
        if (input.checked) setField(path, opt.value);
      });
      opts.appendChild(label);
    }
    row.appendChild(opts);

    list.appendChild(row);
  }

  card.appendChild(list);
  return card;
}

// ----------------------------------------------------------------------
// Section 9 — Clinical Impression & Referral
// ----------------------------------------------------------------------

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Clinical Impression & Referral',
    description: 'Provisional diagnosis, hearing-aid candidacy, vestibular rehab, and onward referral plan.'
  });

  card.appendChild(textArea({
    label: 'Provisional diagnosis',
    path: 'clinicalImpressionReferral.provisionalDiagnosis',
    placeholder: 'e.g. Right SSNHL; BPPV (posterior canal); Meniere disease…',
    rows: 3
  }));

  const grid1 = document.createElement('div');
  grid1.className = 'two-col';
  grid1.appendChild(selectInput({
    label: 'Hearing-aid candidate?',
    path: 'clinicalImpressionReferral.hearingAidCandidate',
    options: [
      { value: 'yes',             label: 'Yes' },
      { value: 'no',              label: 'No' },
      { value: 'already-fitted',  label: 'Already fitted' }
    ]
  }));
  grid1.appendChild(radioGroup({
    label: 'Vestibular rehabilitation indicated?',
    path: 'clinicalImpressionReferral.vestibularRehabIndicated',
    options: yesNo
  }));
  card.appendChild(grid1);

  const grid2 = document.createElement('div');
  grid2.className = 'two-col';
  grid2.appendChild(radioGroup({
    label: 'ENT referral?',
    path: 'clinicalImpressionReferral.ent_referral',
    options: yesNo
  }));
  grid2.appendChild(radioGroup({
    label: 'Neurology referral?',
    path: 'clinicalImpressionReferral.neurologyReferral',
    options: yesNo
  }));
  card.appendChild(grid2);

  const grid3 = document.createElement('div');
  grid3.className = 'two-col';
  grid3.appendChild(selectInput({
    label: 'Imaging requested',
    path: 'clinicalImpressionReferral.imagingRequested',
    options: [
      { value: 'mri',  label: 'MRI internal auditory meatus / IAM' },
      { value: 'ct',   label: 'CT temporal bone' },
      { value: 'none', label: 'None' }
    ]
  }));
  grid3.appendChild(textInput({
    label: 'Follow-up',
    path: 'clinicalImpressionReferral.followUpWeeks',
    type: 'number', min: 0, max: 156, unit: 'weeks'
  }));
  card.appendChild(grid3);

  card.appendChild(textArea({
    label: 'Additional notes',
    path: 'clinicalImpressionReferral.additionalNotes',
    placeholder: 'Anything else for the clinical record…',
    rows: 3
  }));

  return card;
}

// ----------------------------------------------------------------------
// Conditional sections + auto-calculated readouts
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const current = getPath(state, path);
    host.style.display = String(current) === target ? '' : 'none';
  });
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const [path, targetCsv] = expr.split('=');
    const current = String(getPath(state, path) ?? '');
    const targets = targetCsv.split(',');
    host.style.display = targets.includes(current) ? '' : 'none';
  });
}

function refreshAutoCalculatedReadouts() {
  const r = document.getElementById('right-pta-readout');
  if (r) r.innerHTML = renderPtaReadout(state.pureToneAudiometry.rightEar.pureToneAverage);
  const l = document.getElementById('left-pta-readout');
  if (l) l.innerHTML = renderPtaReadout(state.pureToneAudiometry.leftEar.pureToneAverage);
  const b = document.getElementById('better-pta-readout');
  if (b) b.innerHTML = renderPtaReadout(state.pureToneAudiometry.betterEarPureToneAverage);
  const a = document.getElementById('asymmetry-readout');
  if (a) a.innerHTML = renderAsymmetryReadout(state.pureToneAudiometry.asymmetryDb);
}

// ----------------------------------------------------------------------
// Progress
// ----------------------------------------------------------------------

const TRACKED_FIELDS = [
  // Demographics (5)
  'demographics.firstName',
  'demographics.lastName',
  'demographics.dateOfBirth',
  'demographics.sex',
  'demographics.assessmentDate',
  // Presenting symptoms — top-level yes/no (10)
  'presentingSymptoms.hearingLoss',
  'presentingSymptoms.tinnitus',
  'presentingSymptoms.otalgia',
  'presentingSymptoms.otorrhea',
  'presentingSymptoms.auralFullness',
  'presentingSymptoms.vertigo',
  'presentingSymptoms.imbalance',
  'presentingSymptoms.falls',
  'presentingSymptoms.headacheMigraine',
  'presentingSymptoms.neurologicalSymptoms',
  // Otoscopic (4)
  'otoscopicExamination.rightEar.canalStatus',
  'otoscopicExamination.rightEar.tympanicMembrane',
  'otoscopicExamination.leftEar.canalStatus',
  'otoscopicExamination.leftEar.tympanicMembrane',
  // PTA (8 air-conduction thresholds across both ears)
  'pureToneAudiometry.rightEar.airConduction.hz500',
  'pureToneAudiometry.rightEar.airConduction.hz1000',
  'pureToneAudiometry.rightEar.airConduction.hz2000',
  'pureToneAudiometry.rightEar.airConduction.hz4000',
  'pureToneAudiometry.leftEar.airConduction.hz500',
  'pureToneAudiometry.leftEar.airConduction.hz1000',
  'pureToneAudiometry.leftEar.airConduction.hz2000',
  'pureToneAudiometry.leftEar.airConduction.hz4000',
  // Speech audiometry (4)
  'speechAudiometry.rightSrtDb',
  'speechAudiometry.leftSrtDb',
  'speechAudiometry.rightWordRecognitionPercent',
  'speechAudiometry.leftWordRecognitionPercent',
  // Tympanometry (4)
  'tympanometryAcousticReflexes.rightTympanogram',
  'tympanometryAcousticReflexes.leftTympanogram',
  'tympanometryAcousticReflexes.rightAcousticReflexes',
  'tympanometryAcousticReflexes.leftAcousticReflexes',
  // Vestibular screening (6)
  'vestibularScreening.headImpulseTest',
  'vestibularScreening.dixHallpike',
  'vestibularScreening.rombergTest',
  'vestibularScreening.tandemGait',
  'vestibularScreening.nystagmus',
  'vestibularScreening.fukudaSteppingTest',
  // DHI (25 items added below)
  // Clinical impression (5)
  'clinicalImpressionReferral.hearingAidCandidate',
  'clinicalImpressionReferral.vestibularRehabIndicated',
  'clinicalImpressionReferral.ent_referral',
  'clinicalImpressionReferral.neurologyReferral',
  'clinicalImpressionReferral.imagingRequested'
];
for (const item of DHI_ITEMS) {
  TRACKED_FIELDS.push(`dizzinessHandicapInventory.q${item.num}`);
}

function updateProgress() {
  let answered = 0;
  for (const path of TRACKED_FIELDS) {
    const v = getPath(state, path);
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

function priorityClass(priority) {
  switch (priority) {
    case 'urgent': return 'flag-urgent';
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

  const r = lastResult;

  const flagsList = r.additionalFlags.length === 0
    ? `<p class="muted">No additional flags raised.</p>`
    : `
      <ul class="flags">
        ${r.additionalFlags.map((f) => `
          <li class="${priorityClass(f.priority)}">
            <span class="flag-priority">${esc(f.priority.toUpperCase())}</span>
            <span class="flag-category">${esc(f.category)}</span>
            <span class="flag-message">${esc(f.message)}</span>
          </li>
        `).join('')}
      </ul>
    `;

  const ptaTable = `
    <table class="subscales">
      <thead>
        <tr>
          <th scope="col">Ear</th>
          <th scope="col" class="num">PTA (dB HL)</th>
          <th scope="col">WHO grade</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">Right</th>
          <td class="num">${r.rightPta == null ? '—' : esc(r.rightPta)}</td>
          <td>${esc(hearingLossGradeLabel(r.rightHearingLossGrade))}</td>
        </tr>
        <tr>
          <th scope="row">Left</th>
          <td class="num">${r.leftPta == null ? '—' : esc(r.leftPta)}</td>
          <td>${esc(hearingLossGradeLabel(r.leftHearingLossGrade))}</td>
        </tr>
      </tbody>
    </table>
  `;

  out.innerHTML = `
    <div class="report-card">
      <header class="report-header">
        <h2>Audio-Vestibular Assessment Report</h2>
        <p class="muted">Generated ${esc(new Date(r.timestamp).toLocaleString())}</p>
      </header>

      <h3>Headline results</h3>
      <div class="result-row">
        <div class="result-card">
          <div class="label">Better-ear PTA</div>
          <div class="value">${r.betterEarPta == null ? '—' : esc(r.betterEarPta) + ' dB'}</div>
          <div class="sub">${r.asymmetry == null ? 'Asymmetry: —' : 'Asymmetry: ' + esc(r.asymmetry) + ' dB'}</div>
          <span class="result-badge ${hearingLossGradeClass(r.hearingLossGrade)}">${esc(hearingLossGradeLabel(r.hearingLossGrade))}</span>
        </div>
        <div class="result-card">
          <div class="label">DHI total</div>
          <div class="value">${esc(r.dhiTotal)} / 100</div>
          <div class="sub">Based on ${esc(r.dhiAnsweredCount)} of 25 items answered.</div>
          <span class="result-badge ${dhiHandicapClass(r.dhiHandicapLevel)}">${esc(dhiHandicapLabel(r.dhiHandicapLevel))}</span>
        </div>
      </div>

      <h3>Pure-tone audiometry</h3>
      ${ptaTable}

      <h3>DHI subscales</h3>
      <div class="dhi-subscales">
        <div class="dhi-subscale">
          <div class="label">Functional (F, max 36)</div>
          <div class="value">${esc(r.dhiFunctional)}</div>
        </div>
        <div class="dhi-subscale">
          <div class="label">Emotional (E, max 36)</div>
          <div class="value">${esc(r.dhiEmotional)}</div>
        </div>
        <div class="dhi-subscale">
          <div class="label">Physical (P, max 28)</div>
          <div class="value">${esc(r.dhiPhysical)}</div>
        </div>
      </div>

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

function submitForm() {
  recomputeDerived();
  const result = grade(state);
  const additionalFlags = detectAdditionalFlags(state, result);
  lastResult = {
    ...result,
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
  updateConditionalSections();
  refreshAutoCalculatedReadouts();
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
}

function init() {
  recomputeDerived();
  renderForm();
  updateProgress();
  updateConditionalSections();
  refreshAutoCalculatedReadouts();

  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', startOver);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
