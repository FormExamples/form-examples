import type { AssessmentData, CompletenessStatus, FiredRule, GradingResult } from './types';
import { mandatoryRules } from './anaesthetic-record-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate every mandatory rule against the record, producing the audit trail
 * that mirrors the `anaesthetic_record_grade_rule` SQL table.
 */
export function evaluateRules(data: AssessmentData): FiredRule[] {
	return mandatoryRules.map((rule) => {
		let satisfied = false;
		try {
			satisfied = !!rule.satisfied(data);
		} catch (e) {
			// Rule evaluation failed — log for debugging but treat as unsatisfied.
			console.warn(`Mandatory rule ${rule.id} evaluation failed:`, e);
		}
		return {
			id: rule.id,
			category: rule.category,
			label: rule.label,
			satisfied
		};
	});
}

/**
 * Pure function: compute the completeness grade for the supplied record.
 *
 * Classification (spec §4):
 *   anyCriticalMissing         -> 'incomplete'
 *   else anyNoncriticalMissing -> 'partial'
 *   else                       -> 'complete'
 *
 * `completenessPercent` is the proportion of the mandatory rules satisfied,
 * rounded to a whole percent. Safety flags are computed independently by
 * `flagged-issues.ts` and attached to the result.
 */
export function calculateGrade(data: AssessmentData): GradingResult {
	const firedRules = evaluateRules(data);

	const total = firedRules.length;
	const satisfied = firedRules.filter((r) => r.satisfied).length;
	const completenessPercent = total > 0 ? Math.round((100 * satisfied) / total) : 0;

	const criticalMissing = firedRules.filter(
		(r) => r.category === 'critical' && !r.satisfied
	).length;
	const noncriticalMissing = firedRules.filter(
		(r) => r.category === 'noncritical' && !r.satisfied
	).length;

	let status: CompletenessStatus;
	if (criticalMissing > 0) {
		status = 'incomplete';
	} else if (noncriticalMissing > 0) {
		status = 'partial';
	} else {
		status = 'complete';
	}

	const flaggedIssues = detectFlaggedIssues(data, noncriticalMissing);

	return {
		status,
		completenessPercent,
		firedRules,
		criticalMissing,
		noncriticalMissing,
		flaggedIssues,
		timestamp: new Date().toISOString()
	};
}
