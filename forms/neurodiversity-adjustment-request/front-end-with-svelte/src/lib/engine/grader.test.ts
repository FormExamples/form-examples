import { describe, it, expect } from 'vitest';
import { calculateGrade } from './grader';
import { detectFlags } from './flags';
import { createDefaultRequest } from '$lib/stores/result.svelte';
import type { NeurodiversityAdjustmentRequest } from './types';

/**
 * A fully-completed, routine request: ADHD self-identified with low impact,
 * a working-arrangements adjustment, consent given. Grades to
 * possibly-covered / ok / 100% / routine / progress-to-meeting with no flags.
 */
function createRoutineRequest(): NeurodiversityAdjustmentRequest {
	return {
		...createDefaultRequest(),
		workerName: 'Alex Rivera',
		workerJobTitle: 'Data analyst',
		workerDepartment: 'Finance',
		employmentType: 'permanent',
		workPattern: 'full-time',
		workLocation: 'hybrid',
		managerName: 'Priya Shah',
		managerRole: 'line-manager',
		status: 'submitted',
		requestedBy: 'worker',
		requestDate: '2026-06-10',
		conditionAdhd: true,
		diagnosisStatus: 'self-identified',
		considersDisability: 'unsure',
		disclosureConsent: true,
		difficultyConcentration: true,
		difficultyOrganisationTime: true,
		tasksSituationsAffected: 'Open-plan office is distracting during focused analysis work.',
		workerStrengths: 'Strong pattern recognition and creative problem solving.',
		adjustmentWorkingArrangements: true,
		adjustmentsRequestedDetail: 'Two remote days per week and quiet focus time in the mornings.',
		currentImpact: 'low',
		urgency: 'routine'
	};
}

/**
 * A high-risk request: substantial and long-term impact (likely-covered),
 * at risk of absence (high-risk impact + urgent priority), no OH input.
 */
function createHighRiskRequest(): NeurodiversityAdjustmentRequest {
	return {
		...createRoutineRequest(),
		workerName: 'Jordan Blake',
		conditionAutism: true,
		diagnosisStatus: 'diagnosed',
		considersDisability: 'yes',
		substantialLongTermImpact: true,
		difficultySensoryOverload: true,
		difficultyBurnoutWellbeing: true,
		currentImpact: 'severe',
		atRiskOfAbsence: true,
		occupationalHealthInvolved: false,
		urgency: 'routine'
	};
}

describe('Neurodiversity adjustment request four-axis engine', () => {
	it('grades a complete routine request as possibly-covered / ok / 100% / routine', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.eligibilityBand).toBe('possibly-covered');
		expect(g.impactBand).toBe('ok');
		expect(g.completenessPercent).toBe(100);
		expect(g.priorityTier).toBe('routine');
		expect(g.recommendation).toBe('progress-to-meeting');
		expect(g.flags).toHaveLength(0);
		expect(g.firedRules.some((r) => r.ruleId === 'R-ELIG-NEURODIVERGENCE-PRESENT')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-IMPACT-OK')).toBe(true);
		expect(g.firedRules.some((r) => r.ruleId === 'R-PRIORITY-REQUESTED')).toBe(true);
	});

	it('marks a substantial and long-term impact as likely-covered (Axis A)', () => {
		const r = createRoutineRequest();
		r.substantialLongTermImpact = true;
		const g = calculateGrade(r);
		expect(g.eligibilityBand).toBe('likely-covered');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-ELIG-SUBSTANTIAL-LONG-TERM')).toBe(true);
	});

	it('drives impact to high-risk and priority to urgent when at risk of absence (Axes B, D)', () => {
		const r = createRoutineRequest();
		r.atRiskOfAbsence = true;
		const g = calculateGrade(r);
		expect(g.impactBand).toBe('high-risk');
		expect(g.priorityTier).toBe('urgent');
		expect(g.targetTimeframe).toBe('Within 5 working days (act without unreasonable delay)');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-IMPACT-ABSENCE-RISK')).toBe(true);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PRIORITY-ABSENCE-RISK')).toBe(true);
	});

	it('escalates priority to soon on high impact without an absence risk', () => {
		const r = createRoutineRequest();
		r.currentImpact = 'high';
		const g = calculateGrade(r);
		expect(g.impactBand).toBe('caution');
		expect(g.priorityTier).toBe('soon');
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-PRIORITY-HIGH')).toBe(true);
	});

	it('computes weighted partial completeness when the neurodivergent profile is missing', () => {
		const r = createRoutineRequest();
		r.conditionAdhd = false;
		r.conditionOtherDetail = '';
		const g = calculateGrade(r);
		// conditions (weight 3) of 18 total missing → 15/18 ≈ 83%.
		expect(g.completenessPercent).toBe(83);
		expect(g.firedRules.some((rule) => rule.ruleId === 'R-COMPLETE-CONDITIONS')).toBe(true);
	});

	it('recommends more detail when the request is materially incomplete', () => {
		const g = calculateGrade(createDefaultRequest());
		expect(g.completenessPercent).toBeLessThan(50);
		expect(g.recommendation).toBe('request-more-detail');
	});

	it('produces stable, unique rule IDs', () => {
		const g = calculateGrade(createHighRiskRequest());
		const ids = g.firedRules.map((r) => r.ruleId);
		expect(new Set(ids).size).toBe(ids.length);
	});
});

describe('Neurodiversity adjustment request flag detection', () => {
	it('raises the disability-duty-engaged flag when eligibility is likely-covered', () => {
		const r = createHighRiskRequest();
		const g = calculateGrade(r);
		expect(g.eligibilityBand).toBe('likely-covered');
		expect(g.flags.some((f) => f.flagId === 'F-DISABILITY-DUTY-001')).toBe(true);
		expect(g.flags.some((f) => f.category === 'burnout-risk' && f.priority === 'high')).toBe(true);
		expect(g.flags.some((f) => f.category === 'occupational-health-recommended')).toBe(true);
		expect(g.recommendation).toBe('seek-occupational-health');
	});

	it('flags no-consent-to-share when disclosure consent is withheld', () => {
		const r = createRoutineRequest();
		r.disclosureConsent = false;
		const flags = detectFlags(r, 'possibly-covered', 'ok');
		expect(flags.some((f) => f.category === 'no-consent-to-share')).toBe(true);
	});

	it('flags missing adjustments and missing difficulties on a blank request', () => {
		const flags = detectFlags(createDefaultRequest(), 'unclear', 'ok');
		expect(flags.some((f) => f.category === 'missing-adjustments')).toBe(true);
		expect(flags.some((f) => f.category === 'missing-difficulties')).toBe(true);
	});

	it('signposts Access to Work for an equipment request without it', () => {
		const r = createRoutineRequest();
		r.adjustmentEquipmentTechnology = true;
		r.accessToWorkInvolved = false;
		const g = calculateGrade(r);
		expect(g.flags.some((f) => f.category === 'access-to-work-recommended')).toBe(true);
		expect(g.recommendation).toBe('signpost-access-to-work');
	});

	it('sorts flags high → medium → low', () => {
		const r = createHighRiskRequest();
		const flags = detectFlags(r, 'likely-covered', 'high-risk');
		const order = { high: 0, medium: 1, low: 2 } as const;
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((x, y) => order[x] - order[y]);
		expect(priorities).toEqual(sorted);
	});

	it('returns no flags for a complete routine request', () => {
		const g = calculateGrade(createRoutineRequest());
		expect(g.flags).toHaveLength(0);
	});
});
