import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Presenting Skin Concern', shortTitle: 'Concern', section: 'presentingSkinConcern' },
	{ number: 3, title: 'Skin Inspection', shortTitle: 'Skin', section: 'skinInspection' },
	{ number: 4, title: 'Hair & Scalp Examination', shortTitle: 'Hair & Scalp', section: 'hairScalpExamination' },
	{ number: 5, title: 'Nail Examination', shortTitle: 'Nails', section: 'nailExamination' },
	{ number: 6, title: 'Wound Assessment', shortTitle: 'Wound', section: 'woundAssessment' },
	{ number: 7, title: 'Braden Scale Scoring', shortTitle: 'Braden', section: 'bradenScale' },
	{ number: 8, title: 'Photography & Documentation', shortTitle: 'Photography', section: 'photographyDocumentation' },
	{ number: 9, title: 'Clinical Impression & Care Plan', shortTitle: 'Impression', section: 'clinicalImpressionCarePlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the integumentary assessment.
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
