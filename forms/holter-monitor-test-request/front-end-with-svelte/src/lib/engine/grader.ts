import type { HolterRequest, GradingResult, Recommendation, AppropriatenessBand, MatchFit, FiredRule } from './types';
import {
	scoreAppropriateness,
	appropriatenessBand,
	evaluateFrequencyMatch,
	adjustAppropriatenessForMatch
} from './appropriateness-rules';
import { scoreTriage } from './triage-rules';
import { scoreCompleteness } from './completeness-rules';
import { scorePriority } from './priority-rules';
import { detectFlags } from './flagged-issues';

/**
 * Derive an overall recommendation for the cardiac physiology vetting desk from
 * the four axes. Least-alarming wins only when nothing escalates.
 */
function deriveRecommendation(
	apprBand: AppropriatenessBand,
	matchFit: MatchFit,
	completenessPercent: number
): Recommendation {
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (matchFit === 'mismatched') return 'redirect';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for an ambulatory ECG (Holter) monitoring
 * request.
 *
 * Computes:
 * - Axis A: appropriateness (1–9 ordinal + band), with the indication × monitor
 *   fit adjusted by the symptom-frequency / monitor-duration match.
 * - Axis B: urgency / triage (routine / urgent / emergency) + target timeframe;
 *   red flags (syncope, suspected VT, post-stroke AF detection) auto-escalate.
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: clinical priority (low / moderate / high).
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: HolterRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A.1 — raw appropriateness from indication × monitor type.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.monitorType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis A.2 — symptom-frequency / monitor-duration match.
	const match = evaluateFrequencyMatch(data.symptoms.symptomFrequency, data.request.monitorType);
	if (match.firedRule) firedRules.push(match.firedRule);

	// Combine into a final appropriateness score + band.
	const appropriatenessScore = adjustAppropriatenessForMatch(appr.score, match.fit);
	const finalBand = appropriatenessBand(appropriatenessScore);

	// Axis B — urgency / triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.firedRules);

	// Axis D — clinical priority.
	const priority = scorePriority(data);
	firedRules.push(...priority.firedRules);

	const recommendation = deriveRecommendation(finalBand, match.fit, completeness.percent);

	const flags = detectFlags(data, {
		matchFit: match.fit,
		recommendedMonitor: match.recommendedMonitor
	});

	return {
		appropriatenessScore,
		appropriatenessBand: finalBand,
		matchFit: match.fit,
		recommendedMonitor: match.recommendedMonitor,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		completenessPercent: completeness.percent,
		priorityBand: priority.band,
		recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
