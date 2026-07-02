// Caprini grader. Pure functions: take an `AssessmentData` object, evaluate
// every weighted factor rule in `capriniRules`, add the age-band weight, sum the
// total Caprini score, derive the risk band, and recommend a prophylaxis
// strategy (downgraded from pharmacological to mechanical when the bleeding risk
// is high).
//
// Grading algorithm (spec §4):
//   ageBandPoints = { under-41:0, 41-60:1, 61-74:2, 75-plus:3 }[ageBand] ?? 0
//   capriniScore  = ageBandPoints
//                 + sum(1 for each fired 1-point factor)
//                 + sum(2 for each fired 2-point factor)
//                 + sum(3 for each fired 3-point factor)
//                 + sum(5 for each fired 5-point factor)
//   riskBand      = score <= 1 ? very-low : score == 2 ? low : score <= 4 ? moderate : high
//   prophylaxis   = very-low -> early-ambulation, low -> mechanical,
//                   moderate -> pharmacological-or-mechanical,
//                   high     -> pharmacological-plus-mechanical
//   When highBleedingRisk == 'yes', any pharmacological recommendation is
//   downgraded to 'mechanical' (a contraindication flag is raised in flags.js).
//
// A factor answered '' (unanswered) contributes 0 points; `flags.js` raises a
// data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').Prophylaxis} Prophylaxis
 * @typedef {import('./types.js').FiredFactor} FiredFactor
 */

// Wrapped in an IIFE; published via window.CapriniVenousThromboembolismRiskAssessment.
(function () {
'use strict';
window.CapriniVenousThromboembolismRiskAssessment =
  window.CapriniVenousThromboembolismRiskAssessment || {};
const NS = window.CapriniVenousThromboembolismRiskAssessment;
const { capriniRules, ageBandPoints } = NS;

/**
 * Evaluate every factor rule and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredFactor[]}
 */
function evaluateFactors(data) {
  /** @type {FiredFactor[]} */
  const fired = [];
  for (const rule of capriniRules) {
    try {
      if (rule.evaluate(data)) {
        fired.push({
          id: rule.id,
          factor: rule.factor,
          weightGroup: rule.weightGroup,
          points: rule.points,
          category: rule.category,
          description: rule.description
        });
      }
    } catch (e) {
      console.warn(`Caprini rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Derive the risk band from the total Caprini score.
 * @param {number} score
 * @returns {RiskBand}
 */
function bandForScore(score) {
  if (score <= 1) return 'very-low';
  if (score === 2) return 'low';
  if (score <= 4) return 'moderate';
  return 'high';
}

/**
 * Base prophylaxis recommendation for a risk band (before any bleeding-risk
 * downgrade).
 * @param {RiskBand} band
 * @returns {Prophylaxis}
 */
function baseProphylaxisForBand(band) {
  switch (band) {
    case 'very-low': return 'early-ambulation';
    case 'low': return 'mechanical';
    case 'moderate': return 'pharmacological-or-mechanical';
    case 'high': return 'pharmacological-plus-mechanical';
    default: return 'early-ambulation';
  }
}

/**
 * Compute the full Caprini grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {import('./types.js').GradingResult}
 */
function calculateCapriniGrade(data) {
  const firedFactors = evaluateFactors(data);

  const groupSubtotals = { '1-point': 0, '2-point': 0, '3-point': 0, '5-point': 0 };
  for (const f of firedFactors) {
    groupSubtotals[f.weightGroup] = (groupSubtotals[f.weightGroup] || 0) + f.points;
  }

  const ageBand = data.identification.ageBand;
  const agePoints = ageBandPoints[ageBand] ?? 0;

  // Record the age-band contribution as an audit row (weight group 'age'),
  // mirroring the grade_rule table, whenever an age band has been chosen.
  if (ageBand !== '') {
    firedFactors.unshift({
      id: 'R-AGE-BAND-01',
      factor: 'age_band',
      weightGroup: 'age',
      points: agePoints,
      category: 'age-band',
      description: `Age band ${ageBand} contributes ${agePoints} point${agePoints === 1 ? '' : 's'}`
    });
  }

  const factorPointsTotal =
    groupSubtotals['1-point'] + groupSubtotals['2-point'] +
    groupSubtotals['3-point'] + groupSubtotals['5-point'];

  const capriniScore = agePoints + factorPointsTotal;

  /** @type {RiskBand} */
  const riskBand = bandForScore(capriniScore);

  const baseProphylaxis = baseProphylaxisForBand(riskBand);

  // Bleeding-risk downgrade: any pharmacological recommendation becomes
  // mechanical while the bleeding risk is high.
  const highBleeding = data.bleeding.highBleedingRisk === 'yes';
  const isPharmacological =
    baseProphylaxis === 'pharmacological-or-mechanical' ||
    baseProphylaxis === 'pharmacological-plus-mechanical';
  const bleedingDowngraded = highBleeding && isPharmacological;
  const recommendedProphylaxis = bleedingDowngraded ? 'mechanical' : baseProphylaxis;

  return {
    ageBandPoints: agePoints,
    groupSubtotals,
    capriniScore,
    riskBand,
    baseProphylaxis,
    recommendedProphylaxis,
    bleedingDowngraded,
    firedFactors,
    factorPoints: firedFactors,
    flaggedIssues: [],
    timestamp: ''
  };
}

Object.assign(window.CapriniVenousThromboembolismRiskAssessment, {
  evaluateFactors,
  bandForScore,
  baseProphylaxisForBand,
  calculateCapriniGrade
});
})();
