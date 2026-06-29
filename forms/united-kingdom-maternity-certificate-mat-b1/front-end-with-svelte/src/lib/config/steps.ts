import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 4;

export const steps: StepConfig[] = [
	{
		number: 1,
		title: 'Patient Identification',
		shortTitle: 'Patient',
		section: 'patientIdentification'
	},
	{
		number: 2,
		title: 'Pre-Confinement Certificate (Part A)',
		shortTitle: 'Part A',
		section: 'preConfinement'
	},
	{
		number: 3,
		title: 'Post-Confinement Certificate (Part B)',
		shortTitle: 'Part B',
		section: 'postConfinement'
	},
	{
		number: 4,
		title: 'Issuer Validation',
		shortTitle: 'Issuer',
		section: 'issuer'
	}
];
