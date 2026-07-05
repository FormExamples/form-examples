import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import type { NeurodiversityAdjustmentReview } from './types';

/** A fully-effective, complete, low-risk review fixture. */
function createEffectiveReview(): NeurodiversityAdjustmentReview {
	return {
		managerName: 'Priya Shah',
		managerRole: 'line-manager',
		managerJobTitle: 'Team Lead, Claims',
		managerDepartment: 'Operations',
		managerEmail: 'priya.shah@example.org',
		managerPhone: '020 7946 0011',
		responseReference: 'RES-2026-0044',
		reviewStatus: 'completed',
		reviewMethod: 'meeting',
		reviewDate: '2026-06-05',
		nextReviewDate: '2026-12-05',
		workerName: 'Sam Taylor',
		workerJobTitle: 'Claims Handler',
		workerDepartment: 'Operations',
		employeeReference: 'EMP-88213',
		workerEmail: 'sam.taylor@example.org',
		workerPhone: '',
		effectivenessWorkingEnvironment: 'working-well',
		effectivenessEquipmentTechnology: 'working-well',
		effectivenessWorkingArrangements: 'not-in-place',
		effectivenessCommunication: 'working-well',
		effectivenessSupportMentoring: 'not-in-place',
		effectivenessRecruitmentProcess: 'not-in-place',
		effectivenessPolicyDress: 'not-in-place',
		effectivenessOther: '',
		workerFeedback:
			'The quiet desk and headphones make a real difference; I can focus far better now.',
		workerSatisfied: 'yes',
		wellbeingChange: 'improved',
		barriersDetail: '',
		changesNeeded: false,
		changesDetail: '',
		updatedAdjustmentsDetail: '',
		occupationalHealthRereferral: false,
		escalated: false,
		escalationDetail: '',
		notes: '',
		signed: true
	};
}

/**
 * A failing review: adjustments not working, worker dissatisfied, wellbeing
 * worse — the primary adjustments-not-working case.
 */
function createFailingReview(): NeurodiversityAdjustmentReview {
	return {
		...createEffectiveReview(),
		reviewStatus: 'changes-agreed',
		effectivenessWorkingEnvironment: 'not-working',
		effectivenessEquipmentTechnology: 'not-working',
		effectivenessWorkingArrangements: 'not-in-place',
		effectivenessCommunication: 'not-in-place',
		effectivenessSupportMentoring: 'not-in-place',
		effectivenessRecruitmentProcess: 'not-in-place',
		effectivenessPolicyDress: 'not-in-place',
		effectivenessOther: '',
		workerSatisfied: 'no',
		wellbeingChange: 'worse',
		barriersDetail: 'The promised desk move never happened and the open-plan noise is worse.',
		occupationalHealthRereferral: false
	};
}

describe('Neurodiversity adjustment review — four-axis grading engine', () => {
	it('grades an all-working-well, complete review as effective / ok', () => {
		const g = calculateGrade(createEffectiveReview());
		expect(g.effectivenessBand).toBe('effective');
		expect(g.wellbeingRiskBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.nextStepUrgency).toBe('review-scheduled');
		expect(g.recommendation).toBe('maintain');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-EFFECT-EFFECTIVE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-WELL-OK')).toBe(true);
	});

	it('drives a not-working + dissatisfied + worse review to ineffective / high-risk / adjust-now', () => {
		const g = calculateGrade(createFailingReview());
		expect(g.effectivenessBand).toBe('ineffective');
		expect(g.wellbeingRiskBand).toBe('high-risk');
		expect(g.nextStepUrgency).toBe('adjust-now');
		expect(g.recommendation).toBe('seek-occupational-health');
		expect(g.flags.some((f) => f.flagId === 'F-ADJUSTMENTS-NOT-WORKING-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-WORKER-DISSATISFIED-001')).toBe(true);
		expect(g.flags.some((f) => f.flagId === 'F-WELLBEING-DECLINED-001')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-EFFECT-INEFFECTIVE')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-WELL-DECLINED')).toBe(true);
	});

	it('escalates the next step and recommends HR when escalated', () => {
		const r = createEffectiveReview();
		r.escalated = true;
		r.escalationDetail = 'Worker has raised a formal grievance about the unactioned desk move.';
		const g = calculateGrade(r);
		expect(g.nextStepUrgency).toBe('escalate');
		expect(g.targetTimeframe).toBe('Escalate now');
		expect(g.recommendation).toBe('escalate-to-hr');
		expect(g.wellbeingRiskBand).toBe('high-risk');
		expect(g.flags.some((f) => f.flagId === 'F-ESCALATION-001')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-NEXT-ESCALATED')).toBe(true);
	});

	it('raises the no-next-review flag and recommends scheduling when no next review is set', () => {
		const r = createEffectiveReview();
		r.nextReviewDate = '';
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.flagId === 'F-NO-NEXT-REVIEW-001')).toBe(true);
		expect(g.nextStepUrgency).toBe('none');
		expect(g.recommendation).toBe('schedule-next-review');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-NEXT-NONE')).toBe(true);
	});

	it('treats a partially-satisfied worker with a partial mix as partially-effective / caution', () => {
		const r = createEffectiveReview();
		r.effectivenessWorkingEnvironment = 'partial';
		r.workerSatisfied = 'partially';
		const g = calculateGrade(r);
		expect(g.effectivenessBand).toBe('partially-effective');
		expect(g.wellbeingRiskBand).toBe('caution');
		expect(g.flags.some((f) => f.flagId === 'F-WORKER-DISSATISFIED-001')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-EFFECT-PARTIAL')).toBe(true);
	});

	it('classifies a review with nothing rated as not-yet-assessed', () => {
		const r = createEffectiveReview();
		r.effectivenessWorkingEnvironment = '';
		r.effectivenessEquipmentTechnology = '';
		r.effectivenessWorkingArrangements = 'not-in-place';
		r.effectivenessCommunication = '';
		const g = calculateGrade(r);
		expect(g.effectivenessBand).toBe('not-yet-assessed');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-EFFECT-NOT-ASSESSED')).toBe(true);
	});

	it('raises changes-outstanding when changes are needed but not detailed', () => {
		const r = createEffectiveReview();
		r.changesNeeded = true;
		r.changesDetail = '';
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.flagId === 'F-CHANGES-OUTSTANDING-001')).toBe(true);
		expect(g.nextStepUrgency).toBe('adjust-now');
		expect(g.recommendation).toBe('adjust-adjustments');
	});

	it('computes a weighted incomplete-review flag and partial completeness', () => {
		const r = createEffectiveReview();
		r.effectivenessWorkingEnvironment = '';
		r.effectivenessEquipmentTechnology = '';
		r.effectivenessCommunication = '';
		r.workerFeedback = '';
		r.workerSatisfied = '';
		r.wellbeingChange = '';
		r.nextReviewDate = '';
		r.reviewMethod = '';
		const g = calculateGrade(r);
		expect(g.completenessPercent).toBeLessThan(60);
		expect(g.flags.some((f) => f.flagId === 'F-INCOMPLETE-REVIEW-001')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-WORKER-FEEDBACK')).toBe(true);
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createFailingReview());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('sorts flags high → medium → low', () => {
		const r = createFailingReview();
		r.escalated = true;
		r.nextReviewDate = '';
		const g = calculateGrade(r);
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = g.flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});
});
