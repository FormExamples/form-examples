import type { XRayRequest, GradingResult, Recommendation, AppropriatenessBand, RadiationSafetyBand } from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreRadiationSafety } from './safety-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable overall recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to another modality',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	radiationSafetyBand: RadiationSafetyBand,
	completenessPercent: number
): Recommendation {
	if (radiationSafetyBand === 'contraindicated') return 'reject';
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (radiationSafetyBand === 'caution') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a plain-radiograph (X-ray) request.
 *
 * Computes:
 * - Axis A: appropriateness (1-9 score + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate).
 * - Axis B: radiation safety (safe / caution / contraindicated) + relative
 *   effective-dose band (low / moderate / high).
 * - Axis C: request completeness percent (0-100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * A radiation-safety concern (pregnancy / possible pregnancy, unjustified
 * exposure, repeat recent imaging) forces the caution or contraindicated band.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: XRayRequest): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.bodyRegion, data.request.primaryIndication);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — radiation safety + dose band.
	const safety = scoreRadiationSafety(data);
	for (const r of safety.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, safety.band, completeness.percent);

	const flags = detectFlags(data, { doseBand: safety.doseBand });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		radiationSafetyBand: safety.band,
		radiationDoseBand: safety.doseBand,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
