import { emptyAssessment } from './types.js';
import { computeAllScores } from './composite.js';

// Patient-Reported Outcome Measures — single-page, 9-step wizard (vanilla
// JavaScript, Lily-classes contract, no build).
//
// A battery of 4 independent, validated PRO instruments: SF-36v2 Health
// Survey (36 items), Neck Disability Index (10 sections), modified Japanese
// Orthopedic Association score (6 subscales), and EQ-5D-3L (5 dimensions +
// VAS). Each instrument is scored independently by the engine modules in
// this directory (sf36-rules.js, ndi-rules.js, mjoa-rules.js, eq5d-rules.js,
// composite.js) — this file only renders the questionnaire and reports
// their outputs; it implements no scoring logic of its own.
//
// Everything runs client-side and persists draft state to localStorage.

const STORAGE_KEY = 'patient-reported-outcome-measures:v1';

const TOTAL_STEPS = 9;

// ----------------------------------------------------------------------
// Response-option catalogues (shared across items with the same scale)
// ----------------------------------------------------------------------

const GENERAL_HEALTH_OPTIONS = [
  { value: 1, label: 'Excellent' },
  { value: 2, label: 'Very good' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Fair' },
  { value: 5, label: 'Poor' }
];

const HEALTH_CHANGE_OPTIONS = [
  { value: 1, label: 'Much better now than one year ago' },
  { value: 2, label: 'Somewhat better now than one year ago' },
  { value: 3, label: 'About the same as one year ago' },
  { value: 4, label: 'Somewhat worse now than one year ago' },
  { value: 5, label: 'Much worse now than one year ago' }
];

const ACTIVITY_LIMIT_OPTIONS = [
  { value: 1, label: 'Yes, limited a lot' },
  { value: 2, label: 'Yes, limited a little' },
  { value: 3, label: 'No, not limited at all' }
];

const ALL_TO_NONE_OPTIONS = [
  { value: 1, label: 'All of the time' },
  { value: 2, label: 'Most of the time' },
  { value: 3, label: 'Some of the time' },
  { value: 4, label: 'A little of the time' },
  { value: 5, label: 'None of the time' }
];

const EXTENT_OPTIONS = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Slightly' },
  { value: 3, label: 'Moderately' },
  { value: 4, label: 'Quite a bit' },
  { value: 5, label: 'Extremely' }
];

const BODILY_PAIN_OPTIONS = [
  { value: 1, label: 'None' },
  { value: 2, label: 'Very mild' },
  { value: 3, label: 'Mild' },
  { value: 4, label: 'Moderate' },
  { value: 5, label: 'Severe' },
  { value: 6, label: 'Very severe' }
];

const TRUE_FALSE_OPTIONS = [
  { value: 1, label: 'Definitely true' },
  { value: 2, label: 'Mostly true' },
  { value: 3, label: "Don't know" },
  { value: 4, label: 'Mostly false' },
  { value: 5, label: 'Definitely false' }
];

// NDI: the exact A-F wording per section is not preserved in spec/index.md
// (only the section titles and the 0-5 numeric mapping are), so every
// section uses this generically-worded 0-5 severity scale. The numeric
// scoring (0 = no problem .. 5 = worst imaginable) is unambiguous and is
// what ndi-rules.js consumes.
const NDI_OPTIONS = [
  { value: 0, label: 'No problem' },
  { value: 1, label: 'Mild problem' },
  { value: 2, label: 'Moderate problem' },
  { value: 3, label: 'Severe problem' },
  { value: 4, label: 'Very severe problem' },
  { value: 5, label: 'Worst imaginable' }
];

const MJOA_OPTIONS = {
  motorArms: [
    { value: 0, label: 'Unable to feed oneself' },
    { value: 1, label: 'Unable to use a knife and fork, able to eat with spoon' },
    { value: 2, label: 'Able to use knife and fork with much difficulty' },
    { value: 3, label: 'Able to use knife and fork with slight difficulty' },
    { value: 4, label: 'No deficit' }
  ],
  motorLegs: [
    { value: 0, label: 'Unable to walk' },
    { value: 1, label: 'Can walk on flat floor with a walking aid' },
    { value: 2, label: 'Can walk up or down stairs with a handrail' },
    { value: 3, label: 'Lack of stability and smooth gait' },
    { value: 4, label: 'No deficit' }
  ],
  sensationArms: [
    { value: 0, label: 'Severe sensory loss or pain' },
    { value: 1, label: 'Mild sensory loss' },
    { value: 2, label: 'No deficit' }
  ],
  sensationLegs: [
    { value: 0, label: 'Severe sensory loss or pain' },
    { value: 1, label: 'Mild sensory loss' },
    { value: 2, label: 'No deficit' }
  ],
  sensationTrunk: [
    { value: 0, label: 'Severe sensory loss or pain' },
    { value: 1, label: 'Mild sensory loss' },
    { value: 2, label: 'No deficit' }
  ],
  bladderFunction: [
    { value: 0, label: 'Unable to void' },
    { value: 1, label: 'Marked difficulty with micturition (retention)' },
    { value: 2, label: 'Difficulty in micturition (frequency, hesitation)' },
    { value: 3, label: 'No deficit' }
  ]
};

