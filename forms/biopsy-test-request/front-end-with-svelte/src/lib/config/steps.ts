import type { StepConfig, BiopsyRequestData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 8;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Requesting clinician', shortTitle: 'Clinician', section: 'clinician' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'patient' },
	{ number: 3, title: 'Requested procedure', shortTitle: 'Procedure', section: 'procedure' },
	{ number: 4, title: 'Indication & question', shortTitle: 'Indication', section: 'indication' },
	{ number: 5, title: 'Lesion description', shortTitle: 'Lesion', section: 'lesion' },
	{ number: 6, title: 'Bleeding & coagulation', shortTitle: 'Bleeding', section: 'bleeding' },
	{ number: 7, title: 'Risk & safety review', shortTitle: 'Risk review', section: 'bleeding' },
	{ number: 8, title: 'Triage & submit', shortTitle: 'Triage', section: 'triage' }
];

export function getVisibleSteps(_data: BiopsyRequestData): StepConfig[] {
	return steps;
}

export function getNextStep(current: number, data: BiopsyRequestData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: BiopsyRequestData): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}
