import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review header', shortTitle: 'Header', section: 'header' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Overnight events', shortTitle: 'Overnight', section: 'overnight' },
	{ number: 4, title: 'Current issues and progress', shortTitle: 'Problems', section: 'problems' },
	{
		number: 5,
		title: 'Examination and observations',
		shortTitle: 'Examination',
		section: 'examination'
	},
	{
		number: 6,
		title: 'Investigations reviewed',
		shortTitle: 'Investigations',
		section: 'investigations'
	},
	{ number: 7, title: 'VTE assessment', shortTitle: 'VTE', section: 'vte' },
	{ number: 8, title: 'Medication changes', shortTitle: 'Medication', section: 'medication' },
	{ number: 9, title: 'Plan and jobs', shortTitle: 'Plan', section: 'plan' },
	{ number: 10, title: 'Escalation and discharge', shortTitle: 'Escalation', section: 'escalation' },
	{ number: 11, title: 'Summary and completeness', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the ward round note.
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
