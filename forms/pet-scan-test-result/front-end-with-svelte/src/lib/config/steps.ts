import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Clinical History & Acquisition', shortTitle: 'Acquisition' },
	{ number: 3, title: 'Findings', shortTitle: 'Findings' },
	{ number: 4, title: 'Measurements & Comparison', shortTitle: 'Measurements' },
	{ number: 5, title: 'Impression & Structured Reporting', shortTitle: 'Impression' },
	{ number: 6, title: 'Critical-result Communication', shortTitle: 'Communication' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
