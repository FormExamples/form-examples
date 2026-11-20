import { bloodTestMissing, ceremonyBeforeIssue, currentlyMarried, earliestCeremonyDate, idNotPresented, licenseExpired, licenseExpiryDate, minorConsentMissing, missingRequired, notAppearing, officiantProblem, priorMarriageUndocumented, prohibitedRelationship, proxyNotPermitted, stateRuleKnown, underageBarred, waitingNotElapsed, witnessShortfall } from './rules.js';

// United States marriage-license eligibility grader. Pure functions: take a
// `MarriageApplication` object, evaluate the applicable state rule, and assign
// exactly one class. It makes NO legal judgement; the issuing county clerk (or
// a court) decides whether a license issues.
//
// Algorithm (spec section 4), first matching class wins:
//   underageBarred || currentlyMarried || prohibitedRelationship
//     || proxyNotPermitted                                    -> 'not-eligible'
//   anything required is missing or unresolved (see
//     `isIncomplete`)                                         -> 'incomplete'
//   otherwise                                                 -> 'ready-to-apply'
//
// `not-eligible` takes precedence: a bar the applicants cannot cure by adding
// paperwork outranks missing data. The two dates the state rule implies (the
// earliest permitted ceremony and the license expiry) are derived from the
// issue date (or the application date when no license has issued yet).

/**
 * @typedef {import('./types.js').MarriageApplication} MarriageApplication
 * @typedef {import('./types.js').ApplicationClass} ApplicationClass
 */

/** @param {MarriageApplication} d */
function isNotEligible(d) {
  return underageBarred(d) || currentlyMarried(d) || prohibitedRelationship(d) || proxyNotPermitted(d);
}

/** @param {MarriageApplication} d */
function isIncomplete(d) {
  return (
    missingRequired(d).length > 0 ||
    minorConsentMissing(d) ||
    idNotPresented(d).length > 0 ||
    notAppearing(d) ||
    priorMarriageUndocumented(d).length > 0 ||
    bloodTestMissing(d) ||
    ceremonyBeforeIssue(d) ||
    waitingNotElapsed(d) ||
    licenseExpired(d) ||
    witnessShortfall(d) ||
    officiantProblem(d) !== ''
  );
}

/**
 * Assign the single application class (spec section 4).
 * @param {MarriageApplication} d
 * @returns {ApplicationClass}
 */
function deriveApplicationClass(d) {
  if (isNotEligible(d)) return 'not-eligible';
  if (isIncomplete(d)) return 'incomplete';
  return 'ready-to-apply';
}

/**
 * Compute the classification for the supplied application. It checks the
 * application against the state rule; it does NOT decide that a license issues.
 * @param {MarriageApplication} d
 * @returns {{ applicationClass: ApplicationClass,
 *             earliestCeremonyDate: string | null,
 *             licenseExpiryDate: string | null,
 *             stateRuleKnown: boolean }}
 */
function validateApplication(d) {
  return {
    applicationClass: deriveApplicationClass(d),
    earliestCeremonyDate: earliestCeremonyDate(d),
    licenseExpiryDate: licenseExpiryDate(d),
    stateRuleKnown: stateRuleKnown(d.jurisdiction.state)
  };
}

export { deriveApplicationClass, validateApplication };
