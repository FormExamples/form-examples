// Four-axis grader for the Echocardiogram Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end. Ported from the HTML engine's
// grader.js.

import type { AppropriatenessBand, EchoRequest, FiredRule, GradingResult, Recommendation } from './types';
import {
	scoreAppropriateness,
	scoreUrgency,
	scoreCompleteness,
	scorePriority
} from './rules';
import { detectFlags } from './flags';

/** Human-readable labels for the overall vetting recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable study',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the echo vetting desk from the axes.
 * Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'rarely-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine. No side effects, no I/O.
 *
 * - Axis A: appropriateness (1–9 score + band).
 * - Axis B: urgency triage tier (+ target timeframe), red-flag auto-escalation.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority band (low / moderate / high).
 */
export function calculateGrade(data: EchoRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.echoType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — urgency triage.
	const urgency = scoreUrgency(data);
	for (const r of urgency.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — clinical priority.
	const priority = scorePriority(data);
	for (const r of priority.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, completeness.percent);

	const flags = detectFlags(data, { appropriatenessBand: appr.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: urgency.tier,
		targetTimeframe: urgency.targetTimeframe,
		completenessPercent: completeness.percent,
		priorityBand: priority.band,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
