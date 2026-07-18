// Four-axis grader for the Nuclear Medicine Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	NuclearMedicineRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	PrepSafetyBand,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	radiationDoseBand,
	scorePrepSafety,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	appropriatenessBand: AppropriatenessBand,
	prepSafetyBand: PrepSafetyBand,
	completenessPercent: number
): Recommendation {
	if (prepSafetyBand === 'contraindicated') return 'reject';
	if (appropriatenessBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (prepSafetyBand === 'caution') return 'redirect';
	return 'accept';
}

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Accept with safety caution',
	reject: 'Reject'
};

/**
 * Public entry point. Pure and deterministic. Composes the four axes plus
 * the radiation-dose sub-check and the safety flags.
 */
export function calculateGrade(data: NuclearMedicineRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.scanType);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — radiation dose + preparation / radiation safety.
	const dose = radiationDoseBand(data.request.scanType);
	if (dose.firedRule) firedRules.push(dose.firedRule);
	const prep = scorePrepSafety(data, dose.band);
	for (const r of prep.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, prep.band, completeness.percent);

	const flags = detectFlags(data, { radiationDoseBand: dose.band });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		prepSafetyBand: prep.band,
		radiationDoseBand: dose.band,
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
