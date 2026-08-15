import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 6;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Personal Details',
		shortTitle: 'About you',
		section: 'personalDetails'
	},
	{
		number: 2,
		title: 'Healthcare Professionals',
		shortTitle: 'Healthcare',
		section: 'healthcareProfessionals'
	},
	{
		number: 3,
		title: 'Diagnosis Confirmation',
		shortTitle: 'Q1 Diagnosis',
		section: 'diagnosisConfirmation'
	},
	{
		number: 4,
		title: 'Mental Health Conditions',
		shortTitle: 'Q2 Conditions',
		section: 'mentalHealthConditions'
	},
	{
		number: 5,
		title: 'Recent Contact',
		shortTitle: 'Q3 Contact',
		section: 'recentContact'
	},
	{
		number: 6,
		title: "Applicant's Authorisation",
		shortTitle: 'Authorisation',
		section: 'authorisation'
	}
];
