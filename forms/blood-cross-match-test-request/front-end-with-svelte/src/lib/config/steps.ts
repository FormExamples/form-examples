import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting clinician', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Requested test & component', shortTitle: 'Test & component', section: 'request' },
	{ number: 4, title: 'Clinical indication', shortTitle: 'Indication', section: 'indication' },
	{ number: 5, title: 'Blood group & history', shortTitle: 'Group & history', section: 'history' },
	{ number: 6, title: 'Sample & identity safety', shortTitle: 'Sample safety', section: 'sample' },
	{ number: 7, title: 'Triage & submit', shortTitle: 'Triage', section: 'triage' }
];
