import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 9;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Primary Diagnosis & Prognosis', shortTitle: 'Diagnosis', section: 'primaryDiagnosisPrognosis' },
	{ number: 3, title: 'ESAS-r Symptom Scoring', shortTitle: 'ESAS-r', section: 'esasrSymptoms' },
	{ number: 4, title: 'Performance Status', shortTitle: 'Performance', section: 'performanceStatus' },
	{ number: 5, title: 'Goals of Care & ACP Documents', shortTitle: 'Goals / ACP', section: 'goalsOfCareACP' },
	{ number: 6, title: 'Medications & Symptom Control Plan', shortTitle: 'Medications', section: 'medicationsSymptomControl' },
	{ number: 7, title: 'Psychosocial & Spiritual Concerns', shortTitle: 'Psychosocial', section: 'psychosocialSpiritualConcerns' },
	{ number: 8, title: 'Carer & Family Support', shortTitle: 'Carer', section: 'carerFamilySupport' },
	{ number: 9, title: 'Multidisciplinary Plan & Referrals', shortTitle: 'MDT Plan', section: 'multidisciplinaryPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the palliative assessment.
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
