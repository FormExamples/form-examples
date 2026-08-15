import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Sport & Position Details', shortTitle: 'Sport', section: 'sportPositionDetails' },
	{ number: 3, title: 'Medical History', shortTitle: 'Medical', section: 'medicalHistory' },
	{ number: 4, title: 'Family History', shortTitle: 'Family', section: 'familyHistory' },
	{ number: 5, title: 'Menstrual History / RED-S', shortTitle: 'RED-S', section: 'menstrualHistoryREDS' },
	{ number: 6, title: 'Cardiovascular Screening', shortTitle: 'Cardio', section: 'cardiovascularScreening' },
	{ number: 7, title: 'Musculoskeletal Screening', shortTitle: 'MSK', section: 'musculoskeletalScreening' },
	{ number: 8, title: 'Neurological & Concussion Baseline', shortTitle: 'Neuro', section: 'neurologicalConcussionBaseline' },
	{ number: 9, title: 'Vision & Skin', shortTitle: 'Vision/Skin', section: 'visionSkin' },
	{ number: 10, title: 'Clearance Decision', shortTitle: 'Clearance', section: 'clearanceDecision' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the sports-medicine assessment.
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
