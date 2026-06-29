import type { AssessmentData, FiredRule, GradingResult, SeverityLevel } from './types';
import { snot22Rules } from './snot22-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Classify a SNOT-22 total into a severity band.
 *
 * Severity bands:
 *   0  - 7  -> Mild     (minimal impact on daily life)
 *   8  - 19 -> Moderate (moderate impact; targeted management advised)
 *   >= 20   -> Severe   (significant impact; consider specialist referral)
 */
export function classifySnot22Score(score: number): SeverityLevel {
	if (score >= 20) return 'severe';
	if (score >= 8) return 'moderate';
	return 'mild';
}

/**
 * Pure function: sums every answered SNOT-22 item, classifies the result, and
 * collects red-flag clinician alerts.
 */
export function calculateSnot22(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let totalScore = 0;
	let answeredCount = 0;

	for (const rule of snot22Rules) {
		try {
			const { score, answered } = rule.evaluate(data);
			if (answered) {
				answeredCount++;
				totalScore += score;
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading.
			console.warn(`SNOT-22 rule ${rule.id} evaluation failed:`, e);
		}
	}

	const severityLevel = classifySnot22Score(totalScore);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		totalScore,
		severityLevel,
		answeredCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
