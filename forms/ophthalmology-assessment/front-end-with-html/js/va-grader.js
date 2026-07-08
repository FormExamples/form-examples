// Visual Acuity grader. Pure functions: take an `AssessmentData` object,
// evaluate every VA rule, and return the worst grade plus the list of fired
// rules. Mirrors `src/lib/engine/va-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').VAGrade} VAGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.OphthalmologyAssessment.
(function () {
'use strict';
window.OphthalmologyAssessment = window.OphthalmologyAssessment || {};
const { vaRules } = window.OphthalmologyAssessment;

/** VA grade severity ordering for comparison. */
const gradeOrder = {
  normal: 0,
  mild: 1,
  moderate: 2,
  severe: 3,
  blindness: 4
};

/**
 * Evaluate every rule against the supplied data and return the worst grade
 * plus the list of fired rules.
 *
 * @param {AssessmentData} data
 * @returns {{ vaGrade: VAGrade, firedRules: FiredRule[] }}
 */
function calculateVisualAcuityGrade(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of vaRules) {
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
      console.warn(`VA rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {VAGrade} */
  let vaGrade = 'normal';
  if (firedRules.length > 0) {
    vaGrade = firedRules.reduce((worst, rule) => {
      return gradeOrder[rule.grade] > gradeOrder[worst] ? rule.grade : worst;
    }, /** @type {VAGrade} */ ('normal'));
  }

  return { vaGrade, firedRules };
}

window.OphthalmologyAssessment.calculateVisualAcuityGrade = calculateVisualAcuityGrade;
})();
