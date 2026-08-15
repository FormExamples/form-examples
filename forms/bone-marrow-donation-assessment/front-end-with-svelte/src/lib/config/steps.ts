import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{
		number: 2,
		title: 'Donor Registration & HLA Typing',
		shortTitle: 'HLA',
		section: 'donorRegistrationHlaTyping'
	},
	{ number: 3, title: 'Medical History', shortTitle: 'History', section: 'medicalHistory' },
	{
		number: 4,
		title: 'Physical Examination',
		shortTitle: 'Examination',
		section: 'physicalExamination'
	},
	{
		number: 5,
		title: 'Haematological Assessment',
		shortTitle: 'Haematology',
		section: 'haematologicalAssessment'
	},
	{
		number: 6,
		title: 'Infectious Disease Screening',
		shortTitle: 'Infection',
		section: 'infectiousDiseaseScreening'
	},
	{
		number: 7,
		title: 'Anaesthetic Assessment',
		shortTitle: 'Anaesthetic',
		section: 'anaestheticAssessment'
	},
	{
		number: 8,
		title: 'Collection Method Assessment',
		shortTitle: 'Collection',
		section: 'collectionMethodAssessment'
	},
	{
		number: 9,
		title: 'Psychological Readiness',
		shortTitle: 'Psychological',
		section: 'psychologicalReadiness'
	},
	{
		number: 10,
		title: 'Consent & Eligibility Decision',
		shortTitle: 'Consent',
		section: 'consentEligibility'
	}
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the donor assessment.
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
