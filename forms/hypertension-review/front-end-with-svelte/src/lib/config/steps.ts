import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 12;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Review context', shortTitle: 'Context', section: 'context' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient', section: 'identification' },
	{ number: 3, title: 'Diagnosis and comorbidity', shortTitle: 'Diagnosis', section: 'diagnosis' },
	{ number: 4, title: 'Clinic blood pressure', shortTitle: 'Clinic BP', section: 'clinicBp' },
	{
		number: 5,
		title: 'Home / ambulatory blood pressure',
		shortTitle: 'Home BP',
		section: 'homeBp'
	},
	{ number: 6, title: 'Medication and adherence', shortTitle: 'Medication', section: 'medication' },
	{
		number: 7,
		title: 'Cardiovascular risk',
		shortTitle: 'CV risk',
		section: 'cardiovascularRisk'
	},
	{ number: 8, title: 'Bloods and investigations', shortTitle: 'Bloods', section: 'bloods' },
	{ number: 9, title: 'Urine albumin:creatinine ratio', shortTitle: 'Urine ACR', section: 'urine' },
	{ number: 10, title: 'Lifestyle', shortTitle: 'Lifestyle', section: 'lifestyle' },
	{
		number: 11,
		title: 'Complications and target-organ damage',
		shortTitle: 'Complications',
		section: 'complications'
	},
	{ number: 12, title: 'Summary and plan', shortTitle: 'Summary', section: 'summary' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the hypertension review.
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
