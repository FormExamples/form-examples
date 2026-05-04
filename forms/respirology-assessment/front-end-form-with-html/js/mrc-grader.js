// MRC Dyspnoea Scale grader.
//
// Pure function: evaluates all MRC rules against patient data and returns
// the maximum grade among all fired rules (worst finding), defaulting to
// MRC 1 for patients with no fired rules.
//
// Mirrors the SvelteKit `src/lib/engine/mrc-grader.ts`.

(function () {
'use strict';
window.RespirologyAssessment = window.RespirologyAssessment || {};

const NS = window.RespirologyAssessment;

/**
 * @param {import('./types.js').AssessmentData} data
 * @returns {{ mrcGrade: 1|2|3|4|5, firedRules: import('./types.js').FiredRule[] }}
 */
function calculateMRC(data) {
  const firedRules = [];
  for (const rule of NS.mrcRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          grade: rule.grade
        });
      }
    } catch (e) {
      // Rule evaluation failed - log for debugging but continue grading.
      console.warn(`MRC rule ${rule.id} evaluation failed:`, e);
    }
  }
  const mrcGrade = firedRules.length === 0
    ? 1
    : Math.max(...firedRules.map((r) => r.grade));
  return { mrcGrade, firedRules };
}

NS.calculateMRC = calculateMRC;
})();
