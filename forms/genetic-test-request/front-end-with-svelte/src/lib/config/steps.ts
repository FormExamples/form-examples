import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

/** The six request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Test', shortTitle: 'Test' },
	{ number: 4, title: 'Clinical Details', shortTitle: 'Clinical' },
	{ number: 5, title: 'Consent and Counselling', shortTitle: 'Consent' },
	{ number: 6, title: 'Specimen and Triage', shortTitle: 'Triage' }
];
