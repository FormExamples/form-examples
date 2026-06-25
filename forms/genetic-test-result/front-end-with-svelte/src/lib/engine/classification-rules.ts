import type { GeneticResult, ResultClassification, FiredRule } from './types';
import { hasPathogenicVariant, hasVus, isNegativeResult } from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion, driven by the ACMG/AMP (ACGS)
 * variant classification and the structured finding booleans:
 * - critical: a pathogenic / likely-pathogenic actionable variant is present.
 * - abnormal: a positive carrier status, or a secondary / incidental finding.
 * - inconclusive: a variant of uncertain significance (VUS).
 * - normal: a negative / benign result, or no clinically significant variant.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: GeneticResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasPathogenicVariant(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'pathogenic-variant',
			description:
				'A pathogenic or likely-pathogenic actionable variant is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.secondaryFinding) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'secondary-finding',
			description:
				'A secondary / incidental actionable finding is present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (r.carrierStatusPositive) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'carrier-status',
			description:
				'Carrier status is positive for a recessive / X-linked condition; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (hasVus(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'variant-uncertain-significance',
			description:
				'A variant of uncertain significance (VUS) is present; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (isNegativeResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-NORMAL-01',
			axis: 'classification',
			category: 'no-significant-variant',
			description:
				'A negative / benign result with no clinically significant variant; classified as normal.'
		});
		return { resultClassification: 'normal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-02',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No actionable variant or finding recorded; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
