import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Encounter context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Subjective (S)', shortTitle: 'Subjective', section: 'subjective' },
	{ number: 4, title: 'Objective (O)', shortTitle: 'Objective', section: 'objective' },
	{ number: 5, title: 'Assessment (A)', shortTitle: 'Assessment', section: 'assessment' },
	{ number: 6, title: 'Plan (P)', shortTitle: 'Plan', section: 'plan' },
	{ number: 7, title: 'Summary and completeness', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the SOAP note.
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
