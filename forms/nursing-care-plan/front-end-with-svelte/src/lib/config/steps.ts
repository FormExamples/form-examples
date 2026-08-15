import type { StepConfig, CarePlan } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Plan context', shortTitle: 'Context', section: 'planContext' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Risk assessments referenced', shortTitle: 'Risks', section: 'fallsRisk' },
	{ number: 4, title: 'Problems and needs', shortTitle: 'Problems', section: 'problems' },
	{ number: 5, title: 'Goals', shortTitle: 'Goals', section: 'problems' },
	{ number: 6, title: 'Interventions', shortTitle: 'Interventions', section: 'problems' },
	{ number: 7, title: 'Evaluation and review', shortTitle: 'Evaluation', section: 'problems' },
	{ number: 8, title: 'Summary and completeness', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: CarePlan): StepConfig[] {
	// All steps are always visible in the care-plan wizard.
	return steps;
}

export function getNextStep(current: number, data: CarePlan): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: CarePlan): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: CarePlan): boolean {
	return steps.some((s) => s.number === stepNumber);
}
