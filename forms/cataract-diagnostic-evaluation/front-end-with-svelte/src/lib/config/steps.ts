import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 15;

/** The fifteen evaluation sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Clinician Identification', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Presenting Complaint & Visual Symptoms', shortTitle: 'Symptoms' },
	{ number: 4, title: 'Ocular & Medical History', shortTitle: 'History' },
	{ number: 5, title: 'Visual Acuity', shortTitle: 'Acuity' },
	{ number: 6, title: 'Refraction', shortTitle: 'Refraction' },
	{ number: 7, title: 'Slit-lamp Examination', shortTitle: 'Slit-lamp' },
	{ number: 8, title: 'Glare Testing', shortTitle: 'Glare' },
	{ number: 9, title: 'Tonometry', shortTitle: 'Tonometry' },
	{ number: 10, title: 'Dilated Fundus Examination', shortTitle: 'Fundus' },
	{ number: 11, title: 'Differential / Competing-pathology Screen', shortTitle: 'Differential' },
	{ number: 12, title: 'Biometry', shortTitle: 'Biometry' },
	{ number: 13, title: 'Functional & Quality-of-life Impact', shortTitle: 'Functional' },
	{ number: 14, title: 'Management Plan', shortTitle: 'Management' },
	{ number: 15, title: 'Summary & Sign-off', shortTitle: 'Summary' }
];
