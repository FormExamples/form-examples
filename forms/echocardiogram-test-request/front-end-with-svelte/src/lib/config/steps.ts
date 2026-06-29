import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

/** The eight referral wizard sections (single continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Referring Clinician', shortTitle: 'Referrer' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Requested Examination', shortTitle: 'Examination' },
	{ number: 4, title: 'Symptoms', shortTitle: 'Symptoms' },
	{ number: 5, title: 'Investigations', shortTitle: 'Investigations' },
	{ number: 6, title: 'Red Flags', shortTitle: 'Red flags' },
	{ number: 7, title: 'Triage', shortTitle: 'Triage' },
	{ number: 8, title: 'Review and Submit', shortTitle: 'Review' }
];
