/** A wizard section: arc42 section number, full title, and a short header label. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Introduction & Goals', shortTitle: 'Intro' },
	{ number: 2, title: 'Constraints', shortTitle: 'Constraints' },
	{ number: 3, title: 'Context & Scope', shortTitle: 'Context' },
	{ number: 4, title: 'Solution Strategy', shortTitle: 'Strategy' },
	{ number: 5, title: 'Building Block View', shortTitle: 'Blocks' },
	{ number: 6, title: 'Runtime View', shortTitle: 'Runtime' },
	{ number: 7, title: 'Deployment View', shortTitle: 'Deployment' },
	{ number: 8, title: 'Crosscutting Concepts', shortTitle: 'Crosscutting' },
	{ number: 9, title: 'Architectural Decisions', shortTitle: 'Decisions' },
	{ number: 10, title: 'Quality Requirements', shortTitle: 'Quality' },
	{ number: 11, title: 'Risks & Technical Debt', shortTitle: 'Risks' },
	{ number: 12, title: 'Summary, Maturity & Sign-off', shortTitle: 'Summary' }
];

/** Legacy alias kept for any consumer importing the original shape. */
export const STEPS = steps;
