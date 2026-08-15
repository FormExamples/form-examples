import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Recording Adequacy', shortTitle: 'Adequacy' },
	{ number: 3, title: 'Clinical History', shortTitle: 'History' },
	{ number: 4, title: 'Average Blood Pressures', shortTitle: 'Averages' },
	{ number: 5, title: 'Nocturnal Dipping & Findings', shortTitle: 'Dipping' },
	{ number: 6, title: 'Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
