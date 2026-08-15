import { describe, it, expect } from 'vitest';
import { validateAuthorization, computeCompletenessScore } from './validate-authorization';
import { createDefaultAuthorization } from '#lib/engine/defaults.js';
import type { HipaaAuthorization } from './types';

/** A fully-valid authorization with every core element and required statement present. */
function validAuthorization(): HipaaAuthorization {
	const a = createDefaultAuthorization();
	a.patient = { ...a.patient, name: 'Jane Doe', birthDate: '1980-04-12' };
	a.signer = { ...a.signer, relationship: 'self' };
	a.disclosingSource = {
		...a.disclosingSource,
		identificationMode: 'class',
		classDescription: 'All hospitals and clinics that treated me from 2020 to today.'
	};
	a.authorizedRecipient = {
		...a.authorizedRecipient,
		recipientName: 'Acme Insurance',
		recipientOrganization: 'Acme Insurance Co.'
	};
	a.recordsToDisclose = {
		...a.recordsToDisclose,
		includeMedicalHealth: 'yes',
		medicalHealthInitials: 'JD',
		otherDescription: 'Discharge summaries from 2023.'
	};
	a.purposeOfDisclosure = {
		...a.purposeOfDisclosure,
		primaryPurpose: 'insurance-claim'
	};
	a.expiration = { ...a.expiration, kind: 'date', expirationDate: '2027-01-01' };
	a.patientRightsAcknowledgement = {
		...a.patientRightsAcknowledgement,
		acknowledgedRightToRevoke: 'yes',
		acknowledgedNoConditioning: 'yes',
		acknowledgedRedisclosureWarning: 'yes',
		acknowledgedRightToCopy: 'yes'
	};
	a.signatureWitness = {
		...a.signatureWitness,
		individualSignatureConfirmed: 'yes',
		signatureDate: '2026-01-01'
	};
	return a;
}

describe('validateAuthorization', () => {
	it('marks a blank authorization invalid with many fired rules', () => {
		const result = validateAuthorization(createDefaultAuthorization());
		expect(result.validityStatus).toBe('invalid');
		expect(result.firedRules.length).toBeGreaterThan(0);
		expect(result.completenessScore).toBe(0);
		expect(result.completenessStatus).toBe('empty');
		expect(result.validatorVersion).toBe('0.1.0');
	});

	it('marks a complete, consistent authorization valid with no fired rules', () => {
		const result = validateAuthorization(validAuthorization());
		expect(result.validityStatus).toBe('valid');
		expect(result.firedRules).toHaveLength(0);
		expect(result.additionalFlags).toHaveLength(0);
		expect(result.completenessStatus).toBe('complete');
		expect(result.completenessScore).toBe(100);
	});

	it('fires the 42 CFR Part 2 rule when substance-use records lack the redisclosure notice', () => {
		const a = validAuthorization();
		a.recordsToDisclose.includeSubstanceUse = 'yes';
		a.recordsToDisclose.substanceUseInitials = 'JD';
		// part2RedisclosureNoticeIncluded intentionally left unset.
		const result = validateAuthorization(a);
		expect(result.validityStatus).toBe('invalid');
		expect(result.firedRules.some((r) => r.ruleId === 'substance-use-part-2-consent')).toBe(true);
	});

	it('requires a representative authority description when not signing as self', () => {
		const a = validAuthorization();
		a.signer.relationship = 'guardian';
		const result = validateAuthorization(a);
		expect(result.firedRules.some((r) => r.ruleId === 'representative-authority')).toBe(true);
	});

	it('raises the VA § 7332 flag and invalidates when VA records lack the notice', () => {
		const a = validAuthorization();
		a.disclosingSource.isVaFacility = 'yes';
		const result = validateAuthorization(a);
		expect(result.additionalFlags.some((f) => f.flagId === 'va-records-7332-notice')).toBe(true);
		expect(result.validityStatus).toBe('invalid');
	});

	it('rejects "none" as an expiration event', () => {
		const a = validAuthorization();
		a.expiration = {
			...a.expiration,
			kind: 'event',
			expirationDate: null,
			expirationEvent: 'none'
		};
		const result = validateAuthorization(a);
		expect(result.firedRules.some((r) => r.ruleId === 'expiration-not-none')).toBe(true);
	});
});

describe('computeCompletenessScore', () => {
	it('scores a half-filled authorization between 0 and 100', () => {
		const a = createDefaultAuthorization();
		a.patient.name = 'Jane Doe';
		a.patient.birthDate = '1980-04-12';
		a.signer.relationship = 'self';
		const score = computeCompletenessScore(a);
		expect(score).toBeGreaterThan(0);
		expect(score).toBeLessThan(100);
	});
});
