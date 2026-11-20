import { countedAdults, disqualifiers, indicativeOutcome, missingItems } from './rules.js';

// United Kingdom Council Tax Discount Application eligibility grader. Pure
// functions: take an `Application` object, evaluate the disqualifiers and the
// missing items, and assign exactly one eligibility class. It decides nothing:
// ELIGIBILITY IS DECIDED BY THE BILLING AUTHORITY.
//
// Algorithm (spec §4), first matching class wins:
//   any disqualifier        -> 'likely-ineligible'
//   any missing item        -> 'incomplete'
//   otherwise               -> 'likely-eligible'
//
// countedAdults = the applicant plus roster occupants whose status is
// unanswered or 'counted-adult'.

/**
 * @typedef {import('./types.js').Application} Application
 * @typedef {import('./types.js').EligibilityClass} EligibilityClass
 */

/**
 * Assign the single eligibility class (spec §4).
 * @param {Application} a
 * @returns {EligibilityClass}
 */
function deriveEligibilityClass(a) {
  if (disqualifiers(a).length > 0) return 'likely-ineligible';
  if (missingItems(a).length > 0) return 'incomplete';
  return 'likely-eligible';
}

/**
 * Compute the full eligibility classification for the supplied application.
 * This pre-checks completeness and consistency only; it does NOT award a
 * discount.
 * @param {Application} a
 * @returns {{ eligibilityClass: EligibilityClass,
 *             countedAdults: number,
 *             indicativeOutcome: string }}
 */
function validateApplication(a) {
  const eligibilityClass = deriveEligibilityClass(a);
  return {
    eligibilityClass,
    countedAdults: countedAdults(a),
    indicativeOutcome: eligibilityClass === 'likely-ineligible' ? 'none' : indicativeOutcome(a)
  };
}

export { deriveEligibilityClass, validateApplication };
