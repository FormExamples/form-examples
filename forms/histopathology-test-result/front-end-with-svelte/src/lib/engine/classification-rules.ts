import type { HistopathologyResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (an unexpected malignancy, or an involved
 *   resection margin) is present.
 * - inconclusive: the specimen was inadequate, or suboptimal with no confident
 *   diagnosis.
 * - abnormal: confirmed (but expected) malignancy or another abnormal
 *   structured finding is present.
 * - normal: no abnormal finding on an adequate specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: HistopathologyResult): {
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
				'A critical finding (an unexpected malignancy or an involved resection margin) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.specimenAdequacy === 'inadequate') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'inadequate-specimen',
			description: 'Specimen was inadequate for diagnosis; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.specimenAdequacy === 'suboptimal' && r.diagnosis.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'suboptimal-no-diagnosis',
			description:
				'Specimen was suboptimal and no diagnosis was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.malignancyPresent) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'malignancy-present',
			description: 'Malignancy is present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'One or more abnormal structured findings (close margin or lymphovascular invasion) are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No malignancy and no abnormal structured findings on an adequate specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
