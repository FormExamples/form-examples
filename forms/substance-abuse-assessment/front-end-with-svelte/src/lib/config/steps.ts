import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Alcohol Use (AUDIT)', shortTitle: 'AUDIT', section: 'alcoholUseAudit' },
	{ number: 3, title: 'Drug Use (DAST-10)', shortTitle: 'DAST-10', section: 'drugUseDast' },
	{ number: 4, title: 'Substance Use History', shortTitle: 'History', section: 'substanceUseHistory' },
	{ number: 5, title: 'Withdrawal Assessment', shortTitle: 'Withdrawal', section: 'withdrawalAssessment' },
	{ number: 6, title: 'Mental Health Comorbidities', shortTitle: 'Mental Health', section: 'mentalHealthComorbidities' },
	{ number: 7, title: 'Physical Health Impact', shortTitle: 'Physical Health', section: 'physicalHealthImpact' },
	{ number: 8, title: 'Social & Legal Impact', shortTitle: 'Social/Legal', section: 'socialLegalImpact' },
	{ number: 9, title: 'Previous Treatment History', shortTitle: 'Treatment Hx', section: 'previousTreatmentHistory' },
	{ number: 10, title: 'Treatment Planning & Goals', shortTitle: 'Planning', section: 'treatmentPlanningGoals' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the substance abuse assessment
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
