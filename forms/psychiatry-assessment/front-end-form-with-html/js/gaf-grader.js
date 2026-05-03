// Pure GAF grading function. Mirrors the SvelteKit reference engine
// (`src/lib/engine/gaf-grader.ts`).
//
// Starts at 100 (superior functioning) and subtracts the impact of each
// fired rule. Final score is clamped to 1-100.

(function () {
'use strict';
window.PsychiatryAssessment = window.PsychiatryAssessment || {};

const { gafRules } = window.PsychiatryAssessment;

/**
 * @param {import('./types.js').AssessmentData} data
 * @returns {{ gafScore: number, firedRules: import('./types.js').FiredRule[] }}
 */
function calculateGAF(data) {
  const firedRules = [];
  for (const rule of gafRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          domain: rule.domain,
          description: rule.description,
          scoreImpact: rule.scoreImpact
        });
      }
    } catch (e) {
      console.warn(`GAF rule ${rule.id} evaluation failed:`, e);
    }
  }
  const totalImpact = firedRules.reduce((sum, r) => sum + r.scoreImpact, 0);
  const gafScore = Math.max(1, Math.min(100, 100 - totalImpact));
  return { gafScore, firedRules };
}

Object.assign(window.PsychiatryAssessment, { calculateGAF });
})();
