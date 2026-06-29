import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Candidate, Examiner & Scenario',
		shortTitle: 'Candidate',
		section: 'candidateExaminerScenario'
	},
	{ number: 2, title: 'Scene Size-Up', shortTitle: 'Scene', section: 'sceneSizeUp' },
	{ number: 3, title: 'Primary Survey', shortTitle: 'Primary', section: 'primarySurvey' },
	{
		number: 4,
		title: 'History Taking & Secondary Assessment',
		shortTitle: 'History',
		section: 'historySecondaryAssessment'
	},
	{ number: 5, title: 'Reassessment', shortTitle: 'Reassess', section: 'reassessment' },
	{
		number: 6,
		title: 'Critical Criteria Review & Overall Result',
		shortTitle: 'Critical',
		section: 'criticalCriteriaReview'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the psychomotor examination.
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
