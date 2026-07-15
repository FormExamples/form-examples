import { detectAdditionalFlags } from './flagged-issues.js';
import { gradeFMS } from './fms-grader.js';
import { fmsScoreOptions, fmsScoreOptionsCompact } from './fms-rules.js';
import { emptyAssessment, emptyPattern, fmsBandClass, fmsCategory, riskBand, riskBandLabel } from './types.js';

// Kinesiology Assessment - patient wizard (vanilla JavaScript, no build).
//
// Single-page continuous wizard: every section is rendered into the page
// in document order. The user scrolls through them; a sticky top-of-page
// progress summary reflects how many fields have been answered.
// Submission runs the pure FMS scoring engine and renders an inline
// report. State is persisted to localStorage so a partial fill survives
// a page reload.
//
// Sibling files loaded as plain `<script>` tags (in order) attach their
// exports to `window.KinesiologyAssessment`. Pulling them off here keeps
// the rest of this file referring to short local names. Whole file is
// wrapped in an IIFE so its top-level identifiers don't leak.

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

const STORAGE_KEY = 'kinesiology-assessment.front-end-form-with-html.v1';
const TOTAL_STEPS = 10;

/** @returns {import('./types.js').AssessmentData} */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyAssessment();
    const parsed = JSON.parse(raw);
    return mergeIntoFresh(parsed);
  } catch (e) {
    console.warn('Could not parse saved assessment; starting fresh.', e);
    return emptyAssessment();
  }
}

/** Deep-merge parsed state into a fresh empty assessment so newly-added
 *  fields default correctly when older saved state is rehydrated. */
function mergeIntoFresh(parsed) {
  const fresh = emptyAssessment();
  if (!parsed || typeof parsed !== 'object') return fresh;

  for (const key of Object.keys(fresh)) {
    if (parsed[key] && typeof parsed[key] === 'object') {
      if (key === 'fmsPatterns') {
        // Merge each FMS pattern + clearingTests sub-object individually.
        for (const sub of Object.keys(fresh.fmsPatterns)) {
          if (parsed.fmsPatterns?.[sub] && typeof parsed.fmsPatterns[sub] === 'object') {
            fresh.fmsPatterns[sub] = { ...fresh.fmsPatterns[sub], ...parsed.fmsPatterns[sub] };
          }
        }
      } else {
        fresh[key] = { ...fresh[key], ...parsed[key] };
      }
    }
  }
  return fresh;
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

/** Escape user-entered text for safe rendering. */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  updateConditionalSections();
}

/**
 * Set a field on a specific FMS pattern (`fmsPatterns.<name>.<field>`).
 * @param {string} pattern
 * @param {string} field
 * @param {*} value
 */
function setPatternField(pattern, field, value) {
  state.fmsPatterns[pattern][field] = value;
  saveState(state);
  updateProgress();
}

/** Set a field on the shared clearingTests object. */
function setClearingField(field, value) {
  state.fmsPatterns.clearingTests[field] = value;
  saveState(state);
  updateProgress();
}

// ----------------------------------------------------------------------
// Component builders
// ----------------------------------------------------------------------

function lilyInputClass(type) {
  switch (type) {
    case 'email':  return 'email-input';
    case 'number': return 'number-input';
    case 'date':   return 'date-input';
    case 'time':   return 'time-input';
    case 'tel':    return 'tel-input';
    case 'url':    return 'url-input';
    case 'search': return 'search-input';
    default:       return 'text-input';
  }
}

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
    `class="${lilyInputClass(type)}"`,
    `value="${esc(value == null ? '' : value)}"`,
    `aria-describedby="${id}-error"`
  ];
  if (opts.placeholder) attrs.push(`placeholder="${esc(opts.placeholder)}"`);
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <input ${attrs.join(' ')}>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('input', () => {
    setField(opts.section, opts.field, input.value);
    clearFieldError(id);
  });
  return wrapper;
}

/**
 * Build a labelled multi-line textarea.
 * @param {{ label: string, section: string, field: string,
 *           placeholder?: string, rows?: number, required?: boolean }} opts
 */
function textArea(opts) {
  const id = `${opts.section}-${opts.field}`;
  const value = state[opts.section][opts.field] || '';
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const requiredAttr = opts.required ? ' required data-required' : '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${labelText}</label>
    <textarea id="${id}" name="${id}" rows="${opts.rows || 3}"
      ${opts.placeholder ? `placeholder="${esc(opts.placeholder)}"` : ''}
      aria-describedby="${id}-error"${requiredAttr}
      class="text-area-input">${esc(value)}</textarea>
    <span class="error-message" id="${id}-error" aria-live="polite"></span>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setField(opts.section, opts.field, ta.value);
    clearFieldError(id);
  });
  return wrapper;
}

