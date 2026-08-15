import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Presenting Symptoms', shortTitle: 'Symptoms', section: 'presentingSymptoms' },
	{ number: 3, title: 'CKD Risk Factors', shortTitle: 'Risk Factors', section: 'ckdRiskFactors' },
	{ number: 4, title: 'Physical Examination', shortTitle: 'Exam', section: 'physicalExamination' },
	{ number: 5, title: 'Blood Tests', shortTitle: 'Blood', section: 'bloodTests' },
	{ number: 6, title: 'Urine Tests', shortTitle: 'Urine', section: 'urineTests' },
	{ number: 7, title: 'Imaging & Biopsy Review', shortTitle: 'Imaging', section: 'imagingBiopsy' },
	{ number: 8, title: 'Medication Review', shortTitle: 'Meds', section: 'medicationReview' },
	{ number: 9, title: 'Clinical Impression & KDIGO Stage', shortTitle: 'Impression', section: 'clinicalImpression' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the renal assessment
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
