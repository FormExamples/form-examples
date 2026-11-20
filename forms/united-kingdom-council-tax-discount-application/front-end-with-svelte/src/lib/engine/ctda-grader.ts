import type { Application, EligibilityClass, ValidationResult } from './types';
import { countedAdults, disqualifiers, indicativeOutcome, missingItems } from './ctda-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Council Tax discount eligibility grader. Pure functions: take an
 * `Application`, evaluate the disqualifiers and the missing items, and assign
 * exactly one eligibility class. It decides nothing: ELIGIBILITY IS DECIDED BY
 * THE BILLING AUTHORITY.
 *
 * Algorithm (spec §4), first matching class wins:
 *   any disqualifier  -> 'likely-ineligible'
 *   any missing item  -> 'incomplete'
 *   otherwise         -> 'likely-eligible'
 */

/** Assign the single eligibility class (spec §4). */
export function deriveEligibilityClass(a: Application): EligibilityClass {
  if (disqualifiers(a).length > 0) return 'likely-ineligible';
  if (missingItems(a).length > 0) return 'incomplete';
  return 'likely-eligible';
}

/**
 * Compute the full eligibility classification for the supplied application.
 * This pre-checks completeness and consistency only; it does NOT award a
 * discount.
 */
export function validateApplication(a: Application): ValidationResult {
  const eligibilityClass = deriveEligibilityClass(a);
  const reasons =
    eligibilityClass === 'likely-ineligible'
      ? disqualifiers(a).map((f) => f.message)
      : eligibilityClass === 'incomplete'
        ? missingItems(a).map((f) => f.message)
        : [];
  return {
    eligibilityClass,
    countedAdults: countedAdults(a),
    indicativeOutcome: eligibilityClass === 'likely-ineligible' ? 'none' : indicativeOutcome(a),
    reasons,
    flaggedIssues: detectFlaggedIssues(a),
    timestamp: new Date().toISOString()
  };
}