/**
 * Build a radio group bound to `state[section][field]`.
 * @param {{ label: string, section: string, field: string,
 *           options: { value: string, label: string }[],
 *           required?: boolean, stacked?: boolean }} opts
 */
function radioGroup(opts) {
  const groupId = `${opts.section}-${opts.field}`;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.innerHTML = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group' + (opts.stacked ? ' stacked' : '');
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    const requiredAttr = opts.required ? ' data-required' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${esc(option.value)}"${checked}${requiredAttr}>
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
  errSpan.setAttribute('aria-live', 'polite');
  wrapper.appendChild(errSpan);
  return wrapper;
}

/**
 * Pattern-score radio group bound to `state.fmsPatterns[pattern][field]`.
 * Values are numeric (0/1/2/3) so we cast on change.
 *
 * @param {{ label: string, pattern: string, field: 'score'|'leftScore'|'rightScore',
 *           options: { value: number, label: string }[], stacked?: boolean }} opts
 */
function patternScoreRadioGroup(opts) {
  const groupId = `fmsPatterns-${opts.pattern}-${opts.field}`;
  const current = state.fmsPatterns[opts.pattern][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field';
  wrapper.id = `${groupId}-fieldset`;

  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.innerHTML = esc(opts.label);
  wrapper.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'radio-group' + (opts.stacked ? ' stacked' : '');
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', wrapper.id);
  for (const option of opts.options) {
    const radioId = `${groupId}-${option.value}`;
    const label = document.createElement('label');
    label.htmlFor = radioId;
    const checked = current === option.value ? ' checked' : '';
    label.innerHTML = `
      <input class="radio-input" type="radio" id="${radioId}" name="${groupId}" value="${option.value}"${checked}>
      <span>${esc(option.label)}</span>
    `;
    const input = label.querySelector('input');
    input.addEventListener('change', () => {
      if (input.checked) setPatternField(opts.pattern, opts.field, option.value);
    });
    list.appendChild(label);
  }
  wrapper.appendChild(list);
  return wrapper;
}

/**
 * Pain-during-movement checkbox for a pattern.
 * @param {string} pattern
 */
function painCheckbox(pattern) {
  const id = `fmsPatterns-${pattern}-painDuringMovement`;
  const checked = state.fmsPatterns[pattern].painDuringMovement;
  const wrapper = document.createElement('label');
  wrapper.className = 'checkbox-option';
  wrapper.htmlFor = id;
  wrapper.innerHTML = `
    <input type="checkbox" id="${id}" ${checked ? 'checked' : ''}>
    <span>Pain reported during this movement</span>
  `;
  const input = wrapper.querySelector('input');
  input.addEventListener('change', () => {
    setPatternField(pattern, 'painDuringMovement', input.checked);
  });
  return wrapper;
}

/**
 * Pattern-asymmetry-notes textarea.
 * @param {string} pattern
 * @param {string} label
 * @param {string} placeholder
 */
function patternNotes(pattern, label, placeholder) {
  const id = `fmsPatterns-${pattern}-asymmetryNotes`;
  const value = state.fmsPatterns[pattern].asymmetryNotes || '';
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML = `
    <label class="label" for="${id}">${esc(label)}</label>
    <textarea id="${id}" name="${id}" rows="3"
      placeholder="${esc(placeholder)}"
      class="text-area-input">${esc(value)}</textarea>
  `;
  const ta = wrapper.querySelector('textarea');
  ta.addEventListener('input', () => {
    setPatternField(pattern, 'asymmetryNotes', ta.value);
  });
  return wrapper;
}

/**
 * Section card wrapper (Lily fieldset).
 * @param {{ stepNumber: number, title: string, description?: string }} opts
 */
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
    `<span class="section-step">Section ${opts.stepNumber} of ${TOTAL_STEPS}</span>` +
    `<span class="section-title">${esc(opts.title)}</span>` +
    desc;
  card.appendChild(legend);
  return card;
}

// ----------------------------------------------------------------------
// FMS pattern composite renderers
// ----------------------------------------------------------------------

