import type { AssessmentData, StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Note identification', shortTitle: 'Note', section: 'header' },
	{ number: 2, title: 'Patient and admission', shortTitle: 'Patient', section: 'admission' },
	{ number: 3, title: 'Interval history', shortTitle: 'Interval', section: 'interval' },
	{
		number: 4,
		title: 'Observations and NEWS2',
		shortTitle: 'Observations',
		section: 'observations'
	},
	{ number: 5, title: 'Examination', shortTitle: 'Examination', section: 'examination' },
	{
		number: 6,
		title: 'Investigations reviewed',
		shortTitle: 'Investigations',
		section: 'investigations'
	},
	{ number: 7, title: 'Problem list', shortTitle: 'Problems', section: 'problems' },
	{
		number: 8,
		title: 'Medications and prescribing',
		shortTitle: 'Medications',
		section: 'medications'
	},
	{ number: 9, title: 'Risk assessments', shortTitle: 'Risks', section: 'risks' },
	{
		number: 10,
		title: 'Assessment and impression',
		shortTitle: 'Impression',
		section: 'assessment'
	},
	{
		number: 11,
		title: 'Plan, jobs and escalation',
		shortTitle: 'Plan',
		section: 'planning'
	},
	{
		number: 12,
		title: 'Communication and sign-off',
		shortTitle: 'Sign-off',
		section: 'signOff'
	}
];

/**
 * All twelve steps are always visible. The note type changes which components
 * the completeness engine REQUIRES, not which steps the author can fill in — an
 * author is free to record an examination on a handover note, it simply does not
 * count towards that note type's required set.
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
