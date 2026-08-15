import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Role & Qualifications', shortTitle: 'Role', section: 'roleQualifications' },
	{ number: 3, title: 'Physical Fitness', shortTitle: 'Fitness', section: 'physicalFitness' },
	{ number: 4, title: 'Clinical Skills', shortTitle: 'Clinical', section: 'clinicalSkills' },
	{ number: 5, title: 'Equipment & Vehicle', shortTitle: 'Equipment', section: 'equipmentVehicle' },
	{ number: 6, title: 'Communication Skills', shortTitle: 'Communication', section: 'communicationSkills' },
	{ number: 7, title: 'Psychological Readiness', shortTitle: 'Psychological', section: 'psychologicalReadiness' },
	{ number: 8, title: 'Occupational Health', shortTitle: 'Occ. Health', section: 'occupationalHealth' },
	{ number: 9, title: 'CPD & Training', shortTitle: 'CPD', section: 'cpdTraining' },
	{ number: 10, title: 'Overall Fitness Decision', shortTitle: 'Decision', section: 'fitnessDecision' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the first responder assessment.
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