const EQ5D_OPTIONS = {
  mobility: [
    { value: 1, label: 'I have no problems in walking about' },
    { value: 2, label: 'I have some problems in walking about' },
    { value: 3, label: 'I am confined to bed' }
  ],
  selfCare: [
    { value: 1, label: 'I have no problems with self-care' },
    { value: 2, label: 'I have some problems washing or dressing myself' },
    { value: 3, label: 'I am unable to wash or dress myself' }
  ],
  usualActivities: [
    { value: 1, label: 'I have no problems with performing my usual activities (e.g. work, study, housework, family or leisure activities)' },
    { value: 2, label: 'I have some problems with performing my usual activities' },
    { value: 3, label: 'I am unable to perform my usual activities' }
  ],
  painDiscomfort: [
    { value: 1, label: 'I have no pain or discomfort' },
    { value: 2, label: 'I have moderate pain or discomfort' },
    { value: 3, label: 'I have extreme pain or discomfort' }
  ],
  anxietyDepression: [
    { value: 1, label: 'I am not anxious or depressed' },
    { value: 2, label: 'I am moderately anxious or depressed' },
    { value: 3, label: 'I am extremely anxious or depressed' }
  ]
};

// SF-36 item catalogues, grouped the way the wizard steps present them.
const Q3_ACTIVITY_ITEMS = [
  { field: 'vigorousActivities', label: 'Vigorous activities, such as running, lifting heavy objects, participating in strenuous sports' },
  { field: 'moderateActivities', label: 'Moderate activities, such as moving a table, pushing a vacuum cleaner, bowling, or playing golf' },
  { field: 'liftingCarryingGroceries', label: 'Lifting or carrying groceries' },
  { field: 'climbingSeveralFlights', label: 'Climbing several flights of stairs' },
  { field: 'climbingOneFlight', label: 'Climbing one flight of stairs' },
  { field: 'bendingKneelingStooping', label: 'Bending, kneeling, or stooping' },
  { field: 'walkingMoreThanMile', label: 'Walking more than a mile' },
  { field: 'walkingSeveralHundredYards', label: 'Walking several hundred yards' },
  { field: 'walkingOneHundredYards', label: 'Walking one hundred yards' },
  { field: 'bathingDressing', label: 'Bathing or dressing yourself' }
];

const Q4_PHYSICAL_ROLE_ITEMS = [
  { field: 'cutDownTimePhysical', label: 'Cut down the amount of time you spent on work or other activities' },
  { field: 'accomplishedLessPhysical', label: 'Accomplished less than you would like' },
  { field: 'limitedInKindPhysical', label: 'Were limited in the kind of work or other activities' },
  { field: 'difficultyPerformingPhysical', label: 'Had difficulty performing the work or other activities (for example, it took extra effort)' }
];

const Q5_EMOTIONAL_ROLE_ITEMS = [
  { field: 'cutDownTimeEmotional', label: 'Cut down the amount of time you spent on work or other activities' },
  { field: 'accomplishedLessEmotional', label: 'Accomplished less than you would like' },
  { field: 'lessCarefulThanUsual', label: "Didn't do work or other activities as carefully as usual" }
];

const Q9_VITALITY_MENTAL_ITEMS = [
  { field: 'feltFullOfLife', label: 'Did you feel full of life?' },
  { field: 'veryNervous', label: 'Have you been a very nervous person?' },
  { field: 'soDownInDumps', label: 'Have you felt so down in the dumps that nothing could cheer you up?' },
  { field: 'feltCalmPeaceful', label: 'Have you felt calm and peaceful?' },
  { field: 'lotOfEnergy', label: 'Did you have a lot of energy?' },
  { field: 'downheartedDepressed', label: 'Have you felt downhearted and depressed?' },
  { field: 'feltWornOut', label: 'Did you feel worn out?' },
  { field: 'beenHappy', label: 'Have you been a happy person?' },
  { field: 'feltTired', label: 'Did you feel tired?' }
];

const Q11_HEALTH_PERCEPTION_ITEMS = [
  { field: 'getSickEasier', label: 'I seem to get sick a little easier than other people' },
  { field: 'asHealthyAsAnybody', label: 'I am as healthy as anybody I know' },
  { field: 'expectHealthWorse', label: 'I expect my health to get worse' },
  { field: 'healthExcellent', label: 'My health is excellent' }
];

const NDI_SECTIONS = [
  { field: 'painIntensity', label: 'Section 1 — Pain intensity' },
  { field: 'personalCare', label: 'Section 2 — Personal care (washing, dressing, etc.)' },
  { field: 'lifting', label: 'Section 3 — Lifting' },
  { field: 'reading', label: 'Section 4 — Reading' },
  { field: 'headache', label: 'Section 5 — Headache' },
  { field: 'concentration', label: 'Section 6 — Concentration' },
  { field: 'work', label: 'Section 7 — Work' },
  { field: 'driving', label: 'Section 8 — Driving' },
  { field: 'sleeping', label: 'Section 9 — Sleeping' },
  { field: 'recreation', label: 'Section 10 — Recreation' }
];

