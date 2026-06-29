// Four-axis grader for the Ambulatory Blood Pressure Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	AbpmRequest,
	AppropriatenessBand,
	FiredRule,
	GradingResult,
	Recommendation,
	SuitabilityBand,
	TriageTier
} from './types';
import {
	scoreAppropriateness,
	scoreSuitability,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall vetting recommendation from the four axes. The
 * least-alarming recommendation wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	suitabilityBand: SuitabilityBand,
	completenessPercent: number,
	_triageTier: TriageTier
): Recommendation {
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (suitabilityBand === 'limited') return 'redirect';
	return 'accept';
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / use alternative method',
	reject: 'Reject'
};

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: AbpmRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — suitability.
	const suitability = scoreSuitability(data);
	for (const r of suitability.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		suitability.band,
		completeness.percent,
		triage.tier
	);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		suitabilityBand: suitability.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
