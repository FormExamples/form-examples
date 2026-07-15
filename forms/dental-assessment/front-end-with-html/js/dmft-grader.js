import { dmftRules } from './dmft-rules.js';
import { getDMFTCategory, getDMFTScore } from './types.js';

// DMFT (Decayed, Missing, Filled Teeth) grader. Pure functions: take an
// `AssessmentData` object, return the total DMFT score (0-32 typically),
// the `DMFTCategory`, and the list of fired rules.
//
// Category cutoffs (DMFT total score):
//   0          -> Caries-Free
//   1-5        -> Very Low
//   6-10       -> Low
//   11-15      -> Moderate
//   16-20      -> High
//   21+        -> Very High

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').DMFTCategory} DMFTCategory
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.DentalAssessment.

/**
 * Evaluate all DMFT rules against the supplied assessment data and
 * produce the total score, the category, and the per-rule audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ dmftScore: number, dmftCategory: DMFTCategory, firedRules: FiredRule[] }}
 */
function calculateDMFT(data) {
  const dmftScore = getDMFTScore(
    data.dmftAssessment.decayedTeeth,
    data.dmftAssessment.missingTeeth,
    data.dmftAssessment.filledTeeth
  );
  const dmftCategory = getDMFTCategory(dmftScore);

  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of dmftRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          category: rule.category
        });
      }
    } catch (e) {
      console.warn(`DMFT rule ${rule.id} evaluation failed:`, e);
    }
  }

  return { dmftScore, dmftCategory, firedRules };
}

export { calculateDMFT };
