import type {
	UrinalysisRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PreanalyticalBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradePreanalytical } from './preanalytical-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';
import { countSelectedTests, recommendationLabel } from './utils';

/**
 * Pure four-axis vetting engine for a urinalysis test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate), anchored on indication-to-test match.
 * - Axis B: preanalytical specimen suitability (ok / caution / reject-risk) per
 *   UK SMI B41, plus an advisory note.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / stat) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags. A red flag (visible haematuria;
 * fever + loin pain) auto-escalates the triage tier. The least-alarming band is
 * chosen only when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: UrinalysisRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — preanalytical specimen suitability.
	const b = gradePreanalytical(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage.
	const d = gradeTriage(request);
	firedRules.push(...d.firedRules);

	const noTestSelected = countSelectedTests(request.tests) === 0;

	const recommendation = deriveRecommendation(
		a.appropriatenessBand,
		b.preanalyticalBand,
		c.completenessPercent,
		noTestSelected
	);

	const flags = detectFlags(request);

	return {
		appropriatenessScore: a.score,
		appropriatenessBand: a.appropriatenessBand,
		preanalyticalBand: b.preanalyticalBand,
		specimenNote: b.note,
		completenessPercent: c.completenessPercent,
		triageTier: d.triageTier,
		targetTimeframe: d.targetTimeframe,
		recommendation,
		recommendationLabel: recommendationLabel(recommendation),
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derive the overall recommendation for the pathology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	preanalyticalBand: PreanalyticalBand,
	completenessPercent: number,
	noTestSelected: boolean
): Recommendation {
	if (noTestSelected) return 'query-referrer';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (preanalyticalBand === 'reject-risk') return 'reject';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
