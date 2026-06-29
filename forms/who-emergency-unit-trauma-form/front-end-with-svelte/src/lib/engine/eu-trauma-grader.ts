import type { AssessmentData, EuTraumaResult, FlagPriority } from './types';
import { validateEuTrauma } from './eu-trauma-validator';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Pure function: run the full WHO Emergency Unit (Trauma) engine over an
 * encounter.
 *
 * Combines the completeness validator and the flagged-issue detector into a
 * single `EuTraumaResult` so the wizard, the report, and the dashboard all
 * consume the same engine output. The result records the completeness status,
 * the assigned triage category, the flag counts by priority, and the single
 * highest outstanding priority — the classification used in place of a numeric
 * grade.
 */
export function gradeEuTrauma(data: AssessmentData): EuTraumaResult {
	const validation = validateEuTrauma(data);
	const flags = detectFlaggedIssues(data);

	const urgentCount = flags.filter((f) => f.priority === 'urgent').length;
	const highCount = flags.filter((f) => f.priority === 'high').length;
	const mediumCount = flags.filter((f) => f.priority === 'medium').length;
	const lowCount = flags.filter((f) => f.priority === 'low').length;

	const order: FlagPriority[] = ['urgent', 'high', 'medium', 'low'];
	const topPriority = order.find((p) => flags.some((f) => f.priority === p)) ?? null;

	return {
		validation,
		flags,
		triage: data.triage.category,
		complete: validation.complete,
		urgentCount,
		highCount,
		mediumCount,
		lowCount,
		topPriority,
		timestamp: new Date().toISOString()
	};
}
