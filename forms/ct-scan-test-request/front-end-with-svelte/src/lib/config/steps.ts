import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

/** The eight request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Clinical Context', shortTitle: 'Context' },
	{ number: 5, title: 'Contrast and Renal Safety', shortTitle: 'Contrast' },
	{ number: 6, title: 'Radiation Safety', shortTitle: 'Radiation' },
	{ number: 7, title: 'Triage and Setting', shortTitle: 'Triage' },
	{ number: 8, title: 'Review and Submit', shortTitle: 'Review' }
];
