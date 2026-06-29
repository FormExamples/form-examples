import type { AssessmentData, MRCGrade, FiredRule, GradingResult } from './types';
import { mrcRules } from './mrc-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Pure function: evaluates all MRC rules against patient data.
 * Returns the maximum grade among all fired rules (worst finding),
 * defaulting to MRC 1 for patients with no fired rules.
 */
export function calculateMRC(data: AssessmentData): {
	mrcGrade: MRCGrade;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	for (const rule of mrcRules) {
		try {
			if (rule.evaluate(data)) {
				firedRules.push({
					id: rule.id,
					system: rule.system,
					description: rule.description,
					grade: rule.grade
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading
			console.warn(`MRC rule ${rule.id} evaluation failed:`, e);
		}
	}

	const mrcGrade: MRCGrade =
		firedRules.length === 0
			? 1
			: (Math.max(...firedRules.map((r) => r.grade)) as MRCGrade);

	return { mrcGrade, firedRules };
}

/**
 * Pure function: grades the full assessment, combining the MRC dyspnoea grade,
 * the rules that fired, and the safety-critical additional flags into a single
 * timestamped {@link GradingResult}. This is the shared engine entry point used
 * by both the wizard (on submit) and the dashboard (to derive rows).
 */
export function calculateRespirologyGrade(data: AssessmentData): GradingResult {
	const { mrcGrade, firedRules } = calculateMRC(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		mrcGrade,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
