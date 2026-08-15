import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

/** The eight request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Procedure', shortTitle: 'Procedure' },
	{ number: 4, title: 'Red Flags and Triage Labs', shortTitle: 'Red flags' },
	{ number: 5, title: 'Medication', shortTitle: 'Medication' },
	{ number: 6, title: 'Comorbidities and Fitness', shortTitle: 'Comorbidities' },
	{ number: 7, title: 'Infection and Preparation', shortTitle: 'Infection' },
	{ number: 8, title: 'Triage and Submit', shortTitle: 'Triage' }
];
