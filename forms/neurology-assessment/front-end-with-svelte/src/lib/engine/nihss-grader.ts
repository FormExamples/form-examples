import type { AssessmentData, FiredRule, GradingResult } from './types';
import { nihssRules } from './nihss-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { nihssSeverityLabel } from './utils';

/**
 * Pure function: evaluates all NIHSS items against patient data.
 * Returns the total NIHSS score (0-42) and individual item scores.
 * NIHSS 0 = no stroke symptoms, 42 = maximum severity.
 */
export function calculateNIHSS(data: AssessmentData): {
	nihssScore: number;
	nihssSeverity: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	let totalScore = 0;

	for (const rule of nihssRules) {
		try {
			const score = rule.evaluate(data);
			if (score > 0) {
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score
				});
			}
			totalScore += score;
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue scoring
			console.warn(`NIHSS rule ${rule.id} evaluation failed:`, e);
		}
	}

	const nihssSeverity = nihssSeverityLabel(totalScore);

	return { nihssScore: totalScore, nihssSeverity, firedRules };
}

/**
 * Full grading entry point: computes the NIHSS score and severity, the fired
 * item rules, and the safety-critical additional flags, returning the complete
 * {@link GradingResult} shared by the wizard, report, and dashboard.
 */
export function gradeAssessment(data: AssessmentData): GradingResult {
	const { nihssScore, nihssSeverity, firedRules } = calculateNIHSS(data);
	const additionalFlags = detectAdditionalFlags(data);
	return {
		nihssScore,
		nihssSeverity,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
