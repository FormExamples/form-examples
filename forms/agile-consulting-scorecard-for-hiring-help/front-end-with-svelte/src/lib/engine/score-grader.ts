import type { AgileConsultingScorecardAssessment, FiredRule, GradeResult } from './types';
import { gradeManifesto } from './manifesto-rules';
import { gradePrinciples } from './principles-rules';
import { computeFlags } from './flagged-issues';
import { bandToRecommendation, totalToBand } from './utils';

// Top-level scoring entrypoint. Takes a complete
// AgileConsultingScorecardAssessment and returns the total score, the
// manifesto/principles subtotals, the readiness band, fired rules, and
// readiness flags.
//
// Algorithm: sum-of-points. One point per "yes" answer across the 16 items.
// The band is read from a fixed table (see `utils.totalToBand`).
export function gradeScorecard(data: AgileConsultingScorecardAssessment): GradeResult {
	const manifesto = gradeManifesto(data.manifesto);
	const principles = gradePrinciples(data.principles);

	const scoreTotal = manifesto.subtotal + principles.subtotal;
	const computedBand = totalToBand(scoreTotal);
	const recommendation = bandToRecommendation(computedBand);

	const firedRules: FiredRule[] = [
		...manifesto.firedRules,
		...principles.firedRules,
		{
			ruleId: `R-COMPOSITE-${computedBand.toUpperCase()}`,
			instrument: 'composite',
			itemNumber: null,
			grade: computedBand,
			pointsAwarded: 0,
			category: 'composite',
			description: `Total ${scoreTotal}/16 places the organization in the "${computedBand}" readiness band.`,
		},
	];

	const additionalFlags = computeFlags(data);

	return {
		scoreTotal,
		manifestoSubtotal: manifesto.subtotal,
		principlesSubtotal: principles.subtotal,
		computedBand,
		recommendation,
		firedRules,
		additionalFlags,
	};
}
