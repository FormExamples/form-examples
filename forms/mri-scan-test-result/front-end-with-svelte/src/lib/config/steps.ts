import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Examination Details', shortTitle: 'Examination' },
	{ number: 3, title: 'Clinical History', shortTitle: 'History' },
	{ number: 4, title: 'Findings', shortTitle: 'Findings' },
	{ number: 5, title: 'Measurements & Category', shortTitle: 'Measurements' },
	{ number: 6, title: 'Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
