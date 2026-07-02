// Wells PE grader. Pure functions: take an `AssessmentData` object, evaluate the
// seven weighted rules in `wellsRules`, award each present criterion its weight
// (+3, +1.5, or +1), sum the total (0..12.5), and derive the two-level (NICE
// NG158) and three-level (original Wells) bands plus the recommended pathway.
//
// Grading algorithm (spec §4):
//   wellsScore = sum of weighted points for each positive criterion   // 0..12.5
//   twoLevelBand      = wellsScore > 4 ? 'likely' : 'unlikely'
//   recommendedPathway = twoLevelBand == 'likely' ? 'ctpa' : 'd-dimer'
//   threeLevelBand    = wellsScore < 2 ? 'low'
//                     : wellsScore <= 6 ? 'moderate' : 'high'
//
// A criterion left blank ('') / 'no', or a missing (null) heart rate,
// contributes 0 points (absent, not positive); `flags.js` raises a
// data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').TwoLevelBand} TwoLevelBand
 * @typedef {import('./types.js').ThreeLevelBand} ThreeLevelBand
 * @typedef {import('./types.js').RecommendedPathway} RecommendedPathway
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.WellsScoreForPulmonaryEmbolism.
(function () {
'use strict';
window.WellsScoreForPulmonaryEmbolism =
  window.WellsScoreForPulmonaryEmbolism || {};
const { wellsRules } = window.WellsScoreForPulmonaryEmbolism;

/**
 * Evaluate the seven Wells rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of wellsRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          criterion: rule.criterion,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`Wells PE rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Wells PE grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {import('./types.js').GradingResult}
 */
function calculateWellsGrade(data) {
  const firedCriteria = evaluateCriteria(data);

  /** @type {Record<string, number>} */
  const criterionPoints = {};
  for (const rule of wellsRules) {
    criterionPoints[rule.criterion] = rule.evaluate(data) ? rule.points : 0;
  }

  // Weighted sum of all positive criteria → 0..12.5.
  const wellsScore = wellsRules.reduce(
    (sum, r) => sum + (r.evaluate(data) ? r.points : 0),
    0
  );

  /** @type {TwoLevelBand} */
  const twoLevelBand = wellsScore > 4 ? 'likely' : 'unlikely';
  /** @type {ThreeLevelBand} */
  const threeLevelBand =
    wellsScore < 2 ? 'low' : wellsScore <= 6 ? 'moderate' : 'high';
  /** @type {RecommendedPathway} */
  const recommendedPathway = twoLevelBand === 'likely' ? 'ctpa' : 'd-dimer';

  // Record the derived band decisions as audit rows, mirroring the
  // grade_rule table's two-level / three-level instruments.
  firedCriteria.push({
    id: 'R-TWO-LEVEL-BAND-01',
    criterion: 'two-level-band',
    points: 0,
    category: 'risk-band',
    description:
      twoLevelBand === 'likely'
        ? 'Wells > 4 — PE likely; arrange an immediate CTPA'
        : 'Wells <= 4 — PE unlikely; arrange a D-dimer test'
  });
  firedCriteria.push({
    id: 'R-THREE-LEVEL-BAND-01',
    criterion: 'three-level-band',
    points: 0,
    category: 'risk-band',
    description:
      threeLevelBand === 'high'
        ? 'Wells > 6 — high probability (original three-level rule)'
        : threeLevelBand === 'moderate'
          ? 'Wells 2-6 — moderate probability (original three-level rule)'
          : 'Wells < 2 — low probability (original three-level rule)'
  });

  return {
    criterionPoints,
    dvtSignsPoints: criterionPoints['dvt-signs'],
    peMostLikelyPoints: criterionPoints['pe-most-likely'],
    heartRatePoints: criterionPoints['heart-rate-over-100'],
    immobilisationSurgeryPoints: criterionPoints['immobilisation-surgery'],
    previousDvtPePoints: criterionPoints['previous-dvt-pe'],
    haemoptysisPoints: criterionPoints['haemoptysis'],
    malignancyPoints: criterionPoints['malignancy'],
    wellsScore,
    twoLevelBand,
    threeLevelBand,
    recommendedPathway,
    firedCriteria
  };
}

Object.assign(window.WellsScoreForPulmonaryEmbolism, {
  evaluateCriteria,
  calculateWellsGrade
});
})();
