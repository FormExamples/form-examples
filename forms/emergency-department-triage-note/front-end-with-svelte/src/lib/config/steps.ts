import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Triage context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Arrival', shortTitle: 'Arrival', section: 'arrival' },
	{ number: 3, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 4, title: 'Presenting complaint', shortTitle: 'Complaint', section: 'complaint' },
	{ number: 5, title: 'Triage vital signs', shortTitle: 'Vitals', section: 'vitals' },
	{ number: 6, title: 'Pain score', shortTitle: 'Pain', section: 'pain' },
	{ number: 7, title: 'Discriminators', shortTitle: 'Discriminators', section: 'discriminators' },
	{ number: 8, title: 'Triage note and sign-off', shortTitle: 'Review', section: 'note' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the ED triage assessment.
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
