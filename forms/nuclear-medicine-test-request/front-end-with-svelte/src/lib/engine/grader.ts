import type {
	CardiologyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	SafetyBand,
	TriageTier,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeSafety } from './safety-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a cardiology referral request.
 *
 * Computes:
 * - Axis A: referral appropriateness (usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate).
 * - Axis B: safety / red-flag (ok / caution / red-flag).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * Invariant: a red flag (suspected acute coronary syndrome, exertional syncope,
 * new-onset heart failure) drives Axis B to red-flag and auto-escalates Axis D
 * regardless of the other axes. The least-alarming band is only chosen when no
 * rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: CardiologyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B
	const b = gradeSafety(request);
	firedRules.push(...b.firedRules);

	// Axis C
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D (depends on the safety band)
	const d = gradeTriage(request, b.safetyBand);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.appropriatenessBand,
		b.safetyBand,
		c.completenessPercent,
		d.triageTier
	);

	const flags = detectFlags(request);

	return {
		appropriatenessBand: a.appropriatenessBand,
		safetyBand: b.safetyBand,
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
 * Derives the overall vetting recommendation from the graded axes.
 *
 * - reject: the referral is usually not appropriate and carries no red flag.
 * - redirect: the referral may be appropriate elsewhere (service mismatch) and
 *   carries no red flag.
 * - query-referrer: a red flag or low completeness needs clarification before
 *   booking (but a true emergency is still accepted onto the urgent pathway).
 * - accept: an appropriate, sufficiently complete referral.
 */
function deriveRecommendation(
	appropriateness: AppropriatenessBand,
	safety: SafetyBand,
	completeness: number,
	triage: TriageTier
): Recommendation {
	// An emergency is always accepted onto the acute pathway.
	if (triage === 'emergency') return 'accept';

	if (appropriateness === 'usually-not-appropriate' && safety === 'ok') {
		return 'reject';
	}

	if (appropriateness === 'may-be-appropriate' && safety === 'ok' && completeness < 60) {
		return 'redirect';
	}

	// A red flag or a materially incomplete request needs clarification.
	if (safety === 'red-flag' && completeness < 70) return 'query-referrer';
	if (completeness < 50) return 'query-referrer';
	if (appropriateness === 'may-be-appropriate' && completeness < 70) return 'query-referrer';

	return 'accept';
}
