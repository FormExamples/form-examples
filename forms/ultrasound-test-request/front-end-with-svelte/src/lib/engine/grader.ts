import type {
	AppropriatenessBand,
	GradingResult,
	Recommendation,
	SuitabilityBand,
	TriageTier,
	UltrasoundRequest
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { evaluateSuitability } from './suitability-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	suitabilityBand: SuitabilityBand,
	completenessPercent: number,
	_triageTier: TriageTier
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (suitabilityBand === 'limited') return 'redirect';
	return 'accept';
}

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / amend preparation',
	reject: 'Reject'
};

/**
 * Pure four-axis vetting engine for a general ultrasound request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + band) per ACR Appropriateness Criteria.
 * - Axis B: preparation / technical suitability (ok / caution / limited) +
 *   prep requirements.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * A red flag (suspected DVT, suspected testicular torsion, suspected AAA)
 * auto-escalates the triage tier regardless of the other axes.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: UltrasoundRequest): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.bodyRegion);
	firedRules.push(appr.firedRule);

	// Axis B — preparation / technical suitability.
	const suitability = evaluateSuitability(data);
	firedRules.push(...suitability.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.missing);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(
		appr.band,
		suitability.band,
		completeness.percent,
		triage.tier
	);

	const flags = detectFlags(data, {
		suitabilityBand: suitability.band,
		prepRequirements: suitability.prepRequirements
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		suitabilityBand: suitability.band,
		prepRequirements: suitability.prepRequirements,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
