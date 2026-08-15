import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Specimen', shortTitle: 'Specimen' },
	{ number: 4, title: 'Indication and Clinical Context', shortTitle: 'Indication' },
	{ number: 5, title: 'Urgency and Red Flags', shortTitle: 'Urgency' },
	{ number: 6, title: 'Requester and Site', shortTitle: 'Site' },
	{ number: 7, title: 'Review and Submit', shortTitle: 'Review' }
];
