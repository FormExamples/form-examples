// Four-axis grader for the Mammography Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flagged-issues.ts
// into a single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end, and map onto the
// mammography_test_request_grade SQL columns.

import type {
	AppropriatenessBand,
	FiredRule,
	GradingResult,
	MammographyRequest,
	Recommendation
} from './types';
import { scoreAppropriateness, scoreUrgency, scoreCompleteness, scorePriority } from './rules';
import { detectFlags } from './flagged-issues';

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable examination',
	reject: 'Reject'
};

/**
 * Derive an overall vetting recommendation from the four axes. Least-alarming
 * wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a mammography test request.
 *
 * - Axis A: appropriateness 1–9 + band (ACR Appropriateness Criteria).
 * - Axis B: cancer-pathway urgency tier + target timeframe, with NICE NG12
 *   two-week-wait auto-escalation.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical-priority band (low / moderate / high).
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: MammographyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.examType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — cancer-pathway urgency.
	const urgency = scoreUrgency(data);
	for (const r of urgency.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — clinical priority.
	const priority = scorePriority(data);
	for (const r of priority.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, completeness.percent);

	const flags = detectFlags(data, {
		twoWeekWaitEligible: urgency.twoWeekWaitEligible,
		twoWeekWaitRationale: urgency.twoWeekWaitRationale
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: urgency.tier,
		targetTimeframe: urgency.targetTimeframe,
		twoWeekWaitEligible: urgency.twoWeekWaitEligible,
		twoWeekWaitRationale: urgency.twoWeekWaitRationale,
		completenessPercent: completeness.percent,
		priorityBand: priority.band,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation],
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
