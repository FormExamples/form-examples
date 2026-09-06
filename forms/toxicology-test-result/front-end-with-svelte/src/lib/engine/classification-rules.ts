import type { ToxicologyResult, ResultClassification, FiredRule } from './types';
import { isCriticalResult, hasAnyResultValue } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a toxic level is present (paracetamol above the treatment line,
 *   or `toxicLevelPresent`), or the clinician recorded an overall critical
 *   status.
 * - inconclusive: the specimen was insufficient, or no assay result value was
 *   recorded at all (nothing to interpret).
 * - abnormal: the clinician recorded an overall abnormal status.
 * - normal: an interpretable assay with no toxic or abnormal status.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: ToxicologyResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (isCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'toxic-level',
			description:
				'A toxic level is present (paracetamol above the treatment line, toxic level flag, a reported level over a recognised toxic threshold, or overall critical status); classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.specimenCondition === 'insufficient') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'insufficient-specimen',
			description: 'Specimen was insufficient; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (!hasAnyResultValue(r) && r.overallResultStatus === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'no-result-value',
			description:
				'No assay result value and no overall status recorded; nothing to interpret. Classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.overallResultStatus === 'abnormal') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-status',
			description: 'Overall result status recorded as abnormal; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-result',
		description: 'No toxic or abnormal result on an interpretable assay; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
