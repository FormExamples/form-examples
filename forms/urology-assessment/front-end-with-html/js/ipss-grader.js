import { ipssQuestions } from './ipss-rules.js';
import { ipssCategory } from './types.js';

// IPSS (International Prostate Symptom Score) grader. Pure functions: take
// an `AssessmentData` object, return the total IPSS score (0-35), its
// category, and the per-question fired rules.
//
// Categories:
//   0-7   -> Mild
//   8-19  -> Moderate
//   20-35 -> Severe

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Calculate IPSS total score and per-question fired rules.
 * Items the patient has not answered (`null`) are excluded entirely; a
 * `0` answer is included in the count but does not fire a rule (per the
 * SvelteKit reference engine, only positive scores produce a fired-rule
 * entry).
 *
 * @param {AssessmentData} data
 * @returns {{ ipssScore: number, ipssCategoryLabel: string, firedRules: FiredRule[] }}
 */
function calculateIPSS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const q = data.ipssQuestionnaire;

  const scores = [q.q1, q.q2, q.q3, q.q4, q.q5, q.q6, q.q7];
  let ipssScore = 0;

  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    if (score === null || score === undefined) continue;
    ipssScore += score;
    if (score > 0) {
      const question = ipssQuestions[i];
      firedRules.push({
        id: question.id,
        domain: question.domain,
        description: question.text,
        score
      });
    }
  }

  const ipssCategoryLabel = ipssCategory(ipssScore);
  return { ipssScore, ipssCategoryLabel, firedRules };
}

export { calculateIPSS };