const MJOA_SUBSCALES = [
  { field: 'motorArms', label: 'Motor, arms' },
  { field: 'motorLegs', label: 'Motor, legs' },
  { field: 'sensationArms', label: 'Sensation, arms' },
  { field: 'sensationLegs', label: 'Sensation, legs' },
  { field: 'sensationTrunk', label: 'Sensation, trunk' },
  { field: 'bladderFunction', label: 'Bladder function' }
];

const EQ5D_DIMENSION_ITEMS = [
  { field: 'mobility', label: 'Mobility' },
  { field: 'selfCare', label: 'Self-care' },
  { field: 'usualActivities', label: 'Usual activities' },
  { field: 'painDiscomfort', label: 'Pain / discomfort' },
  { field: 'anxietyDepression', label: 'Anxiety / depression' }
];

// SF-36 domain display metadata (order matches spec/index.md §1 Step 2).
const SF36_DOMAINS = [
  { key: 'pf', label: 'Physical Functioning' },
  { key: 'rp', label: 'Role-Physical' },
  { key: 'bp', label: 'Bodily Pain' },
  { key: 'gh', label: 'General Health' },
  { key: 'vt', label: 'Vitality' },
  { key: 'sf', label: 'Social Functioning' },
  { key: 're', label: 'Role-Emotional' },
  { key: 'mh', label: 'Mental Health' }
];

const NDI_BAND_LABEL = {
  'no-disability': 'No disability',
  mild: 'Mild disability',
  moderate: 'Moderate disability',
  severe: 'Severe disability',
  complete: 'Complete disability',
  '': 'Not scored (no sections answered)'
};

const MJOA_BAND_LABEL = {
  mild: 'Mild myelopathy',
  moderate: 'Moderate myelopathy',
  severe: 'Severe myelopathy',
  '': 'Not scored (incomplete — all 6 subscales required)'
};

// ----------------------------------------------------------------------
// Persistence
// ----------------------------------------------------------------------

function safeLs() {
  try { return window.localStorage; } catch (_) { return null; }
}

function loadDraft() {
  const ls = safeLs();
  if (!ls) return null;
  const raw = ls.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    const fresh = emptyAssessment();
    const data = parsed && parsed.data ? parsed.data : {};
    const merged = {};
    Object.keys(fresh).forEach(function (section) {
      merged[section] = Object.assign({}, fresh[section], data[section]);
    });
    return { savedAt: parsed.savedAt || '', data: merged };
  } catch (_) {
    return null;
  }
}

function persistDraft() {
  const ls = safeLs();
  if (!ls) return '';
  const savedAt = new Date().toISOString();
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify({ savedAt: savedAt, data: state }));
  } catch (_) { /* quota — ignore */ }
  setSavedLabel(savedAt);
  return savedAt;
}

function clearDraft() {
  const ls = safeLs();
  if (!ls) return;
  try { ls.removeItem(STORAGE_KEY); } catch (_) {}
  setSavedLabel('');
}

function setSavedLabel(iso) {
  const el = document.getElementById('saved-indicator');
  if (!el) return;
  if (!iso) { el.textContent = ''; return; }
  try {
    const d = new Date(iso);
    el.textContent = 'Saved ' + d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
  } catch (_) { el.textContent = ''; }
}

let state = emptyAssessment();
let draftRestored = false;
const restored = loadDraft();
if (restored) {
  state = restored.data;
  draftRestored = true;
}

let lastReport = null;

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function lilyInputClass(type) {
  switch (type) {
    case 'email':          return 'email-input';
    case 'number':          return 'number-input';
    case 'date':            return 'date-input';
    case 'datetime-local':  return 'date-input';
    case 'time':            return 'time-input';
    case 'tel':             return 'tel-input';
    case 'url':             return 'url-input';
    case 'range':           return 'range-input';
    case 'search':          return 'search-input';
    default:                return 'text-input';
  }
}

function setField(section, field, value) {
  state[section][field] = value;
  persistDraft();
  updateProgress();
  refreshSummary();
}

// ----------------------------------------------------------------------
// Component builders (Lily class contracts)
// ----------------------------------------------------------------------

function textInput(opts) {
  const id = opts.id || (opts.section + '-' + opts.field);
  const target = state[opts.section];
  const value = target[opts.field];
  const labelText = esc(opts.label) +
    (opts.required ? ' <span class="req" aria-hidden="true">*</span>' : '');
  const type = opts.type || 'text';
  const attrs = [
    'id="' + id + '"',
    'name="' + id + '"',
    'type="' + type + '"',
    'class="' + lilyInputClass(type) + '"',
    'value="' + esc(value == null ? '' : value) + '"',
    'aria-describedby="' + id + '-error"'
  ];
  if (opts.placeholder) attrs.push('placeholder="' + esc(opts.placeholder) + '"');
  if (opts.required) attrs.push('required', 'data-required');

  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + labelText + '</label>' +
    '<input ' + attrs.join(' ') + '>' +
    '<span class="error-message" id="' + id + '-error"></span>';

  const input = wrapper.querySelector('input');
  input.addEventListener('input', function () {
    setField(opts.section, opts.field, input.value);
    clearFieldError(id);
  });
  return wrapper;
}

