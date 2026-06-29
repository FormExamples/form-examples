import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Planned Surgery & Anaesthesia', shortTitle: 'Surgery', section: 'plannedSurgery' },
	{ number: 3, title: 'Medical History', shortTitle: 'History', section: 'medicalHistory' },
	{ number: 4, title: 'Medications', shortTitle: 'Meds', section: 'medications' },
	{ number: 5, title: 'Allergies & Adverse Reactions', shortTitle: 'Allergies', section: 'allergies' },
	{ number: 6, title: 'Previous Anaesthesia & Surgery', shortTitle: 'Prev Anaes', section: 'previousAnaesthesia' },
	{ number: 7, title: 'Social History & Functional Capacity', shortTitle: 'Social', section: 'socialHistory' },
	{ number: 8, title: 'Vital Signs & Examination', shortTitle: 'Exam', section: 'vitalSigns' },
	{ number: 9, title: 'Investigations & Scoring', shortTitle: 'Scoring', section: 'investigationsAndPlan' },
	{ number: 10, title: 'Anaesthetic Plan & Consent', shortTitle: 'Plan', section: 'investigationsAndPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the anaesthesiology assessment.
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
