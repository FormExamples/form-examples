import type { UrinalysisResult, ResultClassification, FiredRule } from './types';
import {
	hasCriticalFinding,
	hasAnyAbnormalFinding,
	hasOnlyIncidentalFinding,
	hasSignificantGrowth,
	hasUtiFeatures
} from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical finding (significant growth in pregnancy, a critical
 *   organism, suspected urosepsis, or visible haematuria) is present.
 * - inconclusive: the specimen was insufficient, or contaminated / mixed-growth
 *   with no confident impression.
 * - abnormal: any abnormal finding (significant growth, UTI features, dipstick
 *   blood / protein) is present.
 * - normal: no abnormal finding on a satisfactory specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: UrinalysisResult): {
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
				'A critical finding (significant growth in pregnancy, critical organism, suspected urosepsis, or visible haematuria) is present; classified as critical.'
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

	if (r.cultureResult === 'mixed-growth-likely-contaminant' && r.impression.trim() === '') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'mixed-growth-no-impression',
			description:
				'Mixed growth (likely contaminant) and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasSignificantGrowth(r) || hasUtiFeatures(r) || hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'abnormal-finding',
			description: 'One or more abnormal findings are present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (hasOnlyIncidentalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'incidental-finding',
			description: 'Only incidental finding(s) present; classified as abnormal (not a normal study).'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-abnormal-finding',
		description: 'No abnormal findings on a satisfactory specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