// Radio group bound to a numeric-enum field (1-based or 0-based response
// scale). Mirrors the AUDIT-C form's radioGroup contract.
function radioGroup(opts) {
  const groupId = opts.section + '-' + opts.field;
  const current = state[opts.section][opts.field];
  const wrapper = document.createElement('fieldset');
  wrapper.className = 'field radio-fieldset';
  wrapper.id = groupId + '-fieldset';
  const legend = document.createElement('legend');
  legend.className = 'label';
  legend.textContent = opts.label;
  wrapper.appendChild(legend);
  const list = document.createElement('div');
  list.className = 'radio-group';
  list.setAttribute('role', 'radiogroup');
  list.setAttribute('aria-labelledby', groupId + '-fieldset');
  opts.options.forEach(function (option) {
    const radioId = groupId + '-' + option.value;
    const label = document.createElement('label');
    label.className = 'radio-input';
    label.htmlFor = radioId;
    const checked =
      current !== null && current !== undefined && current !== '' &&
      String(current) === String(option.value) ? ' checked' : '';
    const optLabel = option.value + ' — ' + option.label;
    label.innerHTML =
      '<input class="radio-input" type="radio" id="' + radioId + '" name="' + groupId +
      '" value="' + esc(option.value) + '"' + checked + '>' +
      '<span>' + esc(optLabel) + '</span>';
    const input = label.querySelector('input');
    input.addEventListener('change', function () {
      if (input.checked) {
        setField(opts.section, opts.field, Number(input.value));
        clearFieldError(groupId);
      }
    });
    list.appendChild(label);
  });
  wrapper.appendChild(list);
  const err = document.createElement('span');
  err.className = 'error-message';
  err.id = groupId + '-error';
  err.setAttribute('aria-live', 'polite');
  wrapper.appendChild(err);
  return wrapper;
}

function rangeInput(opts) {
  const id = opts.section + '-' + opts.field;
  const target = state[opts.section];
  const value = target[opts.field];
  const displayValue = value == null ? '' : value;
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  wrapper.innerHTML =
    '<label class="label" for="' + id + '">' + esc(opts.label) + '</label>' +
    (opts.hint ? '<span class="hint">' + esc(opts.hint) + '</span>' : '') +
    '<input id="' + id + '" name="' + id + '" type="range" class="range-input" ' +
      'min="' + opts.min + '" max="' + opts.max + '" step="1" ' +
      'value="' + (displayValue === '' ? Math.round((opts.min + opts.max) / 2) : displayValue) + '" ' +
      'aria-describedby="' + id + '-value ' + id + '-error">' +
    '<output id="' + id + '-value" for="' + id + '" class="range-output">' +
      (displayValue === '' ? 'Not recorded' : displayValue) + '</output>' +
    '<span class="error-message" id="' + id + '-error"></span>';
  const input = wrapper.querySelector('input');
  const output = wrapper.querySelector('output');
  input.addEventListener('input', function () {
    output.textContent = input.value;
    setField(opts.section, opts.field, Number(input.value));
    clearFieldError(id);
  });
  return wrapper;
}

function sectionCard(opts) {
  const card = document.createElement('fieldset');
  card.className = 'fieldset';
  card.dataset.step = String(opts.stepNumber);
  card.id = 'step-' + opts.stepNumber;
  const desc = opts.description
    ? '<span class="section-description">' + esc(opts.description) + '</span>'
    : '';
  const legend = document.createElement('legend');
  legend.className = 'fieldset-legend';
  legend.innerHTML =
    '<span class="section-step">Step ' + opts.stepNumber + ' of ' + TOTAL_STEPS + '</span>' +
    '<h2 class="section-title">' + esc(opts.title) + '</h2>' +
    desc;
  card.appendChild(legend);
  return card;
}

function subGroupHeading(text) {
  const h = document.createElement('h3');
  h.className = 'sub-group-heading';
  h.textContent = text;
  return h;
}

function radioGroupsFor(section, items, options) {
  const frag = document.createDocumentFragment();
  items.forEach(function (item) {
    frag.appendChild(radioGroup({
      label: item.label,
      section: section,
      field: item.field,
      options: options
    }));
  });
  return frag;
}

// ----------------------------------------------------------------------
// Step renderers (one per wizard step; see spec/index.md "Wizard" table)
// ----------------------------------------------------------------------

function renderStep1() {
  const card = sectionCard({
    stepNumber: 1,
    title: 'Visit details',
    description: 'Identify the subject, the visit/time point, and the assessment date. Each of the 4 instruments below is scored independently.'
  });
  card.appendChild(textInput({ label: 'Subject ID', section: 'visitDetails', field: 'subjectId', required: true, placeholder: 'e.g. PT-0042' }));
  card.appendChild(textInput({ label: 'Visit', section: 'visitDetails', field: 'visit', required: true, placeholder: 'e.g. Baseline, 6-week, 3-month, 1-year' }));
  card.appendChild(textInput({ label: 'Assessment date', section: 'visitDetails', field: 'assessmentDate', type: 'date', required: true }));
  return card;
}

