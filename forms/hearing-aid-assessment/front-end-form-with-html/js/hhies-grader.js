// HHIE-S grader. Pure function: takes an `AssessmentData` object and
// returns the total HHIE-S score (0-40), its category label, and the list
// of fired rules (questions that scored > 0).
//
// Score categories:
//    0-8   -> No handicap
//   10-22  -> Mild to moderate handicap
//   24-40  -> Significant handicap

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.HearingAidAssessment.
(function () {
'use strict';
window.HearingAidAssessment = window.HearingAidAssessment || {};
const { hhiesQuestions, hhiesCategory } = window.HearingAidAssessment;

/**
 * Calculate the HHIE-S total score from the patient questionnaire.
 *
 * @param {AssessmentData} data
 * @returns {{ hhiesScore: number, hhiesCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateHHIES(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const q = data.hhiesQuestionnaire;

  const scores = [
    q.q1, q.q2, q.q3, q.q4, q.q5,
    q.q6, q.q7, q.q8, q.q9, q.q10
  ];

  let hhiesScore = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score !== null && score > 0) {
      const question = hhiesQuestions[i];
      firedRules.push({
        id: question.id,
        domain: question.domain,
        description: question.text,
        score
      });
      hhiesScore += score;
    } else if (score !== null) {
      hhiesScore += score;
    }
  }

  const hhiesCategoryLabel = hhiesCategory(hhiesScore);

  return { hhiesScore, hhiesCategoryLabel, firedRules };
}

/**
 * Convenience: produce the full grading result with score, severity, and
 * fired rules.
 * @param {AssessmentData} data
 * @returns {{ score: number, severity: string, firedRules: FiredRule[] }}
 */
function gradeHHIES(data) {
  const { hhiesScore, hhiesCategoryLabel, firedRules } = calculateHHIES(data);
  return { score: hhiesScore, severity: hhiesCategoryLabel, firedRules };
}

Object.assign(window.HearingAidAssessment, {
  calculateHHIES,
  gradeHHIES
});
})();
