import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven response-entry wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Response Identification', shortTitle: 'Identification' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Clinical Assessment', shortTitle: 'Assessment' },
	{ number: 4, title: 'Structured Findings', shortTitle: 'Findings' },
	{ number: 5, title: 'Diagnosis & Measurement', shortTitle: 'Diagnosis' },
	{ number: 6, title: 'Management & Follow-up', shortTitle: 'Management' },
	{ number: 7, title: 'Sign-off', shortTitle: 'Sign-off' }
];
