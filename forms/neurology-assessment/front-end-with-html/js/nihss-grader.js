import { nihssRules } from './nihss-rules.js';

// NIHSS (National Institutes of Health Stroke Scale) grader. Pure
// functions: take an `AssessmentData` object, return the total NIHSS
// score (0-42), the severity label, and the list of items that scored
// > 0 (the "fired rules" audit trail).
//
// Severity cutoffs (NIHSS total score, 0-42):
//   0           -> No stroke symptoms
//   1-4         -> Minor stroke
//   5-15        -> Moderate stroke
//   16-20       -> Moderate to severe stroke
//   21-42       -> Severe stroke

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.NeurologyAssessment.

/**
 * NIHSS severity label based on total score.
 * @param {number} score
 * @returns {string}
 */
function nihssSeverityLabel(score) {
  if (score === 0) return 'No stroke symptoms';
  if (score <= 4) return 'Minor stroke';
  if (score <= 15) return 'Moderate stroke';
  if (score <= 20) return 'Moderate to severe stroke';
  return 'Severe stroke';
}

/**
 * CSS class hint for the severity badge.
 * @param {number} score
 * @returns {string}
 */
function nihssSeverityClass(score) {
  if (score === 0) return 'severity-none';
  if (score <= 4) return 'severity-minor';
  if (score <= 15) return 'severity-moderate';
  if (score <= 20) return 'severity-mod-sev';
  return 'severity-severe';
}

/**
 * Evaluate the 15-item NIHSS against the supplied assessment data and
 * produce the total score plus per-item audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ nihssScore: number, nihssSeverity: string, firedRules: FiredRule[] }}
 */
function calculateNIHSS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;

  for (const rule of nihssRules) {
    try {
      const score = rule.evaluate(data);
      if (score > 0) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
      }
      totalScore += score;
    } catch (e) {
      console.warn(`NIHSS rule ${rule.id} evaluation failed:`, e);
    }
  }

  const nihssSeverity = nihssSeverityLabel(totalScore);
  return { nihssScore: totalScore, nihssSeverity, firedRules };
}

export { nihssSeverityLabel, nihssSeverityClass, calculateNIHSS };
