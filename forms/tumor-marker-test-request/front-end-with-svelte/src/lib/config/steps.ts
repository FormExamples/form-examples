import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 5;

/** The five request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Markers', shortTitle: 'Markers' },
	{ number: 4, title: 'Clinical Context', shortTitle: 'Context' },
	{ number: 5, title: 'Triage and Submit', shortTitle: 'Triage' }
];
