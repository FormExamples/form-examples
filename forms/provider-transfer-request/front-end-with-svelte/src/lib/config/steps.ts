import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting Provider Details', shortTitle: 'Requesting', section: 'requestingProvider' },
	{ number: 2, title: 'Receiving Provider Details', shortTitle: 'Receiving', section: 'receivingProvider' },
	{ number: 3, title: 'Patient Demographics', shortTitle: 'Patient', section: 'patientDemographics' },
	{ number: 4, title: 'Situation — Reason for Transfer', shortTitle: 'Situation', section: 'situation' },
	{ number: 5, title: 'Background — Relevant History', shortTitle: 'Background', section: 'background' },
	{ number: 6, title: 'Assessment — Current Clinical Status', shortTitle: 'Assessment', section: 'assessment' },
	{ number: 7, title: 'Recommendation — Requested Action', shortTitle: 'Recommendation', section: 'recommendation' },
	{ number: 8, title: 'Transfer Logistics', shortTitle: 'Logistics', section: 'transferLogistics' },
	{ number: 9, title: 'Sign-off & Acknowledgement', shortTitle: 'Sign-off', section: 'signoffAcknowledgement' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the provider transfer request.
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
