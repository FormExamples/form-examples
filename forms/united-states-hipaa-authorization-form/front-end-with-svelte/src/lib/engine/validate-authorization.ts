// HIPAA authorization validity engine entry point.
// Ported from `../front-end-form-with-html/js/validate-authorization.js`.

import type { HipaaAuthorization, ValidationResult, CompletenessStatus } from './types';
import { runRules } from './validation-rules';
import { runSensitiveCategoryRules } from './sensitive-category-rules';
import { runFlaggers } from './flagged-issues';

export const VALIDATOR_VERSION = '0.1.0';

/**
 * Validate a HIPAA authorization against the core elements (45 CFR
 * § 164.508(c)(1)), required statements (§ 164.508(c)(2)), and the
 * sensitive-category rules. The authorization is `valid` only when no rule
 * fires and no high-priority advisory flag is raised.
 */
export function validateAuthorization(authorization: HipaaAuthorization): ValidationResult {
	const coreFired = runRules(authorization);
	const sensFired = runSensitiveCategoryRules(authorization);
	const firedRules = [...coreFired, ...sensFired];
	const additionalFlags = runFlaggers(authorization);

	const highPriorityFlag = additionalFlags.some((f) => f.priority === 'high');
	const valid = firedRules.length === 0 && !highPriorityFlag;

	return {
		validityStatus: valid ? 'valid' : 'invalid',
		completenessScore: computeCompletenessScore(authorization),
		completenessStatus: completenessBand(authorization),
		firedRules,
		additionalFlags,
		validatedAt: new Date().toISOString(),
		validatorVersion: VALIDATOR_VERSION
	};
}

/** Ratio of filled-to-required fields (0..100). Used by the UI progress bar; does not gate validity. */
export function computeCompletenessScore(authorization: HipaaAuthorization): number {
	const required: Array<string | number | null> = [
		authorization.patient.name,
		authorization.patient.birthDate,
		authorization.signer.relationship,
		authorization.disclosingSource.identificationMode,
		authorization.authorizedRecipient.recipientName ||
			authorization.authorizedRecipient.recipientOrganization,
		authorization.purposeOfDisclosure.primaryPurpose,
		authorization.expiration.kind,
		authorization.patientRightsAcknowledgement.acknowledgedRightToRevoke,
		authorization.signatureWitness.individualSignatureConfirmed,
		authorization.signatureWitness.signatureDate
	];
	const filled = required.filter((v) => v !== '' && v !== null && v !== undefined).length;
	return Math.round((filled / required.length) * 100);
}

/** Coarse completeness band derived from the completeness score. */
export function completenessBand(authorization: HipaaAuthorization): CompletenessStatus {
	const s = computeCompletenessScore(authorization);
	if (s === 0) return 'empty';
	if (s === 100) return 'complete';
	return 'partial';
}
