import type { AssessmentData, FiredRule, GradingResult, MUSTRisk, SeverityLevel } from './types';
import { mustRules } from './must-rules';
import { detectAdditionalFlags } from './flagged-issues';
import { classifyMUSTScore, mustRiskToSeverity } from './utils';

/**
 * Decide whether to escalate to 'critical' severity given the assessment data
 * and the baseline severity from the MUST score. Escalation only applies when
 * the baseline severity is already 'high'.
 */
function escalateSeverity(d: AssessmentData, baseline: SeverityLevel): SeverityLevel {
	if (baseline !== 'high') return baseline;

	const bmi = d.anthropometricMeasurements.bmi;
	const weightLossPct = d.anthropometricMeasurements.weightLossPercent;

	if (bmi !== null && bmi !== undefined && bmi < 16) return 'critical';
	if (weightLossPct !== null && weightLossPct > 15) return 'critical';
	if (d.nutritionalScreening.acuteDisease === 'acutely-ill-no-intake-5d') return 'critical';
	if (
		d.swallowingOralHealth.swallowingDifficulty === 'yes' &&
		d.swallowingOralHealth.chokingEpisodes === 'yes'
	) {
		return 'critical';
	}
	if (d.currentNutritionalSupport.parenteralNutrition === 'yes') return 'critical';
	return baseline;
}

/**
 * Pure function: evaluates the 3-step MUST screening against the supplied
 * assessment data and produces the total score, risk band, overall severity
 * level, per-step audit trail, and clinician flags. Unanswered MUST steps
 * (evaluate() === -1) contribute nothing and are excluded from the audit trail.
 */
export function calculateNutritionGrade(data: AssessmentData): GradingResult {
	const firedRules: FiredRule[] = [];
	let totalScore = 0;
	let answeredCount = 0;

	for (const rule of mustRules) {
		try {
			const score = rule.evaluate(data);
			if (score >= 0) {
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
			console.warn(`MUST rule ${rule.id} evaluation failed:`, e);
		}
	}

	const mustScore = totalScore;
	const mustRisk: MUSTRisk = classifyMUSTScore(mustScore);
	const baselineSeverity = mustRiskToSeverity(mustRisk);
	const severity = escalateSeverity(data, baselineSeverity);
	const additionalFlags = detectAdditionalFlags(data);

	return {
		mustScore,
		mustRisk,
		severity,
		answeredCount,
		firedRules,
		additionalFlags,
		timestamp: new Date().toISOString()
	};
}
