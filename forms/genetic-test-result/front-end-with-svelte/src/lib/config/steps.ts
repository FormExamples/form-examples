import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Test Details', shortTitle: 'Test' },
	{ number: 3, title: 'Clinical Context', shortTitle: 'Context' },
	{ number: 4, title: 'Findings', shortTitle: 'Findings' },
	{ number: 5, title: 'Interpretation', shortTitle: 'Interpretation' },
	{ number: 6, title: 'Follow-up', shortTitle: 'Follow-up' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
