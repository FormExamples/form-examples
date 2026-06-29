/** A wizard step: its 1-indexed number and display titles. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Reporter & cycle', shortTitle: 'Reporter' },
	{ number: 2, title: 'Objective', shortTitle: 'Objective' },
	{ number: 3, title: 'Participants', shortTitle: 'Participants' },
	{ number: 4, title: 'Strategic alignment', shortTitle: 'Alignment' },
	{ number: 5, title: 'Key Results', shortTitle: 'Key Results' },
	{ number: 6, title: 'Initiatives', shortTitle: 'Initiatives' },
	{ number: 7, title: 'Risks', shortTitle: 'Risks' },
	{ number: 8, title: 'Check-in', shortTitle: 'Check-in' },
	{ number: 9, title: 'Forecast', shortTitle: 'Forecast' },
	{ number: 10, title: 'Score & sign-off', shortTitle: 'Score' }
];
