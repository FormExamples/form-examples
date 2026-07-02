import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Clinician and context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient and baseline', shortTitle: 'Baseline', section: 'baseline' },
	{ number: 3, title: 'Respiration', shortTitle: 'Respiration', section: 'respiration' },
	{ number: 4, title: 'Coagulation', shortTitle: 'Coagulation', section: 'coagulation' },
	{ number: 5, title: 'Liver', shortTitle: 'Liver', section: 'liver' },
	{
		number: 6,
		title: 'Cardiovascular',
		shortTitle: 'Cardiovascular',
		section: 'cardiovascular'
	},
	{ number: 7, title: 'Central nervous system', shortTitle: 'CNS', section: 'cns' },
	{ number: 8, title: 'Renal', shortTitle: 'Renal', section: 'renal' },
	{ number: 9, title: 'Summary and sign-off', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the SOFA assessment.
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
