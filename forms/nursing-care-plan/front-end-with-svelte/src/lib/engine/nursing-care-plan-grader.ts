import type { CarePlan, CompletenessClass, FiredRule, GradingResult, PlanStatus } from './types';
import {
	classifyProblem,
	hasEvaluation,
	hasGoal,
	hasIntervention,
	problemFiredRules
} from './nursing-care-plan-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Nursing Care Plan completeness grader. Pure functions: take a `CarePlan`
 * object (a parent header plus its array of problems, each with its own goal
 * and intervention arrays and an inline evaluation), grade each problem, roll
 * the problem classes up to a plan status, compute the completeness percent,
 * and attach the fired-rule audit trail and flagged issues. No side effects,
 * no I/O. This is NOT a numeric score. See spec §4.
 *
 * Plan status:
 *   no problems                                          -> 'incomplete'
 *   every problem 'complete' AND no high-priority flag   -> 'complete'
 *   every problem 'incomplete'                           -> 'incomplete'
 *   otherwise                                            -> 'partial'
 *
 * Completeness percent = present required elements / (problems * 3), rounded.
 */

/**
 * Completeness percent: the proportion of the three required elements (goal,
 * intervention, evaluation) present across all problems, 0–100, rounded.
 * Returns 0 for an empty plan.
 */
export function completenessPercent(plan: CarePlan): number {
	const problems = Array.isArray(plan.problems) ? plan.problems : [];
	const required = problems.length * 3;
	if (required === 0) return 0;
	let present = 0;
	for (const p of problems) {
		if (hasGoal(p)) present += 1;
		if (hasIntervention(p)) present += 1;
		if (hasEvaluation(p)) present += 1;
	}
	return Math.round((100 * present) / required);
}

/** Roll the per-problem classes up to a plan status. */
export function planStatus(classes: CompletenessClass[], hasHighFlag: boolean): PlanStatus {
	if (classes.length === 0) return 'incomplete';
	const everyComplete = classes.every((c) => c === 'complete');
	if (everyComplete && !hasHighFlag) return 'complete';
	const everyIncomplete = classes.every((c) => c === 'incomplete');
	if (everyIncomplete) return 'incomplete';
	return 'partial';
}

/**
 * Grade a whole care plan: per-problem classes, plan status, completeness
 * percent, the fired-rule audit trail, flagged issues, and a timestamp. This is
 * the value the wizard stores in `assessment.result` and renders on the report.
 */
export function gradeCarePlan(plan: CarePlan): GradingResult {
	const problems = Array.isArray(plan.problems) ? plan.problems : [];

	const problemClasses = problems.map((p) => ({
		problemId: p.id,
		completenessClass: classifyProblem(p)
	}));

	let firedRules: FiredRule[] = [];
	problems.forEach((p, idx) => {
		firedRules = firedRules.concat(problemFiredRules(p, idx));
	});

	const flags = detectFlaggedIssues(plan);
	const hasHighFlag = flags.some((f) => f.priority === 'high');

	const status = planStatus(
		problemClasses.map((pc) => pc.completenessClass),
		hasHighFlag
	);

	return {
		status,
		completenessPercent: completenessPercent(plan),
		problemClasses,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
