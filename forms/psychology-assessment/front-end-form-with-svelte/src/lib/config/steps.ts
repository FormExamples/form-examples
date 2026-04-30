import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'About you', section: 'demographics' },
	{
		number: 2,
		title: 'Reason for Assessment',
		shortTitle: 'Reason',
		section: 'reasonForAssessment'
	},
	{
		number: 3,
		title: 'DASS-21 Depression',
		shortTitle: 'Depression',
		section: 'dassDepression'
	},
	{ number: 4, title: 'DASS-21 Anxiety', shortTitle: 'Anxiety', section: 'dassAnxiety' },
	{ number: 5, title: 'DASS-21 Stress', shortTitle: 'Stress', section: 'dassStress' },
	{
		number: 6,
		title: 'Functional Impact',
		shortTitle: 'Impact',
		section: 'functionalImpact'
	},
	{ number: 7, title: 'Risk Screen', shortTitle: 'Risk', section: 'riskScreen' },
	{
		number: 8,
		title: 'Support and History',
		shortTitle: 'Support',
		section: 'supportAndHistory'
	}
];
