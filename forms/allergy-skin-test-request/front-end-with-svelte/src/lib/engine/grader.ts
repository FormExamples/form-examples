// Four-axis grader for the Allergy Skin Test Request.
//
// Ported from `front-end-form-with-html/js/grader.js`. Composes the rule sets in
// rules.ts and the safety flags in flags.ts into a single pure, deterministic
// grading result. The public entry point is `calculateGrade(data)`; the output
// shape and rule / flag IDs are identical across every front-end and back-end.

import type {
	RequestData,
	GradingResult,
	FiredRule,
	AppropriatenessBand,
	ValidityBand,
	Recommendation
} from './types';
import {
	scoreAppropriateness,
	noAllergenAppropriatenessRule,
	scoreValiditySafety,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall recommendation for the allergy vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriateness: AppropriatenessBand,
	validityBand: ValidityBand,
	completenessPercent: number
): Recommendation {
	if (validityBand === 'contraindicated') return 'redirect';
	if (appropriateness === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: RequestData): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.indication.primaryIndication, data.test.testType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	let appropriatenessScore = appr.score;
	let appropriatenessBand = appr.band;
	const noAllergen = noAllergenAppropriatenessRule(data.test);
	if (noAllergen) {
		firedRules.push(noAllergen);
		appropriatenessScore = Math.min(appropriatenessScore, 2);
		appropriatenessBand = 'usually-not-appropriate';
	}

	// Axis B — validity and safety.
	const validity = scoreValiditySafety(data);
	for (const r of validity.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appropriatenessBand, validity.band, completeness.percent);

	const flags = detectFlags(data);

	return {
		appropriatenessScore,
		appropriatenessBand,
		validitySafetyBand: validity.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation],
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
