import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Visit Details', shortTitle: 'Visit', section: 'visitDetails' },
	{ number: 3, title: 'Access & Waiting Times', shortTitle: 'Access', section: 'accessWaitingTimes' },
	{ number: 4, title: 'Communication & Information', shortTitle: 'Communication', section: 'communicationInformation' },
	{ number: 5, title: 'Clinical Care Quality', shortTitle: 'Clinical Care', section: 'clinicalCareQuality' },
	{ number: 6, title: 'Staff Attitude & Professionalism', shortTitle: 'Staff', section: 'staffAttitude' },
	{ number: 7, title: 'Environment & Facilities', shortTitle: 'Environment', section: 'environmentFacilities' },
	{ number: 8, title: 'Discharge & Follow-up', shortTitle: 'Discharge', section: 'dischargeFollowUp' },
	{ number: 9, title: 'Overall Experience', shortTitle: 'Overall', section: 'overallExperience' },
	{ number: 10, title: 'Comments & Suggestions', shortTitle: 'Comments', section: 'commentsSuggestions' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the patient satisfaction survey.
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
