import { anyGap, expectedFee, hasStateRule, ineligibleRequester } from './rules.js';

// US birth certificate application grader. Pure functions: take a
// `BirthCertificateApplication`, test the requester against the state rule in
// force (or the uniform default), test completeness, and assign exactly one
// class. It is documentation support, NOT legal advice; the issuing vital
// records office decides whether to issue a certified copy.
//
// Algorithm (spec §4), first matching class wins:
//   ineligibleRequester(d)  -> 'ineligible-requester'
//   anyGap(d)               -> 'incomplete'
//   otherwise               -> 'ready-to-submit'
//
// `ineligible-requester` takes precedence over completeness: completing the
// paperwork cannot cure a requester who has no right to a certified copy.

/**
 * @typedef {import('./types.js').BirthCertificateApplication} BirthCertificateApplication
 * @typedef {import('./types.js').ApplicationClass} ApplicationClass
 */

/**
 * Assign the single application class (spec §4).
 * @param {BirthCertificateApplication} d
 * @returns {ApplicationClass}
 */
function deriveApplicationClass(d) {
  if (ineligibleRequester(d)) return 'ineligible-requester';
  if (anyGap(d)) return 'incomplete';
  return 'ready-to-submit';
}

/**
 * Compute the classification for the supplied application.
 * @param {BirthCertificateApplication} d
 * @returns {{ applicationClass: ApplicationClass,
 *             expectedFeeUsd: number | null,
 *             stateRuleApplied: 'state' | 'default' }}
 */
function validateApplication(d) {
  return {
    applicationClass: deriveApplicationClass(d),
    expectedFeeUsd: expectedFee(d),
    stateRuleApplied: hasStateRule(d) ? 'state' : 'default'
  };
}

export { deriveApplicationClass, validateApplication };
