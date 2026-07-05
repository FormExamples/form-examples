import type { NeurodiversityAdjustmentResponse, OutcomeClassification, FiredRule } from './types';

/**
 * Axis A — outcome classification.
 *
 * Maps the employer's overall decision onto the outcome band. First match wins;
 * exactly one rule fires. Rule IDs are stable and identical across every
 * front-end and the back-end.
 */
export function classifyOutcome(r: NeurodiversityAdjustmentResponse): {
	outcomeClassification: OutcomeClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	switch (r.overallDecision) {
		case 'agreed':
			firedRules.push({
				ruleId: 'R-OUTCOME-AGREED',
				axis: 'outcome',
				category: 'fully-agreed',
				description: 'All requested adjustments agreed.'
			});
			return { outcomeClassification: 'fully-agreed', firedRules };
		case 'partially-agreed':
			firedRules.push({
				ruleId: 'R-OUTCOME-PARTIAL',
				axis: 'outcome',
				category: 'partially-agreed',
				description: 'Some requested adjustments agreed.'
			});
			return { outcomeClassification: 'partially-agreed', firedRules };
		case 'alternative-offered':
			firedRules.push({
				ruleId: 'R-OUTCOME-ALTERNATIVE',
				axis: 'outcome',
				category: 'alternative-offered',
				description: 'Alternative adjustments offered in place of those requested.'
			});
			return { outcomeClassification: 'alternative-offered', firedRules };
		case 'declined':
			firedRules.push({
				ruleId: 'R-OUTCOME-DECLINED',
				axis: 'outcome',
				category: 'declined',
				description: 'Requested adjustments declined.'
			});
			return { outcomeClassification: 'declined', firedRules };
		case 'deferred':
			firedRules.push({
				ruleId: 'R-OUTCOME-DEFERRED',
				axis: 'outcome',
				category: 'deferred',
				description: 'Decision deferred pending further information or assessment.'
			});
			return { outcomeClassification: 'deferred', firedRules };
		default:
			firedRules.push({
				ruleId: 'R-OUTCOME-UNSPECIFIED',
				axis: 'outcome',
				category: 'unspecified',
				description: 'No overall decision recorded yet.'
			});
			return { outcomeClassification: '', firedRules };
	}
}
