import type { CardiacStressResult, GradingResult, Recommendation, FiredRule } from './types';
import { classifyResult } from './classification-rules';
import { gradeSeverity } from './severity-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeFollowUp } from './follow-up-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis interpretation engine for a cardiac stress test result.
 *
 * Computes:
 * - Axis A: result classification (normal / abnormal / critical / inconclusive).
 * - Axis B: abnormality severity + structured reporting category (Duke risk band).
 * - Axis C: report completeness percent (0–100).
 * - Axis D: follow-up urgency + target timeframe + recommended action.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a critical result (strongly positive test, exertional hypotension,
 * ischaemia at low workload, or a high-risk Duke treadmill score) auto-escalates
 * Axis D to critical-alert with an urgent cardiology referral and raises the
 * critical-result-alert flag, regardless of the other axes. The least-urgent
 * band is only chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(result: CardiacStressResult): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = classifyResult(result);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeSeverity(result, a.resultClassification);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(result);
	firedRules.push(...c.firedRules);

	// Axis D
	const d = gradeFollowUp(result, a.resultClassification, b.abnormalitySeverity);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.resultClassification,
		b.abnormalitySeverity,
		d.followUpUrgency
	);

	const flags = detectFlags(result);

	return {
		resultClassification: a.resultClassification,
		abnormalitySeverity: b.abnormalitySeverity,
		reportingCategory: b.reportingCategory,
		reportCompletenessPercent: c.reportCompletenessPercent,
		followUpUrgency: d.followUpUrgency,
		targetTimeframe: d.targetTimeframe,
		recommendedAction: d.recommendedAction,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/** Derives the overall recommendation from the graded axes. */
function deriveRecommendation(
	classification: string,
	severity: string,
	urgency: string
): Recommendation {
	if (urgency === 'critical-alert') return 'urgent-review';
	if (severity === 'major') return 'specialist-referral';
	if (classification === 'inconclusive') return 'further-imaging';
	if (severity === 'moderate') return 'further-imaging';
	if (severity === 'minor') return 'routine-follow-up';
	if (classification === 'normal') return 'no-action';
	return 'routine-follow-up';
}
