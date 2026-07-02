// HAS-BLED grader. Pure functions: take an `AssessmentData` object, evaluate
// the nine criterion rules in `hasBledRules`, award 0 or 1 point each, sum the
// total (0-9), and derive the risk band with the >= 3 higher-bleeding-risk
// threshold.
//
// Grading algorithm (spec §4):
//   hypertensionPoints = hypertensionUncontrolled == 'yes'          ? 1 : 0
//   renalPoints        = abnormalRenalFunction   == 'yes'          ? 1 : 0
//   liverPoints        = abnormalLiverFunction   == 'yes'          ? 1 : 0
//   strokePoints       = strokeHistory           == 'yes'          ? 1 : 0
//   bleedingPoints     = bleedingHistory         == 'yes'          ? 1 : 0
//   labileInrPoints    = labileInr               == 'yes'          ? 1 : 0
//   elderlyPoints      = ageYears != null && ageYears > 65          ? 1 : 0
//   drugsPoints        = antiplateletOrNsaid     == 'yes'          ? 1 : 0
//   alcoholPoints      = alcoholUnitsPerWeek != null && >= 8        ? 1 : 0
//   totalScore = sum (0..9)
//   riskBand   = totalScore == 0 ? 'low' : totalScore <= 2 ? 'moderate' : 'high'
//
// A missing input contributes 0 points for that criterion (absent, not
// positive); `flags.js` raises a data-completeness flag separately. The grader
// also summarises the *modifiable* bleeding-risk factors present — the point of
// HAS-BLED is to surface correctable factors rather than gate anticoagulation.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.HasBledScoreForMajorBleedingRisk.
(function () {
'use strict';
window.HasBledScoreForMajorBleedingRisk =
  window.HasBledScoreForMajorBleedingRisk || {};
const { hasBledRules } = window.HasBledScoreForMajorBleedingRisk;

/**
 * Evaluate the nine HAS-BLED criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of hasBledRules) {
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
      console.warn(`HAS-BLED rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Derive the risk band from the total score.
 * @param {number} totalScore
 * @returns {RiskBand}
 */
function deriveRiskBand(totalScore) {
  if (totalScore >= 3) return 'high';
  if (totalScore >= 1) return 'moderate';
  return 'low';
}

/**
 * Summarise the correctable (modifiable) bleeding-risk factors present.
 * @param {AssessmentData} data
 * @returns {string}
 */
function summariseModifiableFactors(data) {
  const factors = [];
  if (data.hypertension.hypertensionUncontrolled === 'yes') {
    factors.push('uncontrolled hypertension (SBP > 160 mmHg)');
  }
  if (data.labileInr.labileInr === 'yes') {
    factors.push('labile INR / time in therapeutic range < 60%');
  }
  if (data.drugsAlcohol.antiplateletOrNsaid === 'yes') {
    factors.push('concomitant antiplatelets or NSAIDs');
  }
  if (
    data.drugsAlcohol.alcoholUnitsPerWeek !== null &&
    data.drugsAlcohol.alcoholUnitsPerWeek >= 8
  ) {
    factors.push('alcohol >= 8 units per week');
  }
  return factors.join('; ');
}

/**
 * Compute the full HAS-BLED grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ hypertensionPoints: 0|1, renalPoints: 0|1, liverPoints: 0|1,
 *             strokePoints: 0|1, bleedingPoints: 0|1, labileInrPoints: 0|1,
 *             elderlyPoints: 0|1, drugsPoints: 0|1, alcoholPoints: 0|1,
 *             totalScore: number, riskBand: RiskBand, modifiableFactors: string,
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateHasBledGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const hypertensionPoints = has('hypertension') ? 1 : 0;
  const renalPoints = has('renal') ? 1 : 0;
  const liverPoints = has('liver') ? 1 : 0;
  const strokePoints = has('stroke') ? 1 : 0;
  const bleedingPoints = has('bleeding') ? 1 : 0;
  const labileInrPoints = has('labile-inr') ? 1 : 0;
  const elderlyPoints = has('elderly') ? 1 : 0;
  const drugsPoints = has('drugs') ? 1 : 0;
  const alcoholPoints = has('alcohol') ? 1 : 0;

  const totalScore =
    hypertensionPoints + renalPoints + liverPoints + strokePoints +
    bleedingPoints + labileInrPoints + elderlyPoints + drugsPoints +
    alcoholPoints;

  const riskBand = deriveRiskBand(totalScore);
  const modifiableFactors = summariseModifiableFactors(data);

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'risk-band',
    description:
      totalScore >= 3
        ? 'HAS-BLED >= 3 — higher estimated risk of major bleeding; high risk band'
        : totalScore >= 1
        ? 'HAS-BLED 1-2 — moderate estimated bleeding risk; moderate risk band'
        : 'HAS-BLED 0 — low estimated bleeding risk; low risk band'
  });

  return {
    hypertensionPoints,
    renalPoints,
    liverPoints,
    strokePoints,
    bleedingPoints,
    labileInrPoints,
    elderlyPoints,
    drugsPoints,
    alcoholPoints,
    totalScore,
    riskBand,
    modifiableFactors,
    firedCriteria
  };
}

Object.assign(window.HasBledScoreForMajorBleedingRisk, {
  evaluateCriteria,
  deriveRiskBand,
  summariseModifiableFactors,
  calculateHasBledGrade
});
})();
