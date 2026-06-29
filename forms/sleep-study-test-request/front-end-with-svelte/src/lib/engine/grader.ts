import type {
	SleepStudyRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	FiredRule
} from './types';
import { gradeAppropriateness } from './appropriateness-rules';
import { gradePriority } from './priority-rules';
import { gradeCompleteness } from './completeness-rules';
import { gradeTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Display labels for the overall vetting recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable study',
	reject: 'Reject'
};

/**
 * Pure four-axis vetting engine for a sleep-study request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 ordinal + band).
 * - Axis B: clinical priority (low / moderate / high).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a vocational driver with excessive sleepiness, or severe daytime
 * sleepiness, auto-escalates the triage tier regardless of the other axes (DVLA
 * guidance). No side effects, no network calls, no I/O.
 */
export function calculateGrade(request: SleepStudyRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const a = gradeAppropriateness(request);
	firedRules.push(...a.firedRules);

	// Axis B — clinical priority.
	const b = gradePriority(request);
	firedRules.push(...b.firedRules);

	// Axis C — completeness.
	const c = gradeCompleteness(request);
	firedRules.push(...c.firedRules);

	// Axis D — triage.
	const d = gradeTriage(request);
	firedRules.push(...d.firedRules);

	const recommendation = deriveRecommendation(a.appropriatenessBand, c.completenessPercent);
	const flags = detectFlags(request);

	return {
		appropriatenessScore: a.appropriatenessScore,
		appropriatenessBand: a.appropriatenessBand,
		priorityBand: b.priorityBand,
		completenessPercent: c.completenessPercent,
		triageTier: d.triageTier,
		targetTimeframe: d.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall recommendation for the sleep-service vetting desk from
 * the four axes. A clearly inappropriate or materially incomplete request is
 * routed back to the referrer; otherwise the request is accepted for booking.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