/** Single-score (non-bilateral) pattern: deep squat, trunk push-up. */
function unilateralPattern(opts) {
  const card = sectionCard({
    stepNumber: opts.stepNumber,
    title: opts.title,
    description: opts.description
  });

  card.appendChild(patternScoreRadioGroup({
    label: 'Score',
    pattern: opts.pattern,
    field: 'score',
    options: fmsScoreOptions
  }));

  card.appendChild(painCheckbox(opts.pattern));

  if (opts.clearingBlock) card.appendChild(opts.clearingBlock());

  card.appendChild(patternNotes(
    opts.pattern,
    'Observations / Notes',
    'Note any compensations, deviations, or relevant observations…'
  ));

  return card;
}

/** Bilateral (left/right side score) pattern. */
function bilateralPattern(opts) {
  const card = sectionCard({
    stepNumber: opts.stepNumber,
    title: opts.title,
    description: opts.description
  });

  const grid = document.createElement('div');
  grid.className = 'bilateral-grid';
  grid.appendChild(patternScoreRadioGroup({
    label: 'Left Side Score',
    pattern: opts.pattern,
    field: 'leftScore',
    options: fmsScoreOptionsCompact,
    stacked: true
  }));
  grid.appendChild(patternScoreRadioGroup({
    label: 'Right Side Score',
    pattern: opts.pattern,
    field: 'rightScore',
    options: fmsScoreOptionsCompact,
    stacked: true
  }));
  card.appendChild(grid);

  card.appendChild(painCheckbox(opts.pattern));

  if (opts.clearingBlock) card.appendChild(opts.clearingBlock());

  card.appendChild(patternNotes(
    opts.pattern,
    'Asymmetry Notes / Observations',
    'Note any left-right differences, compensations, or relevant observations…'
  ));

  return card;
}

/** Shoulder clearing-test panel (renders inside step 7). */
function shoulderClearingPanel() {
  const block = document.createElement('div');
  block.className = 'clearing-test-block';
  const checked = state.fmsPatterns.clearingTests.shoulderClearingPain;
  block.innerHTML = `
    <h3>Shoulder Clearing Test</h3>
    <p class="hint">Place hand on opposite shoulder and attempt to point elbow upward. Positive if pain is produced.</p>
    <label class="checkbox-option" for="clearing-shoulderClearingPain">
      <input type="checkbox" id="clearing-shoulderClearingPain" ${checked ? 'checked' : ''}>
      <span>Pain produced during shoulder clearing test</span>
    </label>
  `;
  const cb = block.querySelector('input');
  cb.addEventListener('change', () => setClearingField('shoulderClearingPain', cb.checked));
  return block;
}

/** Trunk clearing-tests panel (renders inside step 9). */
function trunkClearingPanel() {
  const block = document.createElement('div');
  block.className = 'clearing-test-block';
  const ext = state.fmsPatterns.clearingTests.trunkExtensionClearingPain;
  const flex = state.fmsPatterns.clearingTests.trunkFlexionClearingPain;
  block.innerHTML = `
    <h3>Trunk Clearing Tests</h3>
    <p class="hint">Spinal extension and flexion clearing tests. Positive if pain is produced during either movement.</p>
    <label class="checkbox-option" for="clearing-trunkExtensionClearingPain">
      <input type="checkbox" id="clearing-trunkExtensionClearingPain" ${ext ? 'checked' : ''}>
      <span>Pain during trunk extension (press-up) clearing test</span>
    </label>
    <label class="checkbox-option" for="clearing-trunkFlexionClearingPain">
      <input type="checkbox" id="clearing-trunkFlexionClearingPain" ${flex ? 'checked' : ''}>
      <span>Pain during trunk flexion (posterior rocking) clearing test</span>
    </label>
  `;
  const inputs = block.querySelectorAll('input');
  inputs[0].addEventListener('change', () => setClearingField('trunkExtensionClearingPain', inputs[0].checked));
  inputs[1].addEventListener('change', () => setClearingField('trunkFlexionClearingPain', inputs[1].checked));
  return block;
}

