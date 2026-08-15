import type { StepConfig, AssessmentData } from '#lib/engine/types.js';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics', shortTitle: 'Demographics', section: 'demographics' },
	{ number: 2, title: 'Vaccination History', shortTitle: 'History', section: 'vaccinationHistory' },
	{ number: 3, title: 'Childhood Immunisations', shortTitle: 'Childhood', section: 'childhoodImmunisations' },
	{ number: 4, title: 'Occupational Vaccines', shortTitle: 'Occupational', section: 'occupationalVaccines' },
	{ number: 5, title: 'Travel Vaccines', shortTitle: 'Travel', section: 'travelVaccines' },
	{ number: 6, title: 'COVID-19 Vaccination', shortTitle: 'COVID-19', section: 'covid19Vaccination' },
	{ number: 7, title: 'Influenza Vaccination', shortTitle: 'Influenza', section: 'influenzaVaccination' },
	{ number: 8, title: 'Contraindications & Allergies', shortTitle: 'Allergies', section: 'contraindicationsAllergies' },
	{ number: 9, title: 'Serology & Immunity Testing', shortTitle: 'Serology', section: 'serologyImmunityTesting' },
	{ number: 10, title: 'Schedule & Compliance', shortTitle: 'Compliance', section: 'scheduleCompliance' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the vaccinations checklist.
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
