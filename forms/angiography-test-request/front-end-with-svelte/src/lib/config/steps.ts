import type { StepConfig, RequestData } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting clinician', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Requested examination', shortTitle: 'Examination', section: 'request' },
	{ number: 4, title: 'Contrast & renal safety', shortTitle: 'Contrast', section: 'contrast' },
	{ number: 5, title: 'Bleeding & anticoagulation', shortTitle: 'Bleeding', section: 'bleeding' },
	{ number: 6, title: 'Pregnancy & radiation', shortTitle: 'Pregnancy', section: 'pregnancy' },
	{ number: 7, title: 'Triage & submit', shortTitle: 'Triage', section: 'triage' }
];

export function getVisibleSteps(_data: RequestData): StepConfig[] {
	// All steps are always visible in the angiography request.
	return steps;
}

export function getNextStep(current: number, data: RequestData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: RequestData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: RequestData): boolean {
	return steps.some((s) => s.number === stepNumber);
}
