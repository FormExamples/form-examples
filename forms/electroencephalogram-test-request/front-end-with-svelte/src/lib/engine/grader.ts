import type {
	EegRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	Flag,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreUrgency } from './urgency-rules';
import { scoreCompleteness } from './completeness-rules';
import { scorePriority } from './priority-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for each overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable study',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the neurophysiology vetting desk from
 * the four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number,
	flags: Flag[]
): Recommendation {
	const usesEegToExclude = flags.some((f) => f.category === 'eeg-not-to-exclude-epilepsy');
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (usesEegToExclude) return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for an EEG test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + band) per NICE NG217 / ILAE.
 * - Axis B: urgency triage tier (routine / urgent / emergency) + target
 *   timeframe; suspected status epilepticus auto-escalates to emergency.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority band (low / moderate / high).
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: EegRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.eegType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — urgency.
	const urgency = scoreUrgency(data);
	for (const r of urgency.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — clinical priority.
	const priority = scorePriority(data);
	for (const r of priority.firedRules) firedRules.push(r);

	const flags = detectFlags(data);

	const recommendation = deriveRecommendation(appr.band, completeness.percent, flags);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: urgency.tier,
		targetTimeframe: urgency.targetTimeframe,
		completenessPercent: completeness.percent,
		priorityBand: priority.band,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
