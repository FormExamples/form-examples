// NICE CG156 Fertility grader. Pure functions: take an `AssessmentData`
// object, fire each rule, and produce an overall concern level (Low /
// Moderate / High) plus the audit trail of fired rules.
//
// Concern level cutoffs (sum of fired rule weights):
//   0..2   -> low concern
//   3..6   -> moderate concern
//   >= 7   -> high concern

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ConcernLevel} ConcernLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.FertilityAssessment = window.FertilityAssessment || {};
const { fertilityRules } = window.FertilityAssessment;

/**
 * Classify a numeric concern score into a category.
 * @param {number} score
 * @returns {ConcernLevel}
 */
function classifyConcernScore(score) {
  if (score >= 7) return 'high';
  if (score >= 3) return 'moderate';
  return 'low';
}

/**
 * Evaluate the NICE CG156 ruleset against the assessment data.
 *
 * @param {AssessmentData} data
 */
function calculateConcern(data) {
  const firedRules = [];
  let totalScore = 0;

  for (const rule of fertilityRules) {
    try {
      if (rule.evaluate(data)) {
        totalScore += rule.weight;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score: rule.weight
        });
      }
    } catch (e) {
      console.warn(`Fertility rule ${rule.id} evaluation failed:`, e);
    }
  }

  const concernLevel = classifyConcernScore(totalScore);
  return { concernScore: totalScore, concernLevel, firedRules };
}

Object.assign(window.FertilityAssessment, {
  classifyConcernScore,
  calculateConcern
});
})();
