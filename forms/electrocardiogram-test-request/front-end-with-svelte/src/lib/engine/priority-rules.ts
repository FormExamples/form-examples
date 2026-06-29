import type { AppropriatenessBand, PriorityBand, TriageTier, FiredRule } from './types';

// ──────────────────────────────────────────────
// Axis D — Clinical priority (composite acuity band low / moderate / high)
//
// Priority is a composite band derived primarily from the triage tier, then
// raised by appropriateness concerns. The least-alarming band wins only when
// nothing escalates. Rule IDs are stable and identical across every front-end
// and the back-end.
// ──────────────────────────────────────────────

export const PRIORITY_ORDER: PriorityBand[] = ['low', 'moderate', 'high'];

/** Return whichever of two priority bands is more severe. */
export function maxPriority(a: PriorityBand, b: PriorityBand): PriorityBand {
	return PRIORITY_ORDER.indexOf(a) >= PRIORITY_ORDER.indexOf(b) ? a : b;
}

/**
 * Axis D — compute the clinical-priority band and the fired priority rules from
 * the triage tier and the appropriateness band.
 */
export function scorePriority(
	triageTier: TriageTier,
	apprBand: AppropriatenessBand
): { priorityBand: PriorityBand; firedRules: FiredRule[] } {
	const firedRules: FiredRule[] = [];
	let band: PriorityBand = 'low';

	if (triageTier === 'emergency') {
		band = maxPriority(band, 'high');
		firedRules.push({
			ruleId: 'R-PRIORITY-EMERGENCY',
			axis: 'priority',
			category: 'triage',
			description: 'Emergency triage tier — high clinical priority.'
		});
	} else if (triageTier === 'urgent') {
		band = maxPriority(band, 'moderate');
		firedRules.push({
			ruleId: 'R-PRIORITY-URGENT',
			axis: 'priority',
			category: 'triage',
			description: 'Urgent triage tier — moderate clinical priority.'
		});
	}

	if (apprBand === 'usually-not-appropriate') {
		band = maxPriority(band, 'moderate');
		firedRules.push({
			ruleId: 'R-PRIORITY-APPROPRIATENESS',
			axis: 'priority',
			category: 'appropriateness',
			description:
				'Request is usually-not-appropriate — raise to at least moderate priority for vetting.'
		});
	}

	if (firedRules.length === 0) {
		firedRules.push({
			ruleId: 'R-PRIORITY-BASELINE',
			axis: 'priority',
			category: 'baseline',
			description: 'No escalating factors; baseline low clinical priority.'
		});
	}

	return { priorityBand: band, firedRules };
}
