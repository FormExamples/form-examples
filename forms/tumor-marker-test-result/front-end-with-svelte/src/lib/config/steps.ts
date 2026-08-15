import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Specimen & Context', shortTitle: 'Specimen' },
	{ number: 3, title: 'Measured Values', shortTitle: 'Values' },
	{ number: 4, title: 'Trend', shortTitle: 'Trend' },
	{ number: 5, title: 'Findings', shortTitle: 'Findings' },
	{ number: 6, title: 'Impression', shortTitle: 'Impression' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
