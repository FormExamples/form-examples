// First Aid at Work (FAW) Competency grader. Pure functions: take an
// `AssessmentData` object, evaluate each declarative rule in the registry,
// and return the pass / needs-development / fail outcome plus the audit
// trail of fired rules.
//
// HSE / St John outcome logic:
//   - Any critical-skill rule firing 'no' -> overall Fail.
//   - 3 or more non-critical 'no' deficiencies -> Fail.
//   - 1 or 2 non-critical 'no' deficiencies   -> Needs Development.
//   - Otherwise (no deficiencies, at least one assessed) -> Pass.
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
window.FirstAidTrainingChecklist =
  window.FirstAidTrainingChecklist || {};

const NS = window.FirstAidTrainingChecklist;
const { fawRules } = NS;

const NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT = 2;

/**
 * Evaluate every FAW rule in the registry, classify the outcome, and return
 * the audit trail.
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
function gradeFirstAid(data) {
  /** @type {FiredRule[]} */
  const firedRules = [];
  /** @type {FiredRule[]} */
  const criticalFailures = [];
  /** @type {FiredRule[]} */
  const deficiencies = [];
  let answeredCount = 0;

  for (const rule of fawRules) {
    let status = '';
    try {
      status = rule.evaluate(data);
    } catch (e) {
      console.warn(`FAW rule ${rule.id} evaluation failed:`, e);
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
  } else if (deficiencies.length > NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT) {
    outcome = 'fail';
  } else if (deficiencies.length >= 1) {
    outcome = 'needs-development';
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
    deficiencies,
    firedRules,
    answeredCount,
    totalRules: fawRules.length
  };
}

Object.assign(NS, {
  gradeFirstAid,
  NEEDS_DEVELOPMENT_DEFICIENCY_LIMIT
});
})();
