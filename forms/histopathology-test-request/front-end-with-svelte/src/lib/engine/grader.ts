import type {
	HistopathologyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	SpecimenQualityBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreSpecimenQuality } from './specimen-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable labels for the overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and process',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the pathology vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	specimenQualityBand: SpecimenQualityBand,
	completenessPercent: number
): Recommendation {
	if (specimenQualityBand === 'reject-risk') return 'query-referrer';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a tissue histopathology specimen request.
 *
 * Computes:
 * - Axis A: appropriateness 1–9 score + band (RCPath cancer datasets / tissue
 *   pathways).
 * - Axis B: specimen quality (ok / caution / reject-risk).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: urgency triage tier (routine / urgent / two-week-wait) + target
 *   timeframe; a frozen section is immediate.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: HistopathologyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(
		data.indication.primaryIndication,
		data.specimen.specimenType
	);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — specimen quality.
	const specimen = scoreSpecimenQuality(data);
	for (const r of specimen.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — urgency triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, specimen.band, completeness.percent);

	const flags = detectFlags(data, { specimenQualityBand: specimen.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		specimenQualityBand: specimen.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		immediate: triage.immediate,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
