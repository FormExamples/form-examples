import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Presenting Complaint', shortTitle: 'Complaint', section: 'presentingComplaint' },
	{ number: 3, title: 'History of Present Illness', shortTitle: 'History', section: 'historyOfPresentIllness' },
	{ number: 4, title: 'Past ENT History & Surgery', shortTitle: 'Past ENT', section: 'pastEntHistory' },
	{ number: 5, title: 'SNOT-22 Questionnaire', shortTitle: 'SNOT-22', section: 'snot22' },
	{ number: 6, title: 'External Examination', shortTitle: 'External', section: 'externalExamination' },
	{ number: 7, title: 'Otoscopy', shortTitle: 'Otoscopy', section: 'otoscopy' },
	{ number: 8, title: 'Anterior Rhinoscopy', shortTitle: 'Rhinoscopy', section: 'anteriorRhinoscopy' },
	{ number: 9, title: 'Oropharyngeal & Neck Examination', shortTitle: 'Oro/Neck', section: 'oropharyngealNeckExamination' },
	{ number: 10, title: 'Clinical Impression & Management Plan', shortTitle: 'Impression', section: 'clinicalImpressionPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the otolaryngology assessment.
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
