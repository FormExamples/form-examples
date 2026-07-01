import type {
	CardiologyResponse,
	GradingResult,
	Recommendation,
	FiredRule
} from './types';
import { classifyResponse } from './classification-rules';
import { gradeSeverity } from './severity-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeFollowUp } from './follow-up-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis interpretation engine for a cardiology response.
 *
 * Computes:
 * - Axis A: response classification (no-abnormality / cardiac-condition /
 *   critical / inconclusive).
 * - Axis B: condition severity + structured-finding category.
 * - Axis C: response completeness percent (0–100).
 * - Axis D: follow-up urgency + target timeframe + recommended action.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a critical result auto-escalates Axis D to critical-alert and
 * raises the critical-finding flag, regardless of the other axes. The
 * least-urgent band is only chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(response: CardiologyResponse): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = classifyResponse(response);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeSeverity(response, a.responseClassification);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(response);
	firedRules.push(...c.firedRules);

	// Axis D
	const d = gradeFollowUp(response, a.responseClassification, b.severity);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.responseClassification,
		b.severity,
		d.followUpUrgency
	);

	const flags = detectFlags(response);

	return {
		responseClassification: a.responseClassification,
		severity: b.severity,
		severityCategory: b.severityCategory,
		completenessPercent: c.completenessPercent,
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
	if (severity === 'major') return 'specialist-management';
	if (classification === 'inconclusive') return 'further-investigation';
	if (severity === 'moderate') return 'further-investigation';
	if (severity === 'minor') return 'routine-follow-up';
	if (classification === 'no-abnormality') return 'no-action';
	return 'routine-follow-up';
}
