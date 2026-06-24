import type { ElectrocardiogramResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasAbnormalRhythm } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (ST elevation / STEMI, ventricular
 *   tachycardia, complete heart block, or markedly prolonged QTc) is present.
 * - inconclusive: the recording quality was poor with no confident impression.
 * - abnormal: any abnormal structured finding or abnormal rhythm is present.
 * - normal: no abnormal finding on an interpretable trace.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: ElectrocardiogramResult): {
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
				'A critical finding (ST elevation / STEMI, ventricular tachycardia, complete heart block, or markedly prolonged QTc) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.recordingQuality === 'poor' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'poor-quality',
			description:
				'Recording quality was poor and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r) || hasAbnormalRhythm(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'One or more abnormal structured findings or an abnormal rhythm are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal structured findings on an interpretable trace; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
