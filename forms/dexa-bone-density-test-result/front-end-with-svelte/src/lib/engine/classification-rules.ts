import type { DexaBoneDensityResult, ResultClassification, FiredRule } from './types';
import {
	effectiveWhoClassification,
	hasCriticalFinding,
	hasAnyAbnormalFinding
} from './utils';

/**
 * Axis A — result classification.
 *
 * Maps the WHO densitometric classification (driven by the lowest T-score)
 * onto the overall reporting conclusion:
 * - critical: severe (established) osteoporosis — T ≤ −2.5 with a fragility /
 *   vertebral fracture.
 * - inconclusive: the examination was non-diagnostic, or limited with no
 *   confident impression, or no lowest T-score was recorded.
 * - abnormal: osteopenia or osteoporosis.
 * - normal: T ≥ −1.0 on an adequate examination.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: DexaBoneDensityResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'severe-osteoporosis',
			description:
				'Severe (established) osteoporosis — T ≤ −2.5 with an identified fragility / vertebral fracture; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.examinationAdequacy === 'non-diagnostic') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'non-diagnostic',
			description: 'Examination was non-diagnostic; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (r.examinationAdequacy === 'limited' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'limited-no-impression',
			description:
				'Examination was limited and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (effectiveWhoClassification(r) === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-03',
			axis: 'classification',
			category: 'no-quantitative-finding',
			description:
				'No lowest T-score / WHO classification was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'reduced-bone-density',
			description:
				'Reduced bone density (osteopenia or osteoporosis) on the WHO densitometric classification; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'normal-bone-density',
		description:
			'Normal bone density (T ≥ −1.0) on an interpretable examination; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
