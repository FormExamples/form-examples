export interface StepDef {
	number: number;
	title: string;
	shortTitle: string;
}

// 9 steps (spec/index.md "Wizard" table): visit details (1), SF-36v2
// spread across 4 steps (2-5), NDI (6), mJOA (7), EQ-5D-3L (8), and a
// final summary of all four instruments (9).
export const STEPS: StepDef[] = [
	{ number: 1, title: 'Visit details', shortTitle: 'Visit' },
	{ number: 2, title: 'SF-36v2 — general health', shortTitle: 'SF-36 · General health' },
	{ number: 3, title: 'SF-36v2 — activities', shortTitle: 'SF-36 · Activities' },
	{ number: 4, title: 'SF-36v2 — role limitations', shortTitle: 'SF-36 · Role limitations' },
	{
		number: 5,
		title: 'SF-36v2 — pain, social, vitality, health perceptions',
		shortTitle: 'SF-36 · Remaining'
	},
	{ number: 6, title: 'Neck Disability Index', shortTitle: 'NDI' },
	{ number: 7, title: 'modified JOA', shortTitle: 'mJOA' },
	{ number: 8, title: 'EQ-5D-3L', shortTitle: 'EQ-5D' },
	{ number: 9, title: 'Summary', shortTitle: 'Summary' }
];

export const TOTAL_STEPS = STEPS.length; // 9
