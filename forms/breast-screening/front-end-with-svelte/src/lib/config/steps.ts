import type { StepConfig, ScreeningData } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Screening context', shortTitle: 'Context', section: 'context' },
	{
		number: 2,
		title: 'Identification and eligibility',
		shortTitle: 'Identification',
		section: 'identification'
	},
	{ number: 3, title: 'Symptom and consent check', shortTitle: 'Symptom & consent', section: 'eligibility' },
	{ number: 4, title: 'Mammogram', shortTitle: 'Mammogram', section: 'mammogram' },
	{ number: 5, title: 'Reading outcome', shortTitle: 'Reading', section: 'reading' },
	{ number: 6, title: 'Assessment result', shortTitle: 'Assessment', section: 'assessment' },
	{ number: 7, title: 'Summary and outcome', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: ScreeningData): StepConfig[] {
	// All steps are always visible; the assessment step is only relevant after a recall.
	return steps;
}

export function getNextStep(current: number, data: ScreeningData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: ScreeningData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: ScreeningData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
