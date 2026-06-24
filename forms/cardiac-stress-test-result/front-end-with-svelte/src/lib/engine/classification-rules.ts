import type { CardiacStressResult, ResultClassification, FiredRule } from './types';
import { hasCriticalResult, hasAnyAbnormalFinding, isInconclusiveStudy } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical result (strongly positive test, exertional
 *   hypotension, ischaemia at low workload, or a high-risk Duke score).
 * - inconclusive: a non-diagnostic / inconclusive study (e.g. submaximal,
 *   uninterpretable), or an inconclusive flag with no impression.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding on an interpretable study.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: CardiacStressResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-result',
			description:
				'A critical result (strongly positive test, exertional hypotension, ischaemia at low workload, or a high-risk Duke treadmill score) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (isInconclusiveStudy(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'non-diagnostic',
			description: 'Test was inconclusive / non-diagnostic; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.terminatedEarly && r.impression.trim() === '' && !hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'terminated-no-impression',
			description:
				'Test was terminated early and no impression was recorded; classified as inconclusive.'
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

	if (r.terminatedEarly) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'early-termination',
			description:
				'Test was terminated early (submaximal) without a clearly negative endpoint; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal structured findings on an interpretable test; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
