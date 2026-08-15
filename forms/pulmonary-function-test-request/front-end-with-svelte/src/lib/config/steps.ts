import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Test', shortTitle: 'Test' },
	{ number: 4, title: 'Symptoms', shortTitle: 'Symptoms' },
	{ number: 5, title: 'Background', shortTitle: 'Background' },
	{ number: 6, title: 'Safety Screen', shortTitle: 'Safety' },
	{ number: 7, title: 'Triage and Submit', shortTitle: 'Triage' }
];
