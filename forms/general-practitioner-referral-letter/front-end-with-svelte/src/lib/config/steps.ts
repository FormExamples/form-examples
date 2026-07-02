import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Referrer details', shortTitle: 'Referrer', section: 'referrer' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Referral destination', shortTitle: 'Destination', section: 'destination' },
	{ number: 4, title: 'Urgency', shortTitle: 'Urgency', section: 'urgencyInfo' },
	{ number: 5, title: 'Reason and history', shortTitle: 'Reason & history', section: 'clinical' },
	{
		number: 6,
		title: 'Examination and investigations',
		shortTitle: 'Examination',
		section: 'examination'
	},
	{
		number: 7,
		title: 'Medications and allergies',
		shortTitle: 'Medications',
		section: 'medications'
	},
	{
		number: 8,
		title: 'Expectations, consent, and safety-netting',
		shortTitle: 'Consent & safety-netting',
		section: 'expectations'
	},
	{ number: 9, title: 'Summary and review', shortTitle: 'Summary', section: 'review' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the referral wizard.
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
