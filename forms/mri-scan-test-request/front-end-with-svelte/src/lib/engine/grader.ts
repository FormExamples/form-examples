// Four-axis grader for the MRI Scan Test Request.
//
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`. The output shape and rule / flag IDs are identical
// across every front-end and the back-end.

import type {
	MriRequest,
	GradingResult,
	Recommendation,
	AppropriatenessBand,
	MriSafetyBand,
	ContrastRenalFlag,
	FiredRule
} from './types';
import {
	scoreAppropriateness,
	scoreSafety,
	scoreContrastRenal,
	scoreCompleteness,
	scoreTriage
} from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall recommendation for the imaging vetting desk from the four
 * axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	mriSafetyBand: MriSafetyBand,
	contrastRenalFlag: ContrastRenalFlag,
	completenessPercent: number
): Recommendation {
	if (mriSafetyBand === 'contraindicated') return 'reject';
	if (contrastRenalFlag === 'contraindicated') return 'redirect';
	if (mriSafetyBand === 'needs-mri-physics-review') return 'query-referrer';
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	return 'accept';
}

/** Human-readable recommendation labels. */
export const RECOMMENDATION_LABELS: Record<string, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect / modify protocol',
	reject: 'Reject'
};

/**
 * Public entry point. Pure and deterministic. Composes the four axes plus the
 * gadolinium-vs-eGFR contrast-renal sub-check and the safety flags.
 */
export function calculateGrade(data: MriRequest): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.request.primaryIndication, data.request.bodyRegion);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — MRI safety + contrast-renal.
	const safety = scoreSafety(data);
	for (const r of safety.firedRules) firedRules.push(r);
	const contrastRenal = scoreContrastRenal(data);
	if (contrastRenal.firedRule) firedRules.push(contrastRenal.firedRule);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(
		appr.band,
		safety.band,
		contrastRenal.flag,
		completeness.percent
	);

	const flags = detectFlags(data, { contrastRenalFlag: contrastRenal.flag });

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		mriSafetyBand: safety.band,
		contrastRenalFlag: contrastRenal.flag,
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
