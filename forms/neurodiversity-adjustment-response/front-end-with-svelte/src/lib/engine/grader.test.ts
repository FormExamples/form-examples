import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import type { NeurodiversityAdjustmentResponse } from './types';

/** A fully-agreed, complete, low-risk response fixture. */
function createFullyAgreedResponse(): NeurodiversityAdjustmentResponse {
	return {
		managerName: 'Priya Shah',
		managerRole: 'line-manager',
		managerJobTitle: 'Team Lead, Claims',
		managerDepartment: 'Operations',
		managerEmail: 'priya.shah@example.org',
		managerPhone: '020 7946 0011',
		requestReference: 'REQ-2026-0044',
		responseStatus: 'agreed',
		handlingMethod: 'meeting',
		assessedDate: '2026-06-01',
		respondedDate: '2026-06-05',
		effectiveDate: '2026-06-15',
		workerName: 'Sam Taylor',
		workerJobTitle: 'Claims Handler',
		workerDepartment: 'Operations',
		employeeReference: 'EMP-88213',
		workerEmail: 'sam.taylor@example.org',
		workerPhone: '',
		overallDecision: 'agreed',
		decisionRationale:
			'All requested adjustments are reasonable and low-cost; agreed in full following a supportive meeting.',
		declineReasonCategory: '',
		agreedWorkingEnvironment: true,
		agreedEquipmentTechnology: true,
		agreedWorkingArrangements: false,
		agreedCommunication: true,
		agreedSupportMentoring: false,
		agreedRecruitmentProcess: false,
		agreedPolicyDress: false,
		agreedOther: false,
		agreedAdjustmentsDetail:
			'Noise-cancelling headphones, a quiet desk away from the walkway, and written meeting agendas in advance.',
		alternativeAdjustmentsDetail: '',
		trialPeriod: false,
		trialPeriodWeeks: null,
		reviewScheduled: true,
		reviewDate: '2026-09-15',
		occupationalHealthReferred: false,
		accessToWorkReferred: true,
		supportResourcesDetail: 'Equipment ordered via facilities; £300 budget approved.',
		responsibilitiesDetail: 'Line manager to arrange the desk move; IT to supply the headphones.',
		pointOfContact: 'Priya Shah (line manager)',
		escalated: false,
		escalationDetail: '',
		notes: '',
		signed: true
	};
}

/**
 * A declined-with-no-rationale response fixture: the discrimination-risk case.
 */
function createDeclinedNoRationaleResponse(): NeurodiversityAdjustmentResponse {
	return {
		...createFullyAgreedResponse(),
		responseStatus: 'declined',
		overallDecision: 'declined',
		decisionRationale: '',
		declineReasonCategory: '',
		agreedWorkingEnvironment: false,
		agreedEquipmentTechnology: false,
		agreedCommunication: false,
		agreedAdjustmentsDetail: '',
		alternativeAdjustmentsDetail: '',
		reviewScheduled: false,
		reviewDate: '',
		escalated: false
	};
}

/**
 * A declined-but-justified response fixture: a rationale is recorded and the
 * decline-reason category is a real one (not 'not-reasonable'), nothing is
 * agreed, and nothing is escalated.
 */
function createDeclinedJustifiedResponse(): NeurodiversityAdjustmentResponse {
	return {
		...createDeclinedNoRationaleResponse(),
		decisionRationale:
			'The requested adjustable-height desk is not compatible with the shared workstation layout and no suitable alternative desk model is available within budget this quarter.',
		declineReasonCategory: 'disproportionate-cost'
	};
}

