import type { NeurodiversityAdjustmentReview, WellbeingRiskBand, FiredRule } from './types';
import { anyNotWorking } from './utils';

/** Band severity order (lowest → highest); the maximum fired band wins. */
const BAND_ORDER: Record<Exclude<WellbeingRiskBand, ''>, number> = {
	ok: 0,
	caution: 1,
	'high-risk': 2
};

/**
 * Axis B — wellbeing risk.
 *
 * Every rule below is evaluated; all that fire are recorded in the audit trail.
 * The final band is the maximum severity among the fired rules. When nothing
 * fires the band is `ok` and R-WELL-OK is emitted.
 *
 * An escalation, declining wellbeing, or a dissatisfied worker each drive the
 * band to high-risk — the principal wellbeing-risk signals of a review.
 */
export function gradeWellbeing(r: NeurodiversityAdjustmentReview): {
	wellbeingRiskBand: WellbeingRiskBand;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];

	if (r.escalated) {
		firedRules.push({
			ruleId: 'R-WELL-ESCALATED',
			axis: 'wellbeing',
			category: 'high-risk',
			description: 'Matter escalated.'
		});
	}

	if (r.wellbeingChange === 'worse') {
		firedRules.push({
			ruleId: 'R-WELL-DECLINED',
			axis: 'wellbeing',
			category: 'high-risk',
			description: "Worker's wellbeing has worsened since the adjustments."
		});
	}

	if (r.workerSatisfied === 'no') {
		firedRules.push({
			ruleId: 'R-WELL-DISSATISFIED',
			axis: 'wellbeing',
			category: 'high-risk',
			description: 'Worker is not satisfied the adjustments meet their needs.'
		});
	}

	if (anyNotWorking(r)) {
		firedRules.push({
			ruleId: 'R-WELL-NOT-WORKING',
			axis: 'wellbeing',
			category: 'caution',
			description: 'At least one adjustment is not working.'
		});
	}

	if (r.workerSatisfied === 'partially') {
		firedRules.push({
			ruleId: 'R-WELL-PARTIAL-SATISFACTION',
			axis: 'wellbeing',
			category: 'caution',
			description: 'Worker is only partially satisfied.'
		});
	}

	if (r.barriersDetail.trim() !== '') {
		firedRules.push({
			ruleId: 'R-WELL-BARRIERS',
			axis: 'wellbeing',
			category: 'caution',
			description: 'Remaining barriers reported.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-WELL-OK',
			axis: 'wellbeing',
			category: 'ok',
			description: 'No wellbeing risk detected from the review.'
		});
		return { wellbeingRiskBand: 'ok', firedRules };
	}

	let band: Exclude<WellbeingRiskBand, ''> = 'ok';
	for (const rule of firedRules) {
		const c = rule.category as Exclude<WellbeingRiskBand, ''>;
		if (c in BAND_ORDER && BAND_ORDER[c] > BAND_ORDER[band]) band = c;
	}
	return { wellbeingRiskBand: band, firedRules };
}
