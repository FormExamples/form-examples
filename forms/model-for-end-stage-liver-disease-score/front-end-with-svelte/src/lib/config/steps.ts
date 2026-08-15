import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Total bilirubin', shortTitle: 'Bilirubin', section: 'bilirubin' },
	{ number: 4, title: 'INR', shortTitle: 'INR', section: 'inr' },
	{ number: 5, title: 'Creatinine and dialysis', shortTitle: 'Renal', section: 'renal' },
	{ number: 6, title: 'Serum sodium', shortTitle: 'Sodium', section: 'sodium' },
	{ number: 7, title: 'Serum albumin', shortTitle: 'Albumin', section: 'albumin' },
	{ number: 8, title: 'Summary and result', shortTitle: 'Summary', section: 'note' }
];

/**
 * Sodium (step 6) applies to MELD-Na and MELD 3.0; albumin (step 7) applies to
 * MELD 3.0 only. All other steps are always visible.
 */
export function isStepVisible(stepNumber: number, data: AssessmentData): boolean {
	const v = data.context.meldVariant;
	if (stepNumber === 6) return v === 'meld-na' || v === 'meld-3';
	if (stepNumber === 7) return v === 'meld-3';
	return steps.some((s) => s.number === stepNumber);
}

export function getVisibleSteps(data: AssessmentData): StepConfig[] {
	return steps.filter((s) => isStepVisible(s.number, data));
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