describe('Neurodiversity adjustment response — four-axis grading engine', () => {
	it('grades a fully-agreed, complete response as low-risk', () => {
		const g = calculateGrade(createFullyAgreedResponse());
		expect(g.outcomeClassification).toBe('fully-agreed');
		expect(g.legalRiskBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.followUpUrgency).toBe('review-scheduled');
		expect(g.recommendation).toBe('implement');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-OUTCOME-AGREED')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-LEGAL-OK')).toBe(true);
	});

	it('drives a declined-with-no-rationale response to high-risk with the discrimination-risk flag', () => {
		const g = calculateGrade(createDeclinedNoRationaleResponse());
		expect(g.outcomeClassification).toBe('declined');
		expect(g.legalRiskBand).toBe('high-risk');
		// Follow-up auto-escalates to urgent-review because of the high legal risk.
		expect(g.followUpUrgency).toBe('urgent-review');
		expect(g.recommendation).toBe('reconsider-decision');
		expect(g.firedRules.some((r) => r.ruleId === 'R-LEGAL-DECLINE-NO-RATIONALE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-LEGAL-DECLINE-NO-ALTERNATIVE')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-DISCRIMINATION-RISK-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-MISSING-RATIONALE-001')).toBe(true);
	});

	it('recommends record-decline for a justified decline with nothing agreed and no escalation', () => {
		// deriveRecommendation's waterfall used to fall all the way through to
		// 'implement' here -- misleading, since a decline has nothing to
		// implement. Not escalated, not high-risk (a rationale + real category
		// makes it 'caution' via R-LEGAL-DECLINE-JUSTIFIED, not 'high-risk'),
		// and nothing agreed, so none of the earlier branches fire either.
		const g = calculateGrade(createDeclinedJustifiedResponse());
		expect(g.outcomeClassification).toBe('declined');
		expect(g.legalRiskBand).toBe('caution');
		expect(g.firedRules.some((r) => r.ruleId === 'R-LEGAL-DECLINE-JUSTIFIED')).toBe(true);
		expect(g.recommendation).toBe('record-decline');
	});

	it('raises the no-review-scheduled flag when adjustments are agreed without a review', () => {
		const r = createFullyAgreedResponse();
		r.reviewScheduled = false;
		r.reviewDate = '';
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.flagId === 'F-NO-REVIEW-001')).toBe(true);
		expect(g.followUpUrgency).toBe('urgent-review');
		expect(g.recommendation).toBe('schedule-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FOLLOWUP-NO-REVIEW')).toBe(true);
	});

	it('escalates follow-up to escalation-needed and recommends HR when escalated', () => {
		const r = createFullyAgreedResponse();
		r.escalated = true;
		r.escalationDetail = 'Worker has raised a formal grievance about the desk-move delay.';
		const g = calculateGrade(r);
		expect(g.followUpUrgency).toBe('escalation-needed');
		expect(g.targetTimeframe).toBe('Escalate now');
		expect(g.recommendation).toBe('escalate-to-hr');
		expect(g.legalRiskBand).toBe('caution');
		expect(g.flags.some((f) => f.flagId === 'F-GRIEVANCE-001')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-FOLLOWUP-ESCALATED')).toBe(true);
	});

	it('treats a justified decline as caution, not high-risk', () => {
		const r = createDeclinedNoRationaleResponse();
		r.decisionRationale =
			'The requested bespoke software is not compatible with the secure network; alternative offered.';
		r.declineReasonCategory = 'operational-impact';
		r.alternativeAdjustmentsDetail = 'Offered an approved equivalent tool plus a screen-reading licence.';
		const g = calculateGrade(r);
		expect(g.legalRiskBand).toBe('caution');
		expect(g.flags.some((f) => f.flagId === 'F-DISCRIMINATION-RISK-001')).toBe(false);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-LEGAL-DECLINE-JUSTIFIED')).toBe(true);
	});

	it('flags undue delay when the response is more than 20 days after assessment', () => {
		const r = createFullyAgreedResponse();
		r.assessedDate = '2026-06-01';
		r.respondedDate = '2026-07-01';
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.flagId === 'F-UNDUE-DELAY-001')).toBe(true);
	});

	it('flags a trial period with no defined length', () => {
		const r = createFullyAgreedResponse();
		r.trialPeriod = true;
		r.trialPeriodWeeks = null;
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.flagId === 'F-NO-TRIAL-001')).toBe(true);
	});

	it('recommends occupational health for a deferred decision with no OH referral', () => {
		const r = createFullyAgreedResponse();
		r.overallDecision = 'deferred';
		r.responseStatus = 'deferred';
		r.occupationalHealthReferred = false;
		// Clear agreed adjustments so schedule-review does not pre-empt the ladder.
		r.agreedWorkingEnvironment = false;
		r.agreedEquipmentTechnology = false;
		r.agreedCommunication = false;
		const g = calculateGrade(r);
		expect(g.outcomeClassification).toBe('deferred');
		expect(g.recommendation).toBe('seek-occupational-health');
	});

	it('computes a weighted incomplete-response flag and partial completeness', () => {
		const r = createFullyAgreedResponse();
		r.decisionRationale = '';
		r.agreedAdjustmentsDetail = '';
		r.reviewScheduled = false;
		r.reviewDate = '';
		r.pointOfContact = '';
		r.effectiveDate = '';
		r.responsibilitiesDetail = '';
		const g = calculateGrade(r);
		expect(g.completenessPercent).toBeLessThan(60);
		expect(g.flags.some((f) => f.flagId === 'F-INCOMPLETE-001')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-RATIONALE')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createDeclinedNoRationaleResponse());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('sorts flags high → medium → low', () => {
		const r = createDeclinedNoRationaleResponse();
		r.escalated = true;
		r.trialPeriod = true;
		r.trialPeriodWeeks = 0;
		const g = calculateGrade(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = g.flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
