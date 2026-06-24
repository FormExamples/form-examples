import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven report-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Report Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Specimen', shortTitle: 'Specimen' },
	{ number: 3, title: 'Dipstick', shortTitle: 'Dipstick' },
	{ number: 4, title: 'Microscopy', shortTitle: 'Microscopy' },
	{ number: 5, title: 'Culture & Sensitivities', shortTitle: 'Culture' },
	{ number: 6, title: 'Interpretation', shortTitle: 'Interpretation' },
	{ number: 7, title: 'Sign-off', shortTitle: 'Sign-off' }
];
