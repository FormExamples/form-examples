import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Specimen & Context', shortTitle: 'Specimen' },
	{ number: 3, title: 'Result Values', shortTitle: 'Values' },
	{ number: 4, title: 'Findings', shortTitle: 'Findings' },
	{ number: 5, title: 'Comparison', shortTitle: 'Comparison' },
	{ number: 6, title: 'Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
