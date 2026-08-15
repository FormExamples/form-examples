import type { StepConfig } from '$lib/engine/types';

export const TOTAL_STEPS = 14;

/** The fourteen wizard sections (one continuous single-page wizard). */
export const steps: StepConfig[] = [
	{ number: 1, title: 'Clinician Identification', shortTitle: 'Clinician' },
	{ number: 2, title: 'Patient Identification', shortTitle: 'Patient' },
	{ number: 3, title: 'Presenting Complaint and History', shortTitle: 'History' },
	{ number: 4, title: 'Risk Factors', shortTitle: 'Risk factors' },
	{ number: 5, title: 'Visual Inspection', shortTitle: 'Inspection' },
	{ number: 6, title: 'Palpation and Cough Impulse', shortTitle: 'Palpation' },
	{ number: 7, title: 'Reducibility Assessment', shortTitle: 'Reducibility' },
	{ number: 8, title: 'Red-flag / Emergency Symptom Screen', shortTitle: 'Red flags' },
	{ number: 9, title: 'Clinical Classification', shortTitle: 'Classification' },
	{ number: 10, title: 'Imaging', shortTitle: 'Imaging' },
	{ number: 11, title: 'Differential Diagnosis Considered', shortTitle: 'Differential' },
	{ number: 12, title: 'Functional Impact', shortTitle: 'Function' },
	{ number: 13, title: 'Management Plan', shortTitle: 'Management' },
	{ number: 14, title: 'Summary and Sign-off', shortTitle: 'Summary' }
];
