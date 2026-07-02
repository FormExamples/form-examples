import type { StepConfig, BloodspotScreening } from '$lib/engine/types';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Sample-taker and setting', shortTitle: 'Sample-taker', section: 'sampleTaker' },
	{ number: 2, title: 'Baby identification', shortTitle: 'Baby', section: 'babyId' },
	{ number: 3, title: 'Eligibility and consent', shortTitle: 'Consent', section: 'eligibility' },
	{ number: 4, title: 'Sample event', shortTitle: 'Sample', section: 'sampleEvent' },
	{ number: 5, title: 'Sample quality', shortTitle: 'Quality', section: 'sampleQuality' },
	{ number: 6, title: 'Condition results', shortTitle: 'Conditions', section: 'conditions' },
	{ number: 7, title: 'Summary and outcome', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: BloodspotScreening): StepConfig[] {
	return steps;
}

export function getNextStep(current: number, data: BloodspotScreening): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: BloodspotScreening): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: BloodspotScreening): boolean {
	return steps.some((s) => s.number === stepNumber);
}
