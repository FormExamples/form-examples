// Oxford Knee Score (OKS) and surgical-candidacy rules.
//
// OKS is published by Dawson, Fitzpatrick, Murray & Carr (J Bone Joint Surg
// Br 1998) and is free to use for non-commercial clinical purposes with
// attribution. See doc/oks-scoring.md for the item-by-item table and the
// candidacy precedence order.
//
// Every function here is pure: same inputs, same outputs, no I/O, no clock.

import { OKS_ITEM_KEYS } from './types';
import type {
	Candidacy,
	FiredRule,
	ImagingSection,
	KneeReplacementSurgeryEvaluation,
	OksCategory,
	OksSection
} from './types';
import { num, rule } from './utils';

export interface OksResult {
	itemScores: Record<string, number | null>;
	total: number;
	category: OksCategory;
	firedRules: FiredRule[];
}

/** Sum the 12 Oxford Knee Score items, treating an unanswered item as 0. */
export function scoreOks(oks: OksSection): OksResult {
	const itemScores: Record<string, number | null> = {};
	let total = 0;
	let answeredCount = 0;

	for (const key of OKS_ITEM_KEYS) {
		const v = num(oks[key]);
		itemScores[key] = v;
		if (v !== null) {
			total += v;
			answeredCount += 1;
		}
	}

	const category = oksCategory(total);
	const firedRules: FiredRule[] = [
		rule(
			'R-OKS-TOTAL',
			'oks',
			'total',
			total,
			category,
			'oxford-knee-score',
			`Oxford Knee Score total ${total} of 48 falls in the ${category.replace(/-/g, ' ')} band.`
		)
	];

	if (answeredCount < OKS_ITEM_KEYS.length) {
		firedRules.push(
			rule(
				'R-OKS-INCOMPLETE',
				'oks',
				'total',
				answeredCount,
				'',
				'oxford-knee-score',
				`Only ${answeredCount} of the 12 Oxford Knee Score items have been answered; the total is a partial score.`
			)
		);
	}

	return { itemScores, total, category, firedRules };
}

/** Map an Oxford Knee Score total to this form's operational category. */
export function oksCategory(total: number): OksCategory {
	if (total <= 19) return 'severe';
	if (total <= 29) return 'moderate';
	if (total <= 39) return 'mild-to-moderate';
	return 'satisfactory';
}

/** Highest Kellgren-Lawrence radiographic grade across the three compartments. */
export function maxKellgrenLawrenceGrade(imaging: ImagingSection): number | null {
	const grades = [
		num(imaging.kellgrenLawrenceGradeMedial),
		num(imaging.kellgrenLawrenceGradeLateral),
		num(imaging.kellgrenLawrenceGradePatellofemoral)
	].filter((g): g is number => g !== null);
	if (grades.length === 0) return null;
	return Math.max(...grades);
}

export interface CandidacyResult {
	candidacy: Candidacy;
	maxKellgrenLawrenceGrade: number | null;
	firedRules: FiredRule[];
}

/**
 * Compute the surgical-candidacy recommendation. Evaluated in order; the
 * first matching rule wins. See ../../../AGENTS.md "Candidacy computation".
 */
export function scoreCandidacy(data: KneeReplacementSurgeryEvaluation, oksTotal: number): CandidacyResult {
	const maxKl = maxKellgrenLawrenceGrade(data.imaging);
	const conservativeExhausted = data.conservative.conservativeMeasuresExhausted === 'yes';

	let candidacy: Candidacy;
	let description: string;

	if (oksTotal <= 19 && maxKl !== null && maxKl >= 3 && conservativeExhausted) {
		candidacy = 'strong-candidate';
		description = `Oxford Knee Score ${oksTotal} is 19 or below, Kellgren-Lawrence grade ${maxKl} is 3 or above, and conservative measures are exhausted.`;
	} else if (oksTotal <= 29 && conservativeExhausted && maxKl !== null && maxKl >= 2) {
		candidacy = 'candidate';
		description = `Oxford Knee Score ${oksTotal} is 29 or below, conservative measures are exhausted, and Kellgren-Lawrence grade ${maxKl} is 2 or above.`;
	} else if (!conservativeExhausted) {
		candidacy = 'continue-conservative';
		description =
			'Conservative measures have not been recorded as exhausted, regardless of Oxford Knee Score or Kellgren-Lawrence grade.';
	} else if (oksTotal >= 40 || maxKl === null || maxKl <= 1) {
		candidacy = 'not-indicated';
		description =
			oksTotal >= 40
				? `Oxford Knee Score ${oksTotal} is 40 or above, a satisfactory outcome.`
				: 'Kellgren-Lawrence grade is 1 or below in every recorded compartment.';
	} else {
		candidacy = 'mdt-review';
		description =
			'The findings are mixed or borderline and do not clearly satisfy the strong-candidate, candidate, continue-conservative, or not-indicated criteria.';
	}

	const firedRules: FiredRule[] = [
		rule('R-CANDIDACY', 'candidacy', 'recommendation', null, candidacy, 'surgical-candidacy', description)
	];

	return { candidacy, maxKellgrenLawrenceGrade: maxKl, firedRules };
}
