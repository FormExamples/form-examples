import { describe, it, expect } from 'vitest';
import {
	review,
	gradeReviewStatus,
	computeComponentStatuses
} from './epilepsy-review-grader';
import { classifyControl, componentApplicable, COMPONENTS } from './epilepsy-review-rules';
import { detectFlaggedIssues } from './flagged-issues';
import type { AssessmentData } from './types';

/**
 * A blank review (mirrors the store's `createDefaultAssessment`). Defined
 * locally so the engine tests never import the store, which pulls in the
 * SvelteKit-only `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			reviewerName: '',
			reviewerRole: '',
			reviewedAt: '',
			careSetting: '',
			reviewType: '',
			monthsSinceLastReview: null
		},
		profile: {
			patientIdentifier: '',
			ageBand: '',
			sex: '',
			epilepsyType: '',
			ageAtOnset: null,
			yearsSinceDiagnosis: null,
			learningDisability: ''
		},
		seizures: {
			seizureTypes: '',
			seizureFrequency: '',
			lastSeizureDate: '',
			seizureFreeMonths: null,
			seizureTrend: ''
		},
		medication: { currentAsms: '', asmAdherence: '', asmSideEffects: '', drugLevel: null },
		triggers: { triggers: '' },
		sudep: { sudepDiscussed: '' },
		injuries: { statusEpilepticus: '', seizureInjury: '' },
		safety: { dvlaEligible: '', currentlyDriving: '', bathingAdviceGiven: '' },
		childbearing: {
			womanOfChildbearingPotential: '',
			onValproate: '',
			pregnancyPreventionProgramme: '',
			folicAcid: '',
			contraceptionInteractionReviewed: ''
		},
		mentalHealth: { mentalHealthConcern: '' },
		summary: { specialistReviewNeeded: '', nextReviewDue: '', carePlan: '', reviewContext: '' }
	};
}

/** A seizure-free, fully-documented review (not a woman of childbearing potential). */
function createFullyDocumented(): AssessmentData {
	const d = createDefaultAssessment();
	d.profile.ageBand = '60-79';
	d.profile.sex = 'male';
	d.seizures.seizureFrequency = 'none';
	d.seizures.seizureTrend = 'seizure-free';
	d.seizures.seizureFreeMonths = 24;
	d.medication.currentAsms = 'lamotrigine 200 mg BD';
	d.medication.asmAdherence = 'good';
	d.medication.asmSideEffects = 'none';
	d.triggers.triggers = 'None identified.';
	d.sudep.sudepDiscussed = 'yes';
	d.injuries.statusEpilepticus = 'no';
	d.injuries.seizureInjury = 'no';
	d.safety.dvlaEligible = 'eligible';
	d.safety.currentlyDriving = 'no';
	d.safety.bathingAdviceGiven = 'yes';
	d.mentalHealth.mentalHealthConcern = 'none';
	d.summary.carePlan = 'Continue current management; 12-month recall.';
	d.summary.nextReviewDue = '2027-06-01';
	d.childbearing.womanOfChildbearingPotential = 'not-applicable';
	return d;
}

describe('seizure-control classification', () => {
	it('is seizure-free when there are no seizures', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'none';
		expect(classifyControl(d)).toBe('seizure-free');
	});

	it('is seizure-free on a seizure-free trend', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'less-than-monthly';
		d.seizures.seizureTrend = 'seizure-free';
		expect(classifyControl(d)).toBe('seizure-free');
	});

	it('is controlled when seizures are stable / decreasing', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'monthly';
		d.seizures.seizureTrend = 'stable';
		expect(classifyControl(d)).toBe('controlled');
	});

	it('is uncontrolled on an increasing trend', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'monthly';
		d.seizures.seizureTrend = 'increasing';
		expect(classifyControl(d)).toBe('uncontrolled');
	});

	it('is uncontrolled on weekly or daily frequency', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'weekly';
		expect(classifyControl(d)).toBe('uncontrolled');
		d.seizures.seizureFrequency = 'daily';
		expect(classifyControl(d)).toBe('uncontrolled');
	});

	it('is uncontrolled after status epilepticus regardless of frequency', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'none';
		d.injuries.statusEpilepticus = 'yes';
		expect(classifyControl(d)).toBe('uncontrolled');
	});
});

describe('review completeness', () => {
	it('is incomplete when the seizure gate is missing', () => {
		const d = createDefaultAssessment();
		d.medication.asmAdherence = 'good';
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(cs)).toBe('incomplete');
	});

	it('is incomplete when the medication gate is missing', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'none';
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(cs)).toBe('incomplete');
	});

	it('is partial when both gates are present but some domains are missing', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureFrequency = 'none';
		d.medication.asmAdherence = 'good';
		const cs = computeComponentStatuses(d);
		expect(gradeReviewStatus(cs)).toBe('partial');
	});

	it('is complete when all applicable domains are documented', () => {
		const cs = computeComponentStatuses(createFullyDocumented());
		expect(gradeReviewStatus(cs)).toBe('complete');
	});

	it('excludes the childbearing domains unless a woman of childbearing potential', () => {
		const d = createDefaultAssessment();
		const cs = computeComponentStatuses(d);
		expect(cs.some((c) => c.component === 'valproate-ppp')).toBe(false);
		d.childbearing.womanOfChildbearingPotential = 'yes';
		const cs2 = computeComponentStatuses(d);
		expect(cs2.some((c) => c.component === 'valproate-ppp')).toBe(true);
		expect(cs2.some((c) => c.component === 'folic-acid')).toBe(true);
	});

	it('componentApplicable gates the childbearing domains', () => {
		const d = createDefaultAssessment();
		const ppp = COMPONENTS.find((c) => c.component === 'valproate-ppp')!;
		expect(componentApplicable(ppp, d)).toBe(false);
		d.childbearing.womanOfChildbearingPotential = 'yes';
		expect(componentApplicable(ppp, d)).toBe(true);
	});
});

