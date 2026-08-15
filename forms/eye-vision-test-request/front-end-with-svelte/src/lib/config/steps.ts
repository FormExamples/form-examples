import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'History', shortTitle: 'History' },
	{ number: 5, title: 'Symptoms and Red Flags', shortTitle: 'Symptoms' },
	{ number: 6, title: 'Risk Factors', shortTitle: 'Risk factors' },
	{ number: 7, title: 'Triage and Submit', shortTitle: 'Triage' }
];
