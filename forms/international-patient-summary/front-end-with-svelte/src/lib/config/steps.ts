import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Patient Demographics', shortTitle: 'Demographics', section: 'patientDemographics' },
	{ number: 2, title: 'Problem List', shortTitle: 'Problems', section: 'problemList' },
	{ number: 3, title: 'Medication Summary', shortTitle: 'Medications', section: 'medicationSummary' },
	{ number: 4, title: 'Allergies & Intolerances', shortTitle: 'Allergies', section: 'allergiesIntolerances' },
	{ number: 5, title: 'Immunisations', shortTitle: 'Immunisations', section: 'immunisations' },
	{ number: 6, title: 'Procedures', shortTitle: 'Procedures', section: 'procedures' },
	{ number: 7, title: 'Results & Investigations', shortTitle: 'Results', section: 'resultsInvestigations' },
	{ number: 8, title: 'Medical Devices / Implants', shortTitle: 'Devices', section: 'medicalDevices' },
	{ number: 9, title: 'Advance Directives & Consent', shortTitle: 'Directives', section: 'advanceDirectives' },
	{ number: 10, title: 'Authoring Clinician & Signoff', shortTitle: 'Signoff', section: 'authoringClinician' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the IPS form.
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
