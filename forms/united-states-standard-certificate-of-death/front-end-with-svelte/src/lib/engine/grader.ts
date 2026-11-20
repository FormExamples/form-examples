import type { DeathCertificate, ValidationResult, ValidityClass } from './types.js';
import { detectFlaggedIssues } from './flagged-issues.js';
import {
  mechanismAsSoleCause,
  missingPartIa,
  missingRequired,
  referralIndicated,
  underlyingCause
} from './rules.js';

// US Standard Certificate of Death validity grader. Pure functions: take a
// `DeathCertificate` object, evaluate the medical-examiner / coroner referral
// criteria, the completeness of the required items, and the acceptability of the
// stated cause, and assign exactly one validity class. It makes NO diagnostic
// judgement and is not legal advice; the registering state agency decides.
//
// Algorithm (spec section 4), first matching class wins:
//   referralIndicated                                  -> 'refer-to-medical-examiner-or-coroner'
//   missingPartIa || mechanismAsSoleCause ||
//     any required item blank                          -> 'incomplete'
//   otherwise                                          -> 'valid'
//
//   underlyingCause = lowest completed Part I line (d else c else b else a)
//
// Referral takes precedence over completeness: if a referral criterion is met
// the certificate is a medical examiner or coroner case regardless of how
// complete it is.

/**
 * Assign the single validity class (spec section 4).
 */
function deriveValidityClass(d: DeathCertificate): ValidityClass {
  if (referralIndicated(d)) return 'refer-to-medical-examiner-or-coroner';
  if (missingPartIa(d) || mechanismAsSoleCause(d) || missingRequired(d).length > 0)
    return 'incomplete';
  return 'valid';
}

/**
 * Compute the validity classification for the supplied certificate. This
 * classifies completeness and consistency only; it does NOT diagnose.
 */
function validateCertificate(d: DeathCertificate): ValidationResult {
  return {
    validityClass: deriveValidityClass(d),
    underlyingCause: underlyingCause(d),
    referralIndicated: referralIndicated(d),
    flaggedIssues: detectFlaggedIssues(d),
    timestamp: new Date().toISOString()
  };
}

export { deriveValidityClass, validateCertificate };
