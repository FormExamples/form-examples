import { dashQuestions } from './dash-rules.js';
import { dashCategory } from './types.js';

// DASH (Disabilities of the Arm, Shoulder and Hand) grader. Pure functions:
// take an `AssessmentData` object, return the total DASH score (0-100), its
// disability category label, and the list of fired rules (questions
// answered with a score > 1).
//
// DASH scoring:
//   DASH = ((sum of n responses / n) - 1) * 25
//   Minimum 27 of 30 items must be answered.
//
// DASH score categories (0-100):
//   0-20   -> No disability
//   21-40  -> Mild disability
//   41-60  -> Moderate disability
//   61-80  -> Severe disability
//   81-100 -> Very severe disability

// Wrapped in an IIFE; published via window.OrthopedicAssessment.

/**
 * Calculate the DASH score and fired rules from assessment data.
 * @param {import('./types.js').AssessmentData} data
 */
function calculateDASH(data) {
  const firedRules = [];
  const q = data.dashQuestionnaire;

  const scores = [
    q.q1, q.q2, q.q3, q.q4, q.q5,
    q.q6, q.q7, q.q8, q.q9, q.q10,
    q.q11, q.q12, q.q13, q.q14, q.q15,
    q.q16, q.q17, q.q18, q.q19, q.q20,
    q.q21, q.q22, q.q23, q.q24, q.q25,
    q.q26, q.q27, q.q28, q.q29, q.q30
  ];

  let sum = 0;
  let answeredCount = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score !== null && score !== undefined) {
      answeredCount++;
      sum += score;
      if (score > 1) {
        const question = dashQuestions[i];
        firedRules.push({
          id: question.id,
          domain: question.domain,
          description: question.text,
          score
        });
      }
    }
  }

  if (answeredCount < 27) {
    return {
      dashScore: null,
      dashCategoryLabel: 'Insufficient responses (minimum 27 of 30 required)',
      firedRules,
      answeredCount
    };
  }

  const dashScore = Math.round(((sum / answeredCount) - 1) * 25 * 100) / 100;
  const dashCategoryLabel = dashCategory(dashScore);

  return { dashScore, dashCategoryLabel, firedRules, answeredCount };
}

export { calculateDASH };
