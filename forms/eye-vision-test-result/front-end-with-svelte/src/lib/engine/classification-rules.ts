import type { EyeVisionResult, ResultClassification, FiredRule } from './types';
import { hasCriticalFinding, hasAnyAbnormalFinding } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical structured finding (proliferative retinopathy, acutely
 *   raised intraocular pressure, or reduced acuity with an optic-disc
 *   abnormality) is present.
 * - inconclusive: nothing was recorded — no structured findings, no narrative,
 *   no impression, and no normal-examination flag — so the study is
 *   uninterpretable.
 * - abnormal: any abnormal structured finding is present.
 * - normal: no abnormal finding and an interpretable examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: EyeVisionResult): {
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
				'A critical ophthalmic finding (proliferative retinopathy, acutely raised IOP, or reduced acuity with optic-disc abnormality) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	const nothingRecorded =
		!hasAnyAbnormalFinding(r) &&
		!r.normalExamination &&
		r.findingsNarrative.trim() === '' &&
		r.impression.trim() === '';

	if (nothingRecorded) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'no-findings-recorded',
			description:
				'No findings, narrative, or impression were recorded; the examination is uninterpretable, classified as inconclusive.'
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

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description:
			'No abnormal structured findings on an interpretable examination; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
