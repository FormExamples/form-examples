import type { PulmonaryFunctionResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, isNormalStudy } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (severe / very-severe airflow
 *   obstruction or restriction) is present.
 * - inconclusive: the test quality was unacceptable, or sub-optimal with no
 *   confident impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable test.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: PulmonaryFunctionResult): {
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
				'A critical structured finding (severe or very-severe airflow obstruction or restriction) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.testQuality === 'unacceptable') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'unacceptable-quality',
			description: 'Test quality was unacceptable; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.testQuality === 'sub-optimal' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'sub-optimal-no-impression',
			description:
				'Test quality was sub-optimal and no impression was recorded; classified as inconclusive.'
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

	if (r.reducedGasTransfer) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'reduced-gas-transfer',
			description: 'Reduced gas transfer is present; classified as abnormal (not a normal study).'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (!isNormalStudy(r) && r.normalSpirometry === false) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-03',
			axis: 'classification',
			category: 'indeterminate',
			description:
				'No structured finding was recorded and the study was not flagged as normal; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal structured findings on an interpretable test; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
