import type { TumorMarkerResult, ResultClassification, FiredRule } from './types';
import {
	isCriticalResult,
	hasGermCellCriticalMarker,
	hasActionSignal,
	hasAnyMeasuredMarker
} from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion in clinical context:
 * - critical: a very high AFP / beta-hCG (germ-cell pattern), or the reporting
 *   clinician recorded the overall status as critical.
 * - inconclusive: no marker was measured, or the specimen was insufficient.
 * - abnormal: a markedly elevated value, a rising trend on treatment, or the
 *   reporting clinician recorded the overall status as abnormal.
 * - normal: no action signal and an interpretable result.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: TumorMarkerResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (isCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-result',
			description: hasGermCellCriticalMarker(r)
				? 'A very high AFP / beta-hCG (suggesting a germ-cell tumour) is present; classified as critical.'
				: 'Overall result status recorded as critical; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.specimenCondition === 'insufficient' || !hasAnyMeasuredMarker(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'no-interpretable-result',
			description:
				'No interpretable marker result (specimen insufficient or no marker measured); classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasActionSignal(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'action-signal',
			description:
				'A markedly elevated value or a rising trend on treatment is present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (r.overallResultStatus === 'abnormal') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'reported-abnormal',
			description: 'Overall result status recorded as abnormal; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-action-signal',
		description:
			'No markedly elevated value, no rising trend, and an interpretable result; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
