import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Case identification', shortTitle: 'Case ID', section: 'identification' },
	{ number: 2, title: 'Pre-induction checks', shortTitle: 'Pre-induction', section: 'preInduction' },
	{ number: 3, title: 'ASA & airway assessment', shortTitle: 'ASA & airway', section: 'asaAirway' },
	{ number: 4, title: 'Drugs & doses', shortTitle: 'Drugs', section: 'drugs' },
	{ number: 5, title: 'Airway management', shortTitle: 'Airway mgmt', section: 'airway' },
	{ number: 6, title: 'Monitoring', shortTitle: 'Monitoring', section: 'monitoring' },
	{ number: 7, title: 'Timed observations', shortTitle: 'Observations', section: 'observations' },
	{ number: 8, title: 'Fluids & blood loss', shortTitle: 'Fluids', section: 'fluids' },
	{ number: 9, title: 'Regional / neuraxial', shortTitle: 'Regional', section: 'regional' },
	{ number: 10, title: 'Events & complications', shortTitle: 'Events', section: 'events' },
	{ number: 11, title: 'Recovery handover', shortTitle: 'Handover', section: 'handover' },
	{ number: 12, title: 'Summary & sign-off', shortTitle: 'Sign-off', section: 'signoff' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the anaesthetic record.
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
