import type {
	CytologyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PreanalyticalBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { evaluatePreanalytical } from './preanalytical-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable labels for the overall vetting recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / recollect',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the cytology vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	preanalyticalBand: PreanalyticalBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (preanalyticalBand === 'reject-risk') return 'redirect';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a cytology specimen request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + usually-appropriate / may-be-appropriate
 *   / usually-not-appropriate).
 * - Axis B: pre-analytical specimen adequacy (ok / caution / reject-risk).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / two-week-wait) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a suspected-cancer indication or a previous high-grade cytology
 * result auto-escalates the triage tier toward the two-week-wait pathway. The
 * least-alarming band is only chosen when no rule fires. No side effects.
 */
export function calculateGrade(data: CytologyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.specimenType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — pre-analytical specimen adequacy.
	const preanalytical = evaluatePreanalytical(data);
	if (preanalytical.firedRule) firedRules.push(preanalytical.firedRule);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		preanalytical.band,
		completeness.percent
	);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		preanalyticalBand: preanalytical.band,
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
