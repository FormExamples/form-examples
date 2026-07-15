import { scoreCapillaryRefill, scoreConsciousness, scoreHeartRate, scoreOxygenSaturation, scoreRespiratoryEffort, scoreRespiratoryRate, scoreSupplementalOxygen } from './rules.js';

// PEWS grader. Pure functions: take an `AssessmentData` object, score each
// parameter via the band tables in `rules.js` (the two rate parameters against
// the selected age band), sum the aggregate, take the maximum single-parameter
// sub-score, and derive the escalation band with the recommended monitoring
// frequency and escalation response.
//
// Grading algorithm (spec §4):
//   1. Resolve the age-band normal ranges and score respiratoryRate + heartRate
//      0-3 against them; score the remaining five parameters 0-3 from their
//      enum / numeric value.
//   2. aggregateScore   = sum of the seven parameter sub-scores (nulls -> 0).
//      maxParameterScore = max of the seven sub-scores.
//   3. escalationBand from the aggregate: >=6 high, 4-5 medium, 2-3 low, else
//      routine.
//   4. Override triggers do NOT change the aggregate but raise the effective
//      escalation: maxParameterScore == 3 -> at least medium (urgent review);
//      nurse/parent concern -> escalation triggers in their own right.
//   5. Unanswered parameters contribute 0 to the sum but mark the grade
//      incomplete; `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').EscalationBand} EscalationBand
 * @typedef {import('./types.js').Subscores} Subscores
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').FiredTrigger} FiredTrigger
 */

// Severity ranking so we can take the worst of two bands.
const BAND_SEVERITY = { 'routine': 0, 'low': 1, 'medium': 2, 'high': 3 };

// The seven scored parameters, in report order.
const PARAMETER_KEYS = [
  'respiratoryRate', 'respiratoryEffort', 'oxygenSaturation',
  'supplementalOxygen', 'heartRate', 'capillaryRefill', 'consciousness'
];

/**
 * Compute the seven subscores for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {Subscores}
 */
function computeSubscores(data) {
  const ageBand = data.identification.ageBand;
  return {
    respiratoryRate: scoreRespiratoryRate(data.respiratory.respiratoryRate, ageBand),
    respiratoryEffort: scoreRespiratoryEffort(data.respiratory.respiratoryEffort),
    oxygenSaturation: scoreOxygenSaturation(data.respiratory.oxygenSaturation),
    supplementalOxygen: scoreSupplementalOxygen(data.respiratory.supplementalOxygen),
    heartRate: scoreHeartRate(data.cardiovascular.heartRate, ageBand),
    capillaryRefill: scoreCapillaryRefill(data.cardiovascular.capillaryRefill),
    consciousness: scoreConsciousness(data.behaviour.consciousness)
  };
}

/**
 * Map the aggregate total to its escalation band (ignoring override triggers).
 * @param {number} aggregate
 * @returns {EscalationBand}
 */
function aggregateBand(aggregate) {
  if (aggregate >= 6) return 'high';
  if (aggregate >= 4) return 'medium';
  if (aggregate >= 2) return 'low';
  return 'routine';
}

/** Return the worse (higher-severity) of two bands. */
function worstBand(a, b) {
  return BAND_SEVERITY[a] >= BAND_SEVERITY[b] ? a : b;
}

/**
 * Monitoring frequency + recommendation for the final escalation band.
 * @param {EscalationBand} band
 * @returns {{ monitoringFrequency: string, recommendation: string }}
 */
function response(band) {
  switch (band) {
    case 'high':
      return {
        monitoringFrequency: 'Continuous monitoring',
        recommendation:
          'Immediate review by a senior doctor / registrar; consider ' +
          'critical-care outreach; continuous monitoring of vital signs.'
      };
    case 'medium':
      return {
        monitoringFrequency: 'Continuous monitoring',
        recommendation:
          'Urgent review by the nurse in charge and a doctor within 30 ' +
          'minutes; continuous monitoring; consider outreach.'
      };
    case 'low':
      return {
        monitoringFrequency: 'Minimum hourly',
        recommendation:
          'Increase observation frequency (e.g. hourly); inform the nurse in ' +
          'charge; clinical review within 1 hour.'
      };
    case 'routine':
    default:
      return {
        monitoringFrequency: 'Routine (e.g. 4-hourly)',
        recommendation:
          'Continue routine observations at the scheduled frequency ' +
          '(e.g. 4-hourly).'
      };
  }
}

/**
 * Collect an audit row per parameter that contributed points, plus the
 * aggregate, single-parameter, and concern rows. Mirrors the grade_rule table.
 * @param {Subscores} s
 * @param {AssessmentData} data
 * @param {number} aggregate
 * @param {number} maxParameter
 * @param {EscalationBand} band
 * @returns {FiredRule[]}
 */
