import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Issuer identification', shortTitle: 'Issuer' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Assessment', shortTitle: 'Assessment' },
	{ number: 4, title: 'Diagnosis', shortTitle: 'Diagnosis' },
	{ number: 5, title: 'Fitness for work', shortTitle: 'Fitness' },
	{ number: 6, title: 'Adaptations', shortTitle: 'Adaptations' },
	{ number: 7, title: 'Comments', shortTitle: 'Comments' },
	{ number: 8, title: 'Period', shortTitle: 'Period' },
	{ number: 9, title: 'Follow-up', shortTitle: 'Follow-up' },
	{ number: 10, title: 'Sign-off', shortTitle: 'Sign-off' }
];
