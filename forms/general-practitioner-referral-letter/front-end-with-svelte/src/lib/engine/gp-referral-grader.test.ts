import { describe, it, expect } from 'vitest';
import { gradeReferral, classifyUrgency } from './gp-referral-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { mandatoryFor } from './gp-referral-rules';
import type { AssessmentData } from './types';

/**
 * A blank referral (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		referrer: {
			referrerName: '',
			referrerRole: '',
			referrerRegistrationNumber: '',
			referringPractice: '',
			practiceAddress: '',
			referrerContact: '',
			referralDate: ''
		},
		patient: {
			patientIdentifier: '',
			patientName: '',
			patientDateOfBirth: '',
			patientSex: '',
			patientAddress: '',
			patientContact: '',
			accessNeeds: ''
		},
		destination: {
			referralSpecialty: '',
			namedClinician: '',
			receivingOrganisation: ''
		},
		urgencyInfo: {
			urgency: '',
			urgencyReason: '',
			suspectedCancerCriterion: '',
			suspectedCancerPathway: ''
		},
		clinical: {
			reasonForReferral: '',
			relevantHistory: '',
			presentingProblem: '',
			symptomDuration: '',
			redFlagSymptoms: ''
		},
		examination: { examinationFindings: '', investigationResults: '' },
		medications: { currentMedications: '', allergies: '' },
		expectations: { patientExpectations: '', consentToShare: '', safetyNetting: '' },
		review: { clinicalNote: '' }
	};
}

/** A routine referral with every always-mandatory field populated → Complete. */
function createCompleteRoutine(): AssessmentData {
	const r = createDefaultAssessment();
	r.patient.patientIdentifier = '943 476 5919';
	r.patient.patientName = 'James Okoro';
	r.patient.patientDateOfBirth = '1958-03-12';
	r.referrer.referrerName = 'Dr Priya Nair';
	r.referrer.referrerRole = 'gp';
	r.referrer.referringPractice = 'Elm Park Surgery';
	r.destination.referralSpecialty = 'Gastroenterology';
	r.urgencyInfo.urgency = 'routine';
	r.clinical.reasonForReferral = 'Change in bowel habit over three months.';
	r.clinical.relevantHistory = 'Type 2 diabetes; hypertension.';
	r.expectations.consentToShare = 'yes';
	r.expectations.safetyNetting = 'Return or call 111 if symptoms worsen.';
	return r;
}

