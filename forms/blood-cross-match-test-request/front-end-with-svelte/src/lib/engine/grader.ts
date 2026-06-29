// Four-axis grader for the Blood Cross-Match Test Request.
//
// Ported from the HTML front-end's `grader.js` source of truth. Composes the
// rule sets in `rules.ts` and the safety flags in `flags.ts` into a single pure,
// deterministic grading result (apart from the report timestamp). The output
// shape and rule / flag IDs are identical across every front-end and the
// back-end.

import type {
	AppropriatenessBand,
	CrossMatchRequest,
	GradingResult,
	IdentitySafetyBand,
	Recommendation
} from './types';
import {
	scoreAppropriateness,
	scoreCompleteness,
	scoreIdentitySafety,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/** Human-readable label for an overall vetting recommendation. */
export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the transfusion-laboratory vetting desk
 * from the four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	identitySafetyBand: IdentitySafetyBand,
	completenessPercent: number
): Recommendation {
	if (identitySafetyBand === 'reject-risk') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (identitySafetyBand === 'caution') return 'query-referrer';
	return 'accept';
}

/** Public entry point. Pure and deterministic apart from the report timestamp. */
export function calculateGrade(data: CrossMatchRequest): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — identity / sample safety.
	const identity = scoreIdentitySafety(data);
	for (const r of identity.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, identity.band, completeness.percent);
	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		identitySafetyBand: identity.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
