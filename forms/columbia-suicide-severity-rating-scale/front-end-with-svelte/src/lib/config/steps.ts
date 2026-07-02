import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{
		number: 2,
		title: 'Patient identification',
		shortTitle: 'Patient',
		section: 'identification'
	},
	{ number: 3, title: 'Suicidal ideation (Q1-Q5)', shortTitle: 'Ideation', section: 'ideation' },
	{
		number: 4,
		title: 'Ideation intensity (optional)',
		shortTitle: 'Intensity',
		section: 'intensity'
	},
	{ number: 5, title: 'Suicidal behaviour', shortTitle: 'Behaviour', section: 'behaviour' },
	{ number: 6, title: 'Lethality', shortTitle: 'Lethality', section: 'lethality' },
	{ number: 7, title: 'Means and protective factors', shortTitle: 'Means', section: 'means' },
	{ number: 8, title: 'Summary and risk tier', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the C-SSRS assessment.
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
