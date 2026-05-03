// PHQ-9, GAD-7, and AUDIT-C scoring rules.
//
// Mirrors `src/lib/engine/mh-rules.ts` from the SvelteKit reference.
// PHQ-9 total: sum of 9 items, each 0-3 (range 0-27).
// GAD-7 total: sum of 7 items, each 0-3 (range 0-21).
// AUDIT-C total: sum of 3 items, each 0-4 (range 0-12).

/**
 * @typedef {import('./types.js').PhqResponses} PhqResponses
 * @typedef {import('./types.js').GadResponses} GadResponses
 * @typedef {import('./types.js').SeverityLevel} SeverityLevel
 */

// Wrapped in an IIFE; published via window.MentalHealthAssessment.
(function () {
'use strict';
window.MentalHealthAssessment = window.MentalHealthAssessment || {};

// ──────────────────────────────────────────────
// PHQ-9 Scoring Rules
// ──────────────────────────────────────────────

/** PHQ-9 question labels for display, in canonical order. */
const phq9Questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself, or that you are a failure, or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed, or the opposite — being so fidgety or restless',
  'Thoughts that you would be better off dead, or of hurting yourself in some way'
];

/** Field-key order matching `phq9Questions`. */
const phqKeys = [
  'interest',
  'depression',
  'sleep',
  'energy',
  'appetite',
  'selfEsteem',
  'concentration',
  'psychomotor',
  'suicidalThoughts'
];

/** PHQ-9 / GAD-7 answer options. */
const phqAnswerOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' }
];

/**
 * Calculate PHQ-9 total score (0-27). Returns null if any item is unanswered.
 * @param {PhqResponses} responses
 * @returns {number | null}
 */
function calculatePhq9Score(responses) {
  const values = phqKeys.map((k) => responses[k]);
  if (values.some((v) => v === null || v === undefined)) return null;
  return values.reduce((sum, v) => sum + v, 0);
}

/** @param {number} score @returns {SeverityLevel} */
function phq9Severity(score) {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  if (score <= 19) return 'moderately-severe';
  return 'severe';
}

/** @param {SeverityLevel} severity */
function phq9SeverityLabel(severity) {
  switch (severity) {
    case 'minimal':           return 'Minimal Depression (0-4)';
    case 'mild':              return 'Mild Depression (5-9)';
    case 'moderate':          return 'Moderate Depression (10-14)';
    case 'moderately-severe': return 'Moderately Severe Depression (15-19)';
    case 'severe':            return 'Severe Depression (20-27)';
    default:                  return '';
  }
}

// ──────────────────────────────────────────────
// GAD-7 Scoring Rules
// ──────────────────────────────────────────────

/** GAD-7 question labels for display, in canonical order. */
const gad7Questions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen'
];

/** Field-key order matching `gad7Questions`. */
const gadKeys = [
  'nervousness',
  'uncontrollableWorry',
  'excessiveWorry',
  'troubleRelaxing',
  'restlessness',
  'irritability',
  'fearfulness'
];

/** GAD-7 answer options (same scale as PHQ-9). */
const gadAnswerOptions = phqAnswerOptions;

/**
 * Calculate GAD-7 total score (0-21). Returns null if any item is unanswered.
 * @param {GadResponses} responses
 * @returns {number | null}
 */
function calculateGad7Score(responses) {
  const values = gadKeys.map((k) => responses[k]);
  if (values.some((v) => v === null || v === undefined)) return null;
  return values.reduce((sum, v) => sum + v, 0);
}

/** @param {number} score @returns {SeverityLevel} */
function gad7Severity(score) {
  if (score <= 4) return 'minimal';
  if (score <= 9) return 'mild';
  if (score <= 14) return 'moderate';
  return 'severe';
}

/** @param {SeverityLevel} severity */
function gad7SeverityLabel(severity) {
  switch (severity) {
    case 'minimal':  return 'Minimal Anxiety (0-4)';
    case 'mild':     return 'Mild Anxiety (5-9)';
    case 'moderate': return 'Moderate Anxiety (10-14)';
    case 'severe':   return 'Severe Anxiety (15-21)';
    default:         return '';
  }
}

// ──────────────────────────────────────────────
// AUDIT-C Scoring Rules
// ──────────────────────────────────────────────

/**
 * Calculate AUDIT-C score (0-12) from substance use selections.
 * Returns null if any of the three items is unanswered.
 * @param {string} frequency
 * @param {string} quantity
 * @param {string} binge
 * @returns {number | null}
 */
function calculateAuditCScore(frequency, quantity, binge) {
  const freqScore = {
    'never': 0,
    'monthly-or-less': 1,
    '2-4-per-month': 2,
    '2-3-per-week': 3,
    '4-or-more-per-week': 4
  };
  const qtyScore = {
    '1-2': 0,
    '3-4': 1,
    '5-6': 2,
    '7-9': 3,
    '10-or-more': 4
  };
  const bingeScore = {
    'never': 0,
    'less-than-monthly': 1,
    'monthly': 2,
    'weekly': 3,
    'daily-or-almost': 4
  };

  if (!frequency || !quantity || !binge) return null;

  const f = freqScore[frequency];
  const q = qtyScore[quantity];
  const b = bingeScore[binge];

  if (f === undefined || q === undefined || b === undefined) return null;
  return f + q + b;
}

Object.assign(window.MentalHealthAssessment, {
  phq9Questions,
  phqKeys,
  phqAnswerOptions,
  calculatePhq9Score,
  phq9Severity,
  phq9SeverityLabel,
  gad7Questions,
  gadKeys,
  gadAnswerOptions,
  calculateGad7Score,
  gad7Severity,
  gad7SeverityLabel,
  calculateAuditCScore
});
})();
