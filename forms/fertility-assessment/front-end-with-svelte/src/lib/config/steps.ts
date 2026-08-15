import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Reproductive History', shortTitle: 'Reproductive', section: 'reproductiveHistory' },
	{ number: 3, title: 'Menstrual Cycle History', shortTitle: 'Cycle', section: 'menstrualCycle' },
	{ number: 4, title: 'Medical & Surgical History', shortTitle: 'Medical', section: 'medicalSurgicalHistory' },
	{ number: 5, title: 'Lifestyle Factors', shortTitle: 'Lifestyle', section: 'lifestyleFactors' },
	{ number: 6, title: 'Medications & Supplements', shortTitle: 'Medications', section: 'medicationsSupplements' },
	{ number: 7, title: 'Partner & Semen Analysis', shortTitle: 'Partner', section: 'partnerSemen' },
	{ number: 8, title: 'Hormone Profile', shortTitle: 'Hormones', section: 'hormoneProfile' },
	{ number: 9, title: 'Investigations', shortTitle: 'Investigations', section: 'investigations' },
	{ number: 10, title: 'Clinical Recommendation', shortTitle: 'Recommendation', section: 'clinicalRecommendation' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the fertility assessment.
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
