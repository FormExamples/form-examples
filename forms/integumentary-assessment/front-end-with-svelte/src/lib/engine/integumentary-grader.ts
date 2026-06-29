import type { AssessmentData, RiskLevel, FiredRule, GradingResult } from './types';
import { bradenRules } from './braden-rules';
import { detectAdditionalFlags } from './flagged-issues';

/**
 * Classify a numeric Braden score (6-23) into a risk level. Lower scores
 * indicate higher pressure-ulcer risk.
 *
 *   <=  9  -> Very High Risk
 *   10-12  -> High Risk
 *   13-14  -> Moderate Risk
 *   15-18  -> Mild Risk
 *   19-23  -> No Risk
 */
export function classifyBradenScore(score: number): RiskLevel {
	if (score <= 9) return 'very-high-risk';
	if (score <= 12) return 'high-risk';
	if (score <= 14) return 'moderate-risk';
	if (score <= 18) return 'mild-risk';
	return 'no-risk';
}

/**
 * Evaluate the 6-subscale Braden Scale and combine it with the flagged-issue
 * detector into a single grading result.
 *
 * If no subscales are answered, the total is reported as 23 (no risk) so an
 * empty submission classifies as "No Risk" rather than the highest-risk
 * extreme of 6.
 */
export function calculateIntegumentaryGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let totalScore = 0;
	let answeredCount = 0;

	for (const rule of bradenRules) {
		try {
			const score = rule.evaluate(data);
			if (score > 0) {
				answeredCount++;
				totalScore += score;
				firedRules.push({
					id: rule.id,
					category: rule.category,
					description: rule.description,
					score,
					maxScore: rule.maxScore
				});
			}
		} catch (e) {
			// Rule evaluation failed - log for debugging but continue grading
			console.warn(`Braden rule ${rule.id} evaluation failed:`, e);
		}
	}

	const bradenScore = answeredCount === 0 ? 23 : totalScore;
	const riskLevel = classifyBradenScore(bradenScore);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		bradenScore,
		riskLevel,
		answeredCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
