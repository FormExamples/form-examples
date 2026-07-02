import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Confounders', shortTitle: 'Confounders', section: 'confounders' },
	{ number: 3, title: 'Eye opening (E)', shortTitle: 'Eye', section: 'eye' },
	{ number: 4, title: 'Verbal response (V)', shortTitle: 'Verbal', section: 'verbal' },
	{ number: 5, title: 'Motor response (M)', shortTitle: 'Motor', section: 'motor' },
	{ number: 6, title: 'Pupils', shortTitle: 'Pupils', section: 'pupils' },
	{ number: 7, title: 'Trend', shortTitle: 'Trend', section: 'trend' },
	{ number: 8, title: 'Summary and score', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the GCS assessment.
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
