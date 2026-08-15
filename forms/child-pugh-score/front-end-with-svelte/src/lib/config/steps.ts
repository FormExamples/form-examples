import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Total bilirubin', shortTitle: 'Bilirubin', section: 'bilirubin' },
	{ number: 4, title: 'Serum albumin', shortTitle: 'Albumin', section: 'albumin' },
	{ number: 5, title: 'Coagulation', shortTitle: 'Coagulation', section: 'coagulation' },
	{ number: 6, title: 'Ascites', shortTitle: 'Ascites', section: 'ascitesStep' },
	{
		number: 7,
		title: 'Hepatic encephalopathy',
		shortTitle: 'Encephalopathy',
		section: 'encephalopathyStep'
	},
	{ number: 8, title: 'Summary and score', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Child-Pugh wizard.
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
