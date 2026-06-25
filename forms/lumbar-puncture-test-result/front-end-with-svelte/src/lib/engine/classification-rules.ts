import type { LumbarPunctureResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/** Whether the core CSF dataset is too sparse to interpret. */
function isUninterpretable(r: LumbarPunctureResult): boolean {
	return (
		r.csfAppearance === '' &&
		r.csfWhiteCellCount === null &&
		r.csfProteinGL === null &&
		r.csfGlucoseMmolL === null &&
		!hasAnyAbnormalFinding(r) &&
		!r.normalCsf
	);
}

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical CSF result (bacterial meningitis pattern, suggested
 *   subarachnoid haemorrhage, or a positive culture) is present.
 * - inconclusive: the core CSF dataset is too sparse to interpret, or the report
 *   is internally contradictory (an abnormal pattern asserted with no impression).
 * - abnormal: any abnormal structured finding / pattern is present.
 * - normal: no abnormal finding and a recorded normal-CSF interpretation.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: LumbarPunctureResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-result',
			description:
				'A critical CSF result (bacterial meningitis pattern, suggested subarachnoid haemorrhage, or positive culture) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (isUninterpretable(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'insufficient-data',
			description:
				'Insufficient CSF data recorded to interpret the analysis; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r) && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'abnormal-no-impression',
			description:
				'An abnormal CSF pattern is asserted but no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description: 'One or more abnormal structured CSF findings are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal structured CSF findings on an interpretable analysis; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
