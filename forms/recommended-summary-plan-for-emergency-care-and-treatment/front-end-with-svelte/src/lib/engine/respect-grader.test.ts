import { describe, it, expect } from 'vitest';
import { calculateRespectGrade } from './respect-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { mandatoryRules } from './respect-rules';
import type { AssessmentData } from './types';

/**
 * A blank plan (mirrors the store's `createDefaultAssessment`). Defined locally
 * so the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		personal: { personName: '', dateOfBirth: '', identifier: '', address: '', keyContact: '' },
		health: { healthSummary: '', diagnoses: '', existingDocuments: '' },
		preferences: { whatMatters: '', carePreferences: '' },
		recommendations: {
			priorityBalance: '',
			recommendedInterventions: '',
			notRecommendedInterventions: ''
		},
		cpr: { cprRecommendation: '', cprRationale: '', cprDiscussed: '' },
		ceilings: { hospitalTransfer: '', criticalCareAdmission: '', treatmentCeilings: '' },
		capacity: { hasCapacity: '', capacityAssessment: '', involvement: '', proxyDetails: '' },
		signOff: {
			clinicianName: '',
			clinicianRole: '',
			clinicianRegistration: '',
			signature: '',
			signedAt: '',
			seniorEndorsement: '',
			emergencyContacts: '',
			reviewDate: ''
		},
		note: ''
	};
}

/** A fully-complete plan for a person WITH capacity (all eight rules satisfied). */
function createCompletePlan(): AssessmentData {
	const p = createDefaultAssessment();
	p.personal = {
		personName: 'Margaret Ellis',
		dateOfBirth: '1940-03-12',
		identifier: '943 476 5919',
		address: '12 Elm Road',
		keyContact: 'Daughter — Jane Ellis'
	};
	p.health.healthSummary = 'Advanced heart failure, recurrent admissions, frailty.';
	p.preferences.whatMatters = 'Wishes to remain at home; fears breathlessness.';
	p.recommendations.priorityBalance = 'comfort';
	p.recommendations.recommendedInterventions = 'Symptom control at home.';
	p.cpr.cprRecommendation = 'do-not-attempt';
	p.cpr.cprRationale = 'Advanced frailty; CPR would not succeed.';
	p.cpr.cprDiscussed = 'yes';
	p.ceilings.hospitalTransfer = 'not-appropriate';
	p.capacity.hasCapacity = 'yes';
	p.signOff.clinicianName = 'Dr A. Okafor';
	p.signOff.clinicianRole = 'doctor';
	p.signOff.signature = 'Dr A. Okafor';
	p.signOff.signedAt = '2026-06-20T10:00';
	return p;
}

