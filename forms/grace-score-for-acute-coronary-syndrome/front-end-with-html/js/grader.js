import { AGE_BANDS, CARDIAC_ARREST_POINTS, CREATININE_BANDS, ELEVATED_ENZYMES_POINTS, HEART_RATE_BANDS, IN_HOSPITAL_THRESHOLDS, KILLIP_POINTS, SBP_BANDS, SIX_MONTH_THRESHOLDS, ST_DEVIATION_POINTS, bandForTotal, bandLookup, invasiveStrategyText, normaliseCreatinine, worseBand } from './rules.js';

// GRACE grader. Pure functions: take an `AssessmentData` object, map each of
// the eight admission variables through its weighted, banded point lookup (see
// `rules.js`), sum the points into the GRACE total, read that total against the
// in-hospital and 6-month mortality-band thresholds, and derive the overall
// risk category as the worse of the two bands (max-band rule).
//
// Grading algorithm (spec §4):
//   creatinine_mgdl = umol/L ? value / 88.4 : value
//   agePoints        = bandLookup(ageYears,    AGE_BANDS)
//   heartRatePoints  = bandLookup(heartRate,   HEART_RATE_BANDS)
//   sbpPoints        = bandLookup(systolicBP,  SBP_BANDS)          // inverse table
//   creatininePoints = bandLookup(creatinine_mgdl, CREATININE_BANDS)
//   killipPoints     = KILLIP_POINTS[killipClass]
//   arrestPoints     = cardiacArrestAtAdmission == 'yes' ? 39 : 0
//   stPoints         = stSegmentDeviation      == 'yes' ? 28 : 0
//   enzymePoints     = elevatedCardiacEnzymes  == 'yes' ? 14 : 0
//   gracePoints = sum of the above
//   inHospitalMortalityBand = bandForTotal(gracePoints, {108, 140})
//   sixMonthMortalityBand   = bandForTotal(gracePoints, { 88, 118})
//   riskCategory = worseOf(inHospital, sixMonth)
//
// A missing numeric input contributes 0 points for that variable (absent, not
// zero-risk); `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredContributor} FiredContributor
 */

// Wrapped in an IIFE; published via window.GraceScoreForAcuteCoronarySyndrome.

/**
 * Compute the full GRACE grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {import('./types.js').GradingResult} (without flaggedIssues/timestamp,
 *   which the caller merges in)
 */
function calculateGraceGrade(data) {
  const ageYears = data.identification.ageYears;
  const heartRate = data.haemodynamics.heartRate;
  const systolicBP = data.haemodynamics.systolicBloodPressure;
  const creatinineMgdl = normaliseCreatinine(
    data.renal.serumCreatinine,
    data.renal.serumCreatinineUnit
  );
  const killipClass = data.heartFailure.killipClass;
  const arrest = data.highRiskFeatures.cardiacArrestAtAdmission;
  const stDeviation = data.highRiskFeatures.stSegmentDeviation;
  const enzymes = data.highRiskFeatures.elevatedCardiacEnzymes;

  const age = bandLookup(ageYears, AGE_BANDS);
  const hr = bandLookup(heartRate, HEART_RATE_BANDS);
  const sbp = bandLookup(systolicBP, SBP_BANDS);
  const creat = bandLookup(creatinineMgdl, CREATININE_BANDS);

  const agePoints = age.points;
  const heartRatePoints = hr.points;
  const sbpPoints = sbp.points;
  const creatininePoints = creat.points;
  const killipPoints = KILLIP_POINTS[killipClass] || 0;
  const arrestPoints = arrest === 'yes' ? CARDIAC_ARREST_POINTS : 0;
  const stPoints = stDeviation === 'yes' ? ST_DEVIATION_POINTS : 0;
  const enzymePoints = enzymes === 'yes' ? ELEVATED_ENZYMES_POINTS : 0;

  const gracePoints =
    agePoints + heartRatePoints + sbpPoints + creatininePoints +
    killipPoints + arrestPoints + stPoints + enzymePoints;

  /** @type {RiskBand} */
  const inHospitalMortalityBand = bandForTotal(gracePoints, IN_HOSPITAL_THRESHOLDS);
  /** @type {RiskBand} */
  const sixMonthMortalityBand = bandForTotal(gracePoints, SIX_MONTH_THRESHOLDS);
  /** @type {RiskBand} */
  const riskCategory = worseBand(inHospitalMortalityBand, sixMonthMortalityBand);
  const invasiveStrategy = invasiveStrategyText(riskCategory);

  // Per-variable audit rows (mirror the grade_rule table). Only variables that
  // contribute points, or the yes/no contributors when present, are recorded.
  /** @type {FiredContributor[]} */
  const firedContributors = [
    { id: 'R-AGE-01', variable: 'age', points: agePoints, category: 'grace-variable',
      description: `Age band ${age.label} years` },
    { id: 'R-HEART-RATE-01', variable: 'heart-rate', points: heartRatePoints, category: 'grace-variable',
      description: `Heart rate band ${hr.label} beats/min` },
    { id: 'R-SYSTOLIC-BLOOD-PRESSURE-01', variable: 'systolic-blood-pressure', points: sbpPoints, category: 'grace-variable',
      description: `Systolic BP band ${sbp.label} mmHg (inverse weight)` },
    { id: 'R-CREATININE-01', variable: 'creatinine', points: creatininePoints, category: 'grace-variable',
      description: `Serum creatinine band ${creat.label} mg/dL` },
    { id: 'R-KILLIP-01', variable: 'killip', points: killipPoints, category: 'grace-variable',
      description: `Killip class ${killipClass || 'not recorded'}` }
  ];
  if (arrestPoints > 0) {
    firedContributors.push({ id: 'R-CARDIAC-ARREST-01', variable: 'cardiac-arrest',
      points: arrestPoints, category: 'grace-variable', description: 'Cardiac arrest at admission' });
  }
  if (stPoints > 0) {
    firedContributors.push({ id: 'R-ST-DEVIATION-01', variable: 'st-deviation',
      points: stPoints, category: 'grace-variable', description: 'ST-segment deviation on admission ECG' });
  }
  if (enzymePoints > 0) {
    firedContributors.push({ id: 'R-ELEVATED-ENZYMES-01', variable: 'elevated-enzymes',
      points: enzymePoints, category: 'grace-variable', description: 'Elevated cardiac enzymes / troponin' });
  }

  // Record the derived risk-category decision as a `band` audit row.
  firedContributors.push({
    id: 'R-BAND-01',
    variable: 'band',
    points: 0,
    category: 'risk-band',
    description:
      `GRACE ${gracePoints} — in-hospital ${inHospitalMortalityBand}, ` +
      `6-month ${sixMonthMortalityBand}; overall ${riskCategory} (worse band).`
  });

  return {
    agePoints,
    heartRatePoints,
    sbpPoints,
    creatininePoints,
    killipPoints,
    arrestPoints,
    stPoints,
    enzymePoints,
    gracePoints,
    inHospitalMortalityBand,
    sixMonthMortalityBand,
    riskCategory,
    invasiveStrategy,
    firedContributors
  };
}

export { calculateGraceGrade };
