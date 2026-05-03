// ACT (Asthma Control Test) grader. Pure functions: take an
// `AssessmentData` object, return the total ACT score (5-25), the
// `ControlLevel`, and the list of fired rules. Items the patient has not
// answered are excluded from the total but tracked separately.
//
// Control level cutoffs (ACT total score, 5-25):
//   25         -> Well Controlled
//   20-24      -> Well Controlled, Could Be Better
//   16-19      -> Not Well Controlled
//   <=15       -> Very Poorly Controlled

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').ControlLevel} ControlLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.AsthmaAssessment.
(function () {
'use strict';
window.AsthmaAssessment = window.AsthmaAssessment || {};
const { actRules } = window.AsthmaAssessment;

/**
 * Classify a numeric ACT score (5-25) into a control level.
 * @param {number} score
 * @returns {ControlLevel}
 */
function classifyACTScore(score) {
  if (score === 25) return 'well-controlled';
  if (score >= 20) return 'well-controlled-but-could-be-better';
  if (score >= 16) return 'not-well-controlled';
  return 'very-poorly-controlled';
}

/**
 * Friendly label for a ControlLevel.
 * @param {ControlLevel} level
 */
function controlLevelLabel(level) {
  switch (level) {
    case 'well-controlled': return 'Well Controlled';
    case 'well-controlled-but-could-be-better': return 'Well Controlled, Could Be Better';
    case 'not-well-controlled': return 'Not Well Controlled';
    case 'very-poorly-controlled': return 'Very Poorly Controlled';
    default: return '';
  }
}

/**
 * CSS class hint for the control level badge.
 * @param {ControlLevel} level
 */
function controlLevelClass(level) {
  switch (level) {
    case 'well-controlled': return 'control-well';
    case 'well-controlled-but-could-be-better': return 'control-well-could-be-better';
    case 'not-well-controlled': return 'control-not-well';
    case 'very-poorly-controlled': return 'control-very-poor';
    default: return '';
  }
}

/**
 * Evaluate the 5-question Asthma Control Test against the supplied
 * assessment data and produce the total score plus per-question audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ actScore: number, controlLevel: ControlLevel, answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateACT(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  let totalScore = 0;
  let answeredCount = 0;

  for (const rule of actRules) {
    try {
      const score = rule.evaluate(data);
      if (score > 0) {
        answeredCount++;
        totalScore += score;
        firedRules.push({
          id: rule.id,
          category: rule.category,
          description: rule.description,
          score
        });
      }
    } catch (e) {
      console.warn(`ACT rule ${rule.id} evaluation failed:`, e);
    }
  }

  // If no questions answered, default to the maximum score (well-controlled)
  // so that an empty submission classifies as well-controlled rather than
  // very-poorly-controlled. Mirrors the SvelteKit reference engine.
  const actScore = answeredCount === 0 ? 25 : totalScore;
  const controlLevel = classifyACTScore(actScore);

  return { actScore, controlLevel, answeredCount, firedRules };
}

Object.assign(window.AsthmaAssessment, {
  classifyACTScore,
  controlLevelLabel,
  controlLevelClass,
  calculateACT
});
})();
