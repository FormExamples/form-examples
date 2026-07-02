import { describe, it, expect } from 'vitest';
import { calculateHealthCheckGrade, isHealthActionPlanComplete } from './ld-health-check-grader';
import { detectFlaggedIssues } from './flagged-issues';
import { componentRules } from './ld-health-check-rules';
import type { AssessmentData } from './types';

/**
 * A blank check (mirrors the store's `createDefaultAssessment`). Defined locally
 * so the engine tests never import the store, which pulls in the SvelteKit-only
 * `$app/environment` module.
 */
function createDefaultAssessment(): AssessmentData {
	return {
		context: {
			clinicianName: '',
			clinicianRole: '',
			checkedOn: '',
			practiceName: '',
			easyReadInvitationSent: '',
			preCheckDone: ''
		},
		identification: {
			personIdentifier: '',
			ageBand: '',
			sex: '',
			ldRegisterStatus: '',
			mainCarer: ''
		},
		adjustments: {
			communicationNeeds: '',
			reasonableAdjustmentsRecorded: '',
			healthPassport: '',
			consentCapacityNote: ''
		},
		physical: {
			weightBmiStatus: '',
			bmi: null,
			bloodPressureStatus: '',
			epilepsyStatus: '',
			constipationStatus: '',
			dysphagiaStatus: '',
			continenceStatus: '',
			mobilityFallsStatus: '',
			dentalStatus: '',
			visionStatus: '',
			hearingStatus: '',
			footHealthStatus: '',
			skinStatus: '',
			physicalHealthActions: ''
		},
		screening: {
			cancerScreeningStatus: '',
			otherScreeningStatus: '',
			immunisationStatus: ''
		},
		medication: {
			medicationReconciled: '',
			psychotropicPrescribed: '',
			psychotropicIndication: '',
			psychotropicLastReviewed: '',
			stompDiscussed: '',
			medicationSideEffects: ''
		},
		mental: {
			mentalHealthStatus: '',
			behaviourStatus: '',
			behaviourTriggers: ''
		},
		syndrome: {
			syndromeSpecificStatus: ''
		},
		carer: {
			carerNeedsStatus: '',
			socialCircumstances: ''
		},
		plan: {
			healthActionPlanProduced: '',
			healthActionPlanShared: '',
			healthActionPlanActions: '',
			clinicianNote: ''
		}
	};
}

/** A record with every required component completed (no problem findings). */
function createFullyComplete(): AssessmentData {
	const d = createDefaultAssessment();
	d.adjustments.reasonableAdjustmentsRecorded = 'yes';
	d.adjustments.communicationNeeds = 'Easy-read materials, longer appointment.';
	d.physical.weightBmiStatus = 'recorded';
	d.physical.bloodPressureStatus = 'normal';
	d.physical.epilepsyStatus = 'not-applicable';
	d.physical.constipationStatus = 'none';
	d.physical.dysphagiaStatus = 'none';
	d.physical.continenceStatus = 'ok';
	d.physical.mobilityFallsStatus = 'ok';
	d.physical.dentalStatus = 'ok';
	d.physical.visionStatus = 'ok';
	d.physical.hearingStatus = 'ok';
	d.physical.footHealthStatus = 'ok';
	d.physical.skinStatus = 'ok';
	d.screening.cancerScreeningStatus = 'up-to-date';
	d.screening.immunisationStatus = 'up-to-date';
	d.medication.medicationReconciled = 'yes';
	d.mental.mentalHealthStatus = 'ok';
	d.mental.behaviourStatus = 'none';
	d.syndrome.syndromeSpecificStatus = 'not-applicable';
	d.carer.carerNeedsStatus = 'assessed';
	d.plan.healthActionPlanProduced = 'yes';
	d.plan.healthActionPlanShared = 'yes';
	return d;
}

