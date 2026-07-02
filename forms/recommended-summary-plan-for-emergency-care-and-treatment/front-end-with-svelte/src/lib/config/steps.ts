import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Personal details', shortTitle: 'Personal', section: 'personal' },
	{ number: 2, title: 'Summary of relevant health', shortTitle: 'Health', section: 'health' },
	{ number: 3, title: 'Preferences and what matters', shortTitle: 'Preferences', section: 'preferences' },
	{ number: 4, title: 'Clinical recommendations', shortTitle: 'Recommendations', section: 'recommendations' },
	{ number: 5, title: 'CPR recommendation', shortTitle: 'CPR', section: 'cpr' },
	{ number: 6, title: 'Ceilings of treatment', shortTitle: 'Ceilings', section: 'ceilings' },
	{ number: 7, title: 'Capacity and involvement', shortTitle: 'Capacity', section: 'capacity' },
	{ number: 8, title: 'Clinician sign-off', shortTitle: 'Sign-off', section: 'signOff' },
	{ number: 9, title: 'Summary', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the ReSPECT wizard.
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
