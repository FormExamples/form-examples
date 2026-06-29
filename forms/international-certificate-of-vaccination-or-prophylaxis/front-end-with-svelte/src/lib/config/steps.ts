/** A single wizard step in the certificate form. */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const steps: StepConfig[] = [
	{ number: 1, title: 'Centre & clinician', shortTitle: 'Centre' },
	{ number: 2, title: 'Vaccinee identity', shortTitle: 'Identity' },
	{ number: 3, title: 'Vaccinee signature & consent', shortTitle: 'Consent' },
	{ number: 4, title: 'Travel context', shortTitle: 'Travel' },
	{ number: 5, title: 'Vaccination entry — disease & vaccine', shortTitle: 'Vaccine' },
	{ number: 6, title: 'Vaccination entry — administration', shortTitle: 'Admin' },
	{ number: 7, title: 'Vaccination entry — validity & stamp', shortTitle: 'Validity' },
	{ number: 8, title: 'Summary & sign-off', shortTitle: 'Summary' }
];

export const TOTAL_STEPS = steps.length;
