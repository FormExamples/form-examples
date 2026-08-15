import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Maternal Demographics', shortTitle: 'Demographics', section: 'maternalDemographics' },
	{ number: 2, title: 'Obstetric History', shortTitle: 'Obstetric Hx', section: 'obstetricHistory' },
	{ number: 3, title: 'Medical History', shortTitle: 'Medical Hx', section: 'medicalHistory' },
	{ number: 4, title: 'Current Pregnancy Details', shortTitle: 'Pregnancy', section: 'currentPregnancy' },
	{ number: 5, title: 'Lifestyle & Social Factors', shortTitle: 'Lifestyle', section: 'lifestyleSocialFactors' },
	{ number: 6, title: 'Screening Test Results', shortTitle: 'Screening', section: 'screeningResults' },
	{ number: 7, title: 'Mental Health Assessment', shortTitle: 'Mental Health', section: 'mentalHealthAssessment' },
	{ number: 8, title: 'Fetal Assessment', shortTitle: 'Fetal', section: 'fetalAssessment' },
	{ number: 9, title: 'Birth Preferences', shortTitle: 'Birth Prefs', section: 'birthPreferences' },
	{ number: 10, title: 'Care Plan & Follow-up', shortTitle: 'Care Plan', section: 'carePlanFollowup' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the obstetrics assessment.
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