describe('General Practitioner Referral Letter completeness grader', () => {
	it('marks a blank referral incomplete with 0% completeness', () => {
		const g = gradeReferral(createDefaultAssessment());
		expect(g.status).toBe('Incomplete');
		expect(g.completenessPercent).toBe(0);
		expect(g.presentCount).toBe(0);
		// A blank referral has no urgency selected → the always-mandatory set.
		expect(g.mandatoryCount).toBe(10);
	});

	it('marks a fully-populated routine referral Complete at 100%', () => {
		const g = gradeReferral(createCompleteRoutine());
		expect(g.status).toBe('Complete');
		expect(g.completenessPercent).toBe(100);
		expect(g.presentCount).toBe(10);
		expect(g.mandatoryCount).toBe(10);
	});

	it('reports a partial completeness percentage between 0 and 100', () => {
		const r = createDefaultAssessment();
		r.patient.patientIdentifier = '943 476 5919';
		r.patient.patientName = 'James Okoro';
		r.urgencyInfo.urgency = 'routine';
		const g = gradeReferral(r);
		expect(g.status).toBe('Incomplete');
		expect(g.completenessPercent).toBeGreaterThan(0);
		expect(g.completenessPercent).toBeLessThan(100);
	});

	it('expands the mandatory-field set for urgent referrals (adds urgency reason)', () => {
		const r = createCompleteRoutine();
		r.urgencyInfo.urgency = 'urgent';
		const g = gradeReferral(r);
		// urgencyReason is now mandatory but blank → 11 mandatory, one missing.
		expect(g.mandatoryCount).toBe(11);
		expect(g.status).toBe('Incomplete');
		r.urgencyInfo.urgencyReason = 'Rapidly progressive symptoms.';
		expect(gradeReferral(r).status).toBe('Complete');
	});

	it('expands the mandatory-field set for two-week-wait referrals (adds criterion and pathway)', () => {
		const r = createCompleteRoutine();
		r.urgencyInfo.urgency = 'two-week-wait';
		const g = gradeReferral(r);
		// Adds urgencyReason + suspectedCancerCriterion + suspectedCancerPathway.
		expect(g.mandatoryCount).toBe(13);
		expect(mandatoryFor(r).map((f) => f.id)).toContain(
			'R-MANDATORY-SUSPECTED-CANCER-CRITERION'
		);
		expect(g.status).toBe('Incomplete');
		r.urgencyInfo.urgencyReason = 'Iron-deficiency anaemia.';
		r.urgencyInfo.suspectedCancerCriterion = 'Iron-deficiency anaemia aged ≥ 60';
		r.urgencyInfo.suspectedCancerPathway = 'Lower gastrointestinal';
		expect(gradeReferral(r).status).toBe('Complete');
		expect(gradeReferral(r).completenessPercent).toBe(100);
	});

	it('echoes the selected urgency even for an incomplete referral', () => {
		const r = createDefaultAssessment();
		r.urgencyInfo.urgency = 'emergency';
		const g = gradeReferral(r);
		expect(g.status).toBe('Incomplete');
		expect(g.urgency).toBe('emergency');
		expect(classifyUrgency(r)).toBe('emergency');
	});

	it('all mandatory-field IDs are unique for the widest field set', () => {
		const r = createDefaultAssessment();
		r.urgencyInfo.urgency = 'two-week-wait';
		const ids = mandatoryFor(r).map((f) => f.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('General Practitioner Referral Letter flagged-issue detection', () => {
	it('raises no flags for a complete routine referral with consent and safety-netting', () => {
		expect(detectFlaggedIssues(createCompleteRoutine())).toHaveLength(0);
	});

	it('raises the suspected-cancer-pathway flag for a two-week-wait referral', () => {
		const r = createCompleteRoutine();
		r.urgencyInfo.urgency = 'two-week-wait';
		expect(
			detectFlaggedIssues(r).some((f) => f.id === 'F-SUSPECTED-CANCER-PATHWAY-001')
		).toBe(true);
	});

	it('raises the emergency-features flag for emergency urgency or a red-flag symptom', () => {
		const r = createCompleteRoutine();
		r.urgencyInfo.urgency = 'emergency';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-EMERGENCY-FEATURES-001')).toBe(true);

		const r2 = createCompleteRoutine();
		r2.clinical.redFlagSymptoms = 'Rectal bleeding; weight loss.';
		expect(detectFlaggedIssues(r2).some((f) => f.id === 'F-EMERGENCY-FEATURES-001')).toBe(true);
	});

	it('raises the mandatory-information-missing flag for a blank referral', () => {
		expect(
			detectFlaggedIssues(createDefaultAssessment()).some(
				(f) => f.id === 'F-MANDATORY-INFORMATION-MISSING-001'
			)
		).toBe(true);
	});

	it('raises the urgency-information-missing flag when urgent has no reason', () => {
		const r = createCompleteRoutine();
		r.urgencyInfo.urgency = 'urgent';
		r.urgencyInfo.urgencyReason = '';
		expect(
			detectFlaggedIssues(r).some((f) => f.id === 'F-URGENCY-INFORMATION-MISSING-001')
		).toBe(true);
	});

	it('raises the consent-not-documented flag when consent is not yes', () => {
		const r = createCompleteRoutine();
		r.expectations.consentToShare = 'no';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-CONSENT-NOT-DOCUMENTED-001')).toBe(true);
	});

	it('raises the no-safety-netting flag when safety-netting is blank', () => {
		const r = createCompleteRoutine();
		r.expectations.safetyNetting = '';
		expect(detectFlaggedIssues(r).some((f) => f.id === 'F-NO-SAFETY-NETTING-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const r = createDefaultAssessment();
		r.urgencyInfo.urgency = 'two-week-wait'; // high (+ urgency-info-missing medium)
		const flags = detectFlaggedIssues(r);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
