import type {
	EcgRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	TriageTier,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreTriage } from './triage-rules';
import { scoreCompleteness } from './completeness-rules';
import { scorePriority } from './priority-rules';
import { detectFlags } from './flagged-issues';

/** Human-readable label for each overall recommendation. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Pure four-axis vetting engine for an ECG test request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 score + band) of the indication × ECG-type
 *   pairing (AHA/ACC ECG-use guidance).
 * - Axis B: urgency / triage tier (routine / urgent / emergency) + target
 *   timeframe (NICE CG95 / ACS pathway red-flag escalation).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority band (low / moderate / high).
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 *
 * Invariant: a red flag (suspected ACS, active chest pain, syncope, suspected
 * VT) auto-escalates the triage tier and clinical priority regardless of the
 * other axes; suspected ACS or active chest pain implies an emergency same-hour
 * 12-lead ECG. The least-alarming band is only chosen when no rule fires.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: EcgRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.ecgType);
	firedRules.push(...appr.firedRules);

	// Axis B — urgency / triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — clinical priority.
	const priority = scorePriority(triage.triageTier, appr.band);
	firedRules.push(...priority.firedRules);

	const recommendation = deriveRecommendation(
		appr.band,
		completeness.completenessPercent,
		triage.triageTier
	);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		triageTier: triage.triageTier,
		targetTimeframe: triage.targetTimeframe,
		completenessPercent: completeness.completenessPercent,
		priorityBand: priority.priorityBand,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] ?? recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}

/**
 * Derives the overall recommendation for the cardiac-physiology vetting desk.
 * The least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	completenessPercent: number,
	_triageTier: TriageTier
): Recommendation {
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}
