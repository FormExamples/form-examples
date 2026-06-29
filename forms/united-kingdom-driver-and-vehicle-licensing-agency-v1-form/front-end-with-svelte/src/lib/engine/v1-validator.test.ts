import { describe, expect, it } from 'vitest';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';
import { v1Rules } from './v1-rules';
import { validateV1 } from './v1-validator';

function emptyAssessment(): AssessmentData {
	return {
		personalDetails: {
			title: '',
			fullName: '',
			dateOfBirth: '',
			address: '',
			postcode: '',
			email: '',
			contactNumber: '',
			changeOfDetails: ''
		},
		healthcareProfessionals: {
			gp: {
				name: '',
				surgeryName: '',
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			},
			consultant: {
				name: '',
				speciality: '',
				department: '',
				hospitalName: '',
				address: '',
				town: '',
				postcode: '',
				contactNumber: '',
				email: '',
				dateLastSeen: ''
			}
		},
		eyesightStandards: { meetsStandard: '' },
		visionInBothEyes: {
			hasVisionInBothEyes: '',
			whichEye: '',
			duration: '',
			adaptation: '',
			monocularDeclarationConfirmed: false
		},
		fieldOfVision: {
			hasProblem: '',
			causedSolelyByEyeCondition: '',
			cause: '',
			causeOtherDetails: ''
		},
		glaucoma: { hasCondition: '', whichEyes: '' },
		retinitisPigmentosa: { hasCondition: '', whichEyes: '' },
		laserTreatment: {
			hasHadTreatment: '',
			leftEyeFirstDate: '',
			rightEyeFirstDate: '',
			leftEyeLastDate: '',
			rightEyeLastDate: ''
		},
		blepharospasm: {
			hasCondition: '',
			whichEyes: '',
			hasHadTreatment: '',
			adequatelyControlled: ''
		},
		nightBlindness: { hasCondition: '', whichEyes: '' },
		doubleVision: {
			hasCondition: '',
			controlled: '',
			sameForSixMonthsOrMore: '',
			doubleVisionDeclarationConfirmed: false,
			declarationSignatureName: '',
			declarationDate: ''
		},
		otherVisionConditions: { hasOther: '', details: '' },
		recentContact: { hadContact: '', dateOfContact: '' },
		authorisation: {
			declarationConfirmed: false,
			name: '',
			signature: '',
			date: '',
			authoriseElectronicCorrespondence: '',
			contactPreferenceFromHealthcareProfessional: '',
			contactPreferenceFromDvla: ''
		}
	};
}

/**
 * Returns a fully completed assessment that takes the "all No" path through
 * every conditional question. This is the minimum-completion happy path: no
 * branches active, all top-level Yes/No answered, authorisation signed.
 */
function fullyCompletedAllNo(): AssessmentData {
	const d = emptyAssessment();
	d.personalDetails = {
		title: 'Mr',
		fullName: 'John Driver',
		dateOfBirth: '1980-05-15',
		address: '1 High Street\nSomewhere',
		postcode: 'AB1 2CD',
		email: 'john@example.com',
		contactNumber: '07000 000000',
		changeOfDetails: ''
	};
	d.healthcareProfessionals.gp.name = 'Dr Smith';
	d.healthcareProfessionals.gp.surgeryName = 'Town Surgery';
	d.eyesightStandards.meetsStandard = 'yes-with-correction';
	d.visionInBothEyes.hasVisionInBothEyes = 'yes';
	d.fieldOfVision.hasProblem = 'no';
	d.glaucoma.hasCondition = 'no';
	d.retinitisPigmentosa.hasCondition = 'no';
	d.laserTreatment.hasHadTreatment = 'no';
	d.blepharospasm.hasCondition = 'no';
	d.nightBlindness.hasCondition = 'no';
	d.doubleVision.hasCondition = 'no';
	d.otherVisionConditions.hasOther = 'no';
	d.recentContact.hadContact = 'no';
	d.authorisation.declarationConfirmed = true;
	d.authorisation.name = 'John Driver';
	d.authorisation.signature = 'John Driver';
	d.authorisation.date = '2026-04-30';
	d.authorisation.authoriseElectronicCorrespondence = 'yes';
	return d;
}

