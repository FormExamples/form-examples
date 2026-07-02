import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Review context and identification',
		shortTitle: 'Context',
		section: 'context'
	},
	{ number: 2, title: 'Diagnosis and history', shortTitle: 'Diagnosis', section: 'diagnosis' },
	{ number: 3, title: 'Spirometry', shortTitle: 'Spirometry', section: 'spirometry' },
	{ number: 4, title: 'Symptom burden', shortTitle: 'Symptoms', section: 'symptoms' },
	{
		number: 5,
		title: 'Exacerbations (past 12 months)',
		shortTitle: 'Exacerbations',
		section: 'exacerbations'
	},
	{ number: 6, title: 'Smoking status and cessation', shortTitle: 'Smoking', section: 'smoking' },
	{ number: 7, title: 'Inhaler therapy', shortTitle: 'Inhaler', section: 'inhaler' },
	{ number: 8, title: 'Vaccinations', shortTitle: 'Vaccinations', section: 'vaccinations' },
	{
		number: 9,
		title: 'Pulmonary rehabilitation and oxygen',
		shortTitle: 'Rehab & oxygen',
		section: 'rehab'
	},
	{
		number: 10,
		title: 'Comorbidities and self-management',
		shortTitle: 'Self-management',
		section: 'selfManagement'
	},
	{
		number: 11,
		title: 'Summary and classification',
		shortTitle: 'Summary',
		section: 'note'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the COPD review.
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
