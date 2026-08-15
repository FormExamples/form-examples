import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

/** The eight request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Pregnancy Dating', shortTitle: 'Dating' },
	{ number: 4, title: 'Obstetric History', shortTitle: 'History' },
	{ number: 5, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 6, title: 'Symptoms and Red Flags', shortTitle: 'Symptoms' },
	{ number: 7, title: 'Risk Factors', shortTitle: 'Risk factors' },
	{ number: 8, title: 'Triage and Submit', shortTitle: 'Triage' }
];
