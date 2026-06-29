// Additional flags raised during validation (priority-graded, not gating).
// Ported from `../front-end-form-with-html/js/flagged-issues.js`.

import type { HipaaAuthorization, AdditionalFlag, Priority } from './types';

interface Flagger {
	id: string;
	category: string;
	priority: Priority;
	message: string;
	test: (a: HipaaAuthorization) => boolean;
}

export const flaggers: Flagger[] = [
	{
		id: 'reproductive-health-investigation',
		category: 'reproductive-health',
		priority: 'high',
		message:
			'Purpose appears to be an investigation of reproductive-health care (HHS 2024 rule).',
		test: (a) =>
			/investigat|prosecut/i.test(a.purposeOfDisclosure.otherDetails) &&
			a.recordsToDisclose.includeReproductiveHealth === 'yes'
	},
	{
		id: 'signed-by-minor',
		category: 'minor',
		priority: 'medium',
		message:
			'Signer is patient but patient appears to be a minor and no parent/guardian co-signature is present.',
		test: (a) => {
			if (a.signer.relationship !== 'self' || !a.patient.birthDate) return false;
			const birth = new Date(a.patient.birthDate);
			const ageYears = (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
			return ageYears < 18 && a.signatureWitness.parentGuardianSignatureConfirmed !== 'yes';
		}
	},
	{
		id: 'expiration-over-12-months',
		category: 'audit',
		priority: 'medium',
		message:
			'Expiration is more than 12 months from signature, which is unusual for routine eligibility determinations.',
		test: (a) => {
			if (!a.expiration.expirationDate || !a.signatureWitness.signatureDate) return false;
			const exp = new Date(a.expiration.expirationDate).getTime();
			const sig = new Date(a.signatureWitness.signatureDate).getTime();
			const months = (exp - sig) / (30.44 * 24 * 60 * 60 * 1000);
			return months > 12 && a.purposeOfDisclosure.primaryPurpose === 'eligibility-determination';
		}
	},
	{
		id: 'va-records-7332-notice',
		category: 'state-law',
		priority: 'high',
		message: 'VA records require the 38 U.S.C. § 7332 notice.',
		test: (a) =>
			a.disclosingSource.isVaFacility === 'yes' &&
			a.recordsToDisclose.section7332NoticeIncluded !== 'yes'
	}
];

/** Run every flagger, returning the additional flags that fired (high first). */
export function runFlaggers(authorization: HipaaAuthorization): AdditionalFlag[] {
	const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
	return flaggers
		.filter((f) => f.test(authorization))
		.map((f) => ({
			flagId: f.id,
			category: f.category,
			priority: f.priority,
			message: f.message
		}))
		.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}
