import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

/** The six request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Study', shortTitle: 'Study' },
	{ number: 4, title: 'Sleep Scores', shortTitle: 'Scores' },
	{ number: 5, title: 'Symptoms and Risk', shortTitle: 'Symptoms' },
	{ number: 6, title: 'Triage and Submit', shortTitle: 'Triage' }
];
