import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'About you', section: 'demographics' },
	{ number: 2, title: 'Leadership & Management', shortTitle: 'Leadership', section: 'leadership' },
	{ number: 3, title: 'Psychological Safety', shortTitle: 'Psych. Safety', section: 'psychSafety' },
	{ number: 4, title: 'Inclusion & Belonging', shortTitle: 'Inclusion', section: 'inclusion' },
	{ number: 5, title: 'Communication', shortTitle: 'Communication', section: 'communication' },
	{ number: 6, title: 'Collaboration & Teamwork', shortTitle: 'Collaboration', section: 'collaboration' },
	{ number: 7, title: 'Recognition & Reward', shortTitle: 'Recognition', section: 'recognition' },
	{ number: 8, title: 'Wellbeing', shortTitle: 'Wellbeing', section: 'wellbeing' },
	{ number: 9, title: 'Career Development', shortTitle: 'Career', section: 'career' },
	{ number: 10, title: 'Overall Climate & Recommendations', shortTitle: 'Overall', section: 'overall' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the workplace-climate assessment.
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
