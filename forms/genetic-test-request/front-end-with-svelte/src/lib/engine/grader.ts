import type {
	GeneticTestRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	ConsentCounsellingBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeConsentCounselling } from './consent-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a clinical genetics / genomic test request.
 *
 * Computes:
 * - Axis A: appropriateness 1–9 + band (NHS National Genomic Test Directory
 *   eligibility: usually-appropriate 7–9 / may-be-appropriate 4–6 /
 *   usually-not-appropriate 1–3).
 * - Axis B: consent & counselling (ok / caution / not-met).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * Invariant: consent + pre-test counselling are mandatory for predictive /
 * presymptomatic testing — if absent, the consent axis is `not-met` and the
 * request is rejected, regardless of the other axes. Prenatal requests are
 * time-critical. The least-alarming band is chosen only when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: GeneticTestRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — consent & counselling
	const b = gradeConsentCounselling(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage
	const d = gradeTriage(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.appropriatenessBand,
		b.consentCounsellingBand,
		c.completenessPercent
	);

	const flags = detectFlags(request);

	return {
		appropriatenessScore: a.appropriatenessScore,
		appropriatenessBand: a.appropriatenessBand,
		consentCounsellingBand: b.consentCounsellingBand,
		completenessPercent: c.completenessPercent,
		triageTier: d.triageTier,
		targetTimeframe: d.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall vetting recommendation for the Genomic Laboratory Hub
 * vetting desk from the graded axes. Least-alarming wins only when nothing
 * escalates. The consent axis is mandatory-blocking: `not-met` rejects.
 */
function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	consentBand: ConsentCounsellingBand,
	completenessPercent: number
): Recommendation {
	if (consentBand === 'not-met') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (consentBand === 'caution') return 'query-referrer';
	return 'accept';
}
