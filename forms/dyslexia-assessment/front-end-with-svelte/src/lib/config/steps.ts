import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Developmental History', shortTitle: 'Development', section: 'developmentalHistory' },
	{ number: 3, title: 'Educational Background', shortTitle: 'Education', section: 'educationalBackground' },
	{ number: 4, title: 'Reading Assessment', shortTitle: 'Reading', section: 'readingAssessment' },
	{ number: 5, title: 'Writing & Spelling Assessment', shortTitle: 'Writing', section: 'writingSpelling' },
	{ number: 6, title: 'Phonological Processing', shortTitle: 'Phonology', section: 'phonologicalProcessing' },
	{ number: 7, title: 'Working Memory & Processing Speed', shortTitle: 'Memory', section: 'workingMemoryProcessingSpeed' },
	{ number: 8, title: 'Emotional & Behavioural Impact', shortTitle: 'Emotional', section: 'emotionalBehavioural' },
	{ number: 9, title: 'Previous Support & Interventions', shortTitle: 'Support', section: 'previousSupport' },
	{ number: 10, title: 'Recommendations & Support Plan', shortTitle: 'Plan', section: 'recommendationsSupportPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the dyslexia assessment.
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
