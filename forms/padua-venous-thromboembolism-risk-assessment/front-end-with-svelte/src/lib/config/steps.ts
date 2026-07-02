import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{
		number: 3,
		title: 'Oncology and thrombosis history',
		shortTitle: 'Oncology & thrombosis',
		section: 'history'
	},
	{
		number: 4,
		title: 'Mobility and recent events',
		shortTitle: 'Mobility & events',
		section: 'mobility'
	},
	{
		number: 5,
		title: 'Cardiorespiratory and acute illness',
		shortTitle: 'Cardiorespiratory',
		section: 'cardiorespiratory'
	},
	{
		number: 6,
		title: 'Metabolic and treatment factors',
		shortTitle: 'Metabolic & treatment',
		section: 'metabolic'
	},
	{ number: 7, title: 'Bleeding-risk check', shortTitle: 'Bleeding-risk check', section: 'bleeding' },
	{ number: 8, title: 'Summary and score', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Padua assessment.
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
