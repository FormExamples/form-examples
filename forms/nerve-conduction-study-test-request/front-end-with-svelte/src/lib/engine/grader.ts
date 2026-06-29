import type {
	NerveConductionStudyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	ProceduralRiskBand
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradeProceduralRisk } from './risk-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/**
 * Pure four-axis vetting engine for a nerve conduction study / EMG request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 ordinal + band) per AANEM / AAN practice
 *   parameters (indication × study-type match).
 * - Axis B: procedural risk (low / moderate / high) from needle EMG against
 *   anticoagulation / cardiac device.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags.
 *
 * Invariant: suspected motor neurone disease auto-escalates the triage tier to
 * urgent regardless of the other axes. Needle EMG against anticoagulation or a
 * cardiac device raises the procedural-risk band. The least-alarming band is
 * only chosen when no rule fires. No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: NerveConductionStudyRequest): GradingResult {
	const firedRules = [];

	// Axis A — appropriateness.
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — procedural risk.
	const b = gradeProceduralRisk(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage.
	const d = gradeTriage(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(
		a.appropriatenessBand,
		b.proceduralRiskBand,
		c.completenessPercent
	);

	const flags = detectFlags(request);

	return {
		appropriatenessScore: a.appropriatenessScore,
		appropriatenessBand: a.appropriatenessBand,
		proceduralRiskBand: b.proceduralRiskBand,
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
 * Derive an overall recommendation for the neurophysiology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	proceduralRiskBand: ProceduralRiskBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (proceduralRiskBand === 'high') return 'query-referrer';
	return 'accept';
}
