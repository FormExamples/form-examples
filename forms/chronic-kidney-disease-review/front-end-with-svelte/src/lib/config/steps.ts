import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient and diagnosis', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Renal function (eGFR)', shortTitle: 'Renal', section: 'renal' },
	{
		number: 4,
		title: 'Albuminuria (urine ACR)',
		shortTitle: 'Albuminuria',
		section: 'albuminuria'
	},
	{ number: 5, title: 'Blood pressure', shortTitle: 'Blood pressure', section: 'bloodPressure' },
	{ number: 6, title: 'Medication review', shortTitle: 'Medication', section: 'medication' },
	{ number: 7, title: 'Metabolic bloods', shortTitle: 'Bloods', section: 'bloods' },
	{ number: 8, title: 'Referral and summary', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the CKD annual review.
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
