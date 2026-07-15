import { qsofaRules } from './rules.js';

// qSOFA grader. Pure functions: take an `AssessmentData` object, evaluate the
// three criterion rules in `qsofaRules`, award 0 or 1 point each, sum the total
// (0-3), and derive the risk band with the >= 2 escalation threshold.
//
// Grading algorithm (spec §4):
//   respiratoryRatePoint       = respiratoryRate      != null && >= 22  ? 1 : 0
//   mentationPoint             = (GCS != null && GCS < 15) || altered=='yes' ? 1 : 0
//   systolicBloodPressurePoint = systolicBloodPressure != null && <= 100 ? 1 : 0
//   qsofaScore = sum (0..3)
//   riskBand   = qsofaScore >= 2 ? 'higher' : 'lower'
//
// A missing numeric input contributes 0 points for that criterion (absent, not
// positive); `flags.js` raises a data-completeness flag separately.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').RiskBand} RiskBand
 * @typedef {import('./types.js').FiredCriterion} FiredCriterion
 */

// Wrapped in an IIFE; published via window.QuickSequentialOrganFailureAssessment.

/**
 * Evaluate the three qSOFA criterion rules and collect the ones that fired.
 * @param {AssessmentData} data
 * @returns {FiredCriterion[]}
 */
function evaluateCriteria(data) {
  /** @type {FiredCriterion[]} */
  const fired = [];
  for (const rule of qsofaRules) {
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
      console.warn(`qSOFA rule ${rule.id} evaluation failed:`, e);
    }
  }
  return fired;
}

/**
 * Compute the full qSOFA grade for the supplied assessment data.
 * @param {AssessmentData} data
 * @returns {{ respiratoryRatePoint: 0|1, mentationPoint: 0|1,
 *             systolicBloodPressurePoint: 0|1, qsofaScore: 0|1|2|3,
 *             riskBand: RiskBand, thresholdMet: ('yes'|'no'),
 *             firedCriteria: FiredCriterion[] }}
 */
function calculateQsofaGrade(data) {
  const firedCriteria = evaluateCriteria(data);
  const has = (criterion) =>
    firedCriteria.some((f) => f.criterion === criterion);

  const respiratoryRatePoint = has('respiratory-rate') ? 1 : 0;
  const mentationPoint = has('mentation') ? 1 : 0;
  const systolicBloodPressurePoint = has('systolic-blood-pressure') ? 1 : 0;

  const qsofaScore =
    respiratoryRatePoint + mentationPoint + systolicBloodPressurePoint;

  /** @type {RiskBand} */
  const riskBand = qsofaScore >= 2 ? 'higher' : 'lower';
  const thresholdMet = qsofaScore >= 2 ? 'yes' : 'no';

  // Record the derived risk-band decision as a `band` audit row, mirroring the
  // grade_rule table's `band` criterion.
  firedCriteria.push({
    id: 'R-BAND-01',
    criterion: 'band',
    points: 0,
    category: 'risk-band',
    description:
      qsofaScore >= 2
        ? 'qSOFA >= 2 — positive screen; higher risk band'
        : 'qSOFA < 2 — negative screen; lower risk band'
  });

  return {
    respiratoryRatePoint,
    mentationPoint,
    systolicBloodPressurePoint,
    qsofaScore,
    riskBand,
    thresholdMet,
    firedCriteria
  };
}

export { evaluateCriteria, calculateQsofaGrade };
