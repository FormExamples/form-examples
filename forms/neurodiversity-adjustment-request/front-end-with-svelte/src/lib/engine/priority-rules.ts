import type { NeurodiversityAdjustmentRequest, PriorityTier, FiredRule } from './types';
import { priorityTierLabel } from './utils';

/** Priority tiers in ascending urgency; the highest firing rule wins. */
const ORDER: PriorityTier[] = ['routine', 'soon', 'urgent'];

function raise(current: PriorityTier, next: PriorityTier): PriorityTier {
	return ORDER.indexOf(next) > ORDER.indexOf(current) ? next : current;
}

/** Target timeframe implied by the priority tier. */
export function targetTimeframeFor(tier: PriorityTier): string {
	switch (tier) {
		case 'urgent':
			return 'Within 5 working days (act without unreasonable delay)';
		case 'soon':
			return 'Within 10 working days';
		case 'routine':
			return 'Within 20 working days';
		default:
			return '';
	}
}

/**
 * Axis D — handling priority, plus the target timeframe.
 *
 * Escalation ladder (routine → soon → urgent). The base tier is the worker's
 * requested urgency; each firing rule raises the tier to at least its level
 * (max wins). Being at risk of absence / burnout, or severe impact, escalates to
 * urgent. If no escalation rule fires, the requested tier stands. The Equality
 * Act duty is to respond without unreasonable delay.
 */
export function gradePriority(r: NeurodiversityAdjustmentRequest): {
	priorityTier: PriorityTier;
	targetTimeframe: string;
	firedRules: FiredRule[];
} {
	const firedRules: FiredRule[] = [];
	const base: PriorityTier =
		r.urgency === 'routine' || r.urgency === 'soon' || r.urgency === 'urgent'
			? r.urgency
			: 'routine';
	let tier: PriorityTier = base;

	if (r.atRiskOfAbsence) {
		firedRules.push({
			ruleId: 'R-PRIORITY-ABSENCE-RISK',
			axis: 'priority',
			category: 'absence-risk',
			description: 'Absence / burnout risk — respond urgently and without unreasonable delay.'
		});
		tier = raise(tier, 'urgent');
	}

	if (r.currentImpact === 'severe') {
		firedRules.push({
			ruleId: 'R-PRIORITY-SEVERE',
			axis: 'priority',
			category: 'severe-impact',
			description: 'Severe impact — respond urgently.'
		});
		tier = raise(tier, 'urgent');
	}

	if (r.currentImpact === 'high') {
		firedRules.push({
			ruleId: 'R-PRIORITY-HIGH',
			axis: 'priority',
			category: 'high-impact',
			description: 'High impact — respond soon.'
		});
		tier = raise(tier, 'soon');
	}

	if (r.difficultyBurnoutWellbeing) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BURNOUT',
			axis: 'priority',
			category: 'burnout',
			description: 'Burnout difficulty — respond soon.'
		});
		tier = raise(tier, 'soon');
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-REQUESTED',
			axis: 'priority',
			category: 'requested',
			description: `Priority follows the requested urgency (${priorityTierLabel(base)}).`
		});
	}

	return { priorityTier: tier, targetTimeframe: targetTimeframeFor(tier), firedRules };
}
