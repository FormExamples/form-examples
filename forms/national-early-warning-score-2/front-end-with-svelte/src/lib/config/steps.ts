import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Respiration rate', shortTitle: 'Respiration', section: 'respiration' },
	{ number: 4, title: 'Oxygen saturation', shortTitle: 'SpO2', section: 'oxygenSaturation' },
	{ number: 5, title: 'Air or supplemental oxygen', shortTitle: 'Oxygen', section: 'oxygenSupport' },
	{ number: 6, title: 'Systolic blood pressure', shortTitle: 'Blood pressure', section: 'bloodPressure' },
	{ number: 7, title: 'Pulse', shortTitle: 'Pulse', section: 'pulse' },
	{ number: 8, title: 'Consciousness (ACVPU)', shortTitle: 'Consciousness', section: 'consciousness' },
	{ number: 9, title: 'Temperature', shortTitle: 'Temperature', section: 'temperature' },
	{ number: 10, title: 'Review and sign-off', shortTitle: 'Review', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the NEWS2 assessment.
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