// ----------------------------------------------------------------------
// Step renderers (1-10) - ported from Step*.svelte components
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Demographics',
    description: 'Basic patient information.'
  });

  const grid = document.createElement('div');
  grid.className = 'two-col';
  grid.appendChild(textInput({ label: 'First Name', section: 'demographics', field: 'firstName', required: true }));
  grid.appendChild(textInput({ label: 'Last Name', section: 'demographics', field: 'lastName', required: true }));
  card.appendChild(grid);

  card.appendChild(textInput({
    label: 'Date of Birth',
    section: 'demographics',
    field: 'dateOfBirth',
    type: 'date',
    required: true
  }));
  card.appendChild(radioGroup({
    label: 'Sex',
    section: 'demographics',
    field: 'sex',
    required: true,
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
    title: 'Referral Information',
    description: 'Details about the referral and sport/activity.'
  });

  card.appendChild(textInput({
    label: 'Referring Provider',
    section: 'referralInfo', field: 'referringProvider',
    placeholder: 'e.g. Dr. Smith, GP',
    required: true
  }));
  card.appendChild(textArea({
    label: 'Reason for Referral',
    section: 'referralInfo', field: 'referralReason',
    placeholder: 'e.g. Pre-season screening, injury prevention, return-to-sport clearance',
    rows: 3
  }));
  card.appendChild(textInput({
    label: 'Referral Date',
    section: 'referralInfo', field: 'referralDate',
    type: 'date'
  }));
  card.appendChild(textInput({
    label: 'Primary Sport or Activity',
    section: 'referralInfo', field: 'sportOrActivity',
    placeholder: 'e.g. Football, Running, Basketball, CrossFit',
    required: true
  }));

  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'Movement History',
    description: 'Previous injuries, activity level, and current pain status.'
  });

  card.appendChild(textArea({
    label: 'Injury History',
    section: 'movementHistory', field: 'injuryHistory',
    placeholder: 'Describe any previous musculoskeletal injuries, surgeries, or chronic conditions…',
    rows: 3
  }));

  card.appendChild(radioGroup({
    label: 'Current Activity Level',
    section: 'movementHistory', field: 'activityLevel',
    required: true,
    options: [
      { value: 'sedentary', label: 'Sedentary' },
      { value: 'light', label: 'Light' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'vigorous', label: 'Vigorous' },
      { value: 'elite', label: 'Elite' }
    ]
  }));

  card.appendChild(textArea({
    label: 'Sport / Exercise Participation',
    section: 'movementHistory', field: 'sportParticipation',
    placeholder: 'Describe current sport / exercise participation, frequency, and duration…',
    rows: 3
  }));

  card.appendChild(radioGroup({
    label: 'Current Pain Level',
    section: 'movementHistory', field: 'currentPain',
    required: true,
    options: [
      { value: 'none', label: 'None' },
      { value: 'mild', label: 'Mild' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'severe', label: 'Severe' }
    ]
  }));

  // Pain details only relevant if pain is present
  const painDetails = document.createElement('div');
  painDetails.dataset.conditionalAny = 'movementHistory.currentPain=mild,moderate,severe';
  painDetails.appendChild(textArea({
    label: 'Pain Details',
    section: 'movementHistory', field: 'currentPainDetails',
    placeholder: 'If pain is present, describe location, nature, and aggravating / easing factors…',
    rows: 3
  }));
  card.appendChild(painDetails);

  card.appendChild(textArea({
    label: 'Previous Treatments',
    section: 'movementHistory', field: 'previousTreatments',
    placeholder: 'List any previous physiotherapy, chiropractic, or other treatments…',
    rows: 3
  }));

  return card;
}

function renderStep4() {
  return unilateralPattern({
    stepNumber: 4,
    pattern: 'deepSquat',
    title: 'Deep Squat',
    description: 'Assesses bilateral, symmetrical, functional mobility of the hips, knees, and ankles. Dowel held overhead assesses shoulder and thoracic spine mobility.'
  });
}

function renderStep5() {
  return bilateralPattern({
    stepNumber: 5,
    pattern: 'hurdleStep',
    title: 'Hurdle Step',
    description: 'Assesses bilateral functional mobility and stability of the hips, knees, and ankles. Challenges step and stride mechanics.'
  });
}

function renderStep6() {
  return bilateralPattern({
    stepNumber: 6,
    pattern: 'inLineLunge',
    title: 'In-Line Lunge',
    description: 'Assesses hip and trunk mobility and stability, quadriceps flexibility, and ankle and knee stability.'
  });
}

function renderStep7() {
  return bilateralPattern({
    stepNumber: 7,
    pattern: 'shoulderMobility',
    title: 'Shoulder Mobility',
    description: 'Assesses bilateral shoulder range of motion, combining internal rotation with adduction and external rotation with abduction.',
    clearingBlock: shoulderClearingPanel
  });
}

