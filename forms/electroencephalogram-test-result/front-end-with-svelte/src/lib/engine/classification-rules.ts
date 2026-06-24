import type { ElectroencephalogramResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (status epilepticus, a recorded
 *   seizure, or epileptiform discharges) is present.
 * - inconclusive: the recording was limited / non-interpretable, or limited
 *   with no confident impression.
 * - abnormal: any abnormal structured or background finding is present.
 * - normal: no abnormal finding on an interpretable recording.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: ElectroencephalogramResult): {
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
				'A critical structured finding (status epilepticus, a recorded seizure, or epileptiform discharges) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.recordingQuality === 'limited' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'limited-no-impression',
			description:
				'Recording quality was limited and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'One or more abnormal structured or background findings are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal structured or background findings on an interpretable recording; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
