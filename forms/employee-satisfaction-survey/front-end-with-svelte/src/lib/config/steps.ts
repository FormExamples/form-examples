import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Role & Tenure', shortTitle: 'Role', section: 'roleTenure' },
	{ number: 3, title: 'Workload & Work-Life Balance', shortTitle: 'Workload', section: 'workload' },
	{ number: 4, title: 'Management & Leadership', shortTitle: 'Management', section: 'management' },
	{ number: 5, title: 'Growth & Development', shortTitle: 'Growth', section: 'growth' },
	{ number: 6, title: 'Compensation & Benefits', shortTitle: 'Pay', section: 'compensation' },
	{ number: 7, title: 'Culture & Inclusion', shortTitle: 'Culture', section: 'culture' },
	{ number: 8, title: 'Environment & Resources', shortTitle: 'Environment', section: 'environment' },
	{ number: 9, title: 'Recognition & Engagement', shortTitle: 'Recognition', section: 'recognition' },
	{ number: 10, title: 'Overall Experience & Retention Intent', shortTitle: 'Overall', section: 'overall' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the employee satisfaction survey.
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
