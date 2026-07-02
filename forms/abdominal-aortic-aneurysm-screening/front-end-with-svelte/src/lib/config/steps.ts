import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Scan context', shortTitle: 'Context', section: 'context' },
	{
		number: 2,
		title: 'Patient identification and eligibility',
		shortTitle: 'Patient',
		section: 'identification'
	},
	{ number: 3, title: 'Consent', shortTitle: 'Consent', section: 'consent' },
	{ number: 4, title: 'Ultrasound measurement', shortTitle: 'Measurement', section: 'measurement' },
	{
		number: 5,
		title: 'Clinical observations',
		shortTitle: 'Observations',
		section: 'observations'
	},
	{ number: 6, title: 'Summary and result', shortTitle: 'Summary', section: 'result' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the AAA screening wizard.
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
