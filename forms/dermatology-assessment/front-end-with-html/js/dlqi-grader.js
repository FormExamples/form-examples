// DLQI (Dermatology Life Quality Index) grader. Pure functions: take an
// `AssessmentData` object and return the total DLQI score (0-30), its
// category label, and the list of fired rules.
//
// DLQI Scoring (10 questions, each scored 0-3):
//   0-1   = No effect on patient's life
//   2-5   = Small effect on patient's life
//   6-10  = Moderate effect on patient's life
//   11-20 = Very large effect on patient's life
//   21-30 = Extremely large effect on patient's life
//
// Each question response options:
//   0 = Not at all / Not relevant
//   1 = A little
//   2 = A lot
//   3 = Very much

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').DLQIRuleDefinition} DLQIRuleDefinition
 */

// Wrapped in an IIFE; published via window.DermatologyAssessment.
(function () {
'use strict';
window.DermatologyAssessment = window.DermatologyAssessment || {};

/** @type {DLQIRuleDefinition[]} */
const dlqiQuestions = [
  {
    id: 'DLQI-01',
    questionNumber: 1,
    domain: 'Symptoms and feelings',
    text: 'Over the last week, how itchy, sore, painful or stinging has your skin been?'
  },
  {
    id: 'DLQI-02',
    questionNumber: 2,
    domain: 'Symptoms and feelings',
    text: 'Over the last week, how embarrassed or self-conscious have you been because of your skin?'
  },
  {
    id: 'DLQI-03',
    questionNumber: 3,
    domain: 'Daily activities',
    text: 'Over the last week, how much has your skin interfered with you going shopping or looking after your home or garden?'
  },
  {
    id: 'DLQI-04',
    questionNumber: 4,
    domain: 'Daily activities',
    text: 'Over the last week, how much has your skin influenced the clothes you wear?'
  },
  {
    id: 'DLQI-05',
    questionNumber: 5,
    domain: 'Leisure',
    text: 'Over the last week, how much has your skin affected any social or leisure activities?'
  },
  {
    id: 'DLQI-06',
    questionNumber: 6,
    domain: 'Leisure',
    text: 'Over the last week, how much has your skin made it difficult for you to do any sport?'
  },
  {
    id: 'DLQI-07',
    questionNumber: 7,
    domain: 'Work and school',
    text: 'Over the last week, has your skin prevented you from working or studying? If "No", over the last week how much has your skin been a problem at work or studying?'
  },
  {
    id: 'DLQI-08',
    questionNumber: 8,
    domain: 'Relationships',
    text: 'Over the last week, how much has your skin created problems with your partner or any of your close friends or relatives?'
  },
  {
    id: 'DLQI-09',
    questionNumber: 9,
    domain: 'Relationships',
    text: 'Over the last week, how much has your skin caused any sexual difficulties?'
  },
  {
    id: 'DLQI-10',
    questionNumber: 10,
    domain: 'Treatment',
    text: 'Over the last week, how much of a problem has the treatment for your skin been, for example by making your home messy, or by taking up time?'
  }
];

const dlqiResponseOptions = [
  { value: 0, label: 'Not at all / Not relevant' },
  { value: 1, label: 'A little' },
  { value: 2, label: 'A lot' },
  { value: 3, label: 'Very much' }
];

/**
 * DLQI score category label.
 * @param {number} score
 * @returns {string}
 */
function dlqiCategory(score) {
  if (score <= 1) return 'No effect on life';
  if (score <= 5) return 'Small effect';
  if (score <= 10) return 'Moderate effect';
  if (score <= 20) return 'Very large effect';
  return 'Extremely large effect';
}

/**
 * CSS class hint for the DLQI score badge.
 * @param {number} score
 * @returns {string}
 */
function dlqiCategoryClass(score) {
  if (score <= 1) return 'dlqi-no-effect';
  if (score <= 5) return 'dlqi-small-effect';
  if (score <= 10) return 'dlqi-moderate-effect';
  if (score <= 20) return 'dlqi-very-large-effect';
  return 'dlqi-extreme-effect';
}

/**
 * Calculate the DLQI score from patient questionnaire data.
 * Returns the total score (0-30), its category label, the count of
 * answered questions (0-10), and the list of fired rules for each
 * answered question.
 *
 * @param {AssessmentData} data
 * @returns {{ dlqiScore: number, dlqiCategoryLabel: string, answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateDLQI(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const q = data.dlqiQuestionnaire;

  const scores = [
    q.q1, q.q2, q.q3, q.q4, q.q5,
    q.q6, q.q7, q.q8, q.q9, q.q10
  ];

  let dlqiScore = 0;
  let answeredCount = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score === null || score === undefined || score === '') continue;
    const numeric = Number(score);
    if (Number.isNaN(numeric)) continue;
    answeredCount++;
    dlqiScore += numeric;
    const question = dlqiQuestions[i];
    firedRules.push({
      id: question.id,
      domain: question.domain,
      description: question.text,
      score: numeric
    });
  }

  const dlqiCategoryLabel = dlqiCategory(dlqiScore);

  return { dlqiScore, dlqiCategoryLabel, answeredCount, firedRules };
}

Object.assign(window.DermatologyAssessment, {
  dlqiQuestions,
  dlqiResponseOptions,
  dlqiCategory,
  dlqiCategoryClass,
  calculateDLQI
});
})();
