import type {
	UltrasoundRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	WindowFit,
	TriageTier,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	evaluateWindowFit,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';
import { gestationalAgeToDays } from './utils';

/** Overall vetting-recommendation display labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable scan',
	reject: 'Reject'
};

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	windowFit: WindowFit,
	completenessPercent: number,
	_triageTier: TriageTier
): Recommendation {
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (windowFit === 'outside-window') return 'redirect';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/**
 * Pure four-axis vetting engine for an obstetric ultrasound request.
 *
 * - Axis A: appropriateness 1-9 + band (indication × scan type).
 * - Axis B: gestational-age window fit (appropriate / borderline / outside).
 * - Axis C: request completeness percent (0-100, weighted).
 * - Axis D: triage tier (routine / soon / urgent / emergency) + target timeframe.
 *
 * Plus an overall recommendation, the fired-rule audit trail, and safety flags.
 * Red flags (heavy bleeding, severe pain, suspected ectopic, haemodynamic
 * instability, reduced fetal movements) auto-escalate the triage tier.
 *
 * No side effects, no network calls, no I/O.
 */
export function calculateGrade(data: UltrasoundRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.requestedScanType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — gestational-age window fit.
	const gaDays = gestationalAgeToDays(
		data.dating.gestationalAgeWeeks,
		data.dating.gestationalAgeDays
	);
	const window = evaluateWindowFit(data.request.requestedScanType, gaDays);
	if (window.firedRule) firedRules.push(window.firedRule);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		window.fit,
		completeness.percent,
		triage.tier
	);

	const flags = detectFlags(data, {
		windowFit: window.fit,
		recommendedScanType: window.recommendedScanType
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		windowFit: window.fit,
		recommendedScanType: window.recommendedScanType,
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
