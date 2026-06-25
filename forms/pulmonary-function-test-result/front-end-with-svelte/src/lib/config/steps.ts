import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Test Quality', shortTitle: 'Quality' },
	{ number: 3, title: 'Measured Values', shortTitle: 'Measurements' },
	{ number: 4, title: 'Interpretation', shortTitle: 'Interpretation' },
	{ number: 5, title: 'Findings', shortTitle: 'Findings' },
	{ number: 6, title: 'Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
