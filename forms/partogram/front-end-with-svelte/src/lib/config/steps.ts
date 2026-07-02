import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Labour context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Admission findings', shortTitle: 'Admission', section: 'admission' },
	{ number: 4, title: 'Observation series', shortTitle: 'Observations', section: 'observations' },
	{ number: 5, title: 'Summary and progress', shortTitle: 'Summary', section: 'observations' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the partogram.
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