function renderStep8() {
  return bilateralPattern({
    stepNumber: 8,
    pattern: 'activeStraightLegRaise',
    title: 'Active Straight Leg Raise',
    description: 'Assesses active hamstring and gastroc-soleus flexibility while maintaining a stable pelvis and active extension of the opposite leg.'
  });
}

function renderStep9() {
  return unilateralPattern({
    stepNumber: 9,
    pattern: 'trunkStabilityPushUp',
    title: 'Trunk Stability Push-Up',
    description: 'Assesses trunk stability in the sagittal plane while a symmetrical upper-extremity motion is performed.',
    clearingBlock: trunkClearingPanel
  });
}

function renderStep10() {
  return bilateralPattern({
    stepNumber: 10,
    pattern: 'rotaryStability',
    title: 'Rotary Stability',
    description: 'Assesses multi-plane trunk stability during a combined upper and lower extremity motion.'
  });
}

// ----------------------------------------------------------------------
// Conditional-section visibility
// ----------------------------------------------------------------------

function updateConditionalSections() {
  document.querySelectorAll('[data-conditional]').forEach((host) => {
    const expr = host.getAttribute('data-conditional');
    const [path, target] = expr.split('=');
    const [section, field] = path.split('.');
    const current = state[section] && state[section][field];
    host.style.display = String(current) === target ? '' : 'none';
  });
  document.querySelectorAll('[data-conditional-any]').forEach((host) => {
    const expr = host.getAttribute('data-conditional-any');
    const [path, targetCsv] = expr.split('=');
    const [section, field] = path.split('.');
    const current = String(state[section] && state[section][field] != null ? state[section][field] : '');
    const targets = targetCsv.split(',');
    host.style.display = targets.includes(current) ? '' : 'none';
  });
}

// ----------------------------------------------------------------------
// Progress + step list
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1,  section: 'demographics',                title: 'Demographics' },
  { step: 2,  section: 'referralInfo',                title: 'Referral' },
  { step: 3,  section: 'movementHistory',             title: 'Movement History' },
  { step: 4,  section: 'fms:deepSquat',               title: 'Deep Squat' },
  { step: 5,  section: 'fms:hurdleStep',              title: 'Hurdle Step' },
  { step: 6,  section: 'fms:inLineLunge',             title: 'In-Line Lunge' },
  { step: 7,  section: 'fms:shoulderMobility',        title: 'Shoulder' },
  { step: 8,  section: 'fms:activeStraightLegRaise',  title: 'Leg Raise' },
  { step: 9,  section: 'fms:trunkStabilityPushUp',    title: 'Push-Up' },
  { step: 10, section: 'fms:rotaryStability',         title: 'Rotary' }
];

// Tracked top-level fields. FMS patterns are tracked separately because
// the "answered" condition for a pattern is "any of score / leftScore /
// rightScore set, OR painDuringMovement true".
const TRACKED_FIELDS = [
  // Demographics (4)
  ['demographics', 'firstName'],
  ['demographics', 'lastName'],
  ['demographics', 'dateOfBirth'],
  ['demographics', 'sex'],
  // Referral info (4)
  ['referralInfo', 'referringProvider'],
  ['referralInfo', 'referralReason'],
  ['referralInfo', 'referralDate'],
  ['referralInfo', 'sportOrActivity'],
  // Movement history (5 - currentPainDetails skipped because conditional)
  ['movementHistory', 'injuryHistory'],
  ['movementHistory', 'activityLevel'],
  ['movementHistory', 'sportParticipation'],
  ['movementHistory', 'currentPain'],
  ['movementHistory', 'previousTreatments']
];

const FMS_PATTERN_NAMES = [
  'deepSquat',
  'hurdleStep',
  'inLineLunge',
  'shoulderMobility',
  'activeStraightLegRaise',
  'trunkStabilityPushUp',
  'rotaryStability'
];

