import type { HearingResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, isNormalHearing } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (sudden sensorineural hearing loss
 *   or marked asymmetry suggesting retrocochlear pathology) is present.
 * - inconclusive: the test was unreliable (poor reliability) with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: normal hearing on a reliable, interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: HearingResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-finding',
			description:
				'A critical structured finding (sudden sensorineural hearing loss or marked asymmetry) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.testReliability === 'poor' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'unreliable-no-impression',
			description:
				'Test reliability was poor and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description: 'One or more abnormal structured findings are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (isNormalHearing(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-NORMAL-01',
			axis: 'classification',
			category: 'normal-hearing',
			description:
				'Normal hearing on an interpretable test with no abnormal structured findings; classified as normal.'
		});
		return { resultClassification: 'normal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-02',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal structured findings on an interpretable test; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
