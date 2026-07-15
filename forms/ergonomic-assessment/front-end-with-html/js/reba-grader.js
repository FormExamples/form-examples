import { rebaRules } from './reba-rules.js';
import { rebaRiskLevel } from './types.js';

// REBA grader. Pure functions: take an `AssessmentData` object and return
// the REBA score (1-15), the textual risk level, and the list of fired
// rules. Mirrors the SvelteKit `reba-grader.ts` reference engine.
//
// Range cutoffs (REBA 1-15):
//   1       -> Negligible risk
//   2-3     -> Low risk
//   4-7     -> Medium risk
//   8-10    -> High risk
//   11-15   -> Very high risk

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Evaluate all REBA rules against the assessment data and produce the total
 * score plus per-rule audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ rebaScore: number, riskLevel: string, firedRules: FiredRule[] }}
 */
function calculateREBA(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of rebaRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          score: rule.score
        });
      }
    } catch (e) {
      console.warn(`REBA rule ${rule.id} evaluation failed:`, e);
    }
  }

  const rawScore = firedRules.reduce((sum, r) => sum + r.score, 0);
  const rebaScore = firedRules.length === 0 ? 1 : Math.min(Math.max(rawScore, 1), 15);
  const riskLevel = rebaRiskLevel(rebaScore);

  return { rebaScore, riskLevel, firedRules };
}

export { calculateREBA };
