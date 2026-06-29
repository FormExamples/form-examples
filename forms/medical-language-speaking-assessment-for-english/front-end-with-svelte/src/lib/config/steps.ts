import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 5;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Candidate Details', shortTitle: 'Candidate', section: 'candidateDetails' },
	{ number: 2, title: 'Role-play 1 — Patient Interview', shortTitle: 'Role-play 1', section: 'rolePlay1' },
	{ number: 3, title: 'Role-play 2 — Clinical Explanation', shortTitle: 'Role-play 2', section: 'rolePlay2' },
	{ number: 4, title: 'Linguistic Criteria Rating', shortTitle: 'Linguistic', section: 'linguisticCriteria' },
	{ number: 5, title: 'Clinical Communication & Overall Grade', shortTitle: 'Clinical', section: 'clinicalCommunication' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the OET speaking assessment.
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
