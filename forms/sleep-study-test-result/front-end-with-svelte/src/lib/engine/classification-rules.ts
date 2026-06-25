import type { SleepStudyResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, hasOnlyPeriodicLimbMovements } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (severe OSA with significant desaturation, or
 *   nocturnal hypoventilation) is present.
 * - inconclusive: the study failed, or was limited with no confident impression.
 * - abnormal: any abnormal structured finding (sleep-disordered breathing) is
 *   present, or periodic limb movements only.
 * - normal: no abnormal finding and an adequate study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: SleepStudyResult): {
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
				'A critical finding (severe OSA with significant desaturation, or nocturnal hypoventilation) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.studyAdequacy === 'failed') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'failed-study',
			description: 'Study failed; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.studyAdequacy === 'limited' && r.impression.trim() === '') {
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

	if (hasOnlyPeriodicLimbMovements(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'periodic-limb-movements',
			description:
				'Periodic limb movements only (no sleep-disordered breathing); classified as abnormal (not a normal study).'
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
