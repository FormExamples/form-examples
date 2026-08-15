import type { StepConfig } from '#lib/engine/types.js';

/** Total number of wizard steps. */
export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Symptoms', shortTitle: 'Symptoms' },
	{ number: 5, title: 'Breast History and Risk', shortTitle: 'History & risk' },
	{ number: 6, title: 'Triage', shortTitle: 'Triage' },
	{ number: 7, title: 'Review and Submit', shortTitle: 'Review' }
];
