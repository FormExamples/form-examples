import type { HolterMonitorResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical rhythm finding (ventricular tachycardia, pause > 3 s,
 *   high-grade AV block, or fast atrial fibrillation) is present.
 * - inconclusive: the recording was inadequate (too little analysed), or the
 *   study is neither normal nor abnormal with no confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: the study is normal and the recording was adequate.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: HolterMonitorResult): {
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
				'A critical rhythm finding (ventricular tachycardia, pause > 3 s, high-grade AV block, or fast atrial fibrillation) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.analysedPercent !== null && r.analysedPercent < 50) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'inadequate-recording',
			description:
				'Less than 50% of the recording was analysable; classified as inconclusive.'
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

	if (r.normalStudy) {
		firedRules.push({
			ruleId: 'R-CLASS-NORMAL-01',
			axis: 'classification',
			category: 'normal-study',
			description: 'Study recorded as normal with no abnormal findings; classified as normal.'
		});
		return { resultClassification: 'normal', firedRules };
	}

	if (r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'no-impression',
			description:
				'No abnormal finding, study not marked normal, and no impression recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-02',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal structured findings on an interpretable recording; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
