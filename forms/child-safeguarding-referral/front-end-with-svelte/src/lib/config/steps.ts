import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Referrer details', shortTitle: 'Referrer', section: 'referrer' },
	{ number: 2, title: 'Child details', shortTitle: 'Child', section: 'child' },
	{ number: 3, title: 'Family and household', shortTitle: 'Family', section: 'family' },
	{ number: 4, title: 'The concern', shortTitle: 'Concern', section: 'concern' },
	{ number: 5, title: 'Category of abuse', shortTitle: 'Category', section: 'category' },
	{ number: 6, title: 'Immediate risk and safety', shortTitle: 'Immediate risk', section: 'risk' },
	{ number: 7, title: 'Consent and information sharing', shortTitle: 'Consent', section: 'consent' },
	{ number: 8, title: 'Who else is informed', shortTitle: 'Informed', section: 'informed' },
	{ number: 9, title: 'Requested action and summary', shortTitle: 'Action & summary', section: 'action' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the referral wizard.
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
