// Functional Movement Screen (FMS) grader. Pure functions: take an
// `AssessmentData` object, return the total FMS score (0-21), category
// label, risk band, and a list of fired rules (one per pattern that
// contributed to the score).
//
// FMS scoring:
//   18-21 = Excellent
//   14-17 = Good
//   10-13 = Fair
//    0-9  = Poor
// Risk threshold: total score <=14 indicates increased injury risk.
//
// For bilateral tests, the lower of the left/right scores is used.
// If pain is present during any movement, that pattern's score is 0.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.KinesiologyAssessment.
(function () {
'use strict';
window.KinesiologyAssessment = window.KinesiologyAssessment || {};
const { fmsPatterns, fmsCategory, fmsBandClass, riskBand, riskBandLabel } = window.KinesiologyAssessment;

/**
 * Pure: calculate the total FMS score for the supplied assessment data.
 * Returns the 0-21 total, category label, risk band, and per-pattern
 * audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{ totalScore: number, fmsCategoryLabel: string, riskBand: 'low-risk'|'at-risk', firedRules: FiredRule[] }}
 */
function gradeFMS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  const p = data.fmsPatterns;

  const patternScores = [
    p.deepSquat,
    p.hurdleStep,
    p.inLineLunge,
    p.shoulderMobility,
    p.activeStraightLegRaise,
    p.trunkStabilityPushUp,
    p.rotaryStability
  ];

  let totalScore = 0;

  for (let i = 0; i < patternScores.length; i++) {
    const pattern = patternScores[i];
    const definition = fmsPatterns[i];

    // If pain during movement, score is 0
    if (pattern.painDuringMovement) {
      firedRules.push({
        id: definition.id,
        pattern: definition.pattern,
        description: `Pain during ${definition.pattern} - score set to 0`,
        score: 0
      });
      continue;
    }

    // For bilateral tests, use the lower of left/right scores
    let effectiveScore = pattern.score;

    if (pattern.leftScore !== null && pattern.rightScore !== null) {
      effectiveScore = Math.min(pattern.leftScore, pattern.rightScore);
    } else if (pattern.leftScore !== null || pattern.rightScore !== null) {
      effectiveScore = pattern.leftScore !== null ? pattern.leftScore : pattern.rightScore;
    }

    if (effectiveScore !== null) {
      firedRules.push({
        id: definition.id,
        pattern: definition.pattern,
        description: definition.description,
        score: effectiveScore
      });
      totalScore += effectiveScore;
    }
  }

  const fmsCategoryLabel = fmsCategory(totalScore);
  const band = riskBand(totalScore);

  return {
    totalScore,
    fmsCategoryLabel,
    riskBand: band,
    firedRules
  };
}

/** Convenience: FMS score label "FMS X/21 - Category". */
function fmsScoreLabel(score) {
  return `FMS ${score}/21 - ${fmsCategory(score)}`;
}

Object.assign(window.KinesiologyAssessment, {
  gradeFMS,
  fmsScoreLabel,
  fmsBandClass,
  riskBandLabel
});
})();
