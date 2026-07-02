import type { AssessmentData, FiredRule, GradingResult, Status, Urgency } from './types';
import {
	mandatoryRules,
	completenessSlots,
	additionalSexual
} from './child-safeguarding-rules';
import { detectFlaggedIssues } from './flagged-issues';

/**
 * Evaluate the mandatory rules against the referral.
 */
export function evaluateRules(referral: AssessmentData): FiredRule[] {
	const fired: FiredRule[] = [];
	for (const rule of mandatoryRules) {
		let satisfied = false;
		try {
			satisfied = rule.evaluate(referral) === true;
		} catch (e) {
			// Rule evaluation failed — log for debugging but continue grading.
			console.warn(`Safeguarding rule ${rule.id} evaluation failed:`, e);
		}
		fired.push({
			id: rule.id,
			rule: rule.rule,
			satisfied,
			category: rule.category,
			description: rule.description
		});
	}
	return fired;
}

/**
 * Count populated completeness slots over the slots that apply. A slot
 * contributes to the denominator only when it applies (all slots apply except
 * the conditional unsafe-to-inform-reason slot, which applies only when the
 * child / family are recorded as unaware).
 */
export function completeness(referral: AssessmentData): {
	presentCount: number;
	applicableCount: number;
	completenessPercent: number;
	allRecommendedPresent: boolean;
} {
	let applicable = 0;
	let present = 0;
	for (const slot of completenessSlots) {
		const applies = slot.applies ? slot.applies(referral) === true : true;
		if (!applies) continue;
		applicable++;
		if (slot.present(referral) === true) present++;
	}
	const completenessPercent = applicable === 0 ? 0 : Math.round((100 * present) / applicable);
	return {
		presentCount: present,
		applicableCount: applicable,
		completenessPercent,
		allRecommendedPresent: applicable > 0 && present === applicable
	};
}

/**
 * Classify the urgency of the referral. Always computed, regardless of
 * completeness, so immediate danger is never hidden behind a partial form.
 *
 *   urgency = immediateDanger == 'yes'                       ? 'emergency'
 *           : sexual category / disclosure / alleged person
 *             in contact / other children at risk            ? 'urgent'
 *           :                                                  'standard'
 */
export function classifyUrgency(referral: AssessmentData): Urgency {
	if (referral.risk.immediateDanger === 'yes') return 'emergency';
	if (
		referral.category.primaryCategory === 'sexual' ||
		additionalSexual(referral) ||
		referral.concern.childDisclosed === 'yes' ||
		referral.risk.allegedPersonInContact === 'yes' ||
		referral.risk.otherChildrenAtRisk === 'yes'
	) {
		return 'urgent';
	}
	return 'standard';
}

/**
 * Pure function: compute the full completeness grade and urgency for the
 * supplied referral, plus the independently-detected safeguarding flags.
 *
 * Algorithm (spec §4):
 *   firedRules     = each mandatory rule with { satisfied: boolean }
 *   mandatoryOk    = every mandatory rule satisfied
 *   status         = !mandatoryOk            ? 'incomplete'
 *                  : allRecommendedPresent   ? 'complete'
 *                  :                           'partial'
 *   completenessPercent = round(100 * presentSlots / applicableSlots)
 *
 * There is NO numeric clinical score. Urgency is ALWAYS computed — even when the
 * referral is `incomplete` — so danger is never hidden by an incomplete form.
 */
export function calculateSafeguardingGrade(referral: AssessmentData): GradingResult {
	const firedRules = evaluateRules(referral);
	const satisfiedCount = firedRules.filter((r) => r.satisfied).length;
	const mandatoryCount = firedRules.length;
	const mandatoryOk = satisfiedCount === mandatoryCount;

	const c = completeness(referral);

	let status: Status;
	if (!mandatoryOk) {
		status = 'incomplete';
	} else if (c.allRecommendedPresent) {
		status = 'complete';
	} else {
		status = 'partial';
	}

	return {
		status,
		urgency: classifyUrgency(referral),
		completenessPercent: c.completenessPercent,
		presentCount: c.presentCount,
		applicableCount: c.applicableCount,
		satisfiedCount,
		mandatoryCount,
		firedRules,
		flaggedIssues: detectFlaggedIssues(referral),
		timestamp: new Date().toISOString()
	};
}
