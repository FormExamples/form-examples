import type { NerveConductionStudyResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding, isNormalStudy } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall electrodiagnostic conclusion:
 * - critical: a critical structured finding (motor neurone disease features, or
 *   a severe acute neuropathy such as a GBS pattern) is present.
 * - inconclusive: the study was non-diagnostic, or limited with no confident
 *   impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: an electrodiagnostically normal study on an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: NerveConductionStudyResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-finding',
			description: r.motorNeuroneDiseaseFeatures
				? 'Motor neurone disease / anterior-horn-cell features are present; classified as critical.'
				: 'A severe acute neuropathy (e.g. GBS pattern) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.studyAdequacy === 'non-diagnostic') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'non-diagnostic',
			description: 'Study was non-diagnostic; classified as inconclusive.'
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

	if (isNormalStudy(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-NORMAL-01',
			axis: 'classification',
			category: 'normal-study',
			description: 'Electrodiagnostically normal study; classified as normal.'
		});
		return { resultClassification: 'normal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-02',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal structured findings on an interpretable study; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