describe('LD annual health check — completeness grading', () => {
	it('has exactly 18 required components with unique ids', () => {
		expect(componentRules).toHaveLength(18);
		const ids = componentRules.map((r) => r.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('grades an empty check incomplete with 0% and no components completed', () => {
		const r = calculateHealthCheckGrade(createDefaultAssessment());
		expect(r.status).toBe('incomplete');
		expect(r.completenessPercent).toBe(0);
		expect(r.componentStatuses.filter((c) => c.completed)).toHaveLength(0);
		expect(r.healthActionPlanComplete).toBe(false);
	});

	it('grades a fully-completed check complete with 100%', () => {
		const r = calculateHealthCheckGrade(createFullyComplete());
		expect(r.status).toBe('complete');
		expect(r.completenessPercent).toBe(100);
		expect(r.componentStatuses.every((c) => c.completed)).toBe(true);
	});

	it('counts declined / not-applicable as completed but not-recorded / not-assessed as not', () => {
		const d = createDefaultAssessment();
		d.physical.weightBmiStatus = 'declined'; // completed
		d.physical.constipationStatus = 'not-assessed'; // NOT completed
		const r = calculateHealthCheckGrade(d);
		expect(r.componentStatuses.find((c) => c.id === 'weight-bmi')?.completed).toBe(true);
		expect(r.componentStatuses.find((c) => c.id === 'constipation')?.completed).toBe(false);
	});

	it('rounds the completeness percentage over the 18 components', () => {
		const d = createDefaultAssessment();
		d.adjustments.reasonableAdjustmentsRecorded = 'yes'; // 1 of 18
		const r = calculateHealthCheckGrade(d);
		expect(r.completenessPercent).toBe(Math.round((100 * 1) / 18)); // 6
	});
});

describe('LD annual health check — Health Action Plan gate', () => {
	it('is not complete unless the plan is both produced and shared', () => {
		const produced = createDefaultAssessment();
		produced.plan.healthActionPlanProduced = 'yes';
		expect(isHealthActionPlanComplete(produced)).toBe(false);

		const both = createDefaultAssessment();
		both.plan.healthActionPlanProduced = 'yes';
		both.plan.healthActionPlanShared = 'yes';
		expect(isHealthActionPlanComplete(both)).toBe(true);
	});

	it('keeps a check incomplete when every component is completed but the plan is missing', () => {
		const d = createFullyComplete();
		d.plan.healthActionPlanProduced = 'no';
		d.plan.healthActionPlanShared = 'no';
		const r = calculateHealthCheckGrade(d);
		expect(r.completenessPercent).toBe(100); // all 18 components done
		expect(r.status).toBe('incomplete'); // but the HAP gate fails
		expect(r.flags.some((f) => f.id === 'F-NO-HEALTH-ACTION-PLAN-001')).toBe(true);
	});
});

describe('LD annual health check — flagged-issue detection', () => {
	it('raises the STOMP flag when a psychotropic has no documented indication', () => {
		const d = createFullyComplete();
		d.medication.psychotropicPrescribed = 'yes';
		d.medication.psychotropicIndication = ''; // missing
		d.medication.psychotropicLastReviewed = '2026-01-10';
		d.medication.stompDiscussed = 'yes';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-STOMP-001')).toBe(true);
	});

	it('raises the STOMP flag when STOMP was not discussed', () => {
		const d = createFullyComplete();
		d.medication.psychotropicPrescribed = 'yes';
		d.medication.psychotropicIndication = 'Anxiety, long-standing.';
		d.medication.psychotropicLastReviewed = '2026-01-10';
		d.medication.stompDiscussed = 'no'; // not discussed
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-STOMP-001')).toBe(true);
	});

	it('raises the STOMP flag when there is no last-review date', () => {
		const d = createFullyComplete();
		d.medication.psychotropicPrescribed = 'yes';
		d.medication.psychotropicIndication = 'Anxiety, long-standing.';
		d.medication.psychotropicLastReviewed = ''; // no date
		d.medication.stompDiscussed = 'yes';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-STOMP-001')).toBe(true);
	});

	it('does not raise the STOMP flag when indication, discussion, and review date are present', () => {
		const d = createFullyComplete();
		d.medication.psychotropicPrescribed = 'yes';
		d.medication.psychotropicIndication = 'Anxiety, long-standing.';
		d.medication.psychotropicLastReviewed = '2026-01-10';
		d.medication.stompDiscussed = 'yes';
		const flags = detectFlaggedIssues(d, 'complete');
		expect(flags.some((f) => f.id === 'F-STOMP-001')).toBe(false);
	});

	it('raises the dysphagia and unaddressed-physical-health flags for an unactioned swallowing problem', () => {
		const d = createFullyComplete();
		d.physical.dysphagiaStatus = 'present';
		d.physical.physicalHealthActions = ''; // no action recorded
		const flags = detectFlaggedIssues(d, 'incomplete');
		expect(flags.some((f) => f.id === 'F-DYSPHAGIA-RISK-001')).toBe(true);
		expect(flags.some((f) => f.id === 'F-UNADDRESSED-PHYSICAL-HEALTH-001')).toBe(true);
	});

	it('raises the incomplete flag only when the status is incomplete', () => {
		expect(
			detectFlaggedIssues(createDefaultAssessment(), 'incomplete').some(
				(f) => f.id === 'F-INCOMPLETE-001'
			)
		).toBe(true);
		expect(
			detectFlaggedIssues(createFullyComplete(), 'complete').some((f) => f.id === 'F-INCOMPLETE-001')
		).toBe(false);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultAssessment(); // incomplete + missing HAP + missing adjustments
		d.screening.cancerScreeningStatus = 'not-recorded';
		const flags = detectFlaggedIssues(d, 'incomplete');
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});
});
