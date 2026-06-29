import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Anthropometric Measurements', shortTitle: 'Anthropometrics', section: 'anthropometricMeasurements' },
	{ number: 3, title: 'Dietary History', shortTitle: 'Diet', section: 'dietaryHistory' },
	{ number: 4, title: 'Nutritional Screening (MUST)', shortTitle: 'MUST', section: 'nutritionalScreening' },
	{ number: 5, title: 'Swallowing & Oral Health', shortTitle: 'Swallowing', section: 'swallowingOralHealth' },
	{ number: 6, title: 'Gastrointestinal Function', shortTitle: 'GI', section: 'gastrointestinalFunction' },
	{ number: 7, title: 'Food Allergies & Intolerances', shortTitle: 'Allergies', section: 'foodAllergiesIntolerances' },
	{ number: 8, title: 'Nutritional Requirements', shortTitle: 'Requirements', section: 'nutritionalRequirements' },
	{ number: 9, title: 'Current Nutritional Support', shortTitle: 'Support', section: 'currentNutritionalSupport' },
	{ number: 10, title: 'Care Plan & Monitoring', shortTitle: 'Care Plan', section: 'carePlanMonitoring' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the nutrition assessment.
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
