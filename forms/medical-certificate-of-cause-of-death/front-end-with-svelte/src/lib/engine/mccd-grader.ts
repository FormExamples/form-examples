import type { DeathCertificate, ValidationResult, ValidityClass } from './types';
import {
	coronerReferralIndicated,
	missingPartIa,
	unacceptableSoleCause,
	underlyingCause
} from './mccd-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Medical Certificate of Cause of Death (MCCD) validity grader. Pure functions:
 * take a `DeathCertificate` object, evaluate the coroner-referral criteria, the
 * completeness of Part I, and the acceptability of the stated cause, and assign
 * exactly one validity class. It makes NO diagnostic judgement; the prescribed
 * statutory certificate remains the definitive legal record.
 *
 * Algorithm (spec §4), first matching class wins:
 *   coronerReferralIndicated                 -> 'refer-to-coroner'
 *   missingPartIa || unacceptableSoleCause   -> 'incomplete'
 *   otherwise                                -> 'valid'
 *
 *   underlyingCause = lowest completed Part I line (I(c) else I(b) else I(a))
 *
 * `refer-to-coroner` takes precedence over completeness: if a referral criterion
 * is met the MCCD should not be issued regardless of how complete it is. A
 * `valid` certificate still requires medical-examiner scrutiny before
 * registration (see `flagged-issues.ts`).
 */

/** Assign the single validity class (spec §4). */
export function deriveValidityClass(d: DeathCertificate): ValidityClass {
	if (coronerReferralIndicated(d)) return 'refer-to-coroner';
	if (missingPartIa(d) || unacceptableSoleCause(d)) return 'incomplete';
	return 'valid';
}

/**
 * Compute the full validity classification for the supplied certificate. This
 * classifies completeness and consistency only — it does NOT diagnose and does
 * NOT discharge the certifying doctor's statutory duty to consider referral.
 */
export function validateCertificate(d: DeathCertificate): ValidationResult {
	return {
		validityClass: deriveValidityClass(d),
		underlyingCause: underlyingCause(d),
		coronerReferralIndicated: coronerReferralIndicated(d),
		flaggedIssues: detectFlaggedIssues(d),
		timestamp: new Date().toISOString()
	};
}
