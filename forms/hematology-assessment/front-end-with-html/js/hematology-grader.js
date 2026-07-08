// Hematology grader. Pure functions: take an `AssessmentData` object,
// return the abnormality level, composite score (0-100), and fired rules.
// If fewer than 3 numeric items are answered, returns "draft" status.
//
// Abnormality-level cutoffs (composite score, 0-100):
//   0       -> Normal
//   1-20    -> Mild Abnormality
//   21-50   -> Moderate Abnormality
//   51-75   -> Severe Abnormality
//   76-100  -> Critical

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').AbnormalityLevel} AbnormalityLevel
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.HematologyAssessment.
(function () {
'use strict';
window.HematologyAssessment = window.HematologyAssessment || {};
const {
  collectNumericItems,
  calculateAbnormalityScore,
  evaluateRules
} = window.HematologyAssessment;

/**
 * Calculate the composite abnormality from assessment data.
 * @param {AssessmentData} data
 * @returns {{ abnormalityLevel: AbnormalityLevel, abnormalityScore: number,
 *            answeredCount: number, firedRules: FiredRule[] }}
 */
function calculateAbnormality(data) {
  const items = collectNumericItems(data);
  const answeredCount = items.filter((x) => x !== null).length;

  if (answeredCount < 3) {
    return {
      abnormalityLevel: 'draft',
      abnormalityScore: 0,
      answeredCount,
      firedRules: []
    };
  }

  const score = calculateAbnormalityScore(data) ?? 0;
  const firedRules = evaluateRules(data);

  /** @type {AbnormalityLevel} */
  let level;
  if (score === 0) {
    level = 'normal';
  } else if (score <= 20) {
    level = 'mildAbnormality';
  } else if (score <= 50) {
    level = 'moderateAbnormality';
  } else if (score <= 75) {
    level = 'severeAbnormality';
  } else {
    level = 'critical';
  }

  return {
    abnormalityLevel: level,
    abnormalityScore: score,
    answeredCount,
    firedRules
  };
}

window.HematologyAssessment.calculateAbnormality = calculateAbnormality;
})();
