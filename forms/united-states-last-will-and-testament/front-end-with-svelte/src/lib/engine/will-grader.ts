import type { ValidationResult, ValidityClass, Will } from './types';
import {
  electiveShareAmount,
  federalEstateTaxExposure,
  missingItems,
  residuaryPercentTotal,
  selfProved,
  stateRuleFor,
  witnessCount
} from './will-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * United States Last Will and Testament validity grader. Pure functions: take a
 * `Will`, evaluate the formality, capacity, witness and bequest rules for the
 * testator's state, and assign exactly one validity class. It gives no legal
 * advice; the probate court decides whether a will is valid.
 *
 * Algorithm (spec section 4), first matching class wins:
 *   any HIGH flag                -> 'formality-risk'
 *   any required answer missing  -> 'incomplete'
 *   otherwise                    -> 'valid-ready-to-execute'
 *
 * `formality-risk` takes precedence over `incomplete`: a plan with a known
 * defect should not be signed however complete the rest is.
 */

/** Assign the single validity class (spec section 4). */
export function deriveValidityClass(w: Will): ValidityClass {
  if (detectFlaggedIssues(w).some((f) => f.priority === 'high')) return 'formality-risk';
  if (missingItems(w).length > 0) return 'incomplete';
  return 'valid-ready-to-execute';
}

/** Compute the full validity classification for the supplied will plan. */
export function validateWill(w: Will): ValidationResult {
  return {
    validityClass: deriveValidityClass(w),
    residuaryPercentTotal: residuaryPercentTotal(w),
    electiveShareAmount: electiveShareAmount(w),
    witnessCount: witnessCount(w),
    selfProved: selfProved(w),
    federalEstateTaxExposure: federalEstateTaxExposure(w),
    stateRuleSource: stateRuleFor(w.testator.state).known ? 'state-table' : 'uniform-default',
    flaggedIssues: detectFlaggedIssues(w),
    timestamp: new Date().toISOString()
  };
}
