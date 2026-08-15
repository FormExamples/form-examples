import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Check context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Person identification', shortTitle: 'Person', section: 'identification' },
	{
		number: 3,
		title: 'Reasonable adjustments & communication',
		shortTitle: 'Adjustments',
		section: 'adjustments'
	},
	{ number: 4, title: 'Physical health', shortTitle: 'Physical health', section: 'physical' },
	{
		number: 5,
		title: 'Health screening & immunisations',
		shortTitle: 'Screening',
		section: 'screening'
	},
	{
		number: 6,
		title: 'Medication review incl. STOMP',
		shortTitle: 'Medication / STOMP',
		section: 'medication'
	},
	{ number: 7, title: 'Mental health & behaviour', shortTitle: 'Mental health', section: 'mental' },
	{
		number: 8,
		title: 'Syndrome-specific checks',
		shortTitle: 'Syndrome-specific',
		section: 'syndrome'
	},
	{ number: 9, title: 'Carer & social', shortTitle: 'Carer & social', section: 'carer' },
	{ number: 10, title: 'Health Action Plan', shortTitle: 'Health Action Plan', section: 'plan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the annual health check.
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
