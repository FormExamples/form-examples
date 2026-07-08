// GOLD COPD grader. Pure functions: take an `AssessmentData` object,
// return the GOLD stage (1-4), the ABCD group (A/B/E), and the list of
// fired rules.
//
// Mirrors `src/lib/engine/gold-grader.ts` from the SvelteKit reference.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GoldStage} GoldStage
 * @typedef {import('./types.js').AbcdGroup} AbcdGroup
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.PulmonologyAssessment.
(function () {
'use strict';
window.PulmonologyAssessment = window.PulmonologyAssessment || {};
const { goldRules, determineAbcdGroup } = window.PulmonologyAssessment;

/**
 * Evaluate the GOLD rule set against the supplied assessment data and
 * return the maximum stage among fired rules together with the ABCD group.
 *
 * @param {AssessmentData} data
 * @returns {{ goldStage: GoldStage, abcdGroup: AbcdGroup, firedRules: FiredRule[] }}
 */
function calculateGold(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of goldRules) {
    try {
      if (rule.evaluate(data)) {
        firedRules.push({
          id: rule.id,
          system: rule.system,
          description: rule.description,
          stage: rule.stage
        });
      }
    } catch (e) {
      console.warn(`GOLD rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {GoldStage} */
  const goldStage =
    firedRules.length === 0
      ? 1
      : /** @type {GoldStage} */ (Math.max(...firedRules.map((r) => r.stage)));

  const abcdGroup = determineAbcdGroup(
    data.symptomAssessment.catScore,
    data.symptomAssessment.mmrcDyspnoea,
    data.exacerbationHistory.exacerbationsPerYear,
    data.exacerbationHistory.hospitalizationsPerYear
  );

  return { goldStage, abcdGroup, firedRules };
}

window.PulmonologyAssessment.calculateGold = calculateGold;
})();
