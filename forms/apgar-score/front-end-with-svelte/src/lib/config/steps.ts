import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 4;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Birth context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Newborn identification', shortTitle: 'Newborn', section: 'identification' },
	{ number: 3, title: 'Timepoint assessments', shortTitle: 'Timepoints', section: 'timepoints' },
	{ number: 4, title: 'Resuscitation and summary', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Apgar assessment.
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
