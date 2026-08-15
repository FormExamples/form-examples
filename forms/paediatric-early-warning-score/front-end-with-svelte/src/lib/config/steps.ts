import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient and age band', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Respiratory', shortTitle: 'Respiratory', section: 'respiratory' },
	{ number: 4, title: 'Cardiovascular', shortTitle: 'Cardiovascular', section: 'cardiovascular' },
	{ number: 5, title: 'Behaviour (ACVPU)', shortTitle: 'Behaviour', section: 'behaviour' },
	{ number: 6, title: 'Documented concern', shortTitle: 'Concern', section: 'concern' },
	{ number: 7, title: 'Review and sign-off', shortTitle: 'Review', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the PEWS assessment.
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
