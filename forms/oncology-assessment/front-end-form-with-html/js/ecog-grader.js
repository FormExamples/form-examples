// ECOG Performance Status grader. Pure function: evaluates all declarative
// `ecogRules` against the supplied `AssessmentData` and returns the maximum
// grade among fired rules (worst-case impairment), defaulting to ECOG 0
// (fully active) when no rules fire.
//
// Mirrors `src/lib/engine/ecog-grader.ts` from the SvelteKit reference.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {0 | 1 | 2 | 3 | 4} ECOGGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.OncologyAssessment.
(function () {
'use strict';
window.OncologyAssessment = window.OncologyAssessment || {};
const { ecogRules } = window.OncologyAssessment;

/**
 * Evaluate every ECOG rule against the supplied assessment data.
 *
 * @param {AssessmentData} data
 * @returns {{ ecogGrade: ECOGGrade, firedRules: FiredRule[] }}
 */
function calculateECOG(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of ecogRules) {
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
      console.warn(`ECOG rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {ECOGGrade} */
  const ecogGrade =
    firedRules.length === 0
      ? 0
      : /** @type {ECOGGrade} */ (Math.max(...firedRules.map((r) => r.grade)));

  return { ecogGrade, firedRules };
}

window.OncologyAssessment.calculateECOG = calculateECOG;
})();
