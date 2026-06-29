import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{
		number: 2,
		title: 'Seasonal Pattern History',
		shortTitle: 'Seasonal',
		section: 'seasonalPatternHistory'
	},
	{
		number: 3,
		title: 'Current Mood Assessment (PHQ-9)',
		shortTitle: 'PHQ-9',
		section: 'currentMood'
	},
	{ number: 4, title: 'Sleep & Energy', shortTitle: 'Sleep', section: 'sleepEnergy' },
	{
		number: 5,
		title: 'Appetite & Weight Changes',
		shortTitle: 'Appetite',
		section: 'appetiteWeight'
	},
	{
		number: 6,
		title: 'Social & Occupational Impact',
		shortTitle: 'Social',
		section: 'socialOccupational'
	},
	{
		number: 7,
		title: 'Light Exposure Assessment',
		shortTitle: 'Light',
		section: 'lightExposure'
	},
	{
		number: 8,
		title: 'Previous Treatments',
		shortTitle: 'Treatments',
		section: 'previousTreatments'
	},
	{
		number: 9,
		title: 'Risk Assessment (Self-harm)',
		shortTitle: 'Risk',
		section: 'riskAssessment'
	},
	{
		number: 10,
		title: 'Treatment Plan & Monitoring',
		shortTitle: 'Plan',
		section: 'treatmentPlan'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
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
