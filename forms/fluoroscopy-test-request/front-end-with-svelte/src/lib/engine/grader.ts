import type {
	FluoroscopyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	SafetyBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreRadiationDose } from './radiation-dose-rules';
import { scoreSafety } from './safety-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';
import { isBariumStudy } from './utils';

/**
 * Pure four-axis vetting engine for a fluoroscopy / contrast-study request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate) per ACR / RCR iRefer.
 * - Axis B: safety band (ok / caution / contraindicated) + radiation-dose band
 *   (low / moderate / high).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a safety contraindication (pregnancy with an ionising study; barium
 * chosen when perforation is suspected) forces a query-referrer / redirect
 * recommendation regardless of the other axes. The least-alarming band is only
 * chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: FluoroscopyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.studyType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — radiation dose.
	const dose = scoreRadiationDose(data.request.studyType);
	if (dose.firedRule) firedRules.push(dose.firedRule);

	// Axis B — safety band.
	const safety = scoreSafety(data);
	for (const r of safety.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const suspectedPerforationBarium =
		data.request.primaryIndication === 'suspected-perforation' &&
		isBariumStudy(data.request.studyType);

	const recommendation = deriveRecommendation(
		appr.band,
		safety.band,
		completeness.percent,
		suspectedPerforationBarium
	);

	const flags = detectFlags(data, { radiationDoseBand: dose.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		safetyBand: safety.band,
		radiationDoseBand: dose.band,
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
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. A safety contraindication forces query-referrer / redirect regardless
 * of the other axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	safetyBand: SafetyBand,
	completenessPercent: number,
	suspectedPerforationBarium: boolean
): Recommendation {
	if (safetyBand === 'contraindicated') {
		// Barium-vs-perforation has a clear safe redirect target.
		return suspectedPerforationBarium ? 'redirect' : 'query-referrer';
	}
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
