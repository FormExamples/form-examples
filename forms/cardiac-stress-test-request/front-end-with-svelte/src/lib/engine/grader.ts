import type {
	StressTestRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	ContraindicationBand,
	FiredRule
} from './types';
import { scoreAppropriateness } from './appropriateness-rules';
import { scoreSafety } from './safety-rules';
import { scoreCompleteness } from './completeness-rules';
import { scoreTriage } from './triage-rules';
import { detectFlags } from './flagged-issues';

/** Overall recommendation labels for the cardiac-investigations vetting desk. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation from the four axes. A contraindication
 * blocks; least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	contraindicationBand: ContraindicationBand,
	completenessPercent: number
): Recommendation {
	if (contraindicationBand === 'contraindicated') return 'reject';
	if (contraindicationBand === 'caution') return 'redirect';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for a cardiac stress test request.
 *
 * Computes:
 * - Axis A: appropriateness (1-9 score + usually-appropriate / may-be-appropriate /
 *   usually-not-appropriate band).
 * - Axis B: safety / contraindication (ok / caution / contraindicated).
 * - Axis C: request completeness percent (0–100, weighted).
 * - Axis D: triage priority (routine / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation (accept / query-referrer / redirect / reject),
 * the fired-rule audit trail, and safety flags. Rule / flag IDs are identical
 * across every front-end and the back-end.
 *
 * Invariant: a safety contraindication (recent acute coronary syndrome, severe
 * symptomatic aortic stenosis, uncontrolled hypertension, inability to exercise
 * for an exercise test) drives Axis B and auto-escalates / blocks the request
 * regardless of the other axes. No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: StressTestRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.testType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — safety / contraindication.
	const safety = scoreSafety(data);
	firedRules.push(...safety.firedRules);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	firedRules.push(...completeness.missing);

	// Axis D — triage.
	const triage = scoreTriage(data);
	firedRules.push(...triage.firedRules);

	const recommendation = deriveRecommendation(appr.band, safety.band, completeness.percent);

	const flags = detectFlags(data);

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		contraindicationBand: safety.band,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		gradedAt: new Date().toISOString()
	};
}
