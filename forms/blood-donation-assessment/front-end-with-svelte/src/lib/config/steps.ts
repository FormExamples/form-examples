import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Donor Demographics', shortTitle: 'Demographics', section: 'donorDemographics' },
	{ number: 2, title: 'General Health & Wellbeing', shortTitle: 'General Health', section: 'generalHealth' },
	{ number: 3, title: 'Medical History', shortTitle: 'Medical', section: 'medicalHistory' },
	{ number: 4, title: 'Recent Illness & Infections', shortTitle: 'Recent Illness', section: 'recentIllness' },
	{ number: 5, title: 'Travel History', shortTitle: 'Travel', section: 'travelHistory' },
	{ number: 6, title: 'Lifestyle & Risk Behaviours', shortTitle: 'Lifestyle', section: 'lifestyleRisk' },
	{ number: 7, title: 'Pregnancy & Transfusion History', shortTitle: 'Pregnancy & Tx', section: 'pregnancyTransfusion' },
	{ number: 8, title: 'Vital Signs', shortTitle: 'Vitals', section: 'vitalSigns' },
	{ number: 9, title: 'Informed Consent', shortTitle: 'Consent', section: 'informedConsent' },
	{ number: 10, title: 'Donation Plan', shortTitle: 'Donation Plan', section: 'donationPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the blood donation assessment.
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
