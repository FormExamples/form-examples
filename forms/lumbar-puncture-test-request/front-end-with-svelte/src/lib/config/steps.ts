import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

/** The six request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Procedure and Indication', shortTitle: 'Indication' },
	{ number: 4, title: 'Raised-ICP and Neuro Safety', shortTitle: 'Neuro safety' },
	{ number: 5, title: 'Bleeding and Coagulation Safety', shortTitle: 'Bleeding' },
	{ number: 6, title: 'Procedure Detail and Triage', shortTitle: 'Triage' }
];
