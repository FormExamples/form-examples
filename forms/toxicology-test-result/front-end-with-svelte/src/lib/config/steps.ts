import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Specimen & History', shortTitle: 'Specimen' },
	{ number: 3, title: 'Result Values', shortTitle: 'Results' },
	{ number: 4, title: 'Interpretation', shortTitle: 'Interpretation' },
	{ number: 5, title: 'Impression', shortTitle: 'Impression' },
	{ number: 6, title: 'Critical Communication', shortTitle: 'Communication' },
	{ number: 7, title: 'Interpretation & Sign-off', shortTitle: 'Sign-off' }
];