function renderStep2() {
  const card = sectionCard({
    stepNumber: 2,
    title: 'SF-36v2 — general health',
    description: 'Questions 1-2 of the SF-36v2 Health Survey.'
  });
  card.appendChild(radioGroup({ label: 'Q1. In general, would you say your health is:', section: 'sf36', field: 'generalHealth', options: GENERAL_HEALTH_OPTIONS }));
  card.appendChild(radioGroup({ label: 'Q2. Compared to one year ago, how would you rate your health in general now?', section: 'sf36', field: 'healthChangeVsYearAgo', options: HEALTH_CHANGE_OPTIONS }));
  return card;
}

function renderStep3() {
  const card = sectionCard({
    stepNumber: 3,
    title: 'SF-36v2 — activities',
    description: 'Q3a-j. The following items are about activities you might do during a typical day. Does your health now limit you in these activities? If so, how much?'
  });
  card.appendChild(radioGroupsFor('sf36', Q3_ACTIVITY_ITEMS, ACTIVITY_LIMIT_OPTIONS));
  return card;
}

function renderStep4() {
  const card = sectionCard({
    stepNumber: 4,
    title: 'SF-36v2 — role limitations',
    description: 'Q4a-d and Q5a-c. During the past 4 weeks, have you had any of the following problems with your work or other regular daily activities as a result of your physical health, or as a result of any emotional problems?'
  });
  card.appendChild(subGroupHeading('Q4a-d — as a result of your physical health'));
  card.appendChild(radioGroupsFor('sf36', Q4_PHYSICAL_ROLE_ITEMS, ALL_TO_NONE_OPTIONS));
  card.appendChild(subGroupHeading('Q5a-c — as a result of any emotional problems (such as feeling depressed or anxious)'));
  card.appendChild(radioGroupsFor('sf36', Q5_EMOTIONAL_ROLE_ITEMS, ALL_TO_NONE_OPTIONS));
  return card;
}

function renderStep5() {
  const card = sectionCard({
    stepNumber: 5,
    title: 'SF-36v2 — pain, social, vitality, health perceptions',
    description: 'Q6-11 (17 items) — the longest step. Grouped by sub-topic below.'
  });

  card.appendChild(subGroupHeading('Q6 — social activities interference'));
  card.appendChild(radioGroup({ label: 'During the past 4 weeks, to what extent has your physical health or emotional problems interfered with your normal social activities with family, friends, neighbours, or groups?', section: 'sf36', field: 'socialActivitiesInterference', options: EXTENT_OPTIONS }));

  card.appendChild(subGroupHeading('Q7-8 — bodily pain'));
  card.appendChild(radioGroup({ label: 'Q7. How much bodily pain have you had during the past 4 weeks?', section: 'sf36', field: 'bodilyPain', options: BODILY_PAIN_OPTIONS }));
  card.appendChild(radioGroup({ label: 'Q8. During the past 4 weeks, how much did pain interfere with your normal work (including both work outside the home and housework)?', section: 'sf36', field: 'painInterferenceWithWork', options: EXTENT_OPTIONS }));

  card.appendChild(subGroupHeading('Q9a-i — vitality and mental health (past 4 weeks)'));
  card.appendChild(radioGroupsFor('sf36', Q9_VITALITY_MENTAL_ITEMS, ALL_TO_NONE_OPTIONS));

  card.appendChild(subGroupHeading('Q10 — social activities interference, time'));
  card.appendChild(radioGroup({ label: 'During the past 4 weeks, how much of the time has your physical health or emotional problems interfered with your social activities (like visiting with friends, relatives, etc.)?', section: 'sf36', field: 'socialActivitiesInterferenceTime', options: ALL_TO_NONE_OPTIONS }));

  card.appendChild(subGroupHeading('Q11a-d — general health perceptions'));
  card.appendChild(radioGroupsFor('sf36', Q11_HEALTH_PERCEPTION_ITEMS, TRUE_FALSE_OPTIONS));

  return card;
}

function renderStep6() {
  const card = sectionCard({
    stepNumber: 6,
    title: 'Neck Disability Index',
    description: '10 sections, each answered A-F (recorded 0-5). Sections without preserved exact wording use a generic 0-5 severity scale — the numeric scoring is unambiguous.'
  });
  card.appendChild(radioGroupsFor('ndi', NDI_SECTIONS, NDI_OPTIONS));
  return card;
}

function renderStep7() {
  const card = sectionCard({
    stepNumber: 7,
    title: 'modified JOA',
    description: '6 subscales, each with its own point range, summed to a 0-17 total (higher = less dysfunction).'
  });
  MJOA_SUBSCALES.forEach(function (sub) {
    card.appendChild(radioGroup({ label: sub.label, section: 'mjoa', field: sub.field, options: MJOA_OPTIONS[sub.field] }));
  });
  return card;
}

