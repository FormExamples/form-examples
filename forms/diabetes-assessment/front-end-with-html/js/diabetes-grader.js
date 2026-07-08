// Diabetes grader - pure function. Mirrors `src/lib/engine/diabetes-grader.ts`
// from the SvelteKit reference.
//
// Composite-score boundaries (0-100):
//   <= 20  -> Very Poor
//   <= 40  -> Poorly Controlled
//   <  65  -> Suboptimal
//   >= 65  -> Well Controlled
//
// If fewer than 2 scored Likert items are answered AND no HbA1c value has
// been entered, the result short-circuits to a "draft" status to avoid
// grading a near-empty submission.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ControlLevel} ControlLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

(function () {
'use strict';
window.DiabetesAssessment = window.DiabetesAssessment || {};
const {
  evaluateRules,
  collectScoredItems,
  calculateCompositeScore
} = window.DiabetesAssessment;

/**
 * Calculate the composite control level, score, and fired rules.
 * @param {AssessmentData} data
 * @returns {{ controlLevel: ControlLevel, controlScore: number, firedRules: FiredRule[] }}
 */
function calculateControl(data) {
  const items = collectScoredItems(data);
  const answeredCount = items.filter((x) => x !== null).length;
  const hasHba1c = data.glycaemicControl.hba1cValue !== null;

  if (answeredCount < 2 && !hasHba1c) {
    return { controlLevel: 'draft', controlScore: 0, firedRules: [] };
  }

  const score = calculateCompositeScore(data) ?? 0;
  const firedRules = evaluateRules(data);

  /** @type {ControlLevel} */
  let controlLevel;
  if (score <= 20) controlLevel = 'veryPoor';
  else if (score <= 40) controlLevel = 'poor';
  else if (score < 65) controlLevel = 'suboptimal';
  else controlLevel = 'wellControlled';

  return { controlLevel, controlScore: score, firedRules };
}

window.DiabetesAssessment.calculateControl = calculateControl;
})();
