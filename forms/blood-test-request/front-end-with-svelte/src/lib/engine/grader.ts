import type {
	AppropriatenessBand,
	BloodTestRequest,
	FiredRule,
	GradingResult,
	PreanalyticalBand,
	Recommendation
} from './types';
import { countSelectedPanels } from './panels';
import { scoreAppropriateness } from './appropriateness-rules';
import { scorePreanalytical } from './preanalytical-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for each overall recommendation. */
export const RECOMMENDATION_LABELS: Record<Exclude<Recommendation, ''>, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the laboratory vetting desk from the
 * four axes. The least-alarming outcome wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	preanalyticalBand: PreanalyticalBand,
	completenessPercent: number,
	selectedCount: number
): Recommendation {
	if (selectedCount === 0) return 'reject';
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (preanalyticalBand === 'reject-risk') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a blood-test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + band) anchored on RCPath retesting
 *   intervals + indication match.
 * - Axis B: pre-analytical / specimen safety (ok / caution / reject-risk) +
 *   fasting violation.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / stat) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags. No side effects, no I/O.
 */
export function calculateGrade(data: BloodTestRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.clinical.primaryIndication, data.panels);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — pre-analytical / specimen safety.
	const pre = scorePreanalytical(data);
	firedRules.push(...pre.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.missing);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const testsSelectedCount = countSelectedPanels(data.panels);

	const recommendation = deriveRecommendation(
		appr.band,
		pre.band,
		completeness.percent,
		testsSelectedCount
	);

	const flags = detectFlags(data, {
		fastingViolation: pre.fastingViolation,
		preanalyticalBand: pre.band,
		triageTier: triage.tier
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		preanalyticalBand: pre.band,
		fastingViolation: pre.fastingViolation,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		testsSelectedCount,
		recommendation,
		recommendationLabel: recommendation === '' ? '' : RECOMMENDATION_LABELS[recommendation],
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
