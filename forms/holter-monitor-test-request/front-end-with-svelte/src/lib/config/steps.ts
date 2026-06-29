import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

/** The six request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Symptoms', shortTitle: 'Symptoms' },
	{ number: 5, title: 'Cardiac Context and Red Flags', shortTitle: 'Cardiac' },
	{ number: 6, title: 'Triage and Submit', shortTitle: 'Triage' }
];
