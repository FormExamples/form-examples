// Oxford Hip Score (OHS) rules.
//
// The OHS is the validated 12-item patient-reported outcome measure for hip
// osteoarthritis (Dawson et al., J Bone Joint Surg Br 1996). Each item is
// scored 0 (worst) to 4 (best); the total is 0-48. The four-band split below
// is this form's operational convention -- see spec/index.md section 3.

import type { FiredRule, HipReplacementSurgeryEvaluation, OhsCategory } from './types';
import { num, rule } from './utils';

export interface OhsResult {
	total: number;
	itemsAnswered: number;
	category: OhsCategory;
	firedRules: FiredRule[];
}

const OHS_ITEM_KEYS = [
	'painSeverity',
	'washingAndDrying',
	'transport',
	'dressingSocks',
	'shopping',
	'walkingPain',
	'limping',
	'kneeling',
	'nightPain',
	'workInterference',
	'givingWay',
	'stairs'
] as const;

/** Derive the OHS category from the total, per this form's four-band convention. */
export function ohsCategoryFromTotal(total: number): OhsCategory {
	if (total <= 19) return 'severe';
	if (total <= 29) return 'moderate';
	if (total <= 39) return 'mild-to-moderate';
	return 'satisfactory';
}

/**
 * Score the 12-item Oxford Hip Score. Unanswered items are treated as 0 in
 * the sum (the wizard requires all 12 before completion; the engine stays
 * defensive so partial data still produces a deterministic result).
 */
export function scoreOhs(data: HipReplacementSurgeryEvaluation): OhsResult {
	const firedRules: FiredRule[] = [];
	let total = 0;
	let itemsAnswered = 0;

	for (const key of OHS_ITEM_KEYS) {
		const value = num(data.ohs[key]);
		if (value !== null) {
			total += value;
			itemsAnswered += 1;
		}
	}

	const category = ohsCategoryFromTotal(total);

	firedRules.push(
		rule(
			'R-OHS-TOTAL',
			'ohs',
			'total',
			total,
			category,
			'oxford-hip-score',
			`Oxford Hip Score total ${total} of 48 falls in the ${category} band.`
		)
	);

	return { total, itemsAnswered, category, firedRules };
}
