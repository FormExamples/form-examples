import type {
	PulmonaryFunctionTestRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	ContraindicationBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeSafety } from './safety-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a pulmonary function test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + band) — NICE NG80 / NG115, ARTP match.
 * - Axis B: safety / contraindication (ok / caution / contraindicated).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a contraindication (recent MI / surgery, suspected active TB,
 * haemoptysis) drives Axis B to contraindicated and defers / redirects the test
 * regardless of the other axes. The least-alarming band is only chosen when no
 * rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: PulmonaryFunctionTestRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — safety / contraindication.
	const b = gradeSafety(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage.
	const d = gradeTriage(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.appropriatenessBand,
		b.contraindicationBand,
		c.completenessPercent
	);

	const flags = detectFlags(request);

	return {
		appropriatenessScore: a.appropriatenessScore,
		appropriatenessBand: a.appropriatenessBand,
		contraindicationBand: b.contraindicationBand,
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
 * Derive an overall recommendation for the lung-function vetting desk. Safety
 * dominates: a contraindication redirects / defers the test. Least-alarming
 * wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	contraindicationBand: ContraindicationBand,
	completenessPercent: number
): Recommendation {
	if (contraindicationBand === 'contraindicated') return 'redirect';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