describe('full review engine', () => {
	it('grades an empty review incomplete and seizure-free with flags', () => {
		const r = review(createDefaultAssessment());
		expect(r.reviewStatus).toBe('incomplete');
		expect(r.flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('grades a fully-documented seizure-free review complete with no flags', () => {
		const r = review(createFullyDocumented());
		expect(r.reviewStatus).toBe('complete');
		expect(r.seizureControl).toBe('seizure-free');
		expect(r.flags).toHaveLength(0);
	});

	it('emits the seizure-control and completeness audit rows', () => {
		const r = review(createFullyDocumented());
		const sections = r.firedRules.map((x) => x.section);
		expect(sections).toContain('seizure-control');
		expect(sections).toContain('completeness');
	});

	it('reports completenessScore against the applicable domain total', () => {
		const r = review(createFullyDocumented());
		expect(r.completenessScore).toBe(r.componentStatuses.length);
	});
});

describe('flagged-issue detection', () => {
	it('raises the specialist-review flag for uncontrolled seizures', () => {
		const d = createDefaultAssessment();
		const flags = detectFlaggedIssues(d, { seizureControl: 'uncontrolled' });
		expect(flags.some((f) => f.id === 'F-SPECIALIST-REVIEW-001')).toBe(true);
	});

	it('raises the specialist-review flag on an increasing trend', () => {
		const d = createDefaultAssessment();
		d.seizures.seizureTrend = 'increasing';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-SPECIALIST-REVIEW-001')).toBe(true);
	});

	it('raises the valproate-ppp flag for a woman of childbearing potential on valproate without a PPP', () => {
		const d = createDefaultAssessment();
		d.childbearing.womanOfChildbearingPotential = 'yes';
		d.childbearing.onValproate = 'yes';
		d.childbearing.pregnancyPreventionProgramme = 'not-in-place';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-VALPROATE-PPP-001' && f.priority === 'high')).toBe(true);
	});

	it('does not raise the valproate-ppp flag when a PPP is in place', () => {
		const d = createDefaultAssessment();
		d.childbearing.womanOfChildbearingPotential = 'yes';
		d.childbearing.onValproate = 'yes';
		d.childbearing.pregnancyPreventionProgramme = 'in-place';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-VALPROATE-PPP-001')).toBe(false);
	});

	it('does not raise the valproate-ppp flag when not a woman of childbearing potential', () => {
		const d = createDefaultAssessment();
		d.childbearing.womanOfChildbearingPotential = 'not-applicable';
		d.childbearing.onValproate = 'yes';
		d.childbearing.pregnancyPreventionProgramme = 'not-in-place';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-VALPROATE-PPP-001')).toBe(false);
	});

	it('raises the status-epilepticus flag', () => {
		const d = createDefaultAssessment();
		d.injuries.statusEpilepticus = 'yes';
		expect(
			detectFlaggedIssues(d, {}).some((f) => f.id === 'F-STATUS-EPILEPTICUS-001')
		).toBe(true);
	});

	it('raises the driving-safety flag when driving while not DVLA-eligible', () => {
		const d = createDefaultAssessment();
		d.safety.currentlyDriving = 'yes';
		d.safety.dvlaEligible = 'not-eligible';
		expect(detectFlaggedIssues(d, {}).some((f) => f.id === 'F-DRIVING-SAFETY-001')).toBe(true);
	});

	it('raises a high mental-health flag for suicidality', () => {
		const d = createDefaultAssessment();
		d.mentalHealth.mentalHealthConcern = 'suicidality';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-MENTAL-HEALTH-001' && f.priority === 'high')).toBe(true);
	});

	it('raises a medium mental-health flag for depression', () => {
		const d = createDefaultAssessment();
		d.mentalHealth.mentalHealthConcern = 'depression';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-MENTAL-HEALTH-002' && f.priority === 'medium')).toBe(true);
	});

	it('raises the SUDEP flag when not discussed', () => {
		const d = createDefaultAssessment();
		expect(
			detectFlaggedIssues(d, {}).some((f) => f.id === 'F-SUDEP-NOT-DOCUMENTED-001')
		).toBe(true);
	});

	it('raises the poor-adherence and side-effects flags', () => {
		const d = createDefaultAssessment();
		d.medication.asmAdherence = 'poor';
		d.medication.asmSideEffects = 'significant';
		const flags = detectFlaggedIssues(d, {});
		expect(flags.some((f) => f.id === 'F-POOR-ADHERENCE-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-ASM-SIDE-EFFECTS-001')).toBe(true);
	});

	it('raises the folic-acid-missing flag for a woman of childbearing potential', () => {
		const d = createDefaultAssessment();
		d.childbearing.womanOfChildbearingPotential = 'yes';
		d.childbearing.folicAcid = 'no';
		expect(
			detectFlaggedIssues(d, {}).some((f) => f.id === 'F-FOLIC-ACID-MISSING-001')
		).toBe(true);
	});

	it('raises the overdue flag when more than 12 months since the last review', () => {
		const d = createDefaultAssessment();
		d.context.monthsSinceLastReview = 15;
		const flags = detectFlaggedIssues(d, { reviewStatus: 'complete' });
		expect(flags.some((f) => f.id === 'F-INCOMPLETE-001')).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment();
		d.injuries.statusEpilepticus = 'yes';
		d.medication.asmAdherence = 'poor';
		const flags = detectFlaggedIssues(d, {
			seizureControl: 'uncontrolled',
			reviewStatus: 'partial'
		});
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
