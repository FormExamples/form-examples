import { describe, it, expect } from 'vitest';
import { completenessPercent, gradeCarePlan, planStatus } from './nursing-care-plan-grader';
import { classifyProblem } from './nursing-care-plan-rules';
import { detectFlaggedIssues } from './flagged-issues';
import type { CarePlan, Goal, Intervention, Problem } from './types';

/**
 * Blank fixtures defined LOCALLY so the engine tests never import the store,
 * which pulls in the SvelteKit-only `$app/environment` module.
 */
let seq = 0;
function uid(prefix: string): string {
	seq += 1;
	return `${prefix}-${seq}`;
}

function goal(over: Partial<Goal> = {}): Goal {
	return { id: uid('goal'), goalText: 'Achieve safe mobility', targetDate: '2026-07-10', met: '', ...over };
}

function intervention(over: Partial<Intervention> = {}): Intervention {
	return {
		id: uid('intervention'),
		interventionText: 'Assist with mobilisation twice daily',
		carriedOut: 'yes',
		...over
	};
}

function problem(over: Partial<Problem> = {}): Problem {
	return {
		id: uid('problem'),
		problemStatement: 'Risk of falls',
		adlCategory: 'mobilising',
		actualOrPotential: 'potential',
		assessmentData: 'Unsteady gait observed',
		linkedRisk: 'none',
		goals: [],
		interventions: [],
		evaluationNote: '',
		goalMet: '',
		nextReviewDate: '2026-07-10',
		...over
	};
}

function createDefaultCarePlan(): CarePlan {
	return {
		planContext: {
			nurseName: '',
			nurseRole: '',
			nmcNumber: '',
			authoredAt: '',
			careSetting: '',
			planType: '',
			modelUsed: ''
		},
		patient: { patientIdentifier: '', patientName: '', dateOfBirth: '', sex: '', wardLocation: '' },
		fallsRisk: { done: '', level: '', assessedOn: '', actioned: '' },
		pressureUlcerRisk: { done: '', level: '', assessedOn: '', actioned: '' },
		vteRisk: { done: '', level: '', assessedOn: '', actioned: '' },
		nutritionRisk: { done: '', level: '', assessedOn: '', actioned: '' },
		problems: [],
		summary: { handoverNote: '', reviewDate: '' }
	};
}

/** A complete problem: goal + intervention + evaluation. */
function completeProblem(): Problem {
	return problem({
		goals: [goal()],
		interventions: [intervention()],
		evaluationNote: 'Mobilising with supervision; goal on track',
		goalMet: 'partially-met'
	});
}

describe('nursing-care-plan per-problem completeness', () => {
	it('a statement-only problem is incomplete', () => {
		expect(classifyProblem(problem())).toBe('incomplete');
	});

	it('a problem with only a goal is partial', () => {
		expect(classifyProblem(problem({ goals: [goal()] }))).toBe('partial');
	});

	it('a problem with goal + intervention but no evaluation is partial', () => {
		expect(classifyProblem(problem({ goals: [goal()], interventions: [intervention()] }))).toBe(
			'partial'
		);
	});

	it('a problem with goal + intervention + evaluation is complete', () => {
		expect(classifyProblem(completeProblem())).toBe('complete');
	});

	it('a non-empty evaluation note alone satisfies evaluation', () => {
		const p = problem({ goals: [goal()], interventions: [intervention()], evaluationNote: 'Reviewed' });
		expect(classifyProblem(p)).toBe('complete');
	});

	it('goalMet of not-evaluated does NOT satisfy evaluation', () => {
		const p = problem({ goals: [goal()], interventions: [intervention()], goalMet: 'not-evaluated' });
		expect(classifyProblem(p)).toBe('partial');
	});
});

