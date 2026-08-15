import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Encounter and clinician', shortTitle: 'Encounter', section: 'encounter' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Presenting complaint', shortTitle: 'Complaint', section: 'history' },
	{
		number: 4,
		title: 'Past history, drugs and allergies',
		shortTitle: 'Past history',
		section: 'history'
	},
	{
		number: 5,
		title: 'Family, social history and systems review',
		shortTitle: 'Social & systems',
		section: 'history'
	},
	{ number: 6, title: 'Vital signs', shortTitle: 'Vitals', section: 'vitals' },
	{
		number: 7,
		title: 'Examination and investigations',
		shortTitle: 'Examination',
		section: 'examination'
	},
	{
		number: 8,
		title: 'Impression, red flags and plan',
		shortTitle: 'Impression & plan',
		section: 'assessment'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the H&P clerking.
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