function renderStep8() {
  const card = sectionCard({
    stepNumber: 8,
    title: 'EQ-5D-3L',
    description: '5 dimensions, each at one of 3 levels, plus a 0-100 visual analogue scale (VAS) of your own health state today.'
  });
  EQ5D_DIMENSION_ITEMS.forEach(function (dim) {
    card.appendChild(radioGroup({ label: dim.label, section: 'eq5d', field: dim.field, options: EQ5D_OPTIONS[dim.field] }));
  });
  card.appendChild(rangeInput({
    label: 'EQ VAS — your own health state today',
    section: 'eq5d', field: 'vasScore', min: 0, max: 100,
    hint: '0 = the worst health you can imagine, 100 = the best health you can imagine.'
  }));
  return card;
}

function renderStep9() {
  const card = sectionCard({
    stepNumber: 9,
    title: 'Summary',
    description: 'All four instruments’ computed scores, updated live as you answer. Submit below to generate the full report.'
  });
  const live = document.createElement('div');
  live.id = 'live-summary';
  live.className = 'live-summary';
  card.appendChild(live);
  return card;
}

const STEP_RENDERERS = [
  renderStep1, renderStep2, renderStep3, renderStep4, renderStep5,
  renderStep6, renderStep7, renderStep8, renderStep9
];

// ----------------------------------------------------------------------
// Step list (table of contents + completion status) + progress
// ----------------------------------------------------------------------

const STEP_DEFINITIONS = [
  { step: 1, title: 'Visit details', fields: [['visitDetails', 'subjectId'], ['visitDetails', 'visit'], ['visitDetails', 'assessmentDate']] },
  { step: 2, title: 'SF-36 — general health', fields: [['sf36', 'generalHealth'], ['sf36', 'healthChangeVsYearAgo']] },
  { step: 3, title: 'SF-36 — activities', fields: Q3_ACTIVITY_ITEMS.map(function (i) { return ['sf36', i.field]; }) },
  { step: 4, title: 'SF-36 — role limitations', fields: Q4_PHYSICAL_ROLE_ITEMS.concat(Q5_EMOTIONAL_ROLE_ITEMS).map(function (i) { return ['sf36', i.field]; }) },
  {
    step: 5, title: 'SF-36 — pain, social, vitality',
    fields: [['sf36', 'socialActivitiesInterference'], ['sf36', 'bodilyPain'], ['sf36', 'painInterferenceWithWork']]
      .concat(Q9_VITALITY_MENTAL_ITEMS.map(function (i) { return ['sf36', i.field]; }))
      .concat([['sf36', 'socialActivitiesInterferenceTime']])
      .concat(Q11_HEALTH_PERCEPTION_ITEMS.map(function (i) { return ['sf36', i.field]; }))
  },
  { step: 6, title: 'Neck Disability Index', fields: NDI_SECTIONS.map(function (i) { return ['ndi', i.field]; }) },
  { step: 7, title: 'modified JOA', fields: MJOA_SUBSCALES.map(function (i) { return ['mjoa', i.field]; }) },
  { step: 8, title: 'EQ-5D-3L', fields: EQ5D_DIMENSION_ITEMS.map(function (i) { return ['eq5d', i.field]; }).concat([['eq5d', 'vasScore']]) },
  { step: 9, title: 'Summary', fields: [] }
];

function isAnswered(section, field) {
  const v = state[section][field];
  return v !== null && v !== undefined && v !== '';
}

