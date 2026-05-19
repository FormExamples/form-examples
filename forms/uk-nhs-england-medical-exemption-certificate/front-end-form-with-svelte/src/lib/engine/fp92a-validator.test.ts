import { describe, expect, it } from 'vitest';
import { evaluateFp92a } from './fp92a-validator';
import { fp92aRules } from './fp92a-rules';
import { detectAdditionalFlags } from './flagged-issues';
import type {
	EligibleConditionCode,
	Fp92aApplication,
	QualifyingConditionDetail
} from './types';

const ALL_CODES: EligibleConditionCode[] = [
	'permanent-fistula',
	'hypoadrenalism',
	'diabetes-insipidus-or-hypopituitarism',
	'diabetes-mellitus-not-diet-only',
	'hypoparathyroidism',
	'myasthenia-gravis',
	'myxoedema',
	'epilepsy-on-anticonvulsant',
	'continuing-physical-disability',
	'cancer-or-effects'
];

function defaultCondition(code: EligibleConditionCode): QualifyingConditionDetail {
	return {
		code,
		selected: false,
		diagnosisDate: '',
		snomedCtCode: '',
		icd10Code: '',
		treatmentDetail: '',
		fistulaSite: '',
		applianceType: '',
		substitutionTherapy: '',
		onSubstitutionTherapy: '',
		diabetesTreatmentMode: '',
		anticonvulsant: '',
		continuousAnticonvulsantTherapy: '',
		cannotLeaveHomeUnaided: '',
		disabilityCarerDetail: '',
		disabilityExpectedToBePermanent: '',
		cancerSite: '',
		cancerTreatmentPhase: '',
		histologyConfirmed: '',
		practitionerAttestationNotes: ''
	};
}

function emptyApplication(): Fp92aApplication {
	return {
		practitioner: {
			name: '',
			role: '',
			registrationBody: '',
			registrationNumber: '',
			practiceName: '',
			practiceCode: '',
			practitionerCode: '',
			postalAddressAsFullText: '',
			postcode: '',
			countryAsIso31661Alpha2: '',
			phone: '',
			email: '',
			completionDate: ''
		},
		patient: {
			title: '',
			surname: '',
			forenames: '',
			name: '',
			birthDate: '',
			sex: '',
			postalAddressAsFullText: '',
			postcode: '',
			countryAsIso31661Alpha2: '',
			unitedKingdomNhsNumber: '',
			phone: '',
			email: '',
			fullTimeEducation: '',
			pregnancyStatus: ''
		},
		existingExemption: {
			hasExistingCertificate: '',
			applicationKind: '',
			previousCertificateNumber: '',
			previousCertificateExpiryDate: ''
		},
		ageCheck: { practitionerAcknowledgedAgeAdvice: '' },
		pregnancyCheck: { practitionerAcknowledgedFw8Redirect: '' },
		qualifyingConditions: ALL_CODES.map(defaultCondition),
		declaration: {
			practitionerSignaturePresent: '',
			practitionerHasAccessToMedicalRecords: '',
			practitionerDeclarationText: '',
			signatureDate: ''
		}
	};
}

/** Fully-populated application with diabetes mellitus (insulin) — eligible. */
function eligibleDiabetesApplication(): Fp92aApplication {
	const d = emptyApplication();
	d.practitioner.name = 'Dr Smith';
	d.practitioner.role = 'gp';
	d.practitioner.registrationBody = 'GMC';
	d.practitioner.registrationNumber = '1234567';
	d.practitioner.practiceName = 'High Street Surgery';
	d.practitioner.completionDate = '2026-05-18';

	d.patient.surname = 'Doe';
	d.patient.forenames = 'Jane';
	d.patient.birthDate = '1980-05-10';
	d.patient.postalAddressAsFullText = '1 High Street, London';
	d.patient.postcode = 'SW1A 1AA';
	d.patient.unitedKingdomNhsNumber = '9990123456';
	d.patient.pregnancyStatus = 'not-pregnant';

	const c = d.qualifyingConditions.find(
		(x) => x.code === 'diabetes-mellitus-not-diet-only'
	);
	if (c) {
		c.selected = true;
		c.diagnosisDate = '2010-01-01';
		c.diabetesTreatmentMode = 'insulin';
		c.treatmentDetail = 'Basal-bolus insulin';
	}

	d.declaration.practitionerSignaturePresent = 'yes';
	d.declaration.practitionerHasAccessToMedicalRecords = 'yes';
	d.declaration.signatureDate = '2026-05-18';
	return d;
}

