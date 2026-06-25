import type { CystoscopyResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (bladder tumour / suspicious
 *   lesion) is present.
 * - inconclusive: no structured finding was recorded (neither a normal
 *   examination nor any abnormal finding) and no impression was given, so the
 *   examination could not reach a conclusion.
 * - abnormal: any abnormal structured finding is present.
 * - normal: an explicitly normal examination with no abnormal finding.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: CystoscopyResult): {
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
				'A bladder tumour or suspicious lesion is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (!r.normalExamination && !hasAnyAbnormalFinding(r) && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'no-conclusion',
			description:
				'No structured finding was recorded and no impression was given; classified as inconclusive.'
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

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'A normal examination with no abnormal structured findings; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
