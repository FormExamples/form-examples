import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Encounter context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Eligibility', shortTitle: 'Eligibility', section: 'eligibility' },
	{ number: 4, title: 'Consent', shortTitle: 'Consent', section: 'consent' },
	{ number: 5, title: 'Symptoms', shortTitle: 'Symptoms', section: 'symptoms' },
	{ number: 6, title: 'Sample adequacy', shortTitle: 'Adequacy', section: 'adequacy' },
	{ number: 7, title: 'Primary hrHPV result', shortTitle: 'HPV', section: 'hpv' },
	{ number: 8, title: 'Reflex cytology', shortTitle: 'Cytology', section: 'cytology' },
	{ number: 9, title: 'Clinical note and result', shortTitle: 'Note', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible; the reflex-cytology step notes it applies
	// only when the primary hrHPV result is positive.
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
