import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting clinician', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Requested test', shortTitle: 'Test', section: 'request' },
	{ number: 4, title: 'Clinic blood pressure', shortTitle: 'Clinic BP', section: 'bloodPressure' },
	{ number: 5, title: 'Symptoms & accuracy factors', shortTitle: 'Symptoms', section: 'symptoms' },
	{ number: 6, title: 'Triage & submit', shortTitle: 'Triage', section: 'triage' }
];