describe('DVLA V1 validation engine', () => {
	it('rule set is non-empty and IDs are unique', () => {
		expect(v1Rules.length).toBeGreaterThan(20);
		const ids = v1Rules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('an empty assessment produces multiple errors and is not complete', () => {
		const d = emptyAssessment();
		const r = validateV1(d);
		expect(r.isComplete).toBe(false);
		expect(r.firedValidations.length).toBeGreaterThan(10);
		expect(r.completionRatio).toBeLessThan(0.5);
	});

	it('a completed all-No path is complete', () => {
		const d = fullyCompletedAllNo();
		const r = validateV1(d);
		expect(r.firedValidations).toEqual([]);
		expect(r.isComplete).toBe(true);
		expect(r.completionRatio).toBe(1);
	});

	it('inactive monocular branch does not require its sub-fields', () => {
		const d = fullyCompletedAllNo();
		// hasVisionInBothEyes = 'yes' — monocular fields stay empty, no errors fire
		const fired = validateV1(d).firedValidations;
		expect(fired.find((f) => f.id === 'V1-Q2-002')).toBeUndefined();
		expect(fired.find((f) => f.id === 'V1-Q2-003')).toBeUndefined();
		expect(fired.find((f) => f.id === 'V1-Q2-004')).toBeUndefined();
		expect(fired.find((f) => f.id === 'V1-Q2-005')).toBeUndefined();
	});

	it('active monocular branch requires which-eye, duration, adaptation, declaration', () => {
		const d = fullyCompletedAllNo();
		d.visionInBothEyes.hasVisionInBothEyes = 'no';
		const fired = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired).toContain('V1-Q2-002');
		expect(fired).toContain('V1-Q2-003');
		expect(fired).toContain('V1-Q2-004');
		expect(fired).toContain('V1-Q2-005');
	});

	it('Q3 cause sub-question only required when causedSolelyByEyeCondition is no', () => {
		const d = fullyCompletedAllNo();
		d.fieldOfVision.hasProblem = 'yes';
		d.fieldOfVision.causedSolelyByEyeCondition = 'yes';
		const fired = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired).not.toContain('V1-Q3-003');

		d.fieldOfVision.causedSolelyByEyeCondition = 'no';
		const fired2 = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired2).toContain('V1-Q3-003');
	});

	it('Q3 other-cause details required only when cause is "other"', () => {
		const d = fullyCompletedAllNo();
		d.fieldOfVision.hasProblem = 'yes';
		d.fieldOfVision.causedSolelyByEyeCondition = 'no';
		d.fieldOfVision.cause = 'stroke';
		const fired = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired).not.toContain('V1-Q3-004');

		d.fieldOfVision.cause = 'other';
		const fired2 = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired2).toContain('V1-Q3-004');

		d.fieldOfVision.causeOtherDetails = 'Migraine aura';
		const fired3 = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired3).not.toContain('V1-Q3-004');
	});

	it('Q9 6-month sub-question only required when controlled is no', () => {
		const d = fullyCompletedAllNo();
		d.doubleVision.hasCondition = 'yes';
		d.doubleVision.controlled = 'yes';
		d.doubleVision.doubleVisionDeclarationConfirmed = true;
		d.doubleVision.declarationSignatureName = 'John Driver';
		d.doubleVision.declarationDate = '2026-04-30';
		const fired = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired).not.toContain('V1-Q9-003');

		d.doubleVision.controlled = 'no';
		const fired2 = validateV1(d).firedValidations.map((f) => f.id);
		expect(fired2).toContain('V1-Q9-003');
	});
});

