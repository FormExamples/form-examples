import type { StepConfig, ReviewData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Problems and concerns', shortTitle: 'Problems', section: 'problems' },
	{ number: 4, title: 'Medicines', shortTitle: 'Medicines', section: 'medicines' },
	{ number: 5, title: 'Monitoring', shortTitle: 'Monitoring', section: 'monitoring' },
	{ number: 6, title: 'Goals and shared decisions', shortTitle: 'Goals', section: 'goals' },
	{ number: 7, title: 'Agreed actions and plan', shortTitle: 'Plan', section: 'plan' },
	{ number: 8, title: 'Summary and outputs', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: ReviewData): StepConfig[] {
	// All steps are always visible in the review wizard.
	return steps;
}

export function getNextStep(current: number, data: ReviewData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: ReviewData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: ReviewData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
