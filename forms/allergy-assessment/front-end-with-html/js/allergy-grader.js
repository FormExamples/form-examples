// Allergy severity grader. Pure functions: take an `AssessmentData` object,
// evaluate every classification rule, and return the maximum severity level
// among all fired rules plus the audit trail of fired rules and the weighted
// allergy burden score.
//
// Severity levels (ascending): mild < moderate < severe.
// `mild` is the default when no rules fire (no significant allergic
// conditions).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeverityLevel} SeverityLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AllergyAssessment.
(function () {
'use strict';
window.AllergyAssessment = window.AllergyAssessment || {};
const { allergyRules, calculateAllergyBurdenScore } = window.AllergyAssessment;

/**
 * Evaluate every severity rule against the assessment data and produce the
 * overall severity level plus per-rule audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ severityLevel: SeverityLevel, firedRules: FiredRule[] }}
 */
function calculateAllergySeverity(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of allergyRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          severityLevel: rule.severityLevel
        });
      }
    } catch (e) {
      console.warn(`Allergy rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {SeverityLevel} */
  let severityLevel = 'mild';
  if (firedRules.some((r) => r.severityLevel === 'severe')) {
    severityLevel = 'severe';
  } else if (firedRules.some((r) => r.severityLevel === 'moderate')) {
    severityLevel = 'moderate';
  } else if (firedRules.some((r) => r.severityLevel === 'mild')) {
    severityLevel = 'mild';
  }

  return { severityLevel, firedRules };
}

/**
 * Calculate the allergy burden score for the assessment.
 * @param {AssessmentData} data
 * @returns {number}
 */
function calculateAllergyBurden(data) {
  return calculateAllergyBurdenScore(data);
}

Object.assign(window.AllergyAssessment, {
  calculateAllergySeverity,
  calculateAllergyBurden
});
})();
