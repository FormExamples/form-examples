// Four-axis grader for the Cystoscopy Test Request.
//
// Ported verbatim from the HTML front-end's js/grader.js. Composes the rule
// sets in rules.ts and the safety flags in flagged-issues.ts into a single
// pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	CystoscopyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	RiskBand,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	scoreUrgency,
	scoreCompleteness,
	scoreRisk
} from './rules';
import { detectFlags } from './flagged-issues';

/**
 * Derive an overall recommendation for the urology vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	_riskBand: RiskBand,
	completenessPercent: number,
	_twoWeekWaitEligible: boolean
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable pathway',
	reject: 'Reject'
};

/**
 * Pure four-axis vetting engine for a cystoscopy request. Pure and
 * deterministic; no side effects, no network calls, no I/O.
 */
export function calculateGrade(data: CystoscopyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.procedure);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — cancer-pathway urgency.
	const urgency = scoreUrgency(data);
	for (const r of urgency.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — pre-procedure risk.
	const risk = scoreRisk(data);
	for (const r of risk.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		risk.band,
		completeness.percent,
		urgency.twoWeekWaitEligible
	);

	const flags = detectFlags(data, { twoWeekWaitEligible: urgency.twoWeekWaitEligible });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: urgency.tier,
		targetTimeframe: urgency.targetTimeframe,
		twoWeekWaitEligible: urgency.twoWeekWaitEligible,
		completenessPercent: completeness.percent,
		riskBand: risk.band,
		anticoagulantAction: risk.anticoagulantAction,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
