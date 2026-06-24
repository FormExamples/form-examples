import type { BloodCrossMatchResult, ResultClassification, FiredRule } from './types';
import {
	hasCriticalResult,
	hasAnyAbnormalFinding,
	isAboDiscrepancy,
	isTwoSampleRuleUnmet
} from './utils';

/**
 * Axis A — result classification.
 *
 * Determines the overall compatibility conclusion:
 * - critical: an ABO discrepancy or an unmet two-sample group-check rule (a
 *   patient-identity / Wrong-Blood-in-Tube safety event).
 * - abnormal: an incompatible crossmatch or clinically-significant antibodies
 *   (a positive antibody screen) — abnormal but not necessarily an identity event.
 * - inconclusive: crossmatch not performed and grouping incomplete, with no
 *   confident impression recorded.
 * - normal: a compatible result on a complete, concordant work-up.
 *
 * Returns the classification plus the audit-trail rules that fired.
 * Rule IDs are stable and identical across every front-end and the back-end.
 */
export function classifyResult(r: BloodCrossMatchResult): {
	resultClassification: ResultClassification;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (isAboDiscrepancy(r) || isTwoSampleRuleUnmet(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-01',
			axis: 'classification',
			category: 'identity-safety',
			description:
				'An ABO discrepancy (historical-group non-concordance) or an unmet two-sample group-check rule is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	if (r.crossmatchResult === 'incompatible' || r.antibodyScreenResult === 'positive') {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-01',
			axis: 'classification',
			category: 'incompatible-or-antibodies',
			description:
				'An incompatible crossmatch or clinically-significant antibodies (positive antibody screen) is present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	if (
		r.crossmatchResult === 'not-performed' &&
		r.aboGroup === '' &&
		r.impression.trim() === ''
	) {
		firedRules.push({
			ruleId: 'R-CLASS-INCONCLUSIVE-01',
			axis: 'classification',
			category: 'incomplete-workup',
			description:
				'Crossmatch not performed and grouping incomplete with no impression recorded; classified as inconclusive.'
		});
		return { resultClassification: 'inconclusive', firedRules };
	}

	if (hasAnyAbnormalFinding(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-ABNORMAL-02',
			axis: 'classification',
			category: 'abnormal-finding',
			description:
				'An abnormal structured finding (e.g. insufficient compatible units) is present; classified as abnormal.'
		});
		return { resultClassification: 'abnormal', firedRules };
	}

	// Defensive: critical predicate covered above, kept for parity with the contract.
	if (hasCriticalResult(r)) {
		firedRules.push({
			ruleId: 'R-CLASS-CRITICAL-02',
			axis: 'classification',
			category: 'critical-result',
			description: 'A critical result is present; classified as critical.'
		});
		return { resultClassification: 'critical', firedRules };
	}

	firedRules.push({
		ruleId: 'R-CLASS-NORMAL-01',
		axis: 'classification',
		category: 'compatible',
		description:
			'Compatible result on a complete, concordant work-up with no critical result; classified as normal.'
	});
	return { resultClassification: 'normal', firedRules };
}
