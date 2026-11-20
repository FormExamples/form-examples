import { applicantDeceased, evidenceGaps, inPersonViolation, limitBlocked, limitReached, minorSignerProblem, missingFields } from './rules.js';

// Social Security card application (Form SS-5) classifier. Pure functions:
// take a `SocialSecurityApplication` object, evaluate eligibility, the
// replacement-card limits, the required form fields, and the evidence, and
// assign exactly one class. It makes NO decision for SSA; the Social Security
// Administration decides every application.
//
// Algorithm (spec §4), first matching class wins:
//   applicantDeceased || limitBlocked                         -> 'not-eligible'
//   missing form fields || in-person violation || minor signer -> 'incomplete'
//   evidence gaps                                              -> 'evidence-missing'
//   otherwise                                                  -> 'ready-to-submit'
//
// `not-eligible` takes precedence: a deceased applicant or a replacement limit
// with no supported exception cannot be cured by completing the form.

/**
 * @typedef {import('./types.js').SocialSecurityApplication} SocialSecurityApplication
 * @typedef {import('./types.js').ApplicationClass} ApplicationClass
 */

/**
 * Assign the single application class (spec §4).
 * @param {SocialSecurityApplication} d
 * @returns {ApplicationClass}
 */
function deriveApplicationClass(d) {
  if (applicantDeceased(d) || limitBlocked(d)) return 'not-eligible';
  if (missingFields(d).length > 0 || inPersonViolation(d) || minorSignerProblem(d)) return 'incomplete';
  if (evidenceGaps(d).length > 0) return 'evidence-missing';
  return 'ready-to-submit';
}

/**
 * Compute the full classification for the supplied application. This checks
 * completeness and evidence only; it does NOT predict SSA's decision.
 * @param {SocialSecurityApplication} d
 * @returns {{ applicationClass: ApplicationClass,
 *             missingEvidenceCount: number,
 *             replacementLimitReached: boolean }}
 */
function validateApplication(d) {
  return {
    applicationClass: deriveApplicationClass(d),
    missingEvidenceCount: evidenceGaps(d).length,
    replacementLimitReached: limitReached(d)
  };
}

export { deriveApplicationClass, validateApplication };