function renderStepList() {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  ol.innerHTML = '';
  STEP_DEFINITIONS.forEach(function (def) {
    const li = document.createElement('li');
    li.className = 'step-list-item';
    li.dataset.status = 'waiting';
    li.dataset.step = String(def.step);
    li.setAttribute('aria-label', 'Step ' + def.step + ': ' + def.title);
    li.innerHTML = '<span>' + esc(def.title) + '</span>';
    li.addEventListener('click', function () {
      const target = document.getElementById('step-' + def.step);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    ol.appendChild(li);
  });
}

function updateStepListStatuses(stepAnswered, stepTotal) {
  const ol = document.getElementById('step-list');
  if (!ol) return;
  let firstUnfinished = -1;
  STEP_DEFINITIONS.forEach(function (def) {
    const li = ol.querySelector('[data-step="' + def.step + '"]');
    if (!li) return;
    const a = stepAnswered[def.step] || 0;
    const t = stepTotal[def.step] || 0;
    if (t > 0 && a === t) {
      li.dataset.status = 'finished';
      li.removeAttribute('aria-current');
    } else if (a > 0) {
      li.dataset.status = 'in-progress';
      if (firstUnfinished === -1) firstUnfinished = def.step;
    } else if (def.step === TOTAL_STEPS && t === 0) {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
    } else {
      li.dataset.status = 'waiting';
      li.removeAttribute('aria-current');
    }
  });
  if (firstUnfinished === -1) firstUnfinished = STEP_DEFINITIONS[0].step;
  const current = ol.querySelector('[data-step="' + firstUnfinished + '"]');
  if (current) {
    current.setAttribute('aria-current', 'step');
    if (current.dataset.status === 'waiting') {
      current.dataset.status = 'in-progress';
    }
  }
  ol.dataset.current = String(firstUnfinished - 1);
}

function updateProgress() {
  let answered = 0;
  let total = 0;
  const stepAnswered = {};
  const stepTotal = {};

  STEP_DEFINITIONS.forEach(function (def) {
    stepTotal[def.step] = def.fields.length;
    stepAnswered[def.step] = 0;
    def.fields.forEach(function (pair) {
      total++;
      if (isAnswered(pair[0], pair[1])) {
        answered++;
        stepAnswered[def.step]++;
      }
    });
  });

  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const bar = document.getElementById('progress');
  if (bar) bar.value = percent;
  const text = document.getElementById('progress-text');
  if (text) text.textContent = answered + ' of ' + total + ' items answered (' + percent + '%)';
  updateStepListStatuses(stepAnswered, stepTotal);
}

// ----------------------------------------------------------------------
// Score rendering (shared between the live Step 9 preview and the final
// submitted report)
// ----------------------------------------------------------------------

function fmt(n, digits) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return n.toFixed(digits === undefined ? 1 : digits);
}

function renderSummaryHtml() {
  const scores = computeAllScores(state);
  const { sf36, ndi, mjoa, eq5d } = scores;

  const domainRows = SF36_DOMAINS.map(function (d) {
    return '<tr><th scope="row">' + esc(d.label) + '</th><td class="num">' + fmt(sf36[d.key]) + '</td></tr>';
  }).join('');

  return (
    '<div class="summary-instrument">' +
      '<h3>SF-36v2 Health Survey</h3>' +
      '<table class="subscales"><thead><tr><th scope="col">Domain</th><th scope="col">Score (0-100, higher = better)</th></tr></thead>' +
      '<tbody>' + domainRows + '</tbody></table>' +
      '<p class="muted">Simplified approximations (unweighted domain averages) — ' +
        '<strong>not</strong> the licensed QualityMetric norm-based SF-36v2 PCS/MCS: ' +
        'PCS approx <strong>' + fmt(sf36.pcsApprox) + '</strong>, ' +
        'MCS approx <strong>' + fmt(sf36.mcsApprox) + '</strong>.</p>' +
    '</div>' +

    '<div class="summary-instrument">' +
      '<h3>Neck Disability Index (NDI)</h3>' +
      '<p>Raw score <strong>' + esc(String(ndi.rawScore)) + '</strong> ' +
        '(' + ndi.answeredSections + ' of 10 sections answered) — ' +
        'percentage <strong>' + fmt(ndi.percentageScore, 1) + (ndi.percentageScore === null ? '' : '%') + '</strong> — ' +
        'band: <strong>' + esc(NDI_BAND_LABEL[ndi.band] || ndi.band) + '</strong></p>' +
    '</div>' +

    '<div class="summary-instrument">' +
      '<h3>modified JOA (mJOA)</h3>' +
      '<p>Total score <strong>' + (mjoa.totalScore === null ? '—' : mjoa.totalScore + ' of 17') + '</strong> — ' +
        'band: <strong>' + esc(MJOA_BAND_LABEL[mjoa.band] || mjoa.band) + '</strong></p>' +
    '</div>' +

    '<div class="summary-instrument">' +
      '<h3>EQ-5D-3L</h3>' +
      '<p>Health-state descriptor: <strong>' + (eq5d.healthStateDescriptor ? esc(eq5d.healthStateDescriptor) : '—') + '</strong> — ' +
        'UK TTO index value: <strong>' + fmt(eq5d.ukIndexValue, 3) + '</strong> — ' +
        'EQ VAS: <strong>' + (eq5d.vasScore === null ? '—' : eq5d.vasScore + ' / 100') + '</strong></p>' +
    '</div>'
  );
}

function refreshSummary() {
  const live = document.getElementById('live-summary');
  if (live) live.innerHTML = renderSummaryHtml();
}

// ----------------------------------------------------------------------
// Validation
// ----------------------------------------------------------------------

function clearFieldError(id) {
  const el = document.getElementById(id + '-error');
  if (el) el.textContent = '';
  const input = document.getElementById(id);
  if (input) input.removeAttribute('aria-invalid');
  const fs = document.getElementById(id + '-fieldset');
  if (fs) fs.removeAttribute('aria-invalid');
}

function setFieldError(id, message) {
  const el = document.getElementById(id + '-error');
  if (el) el.textContent = message;
  const input = document.getElementById(id);
  if (input) input.setAttribute('aria-invalid', 'true');
}

function validateForm() {
  const errors = [];
  const form = document.getElementById('assessment-form');
  if (!form) return errors;
  const required = form.querySelectorAll('[data-required]');
  required.forEach(function (input) {
    const id = input.id;
    const value = (input.value || '').trim();
    if (!value) {
      const labelEl = form.querySelector('label[for="' + id + '"]');
      const label = labelEl
        ? labelEl.textContent.replace(/\s*\*\s*$/, '').trim()
        : id;
      errors.push({ id: id, message: label + ' is required' });
      setFieldError(id, label + ' is required');
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
      errors.map(function (e) {
        return '<li><a href="#' + esc(e.id) + '">' + esc(e.message) + '</a></li>';
      }).join('') +
    '</ul>';
  summary.scrollIntoView({ behavior: 'smooth', block: 'start' });
  try { summary.focus({ preventScroll: true }); } catch (_) { /* not focusable on older browsers */ }
}

// ----------------------------------------------------------------------
// Report
// ----------------------------------------------------------------------

function csvEsc(v) {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

function buildCsv(scores) {
  const lines = [];
  lines.push('section,field,value');
  ['subjectId', 'visit', 'assessmentDate'].forEach(function (f) {
    lines.push(['visitDetails', f, state.visitDetails[f]].map(csvEsc).join(','));
  });
  lines.push('');
  lines.push('instrument,metric,value');
  SF36_DOMAINS.forEach(function (d) {
    lines.push(['sf36', d.label, scores.sf36[d.key]].map(csvEsc).join(','));
  });
  lines.push(['sf36', 'pcsApprox', scores.sf36.pcsApprox].map(csvEsc).join(','));
  lines.push(['sf36', 'mcsApprox', scores.sf36.mcsApprox].map(csvEsc).join(','));
  lines.push(['ndi', 'rawScore', scores.ndi.rawScore].map(csvEsc).join(','));
  lines.push(['ndi', 'percentageScore', scores.ndi.percentageScore].map(csvEsc).join(','));
  lines.push(['ndi', 'band', scores.ndi.band].map(csvEsc).join(','));
  lines.push(['mjoa', 'totalScore', scores.mjoa.totalScore].map(csvEsc).join(','));
  lines.push(['mjoa', 'band', scores.mjoa.band].map(csvEsc).join(','));
  lines.push(['eq5d', 'healthStateDescriptor', scores.eq5d.healthStateDescriptor].map(csvEsc).join(','));
  lines.push(['eq5d', 'ukIndexValue', scores.eq5d.ukIndexValue].map(csvEsc).join(','));
  lines.push(['eq5d', 'vasScore', scores.eq5d.vasScore].map(csvEsc).join(','));
  return lines.join('\n') + '\n';
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderReport() {
  const scores = computeAllScores(state);
  lastReport = scores;
  const reportEl = document.getElementById('report');
  if (!reportEl) return;

  reportEl.innerHTML =
    '<div class="report-header">' +
      '<h2>Patient-reported outcome measures — report</h2>' +
      '<button type="button" id="download-csv" class="button" data-variant="primary">Download CSV</button>' +
    '</div>' +
    '<p class="muted">Generated ' + esc(new Date().toLocaleString()) + '</p>' +
    '<p class="muted">Subject <strong>' + esc(state.visitDetails.subjectId || '—') + '</strong> — ' +
      'visit <strong>' + esc(state.visitDetails.visit || '—') + '</strong> — ' +
      'assessed <strong>' + esc(state.visitDetails.assessmentDate || '—') + '</strong></p>' +
    renderSummaryHtml() +
    '<div class="report-actions">' +
      '<button type="button" id="print-btn" class="button" data-variant="secondary">Print / save PDF</button>' +
      '<button type="button" id="start-over-btn" class="button" data-variant="secondary">Start over</button>' +
    '</div>';

  document.getElementById('download-csv').addEventListener('click', function () {
    downloadCsv('patient-reported-outcome-measures.csv', buildCsv(scores));
  });
  document.getElementById('print-btn').addEventListener('click', function () { window.print(); });
  document.getElementById('start-over-btn').addEventListener('click', resetAll);

  reportEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitForm() {
  const errors = validateForm();
  if (errors.length > 0) return;
  renderReport();
}

// ----------------------------------------------------------------------
// Bootstrap
// ----------------------------------------------------------------------

function renderForm() {
  const host = document.getElementById('form-sections');
  if (!host) return;
  host.innerHTML = '';
  STEP_RENDERERS.forEach(function (r) { host.appendChild(r()); });
}

function resetAll() {
  if (!confirm('Clear all recorded answers and start a fresh assessment?')) return;
  state = emptyAssessment();
  lastReport = null;
  clearDraft();
  hideDraftBanner();
  const out = document.getElementById('report');
  if (out) out.innerHTML = '<p class="empty-message">Submit the form to see the report.</p>';
  renderErrorSummary([]);
  renderForm();
  updateProgress();
  refreshSummary();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showDraftBanner() {
  const banner = document.getElementById('draft-banner');
  if (banner) banner.hidden = false;
}

function hideDraftBanner() {
  const banner = document.getElementById('draft-banner');
  if (banner) banner.hidden = true;
}

function bindDraftButtons() {
  const keep = document.getElementById('draft-keep');
  const discard = document.getElementById('draft-discard');
  if (keep) keep.addEventListener('click', hideDraftBanner);
  if (discard) discard.addEventListener('click', resetAll);
}

function init() {
  renderStepList();
  renderForm();
  updateProgress();
  refreshSummary();
  if (draftRestored) {
    showDraftBanner();
    if (restored && restored.savedAt) setSavedLabel(restored.savedAt);
  }
  bindDraftButtons();
  document.getElementById('submit-btn').addEventListener('click', submitForm);
  document.getElementById('reset-btn').addEventListener('click', resetAll);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
