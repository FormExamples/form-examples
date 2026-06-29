// Four-axis grader for the Angiography Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	AppropriatenessBand,
	GradingResult,
	Recommendation,
	RequestData,
	SafetyBand,
	TriageTier
} from './types';
import {
	scoreAppropriateness,
	scoreCompleteness,
	scoreSafety,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriateness: AppropriatenessBand,
	safetyBand: SafetyBand,
	completenessPercent: number,
	_triageTier: TriageTier
): Recommendation {
	if (safetyBand === 'contraindicated') return 'reject';
	if (appropriateness === 'usually-not-appropriate') return 'query-referrer';
	if (safetyBand === 'caution') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable examination',
	reject: 'Reject'
};

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: RequestData): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.angiographyType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — contrast / radiation safety.
	const safety = scoreSafety(data);
	for (const r of safety.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		safety.band,
		completeness.percent,
		triage.tier
	);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		safetyBand: safety.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags: detectFlags(data),
		timestamp: new Date().toISOString()
	};
}
