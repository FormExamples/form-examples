import type { AssessmentData, CFSScore, FiredRule, GradingResult } from './types';
import { cfsRules } from './cfs-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: evaluates all CFS rules against patient data.
 * Returns the maximum score among all fired rules (worst frailty level),
 * defaulting to CFS 1 for very fit patients with no fired rules.
 */
export function calculateCFS(data: AssessmentData): {
	cfsScore: CFSScore;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	for (const rule of cfsRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					domain: rule.domain,
					description: rule.description,
					score: rule.score
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading
			console.warn(`CFS rule ${rule.id} evaluation failed:`, e);
		}
	}

	const cfsScore: CFSScore =
		firedRules.length === 0
			? 1
			: (Math.max(...firedRules.map((r) => r.score)) as CFSScore);

	return { cfsScore, firedRules };
}

/**
 * Full grading entry point: computes the CFS score and fired rules, detects the
 * additional safety flags, and assembles the complete `GradingResult` that both
 * the wizard report and the dashboard rows are derived from.
 */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const { cfsScore, firedRules } = calculateCFS(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		cfsScore,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
