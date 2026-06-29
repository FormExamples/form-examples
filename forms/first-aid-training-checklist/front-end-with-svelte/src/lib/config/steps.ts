import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Trainee Details', shortTitle: 'Trainee', section: 'traineeDetails' },
	{ number: 2, title: 'Scene Assessment & Safety', shortTitle: 'Scene', section: 'sceneAssessmentSafety' },
	{ number: 3, title: 'Primary Survey (DRABC)', shortTitle: 'DRABC', section: 'primarySurveyDRABC' },
	{ number: 4, title: 'CPR & AED', shortTitle: 'CPR & AED', section: 'cprAed' },
	{ number: 5, title: 'Choking Management', shortTitle: 'Choking', section: 'chokingManagement' },
	{ number: 6, title: 'Bleeding & Wound Care', shortTitle: 'Bleeding', section: 'bleedingWoundCare' },
	{ number: 7, title: 'Burns & Scalds', shortTitle: 'Burns', section: 'burnsScalds' },
	{ number: 8, title: 'Fractures, Sprains & Spinal Injury', shortTitle: 'Fractures', section: 'fracturesSprainsSpinal' },
	{ number: 9, title: 'Medical Emergencies', shortTitle: 'Medical', section: 'medicalEmergencies' },
	{ number: 10, title: 'Recording, Reporting & Handover', shortTitle: 'Recording', section: 'recordingReportingHandover' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the First Aid at Work checklist.
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