describe('nursing-care-plan plan roll-up', () => {
	it('an empty plan is incomplete', () => {
		expect(gradeCarePlan(createDefaultCarePlan()).status).toBe('incomplete');
	});

	it('all-incomplete problems roll up to incomplete', () => {
		const d = createDefaultCarePlan();
		d.problems = [problem(), problem()];
		expect(gradeCarePlan(d).status).toBe('incomplete');
	});

	it('all-complete problems (no high flag) roll up to complete', () => {
		const d = createDefaultCarePlan();
		d.problems = [completeProblem(), completeProblem()];
		expect(gradeCarePlan(d).status).toBe('complete');
	});

	it('a mix of complete and partial problems rolls up to partial', () => {
		const d = createDefaultCarePlan();
		d.problems = [completeProblem(), problem({ goals: [goal()] })];
		expect(gradeCarePlan(d).status).toBe('partial');
	});

	it('a high-priority flag prevents a complete roll-up', () => {
		const d = createDefaultCarePlan();
		// High falls risk, actioned but no linked intervention -> high flag fires.
		d.fallsRisk = { done: 'yes', level: 'high', assessedOn: '2026-07-01', actioned: 'yes' };
		d.problems = [completeProblem()];
		const r = gradeCarePlan(d);
		expect(r.flags.some((f) => f.priority === 'high')).toBe(true);
		expect(r.status).toBe('partial');
	});

	it('planStatus is a pure roll-up of classes + high-flag gate', () => {
		expect(planStatus(['complete', 'complete'], false)).toBe('complete');
		expect(planStatus(['complete', 'complete'], true)).toBe('partial');
		expect(planStatus(['incomplete', 'incomplete'], false)).toBe('incomplete');
		expect(planStatus([], false)).toBe('incomplete');
	});
});

describe('nursing-care-plan completeness percent', () => {
	it('is 0 for an empty plan', () => {
		expect(completenessPercent(createDefaultCarePlan())).toBe(0);
	});

	it('is 100 when every required element is present', () => {
		const d = createDefaultCarePlan();
		d.problems = [completeProblem()];
		expect(completenessPercent(d)).toBe(100);
	});

	it('is one third when only the goal is present', () => {
		const d = createDefaultCarePlan();
		d.problems = [problem({ goals: [goal()] })];
		expect(completenessPercent(d)).toBe(33);
	});
});

describe('nursing-care-plan flag detection', () => {
	it('raises risk-without-intervention for a high falls risk with no linked intervention', () => {
		const d = createDefaultCarePlan();
		d.fallsRisk = { done: 'yes', level: 'high', assessedOn: '2026-07-01', actioned: 'yes' };
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-RISK-NOINTERVENTION-falls')).toBe(true);
	});

	it('raises not-actioned for a high risk marked not actioned', () => {
		const d = createDefaultCarePlan();
		d.pressureUlcerRisk = { done: 'yes', level: 'high', assessedOn: '2026-07-01', actioned: 'no' };
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id === 'FLAG-RISK-NOACTION-pressure-ulcer')).toBe(true);
	});

	it('raises missing-evaluation for a goal+intervention problem with no evaluation', () => {
		const d = createDefaultCarePlan();
		d.problems = [problem({ goals: [goal()], interventions: [intervention()] })];
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id.startsWith('FLAG-NOEVAL-'))).toBe(true);
	});

	it('raises no-review-date for a problem missing a next review date', () => {
		const d = createDefaultCarePlan();
		d.problems = [problem({ nextReviewDate: '' })];
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id.startsWith('FLAG-NOREVIEW-'))).toBe(true);
	});

	it('raises overdue for an unmet goal past its target date', () => {
		const d = createDefaultCarePlan();
		d.problems = [
			problem({
				goals: [goal({ met: 'not-met', targetDate: '2000-01-01' })],
				interventions: [intervention()],
				evaluationNote: 'Reviewed'
			})
		];
		const flags = detectFlaggedIssues(d);
		expect(flags.some((f) => f.id.startsWith('FLAG-OVERDUE-'))).toBe(true);
	});

	it('sorts flags by priority (high first)', () => {
		const d = createDefaultCarePlan();
		d.fallsRisk = { done: 'yes', level: 'high', assessedOn: '2026-07-01', actioned: 'yes' };
		d.problems = [problem()]; // incomplete (low) + no-review handled
		const flags = detectFlaggedIssues(d);
		const order: Record<string, number> = { high: 0, medium: 1, low: 2 };
		const priorities = flags.map((f) => f.priority);
		const sorted = [...priorities].sort((a, b) => order[a] - order[b]);
		expect(priorities).toEqual(sorted);
	});

	it('gradeCarePlan attaches flags and a timestamp', () => {
		const r = gradeCarePlan(completeCarePlanFixture());
		expect(Array.isArray(r.flags)).toBe(true);
		expect(typeof r.timestamp).toBe('string');
	});
});

function completeCarePlanFixture(): CarePlan {
	const d = createDefaultCarePlan();
	d.problems = [completeProblem()];
	return d;
}
