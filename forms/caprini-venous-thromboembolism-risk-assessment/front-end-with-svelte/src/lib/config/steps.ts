import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: '1-point risk factors', shortTitle: '1 point', section: 'onePoint' },
	{ number: 4, title: '2-point risk factors', shortTitle: '2 points', section: 'twoPoint' },
	{ number: 5, title: '3-point risk factors', shortTitle: '3 points', section: 'threePoint' },
	{ number: 6, title: '5-point risk factors', shortTitle: '5 points', section: 'fivePoint' },
	{ number: 7, title: 'Bleeding risk', shortTitle: 'Bleeding', section: 'bleeding' },
	{ number: 8, title: 'Summary and score', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Caprini assessment.
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
