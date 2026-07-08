// NREMT EMT Psychomotor Skills Examination grader. Pure functions: take an
// `AssessmentData` object, evaluate every declarative rule in the registry,
// and return the pass/fail outcome plus the audit trail of fired rules.
//
// NREMT pass/fail logic:
//   - Any critical-criterion rule firing 'no' -> automatic Fail.
//   - Else, points awarded < PASS_PERCENT_THRESHOLD% of maxPoints -> Fail.
//   - Else -> Pass.
//
// Scoring details:
//   - 'yes' awards the rule's `points`; counts toward maxPoints.
//   - 'no'  awards 0;                  counts toward maxPoints.
//   - 'na'  is excluded from both numerator and denominator.
//   - ''    (unanswered) is excluded from both numerator and denominator.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Outcome} Outcome
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').TriState} TriState
 */

(function () {
'use strict';
window.EmergencyMedicalTechnicianPsychomotorExamination =
  window.EmergencyMedicalTechnicianPsychomotorExamination || {};

const NS = window.EmergencyMedicalTechnicianPsychomotorExamination;
const { psychomotorRules, PASS_PERCENT_THRESHOLD } = NS;

/**
 * Evaluate every psychomotor rule, classify the outcome, and return the
 * audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   outcome: Outcome,
 *   points: number,
 *   maxPoints: number,
 *   percent: number,
 *   criticalFailures: FiredRule[],
 *   firedRules: FiredRule[],
 *   answeredCount: number,
 *   totalRules: number
 * }}
 */
function gradePsychomotor(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {FiredRule[]} */
  const criticalFailures = [];
  let points = 0;
  let maxPoints = 0;
  let answeredCount = 0;

  for (const rule of psychomotorRules) {
    let status = '';
    try {
      status = rule.evaluate(data);
    } catch (e) {
      console.warn(`Psychomotor rule ${rule.id} evaluation failed:`, e);
      status = '';
    }

    let pointsAwarded = 0;
    if (status === 'yes') {
      pointsAwarded = rule.points;
      points += rule.points;
      maxPoints += rule.points;
      answeredCount++;
    } else if (status === 'no') {
      pointsAwarded = 0;
      maxPoints += rule.points;
      answeredCount++;
    }
    // 'na' and '' are excluded entirely.

    /** @type {FiredRule} */
    const entry = {
      id: rule.id,
      step: rule.step,
      category: rule.category,
      description: rule.label,
      critical: rule.critical,
      points: rule.points,
      status,
      pointsAwarded
    };
    firedRules.push(entry);

    if (status === 'no' && rule.critical) {
      criticalFailures.push(entry);
    }
  }

  const percent = maxPoints > 0 ? (points / maxPoints) * 100 : 0;

  /** @type {Outcome} */
  let outcome = '';
  if (criticalFailures.length > 0) {
    outcome = 'fail';
  } else if (answeredCount === 0) {
    // Nothing assessed yet — surface a neutral "fail" on submission so the
    // examiner is prompted to actually mark items, but don't claim success.
    outcome = 'fail';
  } else if (percent < PASS_PERCENT_THRESHOLD) {
    outcome = 'fail';
  } else {
    outcome = 'pass';
  }

  return {
    outcome,
    points,
    maxPoints,
    percent,
    criticalFailures,
    firedRules,
    answeredCount,
    totalRules: psychomotorRules.length
  };
}

Object.assign(NS, {
  gradePsychomotor
});
})();
