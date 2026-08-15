import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient and diagnosis', shortTitle: 'Patient', section: 'diagnosis' },
	{ number: 3, title: 'Functional status', shortTitle: 'Functional', section: 'functional' },
	{ number: 4, title: 'Fluid status and observations', shortTitle: 'Fluid', section: 'fluid' },
	{ number: 5, title: 'Investigations', shortTitle: 'Bloods', section: 'investigations' },
	{ number: 6, title: 'Medication optimisation', shortTitle: 'Medication', section: 'medication' },
	{ number: 7, title: 'Devices and procedures', shortTitle: 'Devices', section: 'devices' },
	{
		number: 8,
		title: 'Vaccinations and self-management',
		shortTitle: 'Vaccinations',
		section: 'vaccinations'
	},
	{ number: 9, title: 'Summary and plan', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the heart-failure review.
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
