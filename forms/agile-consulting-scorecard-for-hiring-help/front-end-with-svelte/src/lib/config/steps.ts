// Wizard section configuration for the agile-consulting scorecard.
// All six sections render continuously as one single-page wizard.

/** One wizard section. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Organization & respondent', shortTitle: 'Organization' },
	{ number: 2, title: 'Agile Manifesto (4 items)', shortTitle: 'Manifesto' },
	{ number: 3, title: 'Principles 1–4', shortTitle: 'Principles 1–4' },
	{ number: 4, title: 'Principles 5–8', shortTitle: 'Principles 5–8' },
	{ number: 5, title: 'Principles 9–12', shortTitle: 'Principles 9–12' },
	{ number: 6, title: 'Score & sign-off', shortTitle: 'Score' },
];
