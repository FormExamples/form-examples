import type { AssessmentData, FiredValidation } from './types';
import { v1Rules } from './v1-rules';

/**
 * Pure function: evaluates DVLA V1 completeness across the active branch.
 *
 * Each rule whose `evaluate` returns false is added to `firedValidations`.
 * Rules guarded by branch-active helpers automatically pass when their branch
 * is dormant, so the validator never demands fields that the conditional flow
 * has skipped.
 */
export function validateV1(data: AssessmentData): {
	firedValidations: FiredValidation[];
	isComplete: boolean;
	completionRatio: number;
} {
	const firedValidations: FiredValidation[] = [];
	let satisfiedCount = 0;

	for (const rule of v1Rules) {
		try {
			const ok = rule.evaluate(data);
			if (ok) {
				satisfiedCount++;
			} else {
				firedValidations.push({
					id: rule.id,
					section: rule.section,
					severity: rule.severity,
					description: rule.description,
					message: rule.message
				});
			}
		} catch (e) {
			console.warn(`DVLA V1 rule ${rule.id} evaluation failed:`, e);
		}
	}

	const errorCount = firedValidations.filter((f) => f.severity === 'error').length;
	const isComplete = errorCount === 0;
	const completionRatio = v1Rules.length === 0 ? 1 : satisfiedCount / v1Rules.length;

	return { firedValidations, isComplete, completionRatio };
}
