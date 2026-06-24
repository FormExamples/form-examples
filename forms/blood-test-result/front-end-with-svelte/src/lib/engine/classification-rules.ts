import type { BloodTestResult, ResultClassification, FiredRule } from './types';
import { hasCriticalValue, hasAbnormalResult, hasAnyResultValue } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion against reference ranges and
 * critical (panic) values:
 * - critical: a critical (panic) value is present.
 * - inconclusive: no analyte result values were measured / the specimen was
 *   inadequate with no confident impression.
 * - abnormal: one or more abnormal results are present.
 * - normal: no abnormal result on an adequate specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: BloodTestResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalValue(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-value',
			description:
				'A critical (panic) value is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (!hasAnyResultValue(r) && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'no-result-values',
			description:
				'No analyte result values were measured and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.specimenCondition === 'insufficient' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'inadequate-specimen',
			description:
				'Specimen was insufficient and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAbnormalResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-result',
			description: 'One or more abnormal results are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-result',
		description: 'No abnormal results on an adequate specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
