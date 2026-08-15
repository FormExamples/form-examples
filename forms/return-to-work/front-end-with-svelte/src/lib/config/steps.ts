import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Clinician identification', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Job context', shortTitle: 'Job', section: 'job' },
	{ number: 4, title: 'Absence history', shortTitle: 'Absence', section: 'absence' },
	{ number: 5, title: 'Reason for absence', shortTitle: 'Reason', section: 'diagnosis' },
	{ number: 6, title: 'Current treatment', shortTitle: 'Treatment', section: 'treatment' },
	{ number: 7, title: 'Functional assessment', shortTitle: 'Functional', section: 'functional' },
	{ number: 8, title: 'Fitness statement', shortTitle: 'Fitness', section: 'fitness' },
	{ number: 9, title: 'Phased return plan', shortTitle: 'Phased', section: 'phasedReturn' },
	{ number: 10, title: 'Workplace adjustments', shortTitle: 'Adjustments', section: 'adjustments' },
	{ number: 11, title: 'Follow-up plan', shortTitle: 'Follow-up', section: 'followUp' },
	{ number: 12, title: 'Sign-off', shortTitle: 'Sign-off', section: 'signOff' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the return-to-work record.
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
