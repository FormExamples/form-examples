import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient and assessment identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 2, title: 'Item 1 — Alertness', shortTitle: 'Alertness', section: 'item1' },
	{ number: 3, title: 'Item 2 — AMT4', shortTitle: 'AMT4', section: 'item2' },
	{ number: 4, title: 'Item 3 — Attention', shortTitle: 'Attention', section: 'item3' },
	{ number: 5, title: 'Item 4 — Acute change', shortTitle: 'Acute change', section: 'item4' },
	{ number: 6, title: 'Summary and sign-off', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the 4AT assessment.
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
