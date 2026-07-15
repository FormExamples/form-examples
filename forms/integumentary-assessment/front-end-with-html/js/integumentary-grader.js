import { bradenRules } from './rules.js';

// Braden Scale grader. Pure functions: take an `AssessmentData` object,
// return the total Braden score (6-23), the `RiskLevel`, and the list of
// fired subscales. Unanswered subscales are excluded from the total but
// tracked separately.
//
// Risk-level cutoffs (Braden total score, lower = higher risk):
//   <=  9  -> Very High Risk
//   10-12  -> High Risk
//   13-14  -> Moderate Risk
//   15-18  -> Mild Risk
//   19-23  -> No Risk

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskLevel} RiskLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.IntegumentaryAssessment.

/**
 * Classify a numeric Braden score (6-23) into a risk level.
 * @param {number} score
 * @returns {RiskLevel}
 */
function classifyBradenScore(score) {
  if (score <= 9) return 'very-high-risk';
  if (score <= 12) return 'high-risk';
  if (score <= 14) return 'moderate-risk';
  if (score <= 18) return 'mild-risk';
  return 'no-risk';
}

/**
 * Friendly label for a RiskLevel.
 * @param {RiskLevel} level
 */
function riskLevelLabel(level) {
  switch (level) {
    case 'very-high-risk': return 'Very High Risk';
    case 'high-risk': return 'High Risk';
    case 'moderate-risk': return 'Moderate Risk';
    case 'mild-risk': return 'Mild Risk';
    case 'no-risk': return 'No Risk';
    default: return '';
  }
}

/**
 * CSS class hint for the risk-level badge.
 * @param {RiskLevel} level
 */
function riskLevelClass(level) {
  switch (level) {
    case 'very-high-risk': return 'risk-very-high';
    case 'high-risk': return 'risk-high';
    case 'moderate-risk': return 'risk-moderate';
    case 'mild-risk': return 'risk-mild';
    case 'no-risk': return 'risk-no';
    default: return '';
  }
}

/**
 * Evaluate the 6-subscale Braden Scale against the supplied assessment data
 * and produce the total score plus per-subscale audit trail.
 *
 * If no subscales are answered, the total is reported as 23 (no risk) so
 * an empty submission classifies as "No Risk" rather than the highest-risk
 * extreme of 6. Mirrors the SvelteKit reference engine.
 *
 * @param {AssessmentData} data
 * @returns {{ bradenScore: number, riskLevel: RiskLevel, answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateBraden(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;
  let answeredCount = 0;

  for (const rule of bradenRules) {
    try {
      const score = rule.evaluate(data);
      if (score > 0) {
        answeredCount++;
        totalScore += score;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score,
          maxScore: rule.maxScore
        });
      }
    } catch (e) {
      console.warn(`Braden rule ${rule.id} evaluation failed:`, e);
    }
  }

  const bradenScore = answeredCount === 0 ? 23 : totalScore;
  const riskLevel = classifyBradenScore(bradenScore);

  return { bradenScore, riskLevel, answeredCount, firedRules };
}

export { classifyBradenScore, riskLevelLabel, riskLevelClass, calculateBraden };
