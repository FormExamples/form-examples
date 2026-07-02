// Medical Certificate of Cause of Death (MCCD) validity grader. Pure functions:
// take a `DeathCertificate` object, evaluate the coroner-referral criteria, the
// completeness of Part I, and the acceptability of the stated cause, and assign
// exactly one validity class. It makes NO diagnostic judgement; the prescribed
// statutory certificate remains the definitive legal record.
//
// Algorithm (spec §4), first matching class wins:
//   coronerReferralIndicated                 -> 'refer-to-coroner'
//   missingPartIa || unacceptableSoleCause   -> 'incomplete'
//   otherwise                                -> 'valid'
//
//   underlyingCause = lowest completed Part I line (I(c) else I(b) else I(a))
//
// `refer-to-coroner` takes precedence over completeness: if a referral criterion
// is met the MCCD should not be issued regardless of how complete it is. A
// `valid` certificate still requires medical-examiner scrutiny before
// registration (see `flags.js`).

/**
 * @typedef {import('./types.js').DeathCertificate} DeathCertificate
 * @typedef {import('./types.js').ValidityClass} ValidityClass
 */

// Wrapped in an IIFE; published via window.MedicalCertificateOfCauseOfDeath.
(function () {
'use strict';
window.MedicalCertificateOfCauseOfDeath =
  window.MedicalCertificateOfCauseOfDeath || {};
const {
  coronerReferralIndicated,
  unacceptableSoleCause,
  missingPartIa,
  underlyingCause
} = window.MedicalCertificateOfCauseOfDeath;

/**
 * Assign the single validity class (spec §4).
 * @param {DeathCertificate} d
 * @returns {ValidityClass}
 */
function deriveValidityClass(d) {
  if (coronerReferralIndicated(d)) return 'refer-to-coroner';
  if (missingPartIa(d) || unacceptableSoleCause(d)) return 'incomplete';
  return 'valid';
}

/**
 * Compute the full validity classification for the supplied certificate. This
 * classifies completeness and consistency only — it does NOT diagnose and does
 * NOT discharge the certifying doctor's statutory duty to consider referral.
 * @param {DeathCertificate} d
 * @returns {{ validityClass: ValidityClass,
 *             underlyingCause: string,
 *             coronerReferralIndicated: boolean }}
 */
function validateCertificate(d) {
  return {
    validityClass: deriveValidityClass(d),
    underlyingCause: underlyingCause(d),
    coronerReferralIndicated: coronerReferralIndicated(d)
  };
}

Object.assign(window.MedicalCertificateOfCauseOfDeath, {
  deriveValidityClass,
  validateCertificate
});
})();
