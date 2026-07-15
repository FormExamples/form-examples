import { agePoints, comorbidityPoints, diagnosisPoints, riskBand, rockallRules, shockPoints, stigmataPoints } from './rules.js';

// Rockall grader. Pure functions: take an `AssessmentData` object, score the
// three clinical parameters (age, shock, comorbidity) into a pre-endoscopy
// (clinical) score of 0-7, and — when endoscopy has been performed — add the two
// endoscopic parameters (diagnosis, stigmata) into a full (post-endoscopy) score
// of 0-11, then band the risk.
//
// Grading algorithm (spec §4):
//   agePoints            = ageYears null ? 0 : >= 80 ? 2 : >= 60 ? 1 : 0
//   shockPoints          = SBP < 100 ? 2 : HR >= 100 ? 1 : 0
//   comorbidityPoints    = severe ? 3 : major ? 2 : 0
//   clinicalRockallScore = agePoints + shockPoints + comorbidityPoints        // 0..7
//   diagnosisPoints      = upper-gi-malignancy ? 2 : all-other ? 1 : 0
//   stigmataPoints       = high-risk ? 2 : 0
//   fullRockallScore     = endoscopyPerformed=='yes'
//                          ? clinical + diagnosisPoints + stigmataPoints        // 0..11
//                          : null
//   riskBand             = fullRockallScore != null
//                          ? (<= 2 low, 3-4 intermediate, >= 5 high)
//                          : (clinical == 0 ? 'low' : 'clinical-only')
//
// A missing numeric input contributes 0 points for its parameter; `flags.js`
// raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

/**
 * Evaluate the declarative rule table and collect the rows that fired.
 * @param {AssessmentData} data
 * @returns {FiredRule[]}
 */
function evaluateRules(data) {
  /** @type {FiredRule[]} */
  const fired = [];
  for (const rule of rockallRules) {
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
      console.warn(`Rockall rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full Rockall grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {import('./types.js').GradingResult}
 */
function calculateRockallGrade(data) {
  const age = agePoints(data);
  const shock = shockPoints(data);
  const comorbidity = comorbidityPoints(data);
  const clinicalRockallScore = age + shock + comorbidity;

  const endoscopyDone = data.endoscopy.endoscopyPerformed === 'yes';
  const diagnosis = diagnosisPoints(data);
  const stigmata = stigmataPoints(data);
  const fullRockallScore = endoscopyDone
    ? clinicalRockallScore + diagnosis + stigmata
    : null;

  const band = riskBand(clinicalRockallScore, fullRockallScore);
  const score = fullRockallScore !== null ? fullRockallScore : clinicalRockallScore;

  const firedRules = evaluateRules(data);

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` parameter.
  firedRules.push({
    id: `R-BAND-${band.toUpperCase()}-01`,
    parameter: 'band',
    points: null,
    category: 'risk-band',
    description: endoscopyDone
      ? `Full Rockall score ${fullRockallScore} of 11 -> ${band} risk`
      : `Clinical Rockall score ${clinicalRockallScore} of 7 (pre-endoscopy) -> ${band}`
  });

  return {
    agePoints: age,
    shockPoints: shock,
    comorbidityPoints: comorbidity,
    clinicalRockallScore,
    diagnosisPoints: diagnosis,
    stigmataPoints: stigmata,
    fullRockallScore,
    riskBand: band,
    score,
    endoscopyDone,
    firedRules
  };
}

export { evaluateRules, calculateRockallGrade };
