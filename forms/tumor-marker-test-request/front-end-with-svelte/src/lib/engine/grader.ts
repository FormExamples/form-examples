// ──────────────────────────────────────────────
// Four-axis grader for the Tumor Marker Test Request
//
// Composes the rule sets and the safety flags into a single pure, deterministic
// grading result. The public entry point is `calculateGrade(data)`. The output
// shape and rule / flag IDs are identical across every front-end and the
// back-end. Ported from the HTML front-end's js/grader.js.
//
// No side effects, no network calls, no I/O.
// ──────────────────────────────────────────────

import type {
	AppropriatenessBand,
	GradingResult,
	InterpretationBand,
	Recommendation,
	TumorMarkerRequest
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreInterpretation } from './interpretation-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for each vetting recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / reconsider request',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the laboratory vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	interpretationBand: InterpretationBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (interpretationBand === 'misuse-risk') return 'redirect';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: TumorMarkerRequest): GradingResult {
	const firedRules: GradingResult['firedRules'] = [];

	// Axis A — appropriateness (marker-to-indication fit).
	const appr = scoreAppropriateness(data.markers, data.context.primaryIndication);
	for (const r of appr.firedRules) firedRules.push(r);

	// Axis B — interpretation safety.
	const interp = scoreInterpretation(data, { screeningMisuse: appr.screeningMisuse });
	for (const r of interp.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, interp.band, completeness.percent);

	const flags = detectFlags(data, {
		triageTier: triage.tier,
		mismatchedMarkers: appr.mismatchedMarkers,
		screeningMisuse: appr.screeningMisuse
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		interpretationBand: interp.band,
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
