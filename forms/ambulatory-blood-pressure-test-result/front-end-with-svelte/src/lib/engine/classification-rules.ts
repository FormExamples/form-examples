import type { AmbulatoryBloodPressureResult, ResultClassification, FiredRule } from './types';
import {
	hasCriticalFinding,
	hasAnyAbnormalFinding,
	recordingIsInadequate
} from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a severe-hypertension result (structured boolean or ABPM average
 *   >= 150/95, equivalent to clinic >= 180/120) is present.
 * - inconclusive: the recording was inadequate (< 70% valid readings) with no
 *   confident impression.
 * - abnormal: any abnormal interpretation (hypertension confirmed, masked,
 *   nocturnal, or a raised average) is present.
 * - normal: no abnormal interpretation on an adequate recording.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: AmbulatoryBloodPressureResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'severe-hypertension',
			description:
				'A severe-hypertension result (ABPM average >= 150/95, equivalent to clinic >= 180/120) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (recordingIsInadequate(r) && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'inadequate-recording',
			description:
				'Recording was inadequate (< 70% valid readings) and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'One or more abnormal interpretations (raised average or confirmed/masked/nocturnal hypertension) are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (r.whiteCoatEffect) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'white-coat-effect',
			description:
				'White-coat effect present (raised clinic BP but normal ambulatory averages); classified as abnormal (not a normal study).'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal interpretation on an adequate recording; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
