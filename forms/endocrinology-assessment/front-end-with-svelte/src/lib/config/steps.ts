import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Presenting Symptoms', shortTitle: 'Symptoms', section: 'presentingSymptoms' },
	{ number: 3, title: 'Thyroid Axis Review', shortTitle: 'Thyroid', section: 'thyroidAxis' },
	{ number: 4, title: 'Adrenal Axis Review', shortTitle: 'Adrenal', section: 'adrenalAxis' },
	{ number: 5, title: 'Glucose Metabolism', shortTitle: 'Glucose', section: 'glucoseMetabolism' },
	{ number: 6, title: 'Reproductive Axis', shortTitle: 'Reproductive', section: 'reproductiveAxis' },
	{ number: 7, title: 'Pituitary Function', shortTitle: 'Pituitary', section: 'pituitaryFunction' },
	{ number: 8, title: 'Bone & Calcium', shortTitle: 'Bone', section: 'boneCalcium' },
	{ number: 9, title: 'Medications & Lifestyle', shortTitle: 'Meds', section: 'medicationsLifestyle' },
	{ number: 10, title: 'Clinical Impression & Plan', shortTitle: 'Impression', section: 'clinicalImpression' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the endocrinology assessment.
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
