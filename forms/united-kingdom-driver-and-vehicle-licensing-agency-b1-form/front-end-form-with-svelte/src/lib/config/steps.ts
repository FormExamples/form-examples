import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 13;

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
		shortTitle: 'GP & consultant',
		section: 'healthcareProfessionals'
	},
	{
		number: 3,
		title: 'Condition History',
		shortTitle: 'Q1 history',
		section: 'conditionHistory'
	},
	{
		number: 4,
		title: 'Treatment Provider',
		shortTitle: 'Q2 provider',
		section: 'treatmentProvider'
	},
	{
		number: 5,
		title: 'Blackouts',
		shortTitle: 'Q3 blackouts',
		section: 'blackouts'
	},
	{
		number: 6,
		title: 'Seizures',
		shortTitle: 'Q4–Q6 seizures',
		section: 'seizures'
	},
	{
		number: 7,
		title: 'Medication',
		shortTitle: 'Q7 medication',
		section: 'medication'
	},
	{
		number: 8,
		title: 'VP Shunt',
		shortTitle: 'Q8 VP shunt',
		section: 'vpShunt'
	},
	{
		number: 9,
		title: 'Daily Living',
		shortTitle: 'Q9 daily living',
		section: 'dailyLiving'
	},
	{
		number: 10,
		title: 'Double Vision',
		shortTitle: 'Q10 double vision',
		section: 'doubleVision'
	},
	{
		number: 11,
		title: 'Eyesight',
		shortTitle: 'Q11 eyesight',
		section: 'eyesight'
	},
	{
		number: 12,
		title: 'Vehicle Adaptations',
		shortTitle: 'Q12 adaptations',
		section: 'vehicleAdaptations'
	},
	{
		number: 13,
		title: 'Authorisation',
		shortTitle: 'Authorisation',
		section: 'authorisation'
	}
];
