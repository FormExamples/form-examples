import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Procedure', shortTitle: 'Procedure' },
	{ number: 4, title: 'Symptoms and Imaging', shortTitle: 'Symptoms' },
	{ number: 5, title: 'Bleeding Risk', shortTitle: 'Bleeding' },
	{ number: 6, title: 'Procedural Risk', shortTitle: 'Risk' },
	{ number: 7, title: 'Triage and Submit', shortTitle: 'Triage' }
];
