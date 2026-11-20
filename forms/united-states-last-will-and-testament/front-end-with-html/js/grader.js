import { detectFlaggedIssues } from './flags.js';
import {
  electiveShareAmount, federalEstateTaxExposure, missingItems, residuaryPercentTotal, selfProved,
  stateRuleFor, witnessCount
} from './rules.js';

// United States Last Will and Testament validity grader. Pure functions: take a
// `Will` object, evaluate the formality, capacity, witness and bequest rules for
// the testator's state, and assign exactly one validity class. It gives no legal
// advice; the probate court decides whether a will is valid.
//
// Algorithm (spec §4), first matching class wins:
//   any HIGH flag                -> 'formality-risk'
//   any required answer missing  -> 'incomplete'
//   otherwise                    -> 'valid-ready-to-execute'
//
// `formality-risk` takes precedence over `incomplete`: a plan with a known
// defect should not be signed however complete the rest is. The flags
// themselves come from `flags.js`.

/**
 * @typedef {import('./types.js').Will} Will
 * @typedef {import('./types.js').ValidityClass} ValidityClass
 */

/**
 * Assign the single validity class (spec §4).
 * @param {Will} w
 * @returns {ValidityClass}
 */
function deriveValidityClass(w) {
  if (detectFlaggedIssues(w).some((f) => f.priority === 'high')) return 'formality-risk';
  if (missingItems(w).length > 0) return 'incomplete';
  return 'valid-ready-to-execute';
}

/**
 * Compute the full validity classification for the supplied will plan.
 * @param {Will} w
 * @returns {{ validityClass: ValidityClass,
 *             residuaryPercentTotal: number,
 *             electiveShareAmount: number | null,
 *             witnessCount: number,
 *             selfProved: boolean,
 *             federalEstateTaxExposure: boolean,
 *             stateRuleSource: 'state-table' | 'uniform-default' }}
 */
function validateWill(w) {
  return {
    validityClass: deriveValidityClass(w),
    residuaryPercentTotal: residuaryPercentTotal(w),
    electiveShareAmount: electiveShareAmount(w),
    witnessCount: witnessCount(w),
    selfProved: selfProved(w),
    federalEstateTaxExposure: federalEstateTaxExposure(w),
    stateRuleSource: stateRuleFor(w.testator.state).known ? 'state-table' : 'uniform-default'
  };
}

export { deriveValidityClass, validateWill };
