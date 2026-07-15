import { paduaRules } from './rules.js';

// Padua grader. Pure functions: take an `AssessmentData` object, evaluate the
// eleven weighted factor rules in `paduaRules`, award each factor's weight when
// present, sum the total (0-20), derive the risk band with the >= 4 threshold,
// and gate the prophylaxis recommendation on the bleeding-risk check.
//
// Grading algorithm (spec §4):
//   activeCancerPoint                    = activeCancer == 'yes'          ? 3 : 0
//   previousVtePoint                     = previousVte == 'yes'           ? 3 : 0
//   reducedMobilityPoint                 = reducedMobility == 'yes'       ? 3 : 0
//   knownThrombophiliaPoint              = knownThrombophilia == 'yes'    ? 3 : 0
//   recentTraumaOrSurgeryPoint           = recentTraumaOrSurgery == 'yes' ? 2 : 0
//   elderlyAgePoint                      = ageYears != null && >= 70      ? 1 : 0
//   heartOrRespiratoryFailurePoint       = heartOrRespiratoryFailure=='yes'? 1 : 0
//   acuteMiOrIschaemicStrokePoint        = acuteMiOrIschaemicStroke=='yes' ? 1 : 0
//   acuteInfectionOrRheumatologicalPoint = acuteInfectionOrRheumatological=='yes'? 1 : 0
//   obesityPoint                         = bodyMassIndex != null && >= 30 ? 1 : 0
//   ongoingHormonalTreatmentPoint        = ongoingHormonalTreatment=='yes'? 1 : 0
//   paduaScore = sum of the eleven points (0..20)
//   riskBand   = paduaScore >= 4 ? 'high' : 'low'
//
// A missing numeric input (ageYears, bodyMassIndex) contributes 0 points for
// its factor (absent, not positive); `flags.js` raises a data-completeness flag
// separately. The bleeding-risk fields never change the score; they gate the
// prophylaxis recommendation (spec §5).

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').ProphylaxisRecommendation} ProphylaxisRecommendation
 * @typedef {import('./types.js').FiredFactor} FiredFactor
 */

// Wrapped in an IIFE; published via window.PaduaVenousThromboembolismRiskAssessment.

/**
 * Evaluate the eleven Padua factor rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredFactor[]}
 */
function evaluateFactors(data) {
  /** @type {FiredFactor[]} */
  const fired = [];
  for (const rule of paduaRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          factor: rule.factor,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`Padua rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Whether a bleeding contraindication is present (gates the recommendation).
 * @param {AssessmentData} data
 * @returns {boolean}
 */
function hasBleedingContraindication(data) {
  return (
    data.bleeding.activeBleeding === 'yes' ||
    data.bleeding.highBleedingRisk === 'yes'
  );
}

/**
 * Compute the full Padua grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ factorPoints: Record<string, number>, paduaScore: number,
 *             riskBand: RiskBand,
 *             prophylaxisRecommendation: ProphylaxisRecommendation,
 *             firedFactors: FiredFactor[] }}
 */
function calculatePaduaGrade(data) {
  const firedFactors = evaluateFactors(data);

  // Per-factor contribution, keyed by factor name; 0 when the factor is absent.
  /** @type {Record<string, number>} */
  const factorPoints = {};
  for (const rule of paduaRules) {
    factorPoints[rule.factor] = 0;
  }
  for (const f of firedFactors) {
    factorPoints[f.factor] = f.points;
  }

  const paduaScore = firedFactors.reduce((sum, f) => sum + f.points, 0);

  /** @type {RiskBand} */
  const riskBand = paduaScore >= 4 ? 'high' : 'low';

  /** @type {ProphylaxisRecommendation} */
  let prophylaxisRecommendation;
  if (riskBand === 'high') {
    prophylaxisRecommendation = hasBleedingContraindication(data)
      ? 'mechanical'
      : 'pharmacological';
  } else {
    prophylaxisRecommendation = 'none';
  }

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` category.
  firedFactors.push({
    id: 'R-BAND-01',
    factor: 'band',
    points: 0,
    category: 'risk-band',
    description:
      paduaScore >= 4
        ? 'Padua >= 4 — high risk band; consider pharmacological thromboprophylaxis subject to bleeding-risk check'
        : 'Padua < 4 — low risk band; routine pharmacological prophylaxis not indicated on risk grounds'
  });

  return {
    factorPoints,
    paduaScore,
    riskBand,
    prophylaxisRecommendation,
    firedFactors
  };
}

export { evaluateFactors, hasBleedingContraindication, calculatePaduaGrade };
