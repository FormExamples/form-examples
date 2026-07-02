import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Age', shortTitle: 'Age', section: 'age' },
	{ number: 4, title: 'Bony tenderness', shortTitle: 'Tenderness', section: 'tenderness' },
	{ number: 5, title: 'Knee flexion', shortTitle: 'Flexion', section: 'flexion' },
	{ number: 6, title: 'Weight-bearing', shortTitle: 'Weight-bearing', section: 'weightBearing' },
	{ number: 7, title: 'Summary and decision', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Ottawa Knee Rule assessment.
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
