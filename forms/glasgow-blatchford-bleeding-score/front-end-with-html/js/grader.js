// Glasgow-Blatchford grader. Pure functions: take an `AssessmentData` object,
// score the eight weighted admission parameters (via the helpers in
// `rules.js`), sum their point contributions into a total of 0-23, and derive
// the risk band with its recommended management.
//
// Grading algorithm (spec §4):
//   bloodUreaPoints             = < 6.5 ? 0 : 6.5-7.9 ? 2 : 8.0-9.9 ? 3 : 10.0-24.9 ? 4 : 6
//   haemoglobinPoints           = sex-specific bands (men: 0/1/3/6; women: 0/1/6)
//   systolicBloodPressurePoints = >= 110 ? 0 : 100-109 ? 1 : 90-99 ? 2 : 3
//   pulsePoint                  = pulse >= 100 ? 1 : 0
//   melaenaPoint                = melaena  == yes ? 1 : 0
//   syncopePoint                = syncope  == yes ? 2 : 0
//   hepaticDiseasePoint         = hepatic  == yes ? 2 : 0
//   cardiacFailurePoint         = cardiac  == yes ? 2 : 0
//   gbsScore  = sum of the eight contributions (0..23)
//   riskBand  = gbsScore == 0 ? 'very-low' : gbsScore <= 5 ? 'low-moderate' : 'high'
//
// A missing numeric input contributes 0 points; `flags.js` raises a
// data-completeness flag separately. `complete` is true only once all eight
// parameters are answered and the patient's sex is known.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.GlasgowBlatchfordBleedingScore.
(function () {
'use strict';
window.GlasgowBlatchfordBleedingScore = window.GlasgowBlatchfordBleedingScore || {};
const {
  bloodUreaPoints,
  haemoglobinPoints,
  systolicBloodPressurePoints,
  pulsePoint,
  melaenaPoint,
  syncopePoint,
  hepaticDiseasePoint,
  cardiacFailurePoint,
  riskBandFor,
  gbsRules
} = window.GlasgowBlatchfordBleedingScore;

/**
 * True when every scored parameter has an input and the patient's sex is known
 * (an unknown / unset sex is treated as incomplete because it changes the
 * haemoglobin banding).
 * @param {AssessmentData} d
 * @returns {boolean}
 */
function isComplete(d) {
  const num = (v) => v !== null && v !== undefined;
  const enm = (v) => v !== '' && v !== null && v !== undefined;
  return (
    num(d.labs.bloodUrea) &&
    num(d.labs.haemoglobin) &&
    num(d.haemodynamics.systolicBloodPressure) &&
    num(d.haemodynamics.pulse) &&
    enm(d.clinicalMarkers.melaenaPresent) &&
    enm(d.clinicalMarkers.syncope) &&
    enm(d.clinicalMarkers.hepaticDisease) &&
    enm(d.clinicalMarkers.cardiacFailure) &&
    d.identification.sex !== '' &&
    d.identification.sex !== 'unknown'
  );
}

/**
 * Evaluate the declarative rule table and collect the rows that fired.
 * @param {AssessmentData} data
 * @returns {FiredRule[]}
 */
function evaluateRules(data) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of gbsRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          parameter: rule.parameter,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`GBS rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Glasgow-Blatchford grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ bloodUreaPoints: 0|2|3|4|6, haemoglobinPoints: 0|1|3|6,
 *             systolicBloodPressurePoints: 0|1|2|3, pulsePoint: 0|1,
 *             melaenaPoint: 0|1, syncopePoint: 0|2, hepaticDiseasePoint: 0|2,
 *             cardiacFailurePoint: 0|2, gbsScore: number, riskBand: RiskBand,
 *             recommendedManagement: string, complete: boolean,
 *             firedRules: FiredRule[] }}
 */
function calculateGbsGrade(data) {
  const urea = bloodUreaPoints(data);
  const hb = haemoglobinPoints(data);
  const sbp = systolicBloodPressurePoints(data);
  const pulse = pulsePoint(data);
  const melaena = melaenaPoint(data);
  const syncope = syncopePoint(data);
  const hepatic = hepaticDiseasePoint(data);
  const cardiac = cardiacFailurePoint(data);

  const gbsScore =
    urea + hb + sbp + pulse + melaena + syncope + hepatic + cardiac;

  const band = riskBandFor(gbsScore);
  const complete = isComplete(data);
  const firedRules = evaluateRules(data);

  // Record the derived band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` parameter.
  firedRules.push({
    id: `R-BAND-${band.riskBand.toUpperCase()}-01`,
    parameter: 'band',
    points: null,
    category: 'band-band',
    description:
      `GBS total ${gbsScore}${complete ? '' : ' (partial)'} → ${band.riskBand} risk`
  });

  return {
    bloodUreaPoints: urea,
    haemoglobinPoints: hb,
    systolicBloodPressurePoints: sbp,
    pulsePoint: pulse,
    melaenaPoint: melaena,
    syncopePoint: syncope,
    hepaticDiseasePoint: hepatic,
    cardiacFailurePoint: cardiac,
    gbsScore,
    riskBand: band.riskBand,
    recommendedManagement: band.recommendedManagement,
    complete,
    firedRules
  };
}

Object.assign(window.GlasgowBlatchfordBleedingScore, {
  isComplete,
  evaluateRules,
  calculateGbsGrade
});
})();
