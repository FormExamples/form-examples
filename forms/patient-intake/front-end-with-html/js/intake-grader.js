import { intakeRules } from './intake-rules.js';

// Patient Intake risk-level grader. Pure functions: take an
// `AssessmentData` object, evaluate every intake rule, and return the
// maximum risk level fired plus the per-rule audit trail.
//
// Risk-level cutoffs:
//   - low (default) — no rules fired
//   - medium        — at least one medium-risk rule fired
//   - high          — at least one high-risk rule fired

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.PatientIntake.

/**
 * Evaluate every intake rule against the supplied assessment data and
 * return the worst-fired risk level plus the list of rules that fired.
 *
 * @param {AssessmentData} data
 * @returns {{ riskLevel: RiskLevel, firedRules: FiredRule[] }}
 */
function calculateRiskLevel(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of intakeRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          riskLevel: rule.riskLevel
        });
      }
    } catch (e) {
      console.warn(`Intake rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {Record<RiskLevel, number>} */
  const riskOrder = { low: 0, medium: 1, high: 2 };

  /** @type {RiskLevel} */
  const riskLevel = firedRules.length === 0
    ? 'low'
    : firedRules.reduce(
        (max, r) => (riskOrder[r.riskLevel] > riskOrder[max] ? r.riskLevel : max),
        /** @type {RiskLevel} */ ('low')
      );

  return { riskLevel, firedRules };
}

export { calculateRiskLevel };
