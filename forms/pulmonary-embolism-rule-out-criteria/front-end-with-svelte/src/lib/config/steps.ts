import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{
		number: 3,
		title: 'Pre-test probability',
		shortTitle: 'Pre-test',
		section: 'pretest'
	},
	{ number: 4, title: 'Vital signs', shortTitle: 'Vitals', section: 'vitals' },
	{ number: 5, title: 'Clinical criteria', shortTitle: 'Criteria', section: 'criteria' },
	{ number: 6, title: 'Summary and result', shortTitle: 'Result', section: 'result' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the PERC assessment.
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
