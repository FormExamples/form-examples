// Waterlow grader. Pure functions: take an `AssessmentData` object, map each
// core category and each special-risk group to its points, sum every
// contribution into the Waterlow total, derive the risk band, and build the
// contributing-categories breakdown for the summary.
//
// Grading algorithm (spec §4) — a summed weighted score (higher = worse):
//   buildPoints        = map[buildWeightForHeight]
//   skinPoints         = map[skinType]
//   sexPoints          = map[sex]
//   agePoints          = map[ageBand]
//   continencePoints   = map[continence]
//   mobilityPoints     = map[mobility]
//   tissueMalnutritionPoints  = map[tissueMalnutrition]
//   neurologicalDeficitPoints = map[neurologicalDeficit]
//   majorSurgeryTraumaPoints  = map[majorSurgeryTrauma]
//   medicationPoints          = map[medication]
//   waterlowScore = sum of all the above
//   riskBand = score >= 20 ? 'very-high'
//            : score >= 15 ? 'high'
//            : score >= 10 ? 'at-risk'
//            :               'low'
//
// An unanswered enum ('') contributes 0 points for that category (the total can
// then understate risk); `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').ContributingCategory} ContributingCategory
 * @typedef {import('./types.js').GradingResult} GradingResult
 */

// Wrapped in an IIFE; published via window.WaterlowPressureUlcerRiskAssessment.
(function () {
'use strict';
window.WaterlowPressureUlcerRiskAssessment =
  window.WaterlowPressureUlcerRiskAssessment || {};
const NS = window.WaterlowPressureUlcerRiskAssessment;
const { pointsFor, CATEGORY_DEFS, optionLabel, preventionActionLabel } = NS;

/**
 * Derive the risk band from the total Waterlow score.
 * @param {number} score
 * @returns {RiskBand}
 */
function bandForScore(score) {
  if (score >= 20) return 'very-high';
  if (score >= 15) return 'high';
  if (score >= 10) return 'at-risk';
  return 'low';
}

/**
 * Compute the full Waterlow grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function calculateWaterlowGrade(data) {
  /** @type {Object<string, number>} */
  const points = {};
  /** @type {ContributingCategory[]} */
  const contributingCategories = [];

  for (const def of CATEGORY_DEFS) {
    const section = data[def.section] || {};
    const value = section[def.field] ?? '';
    const p = pointsFor(def.map, value);
    points[def.pointsField] = p;
    if (p > 0) {
      contributingCategories.push({
        key: def.key,
        label: def.label,
        optionLabel: optionLabel(def.field, value),
        points: p
      });
    }
  }

  const buildPoints = points.buildPoints || 0;
  const skinPoints = points.skinPoints || 0;
  const sexPoints = points.sexPoints || 0;
  const agePoints = points.agePoints || 0;
  const continencePoints = points.continencePoints || 0;
  const mobilityPoints = points.mobilityPoints || 0;
  const tissueMalnutritionPoints = points.tissueMalnutritionPoints || 0;
  const neurologicalDeficitPoints = points.neurologicalDeficitPoints || 0;
  const majorSurgeryTraumaPoints = points.majorSurgeryTraumaPoints || 0;
  const medicationPoints = points.medicationPoints || 0;

  const waterlowScore =
    buildPoints + skinPoints + sexPoints + agePoints + continencePoints +
    mobilityPoints + tissueMalnutritionPoints + neurologicalDeficitPoints +
    majorSurgeryTraumaPoints + medicationPoints;

  /** @type {RiskBand} */
  const riskBand = bandForScore(waterlowScore);

  return {
    buildPoints,
    skinPoints,
    sexPoints,
    agePoints,
    continencePoints,
    mobilityPoints,
    tissueMalnutritionPoints,
    neurologicalDeficitPoints,
    majorSurgeryTraumaPoints,
    medicationPoints,
    waterlowScore,
    riskBand,
    preventionAction: preventionActionLabel(riskBand),
    contributingCategories,
    flaggedIssues: [],
    timestamp: ''
  };
}

Object.assign(window.WaterlowPressureUlcerRiskAssessment, {
  bandForScore,
  calculateWaterlowGrade
});
})();