describe('FP92A — rule set', () => {
	it('all rule IDs are unique', () => {
		const ids = fp92aRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('every rule has a non-empty message', () => {
		for (const r of fp92aRules) {
			expect(r.message.length).toBeGreaterThan(0);
		}
	});
});

describe('FP92A — empty application', () => {
	it('is ineligible and fires the urgent completeness rules', () => {
		const r = evaluateFp92a(emptyApplication());
		expect(r.outcome).toBe('ineligible');
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('FP92A-COMP-CONDITION-SELECTED');
		expect(ids).toContain('FP92A-COMP-SIGNATURE');
		expect(ids).toContain('FP92A-COMP-NHS-NUMBER');
	});

	it('sorts fired rules urgent → low', () => {
		const r = evaluateFp92a(emptyApplication());
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = r.firedRules.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});

describe('FP92A — eligible diabetes application', () => {
	it('is eligible with diabetes-mellitus-not-diet-only', () => {
		const r = evaluateFp92a(eligibleDiabetesApplication());
		expect(r.outcome).toBe('eligible');
		expect(r.eligibleConditions).toContain('diabetes-mellitus-not-diet-only');
		expect(r.validFrom).toBe('2026-05-18');
		expect(r.validUntil).toBe('2031-05-18');
		expect(r.redirectTo).toBe('');
	});

	it('is ineligible when diabetes is diet-only', () => {
		const d = eligibleDiabetesApplication();
		const c = d.qualifyingConditions.find(
			(x) => x.code === 'diabetes-mellitus-not-diet-only'
		);
		if (c) c.diabetesTreatmentMode = 'diet-only';
		const r = evaluateFp92a(d);
		expect(r.outcome).toBe('ineligible');
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('FP92A-DISQ-DIET-ONLY-DIABETES');
	});
});

describe('FP92A — redirects', () => {
	it('redirects pregnant applicants to FW8', () => {
		const d = eligibleDiabetesApplication();
		d.patient.pregnancyStatus = 'pregnant';
		const r = evaluateFp92a(d);
		expect(r.redirectTo).toBe('FW8');
		expect(r.outcome).toBe('ineligible');
	});

	it('redirects 60+ applicants to age exemption', () => {
		const d = eligibleDiabetesApplication();
		d.patient.birthDate = '1950-01-01';
		const r = evaluateFp92a(d);
		expect(r.redirectTo).toBe('age-exemption');
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('FP92A-REDIRECT-AGE-60-PLUS');
	});

	it('redirects under-16 applicants to age exemption', () => {
		const d = eligibleDiabetesApplication();
		d.patient.birthDate = '2015-01-01';
		const r = evaluateFp92a(d);
		expect(r.redirectTo).toBe('age-exemption');
	});

	it('redirects 16-18 in education to age exemption', () => {
		const d = eligibleDiabetesApplication();
		d.patient.birthDate = '2009-01-01';
		d.patient.fullTimeEducation = 'yes';
		const r = evaluateFp92a(d);
		expect(r.redirectTo).toBe('age-exemption');
	});
});

describe('FP92A — requires-clarification', () => {
	it('requires clarification when cancer histology is pending', () => {
		const d = eligibleDiabetesApplication();
		const diab = d.qualifyingConditions.find(
			(x) => x.code === 'diabetes-mellitus-not-diet-only'
		);
		if (diab) diab.selected = false;
		const cancer = d.qualifyingConditions.find((x) => x.code === 'cancer-or-effects');
		if (cancer) {
			cancer.selected = true;
			cancer.cancerSite = 'breast';
			cancer.cancerTreatmentPhase = 'active-treatment';
			cancer.histologyConfirmed = 'pending';
		}
		const r = evaluateFp92a(d);
		expect(r.outcome).toBe('requires-clarification');
	});
});

describe('FP92A — disqualifying / disability', () => {
	it('is ineligible when disability is declared temporary', () => {
		const d = eligibleDiabetesApplication();
		const diab = d.qualifyingConditions.find(
			(x) => x.code === 'diabetes-mellitus-not-diet-only'
		);
		if (diab) diab.selected = false;
		const dis = d.qualifyingConditions.find(
			(x) => x.code === 'continuing-physical-disability'
		);
		if (dis) {
			dis.selected = true;
			dis.cannotLeaveHomeUnaided = 'yes';
			dis.disabilityExpectedToBePermanent = 'no';
		}
		const r = evaluateFp92a(d);
		expect(r.outcome).toBe('ineligible');
		const ids = r.firedRules.map((f) => f.id);
		expect(ids).toContain('FP92A-DISQ-TEMP-DISABILITY');
	});
});

describe('FP92A — additional flags', () => {
	it('flags missing NHS number as urgent', () => {
		const d = eligibleDiabetesApplication();
		d.patient.unitedKingdomNhsNumber = '';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-MISSING-NHS-NUMBER' && f.priority === 'urgent')).toBe(
			true
		);
	});

	it('flags missing practitioner signature as urgent', () => {
		const d = eligibleDiabetesApplication();
		d.declaration.practitionerSignaturePresent = '';
		const flags = detectAdditionalFlags(d);
		expect(
			flags.some((f) => f.id === 'FLAG-MISSING-SIGNATURE' && f.priority === 'urgent')
		).toBe(true);
	});

	it('flags pregnancy as high', () => {
		const d = eligibleDiabetesApplication();
		d.patient.pregnancyStatus = 'pregnant';
		const flags = detectAdditionalFlags(d);
		expect(flags.some((f) => f.id === 'FLAG-PREGNANCY-FW8' && f.priority === 'high')).toBe(true);
	});

	it('flags age-60+ as medium', () => {
		const d = eligibleDiabetesApplication();
		d.patient.birthDate = '1950-01-01';
		const flags = detectAdditionalFlags(d);
		expect(
			flags.some((f) => f.id === 'FLAG-AGE-EXEMPTION-60-PLUS' && f.priority === 'medium')
		).toBe(true);
	});
});
