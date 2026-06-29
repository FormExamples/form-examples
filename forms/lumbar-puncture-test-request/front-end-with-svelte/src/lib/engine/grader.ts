import type {
	LumbarPunctureRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	ContraindicationBand,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	scoreSafety,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a lumbar puncture request.
 *
 * Computes:
 * - Axis A: appropriateness (1-9 score + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate band).
 * - Axis B: safety / contraindication (ok / caution / contraindicated).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * Invariant: suspected meningitis and suspected subarachnoid haemorrhage
 * auto-escalate the triage tier to emergency. Suspected raised intracranial
 * pressure without a reassuring CT head drives the contraindication band.
 * The least-alarming band is only chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: LumbarPunctureRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(
		data.procedure.primaryIndication,
		data.procedure.procedureIntent
	);
	firedRules.push(appr.firedRule);

	// Axis B — safety / contraindication.
	const safety = scoreSafety(data);
	firedRules.push(...safety.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.missing);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(appr.band, safety.band, completeness.percent);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		contraindicationBand: safety.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derive an overall recommendation for the vetting desk from the axes.
 * Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	contraindicationBand: ContraindicationBand,
	completenessPercent: number
): Recommendation {
	if (contraindicationBand === 'contraindicated') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (contraindicationBand === 'caution') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
