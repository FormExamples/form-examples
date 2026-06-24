import type { CytologyResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: malignant cells, or a high-grade dyskaryosis / Thy5 / breast C5 /
 *   malignant reporting category, is present.
 * - inconclusive: the specimen was unsatisfactory / inadequate, or no diagnosis
 *   could be reached.
 * - abnormal: any abnormal cytology finding (dysplasia, HPV-driven, low-grade)
 *   is present.
 * - normal: no abnormal finding and a satisfactory specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: CytologyResult): {
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
				'A critical finding (malignant cells, high-grade dyskaryosis, Thy5, or breast C5) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.specimenAdequacy === 'unsatisfactory') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'unsatisfactory-specimen',
			description: 'Specimen was unsatisfactory for interpretation; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.cytologyResultCategory.trim() === '' && r.diagnosis.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'no-diagnosis',
			description:
				'No result category and no diagnosis were recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'One or more abnormal cytology findings (dysplasia / dyskaryosis, low-grade or atypical category) are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (r.hpvResult === 'positive') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'hpv-positive',
			description:
				'HPV positive with negative cytology; classified as abnormal (HPV surveillance pathway).'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal cytology finding on a satisfactory specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
