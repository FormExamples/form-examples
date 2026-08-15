import type { StepConfig, ChartData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Chart context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient weight', shortTitle: 'Weight', section: 'patient' },
	{ number: 3, title: 'Intake entries', shortTitle: 'Intake', section: 'intake' },
	{ number: 4, title: 'Output entries', shortTitle: 'Output', section: 'output' },
	{ number: 5, title: 'Summary and note', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: ChartData): StepConfig[] {
	// All steps are always visible in the fluid-balance chart.
	return steps;
}

export function getNextStep(current: number, data: ChartData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: ChartData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: ChartData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
