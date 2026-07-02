import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Examination context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Baby identification', shortTitle: 'Baby', section: 'identification' },
	{ number: 3, title: 'Risk factors', shortTitle: 'Risk factors', section: 'riskFactors' },
	{ number: 4, title: 'Eyes (key component)', shortTitle: 'Eyes', section: 'eyes' },
	{ number: 5, title: 'Heart (key component)', shortTitle: 'Heart', section: 'heart' },
	{ number: 6, title: 'Hips (key component)', shortTitle: 'Hips', section: 'hips' },
	{ number: 7, title: 'Testes (key component, boys)', shortTitle: 'Testes', section: 'testes' },
	{
		number: 8,
		title: 'Head-to-toe systematic examination',
		shortTitle: 'Systematic',
		section: 'systematic'
	},
	{ number: 9, title: 'Summary and outcome', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible; the testes step notes it is applicable to boys only.
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
