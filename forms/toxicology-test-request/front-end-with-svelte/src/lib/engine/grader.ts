import type {
	ToxicologyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	TimingBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { evaluateTiming } from './timing-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';
import { recommendationLabel } from './utils';

/**
 * Pure four-axis vetting engine for a toxicology test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate) from the TOXBASE / NPIS indication-to-assay match.
 * - Axis B: ingestion-timing validity (ok / caution / invalid); a paracetamol
 *   level requested < 4 h post-ingestion is invalid for the nomogram.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / stat) + target timeframe; a
 *   deliberate overdose or a symptomatic patient auto-escalates to stat.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags. No side effects, no I/O.
 */
export function calculateGrade(request: ToxicologyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const a = scoreAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — ingestion-timing validity.
	const b = evaluateTiming(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = scoreCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage.
	const d = scoreTriage(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(a.band, b.band, c.completenessPercent);

	const flags = detectFlags(request, { timingBand: b.band });

	return {
		appropriatenessScore: a.score,
		appropriatenessBand: a.band,
		timingBand: b.band,
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
 * Derive the overall recommendation for the toxicology vetting desk from the
 * four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	timingBand: TimingBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (timingBand === 'invalid') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
