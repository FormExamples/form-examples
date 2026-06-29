import type {
	EyeVisionRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	TriageTier,
	PriorityBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreTriage } from './triage-rules';
import { scoreCompleteness } from './completeness-rules';
import { scorePriority } from './priority-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable labels for the overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the eye-care vetting desk from the four
 * axes. The least-alarming recommendation wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	_triageTier: TriageTier,
	completenessPercent: number,
	_priorityBand: PriorityBand
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for an eye vision test request.
 *
 * Computes:
 * - Axis A: appropriateness (1-9 score + usually-appropriate /
 *   may-be-appropriate / usually-not-appropriate band).
 * - Axis B: urgency / triage tier (routine / urgent / emergency) + target
 *   timeframe.
 * - Axis C: request completeness percent (0-100, weighted).
 * - Axis D: clinical priority band (low / moderate / high).
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a red flag (sudden visual loss, retinal-detachment symptoms, acute
 * painful red eye, suspected giant cell arteritis) auto-escalates the triage
 * tier to emergency regardless of the other axes. No side effects, no I/O.
 */
export function calculateGrade(data: EyeVisionRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.testType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — urgency / triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — clinical priority.
	const priority = scorePriority(data);
	for (const r of priority.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		triage.tier,
		completeness.percent,
		priority.band
	);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		completenessPercent: completeness.percent,
		priorityBand: priority.band,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
