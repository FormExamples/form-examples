// Four-axis grader for the Biopsy Test Request.
//
// Ported from the HTML reference engine (front-end-form-with-html/js/grader.js).
// Composes the rule sets in rules.ts and the safety flags in flags.ts into a
// single pure, deterministic grading result. The public entry point is
// `calculateGrade(data)`.

import type {
	AppropriatenessBand,
	BiopsyRequestData,
	BleedingRiskBand,
	FiredRule,
	GradingResult,
	Recommendation
} from './types';
import { scoreAppropriateness, scoreBleedingRisk, scoreCompleteness, scoreTriage } from './rules';
import { detectFlags } from './flags';

/**
 * Derive an overall recommendation for the pathology / imaging vetting desk
 * from the four axes. Least-alarming wins only when nothing escalates.
 */
export function deriveRecommendation(
	apprBand: AppropriatenessBand,
	bleedingRiskBand: BleedingRiskBand,
	completenessPercent: number
): Recommendation {
	if (apprBand === 'usually-not-appropriate') return 'query-referrer';
	if (completenessPercent < 50) return 'query-referrer';
	if (bleedingRiskBand === 'high') return 'query-referrer';
	return 'accept';
}

export const RECOMMENDATION_LABELS: Record<Recommendation, string> = {
	accept: 'Accept and book',
	'query-referrer': 'Query the referrer',
	redirect: 'Redirect to a more suitable test',
	reject: 'Reject'
};

/** Public entry point. Pure and deterministic. */
export function calculateGrade(data: BiopsyRequestData): GradingResult {
	const firedRules: FiredRule[] = [];

	// Axis A — appropriateness.
	const appr = scoreAppropriateness(data.indication.primaryIndication, data.procedure.biopsySite);
	if (appr.firedRule) firedRules.push(appr.firedRule);

	// Axis B — periprocedural bleeding risk.
	const bleeding = scoreBleedingRisk(data);
	for (const r of bleeding.firedRules) firedRules.push(r);

	// Axis C — completeness.
	const completeness = scoreCompleteness(data);
	for (const m of completeness.missing) firedRules.push(m);

	// Axis D — urgency / cancer-pathway triage.
	const triage = scoreTriage(data);
	for (const r of triage.firedRules) firedRules.push(r);

	const recommendation = deriveRecommendation(appr.band, bleeding.band, completeness.percent);

	const flags = detectFlags(data, {
		bleedingRiskBand: bleeding.band,
		twoWeekWaitEligible: triage.twoWeekWaitEligible
	});

	return {
		appropriatenessScore: appr.score,
		appropriatenessBand: appr.band,
		bleedingRiskBand: bleeding.band,
		anticoagulantAction: bleeding.anticoagulantAction,
		completenessPercent: completeness.percent,
		triageTier: triage.tier,
		targetTimeframe: triage.targetTimeframe,
		twoWeekWaitEligible: triage.twoWeekWaitEligible,
		recommendation,
		recommendationLabel: RECOMMENDATION_LABELS[recommendation] || recommendation,
		firedRules,
		flags,
		timestamp: new Date().toISOString()
	};
}
