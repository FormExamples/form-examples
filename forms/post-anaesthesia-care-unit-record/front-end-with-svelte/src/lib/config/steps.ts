import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Recovery context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Aldrete — activity', shortTitle: 'Activity', section: 'activity' },
	{ number: 4, title: 'Aldrete — respiration', shortTitle: 'Respiration', section: 'respiration' },
	{ number: 5, title: 'Aldrete — circulation', shortTitle: 'Circulation', section: 'circulation' },
	{
		number: 6,
		title: 'Aldrete — consciousness',
		shortTitle: 'Consciousness',
		section: 'consciousness'
	},
	{
		number: 7,
		title: 'Aldrete — oxygen saturation',
		shortTitle: 'Oxygen sat.',
		section: 'oxygenSaturation'
	},
	{ number: 8, title: 'Airway, pain and PONV', shortTitle: 'Airway / pain / PONV', section: 'observations' },
	{ number: 9, title: 'PADSS (day surgery, optional)', shortTitle: 'PADSS', section: 'padss' },
	{ number: 10, title: 'Summary and score', shortTitle: 'Summary', section: 'note' }
];

/**
 * All steps render in one continuous single-page wizard. The PADSS step (9) is
 * only clinically relevant for ambulatory cases, but stays visible so the whole
 * record is a single scroll; its inputs simply carry a day-surgery hint.
 */
export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
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
