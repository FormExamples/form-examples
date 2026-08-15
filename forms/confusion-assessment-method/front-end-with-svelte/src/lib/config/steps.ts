import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessor and encounter', shortTitle: 'Assessor', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{
		number: 3,
		title: 'Feature 1 — acute onset and fluctuating course',
		shortTitle: 'Feature 1',
		section: 'feature1'
	},
	{ number: 4, title: 'Feature 2 — inattention', shortTitle: 'Feature 2', section: 'feature2' },
	{
		number: 5,
		title: 'Feature 3 — disorganised thinking',
		shortTitle: 'Feature 3',
		section: 'feature3'
	},
	{
		number: 6,
		title: 'Feature 4 — altered level of consciousness',
		shortTitle: 'Feature 4',
		section: 'feature4'
	},
	{
		number: 7,
		title: 'Motoric subtype and observations',
		shortTitle: 'Observations',
		section: 'observations'
	},
	{ number: 8, title: 'Result and disposition', shortTitle: 'Result', section: 'result' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the CAM assessment.
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