function collectFiredRules(s, data, aggregate, maxParameter, band) {
  /** @type {FiredRule[]} */
  const fired = [];
  const rows = [
    ['R-RESP-RATE', 'respiratory-rate', s.respiratoryRate, 'respiratory-rate'],
    ['R-RESP-EFFORT', 'respiratory-effort', s.respiratoryEffort, 'respiratory-effort'],
    ['R-SPO2', 'oxygen-saturation', s.oxygenSaturation, 'hypoxia'],
    ['R-OXYGEN', 'supplemental-oxygen', s.supplementalOxygen, 'supplemental-oxygen'],
    ['R-HEART-RATE', 'heart-rate', s.heartRate, 'heart-rate'],
    ['R-CAP-REFILL', 'capillary-refill', s.capillaryRefill, 'prolonged-refill'],
    ['R-CONSCIOUSNESS', 'consciousness', s.consciousness, 'reduced-consciousness']
  ];
  for (const [idBase, instrument, points, category] of rows) {
    if (points === null || points === 0) continue;
    fired.push({
      id: `${idBase}-${points}-01`,
      instrument,
      band: points === 3 ? 'medium' : '',
      points,
      category,
      description: `${instrument} scored ${points}`
    });
  }
  if (maxParameter === 3) {
    fired.push({
      id: 'R-SINGLE-PARAMETER-3-01',
      instrument: 'single-parameter',
      band: 'medium',
      points: 3,
      category: 'single-parameter',
      description: 'A single parameter scored 3 — escalate to at least medium regardless of the aggregate total.'
    });
  }
  if (data.concern.nurseConcern === 'yes') {
    fired.push({
      id: 'R-NURSE-CONCERN-01',
      instrument: 'concern',
      band: '',
      points: null,
      category: 'nurse-concern',
      description: 'Documented nurse / staff concern — an independent escalation trigger.'
    });
  }
  if (data.concern.parentConcern === 'yes') {
    fired.push({
      id: 'R-PARENT-CONCERN-01',
      instrument: 'concern',
      band: '',
      points: null,
      category: 'parent-concern',
      description: 'Documented parent / carer concern — an independent escalation trigger.'
    });
  }
  fired.push({
    id: 'R-AGGREGATE-01',
    instrument: 'aggregate',
    band,
    points: aggregate,
    category: 'aggregate',
    description: `Aggregate PEWS total ${aggregate} — ${band} escalation band.`
  });
  return fired;
}

/**
 * Collect the override triggers that fired (independent of the aggregate).
 * @param {AssessmentData} data
 * @param {number} maxParameter
 * @returns {FiredTrigger[]}
 */
function collectFiredTriggers(data, maxParameter) {
  /** @type {FiredTrigger[]} */
  const triggers = [];
  if (maxParameter === 3) {
    triggers.push({
      id: 'T-SINGLE-PARAMETER-3',
      category: 'single-parameter',
      description: 'Single parameter scored 3 — urgent review (at least medium escalation) regardless of the total.'
    });
  }
  if (data.concern.nurseConcern === 'yes') {
    triggers.push({
      id: 'T-NURSE-CONCERN',
      category: 'nurse-concern',
      description: 'Documented nurse / staff concern.'
    });
  }
  if (data.concern.parentConcern === 'yes') {
    triggers.push({
      id: 'T-PARENT-CONCERN',
      category: 'parent-concern',
      description: 'Documented parent / carer concern.'
    });
  }
  return triggers;
}

/**
 * Compute the full PEWS grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {import('./types.js').GradingResult}
 */
function gradePews(data) {
  const subscores = computeSubscores(data);

  // Aggregate = sum of the seven parameter subscores. Nulls (unrecorded, or a
  // rate parameter with no age band) contribute 0 to the sum.
  const aggregateScore = PARAMETER_KEYS.reduce(
    (sum, k) => sum + (subscores[k] || 0),
    0
  );

  // Maximum single-parameter sub-score (nulls treated as 0).
  const maxParameterScore = PARAMETER_KEYS.reduce(
    (max, k) => Math.max(max, subscores[k] || 0),
    0
  );

  const singleParameterTrigger = maxParameterScore === 3;

  // Override trigger: a single parameter scoring 3 raises the effective
  // escalation to at least medium.
  const aggBand = aggregateBand(aggregateScore);
  const triggerBand = singleParameterTrigger ? 'medium' : 'routine';
  const escalationBand = worstBand(aggBand, triggerBand);

  const { monitoringFrequency, recommendation } = response(escalationBand);

  // Complete when every parameter has a value and the age band is set.
  const complete =
    data.identification.ageBand !== '' &&
    subscores.respiratoryRate !== null &&
    subscores.respiratoryEffort !== null &&
    subscores.oxygenSaturation !== null &&
    subscores.supplementalOxygen !== null &&
    subscores.heartRate !== null &&
    subscores.capillaryRefill !== null &&
    subscores.consciousness !== null;

  const firedRules = collectFiredRules(
    subscores, data, aggregateScore, maxParameterScore, escalationBand
  );
  const firedTriggers = collectFiredTriggers(data, maxParameterScore);

  return {
    subscores,
    aggregateScore,
    maxParameterScore,
    singleParameterTrigger,
    escalationBand,
    monitoringFrequency,
    recommendation,
    complete,
    firedRules,
    firedTriggers,
    flaggedIssues: [],
    timestamp: ''
  };
}

export { computeSubscores, aggregateBand, worstBand, gradePews, PARAMETER_KEYS };
