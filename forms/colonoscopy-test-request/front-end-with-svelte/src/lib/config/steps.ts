import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Procedure', shortTitle: 'Procedure' },
	{ number: 4, title: 'Red Flags and Triage Labs', shortTitle: 'Red flags' },
	{ number: 5, title: 'Medication', shortTitle: 'Medication' },
	{ number: 6, title: 'Bowel Prep and Fitness', shortTitle: 'Fitness' },
	{ number: 7, title: 'Triage and Submit', shortTitle: 'Triage' }
];
