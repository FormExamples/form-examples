import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Tests', shortTitle: 'Tests' },
	{ number: 4, title: 'Clinical Context', shortTitle: 'Clinical' },
	{ number: 5, title: 'Specimen / Pre-analytical', shortTitle: 'Specimen' },
	{ number: 6, title: 'Triage', shortTitle: 'Triage' },
	{ number: 7, title: 'Review and Submit', shortTitle: 'Review' }
];
