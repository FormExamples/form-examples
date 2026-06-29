import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Fall History', shortTitle: 'Falls', section: 'fallHistory' },
	{ number: 3, title: 'Morse Fall Scale', shortTitle: 'MFS', section: 'mfs' },
	{ number: 4, title: 'Mobility & Gait', shortTitle: 'Mobility', section: 'mobilityGait' },
	{ number: 5, title: 'Medication Review', shortTitle: 'Meds', section: 'medicationReview' },
	{ number: 6, title: 'Vision & Sensory', shortTitle: 'Vision', section: 'visionSensory' },
	{ number: 7, title: 'Environmental', shortTitle: 'Environment', section: 'environmental' },
	{ number: 8, title: 'Cognitive', shortTitle: 'Cognition', section: 'cognitive' },
	{ number: 9, title: 'Previous Interventions', shortTitle: 'Interventions', section: 'previousInterventions' },
	{ number: 10, title: 'Fall Prevention Plan', shortTitle: 'Plan', section: 'preventionPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the fall-risk assessment.
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
