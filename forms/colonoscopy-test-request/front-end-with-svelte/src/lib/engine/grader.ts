// ──────────────────────────────────────────────
// Four-axis grader for the Colonoscopy Test Request.
//
// Composes the rule sets into a single pure, deterministic grading result. The
// output shape and rule / flag IDs are identical across every front-end and the
// back-end. No side effects, no network calls, no I/O.
// ──────────────────────────────────────────────

import type { ColonoscopyRequest, GradingResult, Recommendation, AppropriatenessBand, RiskBand, FiredRule } from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreUrgency } from './urgency-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreRisk } from './risk-rules';
import { detectFlags } from './flagged-issues';

/** Overall recommendation labels for the vetting desk. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / review before booking',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the endoscopy vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number,
	riskBand: RiskBand
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (riskBand === 'high') return 'redirect';
	return 'accept';
}

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: ColonoscopyRequest): GradingResult {
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

	const recommendation = deriveRecommendation(appr.band, completeness.percent, risk.band);

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
		riskBand: risk.band,
		anticoagulantAction: risk.anticoagulantAction,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
