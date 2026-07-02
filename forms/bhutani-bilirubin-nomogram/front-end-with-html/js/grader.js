// Bhutani bilirubin nomogram classifier. Pure functions: take an
// `AssessmentData` object and perform two independent lookups against the
// tabulated curves in `rules.js`.
//
// Classification algorithm (spec §4):
//
//   (a) Zone lookup (prediction) — interpolate the 40th / 75th / 95th
//       percentile TSB tracks at `ageHours`, then band the measured TSB:
//         riskZone = TSB <  p40 ? 'low'
//                  : TSB <  p75 ? 'low-intermediate'
//                  : TSB <  p95 ? 'high-intermediate'
//                  :              'high'
//       percentileBand mirrors riskZone (<40 / 40-75 / 75-95 / >=95).
//
//   (b) Threshold comparison (treatment signal) — select the phototherapy and
//       exchange curves for the infant's gestational band, interpolate at
//       `ageHours`, and compare:
//         abovePhototherapy = TSB != null && TSB >= phototherapyThreshold
//         aboveExchange     = TSB != null && TSB >= exchangeThreshold
//
// `ageHours` is clamped to the nomogram domain (~0–168 h); out-of-range age
// sets `outOfRange` (the caller raises a data-range flag) but still clamps for
// computation. If `ageHours` or `totalSerumBilirubinUmolL` is null, no zone is
// assigned and a data-completeness flag is raised in `flags.js`.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').GradingResult} GradingResult
 * @typedef {import('./types.js').FiredRiskFactor} FiredRiskFactor
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.BhutaniBilirubinNomogram.
(function () {
'use strict';
window.BhutaniBilirubinNomogram = window.BhutaniBilirubinNomogram || {};
const {
  AGE_MIN_HOURS,
  AGE_MAX_HOURS,
  RISK_FACTOR_LABELS,
  gestationBand,
  percentileTracks,
  thresholds,
  roundOne
} = window.BhutaniBilirubinNomogram;

/**
 * Collect the risk factors that are set to 'yes'.
 * @param {AssessmentData} data
 * @returns {FiredRiskFactor[]}
 */
function collectRiskFactors(data) {
  /** @type {FiredRiskFactor[]} */
  const fired = [];
  const rf = data.riskFactors;
  for (const key of Object.keys(RISK_FACTOR_LABELS)) {
    if (rf[key] === 'yes') {
      fired.push({ id: key, label: RISK_FACTOR_LABELS[key] });
    }
  }
  return fired;
}

/**
 * Compute the full Bhutani classification for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {GradingResult}
 */
function gradeBhutani(data) {
  const ageRaw = data.measurement.ageHours;
  const tsb = data.measurement.totalSerumBilirubinUmolL;
  const weeks = data.identification.gestationalAgeWeeks;
  const band = gestationBand(weeks);

  /** @type {FiredRule[]} */
  const firedRules = [];

  const hasAge = ageRaw !== null && ageRaw !== undefined && !Number.isNaN(ageRaw);
  const hasTsb = tsb !== null && tsb !== undefined && !Number.isNaN(tsb);

  const outOfRange =
    hasAge && (ageRaw < AGE_MIN_HOURS || ageRaw > AGE_MAX_HOURS);

  // When we cannot place a point, return an unclassified result. The threshold
  // curves still cannot be interpolated without an age, so leave them null.
  if (!hasAge || !hasTsb) {
    return {
      ageHours: hasAge ? roundOne(ageRaw) : null,
      riskZone: null,
      percentileBand: null,
      p40: null,
      p75: null,
      p95: null,
      gestationBand: band,
      phototherapyThreshold: null,
      exchangeThreshold: null,
      abovePhototherapy: false,
      aboveExchange: false,
      outOfRange: !!outOfRange,
      firedRiskFactors: collectRiskFactors(data),
      firedRules,
      flaggedIssues: [],
      timestamp: new Date().toISOString()
    };
  }

  // Clamp age into the nomogram domain for interpolation (no extrapolation).
  const ageClamped = Math.min(Math.max(ageRaw, AGE_MIN_HOURS), AGE_MAX_HOURS);

  // ─── (a) Zone lookup ───────────────────────────────────────────
  const { p40, p75, p95 } = percentileTracks(ageClamped);

  /** @type {import('./types.js').RiskZone} */
  let riskZone;
  /** @type {import('./types.js').PercentileBand} */
  let percentileBand;
  if (tsb < p40) {
    riskZone = 'low';
    percentileBand = '<40';
  } else if (tsb < p75) {
    riskZone = 'low-intermediate';
    percentileBand = '40-75';
  } else if (tsb < p95) {
    riskZone = 'high-intermediate';
    percentileBand = '75-95';
  } else {
    riskZone = 'high';
    percentileBand = '>=95';
  }

  firedRules.push({
    id: `R-ZONE-${riskZone.toUpperCase()}-01`,
    category: 'zone-lookup',
    description:
      `TSB ${roundOne(tsb)} µmol/L at ${roundOne(ageClamped)} h vs tracks ` +
      `p40=${roundOne(p40)}, p75=${roundOne(p75)}, p95=${roundOne(p95)} µmol/L → ` +
      `${riskZone} zone (${percentileBand} percentile)`
  });

  // ─── (b) Threshold comparison ──────────────────────────────────
  const { phototherapy, exchange } = thresholds(band, ageClamped);
  const abovePhototherapy = tsb >= phototherapy;
  const aboveExchange = tsb >= exchange;

  firedRules.push({
    id: 'R-PHOTOTHERAPY-THRESHOLD-01',
    category: 'phototherapy-threshold',
    description:
      `Phototherapy threshold (${band}) at ${roundOne(ageClamped)} h = ` +
      `${roundOne(phototherapy)} µmol/L → TSB is ` +
      `${abovePhototherapy ? 'at or above' : 'below'} threshold`
  });
  firedRules.push({
    id: 'R-EXCHANGE-THRESHOLD-01',
    category: 'exchange-threshold',
    description:
      `Exchange-transfusion threshold (${band}) at ${roundOne(ageClamped)} h = ` +
      `${roundOne(exchange)} µmol/L → TSB is ` +
      `${aboveExchange ? 'at or above' : 'below'} threshold`
  });

  return {
    ageHours: roundOne(ageRaw),
    riskZone,
    percentileBand,
    p40: roundOne(p40),
    p75: roundOne(p75),
    p95: roundOne(p95),
    gestationBand: band,
    phototherapyThreshold: roundOne(phototherapy),
    exchangeThreshold: roundOne(exchange),
    abovePhototherapy,
    aboveExchange,
    outOfRange: !!outOfRange,
    firedRiskFactors: collectRiskFactors(data),
    firedRules,
    flaggedIssues: [],
    timestamp: new Date().toISOString()
  };
}

Object.assign(window.BhutaniBilirubinNomogram, {
  collectRiskFactors,
  gradeBhutani
});
})();
