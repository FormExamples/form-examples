// Four-axis grader for the Coagulation Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	CoagulationTestRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PreanalyticalBand,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	evaluatePreanalytical,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/** Human-readable label for each overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject specimen'
};

/**
 * Derive an overall recommendation for the coagulation-laboratory vetting desk
 * from the four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	preanalyticalBand: PreanalyticalBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (preanalyticalBand === 'reject-risk') return 'reject';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a coagulation test request.
 *
 * Computes Axis A (appropriateness 1-9 + band), Axis B (pre-analytical specimen
 * safety ok / caution / reject-risk), Axis C (request completeness percent), and
 * Axis D (triage routine / urgent / stat + target timeframe), plus an overall
 * recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: active major bleeding or suspected DIC auto-escalate the triage
 * tier to stat regardless of the other axes. No side effects, no I/O.
 */
export function calculateGrade(data: CoagulationTestRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.clinical.primaryIndication, data.tests);
	firedRules.push(appr.firedRule);

	// Axis B — pre-analytical / specimen safety.
	const pre = evaluatePreanalytical(data.specimen);
	firedRules.push(pre.firedRule);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.missing);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(appr.band, pre.band, completeness.percent);

	const flags = detectFlags(data, { preanalyticalBand: pre.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		preanalyticalBand: pre.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
