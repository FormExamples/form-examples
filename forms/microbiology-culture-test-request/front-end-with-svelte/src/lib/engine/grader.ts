import type {
	MicrobiologyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PreanalyticalBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scorePreanalytical } from './preanalytical-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a microbiology culture request.
 *
 * Computes:
 * - Axis A: appropriateness (1-9 score + usually-appropriate / may-be-appropriate
 *   / usually-not-appropriate band) from the UKHSA SMI specimen × indication match.
 * - Axis B: pre-analytical / specimen safety (ok / caution / reject-risk).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / stat) + target timeframe, with
 *   suspected sepsis auto-escalating to stat (NICE NG51).
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * No side effects, no network calls, no I/O. Rule / flag IDs are identical
 * across every front-end and the back-end.
 */
export function calculateGrade(data: MicrobiologyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(
		data.clinical.primaryIndication,
		data.specimen.specimenType,
		data.tests
	);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — pre-analytical / specimen safety.
	const preanalytical = scorePreanalytical(data);
	firedRules.push(...preanalytical.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(appr.band, preanalytical.band, completeness.percent);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		preanalyticalBand: preanalytical.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/** Mapping from recommendation key to its display label. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall vetting recommendation from the four axes. The
 * least-alarming recommendation wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	preanalyticalBand: PreanalyticalBand,
	completenessPercent: number
): Recommendation {
	if (preanalyticalBand === 'reject-risk') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (preanalyticalBand === 'caution') return 'query-referrer';
	return 'accept';
}
