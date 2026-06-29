import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

/** The eight request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Clinical Detail', shortTitle: 'Clinical' },
	{ number: 5, title: 'Preparation', shortTitle: 'Preparation' },
	{ number: 6, title: 'Red Flags', shortTitle: 'Red flags' },
	{ number: 7, title: 'Triage', shortTitle: 'Triage' },
	{ number: 8, title: 'Review and Submit', shortTitle: 'Review' }
];
