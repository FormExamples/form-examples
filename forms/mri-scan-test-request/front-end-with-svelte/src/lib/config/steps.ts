import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

/** The eight MRI request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Contrast and Renal', shortTitle: 'Contrast' },
	{ number: 5, title: 'MRI Safety Screen', shortTitle: 'MRI safety' },
	{ number: 6, title: 'Prior Imaging', shortTitle: 'Prior imaging' },
	{ number: 7, title: 'Logistics', shortTitle: 'Logistics' },
	{ number: 8, title: 'Triage and Submit', shortTitle: 'Triage' }
];
