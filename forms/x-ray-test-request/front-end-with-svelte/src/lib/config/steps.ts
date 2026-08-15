import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Clinical Detail', shortTitle: 'Clinical detail' },
	{ number: 5, title: 'Radiation Safety', shortTitle: 'Radiation safety' },
	{ number: 6, title: 'Practicalities', shortTitle: 'Practicalities' },
	{ number: 7, title: 'Triage and Submit', shortTitle: 'Triage' }
];
