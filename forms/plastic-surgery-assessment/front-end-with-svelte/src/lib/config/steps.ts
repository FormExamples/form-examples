import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Reason for Referral', shortTitle: 'Referral', section: 'reasonForReferral' },
	{ number: 3, title: 'Medical & Surgical History', shortTitle: 'History', section: 'medicalSurgicalHistory' },
	{ number: 4, title: 'Current Condition', shortTitle: 'Condition', section: 'currentCondition' },
	{ number: 5, title: 'Wound & Tissue Assessment', shortTitle: 'Wound', section: 'woundTissueAssessment' },
	{ number: 6, title: 'Psychological Assessment', shortTitle: 'Psychology', section: 'psychologicalAssessment' },
	{ number: 7, title: 'Anaesthetic Risk', shortTitle: 'Anaesthetic', section: 'anaestheticRisk' },
	{ number: 8, title: 'Photography & Documentation', shortTitle: 'Photography', section: 'photographyDocumentation' },
	{ number: 9, title: 'Medications & Allergies', shortTitle: 'Meds', section: 'medicationsAllergies' },
	{ number: 10, title: 'Procedure Planning & Consent', shortTitle: 'Procedure', section: 'procedurePlanningConsent' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the plastic surgery assessment.
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
