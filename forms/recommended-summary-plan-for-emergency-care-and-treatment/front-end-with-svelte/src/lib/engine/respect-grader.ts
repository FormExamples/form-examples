import type { AssessmentData, FiredRule, GradingResult, Status } from './types';
import { mandatoryRules, completenessSlots } from './respect-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the eight mandatory rules against the plan.
 */
export function evaluateRules(plan: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of mandatoryRules) {
		let satisfied = false;
		try {
			satisfied = rule.evaluate(plan) === true;
		} catch (e) {
			// Rule evaluation failed — log for debugging but continue grading.
			console.warn(`ReSPECT rule ${rule.id} evaluation failed:`, e);
		}
		fired.push({
			id: rule.id,
			rule: rule.rule,
			satisfied,
			category: rule.category,
			description: rule.description
		});
	}
	return fired;
}

/**
 * Compute the completeness percentage (0..100) from the field-slots. A slot
 * contributes to the denominator only when it applies (all slots apply except
 * the conditional capacity-proxy slot, which applies only when the person
 * lacks capacity).
 */
export function completenessPercent(plan: AssessmentData): number {
	let applicable = 0;
	let present = 0;
	for (const slot of completenessSlots) {
		const applies = slot.applies ? slot.applies(plan) === true : true;
		if (!applies) continue;
		applicable++;
		if (slot.present(plan) === true) present++;
	}
	if (applicable === 0) return 0;
	return Math.round((100 * present) / applicable);
}

/**
 * Pure function: compute the full completeness grade for the supplied plan.
 *
 * Algorithm (spec §4):
 *   firedRules          = each mandatory rule with { satisfied: boolean }
 *   satisfiedCount      = count(rules where satisfied)
 *   status              = satisfiedCount === 8 ? 'complete' : 'incomplete'
 *   completenessPercent = round(100 * presentSlots / applicableSlots)
 *
 * There is NO numeric clinical score. `completenessPercent` counts populated
 * mandatory fields, reported for both statuses so an incomplete plan still
 * shows progress. Flags are detected independently (`flagged-issues.ts`).
 */
export function calculateRespectGrade(plan: AssessmentData): GradingResult {
	const firedRules = evaluateRules(plan);
	const satisfiedCount = firedRules.filter((r) => r.satisfied).length;
	const mandatoryCount = firedRules.length;
	const status: Status = satisfiedCount === mandatoryCount ? 'complete' : 'incomplete';

	return {
		status,
		completenessPercent: completenessPercent(plan),
		satisfiedCount,
		mandatoryCount,
		firedRules,
		flaggedIssues: detectFlaggedIssues(plan),
		timestamp: new Date().toISOString()
	};
}
