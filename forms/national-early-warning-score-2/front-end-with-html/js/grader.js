// NEWS2 grader. Pure functions: take an `AssessmentData` object, score each
// parameter via the band tables in `rules.js`, sum the aggregate, apply the
// red-score rule, and derive the clinical-risk band with the RCP-recommended
// monitoring frequency and escalation response.
//
// Grading algorithm (spec §4):
//   1. Score each parameter to 0-3; spo2 uses Scale 1 / Scale 2 per context,
//      Scale 2 also depending on air/oxygen; oxygen weighting is 0 or 2;
//      consciousness scores 3 for any ACVPU value other than A (alert).
//   2. aggregate = sum of the six parameter subscores + the oxygen weighting.
//   3. redScore = true when any single parameter subscore == 3.
//   4. riskBand = worst (max-severity) of the aggregate band (0 / 1-4 / 5-6 /
//      >=7) and the red-score band (low-medium when redScore).
//   5. Unanswered parameters contribute 0 to the sum but mark the grade
//      incomplete; `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').Subscores} Subscores
 * @typedef {import('./types.js').FiredRule} FiredRule
 */

// Wrapped in an IIFE; published via window.NationalEarlyWarningScore2.
(function () {
'use strict';
window.NationalEarlyWarningScore2 = window.NationalEarlyWarningScore2 || {};
const NS = window.NationalEarlyWarningScore2;
const {
  scoreRespiratoryRate,
  scoreSpo2,
  scoreOxygen,
  scoreBloodPressure,
  scorePulse,
  scoreConsciousness,
  scoreTemperature
} = NS;

// Severity ranking so we can take the worst of two bands.
const BAND_SEVERITY = { 'low': 0, 'low-medium': 1, 'medium': 2, 'high': 3 };

/** The six scored physiological parameters (oxygen weighting excluded). */
const RED_SCORE_KEYS = [
  'respiratoryRate', 'spo2', 'systolicBp', 'pulse', 'consciousness', 'temperature'
];

/**
 * Compute the seven subscores for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {Subscores}
 */
function computeSubscores(data) {
  const scale = data.context.spo2Scale;
  const onOxygen = data.oxygenSupport.onOxygen;
  return {
    respiratoryRate: scoreRespiratoryRate(data.respiration.respiratoryRate),
    spo2: scoreSpo2(data.oxygenSaturation.spo2, scale, onOxygen),
    oxygen: scoreOxygen(onOxygen),
    systolicBp: scoreBloodPressure(data.bloodPressure.systolicBloodPressure),
    pulse: scorePulse(data.pulse.pulse),
    consciousness: scoreConsciousness(data.consciousness.consciousnessAcvpu),
    temperature: scoreTemperature(data.temperature.temperature)
  };
}

/**
 * Map the aggregate total to its band (ignoring the red-score escalation).
 * @param {number} aggregate
 * @returns {RiskBand}
 */
function aggregateBand(aggregate) {
  if (aggregate >= 7) return 'high';
  if (aggregate >= 5) return 'medium';
  return 'low'; // 0-4
}

/** Return the worse (higher-severity) of two bands. */
function worstBand(a, b) {
  return BAND_SEVERITY[a] >= BAND_SEVERITY[b] ? a : b;
}

/**
 * Monitoring frequency + recommendation for the final band. `aggregate` is
 * used only to distinguish the two low sub-cases (0 vs 1-4).
 * @param {RiskBand} band
 * @param {number} aggregate
 * @returns {{ monitoringFrequency: string, recommendation: string }}
 */
function response(band, aggregate) {
  switch (band) {
    case 'high':
      return {
        monitoringFrequency: 'Continuous monitoring of vital signs',
        recommendation:
          'Emergency assessment by a team with critical-care competencies, ' +
          'usually including a clinician able to manage the airway; consider ' +
          'transfer to a higher level of care.'
      };
    case 'medium':
      return {
        monitoringFrequency: 'Minimum 1-hourly',
        recommendation:
          'Urgent review by a clinician or team competent in the management ' +
          'of acute illness; consider higher-dependency care.'
      };
    case 'low-medium':
      return {
        monitoringFrequency: 'Minimum 1-hourly',
        recommendation:
          'Urgent review by a ward-based clinician to decide whether ' +
          'escalation of care is needed (single-parameter red score).'
      };
    case 'low':
    default:
      if (aggregate === 0) {
        return {
          monitoringFrequency: 'Minimum 12-hourly',
          recommendation: 'Continue routine NEWS2 monitoring.'
        };
      }
      return {
        monitoringFrequency: 'Minimum 4–6 hourly',
        recommendation:
          'Registered nurse to assess the patient and decide whether to ' +
          'increase the monitoring frequency and/or escalate clinical care.'
      };
  }
}

/**
 * Collect an audit row per parameter that contributed points, plus the
 * aggregate and (when present) red-score rows. Mirrors the grade_rule table.
 * @param {Subscores} s
 * @param {number} aggregate
 * @param {boolean} redScore
 * @param {RiskBand} band
 * @returns {FiredRule[]}
 */
function collectFiredRules(s, aggregate, redScore, band) {
  /** @type {FiredRule[]} */
  const fired = [];
  const rows = [
    ['R-RESP-RATE', 'respiratory-rate', s.respiratoryRate, 'respiration'],
    ['R-SPO2', 'spo2', s.spo2, 'oxygen-saturation'],
    ['R-OXYGEN', 'oxygen', s.oxygen, 'supplemental-oxygen'],
    ['R-BLOOD-PRESSURE', 'blood-pressure', s.systolicBp, 'blood-pressure'],
    ['R-PULSE', 'pulse', s.pulse, 'pulse'],
    ['R-CONSCIOUSNESS', 'consciousness', s.consciousness, 'consciousness'],
    ['R-TEMPERATURE', 'temperature', s.temperature, 'temperature']
  ];
  for (const [idBase, instrument, points, category] of rows) {
    if (points === null || points === 0) continue;
    fired.push({
      id: `${idBase}-${points}-01`,
      instrument,
      band: points === 3 ? 'low-medium' : '',
      points,
      category,
      description: `${instrument} scored ${points}`
    });
  }
  if (redScore) {
    fired.push({
      id: 'R-RED-SCORE-01',
      instrument: 'red-score',
      band: 'low-medium',
      points: 3,
      category: 'single-parameter-3',
      description: 'A single parameter scored 3 (red score) — escalate to at least low-medium.'
    });
  }
  fired.push({
    id: 'R-AGGREGATE-01',
    instrument: 'aggregate',
    band,
    points: aggregate,
    category: 'aggregate',
    description: `Aggregate NEWS2 total ${aggregate} — ${band} band.`
  });
  return fired;
}

/**
 * Compute the full NEWS2 grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ subscores: Subscores, aggregate: number, redScore: boolean,
 *             riskBand: RiskBand, monitoringFrequency: string,
 *             recommendation: string, complete: boolean, firedRules: FiredRule[] }}
 */
function gradeNews2(data) {
  const subscores = computeSubscores(data);

  // Aggregate = sum of the six parameter subscores + oxygen weighting.
  // Nulls (unrecorded) contribute 0 to the sum.
  const aggregate =
    (subscores.respiratoryRate || 0) +
    (subscores.spo2 || 0) +
    (subscores.oxygen || 0) +
    (subscores.systolicBp || 0) +
    (subscores.pulse || 0) +
    (subscores.consciousness || 0) +
    (subscores.temperature || 0);

  const redScore = RED_SCORE_KEYS.some((k) => subscores[k] === 3);

  const aggBand = aggregateBand(aggregate);
  const redBand = redScore ? 'low-medium' : 'low';
  const riskBand = worstBand(aggBand, redBand);

  const { monitoringFrequency, recommendation } = response(riskBand, aggregate);

  // Complete when every scored parameter has a value (oxygen weighting is
  // always defined; onOxygen '' scores 0 but counts as unanswered).
  const complete =
    subscores.respiratoryRate !== null &&
    subscores.spo2 !== null &&
    data.oxygenSupport.onOxygen !== '' &&
    subscores.systolicBp !== null &&
    subscores.pulse !== null &&
    subscores.consciousness !== null &&
    subscores.temperature !== null;

  const firedRules = collectFiredRules(subscores, aggregate, redScore, riskBand);

  return {
    subscores,
    aggregate,
    redScore,
    riskBand,
    monitoringFrequency,
    recommendation,
    complete,
    firedRules
  };
}

Object.assign(window.NationalEarlyWarningScore2, {
  computeSubscores,
  aggregateBand,
  worstBand,
  gradeNews2
});
})();
