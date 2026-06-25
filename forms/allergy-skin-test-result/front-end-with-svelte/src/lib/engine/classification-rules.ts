import type { AllergySkinResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, isInvalidTest } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a systemic / anaphylactic reaction occurred during the test.
 * - inconclusive: the test was invalid / non-interpretable.
 * - abnormal: clinically relevant sensitisation or a positive reaction is present.
 * - normal: all allergens negative on a valid, interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: AllergySkinResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'anaphylaxis-during-test',
			description:
				'A systemic / anaphylactic reaction occurred during the test; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (isInvalidTest(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'invalid-test',
			description:
				'Test was invalid / non-interpretable (antihistamines not withheld, absent positive control, or dermographism); classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.sensitisationConfirmed) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'clinically-relevant-sensitisation',
			description:
				'Clinically relevant sensitisation was confirmed; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (r.positiveReactions) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'positive-reaction',
			description:
				'One or more positive reactions are present (sensitisation, not necessarily clinical allergy); classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'all-negative',
		description:
			'No positive reactions on a valid, interpretable test; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
