import type { EchocardiogramResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (severe valve disease, vegetation,
 *   pericardial effusion, severe LV impairment, intracardiac thrombus) is present.
 * - inconclusive: the study was poor quality, or limited with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: EchocardiogramResult): {
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
				'A critical structured finding (severe valve disease, vegetation, pericardial effusion, severe LV impairment, or intracardiac thrombus) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.studyQuality === 'poor') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'poor-quality',
			description: 'Study quality was poor; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.studyQuality === 'limited' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'limited-no-impression',
			description:
				'Study was limited and no impression was recorded; classified as inconclusive.'
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
		description: 'No abnormal structured findings on an interpretable study; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
