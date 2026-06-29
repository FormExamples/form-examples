import type { StepConfig, AssessmentData } from '$lib/engine/types';

export const TOTAL_STEPS = 10;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Demographics & Site Details', shortTitle: 'Site', section: 'siteDetails' },
	{ number: 2, title: 'PPE & Hazard Controls', shortTitle: 'PPE', section: 'ppeHazardControls' },
	{
		number: 3,
		title: 'Chemical & Biological Hazards',
		shortTitle: 'Chem/Bio',
		section: 'chemicalBiologicalHazards'
	},
	{ number: 4, title: 'Electrical Safety', shortTitle: 'Electrical', section: 'electricalSafety' },
	{ number: 5, title: 'Fire Safety & Emergency Egress', shortTitle: 'Fire', section: 'fireSafety' },
	{
		number: 6,
		title: 'Ergonomics & Manual Handling',
		shortTitle: 'Ergonomics',
		section: 'ergonomicsManualHandling'
	},
	{
		number: 7,
		title: 'Emergency Procedures',
		shortTitle: 'Emergency',
		section: 'emergencyProcedures'
	},
	{
		number: 8,
		title: 'Training & Competence',
		shortTitle: 'Training',
		section: 'trainingCompetence'
	},
	{
		number: 9,
		title: 'Incident Reporting & Near Misses',
		shortTitle: 'Incidents',
		section: 'incidentReporting'
	},
	{ number: 10, title: 'Sign-off & Action Plan', shortTitle: 'Sign-off', section: 'signoffActionPlan' }
];

export function getVisibleSteps(_data: AssessmentData): StepConfig[] {
	// All steps are always visible in the workplace safety assessment.
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
