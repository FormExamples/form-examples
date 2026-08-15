import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting clinician', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Requested test', shortTitle: 'Test', section: 'test' },
	{ number: 4, title: 'Clinical indication', shortTitle: 'Indication', section: 'indication' },
	{ number: 5, title: 'Validity and safety', shortTitle: 'Safety', section: 'safety' },
	{ number: 6, title: 'Triage and logistics', shortTitle: 'Triage', section: 'triage' },
	{ number: 7, title: 'Review and submit', shortTitle: 'Review', section: 'review' }
];
