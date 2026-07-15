import { lifeguardRules } from './rules.js';

// Lifeguard Competency Verification grader. Pure functions: take an
// `AssessmentData` object, evaluate each declarative rule in the registry,
// and return the outcome plus the audit trail of fired rules.
//
// RLSS UK NPLQ outcome logic:
//   - Any critical-competency rule firing 'no' -> overall Fail.
//   - With no critical failures, 1-2 non-critical 'no' deficiencies ->
//     Needs Development.
//   - With no critical failures and >2 non-critical deficiencies ->
//     Needs Development as well (RLSS allows the candidate to remediate
//     and re-present rather than outright Fail when no critical breach).
//     This examiner tool surfaces the high-deficiency case as a flag for
//     the examiner to review and override if appropriate.
//   - With no critical failures and 0 deficiencies -> Pass.
//   - Items the examiner has not assessed ('na' or '') do not count as
//     deficiencies.

/**
 * @typedef {import('./types.js').AssessmentData} AssessmentData
 * @typedef {import('./types.js').Outcome} Outcome
 * @typedef {import('./types.js').FiredRule} FiredRule
 * @typedef {import('./types.js').TriState} TriState
 */

const DEFICIENCY_LIMIT_FOR_PASS = 0;
const DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT = 2;

/**
 * Evaluate every lifeguard rule in the registry, classify the outcome, and
 * return the audit trail.
 *
 * @param {AssessmentData} data
 * @returns {{
 *   outcome: Outcome,
 *   criticalFailures: FiredRule[],
 *   deficiencies: FiredRule[],
 *   firedRules: FiredRule[],
 *   answeredCount: number,
 *   totalRules: number
 * }}
 */
function gradeLifeguard(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {FiredRule[]} */
  const criticalFailures = [];
  /** @type {FiredRule[]} */
  const deficiencies = [];
  let answeredCount = 0;

  for (const rule of lifeguardRules) {
    let status = '';
    try {
      status = rule.evaluate(data);
    } catch (e) {
      console.warn(`Lifeguard rule ${rule.id} evaluation failed:`, e);
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
        deficiencies.push(entry);
      }
    }
  }

  /** @type {Outcome} */
  let outcome = '';
  if (criticalFailures.length > 0) {
    outcome = 'fail';
  } else if (answeredCount === 0) {
    // Nothing assessed yet — surface a neutral "fail" on submission so the
    // examiner is prompted to actually mark items, but don't claim success.
    outcome = 'fail';
  } else if (deficiencies.length === DEFICIENCY_LIMIT_FOR_PASS) {
    outcome = 'pass';
  } else if (deficiencies.length <= DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT) {
    outcome = 'needs-development';
  } else {
    // More than two non-critical deficiencies but no critical breach: the
    // candidate needs significant development before recertification.
    outcome = 'needs-development';
  }

  return {
    outcome,
    criticalFailures,
    deficiencies,
    firedRules,
    answeredCount,
    totalRules: lifeguardRules.length
  };
}

export { gradeLifeguard, DEFICIENCY_LIMIT_FOR_PASS, DEFICIENCY_LIMIT_FOR_NEEDS_DEVELOPMENT };
