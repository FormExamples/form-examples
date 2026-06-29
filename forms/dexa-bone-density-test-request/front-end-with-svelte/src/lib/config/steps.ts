import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

/** The seven request wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Clinician', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Fracture-Risk Factors', shortTitle: 'Risk factors' },
	{ number: 5, title: 'Previous DEXA', shortTitle: 'Previous DEXA' },
	{ number: 6, title: 'Triage and Submit', shortTitle: 'Triage' },
	{ number: 7, title: 'Review and Submit', shortTitle: 'Review' }
];
