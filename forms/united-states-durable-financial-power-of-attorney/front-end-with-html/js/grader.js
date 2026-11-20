import { executionRiskRules, incompleteRules, ruleFor, stateUnknown } from './rules.js';

// United States durable financial power of attorney readiness grader. Pure
// functions: take a `PowerOfAttorney`, evaluate the governing state's execution
// rule, and assign exactly one validity class. It makes NO legal judgement; the
// statute, the notary, and a court decide. Documentation support, not legal
// advice.
//
// Algorithm (spec section 4), first matching class wins:
//   any execution risk (an ANSWERED item contradicts the state rule) -> 'execution-risk'
//   any core item unanswered                                         -> 'incomplete'
//   otherwise                                                        -> 'ready-to-execute'
//
// Unanswered items never create an execution risk; they create `incomplete`.

/**
 * @typedef {import('./types.js').PowerOfAttorney} PowerOfAttorney
 * @typedef {import('./types.js').ValidityClass} ValidityClass
 */

/**
 * Assign the single validity class (spec section 4).
 * @param {PowerOfAttorney} d
 * @returns {ValidityClass}
 */
function deriveValidityClass(d) {
  if (executionRiskRules(d).length > 0) return 'execution-risk';
  if (incompleteRules(d).length > 0) return 'incomplete';
  return 'ready-to-execute';
}

/**
 * Compute the readiness classification for the supplied instrument plan.
 * @param {PowerOfAttorney} d
 * @returns {{ validityClass: ValidityClass,
 *             governingState: string,
 *             executionRiskIndicated: boolean,
 *             firedRules: { ruleId: string, dimension: string, category: string, description: string }[] }}
 */
function validateInstrument(d) {
  const risks = executionRiskRules(d);
  const incompletes = incompleteRules(d);
  const firedRules = risks.concat(incompletes);
  if (stateUnknown(d)) {
    firedRules.push({ ruleId: 'R-JURISDICTION-01', dimension: 'jurisdiction', category: 'state-rule', description: 'The state is blank or not in the state-rule table; the uniform default is applied.' });
  }
  return {
    validityClass: deriveValidityClass(d),
    governingState: ruleFor(d).name,
    executionRiskIndicated: risks.length > 0,
    firedRules
  };
}

export { deriveValidityClass, validateInstrument };
