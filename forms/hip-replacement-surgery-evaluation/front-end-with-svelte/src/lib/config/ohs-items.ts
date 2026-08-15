// The Oxford Hip Score (OHS) — the 12 items presented to the clinician on
// step 4, each a 0 (worst) to 4 (best) Likert scale summing to the OHS total
// (0-48). See doc/ohs-scoring.md for the item concepts and the licensing
// note (Dawson et al. 1996, owned by Oxford University Innovation); the
// question text below is an original paraphrase of each item's clinical
// concept rather than a reproduction of the copyrighted instrument wording.
//
// Field keys match OhsSection in src/lib/engine/types.ts.

import type { OhsSection } from '#lib/engine/types.js';

export interface OhsResponseOption {
	value: number;
	label: string;
}

export interface OhsItemConfig {
	key: keyof OhsSection;
	number: number;
	question: string;
	options: OhsResponseOption[];
}

/** Response labels ordered 4 (best) down to 0 (worst), for a pain/difficulty item. */
function difficultyScale(best: string, good: string, moderate: string, poor: string, worst: string): OhsResponseOption[] {
	return [
		{ value: 4, label: best },
		{ value: 3, label: good },
		{ value: 2, label: moderate },
		{ value: 1, label: poor },
		{ value: 0, label: worst }
	];
}

export const OHS_ITEMS: OhsItemConfig[] = [
	{
		key: 'painSeverity',
		number: 1,
		question: 'How would you describe the pain you usually have from your hip?',
		options: difficultyScale('None', 'Very mild', 'Mild', 'Moderate', 'Severe')
	},
	{
		key: 'washingAndDrying',
		number: 2,
		question: 'How much difficulty have you had washing and drying yourself because of your hip?',
		options: difficultyScale('None', 'A little', 'Moderate', 'Extreme', 'Impossible to do')
	},
	{
		key: 'transport',
		number: 3,
		question: 'How much difficulty have you had getting in or out of a car, or using public transport, because of your hip?',
		options: difficultyScale('None', 'A little', 'Moderate', 'Extreme', 'Impossible to do')
	},
	{
		key: 'dressingSocks',
		number: 4,
		question: 'How much difficulty have you had putting on a pair of socks or stockings because of your hip?',
		options: difficultyScale('None', 'A little', 'Moderate', 'Extreme', 'Impossible to do')
	},
	{
		key: 'shopping',
		number: 5,
		question: 'How well have you been able to do the household shopping on your own?',
		options: difficultyScale('Very easily', 'Fairly easily', 'With some difficulty', 'With extreme difficulty', 'Impossible to do')
	},
	{
		key: 'walkingPain',
		number: 6,
		question: 'How much pain have you experienced walking, because of your hip?',
		options: difficultyScale('None', 'Mild, or occasional', 'Moderate', 'Severe', 'Unbearable')
	},
	{
		key: 'limping',
		number: 7,
		question: 'Have you been limping when walking, because of your hip?',
		options: difficultyScale('Rarely or never', 'Sometimes, or just at first', 'Often, not just at first', 'Most of the time', 'All of the time')
	},
	{
		key: 'kneeling',
		number: 8,
		question: 'How much difficulty have you had kneeling down and getting up again afterwards because of your hip?',
		options: difficultyScale('None', 'A little', 'Moderate', 'Extreme', 'Impossible to do')
	},
	{
		key: 'nightPain',
		number: 9,
		question: 'How often has your hip pain troubled you in bed at night?',
		options: difficultyScale('No nights', 'Only 1 or 2 nights', 'Some nights', 'Most nights', 'Every night')
	},
	{
		key: 'workInterference',
		number: 10,
		question: 'How much has your hip pain interfered with your usual work, including housework?',
		options: difficultyScale('Not at all', 'A little bit', 'Moderately', 'Greatly', 'Totally')
	},
	{
		key: 'givingWay',
		number: 11,
		question: 'How often has your hip felt like it might suddenly "give way" or let you down?',
		options: difficultyScale('Never', 'Rarely', 'Sometimes', 'Often', 'Very often')
	},
	{
		key: 'stairs',
		number: 12,
		question: 'Have you been able to walk down a flight of stairs?',
		options: difficultyScale('Easily', 'With a little difficulty', 'With moderate difficulty', 'With extreme difficulty', 'Impossible to do')
	}
];