describe('DVLA V1 flagged-issue detection', () => {
	it('produces no flags on an unproblematic all-No completed form with recent contact', () => {
		const d = fullyCompletedAllNo();
		// Recent contact "yes" path avoids the low-priority no-contact flag.
		d.recentContact.hadContact = 'yes';
		d.recentContact.dateOfContact = '2025-12-01';
		const flags = detectFlaggedIssues(d);
		expect(flags).toEqual([]);
	});

	it('flags absence of recent healthcare contact at LOW priority', () => {
		const d = fullyCompletedAllNo();
		const flags = detectFlaggedIssues(d);
		const f = flags.find((x) => x.id === 'V1-FLAG-CONTACT-001');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('low');
	});

	it('escalates failure to meet eyesight standard to URGENT', () => {
		const d = fullyCompletedAllNo();
		d.eyesightStandards.meetsStandard = 'no';
		const flags = detectFlaggedIssues(d);
		const urgent = flags.find((f) => f.id === 'V1-FLAG-EYE-001');
		expect(urgent).toBeDefined();
		expect(urgent?.priority).toBe('urgent');
		expect(flags[0].priority).toBe('urgent');
	});

	it('flags monocular vision without adaptation as HIGH', () => {
		const d = fullyCompletedAllNo();
		d.visionInBothEyes.hasVisionInBothEyes = 'no';
		d.visionInBothEyes.whichEye = 'left';
		d.visionInBothEyes.duration = 'health-or-injury';
		d.visionInBothEyes.adaptation = 'not-adapted';
		d.visionInBothEyes.monocularDeclarationConfirmed = true;
		const flags = detectFlaggedIssues(d);
		const f = flags.find((x) => x.id === 'V1-FLAG-MONO-001');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('high');
	});

	it('flags uncontrolled blepharospasm as HIGH', () => {
		const d = fullyCompletedAllNo();
		d.blepharospasm.hasCondition = 'yes';
		d.blepharospasm.whichEyes = 'both';
		d.blepharospasm.hasHadTreatment = 'yes';
		d.blepharospasm.adequatelyControlled = 'no';
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'V1-FLAG-BLEPH-001' && f.priority === 'high')).toBe(
			true
		);
	});

	it('flags uncontrolled diplopia not-stable-yet as URGENT', () => {
		const d = fullyCompletedAllNo();
		d.doubleVision.hasCondition = 'yes';
		d.doubleVision.controlled = 'no';
		d.doubleVision.sameForSixMonthsOrMore = 'no';
		d.doubleVision.doubleVisionDeclarationConfirmed = true;
		d.doubleVision.declarationSignatureName = 'John Driver';
		d.doubleVision.declarationDate = '2026-04-30';
		const flags = detectFlaggedIssues(d);
		const f = flags.find((x) => x.id === 'V1-FLAG-DV-002');
		expect(f).toBeDefined();
		expect(f?.priority).toBe('urgent');
	});

	it('flags bilateral glaucoma higher priority than unilateral', () => {
		const d = fullyCompletedAllNo();
		d.glaucoma.hasCondition = 'yes';
		d.glaucoma.whichEyes = 'both';
		const flagsBoth = detectFlaggedIssues(d);
		const fBoth = flagsBoth.find((f) => f.id === 'V1-FLAG-GLA-001');
		expect(fBoth?.priority).toBe('high');

		d.glaucoma.whichEyes = 'left';
		const flagsLeft = detectFlaggedIssues(d);
		const fLeft = flagsLeft.find((f) => f.id === 'V1-FLAG-GLA-001');
		expect(fLeft?.priority).toBe('medium');
	});

	it('sorts flags by priority (urgent > high > medium > low)', () => {
		const d = fullyCompletedAllNo();
		d.eyesightStandards.meetsStandard = 'no'; // urgent
		d.glaucoma.hasCondition = 'yes';
		d.glaucoma.whichEyes = 'both'; // high
		d.nightBlindness.hasCondition = 'yes';
		d.nightBlindness.whichEyes = 'both'; // medium
		d.recentContact.hadContact = 'no'; // low
		const flags = detectFlaggedIssues(d);
		const order = { urgent: 0, high: 1, medium: 2, low: 3 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
