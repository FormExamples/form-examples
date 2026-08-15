import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Carer & Support Network', shortTitle: 'Carer & Support', section: 'carerSupport' },
	{ number: 3, title: 'Communication Needs', shortTitle: 'Communication', section: 'communicationNeeds' },
	{ number: 4, title: 'Medical Review', shortTitle: 'Medical Review', section: 'medicalReview' },
	{ number: 5, title: 'Physical Examination & Observations', shortTitle: 'Physical Exam', section: 'physicalExamination' },
	{ number: 6, title: 'Adaptive Functioning', shortTitle: 'Adaptive Functioning', section: 'adaptiveFunctioning' },
	{ number: 7, title: 'Behavioural Concerns & Triggers', shortTitle: 'Behavioural', section: 'behaviouralConcerns' },
	{ number: 8, title: 'Mental Capacity & Consent', shortTitle: 'Capacity & Consent', section: 'mentalCapacityConsent' },
	{ number: 9, title: 'Reasonable Adjustments Required', shortTitle: 'Adjustments', section: 'reasonableAdjustments' },
	{ number: 10, title: 'Health Action Plan', shortTitle: 'Action Plan', section: 'healthActionPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the learning-disability assessment.
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
