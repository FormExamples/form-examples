import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review context', shortTitle: 'Context', section: 'context' },
	{
		number: 2,
		title: 'Patient and epilepsy profile',
		shortTitle: 'Profile',
		section: 'profile'
	},
	{
		number: 3,
		title: 'Seizure type and frequency',
		shortTitle: 'Seizures',
		section: 'seizures'
	},
	{ number: 4, title: 'Anti-seizure medication', shortTitle: 'Medication', section: 'medication' },
	{ number: 5, title: 'Triggers', shortTitle: 'Triggers', section: 'triggers' },
	{ number: 6, title: 'SUDEP risk discussion', shortTitle: 'SUDEP', section: 'sudep' },
	{
		number: 7,
		title: 'Injuries and status epilepticus',
		shortTitle: 'Injuries',
		section: 'injuries'
	},
	{ number: 8, title: 'Safety', shortTitle: 'Safety', section: 'safety' },
	{
		number: 9,
		title: 'Women of childbearing potential',
		shortTitle: 'Childbearing',
		section: 'childbearing'
	},
	{ number: 10, title: 'Mental health', shortTitle: 'Mental health', section: 'mentalHealth' },
	{ number: 11, title: 'Summary and care plan', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the epilepsy review.
	return steps;
}

export function getNextStep(current: number, data: AssessmentData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: AssessmentData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: AssessmentData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
