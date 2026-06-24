import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Clinical History', shortTitle: 'History' },
	{ number: 3, title: 'LV Function & Dimensions', shortTitle: 'LV Function' },
	{ number: 4, title: 'Valves & Pressures', shortTitle: 'Valves' },
	{ number: 5, title: 'Structured Findings', shortTitle: 'Findings' },
	{ number: 6, title: 'Findings & Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
