import type { Directive, ReadinessClass, ReadinessResult } from './types';
import { detectFlaggedIssues } from './flagged-issues';
import {
  agentIneligible,
  capacityDenied,
  hasExecutionDefect,
  missingRequired,
  principalMinor,
  stateRule
} from './rules';

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

function deriveReadinessClass(d: Directive): ReadinessClass {
  if (principalMinor(d) || capacityDenied(d) || agentIneligible(d) || hasExecutionDefect(d))
    return 'execution-risk';
  if (missingRequired(d).length > 0) return 'incomplete';
  return 'ready-to-execute';
}

/** Compute the readiness classification for the supplied directive. */
function gradeDirective(d: Directive): {
  readinessClass: ReadinessClass;
  ruleSetName: string;
  missingCount: number;
  executionRisk: boolean;
} {
  const readinessClass = deriveReadinessClass(d);
  return {
    readinessClass,
    ruleSetName: stateRule(d).name,
    missingCount: missingRequired(d).length,
    executionRisk: readinessClass === 'execution-risk'
  };
}

/** Grade a directive and detect its flagged issues: the full report result. */
function evaluateDirective(d: Directive): ReadinessResult {
  return {
    ...gradeDirective(d),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}

export { deriveReadinessClass, evaluateDirective, gradeDirective };
