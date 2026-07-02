import { describe, it, expect } from 'vitest';
import { deriveValidityClass, validateCertificate } from './mccd-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { underlyingCause, unacceptableSoleCause, illogicalSequence } from './mccd-rules';
import type { DeathCertificate } from './types';

/**
 * A blank certificate (mirrors the store's `createDefaultCertificate`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultCertificate(): DeathCertificate {
	return {
		certification: {
			certifyingDoctorName: '',
			certifyingDoctorGrade: '',
			gmcReference: '',
			placeOfCertification: '',
			certificationDate: null,
			attendedDeceased: '',
			lastSeenAliveDate: null
		},
		deceased: {
			deceasedName: '',
			sex: '',
			dateOfBirth: null,
			ageYears: null,
			patientIdentifier: ''
		},
		death: {
			dateOfDeath: null,
			timeOfDeath: null,
			placeOfDeath: '',
			seenAfterDeathBy: ''
		},
		partI: {
			causeIaCondition: '',
			causeIaInterval: '',
			causeIbCondition: '',
			causeIbInterval: '',
			causeIcCondition: '',
			causeIcInterval: ''
		},
		partII: {
			partIiConditions: '',
			partIiInterval: ''
		},
		referral: {
			referredToCoroner: '',
			coronerReason: '',
			medicalExaminerStatus: '',
			certifierNote: ''
		}
	};
}

/** A complete, valid certificate: two Part I lines, scrutinised, no referral. */
function createValidCertificate(): DeathCertificate {
	const d = createDefaultCertificate();
	d.certification.certifyingDoctorName = 'Dr R. Okafor';
	d.certification.certifyingDoctorGrade = 'consultant';
	d.certification.gmcReference = '7654321';
	d.certification.attendedDeceased = 'yes';
	d.partI.causeIaCondition = 'Bronchopneumonia';
	d.partI.causeIaInterval = '3 days';
	d.partI.causeIbCondition = 'Chronic obstructive pulmonary disease';
	d.partI.causeIbInterval = '12 years';
	d.referral.referredToCoroner = 'no';
	d.referral.coronerReason = 'none';
	d.referral.medicalExaminerStatus = 'scrutinised';
	return d;
}

describe('MCCD validity classification engine', () => {
	it('classifies a complete, scrutinised certificate as valid', () => {
		const r = validateCertificate(createValidCertificate());
		expect(r.validityClass).toBe('valid');
		expect(r.underlyingCause).toBe('Chronic obstructive pulmonary disease');
		expect(r.coronerReferralIndicated).toBe(false);
	});

	it('classifies a certificate with a missing Part I(a) as incomplete', () => {
		const d = createDefaultCertificate();
		expect(deriveValidityClass(d)).toBe('incomplete');
	});

	it('classifies an unacceptable sole "mode of death" as incomplete', () => {
		const d = createDefaultCertificate();
		d.partI.causeIaCondition = 'Cardiac arrest';
		expect(unacceptableSoleCause(d)).toBe(true);
		expect(deriveValidityClass(d)).toBe('incomplete');
		// "Old age" is also an unacceptable sole cause.
		const d2 = createDefaultCertificate();
		d2.partI.causeIaCondition = 'Old age';
		expect(deriveValidityClass(d2)).toBe('incomplete');
	});

	it('does not flag a mode of death when an underlying cause is also stated', () => {
		const d = createDefaultCertificate();
		d.partI.causeIaCondition = 'Cardiac arrest';
		d.partI.causeIbCondition = 'Ischaemic heart disease';
		expect(unacceptableSoleCause(d)).toBe(false);
		expect(deriveValidityClass(d)).toBe('valid');
	});

	it('gives refer-to-coroner precedence over completeness', () => {
		// A fully complete certificate that also meets a referral criterion must
		// still classify as refer-to-coroner.
		const d = createValidCertificate();
		d.referral.coronerReason = 'unnatural';
		expect(deriveValidityClass(d)).toBe('refer-to-coroner');

		// Referral precedence holds even when Part I is empty (would be incomplete).
		const d2 = createDefaultCertificate();
		d2.referral.referredToCoroner = 'yes';
		expect(deriveValidityClass(d2)).toBe('refer-to-coroner');
	});

	it('derives the underlying cause as the lowest completed Part I line', () => {
		const d = createDefaultCertificate();
		d.partI.causeIaCondition = 'Bronchopneumonia';
		expect(underlyingCause(d)).toBe('Bronchopneumonia');
		d.partI.causeIbCondition = 'COPD';
		expect(underlyingCause(d)).toBe('COPD');
		d.partI.causeIcCondition = 'Smoking-related lung disease';
		expect(underlyingCause(d)).toBe('Smoking-related lung disease');
	});

	it('detects an illogical (gapped) Part I sequence', () => {
		const d = createDefaultCertificate();
		d.partI.causeIbCondition = 'COPD'; // I(b) present, I(a) empty
		expect(illogicalSequence(d)).toBe(true);
	});

	it('makes NO diagnostic decision (no such field on the result)', () => {
		const r = validateCertificate(createValidCertificate());
		expect(r).not.toHaveProperty('diagnosis');
		expect(r).not.toHaveProperty('causeOfDeathDecision');
	});
});

describe('MCCD flagged-issue detection', () => {
	it('raises the coroner-referral-required flag when a criterion is asserted', () => {
		const d = createValidCertificate();
		d.referral.coronerReason = 'violent';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-CORONER-REFERRAL-REQUIRED-001')).toBe(true);
	});

	it('raises the unacceptable-sole-cause flag for a bare mode of death', () => {
		const d = createDefaultCertificate();
		d.partI.causeIaCondition = 'Respiratory failure';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-UNACCEPTABLE-SOLE-CAUSE-001')).toBe(true);
	});

	it('raises the missing-Part-I(a) flag when no direct cause is recorded', () => {
		const flags = detectFlaggedIssues(createDefaultCertificate());
		expect(flags.some((f) => f.id === 'F-MISSING-PART-I-001')).toBe(true);
	});

	it('always raises medical-examiner scrutiny for a non-referred unscrutinised certificate', () => {
		const d = createValidCertificate();
		d.referral.medicalExaminerStatus = 'pending';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-MEDICAL-EXAMINER-SCRUTINY-001')).toBe(true);
	});

	it('does not raise medical-examiner scrutiny once scrutinised', () => {
		const flags = detectFlaggedIssues(createValidCertificate());
		expect(flags.some((f) => f.id === 'F-MEDICAL-EXAMINER-SCRUTINY-001')).toBe(false);
	});

	it('raises the missing-interval flag for a completed line without an interval', () => {
		const d = createValidCertificate();
		d.partI.causeIaInterval = '';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'F-MISSING-INTERVAL-001')).toBe(true);
	});

	it('raises the incomplete-certifier flag when identity fields are missing', () => {
		const flags = detectFlaggedIssues(createDefaultCertificate());
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-CERTIFIER-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultCertificate();
		d.referral.coronerReason = 'suspicious'; // high
		d.referral.medicalExaminerStatus = 'pending'; // medium
		const flags = detectFlaggedIssues(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
