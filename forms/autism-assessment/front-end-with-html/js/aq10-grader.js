import { aq10Questions } from './aq10-rules.js';
import { aq10Category } from './types.js';

// AQ-10 grader. Pure functions: take an `AssessmentData` object, return
// the total AQ-10 score (0-10), its category label, and the list of
// scored items contributing to the total.
//
// Cutoff:
//   0-5  -> Below threshold
//   6-10 -> At or above threshold (consider full diagnostic assessment)

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AutismAssessment.

/**
 * Calculate AQ-10 score and per-question fired rules.
 * @param {AssessmentData} data
 * @returns {{ aq10Score: number, aq10CategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateAQ10(data) {
  
  const q = data.aq10Questionnaire;
  const scores = [
    q.q1, q.q2, q.q3, q.q4, q.q5,
    q.q6, q.q7, q.q8, q.q9, q.q10
  ];

  /** @type {FiredRule[]} */
  const firedRules = [];
  let aq10Score = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score === null || score === undefined) continue;
    const question = aq10Questions[i];
    if (score > 0) {
      firedRules.push({
        id: question.id,
        domain: question.domain,
        description: question.text,
        score
      });
    }
    aq10Score += score;
  }

  return {
    aq10Score,
    aq10CategoryLabel: aq10Category(aq10Score),
    firedRules
  };
}

export { calculateAQ10 };
