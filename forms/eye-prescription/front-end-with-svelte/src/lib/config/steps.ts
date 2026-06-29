/** Wizard step metadata for the eye-prescription form (11 sections). */
export interface StepConfig {
	number: number;
	title: string;
	shortTitle: string;
}

export const TOTAL_STEPS = 11;

export const steps: StepConfig[] = [
	{ number: 1, title: 'Prescriber identification', shortTitle: 'Prescriber' },
	{ number: 2, title: 'Patient identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Examination details', shortTitle: 'Examination' },
	{ number: 4, title: 'Visual acuity', shortTitle: 'Acuity' },
	{ number: 5, title: 'Right eye refraction (OD)', shortTitle: 'Right eye' },
	{ number: 6, title: 'Left eye refraction (OS)', shortTitle: 'Left eye' },
	{ number: 7, title: 'Addition for near', shortTitle: 'Addition' },
	{ number: 8, title: 'Pupillary distance', shortTitle: 'PD' },
	{ number: 9, title: 'Lens recommendation', shortTitle: 'Lens' },
	{ number: 10, title: 'Ocular health findings', shortTitle: 'Ocular health' },
	{ number: 11, title: 'Summary & sign-off', shortTitle: 'Summary' }
];
