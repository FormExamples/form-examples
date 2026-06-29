// Four-axis grader for the Hearing Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flagged-issues.ts
// into a single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end. Ported from the HTML front-end's
// `js/grader.js`.

import type {
	HearingRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	FiredRule
} from './types';
import { scoreAppropriateness, scoreTriage, scoreCompleteness, scorePriority } from './rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for each overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the audiology vetting desk from the
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	completenessPercent: number
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a hearing test request. Pure and
 * deterministic; no side effects, no network calls, no I/O.
 *
 * - Axis A: appropriateness (1–9 ordinal score + band).
 * - Axis B: urgency triage tier (routine / urgent / emergency) + timeframe.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority (low / moderate / high).
 *
 * A red flag (sudden sensorineural hearing loss, unilateral / asymmetric
 * symptoms, ear discharge) auto-escalates the triage tier regardless of the
 * other axes.
 */
export function calculateGrade(data: HearingRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.testType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — urgency triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — clinical priority (composite of acuity + appropriateness).
	const priority = scorePriority(triage.tier, appr.band);
	if (priority.firedRule) firedRules.push(priority.firedRule);

	const recommendation = deriveRecommendation(appr.band, completeness.percent);

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