describe('ReSPECT completeness grader', () => {
	it('marks a blank plan incomplete with 0% completeness', () => {
		const r = calculateRespectGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.satisfiedCount).toBe(0);
		expect(r.mandatoryCount).toBe(8);
	});

	it('marks a fully-answered plan (person with capacity) complete at 100%', () => {
		const r = calculateRespectGrade(createCompletePlan());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.satisfiedCount).toBe(8);
	});

	it('the identity rule requires name, date of birth, and identifier', () => {
		const p = createCompletePlan();
		p.personal.identifier = '';
		const fired = calculateRespectGrade(p).firedRules;
		expect(fired.find((f) => f.id === 'R-IDENTITY-01')?.satisfied).toBe(false);
	});

	it('the CPR rule requires an explicit attempt / do-not-attempt value', () => {
		const p = createCompletePlan();
		p.cpr.cprRecommendation = '';
		const r = calculateRespectGrade(p);
		expect(r.firedRules.find((f) => f.id === 'R-CPR-01')?.satisfied).toBe(false);
		expect(r.status).toBe('incomplete');
	});

	it('capacity rule (R7) is satisfied for a person WITH capacity without a proxy', () => {
		const p = createCompletePlan();
		p.capacity.hasCapacity = 'yes';
		expect(
			calculateRespectGrade(p).firedRules.find((f) => f.id === 'R-CAPACITY-01')?.satisfied
		).toBe(true);
	});

	it('capacity rule (R7) requires assessment + non-person involvement when the person lacks capacity', () => {
		const p = createCompletePlan();
		p.capacity.hasCapacity = 'no';
		// Missing assessment / involvement → rule fails.
		expect(
			calculateRespectGrade(p).firedRules.find((f) => f.id === 'R-CAPACITY-01')?.satisfied
		).toBe(false);

		p.capacity.capacityAssessment = 'Assessed; lacks capacity for this decision.';
		p.capacity.involvement = 'legal-proxy';
		p.capacity.proxyDetails = 'Welfare attorney — Jane Ellis.';
		expect(
			calculateRespectGrade(p).firedRules.find((f) => f.id === 'R-CAPACITY-01')?.satisfied
		).toBe(true);
	});

	it('the conditional proxy slot enters the denominator only when the person lacks capacity', () => {
		// Person WITH capacity: 15 applicable slots, all present → 100%.
		const withCapacity = createCompletePlan();
		expect(calculateRespectGrade(withCapacity).completenessPercent).toBe(100);

		// Person WITHOUT capacity and no proxy: proxy slot now applies but is
		// absent, so completeness drops below 100%.
		const withoutCapacity = createCompletePlan();
		withoutCapacity.capacity.hasCapacity = 'no';
		expect(calculateRespectGrade(withoutCapacity).completenessPercent).toBeLessThan(100);
	});

	it('all rule IDs are unique', () => {
		const ids = mandatoryRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('ReSPECT flagged-issue detection', () => {
	it('raises no flags for a complete plan with capacity and a discussed DNACPR', () => {
		const flags = detectFlaggedIssues(createCompletePlan(), new Date('2026-06-21'));
		expect(flags).toHaveLength(0);
	});

	it('raises the CPR-not-documented flag when no recommendation is recorded', () => {
		const p = createDefaultAssessment();
		const flags = detectFlaggedIssues(p);
		expect(flags.some((f) => f.id === 'F-CPR-NOT-DOCUMENTED-001')).toBe(true);
	});

	it('raises the capacity-missing flag when the person lacks capacity without a proxy', () => {
		const p = createCompletePlan();
		p.capacity.hasCapacity = 'no';
		const flags = detectFlaggedIssues(p);
		expect(flags.some((f) => f.id === 'F-CAPACITY-MISSING-001')).toBe(true);
	});

	it('raises the no-signature flag when the plan is unsigned', () => {
		const p = createCompletePlan();
		p.signOff.signature = '';
		p.signOff.signedAt = '';
		const flags = detectFlaggedIssues(p);
		expect(flags.some((f) => f.id === 'F-NO-SIGNATURE-001')).toBe(true);
	});

	it('raises the DNACPR-without-discussion flag', () => {
		const p = createCompletePlan();
		p.cpr.cprRecommendation = 'do-not-attempt';
		p.cpr.cprDiscussed = 'no';
		const flags = detectFlaggedIssues(p);
		expect(flags.some((f) => f.id === 'F-DNACPR-NO-DISCUSSION-001')).toBe(true);
	});

	it('raises the review-date-passed flag when the review date is in the past', () => {
		const p = createCompletePlan();
		p.signOff.reviewDate = '2026-01-01';
		const flags = detectFlaggedIssues(p, new Date('2026-06-21'));
		expect(flags.some((f) => f.id === 'F-REVIEW-DATE-PASSED-001')).toBe(true);
	});

	it('raises the health-summary-missing flag when no summary is recorded', () => {
		const p = createCompletePlan();
		p.health.healthSummary = '';
		const flags = detectFlaggedIssues(p);
		expect(flags.some((f) => f.id === 'F-HEALTH-SUMMARY-MISSING-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const p = createDefaultAssessment();
		p.signOff.reviewDate = '2020-01-01'; // medium
		const flags = detectFlaggedIssues(p, new Date('2026-06-21'));
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
