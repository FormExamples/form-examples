import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Applicability', shortTitle: 'Applicability', section: 'applicability' },
	{ number: 4, title: 'Pain zones', shortTitle: 'Pain zones', section: 'painZones' },
	{ number: 5, title: 'Ankle bone tenderness', shortTitle: 'Ankle', section: 'ankleTenderness' },
	{ number: 6, title: 'Foot bone tenderness', shortTitle: 'Foot', section: 'footTenderness' },
	{ number: 7, title: 'Weight-bearing', shortTitle: 'Weight-bearing', section: 'weightBearing' },
	{ number: 8, title: 'Summary and decision', shortTitle: 'Summary', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the Ottawa Ankle / Foot Rules assessment.
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
