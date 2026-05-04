// SAD scoring rules: SPAQ Global Seasonality Score (GSS) items + PHQ-9 items
// + ancillary clinical rules used by the grader and the report renderer.
//
// SPAQ GSS — 6 items, each scored 0-4. Total 0-24. Bands:
//   0-7  = No SAD
//   8-10 = Subsyndromal SAD
//   11-24 = SAD likely
//
// PHQ-9 — 9 items, each scored 0-3. Total 0-27. Bands:
//   0-4   = Minimal
//   5-9   = Mild
//   10-14 = Moderate
//   15-19 = Moderately severe
//   20-27 = Severe

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 *
 * @typedef {Object} ScaleOption
 * @property {number} value
 * @property {string} label
 *
 * @typedef {Object} SpaqItem
 * @property {string} id
 * @property {string} category
 * @property {string} label             - patient-facing question text
 * @property {string} section           - state.section path
 * @property {string} subsection        - 'spaq' (nested under section)
 * @property {string} field             - leaf field name on the spaq sub-object
 * @property {ScaleOption[]} options    - 0-4 options
 *
 * @typedef {Object} Phq9Item
 * @property {string} id
 * @property {string} category
 * @property {string} label
 * @property {string} field             - leaf field on currentMood.phq9
 * @property {ScaleOption[]} options    - 0-3 options
 */

(function () {
'use strict';
window.SeasonalAffectiveDisorderAssessment =
  window.SeasonalAffectiveDisorderAssessment || {};

/** Standard SPAQ 0-4 option set used by all six GSS items. */
const SPAQ_OPTIONS = [
  { value: 0, label: 'No change' },
  { value: 1, label: 'Slight change' },
  { value: 2, label: 'Moderate change' },
  { value: 3, label: 'Marked change' },
  { value: 4, label: 'Extremely marked change' }
];

/** Standard PHQ-9 0-3 option set used by all nine items. */
const PHQ9_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
];

/**
 * The six SPAQ Global Seasonality Score items. Each is scored 0-4 and the
 * sum (0-24) determines the seasonality band.
 * @type {SpaqItem[]}
 */
const spaqItems = [
  {
    id: 'SPAQ-001',
    category: 'Mood',
    label: 'Sleep length — how much do the seasons change your sleep length?',
    section: 'sleepEnergy',
    subsection: 'spaq',
    field: 'sleepLength',
    options: SPAQ_OPTIONS
  },
  {
    id: 'SPAQ-002',
    category: 'Energy',
    label: 'Social activity — how much do the seasons change your level of social activity?',
    section: 'socialOccupational',
    subsection: 'spaq',
    field: 'socialActivity',
    options: SPAQ_OPTIONS
  },
  {
    id: 'SPAQ-003',
    category: 'Mood',
    label: 'Mood (general well-being) — how much does it change with the seasons?',
    section: 'socialOccupational',
    subsection: 'spaq',
    field: 'mood',
    options: SPAQ_OPTIONS
  },
  {
    id: 'SPAQ-004',
    category: 'Weight',
    label: 'Weight — how much does your weight change with the seasons?',
    section: 'appetiteWeight',
    subsection: 'spaq',
    field: 'weight',
    options: SPAQ_OPTIONS
  },
  {
    id: 'SPAQ-005',
    category: 'Appetite',
    label: 'Appetite — how much does your appetite change with the seasons?',
    section: 'appetiteWeight',
    subsection: 'spaq',
    field: 'appetite',
    options: SPAQ_OPTIONS
  },
  {
    id: 'SPAQ-006',
    category: 'Energy',
    label: 'Energy level — how much does your energy change with the seasons?',
    section: 'sleepEnergy',
    subsection: 'spaq',
    field: 'energyLevel',
    options: SPAQ_OPTIONS
  }
];

/**
 * The nine PHQ-9 depression-severity items. Each is scored 0-3.
 * @type {Phq9Item[]}
 */
const phq9Items = [
  {
    id: 'PHQ9-Q1',
    category: 'Anhedonia',
    label: 'Little interest or pleasure in doing things',
    field: 'q1',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q2',
    category: 'Depressed Mood',
    label: 'Feeling down, depressed, or hopeless',
    field: 'q2',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q3',
    category: 'Sleep',
    label: 'Trouble falling or staying asleep, or sleeping too much',
    field: 'q3',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q4',
    category: 'Energy',
    label: 'Feeling tired or having little energy',
    field: 'q4',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q5',
    category: 'Appetite',
    label: 'Poor appetite or overeating',
    field: 'q5',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q6',
    category: 'Self-Esteem',
    label:
      'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
    field: 'q6',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q7',
    category: 'Concentration',
    label:
      'Trouble concentrating on things, such as reading the newspaper or watching television',
    field: 'q7',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q8',
    category: 'Psychomotor',
    label:
      'Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
    field: 'q8',
    options: PHQ9_OPTIONS
  },
  {
    id: 'PHQ9-Q9',
    category: 'Self-Harm',
    label:
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    field: 'q9',
    options: PHQ9_OPTIONS
  }
];

/** SPAQ band classifier. */
function classifySpaq(score) {
  if (score <= 7) return 'no-sad';
  if (score <= 10) return 'subsyndromal';
  return 'sad-likely';
}

/** PHQ-9 band classifier. */
function classifyPhq9(score) {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  if (score <= 19) return 'moderately-severe';
  return 'severe';
}

/** Friendly label for a SPAQ band. */
function spaqBandLabel(band) {
  switch (band) {
    case 'no-sad': return 'No SAD';
    case 'subsyndromal': return 'Subsyndromal SAD';
    case 'sad-likely': return 'SAD likely';
    default: return '';
  }
}

/** Friendly label for a PHQ-9 band. */
function phq9BandLabel(band) {
  switch (band) {
    case 'minimal': return 'Minimal depression';
    case 'mild': return 'Mild depression';
    case 'moderate': return 'Moderate depression';
    case 'moderately-severe': return 'Moderately severe depression';
    case 'severe': return 'Severe depression';
    default: return '';
  }
}

/** Friendly label for a combined severity. */
function combinedSeverityLabel(severity) {
  switch (severity) {
    case 'no-sad': return 'No SAD';
    case 'mild': return 'Mild';
    case 'moderate': return 'Moderate';
    case 'severe': return 'Severe';
    case 'critical': return 'Critical — urgent review';
    default: return '';
  }
}

/** CSS class hint for the combined severity badge. */
function combinedSeverityClass(severity) {
  return `severity-${severity}`;
}

Object.assign(window.SeasonalAffectiveDisorderAssessment, {
  SPAQ_OPTIONS,
  PHQ9_OPTIONS,
  spaqItems,
  phq9Items,
  classifySpaq,
  classifyPhq9,
  spaqBandLabel,
  phq9BandLabel,
  combinedSeverityLabel,
  combinedSeverityClass
});
})();
