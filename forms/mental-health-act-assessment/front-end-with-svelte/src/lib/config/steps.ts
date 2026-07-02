import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Person identification', shortTitle: 'Person', section: 'identification' },
	{
		number: 3,
		title: 'Assessing professionals',
		shortTitle: 'Professionals',
		section: 'professionals'
	},
	{
		number: 4,
		title: 'Mental disorder (criterion 1)',
		shortTitle: 'Disorder',
		section: 'mentalDisorder'
	},
	{ number: 5, title: 'Risk (criterion 2)', shortTitle: 'Risk', section: 'risk' },
	{
		number: 6,
		title: 'Least-restrictive alternative (criterion 3)',
		shortTitle: 'Least restrictive',
		section: 'leastRestrictive'
	},
	{
		number: 7,
		title: 'Appropriate treatment (criterion 4, s3)',
		shortTitle: 'Treatment',
		section: 'treatment'
	},
	{
		number: 8,
		title: 'Nearest relative / consultees',
		shortTitle: 'Nearest relative',
		section: 'nearestRelative'
	},
	{
		number: 9,
		title: 'Recommended section and outcome',
		shortTitle: 'Recommendation',
		section: 'recommendation'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Mental Health Act assessment.
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
