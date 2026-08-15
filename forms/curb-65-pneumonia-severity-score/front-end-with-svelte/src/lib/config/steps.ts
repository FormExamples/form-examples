import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Assessment context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Confusion (C)', shortTitle: 'Confusion', section: 'confusion' },
	{ number: 4, title: 'Urea (U)', shortTitle: 'Urea', section: 'urea' },
	{ number: 5, title: 'Respiratory rate (R)', shortTitle: 'Respiratory', section: 'respiratory' },
	{ number: 6, title: 'Blood pressure (B)', shortTitle: 'Blood pressure', section: 'bloodPressure' },
	{ number: 7, title: 'Age (65)', shortTitle: 'Age', section: 'age' },
	{ number: 8, title: 'Adjuncts (advisory)', shortTitle: 'Adjuncts', section: 'adjuncts' },
	{ number: 9, title: 'Score and disposition', shortTitle: 'Score', section: 'disposition' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the CURB-65 assessment.
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
