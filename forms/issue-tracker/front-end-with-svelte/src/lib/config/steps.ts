import type { IssueTrackerAssessment } from '#lib/engine/types.js';

/** One wizard step, bound to a top-level section of the issue data model. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
	section: keyof IssueTrackerAssessment;
}

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Reporter & Metadata', shortTitle: 'Reporter', section: 'reporter' },
	{ number: 2, title: 'Chief Complaint', shortTitle: 'Complaint', section: 'cc' },
	{ number: 3, title: 'Participants', shortTitle: 'People', section: 'pt' },
	{ number: 4, title: 'Symptoms', shortTitle: 'Symptoms', section: 'sx' },
	{ number: 5, title: 'Fractures', shortTitle: 'Fractures', section: 'fx' },
	{ number: 6, title: 'History', shortTitle: 'History', section: 'hx' },
	{ number: 7, title: 'Investigations', shortTitle: 'Investigations', section: 'ix' },
	{ number: 8, title: 'Diagnosis', shortTitle: 'Diagnosis', section: 'dx' },
	{ number: 9, title: 'Treatments & Prognosis', shortTitle: 'Treatments', section: 'txpx' },
	{ number: 10, title: 'Scores & Sign-off', shortTitle: 'Scores', section: 'scores' }
];

export function getVisibleSteps(_data: IssueTrackerAssessment): StepConfig[] {
	return steps;
}

export function getNextStep(current: number, data: IssueTrackerAssessment): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx === -1 || idx >= visible.length - 1) return null;
	return visible[idx + 1].number;
}

export function getPrevStep(current: number, data: IssueTrackerAssessment): number | null {
	const visible = getVisibleSteps(data);
	const idx = visible.findIndex((s) => s.number === current);
	if (idx <= 0) return null;
	return visible[idx - 1].number;
}

export function isStepVisible(stepNumber: number, _data: IssueTrackerAssessment): boolean {
	return steps.some((s) => s.number === stepNumber);
}
