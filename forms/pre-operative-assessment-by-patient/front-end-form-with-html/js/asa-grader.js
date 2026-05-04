// ASA Physical Status Classification grader. Pure functions: take an
// `AssessmentData` object, return the maximum-grade ASA classification
// (I-V; VI is for organ-donation cadavers and is not produced by this
// patient self-assessment) and the list of fired rules.
//
// Algorithm:
//   - For each rule, evaluate its predicate against the data.
//   - Collect every rule whose predicate returns true into firedRules.
//   - The overall grade is `max(grade of fired rules)`.
//   - If no rules fire, default to ASA I (healthy patient).
//
// Mirrors `front-end-form-with-svelte/src/lib/engine/asa-grader.ts`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ASAGrade} ASAGrade
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.PreOperativeAssessmentByPatient.
(function () {
'use strict';
window.PreOperativeAssessmentByPatient = window.PreOperativeAssessmentByPatient || {};
const { asaRules } = window.PreOperativeAssessmentByPatient;

/**
 * Evaluate all 42 ASA grading rules against the patient assessment.
 *
 * @param {AssessmentData} data
 * @returns {{ asaGrade: ASAGrade, firedRules: FiredRule[] }}
 */
function calculateASA(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];

  for (const rule of asaRules) {
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
      console.warn(`ASA rule ${rule.id} evaluation failed:`, e);
    }
  }

  /** @type {ASAGrade} */
  const asaGrade =
    firedRules.length === 0
      ? 1
      : /** @type {ASAGrade} */ (Math.max(...firedRules.map((r) => r.grade)));

  return { asaGrade, firedRules };
}

window.PreOperativeAssessmentByPatient.calculateASA = calculateASA;
})();
