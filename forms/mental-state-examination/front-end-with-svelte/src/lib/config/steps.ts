import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{
		number: 3,
		title: 'Appearance and behaviour',
		shortTitle: 'Appearance',
		section: 'appearance'
	},
	{ number: 4, title: 'Speech', shortTitle: 'Speech', section: 'speech' },
	{ number: 5, title: 'Emotion (mood and affect)', shortTitle: 'Emotion', section: 'emotion' },
	{ number: 6, title: 'Perception', shortTitle: 'Perception', section: 'perception' },
	{ number: 7, title: 'Thought (form and content)', shortTitle: 'Thought', section: 'thought' },
	{ number: 8, title: 'Insight and judgement', shortTitle: 'Insight', section: 'insight' },
	{ number: 9, title: 'Cognition', shortTitle: 'Cognition', section: 'cognition' },
	{ number: 10, title: 'Summary and formulation', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the MSE.
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
