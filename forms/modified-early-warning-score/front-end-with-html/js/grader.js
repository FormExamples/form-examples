// MEWS grader. Pure functions: take an `ObservationData` object, map each of
// the five parameters to a 0-3 sub-score via the Subbe (2001) allocation table
// in `rules.js`, sum the aggregate (0-14), derive the risk band, and detect the
// single-parameter=3 trigger.
//
// Grading algorithm (spec §4):
//   systolicBloodPressurePoint = allocation(systolicBloodPressure)  // 0..3
//   heartRatePoint             = allocation(heartRate)              // 0..3
//   respiratoryRatePoint       = allocation(respiratoryRate)        // 0..3
//   temperaturePoint           = allocation(temperature)           // 0..2
//   avpuPoint                  = allocation(avpu)                   // 0..3
//   mewsScore = sum (0..14)
//   riskBand  = mewsScore >= 5 ? 'high' : mewsScore >= 2 ? 'medium' : 'low'
//   singleParameterTrigger = any sub-score == 3
//
// A missing numeric input contributes 0 points for that parameter (treated as
// not scored, not normal); `flags.js` raises a data-completeness flag
// separately.

/**
 * @typedef {import('./types.js').ObservationData} ObservationData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredParameter} FiredParameter
 */

// Wrapped in an IIFE; published via window.ModifiedEarlyWarningScore.
(function () {
'use strict';
window.ModifiedEarlyWarningScore =
  window.ModifiedEarlyWarningScore || {};
const { mewsParameters } = window.ModifiedEarlyWarningScore;

/** Derive the risk band from the aggregate. */
function bandForScore(score) {
  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

/** Recommended monitoring frequency / response for a risk band. */
function monitoringFrequencyForBand(band) {
  switch (band) {
    case 'high':
      return 'Urgent medical review; consider critical-care outreach and continuous monitoring.';
    case 'medium':
      return 'Increase observation frequency; inform the nurse in charge; consider medical review.';
    case 'low':
    default:
      return 'Routine observations at the standard ward frequency.';
  }
}

/**
 * Evaluate the five parameter allocations and collect per-parameter audit rows.
 * @param {ObservationData} data
 * @returns {{ points: Object, fired: FiredParameter[] }}
 */
function evaluateParameters(data) {
  const points = {};
  /** @type {FiredParameter[]} */
  const fired = [];
  for (const param of mewsParameters) {
    let point = 0;
    try {
      point = param.score(data);
    } catch (e) {
      console.warn(`MEWS parameter ${param.id} scoring failed:`, e);
    }
    points[param.instrument] = point;
    const value = param.valueOf(data);
    fired.push({
      id: `${param.id}-${point}`,
      instrument: param.instrument,
      points: point,
      band: point >= 3 ? 'high' : point >= 2 ? 'medium' : point >= 1 ? 'low' : '',
      category: 'parameter-sub-score',
      description: param.describe(point, value)
    });
  }
  return { points, fired };
}

/**
 * Compute the full MEWS grade for the supplied observation data.
 * @param {ObservationData} data
 * @returns {{ systolicBloodPressurePoint: 0|1|2|3, heartRatePoint: 0|1|2|3,
 *             respiratoryRatePoint: 0|1|2|3, temperaturePoint: 0|1|2|3,
 *             avpuPoint: 0|1|2|3, mewsScore: number, riskBand: RiskBand,
 *             singleParameterTrigger: boolean, monitoringFrequency: string,
 *             firedParameters: FiredParameter[] }}
 */
function calculateMewsGrade(data) {
  const { points, fired } = evaluateParameters(data);

  const systolicBloodPressurePoint = points['systolic-blood-pressure'];
  const heartRatePoint = points['heart-rate'];
  const respiratoryRatePoint = points['respiratory-rate'];
  const temperaturePoint = points['temperature'];
  const avpuPoint = points['avpu'];

  const mewsScore =
    systolicBloodPressurePoint +
    heartRatePoint +
    respiratoryRatePoint +
    temperaturePoint +
    avpuPoint;

  /** @type {RiskBand} */
  const riskBand = bandForScore(mewsScore);
  const singleParameterTrigger = fired.some((f) => f.points === 3);
  const monitoringFrequency = monitoringFrequencyForBand(riskBand);

  // Record the derived aggregate band as an `aggregate` audit row, mirroring the
  // grade_rule table's `aggregate` instrument.
  fired.push({
    id: `R-AGGREGATE-${riskBand}`,
    instrument: 'aggregate',
    points: 0,
    band: riskBand,
    category: 'risk-band',
    description:
      `Aggregate MEWS ${mewsScore} of 14 — ${riskBand} risk band. ${monitoringFrequency}`
  });

  // Record the single-parameter trigger as its own audit row when it fires.
  if (singleParameterTrigger) {
    const which = fired
      .filter((f) => f.instrument !== 'aggregate' && f.points === 3)
      .map((f) => f.instrument)
      .join(', ');
    fired.push({
      id: 'R-SINGLE-PARAMETER-3',
      instrument: 'single-parameter',
      points: 3,
      band: 'high',
      category: 'single-parameter-trigger',
      description:
        `Single-parameter trigger: ${which} scored 3 — urgent medical review regardless of aggregate.`
    });
  }

  return {
    systolicBloodPressurePoint,
    heartRatePoint,
    respiratoryRatePoint,
    temperaturePoint,
    avpuPoint,
    mewsScore,
    riskBand,
    singleParameterTrigger,
    monitoringFrequency,
    firedParameters: fired
  };
}

Object.assign(window.ModifiedEarlyWarningScore, {
  bandForScore,
  monitoringFrequencyForBand,
  evaluateParameters,
  calculateMewsGrade
});
})();
