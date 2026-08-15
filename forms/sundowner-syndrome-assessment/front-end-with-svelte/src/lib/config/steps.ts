import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Cognitive Status', shortTitle: 'Cognition', section: 'cognitiveStatus' },
	{ number: 3, title: 'Behavioural Symptoms', shortTitle: 'Behaviour', section: 'behaviouralSymptoms' },
	{ number: 4, title: 'Temporal Pattern', shortTitle: 'Temporal', section: 'temporalPattern' },
	{ number: 5, title: 'Trigger Identification', shortTitle: 'Triggers', section: 'triggerIdentification' },
	{ number: 6, title: 'Sleep-Wake Cycle', shortTitle: 'Sleep', section: 'sleepWakeCycle' },
	{ number: 7, title: 'Medication Review', shortTitle: 'Medication', section: 'medicationReview' },
	{ number: 8, title: 'Environmental Assessment', shortTitle: 'Environment', section: 'environmentalAssessment' },
	{ number: 9, title: 'Carer Impact & Support', shortTitle: 'Carer', section: 'carerImpact' },
	{ number: 10, title: 'Management Plan', shortTitle: 'Plan', section: 'managementPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the sundowner assessment.
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
