// Pure GI grader. Evaluates all GI scoring rules against patient data and
// returns the composite severity score, severity level, and the per-rule
// audit trail. Mirrors the SvelteKit `gi-grader.ts` engine.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').SeverityLevel} SeverityLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.GastroenterologyAssessment.
(function () {
'use strict';
window.GastroenterologyAssessment = window.GastroenterologyAssessment || {};
const { giRules, severityLevelFromScore } = window.GastroenterologyAssessment;

/**
 * @param {AssessmentData} data
 * @returns {{ severityScore: number, severityLevel: SeverityLevel, firedRules: FiredRule[] }}
 */
function calculateGISeverity(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of giRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          points: rule.points
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue scoring
      console.warn(`GI rule ${rule.id} evaluation failed:`, e);
    }
  }

  const severityScore = firedRules.reduce((sum, r) => sum + r.points, 0);
  const severityLevel = severityLevelFromScore(severityScore);

  return { severityScore, severityLevel, firedRules };
}

window.GastroenterologyAssessment.calculateGISeverity = calculateGISeverity;
})();
