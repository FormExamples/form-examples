import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{
		number: 3,
		title: 'Systolic blood pressure',
		shortTitle: 'Blood pressure',
		section: 'bloodPressure'
	},
	{ number: 4, title: 'Heart rate', shortTitle: 'Heart rate', section: 'heartRate' },
	{ number: 5, title: 'Respiratory rate', shortTitle: 'Respiration', section: 'respiratory' },
	{ number: 6, title: 'Temperature', shortTitle: 'Temperature', section: 'temperature' },
	{ number: 7, title: 'Consciousness (AVPU)', shortTitle: 'Consciousness', section: 'consciousness' },
	{ number: 8, title: 'Review and sign-off', shortTitle: 'Review', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the MEWS assessment.
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
