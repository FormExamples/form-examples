import type { CompletenessClass, FiredRule, Problem } from './types';

/**
 * Completeness rules for the Nursing Care Plan (pure functions).
 *
 * Unlike a scored instrument, this form GRADES COMPLETENESS: every problem is
 * worked through the nursing process (ADPIE) and should carry at least one
 * goal, at least one intervention, and an evaluation. This module holds the
 * per-problem predicates (`hasGoal`, `hasIntervention`, `hasEvaluation`), the
 * per-problem classifier (`classifyProblem`), and the audit-trail builder
 * (`problemFiredRules`) that records which of the three required elements are
 * present or missing for each problem. The plan-level roll-up lives in the
 * grader; the flagged issues live in `flagged-issues.ts`. See spec §4.
 */

/** True when the problem carries at least one goal. */
export function hasGoal(p: Problem): boolean {
	return Array.isArray(p.goals) && p.goals.length > 0;
}

/** True when the problem carries at least one intervention. */
export function hasIntervention(p: Problem): boolean {
	return Array.isArray(p.interventions) && p.interventions.length > 0;
}

/**
 * True when the problem carries an evaluation: either a free-text evaluation
 * note, or an explicit goal-met status other than "not-evaluated". An empty
 * `goalMet` ('') counts as not evaluated.
 */
export function hasEvaluation(p: Problem): boolean {
	const note = (p.evaluationNote || '').trim();
	const met = p.goalMet || '';
	return note !== '' || (met !== '' && met !== 'not-evaluated');
}

/**
 * Grade a single problem's completeness.
 *   Complete   — goal AND intervention AND evaluation
 *   Partial    — some but not all of the three
 *   Incomplete — none of the three (a problem statement only)
 */
export function classifyProblem(p: Problem): CompletenessClass {
	const g = hasGoal(p);
	const i = hasIntervention(p);
	const e = hasEvaluation(p);
	if (g && i && e) return 'complete';
	if (g || i || e) return 'partial';
	return 'incomplete';
}

/**
 * Build the completeness audit trail for one problem: one FiredRule per
 * required ADPIE element (goal / intervention / evaluation), recording whether
 * it is present.
 * @param p the problem
 * @param index zero-based index of the problem within the plan
 */
export function problemFiredRules(p: Problem, index: number): FiredRule[] {
	const label = `Problem ${index + 1}`;
	const g = hasGoal(p);
	const i = hasIntervention(p);
	const e = hasEvaluation(p);
	return [
		{
			id: `${p.id}-goal`,
			problemId: p.id,
			problemLabel: label,
			element: 'goal',
			present: g,
			description: g ? `${label}: goal recorded (${p.goals.length})` : `${label}: no goal recorded`
		},
		{
			id: `${p.id}-intervention`,
			problemId: p.id,
			problemLabel: label,
			element: 'intervention',
			present: i,
			description: i
				? `${label}: intervention recorded (${p.interventions.length})`
				: `${label}: no intervention recorded`
		},
		{
			id: `${p.id}-evaluation`,
			problemId: p.id,
			problemLabel: label,
			element: 'evaluation',
			present: e,
			description: e ? `${label}: evaluation recorded` : `${label}: no evaluation recorded`
		}
	];
}
