import type { StepConfig } from '#lib/engine/types.js';

export const TOTAL_STEPS = 7;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Patient Identification',
		shortTitle: 'Patient',
		section: 'patientIdentification'
	},
	{
		number: 2,
		title: 'Facility Details',
		shortTitle: 'Facility',
		section: 'facilityDetails'
	},
	{
		number: 3,
		title: 'Situation',
		shortTitle: 'Situation',
		section: 'situation'
	},
	{
		number: 4,
		title: 'Background',
		shortTitle: 'Background',
		section: 'background'
	},
	{
		number: 5,
		title: 'Assessment',
		shortTitle: 'Assessment',
		section: 'assessment'
	},
	{
		number: 6,
		title: 'Recommendations',
		shortTitle: 'Plan',
		section: 'recommendations'
	},
	{
		number: 7,
		title: 'Provider Sign-off',
		shortTitle: 'Sign-off',
		section: 'providerSignOff'
	}
];
