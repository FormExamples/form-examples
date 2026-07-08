// BLS Skills Verification grader. Pure functions: take an `AssessmentData`
// object, evaluate each declarative rule in the registry, and return the
// pass/fail outcome plus the audit trail of fired rules.
//
// AHA pass/fail logic:
//   - Any critical-action rule firing 'no' -> overall Fail.
//   - More than two non-critical 'no' deficiencies -> Fail.
//   - Otherwise -> Pass.
//   - Items the examiner has not assessed ('na' or '') do not count as
//     deficiencies.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Outcome} Outcome
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').TriState} TriState
 */

(function () {
'use strict';
window.CardiopulmonaryResuscitationTraining =
  window.CardiopulmonaryResuscitationTraining || {};

const NS = window.CardiopulmonaryResuscitationTraining;
const { blsRules } = NS;

const NON_CRITICAL_DEFICIENCY_LIMIT = 2;

/**
 * Evaluate every BLS rule in the registry, classify the outcome, and return
 * the audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   outcome: Outcome,
 *   criticalFailures: FiredRule[],
 *   nonCriticalDeficiencies: FiredRule[],
 *   firedRules: FiredRule[],
 *   answeredCount: number,
 *   totalRules: number
 * }}
 */
function gradeBLS(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {FiredRule[]} */
  const criticalFailures = [];
  /** @type {FiredRule[]} */
  const nonCriticalDeficiencies = [];
  let answeredCount = 0;

  for (const rule of blsRules) {
    let status = '';
    try {
      status = rule.evaluate(data);
    } catch (e) {
      console.warn(`BLS rule ${rule.id} evaluation failed:`, e);
      status = '';
    }

    /** @type {FiredRule} */
    const entry = {
      id: rule.id,
      step: rule.step,
      category: rule.category,
      description: rule.label,
      critical: rule.critical,
      status
    };
    firedRules.push(entry);

    if (status === 'yes' || status === 'no') answeredCount++;

    if (status === 'no') {
      if (rule.critical) {
        criticalFailures.push(entry);
      } else {
        nonCriticalDeficiencies.push(entry);
      }
    }
  }

  /** @type {Outcome} */
  let outcome = '';
  if (criticalFailures.length > 0) {
    outcome = 'fail';
  } else if (nonCriticalDeficiencies.length > NON_CRITICAL_DEFICIENCY_LIMIT) {
    outcome = 'fail';
  } else if (answeredCount === 0) {
    // Nothing assessed yet — surface a neutral "fail" on submission so the
    // examiner is prompted to actually mark items, but don't claim success.
    outcome = 'fail';
  } else {
    outcome = 'pass';
  }

  return {
    outcome,
    criticalFailures,
    nonCriticalDeficiencies,
    firedRules,
    answeredCount,
    totalRules: blsRules.length
  };
}

Object.assign(NS, {
  gradeBLS,
  NON_CRITICAL_DEFICIENCY_LIMIT
});
})();
