import type { CoagulationResult, ResultClassification, FiredRule } from './types';
import { hasCriticalValue, hasAnyAbnormalValue, hasSpecimenQualityIssue } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical (panic) value is present (INR > 8, fibrinogen < 1.0 g/L,
 *   a DIC picture, or an explicitly flagged critical value / status).
 * - inconclusive: the specimen condition compromises interpretation (clotted,
 *   underfilled, haemolysed, insufficient) and no confident impression exists.
 * - abnormal: the reported status is abnormal, or any result value is outside
 *   its reference range.
 * - normal: a reported normal status with no abnormal value.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: CoagulationResult): {
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
				'A critical value (INR > 8, fibrinogen < 1.0 g/L, a DIC picture, or a flagged critical result) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (hasSpecimenQualityIssue(r) && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'specimen-quality',
			description:
				'Specimen condition compromises interpretation and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.overallResultStatus === 'abnormal' || hasAnyAbnormalValue(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-value',
			description:
				'The reported status is abnormal or one or more result values are outside the reference range; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-value',
		description:
			'No abnormal or critical result values on a satisfactory specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
