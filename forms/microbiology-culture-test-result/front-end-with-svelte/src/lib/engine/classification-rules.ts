import type { MicrobiologyCultureResult, ResultClassification, FiredRule } from './types';
import {
	hasCriticalOrganism,
	hasAnyAbnormalFinding,
	isPositiveCulture,
	hasResistanceMarker,
	hasPositiveSpecialisedTest
} from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall reporting conclusion:
 * - critical: a critical organism / result (positive blood culture, CSF
 *   isolate, CPE, or a flagged critical organism) is present.
 * - inconclusive: the specimen was insufficient / contaminated, or no
 *   confident impression could be reached.
 * - abnormal: any abnormal microbiological finding is present (significant
 *   growth, resistance marker, or positive specialised test).
 * - normal: no growth / no abnormal finding on a satisfactory specimen.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: MicrobiologyCultureResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (hasCriticalOrganism(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'critical-organism',
			description:
				'A critical organism / result (positive blood culture, CSF isolate, CPE, or flagged critical organism) is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.specimenCondition === 'insufficient') {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'insufficient-specimen',
			description: 'Specimen was insufficient for processing; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (
		(r.specimenCondition === 'contaminated' || r.cultureResult === 'mixed-growth') &&
		r.impression.trim() === ''
	) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-02',
			axis: 'classification',
			category: 'contaminated-no-impression',
			description:
				'Specimen was contaminated or grew mixed flora and no impression was recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		const category = isPositiveCulture(r)
			? 'significant-growth'
			: hasResistanceMarker(r)
				? 'resistance-marker'
				: hasPositiveSpecialisedTest(r)
					? 'positive-specialised-test'
					: 'abnormal-finding';
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category,
			description:
				'A clinically significant microbiological finding is present (significant growth, resistance marker, or positive specialised test); classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'no-significant-growth',
		description:
			'No significant growth and no abnormal finding on a satisfactory specimen; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
