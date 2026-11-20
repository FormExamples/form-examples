import { agentIneligible, capacityDenied, hasExecutionDefect, missingRequired, principalMinor, stateRule } from './rules.js';

// United States health care power of attorney readiness grader. Pure functions:
// take a `Directive` object, evaluate execution risks and completeness, and
// assign exactly one class. It gives NO legal advice; the court, the facility,
// and the state decide whether a directive is valid.
//
// Algorithm (spec section 4), first matching class wins:
//   principalMinor || capacityDenied || agentIneligible || hasExecutionDefect
//                                         -> 'execution-risk'
//   missingRequired.length > 0           -> 'incomplete'
//   otherwise                            -> 'ready-to-execute'
//
// `execution-risk` takes precedence over incompleteness: a defect that could
// invalidate the document must be fixed before anyone signs, however complete
// the rest is.

/**
 * @typedef {import('./types.js').Directive} Directive
 * @typedef {import('./types.js').ReadinessClass} ReadinessClass
 */

/**
 * @param {Directive} d
 * @returns {ReadinessClass}
 */
function deriveReadinessClass(d) {
  if (principalMinor(d) || capacityDenied(d) || agentIneligible(d) || hasExecutionDefect(d)) return 'execution-risk';
  if (missingRequired(d).length > 0) return 'incomplete';
  return 'ready-to-execute';
}

/**
 * Compute the readiness classification for the supplied directive.
 * @param {Directive} d
 * @returns {{ readinessClass: ReadinessClass, ruleSetName: string, missingCount: number, executionRisk: boolean }}
 */
function gradeDirective(d) {
  const readinessClass = deriveReadinessClass(d);
  return {
    readinessClass,
    ruleSetName: stateRule(d).name,
    missingCount: missingRequired(d).length,
    executionRisk: readinessClass === 'execution-risk'
  };
}

export { deriveReadinessClass, gradeDirective };
