import type {
	DexaRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	RadiationDoseBand
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeSafety } from './safety-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / defer',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. The least-alarming option wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	radiationDoseBand: RadiationDoseBand,
	completenessPercent: number
): Recommendation {
	if (radiationDoseBand === 'high') return 'redirect';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a DEXA bone-density request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 ordinal + band) — NICE CG146 / NOGG / FRAX.
 * - Axis B: radiation dose band (low / moderate / high) + safety note.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * Invariant: known or suspected pregnancy drives the dose band to high and the
 * recommendation to redirect; high-acuity factors (recent fragility fracture,
 * very high FRAX risk, long-term steroids) auto-escalate triage. No side
 * effects, no network calls, no I/O.
 */
export function calculateGrade(data: DexaRequest): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness (with FRAX adjustment).
	const appr = gradeAppropriateness(data);
	firedRules.push(...appr.firedRules);

	// Axis B — radiation safety.
	const safety = gradeSafety(data);
	firedRules.push(...safety.firedRules);

	// Axis C — completeness.
	const completeness = gradeCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — triage.
	const triage = gradeTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(
		appr.appropriatenessBand,
		safety.radiationDoseBand,
		completeness.completenessPercent
	);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.appropriatenessScore,
		appropriatenessBand: appr.appropriatenessBand,
		radiationDoseBand: safety.radiationDoseBand,
		safetyNote: safety.safetyNote,
		completenessPercent: completeness.completenessPercent,
		triageTier: triage.triageTier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