function patternAnswered(pattern) {
  const p = state.fmsPatterns[pattern];
  if (p.painDuringMovement) return true;
  if (p.score !== null) return true;
  if (p.leftScore !== null) return true;
  if (p.rightScore !== null) return true;
  return false;
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

function updateProgress() {
  let answered = 0;
  const sectionAnswered = {};
  const sectionTotal = {};
  for (const pair of TRACKED_FIELDS) {
    sectionTotal[pair[0]] = (sectionTotal[pair[0]] || 0) + 1;
    const v = state[pair[0]][pair[1]];
    if (v !== null && v !== undefined && v !== '') {
      answered++;
      sectionAnswered[pair[0]] = (sectionAnswered[pair[0]] || 0) + 1;
    }
  }
  for (const name of FMS_PATTERN_NAMES) {
    const key = `fms:${name}`;
    sectionTotal[key] = 1;
    if (patternAnswered(name)) {
      answered++;
      sectionAnswered[key] = 1;
    }
  }

  const total = TRACKED_FIELDS.length + FMS_PATTERN_NAMES.length;
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = `${answered} of ${total} fields answered (${percent}%)`;
  updateStepListStatuses(sectionAnswered, sectionTotal);
}

function updateStepListStatuses(sectionAnswered, sectionTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  for (const def of STEP_DEFINITIONS) {
    const li = ol.querySelector(`[data-step="${def.step}"]`);
    if (!li) continue;
    const a = sectionAnswered[def.section] || 0;
    const t = sectionTotal[def.section] || 0;
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
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(`${id}-error`);
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
  const fs = document.getElementById(`${id}-fieldset`);
  if (fs) fs.removeAttribute('aria-invalid');
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
  const required = form.querySelectorAll('[data-required]');
  const seen = new Set();
  required.forEach((input) => {
    const id = input.id || input.name;
    if (!id) return;
    if (input.type === 'radio') {
      const groupName = input.name;
      if (seen.has(groupName)) return;
      seen.add(groupName);
      const checked = form.querySelector(`input[type="radio"][name="${groupName}"]:checked`);
      if (!checked) {
        const fs = document.getElementById(`${groupName}-fieldset`);
        const legend = fs ? fs.querySelector('legend') : null;
        const label = legend ? legend.textContent.replace(/\s*\*\s*$/, '').trim() : groupName;
        errors.push({ id: groupName, message: `${label} is required` });
        setFieldError(groupName, `${label} is required`);
      } else {
        clearFieldError(groupName);
      }
      return;
    }
    if (seen.has(id)) return;
    seen.add(id);
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
  summary.setAttribute('tabindex', '-1');
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (typeof summary.focus === 'function') {
    summary.focus({ preventScroll: true });
  }
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

  const { totalScore, fmsCategoryLabel, riskBand: band, firedRules, additionalFlags, timestamp } = lastResult;

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

  const firedRows = firedRules.map((r) => `
    <tr>
      <th scope="row">${esc(r.id)}</th>
      <td>${esc(r.pattern)}</td>
      <td>${esc(r.description)}</td>
      <td class="num">${r.score} / 3</td>
    </tr>
  `).join('');

  const firedTable = firedRules.length === 0
    ? `<p class="muted">No FMS patterns scored.</p>`
    : `
      <table class="subscales">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Pattern</th>
            <th scope="col">Description</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>${firedRows}</tbody>
      </table>
    `;

  const riskClass = band === 'low-risk' ? 'low-risk' : 'at-risk';

  out.innerHTML = `
    <h2>Kinesiology Assessment Report</h2>
    <p class="muted">Generated ${esc(new Date(timestamp).toLocaleString())}</p>

    <h3>FMS Total Score</h3>
    <p class="fms-summary">
      <span class="fms-score-badge ${fmsBandClass(totalScore)}">${totalScore} / 21</span>
      <span class="fms-category-label">${esc(fmsCategoryLabel)}</span>
      <span class="fms-risk-band ${riskClass}">${esc(riskBandLabel(band))}</span>
    </p>
    <p class="muted">Threshold for elevated injury risk is a total score at or below 14.</p>

    <h3>Per-pattern scores</h3>
    ${firedTable}

    <h3>Flagged Issues</h3>
    ${flagsList}

    <div class="report-actions">
      <button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>
    </div>
  `;
  out.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const startBtn = document.getElementById('start-over-btn');
  if (startBtn) startBtn.addEventListener('click', startOver);
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  const grading = gradeFMS(state);
  const additionalFlags = detectAdditionalFlags(state);
  lastResult = {
    totalScore: grading.totalScore,
    fmsCategoryLabel: grading.fmsCategoryLabel,
    riskBand: grading.riskBand,
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
  const report = document.getElementById('report');
  if (report) {
    report.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  }
  renderErrorSummary([]);
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
  host.appendChild(renderStep7());
  host.appendChild(renderStep8());
  host.appendChild(renderStep9());
  host.appendChild(renderStep10());
}

function init() {
  renderStepList();
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
